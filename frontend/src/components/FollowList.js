import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";

class FollowList extends Component {
    render() {
        const follower = this.props.user;
        const follows = this.props.user.follows;
        if (follows.length === 0) {
            return (
                <>
                    <h3
                        style={{
                            textAlign: "center",
                            color: "grey",
                        }}
                    >
                        Not following anyone...
                    </h3>
                    <br></br>
                    <center>
                        <Button href="/usrsearch">Find users to follow</Button>
                    </center>
                </>
            );
        } else {
            return (
                <div
                    style={{
                        maxHeight: "512px",
                        overflowY: "scroll",
                    }}
                >
                    <ListGroup variant="flush">
                        {follows.map((user) => (
                            <ListGroupItem action key={user.id}>
                                <a href={`user/${user.id}`}>{user.username}</a>
                                {/* Use a span rather than button as buttons cannot be nested */}
                                <span
                                    className="float-right btn-danger btn btn-sm"
                                    onClick={() => {
                                        this.props.handleUnfollow(
                                            follower.username,
                                            user.username
                                        );
                                    }}
                                >
                                    Unfollow
                                </span>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            );
        }
    }
}

FollowList.propTypes = {
    user: PropTypes.object.isRequired,
};

export default FollowList;
