import React, { Component } from "react";
//import { CardDeck } from "react-bootstrap";

import SearchResultsItem from '../components/SearchResultsItem.js'

class SearchResults extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        return (
			//<h1> SearchResults </h1>
			//<CardDeck>
			<div>
                {this.props.books.map((book) => (
                    <SearchResultsItem
                        title={book.title}
                    />
                ))}
            </div>
            //</CardDeck>
    	)
    }
}

export default SearchResults;