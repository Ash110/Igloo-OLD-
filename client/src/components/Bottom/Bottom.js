import React, {} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import './Bottom.css';
import { connect } from 'react-redux';
import { Badge } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';




class Bottom extends React.Component {
    state = {
        active: 0,
        notifications: false
    }
    componentDidMount() {
        var prevScrollpos = window.pageYOffset;
        window.onscroll = () => {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                const Bottom = document.getElementById("lightBottom");
                const fabIcon = document.getElementById("fabIcon");
                if (fabIcon && Bottom) {
                    Bottom.style.visibility = "visible";
                    fabIcon.style.visibility = "visible";
                    Bottom.classList.add("slideInUp");
                    fabIcon.classList.add("slideInUp");
                }
                else if (Bottom) {
                    Bottom.style.visibility = "visible";
                    Bottom.classList.add("slideInUp");
                }
            } else {
                const Bottom = document.getElementById("lightBottom");
                const fabIcon = document.getElementById("fabIcon");
                if (fabIcon && Bottom) {
                    Bottom.classList.remove("slideInUp");
                    fabIcon.classList.remove("slideInUp");
                    Bottom.style.visibility = "hidden";
                    fabIcon.style.visibility = "hidden";
                } else if (Bottom) {
                    Bottom.classList.remove("slideInUp");
                    Bottom.style.visibility = "hidden";
                }
            }
            prevScrollpos = currentScrollPos;
        
        
        
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/notifications/checkNewNotifications', {}, config)
            .then((res) => {
                this.setState({ notifications: res.data})
            })
            .catch((err) => {
                alert("There has been an error. Please try after a while");
                console.log(err);
            })
        
    }
    render() {
        if(this.props.theme==='light'){
            var bottomId = "lightBottom";
        }else{
            bottomId = 'darkBottom';
        }
        return (
            <div id="lightBottom" className="animated">
                <Container>
                    <Row>

                        <Col>
                            {
                                window.location.pathname === "/" ?
                                    <Link to="/">
                                        <HomeIcon style={{ color: "#DD504D" }} />
                                    </Link>
                                    :
                                    <Link to="/">
                                        <HomeIcon />
                                    </Link>
                            }
                        </Col>
                        <Col>
                            {
                                window.location.pathname === "/search" ?
                                    <Link to="/search">
                                        <SearchIcon style={{ color: "#DD504D" }} />
                                    </Link>
                                    :
                                    <Link to="/search">
                                        <SearchIcon />
                                    </Link>
                            }
                        </Col>
                        <Col>
                            {
                                window.location.pathname === "/notifications" ?
                                    <Link to="/notifications">
                                        <NotificationsIcon style={{ color: "#DD504D" }} />
                                    </Link>
                                    :
                                    <Link to="/notifications">
                                        {this.state.notifications ?
                                            <Badge color="secondary" variant="dot">
                                                <NotificationsIcon />
                                            </Badge>
                                        :
                                            <NotificationsIcon />
                                        }
                                    </Link>
                            }
                        </Col>
                        <Col>
                            {
                                window.location.pathname === "/profile" ?
                                    <Link to="/profile">
                                        <PersonIcon style={{ color: "#DD504D" }} />
                                    </Link>
                                    :
                                    <Link to="/profile">
                                        <PersonIcon />
                                    </Link>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    theme : state.auth.theme
})

export default connect(mapStateToProps, null)(Bottom);