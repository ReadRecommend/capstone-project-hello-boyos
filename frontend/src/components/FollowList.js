import React, { Component, alert } from "react";
import PropTypes from "prop-types";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";

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
                        <ListGroupItem action>
                            <a href={`user/${user.id}`}>{user.username}</a>
                            <Button
                                variant="danger"
                                className="float-right"
                                size="sm"
                                onClick={() => {
                                    this.props.handleUnfollow(
                                        follower.username,
                                        user.username
                                    );
                                }}
                            >
                                Unfollow
                            </Button>
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
