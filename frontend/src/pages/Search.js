import React, { Component } from "react";
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Dropdown,
    DropdownButton,
    Spinner,
} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import SearchResults from "../components/SearchResults.js";
import Pagination from "react-bootstrap/Pagination";

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
        const data = {
            search: this.state.search,
            filter: this.state.filter,
        };
        fetch("http://localhost:5000/search", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
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
                    {!this.state.loadingResults && (
                        <Button
                            variant="primary"
                            type="submit"
                            block
                            value="Search"
                        >
                            Search
                        </Button>
                    )}
                </InputGroup>
            </Form>
        );
    };

    //TODO: Page reloads before booksPerPage is updated
    render() {
        const { currentPage } = this.state;
        return (
            <div className="Search">
                <Container>
                    <h1> Search Page </h1>
                    {this.getSearchBar()}
                    <br></br>
                    {this.state.loadingResults ? (
                        <Spinner
                            animation="border"
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                            }}
                        />
                    ) : (
                        <SearchResults
                            books={this.state.currentDisplayList}
                            loadingResults={this.state.loadingResults}
                        ></SearchResults>
                    )}
                    <br></br>
                    <Container>
                        <Row>
                            <Col>
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
                            </Col>
                            <Col className="float-right">
                                <DropdownButton
                                    id="per-page-dropdown"
                                    title="Books Per Page"
                                    style={{ float: "right" }}
                                >
                                    {this.getBooksPerPageDropdown()}
                                </DropdownButton>
                            </Col>
                        </Row>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default Search;
