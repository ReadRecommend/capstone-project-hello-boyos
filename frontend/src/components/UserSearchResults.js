import React, { Component } from "react";
import { CardDeck } from "react-bootstrap";

import UserSearchResultsItem from "../components/UserSearchResultsItem.js";

class UserSearchResults extends Component {
    render() {
        return (
            <div>
                <CardDeck>
                    {this.props.users.map((user) => (
                        <UserSearchResultsItem key={user.id} user={user} />
                    ))}
                </CardDeck>
            </div>
        );
    }
}

export default UserSearchResults;
