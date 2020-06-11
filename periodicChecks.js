const User = require('./models/User')
const day = 1000 * 3600 * 24;
setInterval(()=>{
    User.find().map((user)=>{
        if(user.telegramUsername && user.telegramUsername[0]==='@'){
            await 
        }
    })
},day)