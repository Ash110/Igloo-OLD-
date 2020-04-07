import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactCrop from 'react-image-crop';
import { Button, TextField, CircularProgress, Checkbox, ListItem, ListItemAvatar, ListItemText, List, IconButton } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';


import './TempPostUploader.css'



class TempPostUploader extends Component {
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
        groups: [],
        selectedGroups: [],
        submittingStage: 0
    };
    componentDidMount() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        }
        axios.post('/api/groups/getGroups', {}, config)
            .then((res) => {
                this.setState({ groups: res.data, loaded: true });
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
            }, 'image/jpeg',1);
        });
    }
    uploadImage = async () => {
        if (this.state.selectedGroups.length > 0) {
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
                axios.post('/api/posts/newTempPost', { image, isText, isTemp: true, caption, groups: this.state.selectedGroups }, config)
                    .then(response => {
                        this.setState({ submittingStage: 2 })
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                const isText = true;
                const caption = this.state.caption;
                axios.post('/api/posts/newTempPost', { isText, isTemp: true, caption, groups: this.state.selectedGroups }, config)
                    .then(response => {
                        this.setState({ submittingStage: 2 })
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        } else {
            alert("Choose a group to share to");
        }
    }
    addToSelected = (group) => {
        let selectedGroups = [...this.state.selectedGroups];
        selectedGroups.push(group)
        let groups = [...this.state.groups]
        for (let i = 0; i < groups.length; i++) {
            if (groups[i]._id.toString() === group._id.toString()) {
                groups.splice(i, 1);
            }
        }
        this.setState({ groups, selectedGroups })
    }
    removeFromSelected = (group) => {
        let groups = [...this.state.groups];
        groups.push(group)
        let selectedGroups = [...this.state.selectedGroups]
        for (let i = 0; i < selectedGroups.length; i++) {
            if (selectedGroups[i]._id.toString() === group._id.toString()) {
                selectedGroups.splice(i, 1);
            }
        }
        this.setState({ groups, selectedGroups })
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
        if (this.state.loaded) {
            var groups = this.state.groups.map((group) => {
                return (
                    <ListItem alignItems="flex-start" key={group._id}>
                        <ListItemAvatar>
                            <Checkbox
                                checked={false}
                                onChange={() => this.addToSelected(group)}
                                value="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={group.name}
                            secondary={
                                <React.Fragment>
                                    {group.description}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                )
            });
            var selectedGroups = this.state.selectedGroups.map((group) => {
                return (
                    <ListItem alignItems="flex-start" key={group._id}>
                        <ListItemAvatar>
                            <Checkbox
                                checked={true}
                                onChange={() => this.removeFromSelected(group)}
                                value="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={group.name}
                            secondary={
                                <React.Fragment>
                                    {group.description}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                )
            });
        } else {
            groups = <div></div>
        }
        return (
            <div id="postUploader">
                <h3 style={{ width: "100%", textAlign: "center" }}>Create a timed post!</h3>
                <small>Any post you upload here will be shown only for 24 hours</small>
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
                    <small>Press and hold the image to crop</small>
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
                    <h5>Choose Post Visibility</h5>
                    <List>
                        {groups}
                        {selectedGroups}
                    </List>

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
export default connect(mapStateToProps, null)(TempPostUploader);