import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading/Loading'

import { List } from '@material-ui/core';
import FriendListItem from './FriendListItem';



export default class FriendsList extends Component {
    state = {
        friends: [],
        loaded: false
    }
    componentDidMount() {
        const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials : true
            }
        axios.post('/api/friends/getFriendsList',{id : this.props.id}, config)
            .then((res) => {
                this.setState({ friends: res.data, loaded: true });
            })
            .catch((err) => {
                alert("There has been an error. Please try after a while");
                console.log(err);
            });
    }
    render() {
        if (!this.state.loaded) {
            return <Loading />
        }
        if(this.state.friends.length===0){
            return(<div style={{padding : "20px"}}>Nothing to show here yet</div>)
        }
        return (
            <div>
                <List>
                    {this.state.friends.map((person) => {
                        return (<FriendListItem person={person} key={person._id}/>)
                    })}
                </List>
            </div>
        )
    }
}