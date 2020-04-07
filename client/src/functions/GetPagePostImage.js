import axios from 'axios';




const _imageEncode = (arrayBuffer) => {
    let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer), function (p, c) { return p + String.fromCharCode(c) }, ''))
    let mimetype = "image/jpeg"
    return "data:" + mimetype + ";base64," + b64encoded
}

export const getPagePostImage = (imageId) => {
    return new Promise(function (resolve, reject) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            responseType: 'arraybuffer'
        }
        axios.post('/api/pages/getPostImage', { imageId }, config)
            .then((res) => {
                // const image = _imageEncode(res.data);
                resolve(res.data);
                // console.log("data:image/jpeg;base64," + res.data);
                // resolve("data:image/jpeg;base64,"+res.data);
            })
            .catch((err) => {
                console.log("Missing post ID is", imageId)
                reject(err);
            })
    });
}