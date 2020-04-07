import React, { Component } from 'react'
import { Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Img from 'react-image'

export default class LandingPage extends Component {

    render() {
        return (
            <div id="landingPageBody">
                <div id="landingPageContainer">
                    <p id="landingTitle">
                        IGLOO
                    </p>
                    <p id="landingCaption">
                        Your data in your control
                    </p>
                    <br /><br /><br />
                    <Link to="/register">
                        <div id="landingButtonsContainer">
                            <Button variant="contained" color="secondary">
                                Sign Up for free!
                            </Button>
                        </div>
                    </Link>
                    <br />
                    <br />
                    <Link to="/login">
                        <div id="landingButtonsContainer">
                            <Button variant="text" color="primary">
                                Login
                            </Button>
                        </div>
                    </Link>
                    <Img src="./LandingPage1.png" id="landingPageImage1" alt="A phone and laptop showing the site"/>
                    <Grid container spacing={2} style={{marginTop : "30px"}}>
                        <Grid item xs={12} md={6} lg={6}>
                            <div className="landingPageCard">
                                <div className="landinPageCardTop">
                                    Private and Secure
                                </div>
                                <div className="landinPageCardBottom">
                                    All your data is in your control and not sold to advertisers
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <div className="landingPageCard">
                                <div className="landinPageCardTop">
                                    Chronological Timeline
                                </div>
                                <div className="landinPageCardBottom">
                                    Never miss what's important, as it happens.
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <div className="landingPageCard">
                                <div className="landinPageCardTop">
                                    Custom Groups
                                </div>
                                <div className="landinPageCardBottom">
                                    Create unlimited custom groups with friends and share posts only with them
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <div className="landingPageCard">
                                <div className="landinPageCardTop">
                                    Ad-Free
                                </div>
                                <div className="landinPageCardBottom">
                                    A simple timeline to focus on memories and nothing else
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <div className="landingPageCard">
                                <div className="landinPageCardTop">
                                    Temporary posts
                                </div>
                                <div className="landinPageCardBottom">
                                    Post disappearing photos or text for 24 hours
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <div className="landingPageCard">
                                <div className="landinPageCardTop">
                                    Clean Design
                                </div>
                                <div className="landinPageCardBottom">
                                    A beautiful minimal view for the best experience 
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div >
        )
    }
}
