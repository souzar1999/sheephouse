import React from "react";
import Upload from "./FileUploader/FileUploader";
import { useParams } from "react-router-dom";

function FileUploader() {
  const { uploadType, folderName, dbCode } = useParams();

  return (
    <Upload uploadType={uploadType} folderName={folderName} dbCode={dbCode}>
      {" "}
    </Upload>
  );
}

export default FileUploader;
