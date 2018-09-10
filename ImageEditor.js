import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { updateAvatarById, updateMedia } from "./ProfileServer";
import { connect } from "react-redux";
import ImageSettings from "./ImageSettings";
import { putPresigedUrl, putUploadFile } from "../../services/s3.service";

class ImageEditor extends React.Component {
  state = {
    imageUrl: "",
    imagePreview: "",
    //------Crop States------------
    src: null,
    prevPropsSendImage: this.props.sendImage,
    croppedImgSrc: null,
    naturalDimensions: {},
    cropDimensions: {},
    cropped: false,
    crop: {
      x: 10,
      y: 10,
      width: 80,
      height: 80
    },
    profileCrop: {
      x: 10,
      y: 10,
      aspect: 1 / 1,
      width: 10,
      height: 10
    },
    //----------Image Style States----------
    contrast: {
      name: "contrast",
      setValue: 100,
      defaultValue: 100,
      min: 0,
      max: 200
    },
    hue: { name: "hue", setValue: 0, defaultValue: 0, min: -360, max: 360 },
    invert: { name: "invert", setValue: 0, defaultValue: 0, min: 0, max: 100 },
    brightness: {
      name: "brightness",
      setValue: 100,
      defaultValue: 100,
      min: 0,
      max: 200
    },
    saturate: {
      name: "saturate",
      setValue: 100,
      defaultValue: 100,
      min: 0,
      max: 100
    },
    sepia: { name: "sepia", setValue: 0, defaultValue: 0, min: 0, max: 100 },
    grayscale: {
      name: "grayscale",
      setValue: 0,
      defaultValue: 0,
      min: 0,
      max: 100
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.editImgStyles !== prevProps.editImgStyles) {
      if (!this.props.editImageStyles && !this.props.profileCropMode) {
        this.onCropComplete(this.state.crop);
      } else if (!this.props.editImageStyles && this.props.profileCropMode) {
        this.onCropComplete(this.state.profileCrop);
      }
    }

    if (this.props.sendImage !== prevProps.sendImage) {
      this.uploadToAws().then(imageUrl => {
        if (this.props.profileCropMode) {
          let imgPayload = {
            avatarUrl: imageUrl,
            id: this.props.currentUser.id
          };
          updateAvatarById(this.props.currentUser.id, imgPayload).then(
            response => {
              this.props.toggleImgModal();
              this.props.resetImageUrl();
              this.props.updateProfilePic(this.props.currentUser.id);
            }
          );
        } else {
          let imgPayload = {
            userId: this.props.currentUser.id,
            type: "image",
            url: imageUrl,
            title: this.props.images[this.props.selectedImg].title,
            caption: this.props.images[this.props.selectedImg].caption,
            id: this.props.images[this.props.selectedImg].alt,
            width: this.state.cropDimensions.width,
            height: this.state.cropDimensions.height
          };
          let replacedImg = {
            userId: this.props.currentUser.id,
            type: "image",
            src: imageUrl,
            thumbnail: imageUrl,
            title: this.props.images[this.props.selectedImg].title,
            caption: this.props.images[this.props.selectedImg].caption,
            id: this.props.images[this.props.selectedImg].alt,
            thumbnailWidth: this.state.cropDimensions.width,
            thumbnailHeight: this.state.cropDimensions.height
          };
          this.props.replaceCroppedImg(replacedImg);

          updateMedia(this.props.currentUser.id, imgPayload).then(response => {
            this.props.toggleLoader();
            this.props.toggleImgModal();
          });
        }
      });
    }
  }

  //------------AWS Image Upload----------------------

  uploadToAws = () => {
    return putPresigedUrl().then(res => {
      var presignedUrl = res.data.item;
      var options = {
        headers: {
          "Content-Type": "image/png"
        },
        withCredentials: false
      };

      return putUploadFile(presignedUrl, this.blob, options).then(s3res => {
        var imageUrl = presignedUrl.split("?", 2)[0];
        this.setState(
          {
            imageUrl: presignedUrl.split("?", 2)[0],
            imagePreview: presignedUrl.split("?", 2)[0]
          },
          () => console.log("finalURL", this.state.imageUrl)
        );
        return imageUrl;
      });
    });
  };

  //---------Image Styling Change Handlers-------------
  handleRestoreDefault = e => {
    this.setState(prevState => ({
      contrast: {
        ...prevState.contrast,
        setValue: this.state.contrast.defaultValue
      },
      hue: { ...prevState.hue, setValue: this.state.hue.defaultValue },
      invert: { ...prevState.invert, setValue: this.state.invert.defaultValue },
      brightness: {
        ...prevState.brightness,
        setValue: this.state.brightness.defaultValue
      },
      saturate: {
        ...prevState.saturate,
        setValue: this.state.saturate.defaultValue
      },
      sepia: { ...prevState.sepia, setValue: this.state.sepia.defaultValue },
      grayscale: {
        ...prevState.grayscale,
        setValue: this.state.grayscale.defaultValue
      }
    }));
  };

  handleContrastChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      contrast: { ...prevState.contrast, setValue: newValue }
    }));
  };
  handleHueChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      hue: { ...prevState.hue, setValue: newValue }
    }));
  };
  handleInvertChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      invert: { ...prevState.invert, setValue: newValue }
    }));
  };
  handleInvertChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      invert: { ...prevState.invert, setValue: newValue }
    }));
  };
  handleBrightnessChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      brightness: { ...prevState.brightness, setValue: newValue }
    }));
  };
  handleSaturateChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      saturate: { ...prevState.saturate, setValue: newValue }
    }));
  };
  handleSepiaChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      sepia: { ...prevState.sepia, setValue: newValue }
    }));
  };

  handleGrayscaleChange = e => {
    let newValue = e.target.value;
    this.setState(prevState => ({
      grayscale: { ...prevState.grayscale, setValue: newValue }
    }));
  };

  //-------Image Crop Functions-----------------

  getCroppedImg = (srcImg, croppedImg) => {
    let img = new Image();

    img.src = this.props.newImgSrc;

    const newImgX = (srcImg.width * croppedImg.x) / 100;
    const newImgY = (srcImg.height * croppedImg.y) / 100;
    const newImgWidth = (srcImg.width * croppedImg.width) / 100;
    const newImgHeight = (srcImg.height * croppedImg.height) / 100;

    const canvas = document.createElement("canvas");
    canvas.width = newImgWidth;
    canvas.height = newImgHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `contrast(${this.state.contrast.setValue}%) hue-rotate(${
      this.state.hue.setValue
    }deg) invert(${this.state.invert.setValue}%) brightness(${
      this.state.brightness.setValue
    }%) saturate(${this.state.saturate.setValue}%) sepia(${
      this.state.sepia.setValue
    }%) grayscale(${this.state.grayscale.setValue}%)`;

    ctx.drawImage(
      img,
      newImgX,
      newImgY,
      newImgWidth,
      newImgHeight,
      0,
      0,
      newImgWidth,
      newImgHeight
    );

    // ctx.filter = `contrast(${this.state.contrast.setValue}%) invert(${this.state.invert.setValue}%) brightness(${
    //   this.state.brightness.setValue
    // }%) saturate(${this.state.saturate.setValue}%) sepia(${this.state.sepia.setValue}%) grayscale(${
    //   this.state.grayscale.setValue
    // }%)`;

    canvas.toBlob(blob => {
      let img = document.createElement("img");
      img.src = window.URL.createObjectURL(blob);
      this.blob = blob;

      img.onload = function() {
        URL.revokeObjectURL(img.src);
      };
      this.setState({
        croppedImgSrc: img.src
      });
    });

    if (!this.state.cropped) {
      this.setState({
        cropped: true
      });
    }
  };

  onCropChange = crop => {
    if (!this.props.profileCropMode) {
      this.setState({ crop });
    } else {
      this.setState({
        profileCrop: crop
      });
    }
  };

  onImgLoad = ({ target: img }) => {
    this.setState({
      naturalDimensions: {
        height: img.offsetHeight,
        width: img.offsetWidth
      }
    });
  };

  getImageDimensions = ({ target: img }) => {
    this.setState({
      cropDimensions: {
        height: img.offsetHeight,
        width: img.offsetWidth
      }
    });
  };

  onImageLoaded = () => {
    console.log("onCropComplete", image);
  };

  onCropComplete = crop => {
    if (!this.props.profileCropMode) {
      this.setState(
        {
          crop: {
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height
          }
        },
        this.getCroppedImg(this.state.naturalDimensions, this.state.crop)
      );
    } else {
      this.setState(
        {
          profileCrop: {
            x: crop.x,
            y: crop.y,
            aspect: 1 / 1,
            width: crop.width,
            height: crop.height
          }
        },
        this.getCroppedImg(this.state.naturalDimensions, this.state.profileCrop)
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.editImgStyles && (
          <div className="row">
            <div className="col-md-12">
              <ImageSettings
                contrast={this.state.contrast}
                hue={this.state.hue}
                invert={this.state.invert}
                brightness={this.state.brightness}
                saturate={this.state.saturate}
                sepia={this.state.sepia}
                grayscale={this.state.grayscale}
                newImgSrc={this.props.newImgSrc}
                handleRestoreDefault={this.handleRestoreDefault}
                handleContrastChange={this.handleContrastChange}
                handleHueChange={this.handleHueChange}
                handleInvertChange={this.handleInvertChange}
                handleBrightnessChange={this.handleBrightnessChange}
                handleSaturateChange={this.handleSaturateChange}
                handleSepiaChange={this.handleSepiaChange}
                handleGrayscaleChange={this.handleGrayscaleChange}
              />
            </div>
          </div>
        )}

        {!this.props.editImgStyles && (
          <div className="row">
            <div className="col-md-6">
              {!this.props.profileCropMode ? (
                <h2 className="text-center font-weight-bold">Set Crop</h2>
              ) : (
                <h2 className="text-center font-weight-bold">
                  Set Profile Photo Crop
                </h2>
              )}
              {!this.props.updatePic &&
                this.props.images &&
                this.props.selectedImg && (
                  <ReactCrop
                    imageStyle={{ width: "100%" }}
                    crossorigin="anonymous"
                    src={this.props.newImgSrc}
                    crop={
                      !this.props.profileCropMode
                        ? this.state.crop
                        : this.state.profileCrop
                    }
                    onChange={this.onCropChange}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                  />
                )}
              {this.props.updatePic && (
                <ReactCrop
                  imageStyle={{ width: "100%" }}
                  crossorigin="anonymous"
                  src={this.props.newImgSrc}
                  crop={this.state.profileCrop}
                  onChange={this.onCropChange}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                />
              )}
            </div>
            <div className="col-md-6" style={{ overflow: "hidden" }}>
              <h2 className="text-center font-weight-bold">Image Preview</h2>
              {!this.state.cropped && (
                <img
                  src={this.props.newImgSrc}
                  onLoad={this.onImgLoad}
                  className=""
                />
              )}

              {this.state.cropped && (
                <img
                  className="mw-100"
                  style={{
                    filter: `contrast(${
                      this.state.contrast.setValue
                    }%) hue-rotate(${this.state.hue.setValue}deg) invert(${
                      this.state.invert.setValue
                    }%)
                     brightness(${this.state.brightness.setValue}%) saturate(${
                      this.state.saturate.setValue
                    }%)  sepia(${this.state.sepia.setValue}%) grayscale(${
                      this.state.grayscale.setValue
                    }%)`
                  }}
                  src={this.state.croppedImgSrc}
                  onLoad={this.getImageDimensions}
                />
              )}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps)(ImageEditor);
