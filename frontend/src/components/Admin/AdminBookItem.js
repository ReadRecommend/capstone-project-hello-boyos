import React, { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import PropTypes from "prop-types";

class AdminBookItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListGroup.Item>
                {this.props.book.title}
                <Button>DELETE</Button>
            </ListGroup.Item>
        )
    }

}

AdminBookItem.propTypes = {
    book: PropTypes.object.isRequired,
    deleteBook: PropTypes.func.isRequired
};

export default AdminBookItem;