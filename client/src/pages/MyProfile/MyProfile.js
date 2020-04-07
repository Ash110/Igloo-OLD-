import React, { Fragment } from 'react';
import { Button,  Dialog, DialogTitle,
     DialogContent,DialogContentText,IconButton } from '@material-ui/core'
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
        dropdownValue: '',
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
        submittingStage : 0,
        showFriends : false,
        shareMenu : false
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
        this.setState({ shareMenu: false, showFriends : false });
    }

    handleDropdownChange = (e) => {
        this.setState({ dropdownValue: e.target.value })
    }
    submitNewBio = () => {
        this.setState({submittingStage  : 1});
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/updateBio', { bio: this.state.updatedBio }, config)
            .then((res) => {
                this.setState({ bio: this.state.updatedBio, showBioEditor: false , submittingStage : 0});
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
                    this.setState({ username: this.state.updatedUsername, showUsernameEditor : false, submittingStage : 0 });
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
                this.setState({ name: this.state.updatedName, showNameEditor : false, submittingStage : 0 });
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
        if (this.state.dropdownValue === 1) {
            this.setState({ showProfilePictureEditor: true, dropdownValue: '' });
        }
        if (this.state.dropdownValue === 2) {
            this.setState({ showBioEditor: true, dropdownValue: '' });
        }
        if (this.state.dropdownValue === 3) {
            this.setState({ showUsernameEditor: true, dropdownValue: '' });
        }
        if (this.state.dropdownValue === 4) {
            this.setState({ showNameEditor: true, dropdownValue: '' });
        }
        if (this.state.dropdownValue === 5) {
            this.setState({ showEmailEditor: true, dropdownValue: '' });
        }
        if (this.state.dropdownValue === 6) {
            this.props.logOut();
            window.location.href = "/"
        }
        if (!this.state.loaded) {
            return (<Loading />)
        }
        // const convertToURLs = (text) => {
        //     var urlRegex = /(https?:\/\/[^\s]+)/g;
        //     return text.replace(urlRegex, function (url) {
        //         var aTag = document.createElement('a');
        //         aTag.setAttribute('href', url);
        //         aTag.innerText = url;
        //         return aTag;
        //     })
        // }
        const userLink = "/user/" + this.props.username;
        return (
            <Fragment>

                {/* Dialog for friends */}
                <Dialog open={this.state.showFriends} onClose={this.handleClose} aria-labelledby="simple-dialog-title">
                    <DialogTitle id="simple-dialog-title">Click on user to visit their profile</DialogTitle>
                    <div style={{ padding: "10px" }}>
                        <FriendsList id={this.props.id}/>
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

                <Header />
                <div className="profileBody">
                    {this.state.imageSize ? <Img src={this.state.profilePicture} id="profileImgLarge" alt="Your MyProfile" onClick={this.toggleImageSize} /> : <Img src={this.state.profilePicture} id="profileImgSmall" alt="Your MyProfile" onClick={this.toggleImageSize} />}
                    <p id="profileName">{this.state.name}</p>
                    <p id="profileUsername">@{this.state.username}</p>
                    <div id="profileBio"><p>{this.state.bio}</p></div>
                    <div className="text-center">
                        <Button variant="text" color="default" >
                            <Link to="/settings" style={{ color: "grey" }}>
                                Account Settings
                            </Link>
                        </Button>
                        <Button variant="text" color="default" style={{ color: "teal" }} onClick={()=>this.setState({shareMenu : true})}>
                                Share profile
                        </Button>
                        <br />
                        <Button color="secondary"><Link to="/groups">My Groups</Link></Button>
                        <Button color="secondary" onClick={() => this.setState({ showFriends: true })}>Edit Friends</Button>
                        <Link to="/pages"><Button color="secondary" style={{ color: "purple" }}>My Pages</Button></Link>
                        <br />
                        {/* <FormControl style={{width:"50%"}}>
                            <InputLabel htmlFor="profile-settings-chooser">Profile Settings</InputLabel>
                            <Select id='profile-settings-chooser' value={this.state.dropdownValue} onChange={(e) => this.handleDropdownChange(e)} label="Choose a value">
                                <MenuItem value={1}>Edit Profile Picture</MenuItem>
                                <MenuItem value={2}>Edit Bio</MenuItem>
                                <MenuItem value={3}>Edit Username</MenuItem>
                                <MenuItem value={4}>Edit Name</MenuItem>
                                <MenuItem value={5}>Edit Email</MenuItem>
                                <MenuItem value={6} onClick={this.props.logOut}>Log Out</MenuItem>
                            </Select>
                        </FormControl> */}
                    </div>
                </div>
                <PostGrid owner="true" />
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