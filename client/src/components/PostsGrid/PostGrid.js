import React, { Component, Fragment } from 'react';
import { CircularProgress, Grid, IconButton, } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import ViewStreamIcon from '@material-ui/icons/ViewStream';
import axios from 'axios';

import PostGridPost from '../PostGridPost/PostGridPost'
import './PostGrid.css'



export default class PostGrid extends Component {
    state = {
        loaded: false,
        posts: [],
        style: "grid"
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        if (this.props.owner === "true") {
            axios.post('/api/posts/getPostGrid', { owner: true }, config)
                .then((res) => {
                    this.setState({ posts: res.data, loaded: true })
                })
        } else {
            axios.post('/api/posts/getPostGrid', { owner: false, user: this.props.owner }, config)
                .then((res) => {
                    this.setState({ posts: res.data, loaded: true });
                })
        }
    }
    render() {
        if (!this.state.loaded) {
            return (
                <CircularProgress style={{ position: "relative", marginLeft: "45%", marginTop: "90%" }} />
            )
        }
        if (this.props.owner === "true") {
            var gridPosts = this.state.posts.map((post) => {
                if (!post.isTemp) {
                    return (
                        <Fragment>
                            <PostGridPost key={post.id} id={post.id} style="list" />
                            <br />
                            <br />
                        </Fragment>
                    )
                }
            })
            if (this.state.posts.length > 0) {
                return (
                    <div>
                        <Grid container spacing={0} id="postGrid">
                            {gridPosts}
                        </Grid>
                    </div>
                )
            } else {
                return (<h4 id="postGrid" style={{ textAlign: "center" }}>Looks empty here <br /> Start your journey today!</h4>)
            }
        }
        else {
            gridPosts = this.state.posts.map((post) => {
                if (!post.isTemp) {
                    return (
                        <Fragment>
                            <PostGridPost key={post.id} id={post.id} style={this.state.style} />
                            <br />
                        </Fragment>
                    )
                }
            })
            if (this.state.posts.length > 0) {
                return (
                    <Fragment>
                        <Grid container spacing={0} id="postGridFriend">
                            {gridPosts}
                        </Grid>
                    </Fragment>
                )
            } else {
                return (<h4 id="postGridFriend" style={{ textAlign: "center" }}>Looks empty here <br /></h4>)
            }
        }
    }
}
