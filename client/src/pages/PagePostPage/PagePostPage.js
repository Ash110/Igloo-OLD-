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
import Comment from '../../components/Comment/Comment';
import ViewLikes from '../../components/ViewLikes/ViewLikes'
import { Link } from 'react-router-dom';
import Page404 from '../Page404/Page404'
import { getPagePostImage } from '../../functions/GetPagePostImage';
// import { getProfilePicture } from '../../functions/GetProfilePicture'

import Moment from 'react-moment';
import './PagePostPage.css'



class Post extends Component {
    state = {
        loaded: false,
        expanded: true,
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
        axios.post('/api/pages/getPostDetails', { postId: this.props.match.params.pageId }, config)
            .then(async (res) => {
                const { author, authorUsername, liked, authorId, pageName, time, caption, isAuthor, isText, disableComments, likes, comments, } = res.data
                // const authorImage = await getProfilePicture(authorId)
                if (!isText) {
                    var image = "data:image/png;base64," + Buffer.from(await getPagePostImage(this.props.match.params.pageId), 'binary').toString('base64')
                } else {
                    image = null;
                }
                const numberOfLikes = likes.length;
                this.setState({ author, authorUsername, liked, authorId, pageName, time, caption, isAuthor, isText, image, disableComments, likes, comments, loaded: true, numberOfLikes });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ valid: false, loaded : true })
            })
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
        axios.post('/api/pages/likePost', { postId: this.props.match.params.pageId }, config)
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
        axios.post('/api/pages/unlikePost', { postId: this.props.match.params.pageId }, config)
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
            axios.post('/api/comments/postComment', { postId: this.props.match.params.pageId, comment, type: "pagePost" }, config)
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
        var copyText = document.getElementById(`copyInput${this.props.match.params.pageId}`);

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
            axios.post('/api/pages/deletePost', { postId: this.props.match.params.pageId }, config)
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
        if(!this.state.valid){
            return <Page404/>
        }
        var likeButton;
        this.state.liked ?
            likeButton = <IconButton style={{ outlineStyle: "none", color: "red" }} onClick={this.unlikePost}>
                <FavoriteIcon className="animated heartBeat" />
            </IconButton>
            :
            likeButton = <IconButton style={{ outlineStyle: "none" }} onClick={this.likePost}>
                <FavoriteIcon />
            </IconButton>

        var allComments = this.state.comments.map((commentId) => {
            return (<Comment id={commentId} key={commentId} />);
        })
        const userLink = "/user/" + this.state.authorUsername;
        const postLink = "/post/" + this.props.match.params.pageId;
        if (this.state.isText) {
            return (
                <div id="pagePostContainer" className="animated pulse faster">
                    <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                        <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                        <ViewLikes type="pagepost" id={this.props.match.params.pageId} />
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
                                id={`copyInput${this.props.match.params.pageId}`}
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
                    <Card id="pageTextCard">
                        <CardHeader
                            avatar={
                                <Link to={userLink}>
                                    <Avatar>{this.state.author[0]}</Avatar>
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
                                Shared with page {this.state.pageName}
                            </div>}
                        />
                        <CardContent>
                            <Typography variant="body1" color="textPrimary" component="p" style={{ fontSize: "1rem" }}>
                                {this.state.caption}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            {this.props.loggedIn ?
                                <Fragment>{likeButton}</Fragment>
                                :
                                <Fragment></Fragment>
                            }
                            <IconButton aria-label="share" style={{ outlineStyle: "none", color: "blue" }} onClick={() => this.setState({ shareMenu: true })}>
                                <ShareIcon />
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
                                {this.props.loggedIn ?
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
                                    : <Fragment></Fragment>}
                                {allComments}
                            </CardContent>
                        </Collapse>
                    </Card>
                </div>
            )
        }
        else {
            return (
                <div id="pagePostContainer" className="animated pulse faster">
                    <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.showLikes}>
                        <DialogTitle id="simple-dialog-title">{this.state.numberOfLikes} {this.state.numberOfLikes === 1 ? " Like" : " Likes"}</DialogTitle>
                        <ViewLikes type="post" id={this.props.match.params.pageId} />
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
                                id={`copyInput${this.props.match.params.pageId}`}
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
                    <Card id="pageTextCard">
                        <CardHeader
                            avatar={
                                <Link to={userLink}>
                                    <Avatar>{this.state.author[0]}</Avatar>
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
                                Shared with page {this.state.pageName}
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
                            {this.props.loggedIn ?
                                <Fragment>{likeButton}</Fragment>
                                :
                                <Fragment></Fragment>
                            }
                            <IconButton aria-label="share" style={{ outlineStyle: "none", color: "blue" }} onClick={() => this.setState({ shareMenu: true })}>
                                <ShareIcon />
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
                                {this.props.loggedIn ?
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
                                    : <Fragment></Fragment>}
                                {allComments}
                            </CardContent>
                        </Collapse>
                    </Card>
                    <Divider variant="middle" />
                </div>
            )
        }

    }

}

const mapStateToProps = state => ({
    theme: state.auth.theme,
    loggedIn: state.auth.loggedIn
})
export default connect(mapStateToProps, null)(Post);