import React, { Component } from 'react';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isbn: '',
            title: '',
            publisher: '',
            publicationDate: -1,
            summary: '',
            cover: '',
            language: ''
        }
    }

    onSubmit = (e) => {

        e.preventDefault();
        alert("Imagine we submitted!");

    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    render() {
        // TODO 
        // add required tags
        // error check
        return (
            <form>
                <h1>Add a book</h1>
                <h2>ISBN</h2>
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                //value={this.state.isbn}
                //onChange={this.onChange}
                />
                <h2>TITLE</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                //value={this.state.title}
                //onChange={this.onChange}
                />
                <h2>PUBLISHER</h2>
                <input
                    type="text"
                    name="publisher"
                    placeholder="Publisher"
                //value={this.state.publisher}
                //onChange={this.onChange}
                />
                <h2>PUBLICATION DATE (FORMAT: TODO)</h2>
                <input
                    type="number"
                    name="publicationDate"
                    placeholder="Publication Date"
                //value={this.state.publicationDate}
                //onChange={this.onChange}
                />
                <h2>SUMMARY</h2>
                <textarea
                    name="summary"
                    cols="100"
                    rows="10"
                    placeholder="Summary"
                ></textarea>
                <h2>COVER</h2>
                <input
                    type="url"
                    name="cover"
                    placeholder="http(s)//..."
                />
                <h2>LANGUAGE</h2>
                <input
                    type="text"
                    name="language"
                    placeholder="language"
                />
                <br></br>
                <br></br>
                <input
                    type="submit"
                    value="Submit"
                />
            </form >
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