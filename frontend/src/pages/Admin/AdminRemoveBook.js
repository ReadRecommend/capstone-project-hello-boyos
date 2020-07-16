import React, { Component } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';

import { getAllBooks, deleteBook } from '../../fetchFunctions';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const { SearchBar, ClearSearchButton } = Search;

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
                const errorMessage = error.message;
                console.log(errorMessage);
            });

    }

    // Function that returns the button that will be displayed in the final dummy column of the table 
    getDeleteFormatter(cell, row) {
        return (<Button onClick={this.handleDeleteBook.bind(this, row.id)}>DELETE</Button>)
    }

    // Function that returns href for the title
    getTitleFormatter(cell, row) {
        return (<Link to={"/book/" + row.id}>{cell}</Link>)
    }

    getColumns() {
        // Define the columns for our table
        const columns = [{
            dataField: "id",
            text: "ID",
            style: { wordWrap: "break-word" }
        }, {
            dataField: "title",
            text: "Title",
            formatter: this.getTitleFormatter,
            sort: true,
            style: { wordWrap: "break-word" }
        }, {
            dataField: "n_ratings",
            text: "Number of ratings",
            sort: true
        }, {
            dataField: "ave_rating",
            text: "Average rating",
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
    handleDeleteBook(id) {
        console.log(id);

        this.setState({ loading: true });

        deleteBook(id)
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
            return (<Spinner
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
                    {/* Links to other admin functions */}
                    <Link to="/admin/addBook">Add New Book</Link>

                    <h1>Remove books</h1>
                    <br></br>
                    {/* This is for react bootstrap table 2 */}
                    <ToolkitProvider
                        data={this.state.books}
                        keyField="id"
                        columns={this.getColumns()}
                        bootstrap4
                        search >
                        {
                            props => (
                                <div>
                                    <h3>Search in any of the columns</h3>
                                    <SearchBar {...props.searchProps} />
                                    <ClearSearchButton {...props.searchProps} />
                                    <BootstrapTable
                                        {...props.baseProps}
                                        pagination={paginationFactory({ alwaysShowAllBtns: true })} />
                                </div>
                            )
                        }
                    </ToolkitProvider>
                </Container>
            );
        }
    }

}

export default AdminRemoveBook;