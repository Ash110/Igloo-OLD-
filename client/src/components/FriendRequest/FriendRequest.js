import React, { Component } from 'react';
import axios from 'axios'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Avatar, ListItem, ListItemAvatar, List, Divider, ListItemText } from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';
import { getProfilePicture } from '../../functions/GetProfilePicture';



export default class FriendRequest extends Component {
    state = {
        name: "",
        username: "",
        id: "",
        profilePicture: "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png",
        accepted: false,
        rejected: false
    }
    componentDidMount() {
        const { name, username, _id } = this.props.request;
        this.setState({ name, username, id: _id });
        getProfilePicture(_id)
            .then((res) => {
                this.setState({ profilePicture: res })
            });    
    }
    render() {
        const acceptRequest = (userID) => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            axios.post('/api/friends/acceptRequest', { accepted: userID}, config)
                .then((res) => {
                    this.setState({ accepted: true })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        const rejectRequest = (userID) => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            axios.post('/api/friends/rejectRequest', {rejected: userID}, config)
                .then((res) => {
                    this.setState({ rejected: true })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        const rejectStatus = () => this.state.rejected ? <Close style={{ color: "red" }} /> : "Reject";
        const acceptStatus = () => this.state.accepted ? <Done style={{ color: "green" }} /> : "Accept";
        if(this.state.rejected===true || this.state.accepted===true){
            return(<React.Fragment></React.Fragment>)
        }
        return (
            <List>
                <Link to={`/user/${this.state.username}`} >
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={this.state.name} src={this.state.profilePicture} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={this.state.name}
                            secondary={
                                <React.Fragment>
                                    @{this.state.username}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </Link>
                <ListItem style={{ flexDirection: "row-reverse" }}>
                    {!this.state.rejected ? <Button variant="link" style={{ color: "green" }} onClick={() => acceptRequest(this.state.id)}>{acceptStatus()}</Button> : <div></div>}
                        {!this.state.accepted ? <Button variant="link" style={{ color: "red" }} onClick={() => rejectRequest(this.state.id)}>{rejectStatus()}</Button> : <div></div> }
                </ListItem>
                <Divider variant="inset" component="li" />
            </List>
            // <ListGroup.Item>
            //     <Link to={this.props.link} >
            //         <Container>
            //             <Row>
            //                 <Col>
            //                     <Avatar alt={this.state.name} src={this.state.profilePicture} />
            //                     <span style={{ color: "black" }}>{this.state.name}</span>
            //                 </Col>
            //             </Row>
            //             <Row>
            //                 <Col><small style={{ color: "black" }}>@{this.state.username}</small></Col>
            //             </Row>
            //         </Container>
            //     </Link>
            //     <Container>
            //         <Row>
            //             <Col></Col>
            //             <Col></Col>
            //             <Col>
            //                 <Button variant="link" style={{ color: "red" }} onClick={() => rejectRequest(this.state.id)}>Reject</Button>
            //             </Col>
            //             <Col>
            //             </Col>
            //         </Row>
            //     </Container>
            // </ListGroup.Item>
        )
    }
}

