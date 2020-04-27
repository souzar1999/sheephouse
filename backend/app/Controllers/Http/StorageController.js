'use strict'

const uuidv4 = require('uuid/v4')
const redis = use('redis')
const AWS = require('aws-sdk');
const Env = use('Env')
const s3 = new AWS.S3({
  accessKeyId: Env.get('S3_KEY'),
  secretAccessKey: Env.get('S3_SECRET')
});

const client = redis.createClient(Env.get('REDIS_PORT'), Env.get('REDIS_URL'), { no_ready_check: true });

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
        file.Key = result[result.length - 1];
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

  async deleteObject({ params, request, response, view }) {

    const { storageType: StorageType, folderName: FolderName, fileName: FileName } = params

    const S3BucketName = Env.get('S3_BUCKET')

    var S3params = {
      Bucket: S3BucketName,
      Key: StorageType + '/' + FolderName + '/' + FileName
    };

    s3.deleteObject(S3params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      }
      else {
        console.log(data);
      }
    });

    return response.status(200).send({ result: "Objeto removido com sucesso" })
  }

  async zipFolder({ params, request, response, view }) {
    try {
      const { storageType: StorageType, folderName: FolderName } = params

      var s3params = {
        Bucket: Env.get('S3_BUCKET'),
        Prefix: StorageType + "/" + FolderName
      };

      var s3ObjectList = await s3.listObjectsV2(s3params).promise();

      var files = new Array();

      s3ObjectList.Contents.forEach(file => {
        var stringResult = file.Key;
        var result = stringResult.split('/');
        var fileName = result[result.length - 1];

        files.push({ S3Path: file.Key, FileName: fileName, Folder: StorageType + "/" + FolderName })
      });

      var key = uuidv4();
      client.set('zip:' + key, JSON.stringify(files), 'EX', 1440);

      return response.status(200).send({ result: key })
    } catch (err) {
      return response.status(200).send({ result: err.message })
    }
  }
}

module.exports = StorageController
