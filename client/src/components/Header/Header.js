import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { logOut } from '../../actions/authAction';
import './Header.css'
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import PolicyIcon from '@material-ui/icons/Policy';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import HelpIcon from '@material-ui/icons/Help';
// import Brightness2Icon from '@material-ui/icons/Brightness2';
// import Brightness5Icon from '@material-ui/icons/Brightness5';
import { Grid, SwipeableDrawer, Button } from '@material-ui/core';
// import { triggerDarkTheme } from '../../functions/triggerDarkTheme'
// import { triggerLightTheme } from '../../functions/triggerLightTheme'

class Header extends Component {
    state = {
        drawerOpen: false,
    }


    render() {
        // if(this.props.theme==='light'){
        //     var themeIcon = <Brightness2Icon id="headerMenuIcon" onClick={this.props.setDarkTheme}/>
        //     triggerLightTheme();
        //     var headerDrawerId="lightHeaderDrawer"
        //     var headerId = "lightHeader"
        // }else{
        //     themeIcon = <Brightness5Icon id="headerMenuIcon" onClick={this.props.setLightTheme}/>
        //     triggerDarkTheme();
        //     headerDrawerId = "darkHeaderDrawer"
        //     headerId = "darkHeader"
        // }
        return (
            <Fragment>
                <SwipeableDrawer
                    anchor="right"
                    open={this.state.drawerOpen}
                    onClose={() => this.setState({ drawerOpen: false })}
                    onOpen={() => this.setState({ drawerOpen: true })}
                >
                    <div id="lightHeaderDrawer">
                        <List>
                            <ListItem button style={{ marginBottom: "20px" }} onClick={() => window.location.href = "/help"}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <HelpIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Help" />
                            </ListItem>
                            <ListItem button style={{ marginBottom: "20px" }} onClick={() => window.location.href = "/privacypolicy"}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PolicyIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Privacy Policy" />
                            </ListItem>
                            <ListItem button style={{ marginBottom: "20px" }} onClick={() => window.location.href = "/contactus"}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PeopleIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Contact Us" />
                            </ListItem>
                            {
                                this.props.loggedIn ?
                                    <Fragment>
                                        <ListItem key="accountSettingsIfLoggedIn" button style={{ marginBottom: "20px" }} onClick={() => window.location.href = "/settings"}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <SettingsIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Account Settings" />
                                        </ListItem>
                                        <ListItem key="logOutIfLoggedIn" button style={{ marginBottom: "20px" }} onClick={() => this.props.logOut()}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PowerSettingsNewIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Log Out" />
                                        </ListItem>
                                    </Fragment>
                                    :
                                    <Fragment></Fragment>
                            }
                            <div style={{ marginBottom: "20px" }}>
                                <p>The general rule of the internet seems to be</p>
                                <i>If you're not paying for the product,<br /> you are the product</i>
                                <br />
                                <br />
                                <p>We don't want to show ads<br /> or track your usage, ever. <br />And keeping this platform Ad-free <br />means we don't make money, yet</p>
                                <br />
                                <Button variant="contained" color="primary" onClick={() => window.open('https://www.paypal.me/Ash110', '_blank')}>
                                    Donate to keep this running
                                </Button>
                            </div>
                        </List>
                    </div>
                </SwipeableDrawer >
                <div id="lightHeader">
                    <Grid container spacing={0} style={{ background: "white" }}>
                        <Grid item xs={2}>
                            {/* {themeIcon} */}
                        </Grid>
                        <Grid item xs={8}>
                            <Link to="/" style={{ color: "black" }}>
                                IGLOO
                        </Link>
                        </Grid>
                        <Grid item xs={2}>
                            <MenuIcon id="headerMenuIcon" onClick={() => this.setState({ drawerOpen: true })} />
                        </Grid>
                    </Grid>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.auth.theme,
    loggedIn: state.auth.loggedIn
})

export default connect(mapStateToProps, { logOut })(Header);
// export default Header;