import 'dotenv/config'
import { S3Client } from '@aws-sdk/client-s3'
import { TextractClient } from '@aws-sdk/client-textract'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const region = process.env.AWS_REGION || 'us-east-1'
const hasStaticCredentials = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
const isLambdaRuntime = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)

const sharedClientConfig = {
  region,
  // In Lambda, the SDK uses the IAM execution role automatically.
  // Only inject static credentials for local development.
  ...(hasStaticCredentials
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
}

export const awsConfig = {
  region,
  s3BucketName: process.env.S3_BUCKET_NAME || '',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || '',
  dynamoDbReportKey: process.env.DYNAMODB_REPORT_KEY || '',
}

export const s3Client = new S3Client(sharedClientConfig)
export const textractClient = new TextractClient(sharedClientConfig)
export const dynamoDbClient = new DynamoDBClient(sharedClientConfig)

export function isAwsConfigured() {
  return hasStaticCredentials || isLambdaRuntime
}
