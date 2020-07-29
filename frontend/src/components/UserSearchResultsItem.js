import React, { Component } from "react";
import { Card } from "react-bootstrap";

class UserSearchResultsItem extends Component {
    // Can move this to a class in css later
    getStyle = () => {
        return {
            background: "#f4f4f4",
            textAlign: "center",
            padding: "10px",
            borderBottom: "1px #ccc dotted",
        };
    };

    render() {
        const user = this.props.user;
        if (user.roles.includes("user")) {
            return (
                <div style={{ margin: "auto" }}>
                    <Card style={{ width: "300px" }}>
                        <a href={`/user/${user.id}`}>
                            <Card.Body>
                                <Card.Text>
                                    <span href={`/user/${user.id}`}>
                                        {user.username}
                                    </span>
                                </Card.Text>
                                <br></br>
                            </Card.Body>
                        </a>
                    </Card>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

export default UserSearchResultsItem;
