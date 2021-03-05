import { RNS3 } from 'react-native-upload-aws-s3';

class AWSHelper {

    defaultBucketOptions = {
        keyPrefix: "activityUploads/",
        bucket: "wellnesssourceds",
        region: "us-east-2",
        accessKey: "AKIASPHSNV62UIIJ3ME6",
        secretKey: "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",
        successActionStatus: 201
    }

    /**
     * Uploads a single file to aws s3 bucket with bucket options
     */
    uploadFileToS3Bucket = async (fileObj = {},bucketOptions) => {
        let s3BucketOptions = {...this.defaultBucketOptions,bucketOptions}
        console.log("AWS file options>>>>>>>",JSON.stringify(fileObj))
        console.log("AWS bucket options>>>>>>>",JSON.stringify(s3BucketOptions))
        let promise = new Promise((resolve, reject) => {
            RNS3.put(fileObj, s3BucketOptions).progress(({loaded,total})=>{
                console.log("progress >>>>>",loaded, total)
            }).then((response) => {
                if (response.status === 201) {
                    console.log("file uploaded on AWS S3 bucket successfully>>>>>>", JSON.stringify(response.body))
                    let postResponse = response.body.postResponse
                    if (postResponse.location != "" && postResponse.location != undefined) {
                        resolve(postResponse.location)
                    }
                } else {
                    console.log("Failed to upload file to S3: >>", JSON.stringify(response))
                    reject()
                }
            }).catch((error) => {
                console.log("Error in AWS S3 bucket uploading file: >>", JSON.stringify(error))
                reject(error)
            })
        })
        return promise
    }

}

export default new AWSHelper()