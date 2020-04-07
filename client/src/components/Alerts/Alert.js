import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core';
import './Alert.css';

export default class CustomAlert extends Component {
    state = {
        show: false
    }
    componentDidMount() {
        const { storageKey } = this.props;
        console.log(window.localStorage.getItem(storageKey))
        if (window.localStorage.getItem(storageKey) === null || window.localStorage.getItem(storageKey) === "true") {
            this.setState({ show: true });
            window.localStorage.setItem(storageKey, true)
        } else {
            this.setState({ show: false })
        }
    }
    closeAlert = () => {
        const { storageKey } = this.props;
        window.localStorage.setItem(storageKey, false)
        this.setState({ show: false })
    }
    render() {
        if (this.state.show) {
            return (
                <div id="customAlert">
                    <Link to={this.props.link}>
                        <p style={{color:"black"}}>{this.props.text}</p>
                    </Link>
                    <br />
                    <Button variant="text" color="secondary" onClick={this.closeAlert}>Close</Button>
                </div>
            )
        } else {
            return (<Fragment></Fragment>)
        }
    }
}

