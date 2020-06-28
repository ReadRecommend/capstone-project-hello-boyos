import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class AddCollection extends Component {
    state = {
        name: ''
    }

    onSubmit = (e) => {

        e.preventDefault();
        const status = this.props.addCollection(this.state.name);

        if (status === false) {
            alert(1);
        }


        this.setState({ name: '' });

    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            <form onSubmit={this.onSubmit} >
                <input
                    type="text"
                    name="name"
                    placeholder="Collection Name"
                    value={this.state.name}
                    onChange={this.onChange}
                />
                <input
                    type="submit"
                    value="Submit"
                />
            </form>
        )
    }
}

// PropTypes
AddCollection.propTypes = {
    addCollection: PropTypes.func.isRequired
}

export default AddCollection;