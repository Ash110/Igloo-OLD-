import React, { Fragment, Component } from 'react';
import {
    Button, Drawer,
    TextField, CircularProgress, InputAdornment
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import Bottom from '../../components/Bottom/Bottom';
import { logOut } from '../../actions/authAction';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UploadProfilePicture from '../../components/UploadProfilePicture/UploadProfilePicture';
import './Settings.css';


class Settings extends Component {
    state = {
        name: "",
        username: "",
        bio: "",
        loaded: false,
        showProfilePictureEditor: false,
        showBioEditor: false,
        updatedBio: "",
        showUsernameEditor: false,
        updatedUsername: "",
        showNameEditor: false,
        updatedName: "",
        showTelegramEditor: false,
        telegramUsername: "",
        showEmailEditor: false,
        updatedEmail: "",
        submittingStage: 0,
        friendRequestEmails: true,
        newsletterEmails: true,
        showPasswordChanger: false,
        passwordSeen : false,

    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        let { username, name, bio, email, telegramUsername } = this.props;
        axios.post('/api/users/getEmailPreferences', {}, config)
            .then((res) => {
                const { friendRequestEmails, newsletterEmails } = res.data;
                this.setState({ name, username, bio, loaded: true, email, friendRequestEmails, newsletterEmails })
            })
            .catch((err) => {
                alert(err.response.data)
            })
    }

    handleClose = () => {
        this.setState({ showProfilePictureEditor: false, showBioEditor: false, showUsernameEditor: false, showNameEditor: false, showFriends: false, showEmailEditor: false, showTelegramEditor: false, showPasswordChanger: false });
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
                this.setState({ showBioEditor: false, submittingStage: 0 });
            })
            .catch((err) => {
                this.setState({ submittingStage: 0 });
                alert(err);
                console.log(err);
            })
    }

    updateEmailPreferences = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const { friendRequestEmails, newsletterEmails } = this.state;
        axios.post('/api/users/updateEmailPreferences', { friendRequestEmails, newsletterEmails }, config)
            .then((res) => {
                this.setState({ submittingStage: 0 });
            })
            .catch((err) => {
                this.setState({ submittingStage: 0 });
                alert(err);
                console.log(err);
            })
    }

    submitTelegram = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const { telegramUsername } = this.state;
        axios.post('/api/users/updateTelegramUsername', { telegramUsername }, config)
            .then((res) => {
                this.setState({ submittingStage: 0, showTelegramEditor: false });
            })
            .catch((err) => {
                this.setState({ submittingStage: 0 });
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
                this.setState({ submittingStage: 0 });
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
                this.setState({ submittingStage: 0 });
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
                this.setState({ submittingStage: 0 });
                alert(err.response.data);
                console.log(err);
            })
    }
    submitNewPassword = () => {
        this.setState({ submittingStage: 1 });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/updatePassword', { newPassword : this.state.newPassword, confirmNewPassword : this.state.confirmNewPassword }, config)
            .then((res) => {
                this.setState({ showPasswordChanger: false, submittingStage: 0 });
            })
            .catch((err) => {
                this.setState({ submittingStage: 0 });
                alert(err.response.data);
                console.log(err);
            })
    }

    deleteAccount = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const x = window.confirm("Are you sure you want to delete your account? This is irreversible")
        if(x){
            axios.post('/api/users/deleteUser',{},config)
            this.props.logOut();
        }
    }

    togglePassword = () => {
        if(this.state.passwordSeen){
            this.setState({passwordSeen : false})
        }else{
            this.setState({passwordSeen : true})
        }
    }

    logOut = () => {
        this.props.logOut();
        window.location.href = "/"
    }

    render() {
        if (!this.state.loaded) {
            return (<Loading />)
        }
        if (this.state.submittingStage === 0) {
            var submitState = "Save changes"
        }
        else if (this.state.submittingStage === 1) {
            submitState = (<CircularProgress color="secondary" />)
        }
        if(this.state.passwordSeen){
            var passwordType = "text"
        }else{
            passwordType = "password"
        }
        return (
            <Fragment>
                {/* Drawer for upload profile picture */}
                <Drawer anchor="bottom" open={this.state.showProfilePictureEditor} onClose={this.handleClose}>
                    <UploadProfilePicture />
                </Drawer>

                {/* Drawer for edit bio */}
                <Drawer anchor="bottom" open={this.state.showBioEditor} onClose={this.handleClose}>
                    <div style={{ padding: "30px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Enter new bio here"
                            variant="outlined"
                            multiline
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ updatedBio: e.target.value })}
                        />
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.submitNewBio}>
                            {submitState}
                        </Button>
                    </div>
                </Drawer>

                {/* Drawer for edit username */}
                <Drawer anchor="bottom" open={this.state.showUsernameEditor} onClose={this.handleClose}>
                    <div style={{ padding: "30px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Enter new username here. Must be less than 36 characters"
                            variant="outlined"
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ updatedUsername: e.target.value })}
                        />
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.submitNewUsername}>
                            {submitState}
                        </Button>
                    </div>
                </Drawer>

                {/* Drawer for edit name */}
                <Drawer anchor="bottom" open={this.state.showNameEditor} onClose={this.handleClose}>
                    <div style={{ padding: "30px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Enter your name"
                            variant="outlined"
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ updatedName: e.target.value })}
                        />
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.submitNewName}>
                            {submitState}
                        </Button>
                    </div>
                </Drawer>

                {/* Drawer for edit telegram */}
                <Drawer anchor="bottom" open={this.state.showTelegramEditor} onClose={this.handleClose}>
                    <div style={{ padding: "30px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Enter your telegram username"
                            variant="outlined"
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ telegramUsername: e.target.value })}
                            value={this.state.telegramUsername}
                        />
                        <br /><br />
                        <small>Please note that all your friends who follow you can message you on telegram if you share username. <br/>Enter telegram username without @</small>
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.submitTelegram}>
                            {submitState}
                        </Button>
                    </div>
                </Drawer>
                {/* Drawer for edit email */}
                <Drawer anchor="bottom" open={this.state.showEmailEditor} onClose={this.handleClose}>
                    <div style={{ padding: "30px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Enter your email"
                            variant="outlined"
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ updatedEmail: e.target.value })}
                        />
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.submitNewEmail}>
                            {submitState}
                        </Button>
                    </div>
                </Drawer>

                {/* Drawer for change password */}
                <Drawer anchor="bottom" open={this.state.showPasswordChanger} onClose={this.handleClose}>
                    <div style={{ padding: "30px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Enter new password"
                            type={passwordType}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" >
                                        <VisibilityIcon onClick={this.togglePassword}/>
                                    </InputAdornment>
                                ),
                            }}
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ newPassword: e.target.value })}
                        />
                        <br /><br />
                        <TextField
                            id="outlined-basic"
                            label="Confirm new password"
                            variant="outlined"
                            type={passwordType}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" >
                                        <VisibilityIcon onClick={this.togglePassword}/>
                                    </InputAdornment>
                                ),
                            }}
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ confirmNewPassword: e.target.value })}
                        />
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.submitNewPassword}>
                            {submitState}
                        </Button>
                    </div>
                </Drawer>

                <Header />
                <div id="settingsContainer">
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showProfilePictureEditor: true })}>
                            Upload new profile picture
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showBioEditor: true })}>
                            Update your Bio
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showUsernameEditor: true })}>
                            Update your Username
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showNameEditor: true })}>
                            Update your name
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showEmailEditor: true })}>
                            Update your email ID
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showTelegramEditor: true })}>
                            Share your Telegram Username for DMs
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <Button variant="text" color="default" onClick={() => this.setState({ showPasswordChanger: true })}>
                            Change password
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <ExpansionPanel style={{ border: "none", boxShadow: "none", padding: "none" }}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                Email Preferences
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={true} disabled name="friendRequestEmails" />}
                                        label="Emails for important account security details and policy changes"
                                    />
                                    <br />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.state.friendRequestEmails} onChange={(e) => this.setState({ friendRequestEmails: e.target.checked })} name="friendRequestEmails" />}
                                        label="Emails for new friend requsts"
                                    />
                                    <br />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.state.newsletterEmails} onChange={(e) => this.setState({ newsletterEmails: e.target.checked })} name="newsletterEmails" />}
                                        label="Occasional newsletters about the site's progress and updates"
                                    />
                                    <br />
                                    <Button variant="outlined" color="secondary" onClick={this.updateEmailPreferences}>
                                        {submitState}
                                    </Button>
                                </FormGroup>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                    <br />
                    <div>
                        <Button variant="text" color="secondary" onClick={this.logOut}>
                            Log out
                        </Button>
                        <br />
                        <br />
                    </div>
                    <div>
                        <br/>
                        <br/>
                        <Button variant="contained" color="secondary" onClick={this.deleteAccount}>
                            Delete Account
                        </Button>
                        <br />
                        <br />
                    </div>
                </div>
                <Bottom />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
    userToken: state.auth.userToken,
    username: state.auth.username,
    id: state.auth.id,
    name: state.auth.name,
    profilePicture: state.auth.profilePicture,
    bio: state.auth.bio,
    email: state.auth.email,
    telegramUsername: state.auth.telegramUsername
})
export default connect(mapStateToProps, { logOut })(Settings);