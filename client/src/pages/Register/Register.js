import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios'
import { Link } from 'react-router-dom'
import { TextField, Button, CircularProgress} from '@material-ui/core';
import {captchaKey} from '../../config'
import Alert from '@material-ui/lab/Alert';
import Header from '../../components/Header/Header';
import ReCAPTCHA from "react-google-recaptcha";

import './Register.css';



class Register extends React.Component {
    state = {
        alerts: [],
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        captchaValue : "",
        submitState : 0
    }
    onChange = (value) => {
        this.setState({captchaValue : value})
    }
    render() {
        if(this.state.submitState===0){
            var submitButton = "Sign Up"
        }else{
            submitButton = <CircularProgress color="secondary"/>
        }
        const formSubmit = async () => {
            this.setState({submitState : 1})
            const { fullName, username, email, password, confirmPassword, captchaValue } = this.state;
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
                Axios.post('/api/users/register', { captchaValue,name: fullName, email, password, confirmPassword, username, accountType: "personal" }, config)
                    .then(()=>{
                        window.location.href = "/?welcome=true"
                    })
                    .catch((err)=> {
                        let alerts = []
                        err.response.data.errors.forEach(err => alerts.push(err.msg));
                        this.setState({ alerts, submitState : 0 })
                        window.scrollTo(0, 0);
                    })
                // cookies.set('userToken', res.data.token, { path: '/'});
        }
        const alertBox = () => {
            if (this.state.alerts.length > 0) {
                return this.state.alerts.map((alert, index) => {
                    return (
                        <Fragment key={index}>
                            <Alert severity="error">
                                {alert}
                            </Alert><br />
                        </Fragment>
                    )
                });
            }
        }
        return (
            <Fragment>
                <Header />
                <div className="registerContainer">
                    <div className="alertBox">
                        {alertBox()}
                    </div>
                    <br />
                    <form style={{ width: "100%" }} onSubmit={(e) => e.preventDefault()}>
                        <TextField
                            label="Enter your full name"
                            variant="outlined"
                            name="fullName"
                            helperText="This is the name others will see"
                            type="name"
                            onChange={(e) => this.setState({ fullName: e.target.value })}
                            style={{ width: "100%" }}
                        /><br /><br />
                        <TextField
                            label="Enter your email address"
                            variant="outlined"
                            name="email"
                            // helperText="Choose an email to sign up"
                            type="email"
                            onChange={(e) => this.setState({ email: e.target.value })}
                            style={{ width: "100%" }}
                        /><br /><br />
                        <TextField
                            label="Choose a username"
                            variant="outlined"
                            name="username"
                            helperText="The username has to be unique"
                            type="username"
                            onChange={(e) => this.setState({ username: e.target.value })}
                            style={{ width: "100%" }}
                        /><br /><br />
                        <TextField
                            label="Enter your password"
                            variant="outlined"
                            name="password"
                            helperText="Choose a strong password to stay secure"
                            type="password"
                            onChange={(e) => this.setState({ password: e.target.value })}
                            style={{ width: "100%" }}
                        /><br /><br />
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            name="confirmPassword"
                            helperText="Enter same password as above to confirm"
                            type="password"
                            onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                            style={{ width: "100%" }}
                        /><br /><br />
                        <ReCAPTCHA
                            sitekey={captchaKey}
                            onChange={this.onChange}
                        /><br/>
                        <br />
                        <Button variant="contained" type="submit" color="primary" className="submitButton" onClick={formSubmit}>
                            {submitButton}
                        </Button>
                        <br />
                    </form>
                    <br />
                    <Link className="loginLink" to="/login">Already have an account? Click here to login</Link>
                </div >
            </Fragment>
        );
    }
};



export default connect(null, null)(Register);