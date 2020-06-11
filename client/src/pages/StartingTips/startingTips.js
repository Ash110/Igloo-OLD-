import React from 'react';
import Img from 'react-image'
// import { Carousel, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Fab, Grid } from '@material-ui/core'
import { connect } from 'react-redux';
import './startingTips.css'
import Loading from '../../components/Loading/Loading';

// const startingTips = (props) => {
//     const nextIcon = (<ChevronRightIcon style={{ color: "#1a1b1c", fontSize: "2rem" }} />);
//     const prevIcon = (<ChevronLeftIcon style={{ color: "#1a1b1c", fontSize: "2rem" }} />);
//     if (props.name === undefined || !props.name) // Wait till user has been set once a user registers/logs in
//         return <Loading></Loading>
//     return (
//         <div className="welcomeBody">
//             <Carousel interval="100000000" nextIcon={nextIcon} prevIcon={prevIcon}>
//                 <Carousel.Item>
//                     <div className="tipContainer1">
//                         <div className="tipBody animated fadeIn">
//                             <p className="greeting">Hello there, {props.name.split(" ")[0]}</p>
//                             <br />
//                             <p className="welcome">Welcome to the private, secure social media that puts <i>you</i> in control</p>
//                             <br />
//                             <p>
//                                 We believe that what you post should be yours and only yours, to share with loved ones.
//                             <br /><br />
//                                 These posts are memories, not data to sell to advertisers.
//                             <br /><br />
//                                 Check out how Igloo is different from what you're probably using
//                         </p>
//                         </div>
//                     </div>
//                 </Carousel.Item>
//                 <Carousel.Item>
//                     <div className="tipContainer1">
//                         <div className="tipBody animated fadeIn">
//                             <p className="greeting">Unlimited Custom Groups</p>
//                             <br />
//                             <p>
//                                 Create as many groups as you want and choose people to be part of that group, so you can share exclusively with them
//                             </p>
//                             <Img src="Groups.png" id="groupsWelcomePage" alt="showing how groups work"/>
//                         </div>
//                     </div>
//                 </Carousel.Item>
//                 <Carousel.Item>
//                     <div className="tipContainer1">
//                         <div className="tipBody animated fadeIn">
//                             <p className="greeting">Posts with complete control over visibility</p>
//                             <br />
//                             <p>
//                                 Create normal posts or temporary posts which expire after a day
//                             </p>
//                             <Img src="Post.png" id="groupsWelcomePage" alt="showing how posts work"/>
//                         </div>
//                     </div>
//                 </Carousel.Item>
//                 <Carousel.Item>
//                     <div className="tipContainer1">
//                         <div className="tipBody">
//                             <p className="greeting">And there's so much more waiting inside</p>
//                             <p>
//                                 We're glad to have you on board. 
//                                 <br/>
//                                 <br />
//                                 No one should have their data sold without their permission, and constantly tracked only to have their feed filled with countless ads and sponsored content.
//                                 <br/>
//                                 <br />
//                                 We hope you can get your friends to shift over too. 
//                             <br /><br /><br />
//                                 <Link to="/profile">
//                                     <Button>Finish your profile</Button>
//                                 </Link>
//                             </p>
//                         </div>
//                     </div>
//                 </Carousel.Item>
//             </Carousel>
//         </div>
//     )
// };
class startingTips extends React.Component {
    state = {
        page: 0
    }
    render() {
        if (this.props.name === undefined || !this.props.name) // Wait till user has been set once a user registers/logs in
            return <Loading></Loading>
        if (this.state.page === 0) {
            return (
                <div id="tipContainer">
                    <Grid container spacing={0} alignContent="center" justify="center">
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <p className="greeting">Hello there, {this.props.name.split(" ")[0]}</p>
                            <br />
                            <p className="welcome">Welcome to the private, secure social media that puts <i>you</i> in control</p>
                            <br />
                            <p>
                                We believe that what you post should be yours and only yours, to share with loved ones.
                            <br /><br />
                                These posts are memories, not data to sell to advertisers.
                            <br /><br />
                                Check out how Igloo is different from what you're probably using
                        </p>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Fab color="secondary" aria-label="edit" className="welcomeNextButton">
                            <ChevronRightIcon />
                        </Fab>
                    </Grid>
                </div>
            )
        }
    }
}

const mapStateToProps = state => ({
    name: state.auth.name
})
export default connect(mapStateToProps, null)(startingTips);