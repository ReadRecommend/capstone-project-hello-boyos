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

                this.setState({ books: json })

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