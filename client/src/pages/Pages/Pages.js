import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux'
import {Grid, Button,Dialog,DialogTitle } from '@material-ui/core';
import Loading from '../../components/Loading/Loading';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import axios from 'axios';
import Page404 from '../Page404/Page404';
import Header from '../../components/Header/Header';
import Bottom from '../../components/Bottom/Bottom';
import PagePost from '../../components/PagePost/PagePost'

import './Pages.css'


class Pages extends Component {
    state = {
        posts: [],
        creator: {},
        isSubscribed: false,
        loaded: false,
        infoDialog : false,
        notFound : false
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/pages/getPageInfo', { username: this.props.match.params.username, pagename: this.props.match.params.pagename }, config)
            .then((res) => {
                const { posts, creator, description, isSubscribed, name } = res.data;
                this.setState({ posts, creator, isSubscribed, name, description, loaded: true });
            })
            .catch((err) => {
                this.setState({notFound : true, loaded : true});
                console.log(err);
            })
    }
    subscribePage = () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/pages/subscribePage',{ username: this.props.match.params.username, pagename: this.props.match.params.pagename },config)
            .then(()=>{
                this.setState({isSubscribed : true})
            })
            .catch((err) => {
                alert(err.response.data);
            })
    }

    unsubscribePage = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/pages/unsubscribePage', { username: this.props.match.params.username, pagename: this.props.match.params.pagename }, config)
            .then(() => {
                this.setState({isSubscribed : false})
            })
            .catch((err) => {
                alert(err.response.data);
            })
    }

    render() {
        if (!this.state.loaded) {
            return (<Loading />)
        }
        if(this.state.notFound){
            return <Page404/>
        }
        if (this.state.isSubscribed) {
            var subscribeButton = <Button onClick={this.unsubscribePage} color="default" variant="contained">Unfollow Page</Button>
        } else {
            var subscribeButton = <Button onClick={this.subscribePage} color="primary" variant="contained">Follow Page</Button>
        }
        var pagePosts = this.state.posts.map((post)=>{
            return (<PagePost id={post}/>)
        })
        return (
            <Fragment>
                <Dialog onClose={()=>{this.setState({infoDialog : false})}} aria-labelledby="simple-dialog-title" open={this.state.infoDialog}>
                    <DialogTitle id="simple-dialog-title">About the page</DialogTitle>
                    <p style={{padding : "30px"}}>{this.state.description}</p>
                </Dialog>
                <div>
                    <Header />
                    <div id="pageHeader">
                        <h3>
                            {this.state.name}
                        </h3>
                        <br />
                        <p>A page by <a href={`/user/${this.state.creator.username}`}>{this.state.creator.name}</a></p>
                        <InfoOutlinedIcon fontSize="small" onClick={() => this.setState({infoDialog : true})} />
                        <br />
                        <br />
                        {this.props.loggedIn ? subscribeButton : <Fragment></Fragment>}
                    </div>
                    {pagePosts}
                    {this.props.loggedIn ? <Bottom /> : <Fragment></Fragment>}
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
})
export default connect(mapStateToProps, null)(Pages);