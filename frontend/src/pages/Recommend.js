import React, { Component } from "react";
import { Button, Form, Container } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchResults from "../components/SearchResults.js";

class Recommend extends Component {
  constructor(props) {
    super(props);

    this.updateMode = this.updateMode.bind(this);

    this.state = {
      search: "",
      mode: "default",
    };
  }

  updateSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  updateMode = (event) => {
    // When calling handleSubmit asynchronously the event will
    // be nullified otherwise
    event.persist();
    this.setState({ mode: event.target.value }, () => {
      //this.handleSubmit(event); // Call asynchronously
    });
  };

  render() {
    return (
      <div className="Recommend">
        <Container>
          <h1> Recommend Page </h1>
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
                onChange={this.updateMode}
              >
                <option>Mode 1</option>
                <option>Mode 2</option>
                <option>Mode 3</option>
              </Form.Control>
              <Button variant="primary" type="submit" block value="Search">
                Search
              </Button>
            </InputGroup>
          </Form>
          <br></br>
          {/*<SearchResults books={this.state.currentSearchList}></SearchResults>*/}
        </Container>
      </div>
    );
  }
}

export default Recommend;
