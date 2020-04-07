import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../Loading/Loading'

import { List } from '@material-ui/core';
import PageListItem from './PagesListItem';



export default class PageList extends Component {
    state = {
        pages: [],
        loaded: false
    }
    componentDidMount() {
        const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials : true
            }
        axios.post('/api/pages/getPageList',{id : this.props.id}, config)
            .then((res) => {
                this.setState({ pages: res.data, loaded: true });
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
        if(this.state.pages.length===0){
            return(<div style={{padding : "20px"}}>Nothing to show here yet</div>)
        }
        return (
            <div>
                <List>
                    {this.state.pages.map((page) => {
                        return (<PageListItem page={page} key={page.username}/>)
                    })}
                </List>
            </div>
        )
    }
}