import React, { Fragment } from 'react';
import {
    Button, Dialog, DialogTitle,
    DialogContent, DialogContentText, IconButton
} from '@material-ui/core'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import Bottom from '../../components/Bottom/Bottom';
import { logOut } from '../../actions/authAction';
import TwitterIcon from '@material-ui/icons/Twitter';
import Img from 'react-image'
import EmailIcon from '@material-ui/icons/Email';
import FriendsList from '../../components/FriendsList/FriendsList'
import { getProfilePicture } from "../../functions/GetProfilePicture";
import PostGrid from '../../components/PostsGrid/PostGrid'
import './MyProfile.css';

class MyProfile extends React.Component {
    state = {
        name: "",
        username: "",
        bio: "",
        profilePicture: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
        loaded: false,
        imageSize: 0,
        showProfilePictureEditor: false,
        showBioEditor: false,
        updatedBio: "",
        showUsernameEditor: false,
        updatedUsername: "",
        showNameEditor: false,
        updatedName: "",
        showEmailEditor: false,
        updatedEmail: "",
        submittingStage: 0,
        showFriends: false,
        shareMenu: false,
        accountOptions: false,
    }
    componentDidMount() {
        let { username, name, bio, id, profilePicture } = this.props;
        if (profilePicture !== "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png") {
            getProfilePicture(id).then((res) => {
                this.setState({ name, username, bio, profilePicture: res, loaded: true })
            })
        } else {
            this.setState({ name, username, bio, profilePicture, loaded: true })
        }
    }

    toggleImageSize = () => {
        var imageSize = this.state.imageSize;
        this.setState({ imageSize: !imageSize })
    }

    handleClose = () => {
        this.setState({ shareMenu: false, showFriends: false, accountOptions: false });
    }

    submitNewBio = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/updateBio', { bio: this.state.updatedBio }, config)
            .then((res) => {
                this.setState({ bio: this.state.updatedBio, showBioEditor: false, submittingStage: 0 });
            })
            .catch((err) => {
                alert(err);
                console.log(err);
            })
    }

    submitNewUsername = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/updateUsername', { username: this.state.updatedUsername }, config)
            .then((res) => {
                if (res.data.valid) {
                    this.setState({ username: this.state.updatedUsername, showUsernameEditor: false, submittingStage: 0 });
                } else {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                alert(err);
                console.log(err);
            })
    }

    submitNewName = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/updateName', { name: this.state.updatedName }, config)
            .then((res) => {
                this.setState({ name: this.state.updatedName, showNameEditor: false, submittingStage: 0 });
            })
            .catch((err) => {
                alert(err);
                console.log(err);
            })
    }

    submitNewEmail = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/updateEmail', { email: this.state.updatedEmail }, config)
            .then((res) => {
                this.setState({ showEmailEditor: false, submittingStage: 0 });
            })
            .catch((err) => {
                alert(err.response.data);
                console.log(err);
            })
    }

    shareOnTwitter = (link) => {
        window.open("https://twitter.com/intent/tweet?text=Follow me on Igloo, the brand new social media site that respects your privacy! https://igloosocial.com" + link, '_blank');
    }
    shareByEmail = (link) => {
        window.open("mailto:?subject=Follow me on Igloo&body=Heyo! Follow me on Igloo, the brand new social media that respects your privacy!.%0Ahttps://igloosocial.com" + link, '_blank');
    }

    copyCode = () => {
        var copyText = document.getElementById(`copyInput${this.props.id}`);

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");
    }


    render() {
        if (!this.state.loaded) {
            return (<Loading />)
        }
        const userLink = "/user/" + this.props.username;
        return (
            <Fragment>

                {/* Dialog for friends */}
                <Dialog open={this.state.showFriends} onClose={this.handleClose} aria-labelledby="simple-dialog-title">
                    <DialogTitle id="simple-dialog-title">Click on user to visit their profile</DialogTitle>
                    <div style={{ padding: "10px" }}>
                        <FriendsList id={this.props.id} />
                    </div>
                </Dialog>

                {/* Dialog for account options */}
                <Dialog open={this.state.accountOptions} onClose={this.handleClose} aria-labelledby="simple-dialog-title">
                    <DialogTitle id="simple-dialog-title">Choose an account option from here</DialogTitle>
                    <div style={{ display: "flex", justifyContent: "center", textAlign:"center" }}>
                        <div style={{ padding: "10px" }}>
                            <Button variant="text" color="default" >
                                <Link to="/settings" style={{ color: "grey" }}>
                                    Account Settings
                            </Link>
                            </Button>
                            <br />
                            <Button variant="text" color="default" style={{ color: "teal" }} onClick={() => this.setState({ shareMenu: true })}>
                                Share profile
                            </Button>
                            <br />
                            <Button color="secondary"><Link to="/groups">My Groups</Link></Button>
                            <br />
                            <Button color="secondary" onClick={() => this.setState({ showFriends: true })}>Edit Friends</Button>
                            <br />
                            <Link to="/pages"><Button color="secondary" style={{ color: "purple" }}>My Pages</Button></Link>
                        </div>
                    </div>
                </Dialog>

                {/* Share profile dialog */}
                <Dialog
                    open={this.state.shareMenu}
                    TransitionComponent={this.Transition}
                    keepMounted
                    onClose={this.handleClose}
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Share your profile with your friends!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Share your profile and invite friends to follow you
                            </DialogContentText>
                        <IconButton onClick={() => this.shareOnTwitter(userLink)}>
                            <TwitterIcon fontSize="large" style={{ color: "#00acee" }} />
                        </IconButton>
                        <IconButton onClick={() => this.shareByEmail(userLink)}>
                            <EmailIcon fontSize="large" style={{ color: "#D44638" }} />
                        </IconButton>
                        <br />
                        <br />
                        <input
                            type="text"
                            value={`https://igloosocial.com${userLink}`}
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

                {/* <Header /> */}
                <div id="profileContainer">
                    <Img src={this.state.profilePicture} id="profileImg" alt="Your Profile" onClick={this.openProfile} />
                    <p id="profileName">{this.state.name}</p>
                    <p id="profileUsername">@{this.state.username}</p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" id="accountOptions" onClick={() => this.setState({ accountOptions: true })}>Account Options</Button>
                    </div>
                </div>
                <div id="profileBody">
                    <div className="text-center">
                        <p id="profileBio">{this.props.bio}</p>
                        <PostGrid owner="true" />
                    </div>
                </div>
                <Bottom />
            </Fragment>
        );
    }
};
const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
    userToken: state.auth.userToken,
    username: state.auth.username,
    id: state.auth.id,
    name: state.auth.name,
    profilePicture: state.auth.profilePicture,
    bio: state.auth.bio
})
export default connect(mapStateToProps, { logOut })(MyProfile);