import React, { Component } from "react";
import {
    Button,
    Form,
    Container,
    Dropdown,
    DropdownButton,
    Spinner,
} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import SearchResults from "../components/SearchResults.js";
import Pagination from "react-bootstrap/Pagination";
import { toast, ToastContainer } from "react-toastify";

import { bookSearch } from "../fetchFunctions";

class Search extends Component {
    constructor(props) {
        super(props);

        this.updateFilter = this.updateFilter.bind(this);

        this.state = {
            search: "",
            filter: "No Filter",
            currentSearchList: [],
            currentDisplayList: [],
            currentPage: 1,
            booksPerPage: 9,
            numberOfPages: 1,
            pages: [],
            loadingResults: false,
        };
    }

    componentDidMount() {
        // Get all the books in the database
        const { location } = this.props;
        if (location.state && location.state.navSearch.length > 0) {
            this.setState(
                { search: location.state.navSearch },
                this.handleSubmit.bind(this)
            );
        }
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value });
    };

    updateFilter = (event) => {
        this.setState({ filter: event.target.value }, () => {
            this.handleSubmit(event); // Call asynchronously
        });
    };

    changePage = (newPage) => {
        const { booksPerPage, currentSearchList, numberOfPages } = this.state;
        if (numberOfPages === 0) {
            this.setState({
                currentPage: 0,
                currentDisplayList: [],
            });
            return;
        }
        if (newPage > 0 && newPage <= numberOfPages) {
            this.setState(
                {
                    currentDisplayList: currentSearchList.slice(
                        (newPage - 1) * booksPerPage,
                        newPage * booksPerPage
                    ),
                    currentPage: newPage,
                },
                this.refreshPageList.bind(this, newPage)
            );
        }
    };

    refreshPageList = (activePage) => {
        let list = [];

        for (
            let i = activePage - 2;
            i <= this.state.numberOfPages && i <= activePage + 2;
            i++
        ) {
            if (i >= 1) {
                list.push(
                    <Pagination.Item
                        key={i}
                        active={i === activePage}
                        onClick={() => this.changePage(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            }
        }
        this.setState({ pages: list });
    };

    changeBooksPerPage = (newLimit) => {
        const { currentSearchList } = this.state;
        this.setState(
            {
                booksPerPage: newLimit,
                numberOfPages: Math.ceil(
                    Object.keys(currentSearchList).length / newLimit
                ),
            },
            this.changePage.bind(this, 1)
        );
    };

    getBooksPerPageDropdown = () => {
        let DropdownItems = [];
        for (let i = 12; i < 100; i *= 2) {
            DropdownItems.push(
                <Dropdown.Item
                    key={i}
                    id={i}
                    onClick={(e) => {
                        this.changeBooksPerPage(e.target.id);
                    }}
                >
                    {i}
                </Dropdown.Item>
            );
        }
        return DropdownItems;
    };

    handleSubmit = (event) => {
        if (event) event.persist();
        this.setState(
            { loadingResults: true },
            this.handleSearch.bind(this, event)
        );
    };

    handleSearch = (event) => {
        if (event) event.preventDefault();

        bookSearch(this.state.search, this.state.filter)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }
                return res.json();
            })
            .then((books) => {
                this.setState(
                    {
                        currentSearchList: books,
                        numberOfPages: Math.ceil(
                            Object.keys(books).length / this.state.booksPerPage
                        ),
                        loadingResults: false,
                    },
                    this.changePage.bind(this, 1)
                );
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    getSearchBar = () => {
        return (
            <Form method="POST" onSubmit={this.handleSubmit}>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search book"
                        value={this.state.search}
                        onChange={this.updateSearch}
                    />

                    <Form.Control
                        as="select"
                        defaultValue={"No Filter"}
                        onChange={this.updateFilter}
                    >
                        <option>No Filter</option>
                        <option>&ge; 4 Stars</option>
                        <option>&ge; 3 Stars</option>
                        <option>&ge; 2 Stars</option>
                        <option>&ge; 1 Stars</option>
                    </Form.Control>
                </InputGroup>
                <br></br>
                {!this.state.loadingResults && (
                    <div>
                        <Button variant="primary" type="submit" value="Search">
                            Search
                        </Button>
                        <DropdownButton
                            id="per-page-dropdown"
                            title="Books Per Page"
                            style={{ float: "right" }}
                        >
                            {this.getBooksPerPageDropdown()}
                        </DropdownButton>
                    </div>
                )}
            </Form>
        );
    };

    //TODO: Page reloads before booksPerPage is updated
    render() {
        const { currentPage } = this.state;
        return (
            <div className="Search">
                <ToastContainer autoClose={4000} pauseOnHover closeOnClick />

                <Container>
                    <h1> Search Page </h1>
                    {this.getSearchBar()}
                    <br></br>
                    <small>
                        {" "}
                        Page {this.state.currentPage} of{" "}
                        {this.state.numberOfPages} out of{" "}
                        {this.state.currentSearchList.length} results
                    </small>
                    {this.state.loadingResults ? (
                        <Spinner
                            animation="border"
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                            }}
                        />
                    ) : this.state.currentDisplayList.length === 0 ? (
                        <h3 style={{ textAlign: "center", color: "grey" }}>
                            {" "}
                            There are currently no results to display.{" "}
                        </h3>
                    ) : (
                        <SearchResults
                            books={this.state.currentDisplayList}
                            loadingResults={this.state.loadingResults}
                        ></SearchResults>
                    )}
                    <br></br>
                    <Container>
                        <div class="pagination justify-content-center">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() =>
                                        this.changePage(currentPage - 1)
                                    }
                                />
                                {!(this.state.numberOfPages === 0) &&
                                    this.state.pages}
                                <Pagination.Next
                                    onClick={() =>
                                        this.changePage(currentPage + 1)
                                    }
                                />
                            </Pagination>
                        </div>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default Search;
