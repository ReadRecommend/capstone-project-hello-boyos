import React, { Component } from "react";
import { CardDeck } from "react-bootstrap";

import SearchResultsItem from '../components/SearchResultsItem.js'

class SearchResults extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        return (
        	<div>
				<CardDeck>
	                {this.props.books.map((book) => (
	                    <SearchResultsItem
	                    	key={book.isbn}
	                        book={book}
	                    />
	                ))}
	            </CardDeck>
	        </div>
    	)
    }
}

export default SearchResults;