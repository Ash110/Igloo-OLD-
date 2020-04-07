import React, { Fragment } from 'react';
import axios from 'axios';

import {  Button } from 'react-bootstrap'
import FriendRequest from '../FriendRequest/FriendRequest'
import './FriendRequestsGroup.css'



class FriendRequestGroup extends React.Component {
    state = {
        requests: [],
        count: 3
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/friends/remainingRequests',{}, config)
            .then((res) => {
                let requests = [...res.data.requests];
                if (requests.length > 3) {
                    this.setState({
                        requests,
                        count: 3
                    });
                } else {
                    this.setState({
                        requests,
                        count: requests.length
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    render() {
        let friendRequests = []
        let i;
        for (i = 0; i < this.state.count; i++) {
            if (this.state.requests[i] !== undefined) {
                friendRequests[i] = this.state.requests[i];
            }
        }
        if (friendRequests.length > 0) {
            var friendRequestsRender =
                friendRequests.map((request, index) => {
                    const userURL = "/user/" + request.username;
                    return (
                        <FriendRequest link={userURL} request={request} key={index} />
                    )
                });
        }
        else {
            friendRequestsRender = (<Fragment>No new friend requests</Fragment>)
        }
        
        const showMore = () => {
            this.setState({
                count: this.state.requests.length
            });
        }
        const showLess = () => {
            this.setState({ count: 3 })
        }
        if ((this.state.requests.length > 3) && (this.state.requests.length !== this.state.count)) {
            var showMoreButton = (<Button variant="link" id="showMoreRequests" onClick={showMore}>Show More</Button>)
        } else if ((this.state.requests.length > 3) && (this.state.requests.length === this.state.count)) {
            showMoreButton = (<Button variant="link" id="showMoreRequests" onClick={showLess}>Show Less</Button>)
        } else {
            showMoreButton = ""
        }
        return (
            <Fragment>
                <br/>
                <h5 id="showMoreRequests">Follow Requests</h5>
                <div id="friendsListGroup">
                    {friendRequestsRender}
                </div>
                <br />
                {showMoreButton}
            </Fragment >
        );
    }
};

export default FriendRequestGroup;