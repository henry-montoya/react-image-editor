import React from "react";

class Setting extends React.Component {
  render() {
    return (
      <div>
        <label>{this.props.name}</label>
        <br />
        <input
          type="range"
          name={this.props.name}
          min={this.props.min}
          max={this.props.max}
          defaultValue={this.props.defaultValue}
          onChange={this.props.handleChange}
        />
      </div>
    );
  }
}

export default Setting;
