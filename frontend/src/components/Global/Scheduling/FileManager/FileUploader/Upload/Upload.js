import React, { Component } from "react";
import Dropzone from "../Dropzone/Dropzone";
import "./Upload.css";
import Progress from "../Progress/Progress";
import Button from "@material-ui/core/Button";
import api from "../../../../../../services/api";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onFilesAdded(files) {
    this.setState(prevState => ({
      files: prevState.files.concat(files)
    }));
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [];
    const promisesUrl = [];

    var folderName = this.props.folderName;
    var uploadType = this.props.uploadType;
    this.state.files.forEach(file => {
      promisesUrl.push(api.get("storages/storage/"+ uploadType +"/folder/"+ folderName +"/" + file.name + "/upload"));
    });

    const resultado = await Promise.all(promisesUrl);
    console.log(resultado[0]);
    var contador = 0;
    this.state.files.forEach(file => {
      var url = resultado[contador].data.result;
      contador++;
      promises.push(this.sendRequest(file,url));
    });

    try {
      
      await Promise.all(promises);

      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file, url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });
      const formData = new FormData();
      formData.append("file", file, file.name);

      console.log("url"+ url);
      req.open("PUT", url);
      req.send(formData);

    });
  }

  renderProgress(file) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  renderActions() {
    if (this.state.successfullUploaded) {
      return (
        <Button
        type="submit"
        variant="contained"
        color="primary"
        size="small"
          onClick={() =>
            this.setState({ files: [], successfullUploaded: false })
          }
        >
          Limpar Arquivos
        </Button>
      );
    } else {
      return (
        
        <Button
        type="submit"
        variant="contained"
        color="primary"
        size="small"
        disabled={this.state.files.length < 0 || this.state.uploading}
        onClick={this.uploadFiles}
        >
          Upload
        </Button>
      );
    }
  }

  render() {
    return (
      <div className="Upload">
        <span className="Title">Upload de Arquivos</span>
        <div className="Content">
          <div>
            <Dropzone
              onFilesAdded={this.onFilesAdded}
              disabled={this.state.uploading || this.state.successfullUploaded}
            />
          </div>
          <div className="Files">
            {this.state.files.map(file => {
              return (
                <div key={file.name} className="Row">
                  <span className="Filename">{file.name}</span>
                  {this.renderProgress(file)}
                </div>
              );
            })}
          </div>
        </div>
        <div className="Actions">{this.renderActions()}</div>
      </div>
    );
  }
}

export default Upload;
