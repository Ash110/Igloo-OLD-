import React, { Component } from 'react';
import axios from 'axios';
import { CircularProgress, List } from '@material-ui/core';

import ViewLikesList from './ViewLikesList'



export default class ViewLikes extends Component {
    state = {
        loaded: false,
        likes: []
    }
    componentDidMount() {
        const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials : true
            }
        axios.post('/api/posts/getLikes', { id: this.props.id, type: this.props.type }, config)
            .then((res) => {
                this.setState({ likes: res.data, loaded: true })
            })
            .catch((err) => {
                console.log(err)
                alert("There has been an error. Please try after a while");
            })
    }
    render() {
        if(!this.state.loaded){
            return (<CircularProgress style={{ position: "relative", marginLeft: "45%" }} />)
        }
        var likes = this.state.likes.map((like) => <ViewLikesList like={like}/> )
        return (
            <div style={{padding : "30px"}}>
                <List>
                    {likes}
                </List>
            </div>
        )
    }
}
