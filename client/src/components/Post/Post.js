import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Grid, Card, CardHeader, Avatar, IconButton, CardContent, Slide, Dialog, DialogTitle, DialogContent, DialogContentText
    , Typography, CardActions, Collapse, CircularProgress, Divider, TextField, Button, List, ListItem, ListItemIcon, ListItemText
} from '@material-ui/core';
import Img from 'react-image';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import SendIcon from '@material-ui/icons/Send';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TwitterIcon from '@material-ui/icons/Twitter';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import LaunchIcon from '@material-ui/icons/Launch';
import EmailIcon from '@material-ui/icons/Email';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import ReportIcon from '@material-ui/icons/Report';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios';
import Comment from '../Comment/Comment';
import ViewLikes from '../../components/ViewLikes/ViewLikes'
import { Link } from 'react-router-dom';
import { getPostImage } from '../../functions/GetPostImage';
import { getProfilePicture } from '../../functions/GetProfilePicture'

import Moment from 'react-moment';
import './Post.css'



class Post extends Component {
    state = {
        loaded: false,
        expanded: false,
        image: "",
        author: "",
        authorImage: "",
        caption: "",
        time: "",
        comments: [],
        liked: false,
        newComment: "",
        commentEmptyError: false,
        sharing: "",
        valid: true,
        shareMenu: false,
        authourPostOptions: false,
        postOptions: false,
        showLikes: false
    }
    Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    componentDidMount() {
        Date.prototype.addHours = function (h) {
            this.setHours(this.getHours() + h);
            return this;
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        if (this.props.isTemp === "false") {
            axios.post('/api/posts/getPostDetails', { postId: this.props.id, isText: false }, config)
                .then(async (res) => {
                    const author = res.data.post.author.name;
                    const authorImage = await getProfilePicture(res.data.post.author._id)
                    const authorUsername = res.data.post.author.username;
                    // const image = await getPostImage(this.props.id)
                    const image = "data:image/png;base64," + Buffer.from(await getPostImage(this.props.id), 'binary').toString('base64')
                    const time = new Date(res.data.post.publishTime);
                    const caption = res.data.post.caption;
                    const comments = res.data.post.comments;
                    const sharing = res.data.post.sharing;
                    const liked = res.data.liked;
                    const isAuthor = res.data.isAuthor;
                    const numberOfLikes = res.data.post.likes.length;
                    const disableComments = res.data.post.disableComments;
                    setInterval(() => {
                        if (authorImage && image && !this.state.loaded) {
                            this.setState({ image, authorImage, author, disableComments, time, caption, comments, authorUsername, liked, sharing, loaded: true, isAuthor, isText: false, isTemp: false, numberOfLikes });
                        }
                    }, 100)
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            axios.post('/api/posts/getPostDetails', { postId: this.props.id, isText: this.props.isText, isTemp: true }, config)
                .then(async (res) => {
                    if (res.data.valid) {
                        if (res.data.isText) {
                            const author = res.data.post.author.name;
                            const authorImage = await getProfilePicture(res.data.post.author._id)
                            const authorUsername = res.data.post.author.username;
                            const time = new Date(res.data.post.publishTime).addHours(24);
                            const caption = res.data.post.caption;
                            const comments = res.data.post.comments;
                            const sharing = res.data.post.sharing;
                            const liked = res.data.liked;
                            const isAuthor = res.data.isAuthor;
                            const numberOfLikes = res.data.post.likes.length;
                            setInterval(() => {
                                if (authorImage && !this.state.loaded) {
                                    this.setState({ authorImage, author, numberOfLikes, time, caption, comments, authorUsername, liked, sharing, loaded: true, isAuthor, isTemp: true, isText: true });
                                }
                            }, 100)
                        } else {
                            const author = res.data.post.author.name;
                            const authorImage = await getProfilePicture(res.data.post.author._id)
                            const authorUsername = res.data.post.author.username;
                            // const image = await getPostImage(this.props.id)
                            const image = "data:image/png;base64," + Buffer.from(await getPostImage(this.props.id), 'binary').toString('base64')
                            const time = new Date(res.data.post.publishTime).addHours(24);
                            const caption = res.data.post.caption;
                            const comments = res.data.post.comments;
                            const sharing = res.data.post.sharing;
                            const liked = res.data.liked;
                            const numberOfLikes = res.data.post.likes.length;
                            const isAuthor = res.data.isAuthor;
                            setInterval(() => {
                                if (authorImage && image && !this.state.loaded) {
                                    this.setState({ image, authorImage, author, numberOfLikes, time, caption, comments, authorUsername, liked, sharing, loaded: true, isAuthor, isTemp: true, isText: false });
                                }
                            }, 100)
                        }
                    } else {
                        this.setState({ valid: false, loaded: true })
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    handleExpandClick = () => {
        const expanded = !this.state.expanded
        this.setState({ expanded });
    };
    likePost = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/posts/likePost', { postId: this.props.id }, config)
            .then((res) => {
                this.setState({ liked: true });
            })
            .catch((err) => {
                alert("Error liking post. Try again");
            });
    }
    unlikePost = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/posts/unlikePost', { postId: this.props.id }, config)
            .then((res) => {
                this.setState({ liked: false });
            })
            .catch((err) => {
                alert("Error unliking post. Try again");
            });
    }
    submitComment = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const comment = this.state.newComment;
        if (comment) {
            axios.post('/api/comments/postComment', { postId: this.props.id, comment }, config)
                .then((res) => {
                    let comments = [...this.state.comments]
                    comments.unshift(res.data)
                    this.setState({ newComment: "", comments });
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
        this.setState({ shareMenu: false, authourPostOptions: false, postOptions: false, showLikes: false });
    }
    shareOnTwitter = (link) => {
        window.open("https://twitter.com/intent/tweet?text=You have to check out this post on Igloo, the brand new social media site that respects your privacy! https://igloosocial.com" + link, '_blank');
    }
    shareByEmail = (link) => {
        window.open("mailto:?subject=Check%20out%20this%20post%20on%20Igloo!&body=You%20have%20to%20check%20out%20this%20post%20on%20Igloo,%20the%20brand%20new%20social%20media%20platform%20that%20respects%20your%20privacy%20and%20data.%0Ahttps://igloosocial.com" + link, '_blank');
    }
    copyCode = () => {
        var copyText = document.getElementById(`copyInput${this.props.id}`);

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");
    }
    deletePost = () => {
        let x = window.confirm("Are you sure you want to delete this post?")
        if (x) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            axios.post('/api/posts/deletePost', { postId: this.props.id }, config)
                .then((res) => {
                    const { valid } = res.data;
                    if (valid) {
                        alert("Succesfully deleted!");
                        window.location.href = "/";
                    } else {
                        alert("You don't have permission to delete this post");
                    }
                })
                .catch((err) => {
                    alert("Server Error. Try again later");
                    console.log(err);
                })
        }
    }
    muteUser = (username) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/muteUser', { username }, config)
            .then((res) => {
                alert("User succesfully muted. You won't see their posts from next time");
            })
            .catch((err) => {
                console.log(err);
                alert(err.response.message)
            })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <Card id="postContainer">
                    <CardContent>
                        <CircularProgress style={{ position: "relative", marginLeft: "45%" }} />
                    </CardContent>
                </Card>
            )
        }
        if (this.props.theme === 'light') {
            var postCard = "postCardLight"
            var postCardSubheader = "postCardSubheaderLight"
            var postCardCaption = "postCardCaptionLight"
            var postCardEnterComment = "postCardEnterCommentLight"
        } else {
            postCard = "postCardDark"
            postCardSubheader = "postCardSubheaderDark"
            postCardCaption = "postCardCaptionDark"
            postCardEnterComment = "postCardEnterCommentDark"
        }

        var allComments = this.state.comments.map((commentId) => {
            return (<Comment id={commentId} key={commentId} />);
        })
        const userLink = "/user/" + this.state.authorUsername;
        const postLink = "/post/" + this.props.id;
        if (this.state.isTemp === false && this.state.isText === false) {
            return (
                <div id="postContainer" className="animated pulse faster">
                    <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                        <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                        <ViewLikes type="post" id={this.props.id} />
                    </Dialog>
                    <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.authourPostOptions}>
                        <DialogTitle id="simple-dialog-title">Choose post option</DialogTitle>
                        <List>
                            <ListItem button onClick={this.deletePost}>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete Post" />
                            </ListItem>
                            <ListItem button onClick={() => this.setState({ showLikes: true })}>
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="View Post Likes" secondary={`${this.state.numberOfLikes}
                                            ${
                                    this.state.numberOfLikes === 1 ?
                                        " Like"
                                        :
                                        " Likes"
                                    }`} />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <EditIcon />
                                </ListItemIcon>
                                <ListItemText primary="Edit post" secondary="Not yet ready, coming soon" />
                            </ListItem>
                            <ListItem button onClick={this.handleClose}>
                                <ListItemText primary="Close" />
                            </ListItem>
                        </List>
                    </Dialog>

                    <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.postOptions}>
                        <DialogTitle id="simple-dialog-title">Choose post option</DialogTitle>
                        <List>
                            <ListItem button onClick={() => this.muteUser(this.state.authorUsername)}>
                                <ListItemIcon>
                                    <NotInterestedIcon />
                                </ListItemIcon>
                                <ListItemText primary={`Mute posts from ${this.state.author}`} />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <ReportIcon />
                                </ListItemIcon>
                                <ListItemText primary="Report post" />
                            </ListItem>
                            <ListItem button onClick={this.handleClose}>
                                <ListItemText primary="Close" />
                            </ListItem>
                        </List>
                    </Dialog>
                    <Dialog
                        open={this.state.shareMenu}
                        TransitionComponent={this.Transition}
                        keepMounted
                        onClose={this.handleClose}
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Share this post with your friends!"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Only those with permission to view this post will be able to see it
                            </DialogContentText>
                            <IconButton onClick={() => this.shareOnTwitter(postLink)}>
                                <TwitterIcon fontSize="large" style={{ color: "#00acee" }} />
                            </IconButton>
                            <IconButton onClick={() => this.shareByEmail(postLink)}>
                                <EmailIcon fontSize="large" style={{ color: "#D44638" }} />
                            </IconButton>
                            <br />
                            <br />
                            <input
                                type="text"
                                value={`https://igloosocial.com${postLink}`}
                                readOnly
                                id={`copyInput${this.props.id}`}
                                style={{ width: "100%" }}
                            // onChange={}
                            />

                            <br /><br />
                            <Button variant="contained" color="secondary" onClick={this.copyCode}>Copy link</Button>
                            <br />
                            <br />
                            <small>If the copy button does not work for you, manually copy the link above</small>
                            <br /><br />
                        </DialogContent>
                    </Dialog>
                    <Card id="postCardLight">
                        <CardHeader
                            avatar={
                                <Link to={userLink}>
                                    <Avatar alt="User Image" src={this.state.authorImage} />
                                </Link>
                            }
                            action={
                                <div>
                                    {this.state.isAuthor ?
                                        <IconButton aria-label="settings" onClick={() => this.setState({ authourPostOptions: true })}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        :
                                        <IconButton aria-label="settings" onClick={() => this.setState({ postOptions: true })}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                </div>
                            }
                            title={this.state.author}
                            subheader={<div id="postCardSubheaderLight">
                                <Moment fromNow>{this.state.time}</Moment><br />
                                {this.state.sharing === "Private" ? "Shared Privately to group" : "Shared with all"}
                            </div>}
                        />
                        <CardContent>
                            <Img src={this.state.image} alt={this.state.caption} id="postImage" />
                            <br /><br />
                            <Typography variant="body1" color="textPrimary" component="p" id="postCardCaptionLight" style={{ fontSize: "1.2rem" }}>
                                {this.state.caption}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            {this.state.liked ?
                                <IconButton style={{ outlineStyle: "none", color: "red" }} onClick={this.unlikePost}>
                                    <FavoriteIcon className="animated heartBeat" />
                                </IconButton>
                                :
                                <IconButton style={{ outlineStyle: "none" }} onClick={this.likePost}>
                                    <FavoriteIcon />
                                </IconButton>}
                            <IconButton aria-label="share" style={{ outlineStyle: "none", color: "blue" }} onClick={() => this.setState({ shareMenu: true })}>
                                <ShareIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => { window.open(postLink, '_blank'); }}
                                style={{ outlineStyle: "none", color: "#E57167" }}
                            >
                                <LaunchIcon />
                            </IconButton>
                            {
                                this.state.disableComments ?
                                    <IconButton>
                                        <SpeakerNotesOffIcon style={{ color: "red" }} />
                                    </IconButton>
                                    :
                                    <Fragment>
                                        {this.state.comments.length !== 0 ?
                                            (this.state.comments.length === 1 ? `${this.state.comments.length} Comment` : `${this.state.comments.length} Comments`)
                                            : ""
                                        }
                                        <IconButton
                                            onClick={this.handleExpandClick}
                                            aria-expanded={this.state.expanded}
                                            aria-label="show more"
                                            style={{ outlineStyle: "none" }}
                                        >
                                            {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </Fragment>
                            }
                            <br /><br />
                        </CardActions>
                        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Grid container spacing={2} alignItems="flex-end">
                                    <Grid item xs={10}>
                                        <form autoComplete="false">
                                            <TextField
                                                id="postCardEnterCommentLight"
                                                label="Enter your comment"
                                                onChange={(e) => this.setState({ newComment: e.target.value })}
                                                value={this.state.newComment}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                            />
                                        </form>
                                    </Grid>
                                    <Grid item xs>
                                        <SendIcon onClick={this.submitComment} />
                                    </Grid>
                                </Grid>
                                {allComments}
                            </CardContent>
                        </Collapse>
                    </Card>
                    <Divider variant="middle" />
                </div>
            )
        }
        if (this.state.valid) {
            if (this.state.isText) {
                return (
                    <div id="postContainer" className="animated pulse faster">
                        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                            <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                            <ViewLikes type="post" id={this.props.id} />
                        </Dialog>
                        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.authourPostOptions}>
                            <DialogTitle id="simple-dialog-title">Choose post option</DialogTitle>
                            <List>
                                <ListItem button onClick={this.deletePost}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete Post" />
                                </ListItem>
                                <ListItem button onClick={() => this.setState({ showLikes: true })}>
                                    <ListItemIcon>
                                        <FavoriteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="View Post Likes" secondary={`${this.state.numberOfLikes}
                                            ${
                                        this.state.numberOfLikes === 1 ?
                                            " Like"
                                            :
                                            " Likes"
                                        }`} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <EditIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Edit post" secondary="Not yet ready, coming soon" />
                                </ListItem>
                                <ListItem button onClick={this.handleClose}>
                                    <ListItemText primary="Close" />
                                </ListItem>
                            </List>
                        </Dialog>
                        <Dialog
                            open={this.state.shareMenu}
                            TransitionComponent={this.Transition}
                            keepMounted
                            onClose={this.handleClose}
                        >
                            <DialogTitle id="alert-dialog-slide-title">{"Share this post with your friends!"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Only those with permission to view this post will be able to see it
                            </DialogContentText>
                                <IconButton onClick={() => this.shareOnTwitter(postLink)}>
                                    <TwitterIcon fontSize="large" style={{ color: "#00acee" }} />
                                </IconButton>
                                <IconButton onClick={() => this.shareByEmail(postLink)}>
                                    <EmailIcon fontSize="large" style={{ color: "#D44638" }} />
                                </IconButton>
                                <br />
                                <br />
                                <input
                                    type="text"
                                    value={`https://igloosocial.com${postLink}`}
                                    readOnly
                                    id={`copyInput${this.props.id}`}
                                    style={{ width: "100%" }} />
                                <br /><br />
                                <Button variant="contained" color="secondary" onClick={this.copyCode}>Copy link</Button>
                                <br />
                                <br />
                                <small>If the copy button does not work for you, just click and hold the link to select and copy</small>
                                <br /><br />
                            </DialogContent>
                        </Dialog>
                        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.postOptions}>
                            <DialogTitle id="simple-dialog-title">Choose post option</DialogTitle>
                            <List>
                                <ListItem button onClick={() => this.muteUser(this.state.authorUsername)}>
                                    <ListItemIcon>
                                        <NotInterestedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Mute posts from ${this.state.author}`} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <ReportIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Report post" />
                                </ListItem>
                                <ListItem button onClick={this.handleClose}>
                                    <ListItemText primary="Close" />
                                </ListItem>
                            </List>
                        </Dialog>
                        <Card id="textCard">
                            <CardHeader
                                avatar={
                                    <Link to={userLink}>
                                        <Avatar alt="User Image" src={this.state.authorImage} />
                                    </Link>
                                }
                                action={
                                    <div>
                                        {this.state.isAuthor ?
                                            <IconButton aria-label="settings" onClick={() => this.setState({ authourPostOptions: true })}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            :
                                            <IconButton aria-label="settings" onClick={() => this.setState({ postOptions: true })}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                    </div>
                                }
                                title={this.state.author}
                                subheader={<div>
                                    Expires in <Moment to={this.state.time}>{new Date()}</Moment><br />
                                    {this.state.sharing === "Private" ? "Shared Privately to group" : "Shared with all"}
                                </div>}
                            />
                            <CardContent>
                                <Typography variant="body1" color="textPrimary" component="p" style={{ fontSize: "1rem" }}>
                                    {this.state.caption}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                {this.state.liked ?
                                    <IconButton style={{ outlineStyle: "none", color: "red" }} onClick={this.unlikePost}>
                                        <FavoriteIcon className="animated heartBeat" />
                                    </IconButton>
                                    :
                                    <IconButton style={{ outlineStyle: "none" }} onClick={this.likePost}>
                                        <FavoriteIcon />
                                    </IconButton>}
                                <IconButton aria-label="share" style={{ outlineStyle: "none", color: "blue" }} onClick={() => this.setState({ shareMenu: true })}>
                                    <ShareIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => { window.open(postLink, '_blank'); }}
                                    style={{ outlineStyle: "none", color: "#E57167" }}
                                >
                                    <LaunchIcon />
                                </IconButton>
                                {

                                }
                                <IconButton
                                    onClick={this.handleExpandClick}
                                    aria-expanded={this.state.expanded}
                                    aria-label="show more"
                                    style={{ outlineStyle: "none" }}
                                >
                                    {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                                <br /><br />
                            </CardActions>
                            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="flex-end">
                                        <Grid item xs={10}>
                                            <form autoComplete="false">
                                                <TextField
                                                    id="standard-basic"
                                                    label="Enter your comment"
                                                    onChange={(e) => this.setState({ newComment: e.target.value })}
                                                    value={this.state.newComment}
                                                    style={{ width: "100%" }}
                                                    variant="outlined"
                                                />
                                            </form>
                                        </Grid>
                                        <Grid item xs>
                                            <SendIcon onClick={this.submitComment} />
                                        </Grid>
                                    </Grid>
                                    {allComments}
                                </CardContent>
                            </Collapse>
                        </Card>
                    </div>
                )
            }
            else {
                return (
                    <div id="postContainer" className="animated pulse faster">
                        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                            <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                            <ViewLikes type="post" id={this.props.id} />
                        </Dialog>
                        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.authourPostOptions}>
                            <DialogTitle id="simple-dialog-title">Choose post option</DialogTitle>
                            <List>
                                <ListItem button onClick={this.deletePost}>
                                    <ListItemIcon>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete Post" />
                                </ListItem>
                                <ListItem button onClick={() => this.setState({ showLikes: true })}>
                                    <ListItemIcon>
                                        <FavoriteIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="View Post Likes" secondary={`${this.state.numberOfLikes}
                                            ${
                                        this.state.numberOfLikes === 1 ?
                                            " Like"
                                            :
                                            " Likes"
                                        }`} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <EditIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Edit post" secondary="Not yet ready, coming soon" />
                                </ListItem>
                                <ListItem button onClick={this.handleClose}>
                                    <ListItemText primary="Close" />
                                </ListItem>
                            </List>
                        </Dialog>
                        <Dialog
                            open={this.state.shareMenu}
                            TransitionComponent={this.Transition}
                            keepMounted
                            onClose={this.handleClose}
                        >
                            <DialogTitle id="alert-dialog-slide-title">{"Share this post with your friends!"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Only those with permission to view this post will be able to see it
                            </DialogContentText>
                                <IconButton onClick={() => this.shareOnTwitter(postLink)}>
                                    <TwitterIcon fontSize="large" style={{ color: "#00acee" }} />
                                </IconButton>
                                <IconButton onClick={() => this.shareByEmail(postLink)}>
                                    <EmailIcon fontSize="large" style={{ color: "#D44638" }} />
                                </IconButton>
                                <br />
                                <br />
                                <input
                                    type="text"
                                    value={`https://igloosocial.com${postLink}`}
                                    readOnly
                                    id={`copyInput${this.props.id}`}
                                    style={{ width: "100%" }}
                                // onChange={}
                                />

                                <br /><br />
                                <Button variant="contained" color="secondary" onClick={this.copyCode}>Copy link</Button>
                                <br />
                                <br />
                                <small>If the copy button does not work for you, manually copy the link above</small>
                                <br /><br />
                            </DialogContent>
                        </Dialog>
                        <Card id="textCard">
                            <CardHeader
                                avatar={
                                    <Link to={userLink}>
                                        <Avatar alt="User Image" src={this.state.authorImage} />
                                    </Link>
                                }
                                action={
                                    <div>
                                        {this.state.isAuthor ?
                                            <IconButton aria-label="settings" onClick={() => this.setState({ authourPostOptions: true })}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                }
                                title={this.state.author}
                                subheader={<div>
                                    Expires in <Moment to={this.state.time}>{new Date()}</Moment><br />
                                    {this.state.sharing === "Private" ? "Shared Privately to group" : "Shared with all"}
                                </div>}
                            />
                            <CardContent>
                                <Img src={this.state.image} alt={this.state.caption} id="postImage" />
                                <br /><br />
                                <Typography variant="body1" color="textPrimary" component="p" style={{ fontSize: "1.2rem" }}>
                                    {this.state.caption}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                {this.state.liked ?
                                    <IconButton style={{ outlineStyle: "none", color: "red" }} onClick={this.unlikePost}>
                                        <FavoriteIcon className="animated heartBeat" />
                                    </IconButton>
                                    :
                                    <IconButton style={{ outlineStyle: "none" }} onClick={this.likePost}>
                                        <FavoriteIcon />
                                    </IconButton>}
                                <IconButton aria-label="share" style={{ outlineStyle: "none", color: "blue" }} onClick={() => this.setState({ shareMenu: true })}>
                                    <ShareIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => { window.open(postLink, '_blank'); }}
                                    style={{ outlineStyle: "none", color: "#E57167" }}
                                >
                                    <LaunchIcon />
                                </IconButton>
                                <IconButton
                                    onClick={this.handleExpandClick}
                                    aria-expanded={this.state.expanded}
                                    aria-label="show more"
                                    style={{ outlineStyle: "none" }}
                                >
                                    {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                                <br /><br />
                            </CardActions>
                            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="flex-end">
                                        <Grid item xs={10}>
                                            <form autoComplete="false">
                                            <TextField
                                                id="standard-basic"
                                                label="Enter your comment"
                                                onChange={(e) => this.setState({ newComment: e.target.value })}
                                                value={this.state.newComment}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                            />
                                            </form>
                                        </Grid>
                                        <Grid item xs>
                                            <SendIcon onClick={this.submitComment} />
                                        </Grid>
                                    </Grid>
                                    {allComments}
                                </CardContent>
                            </Collapse>
                        </Card>
                        <Divider variant="middle" />
                    </div>
                )
            }
        }
        else {
            return (<Fragment></Fragment>)
        }
    }
}

const mapStateToProps = state => ({
    theme: state.auth.theme
})
export default connect(mapStateToProps, null)(Post);