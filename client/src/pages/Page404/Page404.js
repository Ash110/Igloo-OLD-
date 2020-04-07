import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import WarningIcon from '@material-ui/icons/Warning';
import './Page404.css'

export default class Page404 extends Component {
    render() {
        return (
            <div>
                <Header/>
                <WarningIcon id="WarningIcon404"/>
                <h3 id="Page404Text">
                    The {this.props.type||"page"} you're looking for is classifi...Um I mean, not found
                </h3>
            </div>
        )
    }
}
