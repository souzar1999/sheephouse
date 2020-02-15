import React, { Component } from "react";
import "./FileUploader.css";
import Upload from "./Upload/Upload";

class FileUploader extends Component {
  render() {
    return (
        <div className="Card">
          <Upload uploadType = {this.props.uploadType}  folderName = {this.props.folderName}/>
        </div>
    );
  }
}

export default FileUploader;
