const {LOG_IN, LOG_OUT,SET_LIGHT,SET_DARK} = require('../actions/types');


const initalState = {
    loggedIn: false,
    userToken: "",
    username: "",
    id: "",
    name: "",
    bio: "",
    profilePicture: "",
    email:"",
    theme : 'light',
    telegramUsername : ""
};

export default function (state = initalState, action) {
    switch (action.type) {
        case LOG_IN:
            const { userToken, username, id, name, profilePicture, bio, email, theme, telegramUsername} = action.payload
            return Object.assign({}, state, {
                userToken: userToken,
                username,
                id,
                name,
                bio,
                loggedIn: true,
                profilePicture,
                email,
                theme,
                telegramUsername
            })
        case LOG_OUT:
            return Object.assign({}, state, {
                loggedIn: false,
                userToken: "",
                username: "",
                id: "",
                name: "",
                bio: "",
                profilePicture: "",
                email:"",
                theme : 'light',
                telegramUsername:""
            })
        case SET_LIGHT : 
            return Object.assign({}, state, {
                theme : 'light'
            })
        case SET_DARK:
            return Object.assign({}, state, {
                theme: 'dark'
            })
        default:
            return {...state};
    }
}