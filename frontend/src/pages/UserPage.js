import React, { Component } from 'react';
import { getUserById } from '../fetchFunctions';
import CollectionList from '../components/CollectionList/CollectionList';
import Collection from '../components/Collection';

class UserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            userPageInfo: {},
            collectionList: [],
            currentCollection: {}
        }
    }

    componentDidMount() {
        // Fetch the user's page based on the url
        getUserById(this.props.match.params.userId)
            .then((res) => {

                if (!res.ok) {
                    // Something went wrong, likely there is no user with the id specified in the url
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // Found a valid user
                return res.json();
            })
            .then((json) => {
                console.log(json);
                this.setState({ userPageInfo: json, loading: false, collectionList: json.collections });

                // Select the initial collection
                this.selectCollection(this.state.collectionList[0]["id"]);

            })
            .catch((error) => {
                this.setState({ userPageInfo: null, loading: false })
            });
    }

    /*
    The selectCollection function takes the id of a collection and 
    changes the state of the page and refreshes it so that the 
    selected collection can then be displayed.
    */
    selectCollection = (id) => {
        fetch(`http://localhost:5000/collection/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            });
    };

    render() {
        if (this.state.loading) {
            // Still performing the fetch
            return (<h1>LOADING USER PAGE...</h1>);
        }
        if (this.state.userPageInfo) {
            // Found a valid user
            return (
                <div>
                    <h1>Page for {this.state.userPageInfo.username}</h1>
                    <h4>Collections</h4>
                    <div className="collection_list">
                        <CollectionList
                            collectionList={this.state.userPageInfo.collections}
                            selectCollection={this.selectCollection}
                            editable={false}
                        />
                    </div>
                    <Collection
                        key={this.state.currentCollection.id}
                        currentCollection={this.state.currentCollection}
                        userCollections={this.state.collectionList}
                        editable={false}
                    />
                </div>
            );
        } else {
            // Didn't find a valid user
            return (<h1>404 User not found</h1>);
        }
    }
}


export default UserPage;