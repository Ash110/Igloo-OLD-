import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Bottom from '../../components/Bottom/Bottom';
import Header from '../../components/Header/Header';
import PageEditor from '../../components/PageEditor/PageEditor';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Button, Dialog, Slide, Fab, Drawer, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';

import './EditPages.css'




export default class EditPages extends Component {
    state = {
        pages: [],
        loaded: false,
        open: false,
        bottom: false,
        selectedPage: {
            id: "",
            name: "",
            desc: "",
            username:""
        },
        newPageName: "",
        newPageUsername: "",
        newPageUsername :"",
        whatArePages: false,
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/pages/getPages', {}, config)
            .then((res) => {
                this.setState({ pages: res.data, loaded: true });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    handleClose = () => {
        this.setState({ open: false, selectedId: "" });
        //Reloading cause after one opening of a page, the next one is not opening that way. So some state fix or something idk
        window.location.reload();
    }

    //Call the component to edit page members
    editPage = (id, name, desc, username) => {
        const selectedPage = {
            id, name, desc, username
        }
        this.setState({ selectedPage, open: true })
    }

    openDrawer = () => {
        this.setState({ bottom: true })
    }
    cancelAddPage = () => {
        this.setState({ bottom: false, newPageDesc: "", newPageName: "", newPageUsername:"" });
    }
    addNewPage = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const pageName = this.state.newPageName;
        const pageDescription = this.state.newPageDesc;
        const pageUsername = this.state.newPageUsername;
        if (!pageName) {
            alert("You need to set a page name!")
        }
        if (!pageDescription) {
            alert("You need to set a page description!")
        }
        if (!pageUsername) {
            alert("You need to set a page username to identify it!")
        }
        else {
            axios.post("/api/pages/newPage", { pageName, pageDescription, pageUsername }, config)
                .then((res) => {
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err.response.data)
                    console.log(err.response);
                })
        }
    }

    render() {
        //Render the Pages 
        if (this.state.loaded) {
            if(this.state.pages.length > 0){
                var pagesRender = this.state.pages.map((page, index) => {
                    return (
                        <ListItem alignItems="flex-start" key={page._id} onClick={() => this.editPage(page._id, page.name, page.description, page.username)}>
                            <ListItemAvatar>
                                <Avatar>{page.name.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={page.name}
                                secondary={
                                    <React.Fragment>
                                        {page.username}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    )
                })
            }else{
                pagesRender = (<h5 style={{padding : "40px"}}>Go ahead, create a page for a hobby or a community</h5>)
            }
        } else {
            pagesRender = (<CircularProgress style={{ marginTop: "100px", marginLeft: "200px" }} />)
        }
        const Transition = React.forwardRef(function Transition(props, ref) {
            return <Slide direction="up" ref={ref} {...props} />;
        });
        const addPageDialog = (
            <div style={{ padding: "40px" }}>
                <h5>Create a new page</h5>
                <TextField
                    label="Enter Page Name"
                    style={{ width: "80%" }}
                    onChange={(e) => this.setState({ newPageName: e.target.value })}
                    required
                />
                <br /><br />
                <TextField
                    label="Enter unique page username"
                    style={{ width: "80%" }}
                    onChange={(e) => this.setState({ newPageUsername: e.target.value })}
                    required
                />
                <br /><br />
                <TextField
                    label="Enter page description"
                    style={{ width: "80%" }}
                    required
                    placeholder="Tell the users what the page is about"
                    onChange={(e) => this.setState({ newPageDesc: e.target.value })}
                />
                <br /><br />
                <Button color="primary" onClick={this.addNewPage}>Add Page</Button>
                <Button color="secondary" onClick={this.cancelAddPage}>Cancel</Button>
            </div>
        )

        return (
            <Fragment>
                <Header />
                <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <PageEditor id={this.state.selectedPage.id} name={this.state.selectedPage.name} desc={this.state.selectedPage.desc} username={this.state.selectedPage.username} close={this.handleClose} />
                </Dialog>
                <Drawer anchor="bottom" open={this.state.bottom} onClose={this.drawerClose}>
                    {addPageDialog}
                </Drawer>
                <Drawer anchor="bottom" open={this.state.whatArePages} onClose={() => { this.setState({ whatArePages: false }) }}>
                    <div style={{ padding: "30px" }}>
                        <b>What are Pages?</b>
                        <br />
                        <br />
                        Pages are a collection of public posts viewable by all. Each page is linked to a person, and anyone can subscribe to the page to view the posts on their feed.
                        <br /><br />
                        <Button variant="text" color="secondary" onClick={() => this.setState({ whatArePages: false })} >
                            Close
                        </Button>
                    </div>
                </Drawer>
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => this.setState({ whatArePages: true })}
                    style={{ marginLeft: "30px", marginTop: "60px" }}
                >
                    What are Pages?
                </Button>
                <List id="PagesList">
                    {pagesRender}
                </List>
                <Fab color="secondary" aria-label="edit" id="addPageButton" onClick={this.openDrawer}>
                    <AddIcon />
                </Fab>
                <Bottom />
            </Fragment>
        )
    }
}
