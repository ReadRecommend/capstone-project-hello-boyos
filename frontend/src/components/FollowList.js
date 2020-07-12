import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup, ListGroupItem } from "react-bootstrap";

class FollowList extends Component {
    render() {
        const follower = this.props.user;
        const follows = this.props.user.follows;
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

FollowList.propTypes = {
    user: PropTypes.object.isRequired,
};

export default FollowList;
