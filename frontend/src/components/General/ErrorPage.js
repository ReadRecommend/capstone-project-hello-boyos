import React, { Component } from "react";
import { Jumbotron, Button, Container, Row, Col } from "react-bootstrap";
import { File } from "react-kawaii";
class ErrorPage extends Component {
    render() {
        const errorCode = this.props.errorCode;
        const errorMessage = this.props.errorMessage;
        return (
            <Container>
                <Jumbotron>
                    <Row>
                        <Col md="auto">
                            <File size={300} mood="sad" color="#83D1FB" />
                        </Col>
                        <Col>
                            <h1>{errorCode}: Uh oh, something went wrong!</h1>
                            <p>{errorMessage}</p>
                            <p>
                                <Button variant="primary" href="/">
                                    Take me home
                                </Button>
                            </p>
                        </Col>
                    </Row>
                </Jumbotron>
            </Container>
        );
    }
}

export default ErrorPage;
