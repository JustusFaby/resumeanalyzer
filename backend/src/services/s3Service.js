import { PutObjectCommand } from '@aws-sdk/client-s3'
import { awsConfig, isAwsConfigured, s3Client } from '../config/aws.js'

export async function uploadResumeToS3({ fileBuffer, fileName, contentType = 'application/pdf' }) {
  if (!isAwsConfigured() || !awsConfig.s3BucketName) {
    return {
      uploaded: false,
      bucket: awsConfig.s3BucketName || null,
      key: null,
      reason: 'AWS S3 is not configured. Skipping upload in local mode.',
    }
  }

  const key = `resumes/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: awsConfig.s3BucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await s3Client.send(command)

  return {
    uploaded: true,
    bucket: awsConfig.s3BucketName,
    key,
  }
}
