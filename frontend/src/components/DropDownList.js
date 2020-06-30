import React, { Component } from "react";
import DropDownItem from "./DropDownItem";
import PropTypes from "prop-types";

export default class DropDownList extends Component {
  render() {
    return this.props.Books.map((book) => (
      <DropDownItem book={book} addToCollection={this.props.addToCollection} />
    ));
  }
}

DropDownList.propTypes = {
  Books: PropTypes.array.isRequired,
  addToCollection: PropTypes.func.isRequired,
};
