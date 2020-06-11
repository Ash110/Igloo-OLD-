import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios'
import { TextField, Button, CircularProgress,  } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import RequestForgotPassword from '../../components/RequestForgotPassword/RequestForgotPassword'
import Header from '../../components/Header/Header';
import './Login.css';



class Register extends React.Component {
    state = {
        alerts: [],
        email: "",
        password: "",
        resetPassword : false,
        status : 0
    }
    render() {
        // this.setState({alerts:[]})
        const formSubmit = async () => {
            this.setState({status : 1})
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials : true
            }
                const email = this.state.email;
                const password = this.state.password;
                Axios.post('/api/users/login', { email, password }, config)
                .then(() =>{
                    this.setState({status : 0})
                    window.location.href = "/"

                })
                .catch((err) => {
                    let alerts = []
                    err.response.data.errors.map(err => alerts.push(err.msg));
                    this.setState({ alerts, status : 0 });
                    window.scrollTo(0, 0);
                })
                // cookies.set('userToken', res.data.token, { path: '/' });

        }
        const alertBox = () => {
            if (this.state.alerts.length > 0) {
                return this.state.alerts.map((alert, index) => {
                    return (
                        <Alert key={index} severity="error">
                            {alert}
                        </Alert>
                    )
                });
            }
        }
        if(this.state.status===0){
            var buttonText = "Login"
        }else{
            buttonText = <CircularProgress color="secondary"/>
        }
        return (
            <Fragment>
                <Header />
                <Dialog onClose={() => this.setState({resetPassword : false})} aria-labelledby="simple-dialog-title" open={this.state.resetPassword}>
                    <DialogTitle id="simple-dialog-title">Send a reset password link</DialogTitle>
                    <RequestForgotPassword/>
                </Dialog>
                <div className="registerContainer">
                    <div className="alertBox">
                        {alertBox()}
                    </div>
                    <br /><br />
                    <form style={{width:"100%"}} onSubmit={(e) => e.preventDefault()}>
                        <TextField
                            label="Enter your username or email address"
                            variant="outlined"
                            name="email"
                            style={{ width: "100%" }}
                            // type="email"
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                        <br /><br /><br />
                        <TextField
                            label="Enter your password"
                            variant="outlined"
                            name="password"
                            type="password"
                            style={{ width: "100%" }}
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                        <br /><br /><br />
                        <Button variant="contained" color="primary" type="submit" className="submitButton" onClick={formSubmit}>
                            {buttonText}
                    </Button>
                    </form>
                    <br />
                    <br />
                    <br />
                    <Button variant="text" onClick={() => this.setState({resetPassword : true})}>Forgot password?</Button>
                    <br />
                    <br />
                    <Button variant="text" color="secondary" onClick={() => window.location.href = "/register"}>Don't have an account? Create one here for free </Button>
                </div >
            </Fragment>
        );
    }
};



export default connect(null)(Register);