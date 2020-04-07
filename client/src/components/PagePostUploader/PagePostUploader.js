import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactCrop from 'react-image-crop';
import {
    Button, TextField, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, FormGroup,Switch
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';


import './PagePostUploader.css'



class PagePostUploader extends Component {
    state = {
        src: null,
        crop: {
            x: 0,
            y: 0,
            // width: 100,
            // height: 100,
            unit: "px",
        },
        croppedImageUrl: "",
        caption: "",
        loaded: false,
        pages: [],
        selectedPage: "",
        submittingStage: 0,
        disableComments : false
    };
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/pages/getPages', {}, config)
            .then((res) => {
                if(res.data.length>0){
                    this.setState({ pages: res.data, loaded: true, selectedPage: res.data[0]._id });
                }else{
                    this.setState({ pages: [], loaded: true, selectedPage: null });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
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
    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = async (image) => {
        await this.setState({
            crop: {
                x: 0,
                y: 0,
                // width: image.width,
                // height: image.height,
                unit: "px"
            }
        })
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    }

    makeClientCrop = async (crop) => {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }
    getCroppedImg = (image, crop, fileName) => {
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
            }, 'image/jpeg');
        });
    }
    uploadImage = async () => {
        this.setState({ submittingStage: 1 })
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        // Make an AJAX upload request using Axios
        const image = this.state.croppedImageUrl || this.state.src;
        if (image) {
            const isText = false;
            const caption = this.state.caption;
            axios.post('/api/pages/newPost', { image, isText, isTemp: true, caption, page: this.state.selectedPage, disableComments : this.state.disableComments }, config)
                .then(response => {
                    this.setState({ submittingStage: 2 })
                    window.location.reload();
                })
                .catch((err) => {
                    this.setState({ submittingStage: 0 })
                    alert("Server error. Try after a while");
                    console.log(err);
                })
        } else {
            const isText = true;
            const caption = this.state.caption;
            axios.post('/api/pages/newPost', { isText, isTemp: true, caption, page: this.state.selectedPage, disableComments : this.state.disableComments }, config)
                .then(response => {
                    this.setState({ submittingStage: 2 })
                    window.location.reload();
                })
                .catch((err) => {
                    this.setState({ submittingStage: 0 })
                    alert("Server error. Try after a while");
                    console.log(err);
                })
        }
    }

    render() {
        if (this.state.submittingStage === 0) {
            var submittingStage = "Submit"
        }
        else if (this.state.submittingStage === 1) {
            submittingStage = (<CircularProgress color="secondary" />)
        }
        else {
            submittingStage = (<IconButton><CheckIcon style={{ color: "white" }} /></IconButton>)
        }
        if (!this.state.loaded) {
            return (
                <div style={{ width: "100%", textAlign: "center", padding: "30px" }}>
                    <CircularProgress />
                </div>
            )
        }
        const { crop, src } = this.state;
        return (
            <div id="postUploader">
                <h3 style={{ width: "100%", textAlign: "center" }}>Share to your page!</h3>
                <p style={{ width: "100%", textAlign: "center" }}>Choose a page to post to</p>
                <br /><br /><br />
                <div>
                    <Button variant="outlined">
                        <input
                            type="file"
                            accept="image/png, image/jpg,image/jpeg"
                            onChange={this.onSelectFile}
                            onSubmit={(e) => { e.preventDefault() }}
                            style={{ width: "100%" }}
                        />
                    </Button>
                </div>
                <br /><br />
                <React.Fragment>
                    <small >Press and hold the image to crop</small>
                    <br /><br />
                    <ReactCrop
                        src={src}
                        crop={crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                    <br /><br />
                    <Button variant="contained" color="secondary" onClick={this.rotateImageSrc}>
                        Rotate Image
                            </Button>
                    <br /> <br /> <br />
                    {
                        this.state.src ?
                            <TextField
                                id="imageCaption"
                                label="Enter Image Caption"
                                color="primary"
                                multiline={true}
                                onChange={(e) => this.setState({ caption: e.target.value })}
                                style={{ width: "100%" }}
                            />
                            :
                            <Fragment>
                                <small>Enter some text here and submit to post text without a photo</small>
                                <TextField
                                    id="imageCaption"
                                    label="Enter some text to share"
                                    color="primary"
                                    multiline={true}
                                    onChange={(e) => this.setState({ caption: e.target.value })}
                                    style={{ width: "100%" }}
                                />
                            </Fragment>
                    }
                    <br /> <br /> <br />
                    <FormGroup row>
                        <FormControlLabel
                            control={<Switch checked={this.state.disableComments} onChange={(e)=>this.setState({disableComments:e.target.checked})} name="disableComments" />}
                            label="Disable Comments"
                        />
                    </FormGroup>
                    <br /><br />
                    {this.state.pages.length > 0 ? <FormControl component="fieldset">
                        <FormLabel component="legend">Choose a page to share to</FormLabel>
                        <RadioGroup aria-label="page" name="page" value={this.state.selectedPage} onChange={(e) => this.setState({ selectedPage: e.target.value })}>
                            {this.state.pages.map((page) => {
                                return (<FormControlLabel value={page._id} control={<Radio />} label={page.name} />)
                            })}
                        </RadioGroup>
                    </FormControl>: 
                    <Button variant="contained" color="secondary" onClick={()=>window.location.href = "/pages"}>Create a page to share to it</Button>
                    }
                    <br /> <br /> <br />
                    <Button variant="contained" color="primary" onClick={this.uploadImage}>
                        {submittingStage}
                    </Button>
                </React.Fragment>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    userToken: state.auth.userToken,
    id: state.auth.id,
})
export default connect(mapStateToProps, null)(PagePostUploader);