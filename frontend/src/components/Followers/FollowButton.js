import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { unfollowUser, followUser } from "../../fetchFunctions";
import "react-toastify/dist/ReactToastify.css";

class FollowButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            following: false,
        };
    }

    componentDidMount() {
        if (this.props.currentUser) {
            if (
                this.props.user.followers.find(
                    (o) => o.id === this.props.currentUser.id
                )
            ) {
                this.setState({ following: true });
            }
        }
    }

    handleUnfollow = (followerUsername, userUsername) => {
        unfollowUser(followerUsername, userUsername).then((user) => {
            if (user) {
                this.setState({ following: false, currentUser: user });
            }
        });
        this.props.notify(`Successfully unfollowed ${userUsername}`, "success");
    };

    handleFollow = (followerUsername, userUsername) => {
        followUser(followerUsername, userUsername).then((user) => {
            if (user) {
                this.setState({ following: true, currentUser: user });
            }
        });
        this.props.notify(`Successfully followed ${userUsername}`, "success");
    };

    render() {
        const { user, currentUser } = this.props;
        const { following } = this.state;
        if (!this.props.currentUser) {
            return null;
        }
        return (
            <>
                {!following && currentUser && (
                    <p>
                        <Button
                            block
                            variant="info"
                            onClick={() => {
                                this.handleFollow(
                                    currentUser.username,
                                    user.username
                                );
                            }}
                        >
                            Follow
                        </Button>
                    </p>
                )}
                {following && (
                    <p>
                        <Button
                            block
                            variant="info"
                            onClick={() => {
                                this.handleUnfollow(
                                    currentUser.username,
                                    user.username
                                );
                            }}
                        >
                            Unfollow
                        </Button>
                    </p>
                )}
            </>
        );
    }
}

export default FollowButton;

FollowButton.propTypes = {
    user: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};
