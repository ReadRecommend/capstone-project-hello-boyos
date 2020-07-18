import React, { Component } from 'react';
import { Alert, Button, Form, Container } from 'react-bootstrap';
import { addBook } from '../../fetchFunctions';
import { WithContext as ReactTags } from 'react-tag-input';
import { Link } from 'react-router-dom';
import Datetime from 'react-datetime';
import './AdminAddBook.css';
import '../YearPicker.css';

class AdminAddBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isbn: "",
            title: "",
            authors: [],
            genres: [],
            publisher: "",
            publicationDate: -1,
            summary: "",
            cover: "",
            language: "",
            errorShow: false,
            errorMessage: "",
        };
    }

    onSubmit = (e) => {
        e.preventDefault();

        // Transform authors tags into array
        const originalAuthors = this.state.authors;
        let authorsList = [];
        for (const authorObject of originalAuthors) {
            authorsList.push(authorObject.text);
        }

        // Transform genres tags into array
        const originalGenres = this.state.genres;
        let genresList = [];
        for (const genreObject of originalGenres) {
            genresList.push(genreObject.text);
        }

        // Prepare the info for the fetch
        let bookData = {};
        bookData.isbn = this.state.isbn;
        bookData.title = this.state.title;
        bookData.authors = authorsList;
        bookData.genres = genresList;
        bookData.publisher = this.state.publisher;
        bookData.publicationDate = this.state.publicationDate;
        bookData.summary = this.state.summary;
        bookData.cover = this.state.cover;
        bookData.language = this.state.language;

        addBook(bookData)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json()
            })
            .then((json) => {
                // Redirect to new book page
                return this.props.history.push(`/book/${json.id}`);
            })
            .catch((error) => {
                // An error occurred
                const errorMessage = error.message;
                this.setState({ errorShow: true, errorMessage: errorMessage });
            });
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onAuthorAdd = (author) => {
        this.setState({ authors: [...this.state.authors, author] });
    };

    onAuthorDelete = (i) => {
        this.setState({
            authors: this.state.authors.filter((author, index) => index !== i),
        });
    };

    onGenreAdd = (genre) => {
        this.setState({ genres: [...this.state.genres, genre] });
    };

    onGenreDelete = (i) => {
        this.setState({
            genres: this.state.genres.filter((genre, index) => index !== i),
        });
    };

    // Function that makes the error not show
    handleError() {
        this.setState({ errorShow: false, errorMessage: "" });
    }

    render() {
        return (
            <Container>
                {/* Alert for general problems */}
                <Alert
                    show={this.state.errorShow}
                    onClose={() => this.handleError()}
                    variant="danger"
                    dismissible
                >
                    {this.state.errorMessage}
                </Alert>

                {/* Links to other admin functions */}
                <Link to="/admin/bookList">Remove Books</Link>

                <h1>Add a book</h1>
                <Form method="POST" onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control
                            type="text"
                            name="isbn"
                            value={this.state.isbn}
                            onChange={this.onChange}
                            placeholder="ISBN"
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>TITLE</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.onChange}
                            placeholder="Title"
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>AUTHOR/S</Form.Label>
                        <ReactTags
                            tags={this.state.authors}
                            handleAddition={this.onAuthorAdd}
                            handleDelete={this.onAuthorDelete}
                            allowDragDrop={false}
                            autofocus={false}
                            placeholder={"Add new Author"}
                            inputFieldPosition="top"
                            classNames={{
                                tagInputField: "form-control",
                            }}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>GENRE/S</Form.Label>
                        <ReactTags
                            tags={this.state.genres}
                            handleAddition={this.onGenreAdd}
                            handleDelete={this.onGenreDelete}
                            allowDragDrop={false}
                            autofocus={false}
                            placeholder={"Add new Genre"}
                            inputFieldPosition="top"
                            classNames={{
                                tagInputField: "form-control",
                            }}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>PUBLISHER</Form.Label>
                        <Form.Control
                            type="text"
                            name="publisher"
                            value={this.state.publisher}
                            onChange={this.onChange}
                            placeholder="Publisher"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>PUBLICATION DATE</Form.Label>
                        <Datetime
                            dateFormat="YYYY"
                            isValidDate={(current) => {
                                return current.isBefore(Datetime.moment());
                            }}
                            onChange={(date) => {
                                this.setState({
                                    publicationDate: date.format("YYYY"),
                                });
                            }}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>SUMMARY</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="summary"
                            value={this.state.summary}
                            onChange={this.onChange}
                            cols="100"
                            rows="10"
                            placeholder="Summary"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>COVER</Form.Label>
                        <Form.Control
                            type="url"
                            name="cover"
                            value={this.state.cover}
                            onChange={this.onChange}
                            placeholder="http(s)//..."
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>LANGUAGE</Form.Label>
                        <Form.Control
                            type="text"
                            name="language"
                            value={this.state.language}
                            onChange={this.onChange}
                            placeholder="Language"
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        block
                        value="Submit"
                    >
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default AdminAddBook;