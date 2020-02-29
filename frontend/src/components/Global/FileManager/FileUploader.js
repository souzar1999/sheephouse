import React from 'react';
import Upload from "./FileUploader/FileUploader";
import { useParams } from "react-router-dom";

function FileUploader() {
  const { uploadType, folderName } = useParams();

  return (
    <Upload uploadType = {uploadType} folderName = {folderName}> </Upload>
  );
}

export default FileUploader;
