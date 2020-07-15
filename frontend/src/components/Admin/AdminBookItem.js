import React, { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import PropTypes from "prop-types";

class AdminBookItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.book.title}</td>
                <td>{this.props.book.n_ratings}</td>
                <td><Button>DELETE</Button></td>
            </tr>
        )
    }

}

AdminBookItem.propTypes = {
    book: PropTypes.object.isRequired,
    deleteBook: PropTypes.func.isRequired
};

export default AdminBookItem;