import React, { Component } from 'react'
import { getProfilePicture } from '../../functions/GetProfilePicture';
import { ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@material-ui/core';

export default class FriendListItem extends Component {
    state = {
        image: "",
        loaded: false
    }
    componentDidMount = async () => {
        const image = await getProfilePicture(this.props.person._id)
        if (image) {
            this.setState({ image, loaded: true });
        }
    }
    render() {
        if (!this.state.loaded) {
            return <CircularProgress />
        }
        const { name, username} = this.props.person;
        return (
            <ListItem alignItems="flex-start" onClick={() => { window.open(`/user/${username}`, '_blank'); }}>
                <ListItemAvatar>
                    <Avatar alt={name} src={this.state.image} />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={username}
                />
            </ListItem>
        )
    }
}
