import React from "react";
import Setting from "./Setting";

class ImageSettings extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-3">
          <form>
            <Setting
              name={this.props.contrast.name}
              min={this.props.contrast.min}
              max={this.props.contrast.max}
              defaultValue={this.props.contrast.defaultValue}
              handleChange={this.props.handleContrastChange}
            />
            <Setting
              name={this.props.hue.name}
              min={this.props.hue.min}
              max={this.props.hue.max}
              defaultValue={this.props.hue.defaultValue}
              handleChange={this.props.handleHueChange}
            />
            <Setting
              name={this.props.invert.name}
              min={this.props.invert.min}
              max={this.props.invert.max}
              defaultValue={this.props.invert.defaultValue}
              handleChange={this.props.handleInvertChange}
            />
            <Setting
              name={this.props.invert.name}
              min={this.props.invert.min}
              max={this.props.invert.max}
              defaultValue={this.props.invert.defaultValue}
              handleChange={this.props.handleInvertChange}
            />
            <Setting
              name={this.props.brightness.name}
              min={this.props.brightness.min}
              max={this.props.brightness.max}
              defaultValue={this.props.brightness.defaultValue}
              handleChange={this.props.handleBrightnessChange}
            />
            <Setting
              name={this.props.saturate.name}
              min={this.props.saturate.min}
              max={this.props.saturate.max}
              defaultValue={this.props.saturate.defaultValue}
              handleChange={this.props.handleSaturateChange}
            />
            <Setting
              name={this.props.sepia.name}
              min={this.props.sepia.min}
              max={this.props.sepia.max}
              defaultValue={this.props.sepia.defaultValue}
              handleChange={this.props.handleSepiaChange}
            />
            <Setting
              name={this.props.grayscale.name}
              min={this.props.grayscale.min}
              max={this.props.grayscale.max}
              defaultValue={this.props.grayscale.defaultValue}
              handleChange={this.props.handleGrayscaleChange}
            />
            <div>
              <input
                type="reset"
                value="restore defaults"
                onClick={this.props.handleRestoreDefault}
              />
            </div>
          </form>
        </div>
        <div className="col-md-9">
          <img
            src={this.props.newImgSrc}
            className="mw-100"
            style={{
              filter: `contrast(${this.props.contrast.setValue}%) hue-rotate(${
                this.props.hue.setValue
              }deg) invert(${this.props.invert.setValue}%)
 brightness(${this.props.brightness.setValue}%) saturate(${
                this.props.saturate.setValue
              }%) sepia(${this.props.sepia.setValue}%) grayscale(${
                this.props.grayscale.setValue
              }%)`
            }}
          />
        </div>
      </div>
    );
  }
}

export default ImageSettings;
