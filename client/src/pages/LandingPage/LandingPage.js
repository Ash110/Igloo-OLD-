import React, { Component } from 'react'
import { Button, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';
import Img from 'react-image'

export default class LandingPage extends Component {
    componentDidMount(){
        axios.post('/api/stats/pageVisit', {})
        .catch((err) => console.log(err))
    }
    render() {
        return (
            <div id="landingPageBody">
                <div id="leftSide">
                    <p id="landingTitle">
                        IGLOO
                            </p>
                    <p id="landingCaption">
                        Your data in your control
                            </p>
                    <br />
                    <Link to="/register" style={{ textDecoration: "none" }}>
                        <div id="landingButtonsContainer">
                            <Button variant="contained" color="secondary">
                                Sign Up for free!
                                    </Button>
                        </div>
                    </Link>
                    <br />
                    <br />
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <div id="landingButtonsContainer">
                            <Button variant="text" color="primary">
                                Login
                                    </Button>
                        </div>
                    </Link>
                </div>

                {/* Features  */}
                <Grid container>
                    <Grid item xs={12} sm={3} md={3} lg={3} justify="center">
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Img src="./updatedFrontPage.png" id="landingPageImage1" alt="A phone showing the site" />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={9} md={9} lg={9}>
                        <Grid container>
                            <Grid item xs={12}>
                                <div className="landingPageCard">
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Img src="https://image.flaticon.com/icons/svg/149/149079.svg" alt="lock" id="featureImages" />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div className="landingPageCardText">
                                                <div className="landinPageCardTop">
                                                    Private and Secure
                                    </div>
                                                <div className="landinPageCardBottom">
                                                    All your data is in your control and not sold to advertisers
                                    </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="landingPageCard">
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Img src="https://image.flaticon.com/icons/svg/2972/2972531.svg" alt="clock" id="featureImages" />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div className="landingPageCardText">
                                                <div className="landinPageCardTop">
                                                    Chronological Timeline
                                    </div>
                                                <div className="landinPageCardBottom">
                                                    Never miss what's important, as it happens.
                                    </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="landingPageCard">
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Img src="https://image.flaticon.com/icons/svg/1256/1256650.svg" alt="groups" id="featureImages" />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div className="landingPageCardText">
                                                <div className="landinPageCardTop">
                                                    Custom Groups
                                    </div>
                                                <div className="landinPageCardBottom">
                                                    Create unlimited custom groups with friends and share posts only with them
                                    </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="landingPageCard">
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Img src="https://image.flaticon.com/icons/svg/2977/2977644.svg" alt="Ad Free" id="featureImages" />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div className="landingPageCardText">
                                                <div className="landinPageCardTop">
                                                    Ad-Free
                                    </div>
                                                <div className="landinPageCardBottom">
                                                    A simple timeline to focus on memories and nothing else
                                    </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="landingPageCard">
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Img src="https://image.flaticon.com/icons/svg/867/867875.svg" alt="disappearing posts" id="featureImages" />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div className="landingPageCardText">
                                                <div className="landinPageCardTop">
                                                    Temporary posts
                                    </div>
                                                <div className="landinPageCardBottom">
                                                    Post disappearing photos or text for 24 hours
                                    </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="landingPageCard">
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Img src="https://image.flaticon.com/icons/svg/2920/2920329.svg" alt="Clean Design" id="featureImages" />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <div className="landingPageCardText">
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
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                <div id="footer">
                    <div id="attribution">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                    <div id="attribution">Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                </div>                
            </div >
        )
    }
}
