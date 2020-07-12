import React, { Component } from 'react';
import { Button, Form, Container } from "react-bootstrap";
import { addBook } from '../fetchFunctions';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isbn: '',
            title: '',
            authors: '',
            genres: '',
            publisher: '',
            publicationDate: -1,
            summary: '',
            cover: '',
            language: ''
        }
    }

    onSubmit = (e) => {

        e.preventDefault();
        const bookData = this.state;
        console.log(bookData);

        addBook(bookData)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // Redirect to new book page
                return this.props.history.push(`/book/${bookData.isbn}`);
            })
            .catch((error) => {
                // An error occurred
                alert(error.message)
            });


    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onAuthorChange(changedAuthors) {
        this.setState({ authors: changedAuthors });
    }

    onGenreChange(changedGenres) {
        this.setState({ genres: changedGenres });
    }

    render() {
        return (
            <Container>
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
                        <Form.Control
                            type="text"
                            name="authors"
                            placeholder="Authors"
                            value={this.state.authors}
                            onChange={this.onChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>GENRE/S</Form.Label>
                        <Form.Control
                            type="text"
                            name="genres"
                            placeholder="Genres"
                            value={this.state.genres}
                            onChange={this.onChange}
                            required
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
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>PUBLICATION DATE (FORMAT: TODO)</Form.Label>
                        <Form.Control
                            type="number"
                            name="publicationDate"
                            value={this.state.publicationDate}
                            onChange={this.onChange}
                            placeholder="Publication Date"
                            required
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
                            required
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
                            required
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
                            required
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
                </Form >
            </Container>
        );
    }
}

/*
isbn=book_data.get("isbn")
title=book_data.get("title"),
publisher=book_data.get("publisher"),
publication_date=book_data.get("publication_year"),
summary=book_data.get("description"),
cover=book_data.get("image_url"),
n_ratings=book_data.get("n_reviews"),
ave_rating=book_data.get("rating"),
language=book_data.get("language"),
*/


export default Admin;