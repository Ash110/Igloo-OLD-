import React, { Component } from 'react';
import axios from 'axios'
import Header from '../../components/Header/Header'
import { TextField, Button, CircularProgress } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import './ForgotPassword.css'

export default class ForgotPassword extends Component {
    state = {
        verified: false,
        valid: false,
        code: "",
        buttonStatus: 0,
    }
    componentDidMount() {
        const code = this.props.match.params.code;
        this.setState({ code })
    }
    submitForgotPassword = () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        if (this.state.buttonStatus === 0) {
            // this.setState({ buttonStatus : 1 })
            axios.post('/api/users/verifyEmailForForgotPassword', { email: this.state.email, code: this.state.code }, config)
                .then((res) => {
                    this.setState({ buttonStatus: 2 })
                })
                .catch((err) => {
                    if (err.response.status === 404 || err.response.status === 400 || err.response.status === 500) {
                        alert(err.response.data)
                    }
                })
        }
        if (this.state.buttonStatus === 2) {
            if(this.state.password === this.state.confirmPassword){
                this.setState({ buttonStatus: 3 })
                axios.post('/api/users/resetPassword', { email: this.state.email, password: this.state.password, confirmPassword: this.state.confirmPassword }, config)
                    .then((res) => {
                        this.setState({ buttonStatus: 4 })
                        window.location.href = "/login"
                    })
                    .catch((err) => {
                        if (err.response.status === 404 || err.response.status === 403 || err.response.status === 500) {
                            alert(err.response.data)
                        }
                    })
            }else{
                alert("Passwords are not the same")
            }
        }
    }
    render() {
        if (this.state.buttonStatus === 0) {
            var buttonText = "Verify Email"
        }
        else if (this.state.buttonStatus === 1) {
            buttonText = <CircularProgress color="secondary" />
        }
        else if (this.state.buttonStatus === 2) {
            buttonText = "Reset Password"
        }
        else if (this.state.buttonStatus === 3) {
            buttonText = <CircularProgress color="secondary" />
        }
        else if (this.state.buttonStatus === 4) {
            buttonText = <CheckIcon color="green"/>
        }
        return (
            <React.Fragment>
                <Header />
                <div id="forgotPasswordContainer">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {this.state.buttonStatus < 2 ? <TextField
                            id="forgotPasswordEmail"
                            label="Enter your email"
                            variant="outlined"
                            onChange={(e) => { this.setState({ email: e.target.value }) }}
                            style={{ width: "80%", marginLeft: "10%" }}
                        /> : <React.Fragment></React.Fragment>}
                        {this.state.buttonStatus >= 2 ? <React.Fragment><br /><br />
                            <TextField
                                id="forgotPasswordPassword"
                                label="Enter a new password"
                                variant="outlined"
                                type="password"
                                onChange={(e) => { this.setState({ password: e.target.value }) }}
                                style={{ width: "80%", marginLeft: "10%" }}
                            />
                            <br /><br />
                            <TextField
                                id="forgotPasswordConfirmPassword"
                                label="Confirm new password"
                                variant="outlined"
                                type="password"
                                onChange={(e) => { this.setState({ confirmPassword: e.target.value }) }}
                                style={{ width: "80%", marginLeft: "10%" }}
                            /> </React.Fragment> : <React.Fragment></React.Fragment>}
                        <br /><br />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginRight: "10%", float: "right" }}
                            onClick={this.submitForgotPassword}
                        >
                            {buttonText}
                        </Button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}
