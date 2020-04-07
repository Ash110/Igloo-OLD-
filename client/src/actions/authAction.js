import { LOG_IN, LOG_OUT, IS_LOGGED_IN, SET_LIGHT, SET_DARK } from './types';
import axios from 'axios';





export const isLoggedIn = () => dispatch => {
    dispatch({
        type: IS_LOGGED_IN
    });
}

export const logIn = (userToken) => async dispatch => {
    if (userToken !== "null") {
        console.log("Token not null");
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/users/authenticateUser', {}, config)
            .then(async (res) => {
                console.log("Logged In")
                let { username, id, name, profilePicture, bio, email, telegramUsername } = res.data;
                const theme = window.localStorage.getItem('theme');
                const payload = { userToken, username, id, name, profilePicture, bio, email, theme, telegramUsername }
                dispatch({
                    type: LOG_IN,
                    payload
                });
            })
            .catch((err) => {
                console.log(err);
                console.log("Logging Out")
                // cookies.set('userToken', null , { path: '/' });
                // dispatch({
                //     type: LOG_OUT,
                // })
            });
    }
    else {
        console.log("Token was null")
    }
}


export const logOut = () => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    }
    axios.post('/api/users/logOut',{},config)
    .then(() => window.location.href="/")
    .catch((err) => alert(err.response.data))
    dispatch({
        type: LOG_OUT
    })
}

// export const setLightTheme = () => dispatch => {
//     window.localStorage.setItem('theme', 'light')
//     dispatch({
//         type: SET_LIGHT
//     })
// }

// export const setDarkTheme = () => dispatch => {
//     window.localStorage.setItem('theme', 'dark')
//     dispatch({
//         type: SET_DARK
//     })
//     window.location.href="/"
// }