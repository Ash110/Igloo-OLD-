import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import store from './store';
import { isLoggedIn, logIn } from './actions/authAction';
import Cookies from 'universal-cookie';


//Components
import PrivateRoute from './PrivateRoute'
import LandingPage from './pages/LandingPage/LandingPage'
import Feed from './pages/Feed/Feed';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import StartingTips from './pages/StartingTips/startingTips';
import PostPage from './pages/PostPage/PostPage';
import PagePostPage from './pages/PagePostPage/PagePostPage';
import MyProfile from './pages/MyProfile/MyProfile';
import Profile from './pages/Profile/Profile'
import Notifications from './pages/Notifications/Notifications'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import EditGroups from './pages/EditGroups/EditGroups'
import EditPages from './pages/EditPages/EditPages'
import Pages from './pages/Pages/Pages'
import Search from './pages/Search/Search'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import Help from './pages/Help/Help'
import ContactUs from './pages/ContactUs/ContactUs';
import Settings  from './pages/Settings/Settings';
import Page404 from './pages/Page404/Page404'

const cookies = new Cookies()

const App = (props) => {
	if (props.loggedIn === undefined || props.loggedIn === false) {
		props.logIn(cookies.get('userToken'));
	}
	window.localStorage.setItem('theme', 'light')
	return (
		<Provider store={store}>
			<Fragment>
				<Router>
					<Switch>
						{props.loggedIn ?
							<Route exact path="/" component={Feed} /> :
							<Route exact path="/" component={LandingPage} />
						}
						<Route exact path="/register" component={Register} />
						<PrivateRoute exact path="/profile" component={MyProfile} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/privacypolicy" component={PrivacyPolicy} />
						<Route exact path="/welcome" component={StartingTips} />
						<Route exact path="/help" component={Help} />
						<Route exact path="/contactus" component={ContactUs} />
						<Route exact path="/forgotpassword/:code" component={ForgotPassword} />
						<Route exact path="/page/:username" component={Pages} />
						<Route exact path="/pagepost/:pageId" component={PagePostPage} />
						<PrivateRoute exact path="/user/:username" component={Profile} />
						<PrivateRoute exact path="/search" component={Search} />
						<PrivateRoute exact path="/settings" component={Settings} />
						<PrivateRoute exact path="/post/:postId" component={PostPage} />
						<PrivateRoute exact path="/notifications" component={Notifications}/>
						<PrivateRoute exact path="/groups" component={EditGroups} />
						<PrivateRoute exact path="/pages" component={EditPages} />
						<Route component={Page404} />
					</Switch>
				</Router>
			</Fragment>
		</Provider>
	);
}
const mapStateToProps = state => ({
	loggedIn: state.auth.loggedIn
})

export default connect(mapStateToProps, { isLoggedIn, logIn })(App);
