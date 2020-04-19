import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Toolbar, IconButton, List, ListItem, ListItemText, ListItemAvatar, Button, Checkbox, TextField } from '@material-ui/core';
import Loading from '../Loading/Loading'
import CloseIcon from '@material-ui/icons/Close';


export default class PageEditor extends Component {
    state = {
        loaded: false,
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/pages/getEditPageInfo', { id: this.props.id }, config)
            .then((res) => {
                const { name, username, description, memberCount } = res.data
                this.setState({ name, username, description, memberCount, loaded : true });
            })
            .catch((err) => {
                alert(err.response.data)
                console.log(err);
            })
    }

    closeHandler = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const{name, username, description} = this.state;
        if(!(name&&description)){
            alert("All fields are required!")
        }else{
            axios.post('/api/pages/updatePage', { name, username, description, id: this.props.id }, config)
                .then((res) => {
                    this.props.close()
                })
                .catch((err) => {
                    alert(err.response.data);
                    console.log(err);
                })
        }
    }
    deletePage = () => {
        const x = window.confirm("Are you sure you want to delete the Page? The action is irreversible")
        if (x) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            axios.post('/api/Pages/deletePage', { PageId: this.props.id }, config)
                .then((res) => {
                    this.props.close()
                })
                .catch((err) => {
                    alert("Unable to delete Page. Please Try after a while");
                    console.log(err);
                })
        }
    }

    render() {
        if (!this.state.loaded) {
            return <Loading />
        }
        return (
            <Fragment>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="close" onClick={()=> window.location.reload()}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <br />
                <h4 style={{ width: "80%", marginLeft: "10%" }}>How do I post to this page?</h4>
                <br/>

                <p style={{ width: "80%", marginLeft: "10%" }}>
                    Go to your homepage, and click on the new post button. Over there, click on the pages tab, to post to a particular page 
                </p>
                <br/><br/>
                <TextField
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                    variant="outlined"
                    label="Edit Page Name"
                    style={{ width: "80%", marginLeft: "10%" }}
                />
                {/* <br />
                <TextField
                    value={this.state.username}
                    onChange={(e) => this.setState({ username: e.target.value })}
                    variant="outlined"
                    label="Change username if needed"
                    style={{ width: "80%", marginLeft: "10%" }}
                /> */}
                <br />
                <TextField
                    value={this.state.description}
                    onChange={(e) => this.setState({ description: e.target.value })}
                    variant="outlined"
                    label="Edit Page Description"
                    placeholder="Enter Page Description"
                    style={{ width: "80%", marginLeft: "10%" }}
                />
                <br />
                <p style={{textAlign : "center"}}>{this.state.memberCount} Subscribers</p>
                <br /><br />
                <Button color="primary" variant="contained" onClick={this.closeHandler} style={{ width: "50%", marginLeft: "25%" }}>
                    Save
                </Button>
                <br /><br />
                {/* <Button variant="contained" onClick={this.deletePage} style={{ width: "50%", marginLeft: "25%", backgroundColor: "red" }}>
                    Delete Page
                </Button> */}
            </Fragment>
        )
    }
}
