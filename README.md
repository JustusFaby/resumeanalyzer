# 📊 Cloud Resume Analyzer

An intelligent, serverless web application that analyzes resume PDFs against target job descriptions and roles using AI. It provides an ATS (Applicant Tracking System) compatibility score, keyword analysis, technical skill extraction, and rich qualitative feedback (strengths, weaknesses, actionable recommendations).

---

## 🏗️ System Architecture

The application is built on a modern, fully serverless, and secure cloud architecture using AWS and Groq AI:

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend ["Frontend (AWS Amplify)"]
        UI["Vite + React App"]
        CognitoAuth["AWS Cognito (Authentication)"]
    end

    %% Backend Layer
    subgraph Backend ["Backend (AWS Lambda + API Gateway)"]
        APIGW["API Gateway (HTTP API Route Proxy)"]
        ExpressLambda["Lambda Function (Express + serverless-http)"]
    end

    %% AWS Services Layer
    subgraph AWS ["AWS Cloud Infrastructure"]
        S3["S3 Bucket (PDF Upload Storage)"]
        Textract["AWS Textract (Document Text Extraction)"]
        DynamoDB["DynamoDB Table (Reports & Upload Records)"]
    end

    %% AI Integration Layer
    subgraph AI ["AI Analysis Engine"]
        Groq["Groq API (llama-3.1-8b-instant)"]
    end

    %% Data Flow Connections
    UI -->|1. Authenticates| CognitoAuth
    UI -->|2. HTTP Request (with JWT)| APIGW
    APIGW -->|3. Event Proxy| ExpressLambda
    ExpressLambda -->|4. Validates JWT Token| CognitoAuth
    ExpressLambda -->|5. Uploads Resume PDF| S3
    ExpressLambda -->|6. Extracts Text from PDF| Textract
    ExpressLambda -->|7. Evaluates Resume & JD| Groq
    ExpressLambda -->|8. Persists Analysis Report| DynamoDB
    ExpressLambda -->|9. Returns Report JSON| UI
```

### Flow Breakdown:
1. **User Authentication**: The user logs in securely using **AWS Cognito**. The app receives a secure JWT identity token.
2. **Resume Upload**: The user uploads their resume PDF and enters a job description/target role. The React frontend sends this data along with the Cognito JWT in the authorization header to **API Gateway**.
3. **Lambda Execution**: **API Gateway** proxies the request to the backend **AWS Lambda** function, where `serverless-http` maps it to an **Express.js** application.
4. **JWT Verification**: The backend validates the Cognito JWT token to securely identify the active user.
5. **Storage & Extraction**: 
   - The PDF file buffer is safely uploaded to a private **Amazon S3** bucket.
   - The text contents are programmatically extracted using **AWS Textract**.
6. **AI Analysis**: The extracted resume text, job description, and target role are compiled into a comprehensive prompt and sent to the **Groq AI** engine utilizing the high-speed `llama-3.1-8b-instant` model.
7. **Report Persistence**: The structured JSON analysis output returned by Groq is saved securely under the user's ID in **Amazon DynamoDB**.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend UI** | React + Vite + Tailwind CSS | Highly responsive, beautiful interface with smooth micro-interactions. |
| **Authentication** | AWS Cognito | Secure sign-up, login, and token-based API protection. |
| **Hosting (Web)** | AWS Amplify | CI/CD pipeline and static web hosting for the React frontend. |
| **API Gateway** | Amazon API Gateway (HTTP API) | Lightweight, low-latency, and cost-effective API proxying. |
| **Compute** | AWS Lambda + serverless-http | Serverless, auto-scaling backend execution running Node.js 20.x on ARM64. |
| **File Storage** | Amazon S3 | Private, encrypted storage for uploaded resume PDFs. |
| **OCR / Parsing** | AWS Textract | Enterprise document parsing to accurately extract text from PDF files. |
| **Database** | Amazon DynamoDB | Fully managed NoSQL database storing persistent resume reports with pay-per-request billing. |
| **AI Processing** | Groq API (`llama-3.1-8b-instant`) | Ultra-fast Llama 3.1 AI model providing semantic keyword and skill analysis. |

---

## 📁 Repository Structure

```
.
├── backend/                   # Express.js Serverless API
│   ├── src/
│   │   ├── config/            # AWS S3, Textract, DynamoDB clients config
│   │   ├── controllers/       # Route request & response handlers
│   │   ├── middlewares/       # Cognito JWT Auth and central error handler
│   │   ├── routes/            # Express endpoint routing
│   │   ├── services/          # Groq AI, S3, Textract, & DynamoDB services
│   │   ├── utils/             # Helper utilities
│   │   ├── app.js             # Main Express app initialization
│   │   ├── lambda.js          # serverless-http handler wrapper for AWS Lambda
│   │   └── server.js          # Local Express server entry point
│   ├── serverless.yml         # Serverless Framework configuration
│   └── package.json           # Backend dependencies and deployment scripts
│
├── src/                       # Frontend React Source Code
│   ├── components/            # UI components (analysis results, uploaders)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Cognito and API client integrations
│   └── styles/                # Global CSS and Tailwind configs
├── package.json               # Frontend dependencies
└── README.md                  # Project documentation (this file)
```

---

## 🚀 Deployment Instructions

### Backend Deployment (AWS Lambda)

1. Make sure your AWS CLI is configured with the correct credentials.
2. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
3. Copy the example environment file and configure your values (add your Groq API Key and Cognito details):
   ```bash
   cp .env.example .env
   ```
4. Deploy the serverless stack using the built-in Serverless Framework command:
   ```bash
   npm run deploy
   ```
   *This will automatically package your Node.js application, provision an S3 bucket, DynamoDB table, IAM roles, Lambda function, and output your live **API Gateway URL**.*

### Frontend Deployment (AWS Amplify)

1. Connect your GitHub repository to **AWS Amplify Console**.
2. Under **Environment variables**, set:
   ```env
   VITE_API_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com
   VITE_COGNITO_REGION=us-east-1
   VITE_COGNITO_USER_POOL_ID=<your-user-pool-id>
   VITE_COGNITO_CLIENT_ID=<your-client-id>
   ```
3. Deploy the application. Amplify will handle the build pipeline and host your web app on a secure HTTPS domain.

---

## 📜 License

This project is open-source and available under the MIT License.
