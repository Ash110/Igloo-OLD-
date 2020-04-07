import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactCrop from 'react-image-crop';
import { Button, IconButton, CircularProgress } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import './UploadProfilePicture.css'

class UploadProfilePicture extends Component {
    state = {
        src: null,
        crop: {
            unit: '%',
            width: 30,
            aspect: 1 / 1,
        },
        croppedImageUrl: "",
        submittingStage: 0
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    rotateImageSrc = () => {
        var offScreenCanvas = document.createElement('canvas');
        let offScreenCanvasCtx = offScreenCanvas.getContext('2d');
        // cteate Image
        var img = new Image();
        img.src = this.state.src;
        img.onload = () => {
            // image  has been loaded
            offScreenCanvas.height = img.width;
            offScreenCanvas.width = img.height;

            // rotate and draw source image into the off-screen canvas:
            offScreenCanvasCtx.rotate(90 * Math.PI / 180);
            offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
            offScreenCanvasCtx.drawImage(img, 0, 0);

            // encode image to data-uri with base64
            this.setState({ src: offScreenCanvas.toDataURL() });
        }
    }
    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    var base64data = reader.result;
                    resolve(base64data);
                }
            }, 'image/jpeg',1);
        });
    }
    config = {
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": this.props.userToken
        }
    }
    uploadImages = () => {
        this.setState({ submittingStage: 1 })
        // Make an AJAX upload request using Axios
        axios.post('/api/profilePicture/uploadProfilePicture', { profilePicture: this.state.croppedImageUrl }, this.config)
            .then(response => {
                this.setState({ submittingStage: 2 })
                window.location.reload()
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        const { crop, src } = this.state;
        if (this.state.submittingStage === 0) {
            var submittingStage = "Submit"
        }
        else if (this.state.submittingStage === 1) {
            submittingStage = (<CircularProgress color="secondary" />)
        }
        else {
            submittingStage = (<IconButton><CheckIcon style={{ color: "white" }} /></IconButton>)
        }
        return (
            <div style={{ padding: "50px" }}>
                Select an image as profile picture
                <br /><br />
                <div>
                    <input type="file" accept="image/*" onChange={this.onSelectFile} id="contained-button-file" style={{visibility : "hidden"}}/>
                    <br/>
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="secondary" component="span">
                            Click here to upload file
                        </Button>
                    </label>
                </div>
                {src && (
                    <Fragment>
                        <small>
                            It is recommeneded you crop the image to a square using the cropper for best results
                        </small>
                        <br/>
                        <br/>
                        <ReactCrop
                            src={src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                            id="uploadProfileCropper"
                        />
                        <br /> <br />
                        <Button variant="contained" color="secondary" onClick={this.rotateImageSrc}>
                            Rotate Image
                        </Button>
                        <br /><br />
                        <Button variant="contained" color="primary" onClick={this.uploadImages}>
                            {submittingStage}
                        </Button>
                    </Fragment>
                )}
            </div>
        );
    }
}
const mapStateToProps = state => ({
    userToken: state.auth.userToken,
    id: state.auth.id,
})
export default connect(mapStateToProps, null)(UploadProfilePicture);

