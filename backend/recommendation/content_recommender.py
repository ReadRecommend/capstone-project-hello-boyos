import os
import pickle
import re

import pandas as pd
from nltk.tokenize import RegexpTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.model.schema import Book


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

    def train(self, ngram_range=(1, 2)):
        """Train the TFIDFVectorizer over all content from all books in the database

        Args:
            ngram_range (Tuple[int, int], optional): Which n_grams the vectorizer considers. See the sklearn
                documentation for more information
                https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html#sklearn-feature-extraction-text-tfidfvectorizer.
                Defaults to (1, 2).
        """
        books = Book.query.all()

        # If there are no books in the database, return
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
            stop_words="english", ngram_range=ngram_range, strip_accents="unicode"
        ).fit(book_df["content"])

        # Persist the TFIDFVectorizer and the dataframe of books locally
        os.makedirs(f"{self._save_path}/", exist_ok=True)
        with open(f"{self._save_path}/tfidf.pkl", "wb") as f:
            pickle.dump(self._tfidf, f)
        book_df.to_parquet(f"{self._save_path}/book_df.parquet")

    def recommend(self, book, n_recommend=20):
        """Get a list of the most similar books to a provided book

        Similarity is defined as the cosine similarity across the TFIDF vector of the content

        Args:
            book (Book): The "seed" book that we are looking for recommendations from
            n_recommend (int, optional): The number of books to recommend. Note: As books from other languages
            are excluded after this limit is enforced, the actual length of the returned list may
            be less than `n_recommend`. Defaults to 20.

        Returns:
            List[Book]: A list of the most similar books to the provided book
        """
        book_content = self.get_clean_content(book)

        book_tfidf_words = self._tfidf.transform(pd.Series(book_content))
        all_tfidf_words = self._tfidf.transform(self._book_df["content"])

        similarities = cosine_similarity(book_tfidf_words, all_tfidf_words)[0]
        # Find the indices of the most similar books (1: n_recommend + 1 is to exclude the source book)
        top_indices = (-similarities).argsort()[1 : n_recommend + 1]
        top_similarities = similarities[top_indices]
        top_ids = self._book_df.loc[top_indices, "id"].values

        recommended_books = Book.query.filter(
            Book.id.in_(top_ids), Book.language == book.language
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
        return ContentRecommender.clean_data(content)

    @staticmethod
    def clean_data(text):
        """Uniformly clean up a piece of text

        Args:
            text (str): The string to clean

        Returns:
            str: The clean string
        """
        text = ContentRecommender._remove_html(text)
        text = ContentRecommender._remove_punctuation(text)
        text = text.lower()
        return text

    @staticmethod
    def _remove_punctuation(text):
        """Removes any punctuation from a string

        Args:
            text (str): The text to remove punctuation from

        Returns:
            str: the cleaned string
        """
        tokenizer = RegexpTokenizer(r"\w+")
        text = tokenizer.tokenize(text)
        text = " ".join(text)
        return text

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
