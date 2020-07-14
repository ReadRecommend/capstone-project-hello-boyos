import React, { Component } from "react";
import PropTypes from "prop-types";
import { InputGroup, FormControl, Form, Button } from "react-bootstrap";
export class AddCollection extends Component {
    state = {
        name: "",
    };

    onSubmit = (e) => {
        e.preventDefault();
        const status = this.props.addCollection(this.state.name);

        if (status === false) {
            alert(1);
        }

        this.setState({ name: "" });
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Collection Name"
                        name="name"
                        // value={this.state.name}
                        onChange={this.onChange}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-primary" type="submit">
                            Submit
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        );
    }
}

// PropTypes
AddCollection.propTypes = {
    addCollection: PropTypes.func.isRequired,
};

export default AddCollection;
