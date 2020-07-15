import React, { Component } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Link} from 'react-router-dom';

import { getAllBooks, deleteBook } from '../../fetchFunctions';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

class AdminRemoveBook extends Component {
    constructor(props) {
        super(props);

        this.getDeleteFormatter = this.getDeleteFormatter.bind(this);
        this.state = {
            loading: true,
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
                this.setState({ books: json, loading: false });
            })
            .catch((error) => {
                // An error occurred
                const errorMessage = JSON.parse(error.message).message;
                console.log(errorMessage);
            });

    }

    // Function that returns the button that will be displayed in the final dummy column of the table 
    getDeleteFormatter(cell, row) {
        return (<Button onClick={this.handleDeleteBook.bind(this, row.isbn)}>DELETE</Button>)
    }

    // Function that returns href for the title
    // TODO
    getTitleFormatter(cell, row) {
        return (<Link to="/book">{cell}</Link>)
    }

    getColumns() {
        // Define the columns for our table
        const columns = [{
            dataField: "isbn",
            text: "ISBN"
        }, {
            dataField: "title",
            text: "Title",
            formatter: this.getTitleFormatter,
            sort: true
        }, {
            dataField: "n_ratings",
            text: "Number of ratings",
            sort: true
        }, {
            dataField: "delete",
            text: "",
            isDummyField: true,
            formatter: this.getDeleteFormatter,
            style: { textAlign: "center" }
        }]

        return columns;
    }

    // Function that deletes the book from the database, and the state
    handleDeleteBook(isbn) {
        console.log(isbn);

        this.setState({loading: true});

        deleteBook(isbn)
            .then((res) => {

                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                this.setState({ books: json, loading: false });
            })
            .catch((error) => {
                // An error occurred
                const errorMessage = error.message;
                console.log(errorMessage);
            })

    }

    render() {
        if (this.state.loading) {
            // Still performing the fetch
            return(<Spinner
                animation="border"
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                }}
            />);
        } else {
            return (
                <Container>
                    <h1>Remove books</h1>
                    <BootstrapTable
                        data={this.state.books}
                        keyField="isbn"
                        columns={this.getColumns()}
                        pagination={paginationFactory({alwaysShowAllBtns: true})}
                        bootstrap4 />
                </Container>
            );
        }
    }

}

export default AdminRemoveBook;