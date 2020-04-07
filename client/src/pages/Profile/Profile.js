import React, { Fragment } from 'react';
import Img from 'react-image'
import { ButtonGroup } from 'react-bootstrap'
import { connect } from 'react-redux';
import axios from 'axios';
import './Profile.css';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import Bottom from '../../components/Bottom/Bottom';
import TelegramIcon from '@material-ui/icons/Telegram';
import { getProfilePicture } from "../../functions/GetProfilePicture";
import PostGrid from '../../components/PostsGrid/PostGrid'
import Page404 from '../Page404/Page404'
import { Dialog, DialogTitle, Button, CircularProgress } from '@material-ui/core'
import FriendsList from '../../components/FriendsList/FriendsList'
import PagesList from '../../components/PagesList/PagesList'



class Profile extends React.Component {
    state = {
        name: "",
        username: "",
        bio: "",
        profilePicture: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
        isFriend: false,
        buttonText: "Add Friend",
        loaded: false,
        userProfile: "",
        exists: false,
        showFriends: false,
        showPages: false,
        telegramUsername: null
    }
    componentDidMount() {
        const userProfile = this.props.match.params.username;
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/friends/getProfile', { username: userProfile }, config)
            .then((res) => {
                if (res.data === "Same") {
                    window.location.href = "/profile"
                } else {
                    if (res.data.exists === true) {
                        let { id, name, username, pages, hasRequestedMe, telegramUsername, bio, isFriend, isMuted, isRequested, profilePicture, numberOfFriends } = res.data;
                        let buttonText;
                        if (isFriend) {
                            buttonText = "Remove Friend";
                        } else if (!isRequested) {
                            buttonText = "Add Friend"
                        }
                        else {
                            buttonText = "Requested!"
                        }
                        console.log(hasRequestedMe)
                        if (hasRequestedMe) {
                            buttonText = "Accept Request";
                        }
                        if (profilePicture !== "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png") {
                            getProfilePicture(id).then((res) => {
                                this.setState({ id, name, pages, hasRequestedMe, telegramUsername, numberOfFriends, isMuted, username, bio, isFriend, buttonText, loaded: true, exists: true, profilePicture: res, userProfile });
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            this.setState({ id, name, pages, telegramUsername, username, bio, numberOfFriends, isMuted, isFriend, buttonText, loaded: true, profilePicture, userProfile, exists: true });
                        }
                    } else {
                        this.setState({ exists: false, loaded: true });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    acceptRequest = () => {
        this.setState({ buttonText: "Loading" })
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/friends/acceptRequest', { accepted: this.state.id }, config)
            .then((res) => {
                window.location.reload()
            })
            .catch((err) => {
                console.log(err);
            })
    }
    rejectRequest = () => {
        this.setState({ buttonText: "Loading" })
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/friends/rejectRequest', { rejected: this.state.id }, config)
            .then((res) => {
                window.location.href = "/"
            })
            .catch((err) => {
                console.log(err);
            })
    }

    textUser = (username) => {
        window.open(`https://t.me/${username}`, "_blank");
    }

    removeFriend = () => {
        const userProfile = this.props.match.params.username;
        this.setState({ buttonText: "Loading" })
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/friends/removeFriend', { username: userProfile }, config)
            .then((res) => {
                window.location.reload()
            })
            .catch((err) => {
                alert("Error removing friend");
                this.setState({ buttonText: "Remove Friend" })
                console.log(err);
            });
    }
    handleClose = () => {
        this.setState({ showFriends: false, showPages: false })
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
                this.setState({ isMuted: true })
            })
            .catch((err) => {
                console.log(err);
                alert(err.response.message)
            })
    }

    unmuteUser = (username) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/unmuteUser', { username }, config)
            .then((res) => {
                alert("User succesfully unmuted");
                this.setState({ isMuted: false })
            })
            .catch((err) => {
                console.log(err);
                alert(err.response.message)
            })
    }
    render() {
        const sendRequest = () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            this.setState({ buttonText: "Loading" })
            axios.post('/api/friends/sendRequest', { username: this.props.match.params.username }, config)
                .then((res) => {
                    this.setState({ buttonText: "Requested!" })
                })
                .catch((err) => {
                    this.setState({ buttonText: "Add Friend" })
                    console.log(err);
                    alert("Error! Try again!")
                });
        }

        const removeRequest = () => {
            this.setState({ buttonText: "Loading" })
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            axios.post('/api/friends/removeRequest', { username: this.props.match.params.username }, config)
                .then((res) => {
                    this.setState({ buttonText: "Add Friend" })
                })
                .catch((err) => {
                    console.log(err);
                    alert("Error! Try again!")
                    this.setState({ buttonText: "Requested!" })
                });
        }


        const buttonGroup = () => {
            if (this.state.buttonText === "Remove Friend") {
                return (<ButtonGroup id="profileEditButtonGroup">
                    <Button variant="contained" color="secondary" onClick={this.removeFriend}>{this.state.buttonText}</Button>
                </ButtonGroup>)
            }
            else if (this.state.buttonText === "Add Friend") {
                return (<ButtonGroup id="profileEditButtonGroup">
                    <Button variant="contained" color="primary" onClick={sendRequest}>{this.state.buttonText}</Button>
                </ButtonGroup>)
            }
            else if (this.state.buttonText === "Requested!") {
                return (<ButtonGroup id="profileEditButtonGroup">
                    <Button variant="contained" color="#1a1b1c" onClick={removeRequest}>{this.state.buttonText}</Button>
                </ButtonGroup>)
            } else if (this.state.buttonText === "Accept Request") {
                return (<ButtonGroup id="profileEditButtonGroup">
                    <Button variant="contained" style={{ backgroundColor: "#8fff9e" }} onClick={this.acceptRequest}>Accept friend request</Button>
                    <br /><br />
                    <Button variant="contained" style={{ backgroundColor: "#fd8080" }} onClick={this.rejectRequest}>Decline friend request</Button>
                </ButtonGroup>)
            }
            else {
                return (<ButtonGroup id="profileEditButtonGroup">
                    <Button variant="contained" color="#1a1b1c" ><CircularProgress color="secondary" /></Button>
                </ButtonGroup>)
            }
        }
        if (!this.state.loaded) {
            return <Loading />
        }
        if (!this.state.exists) {
            return (
                <Page404 type="user" />
            )
        }
        return (
            <Fragment>
                <Dialog open={this.state.showFriends} onClose={this.handleClose} aria-labelledby="simple-dialog-title">
                    <DialogTitle id="simple-dialog-title">Click on user to visit their profile</DialogTitle>
                    <div style={{ padding: "10px" }}>
                        <FriendsList id={this.state.id} />
                    </div>
                </Dialog>
                <Dialog open={this.state.showPages} onClose={this.handleClose} aria-labelledby="simple-dialog-title">
                    <DialogTitle id="simple-dialog-title">Click on a page to visit</DialogTitle>
                    <div style={{ padding: "10px" }}>
                        <PagesList id={this.state.id} />
                    </div>
                </Dialog>
                <Header />
                <div className="profileBody">
                    <Img src={this.state.profilePicture} id="profileImg" alt="Your Profile" />
                    <p id="profileName">{this.state.name}</p>
                    <p id="profileUsername">@{this.state.username}</p>
                    <p id="profileBio">{this.state.bio}</p>
                    <div className="text-center">
                        {this.state.pages.length > 0 ?
                            <Fragment>
                                <Button variant="text" color="default" onClick={() => this.setState({ showPages: true })}>
                                    {this.state.pages.length} Pages
                                </Button>
                                <br />
                            </Fragment>
                            :
                            <Fragment></Fragment>
                        }
                        {this.state.buttonText === "Remove Friend" ?
                            <Button variant="text" color="default" onClick={() => this.setState({ showFriends: true })}>
                                {this.state.numberOfFriends} Friends
                        </Button>
                            :
                            <Fragment></Fragment>
                        }
                        <br /><br />
                        {this.state.buttonText === "Remove Friend" && this.state.telegramUsername ?
                            <Fragment>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: "#0088cc", color: "white" }}
                                    onClick={() => this.textUser(this.state.telegramUsername)}>
                                    Direct Message <TelegramIcon style={{ marginLeft: "10px" }} />
                                </Button>
                                <br /><br />
                            </Fragment>
                            :
                            <Fragment></Fragment>
                        }
                        {buttonGroup()}
                        <br />
                        {this.state.buttonText === "Remove Friend" && this.state.isMuted ?
                            <Button variant="contained" color="primary" onClick={() => this.unmuteUser(this.state.username)}>
                                Unmute User
                            </Button>
                            :
                            <Fragment></Fragment>
                        }
                        {this.state.buttonText === "Remove Friend" && !this.state.isMuted ?
                            <Button variant="contained" color="default" onClick={() => this.muteUser(this.state.username)}>
                                Mute User
                            </Button>
                            :
                            <Fragment></Fragment>
                        }
                    </div>
                    {this.state.buttonText === "Remove Friend" ? <PostGrid owner={this.state.userProfile} /> : <Fragment></Fragment>}
                </div>
                <Bottom />
            </Fragment>
        );
    };
}

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
    userToken: state.auth.userToken,
    username: state.auth.username,
    id: state.auth.id,
    name: state.auth.name,
    profilePicture: state.auth.profilePicture,
    bio: state.auth.bio
})
export default connect(mapStateToProps, null)(Profile);