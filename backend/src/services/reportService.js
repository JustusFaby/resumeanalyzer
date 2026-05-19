import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { awsConfig, dynamoDbClient, isAwsConfigured } from '../config/aws.js'

const reports = []
const uploadedResumes = []
const reportKeyName = awsConfig.dynamoDbReportKey || 'reportId'

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

function isDynamoConfigured() {
  return isAwsConfigured() && Boolean(awsConfig.dynamoDbTableName)
}

export function saveUploadedResume(upload) {
  uploadedResumes.unshift(upload)
  return upload
}

export function getUploadedResumeById(uploadId, userId) {
  return (
    uploadedResumes.find((upload) => upload.uploadId === uploadId && upload.userId === userId) || null
  )
}

export async function saveReport(report) {
  if (!isDynamoConfigured()) {
    reports.unshift(report)
    return report
  }

  const normalizedReport = report[reportKeyName]
    ? report
    : {
        ...report,
        [reportKeyName]: report.reportId || report.id || report.uploadId,
      }

  await documentClient.send(
    new PutCommand({
      TableName: awsConfig.dynamoDbTableName,
      Item: normalizedReport,
    })
  )

  return normalizedReport
}

export async function getAllReports(userId) {
  if (!isDynamoConfigured()) {
    return reports.filter((report) => report.userId === userId)
  }

  const response = await documentClient.send(
    new ScanCommand({
      TableName: awsConfig.dynamoDbTableName,
      FilterExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
  )

  const items = response.Items || []
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getReportById(reportId, userId) {
  if (!isDynamoConfigured()) {
    return reports.find((report) => report.reportId === reportId && report.userId === userId) || null
  }

  const response = await documentClient.send(
    new GetCommand({
      TableName: awsConfig.dynamoDbTableName,
      Key: { [reportKeyName]: reportId },
    })
  )

  if (!response.Item || response.Item.userId !== userId) {
    return null
  }

  return response.Item
}
