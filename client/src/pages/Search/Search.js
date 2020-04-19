import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { TextField, } from '@material-ui/core';
import {Link} from 'react-router-dom';
import List from '@material-ui/core/List';
import SearchListComponent from './SearchListComponent'
import Header from '../../components/Header/Header';
import Bottom from '../../components/Bottom/Bottom';

import './Search.css';



export default class Search extends Component {
    state = {
        searchQuery: "",
        searchResults: []
    }
    search = (name) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/search/getSearchResults', { name }, config)
            .then((res) => {
                this.setState({ searchResults: res.data });
            })
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        return (
            <Fragment>
                <Header />
                <form autoComplete="off">
                    <TextField
                        id="searchBar"
                        label="Search by name"
                        variant="outlined"
                        style={{ width: "80%", marginLeft: "10%", marginTop: "40px" }}
                        onChange={(e) => this.search(e.target.value)}
                    />
                    <small style={{ width: "80%", marginLeft: "10%", marginTop: "50px" }}>To search by username, type @ followed by username</small>
                </form>
                <br /><br />
                {this.state.searchResults.length > 0 ?
                    <Fragment>
                        <List>
                            {this.state.searchResults.map((result) => {
                                return (
                                    <SearchListComponent result={result} key={result._id} />
                                )
                            })}
                        </List>
                    </Fragment> :
                    <Fragment>
                        <div id="searchPagesList">
                            Check out some of the trending pages to follow
                        </div>
                        <br />
                        <Link to="/page/igloo/news">
                            <div className="suggestPagesDiv">
                                <p className="suggestPagesTitle">World News</p>
                                <p className="suggestPagesDescription">Get the latest news from trusted, verified sources</p>
                            </div>
                        </Link>
                        <Link to="/page/igloo/memes">
                            <div className="suggestPagesDiv">
                                <p className="suggestPagesTitle">Memes</p>
                                <p className="suggestPagesDescription">This needs no description</p>
                            </div>
                        </Link>
                        <Link to="/page/igloo/photography">
                            <div className="suggestPagesDiv">
                                <p className="suggestPagesTitle">Photography</p>
                                <p className="suggestPagesDescription">Some of the best photos from around the world, open and free to use</p>
                            </div>
                        </Link>
                    </Fragment>
                }
                <Bottom />
            </Fragment>
        )
    }
}
