import React, { Component, Fragment } from 'react'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios'

export default class RequestForgotPassword extends Component {
    state = {
        status: 0,
        email: ""
    }

    sendMail = () => {
        this.setState({status : 1})
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/forgotPassword', {email : this.state.email}, config)
        .then((res) => {
            this.setState({ status : 2 })
        })
        .catch((err) => {
            if(err.response.status === 404){
                this.setState({ status: 3 })
            }else{
                alert("Internal Server Error")
            }
        })
    }

    render() {
        if (this.state.status === 0) {
            var buttonText = "Send reset link"
        }
        else if (this.state.status === 1) {
            buttonText = <CircularProgress color="secondary" />
        }
        else if (this.state.status === 2) {
            buttonText = <CheckIcon color="green" />
        }
        else if (this.state.status === 3) {
            buttonText = "Send reset link"
        }
        return (
            <div style={{padding : "20px"}}>
                {this.state.status === 2 ? <Fragment><Alert severity="success">Password reset link has been sent to {this.state.email}. Use the link to reset your password and login. If you haven't received it yet, please check spam.</Alert><br/><br/></Fragment> : <Fragment></Fragment>}
                {this.state.status === 3 ? <Fragment><Alert severity="warning">Unable to find a user with that email ID</Alert><br/><br/></Fragment> : <Fragment></Fragment>}
                
                <TextField
                    id="requestPasswordEmail"
                    label="Enter your email ID"
                    variant="outlined"
                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                    style={{ width: "100%", }}
                />
                <br /><br />
                <Button variant="contained" color="primary" onClick={this.sendMail}>
                    {buttonText}
                </Button>
            </div>
        )
    }
}
