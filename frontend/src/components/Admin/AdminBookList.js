import React, { Component } from 'react';
import { getAllBooks } from '../../fetchFunctions';
import AdminBookItem from './AdminBookItem';

class AdminBookList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            books: []
        }
    }

    componentDidMount() {

        // Get all the books in the db
        getAllBooks()
            .then((res) => {

                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {

                //Sort the books by n_ratings
                json.sort((a, b) => (b.n_ratings - a.n_ratings));

                this.setState({ books: json });

            })
            .catch((error) => {
                // An error occurred
                const errorMessage = JSON.parse(error.message).message;
                console.log(errorMessage);
            });

    }



    render() {
        return (
            this.state.books.map((book) => (
                <AdminBookItem
                    key={book.isbn}
                    book={book}
                />
            ))
        )
    }

}

export default AdminBookList;