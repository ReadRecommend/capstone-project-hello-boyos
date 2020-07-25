import React, { Component } from "react";
import { Button, Form, Container } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchResults from "../components/SearchResults.js";

class Discover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: "Top Rated"
        };
    }

    updateFilter = (event) => {
    // When calling handleSubmit asynchronously the event will
    // be nullified otherwise
    event.persist();
    this.setState({ mode: event.target.value }, () => {
        this.handleSubmit(event); // Call asynchronously
        });
    };

    handleSubmit = (event) => {
        // IMPLEMENT LATER
    }

    render() {
        return (
            <div className="Search">
                <Container>
                    <h1> Discover </h1>
                    <br></br>
                    <Form method="POST" onSubmit={this.handleSubmit}>
                        <InputGroup>
                            <Form.Control
                                as="select"
                                defaultValue={"Top Rated"}
                                onChange={this.updateFilter}
                            >
                                <option>Top Rated</option>
                                <option>People You Follow</option>
                                <option>Recently Read</option>
                            </Form.Control>
                            <Button
                                variant="primary"
                                type="submit"
                                block
                                value="Search"
                            >
                                Recommend
                            </Button>
                        </InputGroup>
                    </Form>
                    {/*<SearchResults books={this.state.currentSearchList}></SearchResults>*/}
                </Container>
            </div>
        );
    }
}

export default Discover;