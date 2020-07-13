import React, { Component } from 'react'
import { Button, Form, Container } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import SearchResults from '../components/SearchResults.js'

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            filter: "",
            currentSearchList: [],
        };
    }

    componentDidMount() {
        // Get all the books in the database
        fetch("http://localhost:5000/book")
            .then((res) => {
                return res.json();
            })
            .then((books) => {
                this.setState({
                    currentSearchList: books,
                });
            });
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value });
    };

    updateFilter = (event) => {
        this.setState({ filter: event.target.value });
    };

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
    };

    render() {
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
                                required
                            />

                            <Form.Control
                                as="select"
                                onChange={this.updateFilter}
                            >
                                <option> Test01 </option>
                                <option> Test02 </option>
                                <option> Test03 </option>
                            </Form.Control>

                            {/*
                            <DropdownButton
                                as={InputGroup.Append}
                                variant="outline-secondary"
                                title="Filter"
                                value={this.state.filter}
                                onChange={this.updateFilter}
                            >
                                <Dropdown.Item href="#">No Filter</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#">&ge; 5 Stars</Dropdown.Item>
                                <Dropdown.Item href="#">&ge; 5 Stars</Dropdown.Item>
                                <Dropdown.Item href="#">&ge; 4 Stars</Dropdown.Item>
                                <Dropdown.Item href="#">&ge; 3 Stars</Dropdown.Item>
                                <Dropdown.Item href="#">&ge; 2 Stars</Dropdown.Item>
                                <Dropdown.Item href="#">&ge; 1 Star</Dropdown.Item>
                            </DropdownButton>
                            */}

                            <Button
                                variant="primary"
                                type="submit"
                                block
                                value="Search"
                            >
                                Search
                            </Button>
                        </InputGroup>
                    </Form>
                </Container>
                <SearchResults books={this.state.currentSearchList}> </SearchResults>
            </div>
        );
    }
}

export default Search;