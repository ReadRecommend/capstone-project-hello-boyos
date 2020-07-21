import React, { Component } from "react";
import { Button, Form, Container } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import SearchResults from "../components/SearchResults.js";

class Discover extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Search">
        <Container>
          <h1> Discover </h1>
          <br></br>
          {/*<SearchResults books={this.state.currentSearchList}></SearchResults>*/}
        </Container>
      </div>
    );
  }
}

export default Discover;
