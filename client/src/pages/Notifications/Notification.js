import React, { Component, Fragment } from 'react';
import { getProfilePicture } from '../../functions/GetProfilePicture';
import { ListItem, ListItemAvatar, Avatar, Divider } from '@material-ui/core'
import { Link } from 'react-router-dom';

export default class Notification extends Component {
    state = {

    }

    componentDidMount = async () => {
        const profilePicture = await getProfilePicture(this.props.notification.notificationSenderId)
        if (profilePicture) {
            this.setState({ profilePicture });
        }
    }

    render() {
        const { type, notificationSenderUsername,notificationSenderName, parentPost } = this.props.notification;
        if (type === "accepted friend") {
            return (
                <Fragment>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Link to={`/user/${notificationSenderUsername}`}>
                                <Avatar alt={notificationSenderName} src={this.state.profilePicture} />
                            </Link>
                        </ListItemAvatar>
                        <p style={{ color: "#3F3A3A" }}>{`${notificationSenderName} has accepted your friend request`}</p>
                    </ListItem>
                    <Divider variant="middle" component="li" />
                </Fragment>
            )
        }
        return (
            <Fragment>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Link to={`/user/${notificationSenderUsername}`}>
                            <Avatar alt={notificationSenderName} src={this.state.profilePicture} />
                        </Link>
                    </ListItemAvatar>
                    <Link to={`/post/${parentPost}`}>
                        <p style={{ color: "#3F3A3A" }}>{`${notificationSenderName} has ${type} your post`}</p>
                    </Link>
                </ListItem>
                <Divider variant="middle" component="li" />
            </Fragment>
        )
    }
}
