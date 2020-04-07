import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { LinearProgress, Grid, Avatar, IconButton, TextField, Dialog, DialogTitle } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SendIcon from '@material-ui/icons/Send';
import { getProfilePicture } from '../../functions/GetProfilePicture';
import ViewLikes from '../../components/ViewLikes/ViewLikes'
import './Comment.css'




class Comment extends Component {
    state = {
        loaded: false,
        commenterName: "",
        time: new Date(),
        like: 0,
        authorProfile: "",
        comment: "",
        liked: false,
        replies: [],
        addReplyToggle: true,
        addReplyText: "",
        commentId: "",
        showReplies: false,
        showLikes: false
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/comments/getComment', { commentId: this.props.id }, config)
            .then(async (res) => {
                const authorProfile = await getProfilePicture(res.data.comment.author._id);
                const commenterName = res.data.comment.author.name;
                const commenterUsername = res.data.comment.author.username;
                const comment = res.data.comment.commentText;
                const commentId = res.data.comment._id;
                const time = res.data.comment.publishTime;
                const replies = [...res.data.comment.replies];
                const liked = res.data.liked;
                const numberOfLikes = res.data.numberOfLikes
                this.setState({ commenterName, authorProfile, commenterUsername, commentId, comment, replies, loaded: true, time, liked, numberOfLikes });
            })
            .catch((err) => {
                alert("There has been an error. Please try after a while");
                console.log(err)
            })
    }
    likeComment = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/comments/likeComment', { commentId: this.props.id }, config)
            .then((res) => {
                this.setState({ liked: true });
            })
            .catch((err) => {
                alert("Error liking Comment. Try again");
            });
    }
    unlikeComment = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/comments/unlikeComment', { commentId: this.props.id }, config)
            .then((res) => {
                this.setState({ liked: false });
            })
            .catch((err) => {
                alert("Error unliking post. Try again");
            });
    }
    submitReply = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const reply = this.state.addReplyText;
        if (reply) {
            axios.post('/api/comments/postCommentReply', { commentId: this.state.commentId, reply: this.state.addReplyText }, config)
                .then((res) => {
                    let replies = this.state.replies;
                    replies.unshift(res.data)
                    this.setState({ addReplyText: "", addReplyToggle: true, replies });
                })
                .catch((err) => {
                    console.log(err);
                    alert("There has been an error. Please try after a while");
                })
        } else {
            alert("Cannot reply with nothing. That's rude.")
        }
    }
    handleClose = () => {
        this.setState({ showLikes: false })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <div>
                    <LinearProgress style={{ position: "relative", marginTop: "20px" }} />
                </div>
            )
        }
        if (this.props.theme === "light") {
            var replyContainer = "replyContainerLight"
        } else {
            replyContainer = "replyContainerDark"
        }

        if (this.props.reply === "true") {
            return (
                <div id="replyContainerLight">
                    <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                        <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                        <ViewLikes type="comment" id={this.props.id} />
                    </Dialog>
                    <Grid container spacing={0}>
                        <Grid item xs={1}>
                            <Avatar alt={this.state.author} src={this.state.authorProfile} style={{ height: "25px", width: "25px" }} />
                        </Grid>
                        <Grid item xs={10}>
                            <p id="commenterName" onClick={() => window.open(`https://igloosocial.com/user/${this.state.commenterUsername}`)}>{this.state.commenterName}</p>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={8}>
                            <p id="commentText">
                                {this.state.comment}
                            </p>
                        </Grid>
                        {this.props.loggedIn ?
                            <Grid item xs>
                                {this.state.liked ?
                                    <IconButton style={{ outlineStyle: "none", color: "red", transform: "scale(0.8)" }} onClick={this.unlikeComment}>
                                        <FavoriteIcon className="animated heartBeat" />
                                    </IconButton>
                                    :
                                    <IconButton style={{ outlineStyle: "none", transform: "scale(0.8)" }} onClick={this.likeComment}>
                                        <FavoriteIcon />
                                    </IconButton>}
                            </Grid>
                            : <Fragment></Fragment>}
                        {this.props.loggedIn ?
                            <Fragment>
                                {this.state.numberOfLikes > 0 ?
                                    <Grid item xs={3}>
                                        <p id="replyText" onClick={() => this.setState({ showLikes: true })}>
                                            {this.state.numberOfLikes}
                                            {
                                                this.state.numberOfLikes === 1 ?
                                                    " Like"
                                                    :
                                                    " Likes"
                                            }
                                        </p>
                                    </Grid>
                                    :
                                    <Fragment></Fragment>
                                }
                            </Fragment>
                            : <Fragment></Fragment>}
                    </Grid>
                </div>
            )
        }
        if (this.state.showReplies && this.state.replies.length > 0) {
            var commentReplies = this.state.replies.map((reply) => {
                return (<Comment id={reply} reply="true" key={reply} />)
            })
        } else if (!this.state.showReplies && this.state.replies.length > 0) {
            commentReplies = (
                <p id="showRepliesText" onClick={() => this.setState({ showReplies: true })}>
                    Show replies
                </p>
            )
        }
        else {
            commentReplies = (<Fragment></Fragment>)
        }

        return (
            <div id="commentContainer">
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                    <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                    <ViewLikes type="comment" id={this.props.id} />
                </Dialog>
                <Grid container spacing={0}>
                    <Grid item xs={1}>
                        <Avatar alt={this.state.author} src={this.state.authorProfile} style={{ height: "25px", width: "25px" }} />
                    </Grid>
                    <Grid item xs={10}>
                        <p id="commenterName" onClick={() => window.open(`https://igloosocial.com/user/${this.state.commenterUsername}`)}>{this.state.commenterName}</p>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={9}>
                        <p id="commentText">
                            {this.state.comment}
                        </p>
                    </Grid>
                    {this.props.loggedIn ?
                        <Grid item xs>
                            {this.state.liked ?
                                <IconButton style={{ outlineStyle: "none", color: "red", transform: "scale(0.8)" }} onClick={this.unlikeComment}>
                                    <FavoriteIcon className="animated heartBeat" />
                                </IconButton>
                                :
                                <IconButton style={{ outlineStyle: "none", transform: "scale(0.8)" }} onClick={this.likeComment}>
                                    <FavoriteIcon />
                                </IconButton>}
                        </Grid>
                        : <Fragment></Fragment>}
                </Grid>
                {this.props.loggedIn ?
                    <Grid container spacing={0}>
                        <Grid item xs={1}>
                        </Grid>

                        {this.state.addReplyToggle ?
                            <Fragment>
                                {this.state.numberOfLikes > 0 ?
                                    <Grid item xs={3}>
                                        <p id="replyText" onClick={() => this.setState({ showLikes: true })}>
                                            {this.state.numberOfLikes}
                                            {
                                                this.state.numberOfLikes === 1 ?
                                                    " Like"
                                                    :
                                                    " Likes"
                                            }
                                        </p>
                                    </Grid>
                                    :
                                    <Fragment></Fragment>
                                }
                                <Grid item xs={8}>
                                    <p id="replyText" onClick={() => this.setState({ addReplyToggle: false })}>
                                        Reply
                        </p>

                                </Grid>
                            </Fragment>
                            :
                            <Fragment>
                                <Grid item xs={9}>
                                    <TextField
                                        id="standard-basic"
                                        label="Enter your reply"
                                        onChange={(e) => this.setState({ addReplyText: e.target.value })}
                                        value={this.state.addReplyText}
                                        style={{ width: "100%", marginTop: "-10px" }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <SendIcon onClick={this.submitReply} id="commentReplyArrow" />
                                </Grid>
                            </Fragment>
                        }
                    </Grid>
                    : <Fragment></Fragment>}
                {commentReplies}
                {this.state.showReplies ?
                    <p id="showRepliesText" onClick={() => this.setState({ showReplies: false })}>
                        Hide replies
                    </p>
                    :
                    <Fragment></Fragment>
                }
            </div>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.auth.theme,
    loggedIn: state.auth.loggedIn,
})
export default connect(mapStateToProps, null)(Comment);