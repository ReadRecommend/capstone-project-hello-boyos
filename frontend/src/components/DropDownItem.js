import React, { Component } from "react";
import { Dropdown, DropdownButton, MenuItem } from "react-bootstrap";
import PropTypes from "prop-types";

export default class DropDownItem extends Component {
  render() {
    const { isbn, name } = this.props.book;
    if (this !== null && typeof this !== "undefined") {
      return <Dropdown.Item key={isbn}>{name}</Dropdown.Item>;
    }
  }
}

DropDownItem.propTypes = {
  book: PropTypes.object.isRequired,
  addToCollection: PropTypes.func.isRequired,
};
