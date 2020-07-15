import React, { Component } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import AdminBookList from '../../components/Admin/AdminBookList';

class AdminRemoveBook extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <h1>Remove books</h1>
                <ListGroup>
                    <AdminBookList />
                </ListGroup>
            </Container>
        )
    }

}

export default AdminRemoveBook;