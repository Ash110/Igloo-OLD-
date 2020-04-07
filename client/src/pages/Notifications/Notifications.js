import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Bottom from '../../components/Bottom/Bottom';
import List from '@material-ui/core/List';
import Header from '../../components/Header/Header';
import Notification from './Notification';
import FriendRequests from '../../components/FriendRequestsGroup/FriendRequestsGroup';



export default class Notifications extends Component {
    state = {
        notifications: [],
    }

    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/notifications/getNotifications', {}, config)
            .then((res) => {
                this.setState({ notifications: res.data });
            })
            .catch((err) => {
                alert("There has been an error. Please try after a while");
                console.log(err);
            })
    }

    render() {
        return (
            <Fragment>
                <Header />
                <FriendRequests />
                <List>

                    {
                        this.state.notifications.map((notification) => {
                            return (<Notification notification={notification} key={notification._id} />)
                        })
                    }
                </List>
                <Bottom />
            </Fragment>
        )
    }
}
