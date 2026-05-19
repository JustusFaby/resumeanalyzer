# Cloud Resume Analyzer Backend

A local-first, production-friendly Node.js + Express backend for analyzing resumes against a job description. This version runs fully offline with mock analysis while keeping AWS service integration points ready for S3, Textract, Bedrock, and DynamoDB.

## Tech Stack

- Node.js
- Express.js
- dotenv
- cors
- multer
- uuid
- AWS SDK v3 clients (ready for future integration)

## Folder Structure

backend/
  src/
    app.js
    server.js
    routes/
      resumeRoutes.js
    controllers/
      resumeController.js
    services/
      analysisService.js
      s3Service.js
      textractService.js
      bedrockService.js
      reportService.js
    middlewares/
      errorHandler.js
    config/
      aws.js
    utils/
      scoreResume.js
  .env.example
  package.json
  README.md

## Installation

1. Go to the backend folder:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create a local env file from the example:
   - Copy `.env.example` to `.env`

## Run Locally

- Development mode:
  - `npm run dev`
- Production-style local run:
  - `npm start`

Default API base URL:
- `http://localhost:5000`

## Available API Routes

### GET /api/health
Health check endpoint.

### POST /api/resumes/upload
Upload a resume PDF for local storage and mock text extraction.

Request:
- Content-Type: `multipart/form-data`
- Field: `resume` (PDF)

### POST /api/resumes/analyze
Analyze a resume against a job description and target role.

Accepted inputs:
- `multipart/form-data`
  - `resume` (PDF)
  - `jobDescription` (string)
  - `targetRole` (string)
- or JSON body using previously uploaded resume:
  - `uploadId` (string)
  - `jobDescription` (string)
  - `targetRole` (string)
- or JSON body with direct text:
  - `resumeText` (string)
  - `jobDescription` (string)
  - `targetRole` (string)

Returns:
- `reportId`
- `overallScore`
- `atsScore`
- `matchedKeywords`
- `missingKeywords`
- `extractedSkills`
- `strengths`
- `weaknesses`
- `recommendations`
- `targetRole`
- `createdAt`

### GET /api/resumes
List all generated reports (in-memory).

### GET /api/resumes/:id
Get a single report by `reportId`.

## Local Behavior (No AWS Required)

- Resume upload works locally using in-memory file handling.
- Text extraction is mocked if AWS Textract is not configured.
- Analysis is done with local keyword/skill matching.
- Reports are stored in-memory only (reset on server restart).

## Files to Replace/Upgrade for AWS Integration Later

When you are ready to connect real AWS services, update these files:

1. `src/services/s3Service.js`
   - Replace placeholder local skip logic with real S3 upload usage.
2. `src/services/textractService.js`
   - Switch fully to Textract document text extraction.
3. `src/services/reportService.js`
   - Replace in-memory storage with DynamoDB persistence.
4. `src/config/aws.js`
   - Finalize credentials strategy (IAM roles, profiles, or env vars).

This keeps the backend runnable now and easy to evolve into a production AWS-backed service later.
