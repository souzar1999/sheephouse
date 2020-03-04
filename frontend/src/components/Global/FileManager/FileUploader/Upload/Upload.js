import React, { Component } from "react";
import Dropzone from "../Dropzone/Dropzone";
import "./Upload.css";
import Progress from "../Progress/Progress";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from "@material-ui/core/Button";
import api from "../../../../../services/api";
import history from "../../../../../history";
import axios from 'axios';

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
    this.backFileManager = this.backFileManager.bind(this);
    this.CompleteScheduling = this.CompleteScheduling.bind(this);
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
      promisesUrl.push(api.get("storages/storage/"+ uploadType +"/folder/"+ folderName +"/" + file.name + "/upload?contentType="+ file.type));
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
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  async backFileManager() {
    var folderName = this.props.folderName;
    var uploadType = this.props.uploadType;
    history.push(`/filemanager/${uploadType}/${folderName}`);
  }

  async CompleteScheduling() {

    var folderName = this.props.folderName;
    await api.get("/scheduling/" +folderName +"/complete")

    await this.backFileManager();
  }

  sendRequest(file, url) {
    return new Promise((resolve, reject) => {
      console.log(file);

      var folderName = this.props.folderName;
      var uploadType = this.props.uploadType;

      var options = {
        onUploadProgress: progressEvent => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          };
          this.setState({ uploadProgress: copy });
        },
        headers: {
          'key' : uploadType + '/' + folderName + '/' + file.name,
          'Content-Type': file.type
        }
      };
      axios.put(url,file,options).then(response => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(response);
      }).catch(error => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(error);
      });
      
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
            src="../../assets/baseline-check_circle_outline-24px.svg"
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
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button size="small" onClick={this.CompleteScheduling} disabled={ this.props.uploadType != "Scheduling"}>Concluir Agendamento</Button>
          <Button size="small" onClick={() => this.setState({ files: [], successfullUploaded: false }) }>Limpar Arquivos</Button>
        </ButtonGroup>
      );
    } else {
      return (
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button size="small" disabled={this.state.files.length < 0 || this.state.uploading} onClick={this.uploadFiles}> Upload</Button>
          <Button size="small" onClick={this.backFileManager}>Voltar</Button>
        </ButtonGroup>
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
