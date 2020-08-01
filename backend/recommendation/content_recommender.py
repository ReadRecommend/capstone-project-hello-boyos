import os
import pickle
import re

import pandas as pd
from nltk.tokenize import RegexpTokenizer
from nltk import PorterStemmer
import nltk.corpus as corpus
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.model.schema import Book
from backend.recommendation import RETRAIN_THRESHOLD


class ContentRecommender:
    """Provides content based recommendations of books

    The ContentRecommender uses TFIDF over the title, summary, genres, and publisher.
    The cosine similarity is then used to determine the books with the most similar
    content to the initial seed book.
    """

    def __init__(
        self,
        save_path="backend/recommendation/static",
        ngram_range=(1, 2),
        force_retrain=False,
    ):
        """Initialise a ContentRecommender and train it if necessary

        By default, a new ContentRecommender will load the dataframe of books and the trained
        TFIDFVectorizer from `save_path`. If the persisted objects are not available the model will retrain.
        Once RETRAIN_THRESHOLD new books have been added to the system, the ContentRecommender will
        automatically retrain

        Args:
            save_path (str): Where the persisted book content and TFIDFVectorizer are saved.
                Defaults to "backend/recommendation/static".
            ngram_range (Tuple[int, int], optional): Which n_grams the vectorizer considers. See the sklearn
                documentation for more information
                https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html#sklearn-feature-extraction-text-tfidfvectorizer.
                Defaults to (1, 2).
            force_retrain (optional): If true the model is retrained regardless
                of if a persisted object already exists. Defaults to False.
        """
        self._save_path = save_path

        if force_retrain:
            self.train(ngram_range)
        else:
            try:
                self._book_df = pd.read_parquet(f"{self._save_path}/book_df.parquet")
                with open(f"{self._save_path}/tfidf.pkl", "rb") as f:
                    self._tfidf = pickle.load(f)
            except FileNotFoundError:
                self.train(ngram_range=ngram_range)

        if Book.query.count() - self._book_df.shape[0] > RETRAIN_THRESHOLD:
            self.train(ngram_range=ngram_range)

    def train(self, ngram_range=(1, 2)):
        """Train the TFIDFVectorizer over all content from all books in the database

        Args:
            ngram_range (Tuple[int, int], optional): Which n_grams the vectorizer considers. See the sklearn
                documentation for more information
                https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html#sklearn-feature-extraction-text-tfidfvectorizer.
                Defaults to (1, 2).
        """
        books = Book.query.all()

        # If there are no books in the database, return without training
        if not books:
            return

        # Generate a dataframe of all books in the database, holding their id and content
        book_df = pd.DataFrame()
        for book in books:
            book_dict = {}
            book_dict["content"] = self.get_clean_content(book)
            book_dict["id"] = book.id
            book_df = book_df.append(book_dict, ignore_index=True)

        self._book_df = book_df

        self._tfidf = TfidfVectorizer(
            ngram_range=ngram_range, strip_accents="unicode",
        ).fit(book_df["content"])

        # Persist the TFIDFVectorizer and the dataframe of books locally
        os.makedirs(f"{self._save_path}/", exist_ok=True)
        with open(f"{self._save_path}/tfidf.pkl", "wb") as f:
            pickle.dump(self._tfidf, f)
        book_df.to_parquet(f"{self._save_path}/book_df.parquet")

    def recommend(self, seed, n_recommend=20):
        """Get a list of the most similar books to a provided book, or list of books

        Similarity is defined as the cosine similarity across the TFIDF vector of the content

        Args:
            seed (Union[Book, List[Book]): The "seed" book or books that we are looking for recommendations from
            n_recommend (int, optional): The number of books to recommend. Note: As books from other languages
            are excluded after this limit is enforced, the actual length of the returned list may
            be less than `n_recommend`. Defaults to 20.

        Returns:
            List[Book]: A list of the most similar books to the provided book

        Raises:
            ValueError: If seed is not a book or list of books
        """
        if isinstance(seed, Book):
            book_content = self.get_clean_content(seed)
            n_seed = 1
            seed_language = seed.language
        elif isinstance(seed, list) and all(isinstance(book, Book) for book in seed):
            book_content = " ".join([self.get_clean_content(book) for book in seed])
            n_seed = len(seed)
            # Get most frequent language from seed books
            seed_languages = [book.language for book in seed]
            seed_language = max(set(seed_languages), key=seed_languages.count,)
        else:
            raise ValueError("seed should be a Book or list of Books")
        book_tfidf_words = self._tfidf.transform(pd.Series(book_content))
        all_tfidf_words = self._tfidf.transform(self._book_df["content"])

        similarities = cosine_similarity(book_tfidf_words, all_tfidf_words)[0]
        # Find the indices of the most similar books (n_seed: n_recommend + n_seed
        # is to exclude the seed book/s)
        top_indices = (-similarities).argsort()[n_seed : n_recommend + n_seed]
        top_similarities = similarities[top_indices]
        top_ids = self._book_df.loc[top_indices, "id"].values

        recommended_books = Book.query.filter(
            Book.id.in_(top_ids), Book.language == seed_language
        ).all()

        # weight similarity score by the books rating to order the recommendations
        weights = {
            book.title: top_similarities[i] * (book.ave_rating / 5)
            for i, book in enumerate(recommended_books)
        }
        recommendations = sorted(
            recommended_books, key=lambda book: weights[book.title], reverse=True
        )
        return recommendations

    @staticmethod
    def get_clean_content(book):
        """Aggregate a books fields into one string, then clean that string

        Fields aggregated are: Title, summary, genres, authors
        Args:
            book (Book): The Book who's content to aggregate and clean

        Returns:
            str: The clean content string
        """
        title = book.title
        summary = book.summary or ""
        genres = " ".join([genre.name for genre in book.genres])
        authors = " ".join([author.name for author in book.authors])

        content = " ".join([title, summary, genres, authors])
        return ContentRecommender.clean_data(content, book.language)

    @staticmethod
    def clean_data(text, language):
        """Uniformly clean up a piece of text

        Args:
            text (str): The string to clean
            language (str): The language of the text

        Returns:
            str: The clean string
        """
        text = ContentRecommender._remove_html(text)
        text = text.lower()
        words = ContentRecommender._tokenize(text)
        words = ContentRecommender._remove_stopwords(words, language)
        words = ContentRecommender._stem(words)
        return " ".join(words)

    @staticmethod
    def _remove_html(text):
        """Remove any html tags from the string

        Args:
            text (str): The string to remove html tags from

        Returns:
            str: The cleaned string
        """
        html_pattern = re.compile("<.*?>")
        return html_pattern.sub(r"", text)

    @staticmethod
    def _tokenize(text):
        """Removes any punctuation from a string and tokenize

        Args:
            text (str): The text to remove punctuation from

        Returns:
            List[str]: The tokenized string
        """
        tokenizer = RegexpTokenizer(r"\w+")
        words = tokenizer.tokenize(text)
        return words

    @staticmethod
    def _remove_stopwords(words, language):
        """Removes any stopwords from a list of stopwords

        Args:
            words (str): The list of words to remove stopwords from
            langauge (str): The language of the words

        Returns:
            List[str]: The words with stopwords removed
        """
        if not isinstance(language, str):
            return words
        try:
            stopwords = corpus.stopwords.words(language.lower())
        except OSError:
            return words
        words = [word for word in words if word not in stopwords]
        return words

    @staticmethod
    def _stem(words):
        """Stem all words in list of strings

        Args:
            text (List[str]): The list of words to stem

        Returns:
            List[str]: The list of stemmed words
        """
        stemmer = PorterStemmer()
        words = [stemmer.stem(word) for word in words]
        return words

