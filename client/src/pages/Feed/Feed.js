import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { logOut } from '../../actions/authAction';
import { Drawer, Avatar, Grid, Fab, Tabs, Tab, Button, Paper, Dialog, DialogTitle } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { CircularProgress, FormGroup, FormControlLabel, Switch, Typography, Box } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
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

function getSteps() {
    return ['Welcome to Igloo', 'Create a group', 'Create A Page', 'Follow your friends','Create a new post', 'Change account settings'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return `Welcome to Igloo - the private, ad-free social media that respects your data. Experience a new way
            to share your memories with the people who matter the most. Check out this small tutorial on how to use Igloo.`;
        case 1:
            return (
                <div>
                    A group is a set of your friends you choose to share with. You can create a group for family, one for work
                    and as many more as you want. 
                    When you create a new post, you can choose a group to share with, 
                    and only members of that group will be able to see the post.
                    <br/>
                    <b>How do I create a group?</b>
                    <br />Go to your profile page, and click on <i>Account Options -> My Groups</i> to manage your groups
            </div>);
        case 2:
            return (
                <div>
                    Pages on Igloo are a public group of posts anyone can view. Ever wanted to create a blog for your photography, or hobbies?
                    <br/>
                    Now with Igloo, you don't need a different account for that. Just create a page for your hobby and share posts to that page. 
                    The page is public and anyone can now view your skills!
                    <br />
                    <b>How do I create a Page?</b>
                    <br />Go to your profile page, and click on <i>Account Options -> My Pages</i> to manage your pages.
                </div>);
        case 3:
            return (
                <div>
                    Go to the search page and search for your friends. Invite as many of your friends to join Igloo - the more the merrier. 
                </div>);
        case 4:
            return (
                <div>
                    <b>How do you create a new post?</b>
                    <p>
                        On the home page, click on the red button on the bottom right corner to create a new post. On igloo you have 3 kinds of posts - 
                        <dl>
                            <dt>Permanent Posts</dt>
                            <dd>These posts are private posts that you share with your groups. Permanent posts are shown on your profile forever.</dd>
                            <dt>Temporary Posts</dt>
                            <dd>Temporary posts are also private posts that only members of the group you share with can view. However, these posts last only 24 hours.</dd>
                            <dt>Page Posts</dt>
                            <dd>Page Posts are posts you share with any page you have. To create a page post, you need to create a page first. These posts are public, appear on your page, but not your profile.</dd>
                        </dl>
                    </p>
                </div>);
        case 5:
            return (
                <div>
                    <b>Upload a profile picture, change your bio and more...</b>
                    <p>
                        We're so glad to have you Igloo. Let's all get rid of the intrusive social media sites and make a shift. 
                        <br/>
                        To get started, complete your profile. Upload a profile picture, add to your bio, link your telegram account and much more. 
                        Click on the link below to go to settings to complete your profile. 
                        <br/><br/>
                        <Button onClick={() => window.location.href="/settings"} variant="outlined" color="primary">
                            Change account settings
                        </Button>
                    </p>
                </div>);
        default:
            return 'Unknown step';
    }
}

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
        newUser: false,
        activeStep: 0

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
                var newUser = false;
                if (this.props.location.search === "?welcome=true") {
                    newUser = true;
                    window.history.pushState({}, document.title, "/");
                    window.history.replaceState({}, document.title, "/");

                }
                const userImage = await getProfilePicture(res.data.userId);
                this.setState({ feed: [...res.data.allFeedPosts], userImage, loaded: true, newUser });
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

    handleNext = () => {
        const activeStep = this.state.activeStep + 1;
        this.setState({ activeStep });
    };

    handleBack = () => {
        const activeStep = this.state.activeStep - 1;
        this.setState({ activeStep });
    };

    handleReset = () => {
        const activeStep = 0;
        this.setState({ activeStep });
    };

    createPostButton = () => {
        this.setState({ postDialogOpen: true, fabOpen: false, alert: "Dialog opened" });
    }
    createTempPost = () => {
        this.setState({ tempPostDialog: true, fabOpen: false });
    }
    render() {

        const steps = getSteps();

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
                        if (!this.state.noPagePosts) {
                            rendered.push(post.id);
                            if (post.isPagePost) {
                                return <PagePost id={post.id} key={post.id} />
                            }
                            return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                        } else {
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
                        if (!this.state.noPagePosts) {
                            if (post.isPagePost) {
                                return <PagePost id={post.id} key={post.id} />
                            }
                            rendered.push(post.id);
                            return (<Post id={post.id} key={post.id} isText={post.isText} isTemp={post.isTemp.toString()} />)
                        } else {
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
                <div>
                    {this.state.newUser ?
                        <Dialog onClose={() => this.setState({newUser : false})} aria-labelledby="simple-dialog-title" open={this.state.newUser}>
                            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
                            <Fragment>
                                <Stepper activeStep={this.state.activeStep} orientation="vertical">
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                            <StepContent>
                                                <Typography>{getStepContent(index)}</Typography>
                                                <div>
                                                    <br/><br/>
                                                    <div>
                                                        <Button
                                                            disabled={this.state.activeStep === 0}
                                                            onClick={this.handleBack}
                                                        >
                                                            Back
                                                    </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={this.handleNext}
                                                        >
                                                            {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                                {this.state.activeStep === steps.length && (
                                    <Paper square elevation={0} style={{padding:"20px"}}>
                                        <Typography>All steps completed - you&apos;re finished</Typography>
                                        <br />
                                        <Button onClick={this.handleReset}>
                                            View tutorial again
                                        </Button>
                                        <br />
                                        <br />
                                        <Button onClick={this.setState({newUser : false})} variant="contained" color="primary">
                                            Get started!
                                        </Button>
                                    </Paper>
                                )}
                            </Fragment>
                        </Dialog>
                        :
                        <Fragment></Fragment>
                    }
                </div>
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
                        <ExpansionPanel  id="feedSettingsLight">
                            <ExpansionPanelSummary 
                                style={{ boxShadow: "none", WebkitBoxShadow:"none", MozBoxShadow:"none", border:"none", background:"white" }}
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