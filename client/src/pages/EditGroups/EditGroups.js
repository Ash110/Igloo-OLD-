import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Bottom from '../../components/Bottom/Bottom';
import Header from '../../components/Header/Header';
import GroupEditor from '../../components/GroupEditor/GroupEditor';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress,Button, Dialog, Slide, Fab, Drawer, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';

import './EditGroups.css'




export default class EditGroup extends Component {
    state = {
        groups: [],
        loaded: false,
        open: false,
        bottom: false,
        selectedGroup: {
            id: "",
            name: "",
            desc: ""
        },
        newGroupName:"",
        newGroupDesc:"",
        whatAreGroups : false,
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/groups/getGroups',{}, config)
            .then((res) => {
                this.setState({ groups: res.data, loaded: true });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    handleClose = () => {
        this.setState({ open: false, selectedId: "" });

        //Reloading cause after one opening of a group, the next one is not opening that way. So some state fix or something idk
        window.location.reload();
    }

    //Call the component to edit group members
    editGroup = (id, name, desc) => {
        const selectedGroup = {
            id, name, desc
        }
        this.setState({ selectedGroup, open: true })
    }

    openDrawer = () => {
        this.setState({ bottom: true })
    }
    cancelAddGroup = () => {
        this.setState({bottom:false, newGroupDesc : "", newGroupName :""});
    }
    addNewGroup = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        const groupName = this.state.newGroupName;
        const groupDescription = this.state.newGroupDesc;
        if(!groupName){
            alert("You need to set a group name!")
        }
        else{
            axios.post("/api/groups/newGroup", {groupName, groupDescription}, config)
                .then((res) => {
                    alert("Success!");
                    window.location.reload();
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    }

    render() {
        //Render the groups 
        if (this.state.loaded) {
            var groupsRender = this.state.groups.map((group, index) => {
                if(index === 0){
                    return (
                        //Create an error dialog saying not ediatable
                        <ListItem alignItems="flex-start" key={group._id}>
                            <ListItemAvatar>
                                <Avatar>{group.name.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={group.name}
                                secondary={
                                    <React.Fragment>
                                        {group.description}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    )
                }else{
                    return (
                        <ListItem alignItems="flex-start" key={group._id} onClick={() => this.editGroup(group._id, group.name, group.description)}>
                            <ListItemAvatar>
                                <Avatar>{group.name.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={group.name}
                                secondary={
                                    <React.Fragment>
                                        {group.description}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    )
                } 
            })
        } else {
            groupsRender = (<CircularProgress style={{ marginTop: "100px", marginLeft: "200px" }} />)
        }
        const Transition = React.forwardRef(function Transition(props, ref) {
            return <Slide direction="up" ref={ref} {...props} />;
        });
        const addGroupDialog = (
            <div style={{ padding: "40px" }}>
                <h5>Create a new group</h5>
                <TextField
                    label="Enter Group Name"
                    style={{width:"80%"}}
                    onChange={(e)=>this.setState({newGroupName : e.target.value})}
                    required
                    value={this.state.newGroupName}
                />
                <br/><br/>
                <TextField
                    label="Enter Group Description"
                    style={{ width: "80%" }}
                    onChange={(e) => this.setState({ newGroupDesc: e.target.value })}
                    value = {this.state.newGroupDesc}
                />
                <br/><br/>
                <Button color="primary" onClick={this.addNewGroup}>Add Group</Button>
                <Button color="secondary" onClick={this.cancelAddGroup}>Cancel</Button>
            </div>
        )

        return (
            <Fragment>
                <Header />
                <Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
                    <GroupEditor id={this.state.selectedGroup.id} name={this.state.selectedGroup.name} desc={this.state.selectedGroup.desc} close={this.handleClose} />
                </Dialog>
                <Drawer anchor="bottom" open={this.state.bottom} onClose={this.drawerClose}>
                    {addGroupDialog}
                </Drawer>
                <Drawer anchor="bottom" open={this.state.whatAreGroups} onClose={() => {this.setState({whatAreGroups : false})}}>
                    <div style={{padding : "30px"}}>
                        <b>What are groups?</b>
                        <br />
                        <br/>
                        Groups are a set of people you choose, to share posts with. You can create unlimited groups for your work friends, family and so on, so that you can choose to share a post with a certain group of people, rather than everyone who follows you
                        <br/><br/>
                        <Button variant="text" color="secondary" onClick={() => this.setState({whatAreGroups : false})} >
                            Close
                        </Button>
                    </div>
                </Drawer>
                <Button 
                    variant="text" 
                    color="primary" 
                    onClick={()=>this.setState({whatAreGroups : true})}
                    style={{marginLeft : "30px", marginTop : "60px"}}    
                >
                    What are groups?
                </Button>
                <List id="groupsList">
                    {groupsRender}
                </List>
                <Fab color="secondary" aria-label="edit" id="addGroupButton" onClick={this.openDrawer}>
                    <AddIcon />
                </Fab>
                <Bottom />
            </Fragment>
        )
    }
}
