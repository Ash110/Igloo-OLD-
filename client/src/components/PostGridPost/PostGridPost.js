import React, { Component, Fragment } from 'react';
import { getPostImage } from '../../functions/GetPostImage';
import { CircularProgress, Grid } from '@material-ui/core';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import Img from 'react-image'
// import Moment from 'react-moment';
import './PostGridPost.css'


export default class PostGridPost extends Component {
    state = {
        loaded: false,
        imageUrl: "",
        valid: true
    }
    componentDidMount = async () => {
        // const imageUrl = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, await getPostImage(this.props.id)));
        getPostImage(this.props.id)
            .then((res) => {
                const imageUrl = "data:image/png;base64," + Buffer.from(res, 'binary').toString('base64')
                if (imageUrl) {
                    this.setState({ imageUrl, loaded: true, time: new Date(this.props.time) });
                }
            })
            .catch((err) => {
                this.setState({ valid: false, loaded: true })
            })
    }
    render() {
        if (!this.state.loaded) {
            return (
                <Fragment>
                    <Grid item xs={1} sm={2} md={3} lg={3}></Grid>
                    <Grid item xs={10} sm={8} md={6} lg={6}>
                        <Link to={`/post/${this.props.id}`}>
                            <CircularProgress style={{ position: "relative", marginLeft: "45%", }} />
                        </Link>
                    </Grid>
                    <Grid item xs={1} sm={2} md={3} lg={3}></Grid>
                </Fragment>
            )
        }
        if (!this.state.valid) {
            return (<Fragment></Fragment>)
        }
        // this.props.style === "grid" ? size = 4 : size = 12;
        return (
            <Fragment>
                <Link to={`/post/${this.props.id}`}>
                    <Img src={this.state.imageUrl} alt="A user post" id="postGridImage" />
                </Link>
            </Fragment>
        )
    }
}
