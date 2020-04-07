import React, { Component } from 'react'
import { getProfilePicture } from '../../functions/GetProfilePicture';
import { ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@material-ui/core';

export default class FriendListItem extends Component {
    state = {
        loaded: true
    }
    render() {
        if (!this.state.loaded) {
            return <CircularProgress />
        }
        const { name, username} = this.props.page;
        return (
            <ListItem alignItems="flex-start" onClick={() => { window.open(`/page/${username}`, '_blank'); }}>
                <ListItemAvatar>
                    <Avatar>{name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={`@${username}`}
                />
            </ListItem>
        )
    }
}
