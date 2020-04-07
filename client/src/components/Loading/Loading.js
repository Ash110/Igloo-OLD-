import React, {Fragment} from 'react';
import {Spinner, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Loading.css';

const Loading = (props) => {
    const login = () => {
        return (
            <Fragment>
            <Link to="/login"><Button variant="danger">Login</Button></Link>
            <br/><br/>
            <Link to="/register"><Button variant="danger">Register</Button></Link>
            </Fragment>    
        );
    }
    return (
        <div align="center" className="loader">
            <Spinner animation="border" role="status"></Spinner>
            <p className="caption">Please wait</p>
            <b className="caption">{props.caption}</b>
            <br/><br/>
            {props.login === "true" ? <p>You need to be a user to view this page. If you have an account, please wait while we log you in. Or else, go ahead and sign up.</p> : <br />}
            <br/><br/>
            {props.login==="true" ? login() : <br/>}
        </div>
    );
};

export default Loading;