import React, { Component, Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { getProfilePicture } from '../../functions/GetProfilePicture';
import './Search.css';

export default class SearchListComponent extends Component {
    state = {

    }
    componentDidMount = async () => {
        const image = await getProfilePicture(this.props.result._id);
        if (image && !this.state.image) {
            this.setState({ image });
        }
    }
    render() {
        const result = this.props.result;
        return (
            <Fragment>
                <Link to={`/user/${this.props.result.username}`}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={result.name} src={this.state.image} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={result.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                    >
                                        @{result.username}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </Link>
            </Fragment>
        )
    }
}
