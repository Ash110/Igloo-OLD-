import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Toolbar, IconButton, List, ListItem, ListItemText, ListItemAvatar, Button, Checkbox, TextField } from '@material-ui/core';
import Loading from '../../components/Loading/Loading'
import CloseIcon from '@material-ui/icons/Close';




export default class GroupEditor extends Component {
    state = {
        groupMembers: [],
        notInGroup: [],
        loaded: false,
        groupName: "",
        groupDescription: "",
        search : ""
    }
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/groups/getGroupInfo', { groupId: this.props.id }, config)
            .then((res) => {
                const { groupMembers, notInGroup, groupName, groupDescription } = res.data
                this.setState({ groupMembers, notInGroup, loaded: true, groupName, groupDescription });
            })
            .catch((err) => {
                console.log(err);
            })
    }
    addToGroup = (person, index) => {
        let groupMembers = this.state.groupMembers;
        let notInGroup = this.state.notInGroup
        notInGroup.splice(index, 1);
        groupMembers.push(person);
        this.setState({ groupMembers, notInGroup });
    }

    removeFromGroup = (person, index) => {
        let groupMembers = this.state.groupMembers;
        let notInGroup = this.state.notInGroup
        groupMembers.splice(index, 1);
        notInGroup.push(person);
        this.setState({ groupMembers, notInGroup });
    }

    closeHandler = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/groups/updateGroup', { groupMembers: this.state.groupMembers, groupId: this.props.id, name: this.state.groupName, description: this.state.groupDescription }, config)
            .then((res) => {
                this.props.close()
            })
            .catch((err) => {
                alert("Unable to update group. Please Try after a while");
                console.log(err);
            })
    }
    deleteGroup = () => {
        const x = window.confirm("Are you sure you want to delete the group? The action is irreversible")
        if (x) {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            axios.post('/api/groups/deleteGroup', { groupId: this.props.id }, config)
                .then((res) => {
                    this.props.close()
                })
                .catch((err) => {
                    alert("Unable to delete group. Please Try after a while");
                    console.log(err);
                })
        }
    }

    render() {
        let notInGroup = this.state.notInGroup;
        let groupMembers = this.state.groupMembers;
        if(this.state.search===""){
            var notMembers = notInGroup.map((person, index) => {
                return (
                    <ListItem alignItems="flex-start" key={person._id}>
                        <ListItemAvatar>
                            <Checkbox
                                checked={false}
                                onChange={() => this.addToGroup(person, index)}
                                value="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}

                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={person.name}
                            secondary={
                                <React.Fragment>
                                    @{person.username}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                )
            });
        }else{
            notMembers = notInGroup.map((person, index) => {
                if(person.name.search(this.state.search) !==- 1){
                    return (
                        <ListItem alignItems="flex-start" key={person._id}>
                            <ListItemAvatar>
                                <Checkbox
                                    checked={false}
                                    onChange={() => this.addToGroup(person, index)}
                                    value="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}

                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={person.name}
                                secondary={
                                    <React.Fragment>
                                        @{person.username}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    )
                }else{
                    return(<Fragment></Fragment>)
                }
            });
        }
        if (this.state.search === "") {
            var areMembers = groupMembers.map((person, index) => {
                return (
                    <ListItem alignItems="flex-start" key={person._id}>
                        <ListItemAvatar>
                            <Checkbox
                                checked={true}
                                onChange={() => this.removeFromGroup(person, index)}
                                value="secondary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={person.name}
                            secondary={
                                <React.Fragment>
                                    @{person.username}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                )
            });
        }else{
            areMembers = groupMembers.map((person, index) => {
                if (person.name.search(this.state.search) !== - 1) {
                    return (
                        <ListItem alignItems="flex-start" key={person._id}>
                            <ListItemAvatar>
                                <Checkbox
                                    checked={true}
                                    onChange={() => this.removeFromGroup(person, index)}
                                    value="secondary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={person.name}
                                secondary={
                                    <React.Fragment>
                                        @{person.username}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    )
                } else {
                    return (<Fragment></Fragment>)
                }
            });
        }

        if (!this.state.loaded) {
            return <Loading />
        }
        return (
            <Fragment>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="close" onClick={this.closeHandler}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <br />
                <TextField
                    value={this.state.groupName}
                    onChange={(e) => this.setState({ groupName: e.target.value })}
                    variant="outlined"
                    label="Edit Group Name"
                    style={{ width: "80%", marginLeft: "10%" }}
                />
                <br />
                <TextField
                    value={this.state.groupDescription}
                    onChange={(e) => this.setState({ groupDescription: e.target.value })}
                    variant="outlined"
                    label="Edit Group Description"
                    placeholder="Enter Group Description"
                    style={{ width: "80%", marginLeft: "10%" }}
                />
                <br />
                <TextField
                    value={this.state.search}
                    onChange={(e) => this.setState({ search: e.target.value })}
                    variant="standard"
                    label="Search for friends"
                    style={{ width: "80%", marginLeft: "10%" }}
                />
                <br />
                {this.state.groupMembers.length===0 && this.state.notInGroup.length===0 ? 
                    <div style={{padding : "30px"}}>
                        You don't have any friends to add to groups yet. Go ahead, and search for someone!
                    </div>
                    :
                    <Fragment></Fragment>
                }
                <List style={{ marginLeft: "10%" }}>
                    {notMembers}
                    {areMembers}
                </List>
                <br /><br />
                <Button color="primary" variant="contained" onClick={this.closeHandler} style={{ width: "50%", marginLeft: "25%" }}>
                    Save
                </Button>
                <br /><br />
                <Button variant="contained" onClick={this.deleteGroup} style={{ width: "50%", marginLeft: "25%", backgroundColor: "red" }}>
                    Delete Group
                </Button>
            </Fragment>
        )
    }
}
