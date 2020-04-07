import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn } from './actions/authAction';
import Loading from './components/Loading/Loading'


const PrivateRoute = ({ component: Component, loggedIn ,...rest }) => {
    var textArray = [
        'The penguin loading the page ran away',
        'Upgrading Windows, your PC will restart several times. Sit back and relax.',
        'The little elves are building your page',
        'Hum something loud while others stare',
        'The satellite is moving into position',
        'Counting backwards from Infinity',
        'We\'re making you a cookie.',
        'Spinning the wheel of fortune...',
        'I feel like im supposed to be loading something. . .',
        'Making sure all the i\'s have dots...',
        'Convincing AI not to turn evil..',
        'Wait, do you smell something burning?',
        'Hello IT, have you tried turning it off and on again?',
        'Twiddling thumbs...',
        'Bored of slow loading spinner? Buy more RAM now!',
        'Alt-F4 speeds things up.',
        'How about this weather, eh?',
        'Inserting elevator music',
    ];
    var reason = textArray[Math.floor(Math.random() * textArray.length)];
    return(
        <Route 
            {...rest} 
            render={ props => (!loggedIn) ? (<Loading caption={`${reason}`} login="true" />) : (<Component {...props} />)} 
        />
    )
}

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn
})
export default connect(mapStateToProps, { logIn })(PrivateRoute);