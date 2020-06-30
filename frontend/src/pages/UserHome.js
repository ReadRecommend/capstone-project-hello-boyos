import React, { Component } from "react";

class UserHome extends Component {

    render() {
        return (
            <div className="UserHome">
                <h1>Welcome {this.props.username} </h1>
                {/*<Collection currentCollection={this.state.currentCollection} />*/}
            </div>
        );
    }
}


export default UserHome;