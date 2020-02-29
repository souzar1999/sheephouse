'use strict'

const AWS = require('aws-sdk');
const Env = use('Env')
const s3 = new AWS.S3({
  accessKeyId: Env.get('S3_KEY'),
  secretAccessKey: Env.get('S3_SECRET')
});

class StorageController {
  async getAllFilesFromFolder({ params, request, response, view }) {

    const { storageType: StorageType, folderName: FolderName } = params

    var s3params = {
      Bucket: Env.get('S3_BUCKET'),
      Prefix: StorageType + "/" + FolderName
    };
    var s3ObjectList = await s3.listObjectsV2(s3params).promise();
    if (s3ObjectList.KeyCount == 0) {
      return response.status(200).send({ error: { message: "Pasta Vazia." } })
    } else {
      s3ObjectList.Contents.forEach(file => {
        var stringResult = file.Key;
        var result = stringResult.split('/');
        file.Key = result[result.length-1];
      });

      return response.status(200).send({ result: s3ObjectList.Contents })
    }

  }

  async getPutPreSignedUrl({ params, request, response, view }) {

    const { storageType: StorageType, folderName: FolderName, fileName: FileName } = params;
    const query = request.get();
    const S3BucketName = Env.get('S3_BUCKET');
    var S3params = {
      Bucket: S3BucketName,
      Key: StorageType + '/' + FolderName + '/' + FileName,
      Expires: 500,
      ContentType: query.contentType,
    };

    const Url = await s3.getSignedUrlPromise('putObject', S3params)

    return response.status(200).send({ result: Url })
  }

  async getDownloadPreSignedUrl({ params, request, response, view }) {

    const { storageType: StorageType, folderName: FolderName, fileName: FileName } = params

    const S3BucketName = Env.get('S3_BUCKET')

    var S3params = {
      Bucket: S3BucketName,
      Key: StorageType + '/' + FolderName + '/' + FileName,
      Expires: 7200000
    };

    const Url = await s3.getSignedUrlPromise('getObject', S3params)

    return response.status(200).send({ result: Url })
  }
}

module.exports = StorageController
