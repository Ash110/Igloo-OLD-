const nodemailer = require("nodemailer");
const auth = require("./mailCredentials");
const fs = require("fs");

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	requireTLS: true,
    auth
});

const sendMail = (emailId, subject, text, html = null) => {
	// If no template passed, only text shall be used by nodemailer
	const mailOptions = {
		from: auth.user,
		to: emailId,
		subject,
		text,
		html
	};
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject({success:false, message:error});
			} else {
				console.log(`Email sent: ${info.response}`);
				resolve();
			}
		});
	})
}

const sendPasswordResetMail = (userEmail, username, resetLink) => {
	const subject =  '[Igloo] Password Reset';
	const text =  `Hello ${username}, please reset password here: ${resetLink}`;
	let mailTemplate = fs.readFileSync("email/templates/forgotPassword.txt","utf8");
	mailTemplate = mailTemplate.replace("{{username}}", username);
	mailTemplate = mailTemplate.replace("{{link}}", resetLink);

	return new Promise((resolve, reject) => {
		sendMail(userEmail, subject, text, mailTemplate)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			})
	})
}

const sendWelcomeMail = (userEmail, username) => {
    const subject =  'Welcome to Igloo!';
    const text =  `Hello ${username}, welcome to Igloo!`;
    let mailTemplate = fs.readFileSync("email/templates/welcome.txt","utf8");
	mailTemplate = mailTemplate.replace("{{username}}", username);
    
    return new Promise((resolve, reject) => {
		sendMail(userEmail, subject, text, mailTemplate)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			})
	})
}

const sendNewLoginMail = (userEmail, username, ipAddress) => {
	const subject = 'New login detected on Igloo!';
	const text = `There has been a new login to your account`;
	let mailTemplate = fs.readFileSync("email/templates/newLogin.txt", "utf8");
	mailTemplate = mailTemplate.replace("{{username}}", username);
	mailTemplate = mailTemplate.replace("{{ipAddress}}", ipAddress);

	return new Promise((resolve, reject) => {
		sendMail(userEmail, subject, text, mailTemplate)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			})
	})
}

const sendFriendRequestMail = (userEmail, username, senderName) => {
	const subject = 'You have a new friend request!';
	const text = `You have a new friend request waiting!`;
	let mailTemplate = fs.readFileSync("email/templates/friendRequest.txt", "utf8");
	mailTemplate = mailTemplate.replace("{{username}}", username);
	mailTemplate = mailTemplate.replace("{{senderName}}", senderName);

	return new Promise((resolve, reject) => {
		sendMail(userEmail, subject, text, mailTemplate)
			.then(() => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			})
	})
}

module.exports = {
    sendMail,
    sendPasswordResetMail,
	sendWelcomeMail,
	sendNewLoginMail,
	sendFriendRequestMail
}