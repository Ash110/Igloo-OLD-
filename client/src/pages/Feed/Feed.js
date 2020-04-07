import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { logOut } from '../../actions/authAction';
import { Drawer, Avatar, Grid, Fab, Tabs, Tab } from '@material-ui/core';
import {Link} from 'react-router-dom';
// import SpeedDial from '@material-ui/lab/SpeedDial';
// import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { CircularProgress, FormGroup, FormControlLabel, Switch, Typography, Box } from "@material-ui/core";
// import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import EditIcon from '@material-ui/icons/Edit';
// import TimelapseIcon from '@material-ui/icons/Timelapse';
import axios from 'axios';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getProfilePicture } from '../../functions/GetProfilePicture';
import Post from '../../components/Post/Post';
import PagePost from '../../components/PagePost/PagePost';
import Header from '../../components/Header/Header';
import Bottom from '../../components/Bottom/Bottom';
import PostUploader from '../../components/PostUploader/PostUploader';
import TempPostUploader from '../../components/TempPostUploader/TempPostUploader';
import PagePostUploader from '../../components/PagePostUploader/PagePostUploader';
import CustomAlert from '../../components/Alerts/Alert'

import './Feed.css'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}


class Feed extends React.Component {
    state = {
        postDialogOpen: false,
        fabOpen: false,
        fabHidden: false,
        tempPostDialog: false,
        loaded: false,
        feed: [],
        userImage: "",
        onlyTimed: false,
        onlyPermanent: false,
        noPagePosts: false,
        tabValue: 0,

    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/feed/getFeed', {}, config)
            .then(async (res) => {

                const userImage = await getProfilePicture(res.data.userId);
                this.setState({ feed: [...res.data.allFeedPosts], userImage, loaded: true });
            })
            .catch((err) => {
                alert("There has been an error. Please try after a while");
                console.log(err)
            })
    }
    closeDialog = () => {
        this.setState({ postDialogOpen: false, tempPostDialog: false });
    }

    openDialog = () => {
        this.setState({ postDialogOpen: true, });
    }

    createPostButton = () => {
        this.setState({ postDialogOpen: true, fabOpen: false, alert: "Dialog opened" });
    }
    createTempPost = () => {
        this.setState({ tempPostDialog: true, fabOpen: false });
    }
    render() {
        if (this.props.theme === 'light') {
            var feedSettingsId = "feedSettingsLight"
        } else {
            feedSettingsId = "feedSettingsDark"
        }


        if (!this.state.loaded) {
            return (<CircularProgress style={{ position: "absolute", left: "45%", top: "40%" }} />)
        }
        let rendered = []
        if (this.state.feed.length === 0) {
            var feedPosts = (
                <div id="newUserFeed">
                    <Link to="/search">
                        <div className="suggestPagesDiv">
                            <p className="suggestPagesTitle">Search for users</p>
                            <p className="suggestPagesDescription">Search for friends and other users to get started</p>
                        </div>
                    </Link>
                    <Link to="/user/igloo">
                        <div className="suggestPagesDiv">
                            <p className="suggestPagesTitle">Follow Igloo</p>
                            <p className="suggestPagesDescription">Follow us for updates about the site</p>
                        </div>
                    </Link>
                    <Link to="/settings">
                        <div className="suggestPagesDiv">
                            <p className="suggestPagesTitle">Change your account settings</p>
                            <p className="suggestPagesDescription">Update your bio, profile picture, and so much more</p>
                        </div>
                    </Link>
                </div>
            )
        } else {
            feedPosts = this.state.feed.map((post) => {
                //Show everything
                if ((!this.state.onlyTimed && !this.state.onlyPermanent) || (this.state.onlyTimed && this.state.onlyPermanent)) {
                    if (!rendered.includes(post.id)) {
                        if(!this.state.noPagePosts){
                            rendered.push(post.id);
                            if (post.isPagePost) {
                                return <PagePost id={post.id} key={post.id} />
                            }
                            return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                        }else{
                            rendered.push(post.id);
                            if (post.isPagePost) {
                                return <Fragment></Fragment>
                            }
                            return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                        }
                    } else {
                        return (<Fragment key={post.id}></Fragment>)
                    }
                } 
                //Show only timed posts 
                else if (this.state.onlyTimed && !this.state.onlyPermanent) {
                    if (!rendered.includes(post.id) && post.isTemp) {
                        rendered.push(post.id);
                        if (post.isPagePost) {
                            return (<Fragment></Fragment>)
                        }
                        return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                    } else {
                        return (<Fragment key={post.id}></Fragment>)
                    }
                //Show permanent posts only
                } else if (!this.state.onlyTimed && this.state.onlyPermanent) {
                    if (!rendered.includes(post.id) && !post.isTemp) {
                        if(!this.state.noPagePosts){
                            if (post.isPagePost) {
                                return <PagePost id={post.id} key={post.id} />
                            }
                            rendered.push(post.id);
                            return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                        }else{
                            if (post.isPagePost) {
                                return <Fragment></Fragment>
                            }
                            rendered.push(post.id);
                            return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                        }
                    }
                }
            })
        }
        return (
            <Fragment>
                <Header />
                <div id="feedContainer">
                    <Drawer anchor="bottom" open={this.state.postDialogOpen} onClose={this.closeDialog} style={{ padding: "20px" }}>
                        <Tabs
                            value={this.state.tabValue}
                            onChange={(e, newValue) => { this.setState({ tabValue: newValue }) }}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Permanent Posts" />
                            <Tab label="Temporary Posts" />
                            <Tab label="Pages" />
                        </Tabs>
                        <TabPanel value={this.state.tabValue} index={0}>
                            <PostUploader />
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={1}>
                            <TempPostUploader />
                        </TabPanel>
                        <TabPanel value={this.state.tabValue} index={2}>
                            <PagePostUploader />
                        </TabPanel>
                    </Drawer>
                    <Drawer anchor="bottom" open={this.state.tempPostDialog} onClose={this.closeDialog} style={{ padding: "20px" }}>

                    </Drawer>
                    <div id="userStuff">
                        <Grid container spacing={0}>
                            <Grid item xs={2} lg={1} sm={1} md={1}>
                                <Avatar alt="User Profile" src={this.state.userImage} />
                            </Grid>
                            <Grid item >
                                {this.props.name}
                            </Grid>
                        </Grid>
                        <br />
                        <ExpansionPanel id="feedSettingsLight">
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                Feed settings
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Switch checked={this.state.noPagePosts} onChange={(e) => { this.setState({ noPagePosts: e.target.checked }) }} name="noPage" />}
                                        label="Don't show posts from subscribed pages"
                                    />
                                    <br />
                                    <FormControlLabel
                                        control={<Switch checked={this.state.onlyTimed} onChange={(e) => { this.setState({ onlyTimed: e.target.checked }) }} name="timed" />}
                                        label="Show only timed posts"
                                    />
                                    <br />
                                    <FormControlLabel
                                        control={<Switch checked={this.state.onlyPermanent} onChange={(e) => { this.setState({ onlyPermanent: e.target.checked }) }} name="permanent" />}
                                        label="Show only permanent posts"
                                    />
                                </FormGroup>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                    <CustomAlert 
                        text="Introducing Pages! Create public pages for your hobby or creations, that can be shared with anyone. Click here to learn more and create a page!" 
                        link="/pages"
                        storageKey="newPage"
                    />
                    <div id="feedMain">
                        {feedPosts}
                    </div>
                    <div id="fabIcon" className="animated">
                        <Fab color="secondary" aria-label="edit" onClick={this.createPostButton} style={{ outlineStyle: "none" }}><EditIcon /></Fab>
                        {/* <SpeedDial
                            ariaLabel="SpeedDial"
                            hidden={this.state.fabHidden}
                            icon={}
                            onClose={() => this.setState({ fabOpen: false })}
                            onOpen={() => this.setState({ fabOpen: true })}
                            open={this.state.fabOpen}
                            direction={'up'}
                            style={{ outlineStyle: "none", color: "red" }}
                            color="secondary"
                        >
                            <SpeedDialAction
                                key={'Post Image'}
                                icon={<AddAPhotoIcon />}
                                tooltipTitle={'Post Image'}
                                onClick={this.createPostButton}
                                style={{ outlineStyle: "none" }}
                            />
                            <SpeedDialAction
                                key={'Temp Post'}
                                icon={<TimelapseIcon />}
                                tooltipTitle={'Create a temporary post'}
                                onClick={this.createTempPost}
                                style={{ outlineStyle: "none" }}
                            />
                        </SpeedDial> */}
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
    theme: state.auth.theme
})
export default connect(mapStateToProps, { logOut })(Feed);