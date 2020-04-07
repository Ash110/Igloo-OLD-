import React, { Component } from 'react';
import { TextField, Button, CircularProgress, ListItem, ListItemAvatar, Checkbox, ListItemText, List, IconButton } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

import axios from 'axios'
import './TextUploader.css'


export default class TextUploader extends Component {
    state = {
        caption: "",
        loaded: false,
        groups: [],
        selectedGroups: [],
        submittingStage: 0
    }

    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/groups/getGroups', {}, config)
            .then((res) => {
                this.setState({ groups: res.data, loaded: true });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    submitTextUpdate = async () => {
        if(this.state.selectedGroups.length>0){
            this.setState({ submittingStage: 1 })
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            }
            // Make an AJAX upload request using Axios
            const caption = this.state.caption;
            axios.post('/api/posts/newTextUpdate', { isText: true, caption, groups: this.state.selectedGroups }, config)
                .then(response => {
                    this.setState({ submittingStage: 2 })
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                })
        }else{
            alert("Choose a group to share with");
        }
    }
    addToSelected = (group) => {
        let selectedGroups = [...this.state.selectedGroups];
        selectedGroups.push(group)
        let groups = [...this.state.groups]
        for (let i = 0; i < groups.length; i++) {
            if (groups[i]._id.toString() === group._id.toString()) {
                groups.splice(i, 1);
            }
        }
        this.setState({ groups, selectedGroups })
    }
    removeFromSelected = (group) => {
        let groups = [...this.state.groups];
        groups.push(group)
        let selectedGroups = [...this.state.selectedGroups]
        for (let i = 0; i < selectedGroups.length; i++) {
            if (selectedGroups[i]._id.toString() === group._id.toString()) {
                selectedGroups.splice(i, 1);
            }
        }
        this.setState({ groups, selectedGroups })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <div style={{ width: "100%", textAlign: "center", padding: "30px" }}>
                    <CircularProgress />
                </div>
            )
        }
        if (this.state.loaded) {
            var groups = this.state.groups.map((group) => {
                return (
                    <ListItem alignItems="flex-start" key={group._id}>
                        <ListItemAvatar>
                            <Checkbox
                                checked={false}
                                onChange={() => this.addToSelected(group)}
                                value="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
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
            });
            var selectedGroups = this.state.selectedGroups.map((group) => {
                return (
                    <ListItem alignItems="flex-start" key={group._id}>
                        <ListItemAvatar>
                            <Checkbox
                                checked={true}
                                onChange={() => this.removeFromSelected(group)}
                                value="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
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
            });
        } else {
            groups = <div></div>
        }
        if (this.state.submittingStage === 0) {
            var submittingStage = "Submit"
        }
        else if (this.state.submittingStage === 1) {
            submittingStage =  (<CircularProgress color="secondary"/>)
        }
        else {
            submittingStage =  (<IconButton><CheckIcon style={{color : "white"}}/></IconButton>)
        }
        return (
            <div id="textUploaderContainer">
                <small style={{ marginBottom: "30px" }}>Status updates are shown to followers only for 24 hours</small>
                <br /><br />
                <TextField
                    id="filled-basic"
                    label="Share what you're upto"
                    variant="outlined"
                    style={{ width: "80%" }}
                    multiline
                    onChange={(e) => { this.setState({ caption: e.target.value }) }}
                    value={this.state.caption}
                />
                <br /> <br />
                <h5>Choose Post Visibility</h5>
                <List>
                    {groups}
                    {selectedGroups}
                </List>
                <br /><br /><br />
                <Button variant="contained" color="primary" onClick={this.submitTextUpdate}>
                    {submittingStage}
                </Button>
            </div>
        )
    }
}
