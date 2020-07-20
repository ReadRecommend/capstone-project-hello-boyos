import React, { Component } from "react";
import { Button, Form, Container, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import SearchResults from "../components/SearchResults.js";
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'
import DropdownItem from "react-bootstrap/DropdownItem";

class Search extends Component {
    constructor(props) {
        super(props);

        this.updateFilter = this.updateFilter.bind(this);

        this.state = {
            search: "",
            filter: "No Filter",
            currentSearchList: [],
            currentDisplayList:[],
            currentPage : 1,
            booksPerPage: 9,
            numberOfPages: 1,
            pages:[],

        };
    }

    componentDidMount() {
        // Get all the books in the database
        const {booksPerPage} = this.state
        fetch("http://localhost:5000/book")
            .then((res) => {
                return res.json();
            })
            .then((books) => {
                this.setState({
                    currentSearchList: books,
                    numberOfPages: Math.ceil(Object.keys(books).length/booksPerPage)
                });
            });
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value });
    };

    updateFilter = (event) => {
        // When calling handleSubmit asynchronously the event will
        // be nullified otherwise
        event.persist();
        this.setState({ filter: event.target.value }, () => {
            this.handleSubmit(event); // Call asynchronously
        });
    };

    changePage = (newPage) => {
        const {booksPerPage, currentSearchList, numberOfPages} = this.state
        if (newPage > 0 && newPage <= numberOfPages){
            this.setState({
                currentDisplayList: currentSearchList.slice((newPage-1)*booksPerPage,newPage*booksPerPage),
                currentPage: newPage
            })
            this.refreshPageList(newPage)
        }
    }

    refreshPageList = (activePage) => {
        let list = []
        for( let i = activePage-2; i <= this.state.numberOfPages &&  i <= activePage + 2; i++) {
            if(i < 1) {
                continue;
            }
            list.push(
                <Pagination.Item key={i} active={i === activePage} onClick={() => this.changePage(i)}>{i}</Pagination.Item>
            )
        }
        this.setState({pages:list})
    }

    changeBooksPerPage = (newLimit) => {
        this.setState({booksPerPage:newLimit})
        return newLimit;
    }

    handleSubmit = (event) => {
        event.preventDefault();
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
                this.setState({
                    currentSearchList: books,
                    numberOfPages: Math.ceil(Object.keys(books).length/this.state.booksPerPage)
                });
                this.changePage(1)
            });
    };
    // TODO: Change page occurs before changeBooksPerPage, find a way to make this happen syncronously so that the page refreshes when the limit is changed
    render() {
        const {currentPage} = this.state
        return (
            <div className="Search">
                <Container>
                    <h1> Search Page </h1>
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
                            <Button variant="primary" type="submit" block value="Search">
                                Search
                            </Button>
                        </InputGroup>
                    </Form>
                    <br></br>
                    <SearchResults books={this.state.currentDisplayList}></SearchResults>
                    <br></br>
                    <Container>
                        <Row>
                            <Col>
                                <Pagination>
                                    <Pagination.Prev onClick={() => this.changePage(currentPage - 1)}/>
                                    {this.state.pages}
                                    <Pagination.Next onClick={() => this.changePage(currentPage + 1)}/>
                                </Pagination>
                            </Col>
                            <Col className="float-right">
                                <DropdownButton id="per-page-dropdown" title="Books Per Page" style={{float: 'right'}}>
                                    <Dropdown.Item id="12" onClick={(e) => {this.changeBooksPerPage(e.target.id); this.changePage(1);}}>12</Dropdown.Item>
                                    <Dropdown.Item id="24" onClick={(e) => {this.changeBooksPerPage(e.target.id); this.changePage(1);}}>24</Dropdown.Item>
                                    <Dropdown.Item id="48" onClick={(e) => {this.changeBooksPerPage(e.target.id); this.changePage(1);}}>48</Dropdown.Item>
                                    <Dropdown.Item id="96" onClick={(e) => {this.changeBooksPerPage(e.target.id); this.changePage(1);}}>96</Dropdown.Item>
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
