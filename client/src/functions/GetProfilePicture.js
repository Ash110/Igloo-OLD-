import axios from 'axios';




const _imageEncode = (arrayBuffer) => {
    let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer), function (p, c) { return p + String.fromCharCode(c) }, ''))
    let mimetype = "image/jpeg"
    return "data:" + mimetype + ";base64," + b64encoded
}

export const getProfilePicture = (userId) => {
    return new Promise(function (resolve, reject) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            responseType: 'arraybuffer'
        }
        axios.post('/api/profilePicture/getProfilePicture', { profileId: userId}, config)
            .then((res) => {
                const image = _imageEncode(res.data);
                resolve(image);
            })
            .catch((err) => {
                console.log("There is an error")
                reject(err);
            })
    });
}