import React, { Component } from 'react';
import { Button, Form, Container } from "react-bootstrap";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ""
        };
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            search: this.state.search,
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
                        <Form.Control
                            type="text"
                            placeholder="Search book"
                            value={this.state.search}
                            onChange={this.updateSearch}
                            required
                        />
                        <Button
                            variant="primary"
                            type="submit"
                            block
                            value="Search"
                        >
                            Search
                        </Button>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default Search;