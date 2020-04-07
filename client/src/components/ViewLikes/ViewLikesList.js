import React, { Component } from 'react'
import {ListItem, ListItemAvatar, ListItemText, CircularProgress, Avatar} from '@material-ui/core'
import {getProfilePicture} from '../../functions/GetProfilePicture'

export default class ViewLikesList extends Component {
    state = {
        loaded : false,
        name : "",
        image : "",
        username : ""
    }
    componentDidMount =async () => {
        const image = await getProfilePicture(this.props.like._id);
        const {name, username} = this.props.like
        this.setState({loaded : true, name, username, image })
    }
    render() {
        if (!this.state.loaded) {
            return(<CircularProgress style={{ position: "relative", marginLeft: "45%" }} />)
        }
        const {name, image,username} = this.state;
        return (
            <ListItem alignItems="flex-start" onClick={() => window.location.href=`/user/${username}`}>
                <ListItemAvatar>
                    <Avatar alt={name} src={image} />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={username}
                />
            </ListItem>
        )
    }
}
