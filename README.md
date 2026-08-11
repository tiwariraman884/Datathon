# 🛡️ CardSentinel — IBM Z Fraud Detection

<div align="center">

**An AI-powered credit card fraud detection system with a real-time interactive dashboard.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-RandomForest-orange?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-Educational-purple?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**CardSentinel** is an end-to-end credit card fraud detection prototype built for the **IBM Z Datathon**. It combines a trained **Random Forest machine learning model**, a **FastAPI backend**, a **document verification engine**, transaction simulation, and a fully responsive **fraud detection dashboard** to demonstrate a real-time fraud analysis workflow.

---

## 🚀 Key Features

### 🤖 Machine Learning Fraud Detection
- **Random Forest Classifier** trained on real-world credit card transaction data
- Binary classification: **FRAUD** or **LEGITIMATE**
- Custom fraud probability **threshold** (0.35) tuned for precision-recall balance
- **PR-AUC: 0.801**
- Risk-level scoring: **HIGH / MEDIUM / LOW**

### ⚡ FastAPI Backend — *CardSentinel API v1.0.0*
- Full REST API with CORS support
- `/predict` endpoint for real-time transaction inference
- `/verify-document` endpoint for document integrity verification (PDF, JPG, PNG)
- `/stats`, `/history`, `/transactions`, `/dashboard` for live monitoring data
- `/sample-transaction` and `/sample-fraud-transaction` for testing

### 📊 Interactive Fraud Detection Dashboard
A responsive single-page dashboard with multiple monitoring sections:

| Section | Description |
|---------|-------------|
| **Dashboard** | High-level KPIs — total transactions, fraud count, fraud rate |
| **Transactions** | Live transaction feed with prediction results |
| **Risk Analysis** | Risk distribution charts and fraud activity breakdown |
| **Customer Onboarding** | Rule-based risk checks (IP, email, transaction limits) |
| **Document Verifier** | Upload identity documents (PDF/JPG/PNG) & selfies for liveness checks |
| **Transaction Analyzer** | Manual transaction feature input → live prediction |
| **System** | Model info, API health, and system status |

### 🛡️ KYC & Customer Onboarding
- **IP Risk Analysis**: Automatic location detection with high-risk jurisdiction flagging
- **Rule-based Risk Engine**: Checks email domains, phone length, and high-value transactions
- **Liveness Verification**: Selfie upload and verification capability
- **Decision Engine**: Automated APPROVE/REVIEW/DECLINE workflows

### 🔄 Transaction Simulator
Streams historical transaction records to the backend to simulate live traffic and demonstrate real-time fraud prediction.

### 📁 Document Verification
Upload transaction-supporting documents for basic integrity checks:
- File type validation (PDF, JPG, PNG only)
- File size validation (max 5 MB)
- SHA-256 hash generation for document fingerprinting

### 📈 Data Exploration
Jupyter notebooks for EDA, visualization, and understanding the dataset's fraud distribution patterns.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────────────────┐
                    │       CardSentinel Frontend        │
                    │   (HTML + CSS + JavaScript SPA)    │
                    └──────────┬───────────────┬─────────┘
                               │               │
                    ┌──────────▼──────────┐  ┌─▼─────────────────────┐
                    │  Transaction Input  │  │   Document Upload      │
                    └──────────┬──────────┘  └─┬─────────────────────┘
                               │               │
                    ┌──────────▼───────────────▼──────────┐
                    │     FastAPI Backend (app.py)         │
                    │  CardSentinel Fraud Detection API    │
                    ├──────────────────────────────────────┤
                    │  POST /predict   POST /verify-document│
                    │  GET  /stats     GET  /dashboard      │
                    │  GET  /history   GET  /transactions   │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │       Random Forest Model            │
                    │   (fraud_model.pkl — 30 features)    │
                    └──────────────────────────────────────┘
```

For simulated real-time processing:

```text
creditcard.csv  →  simulator.py  →  POST /predict  →  Model  →  Dashboard
```

---

# 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **ML / Data** | Python, Pandas, NumPy, Scikit-learn, Random Forest, Matplotlib |
| **Backend** | FastAPI, Uvicorn, Pydantic, Joblib, python-multipart |
| **Frontend** | HTML5, Vanilla CSS, JavaScript (ES6+) |
| **Dev & VCS** | Git, GitHub, Git LFS |

---

# 📁 Project Structure

```text
IBM-Z-FRAUD-DETECTION/
│
├── backend/
│   ├── app.py                  # FastAPI application (CardSentinel API)
│   └── simulator.py            # Sends batch transactions to /predict
│
├── data/
│   ├── creditcard.csv          # Full dataset — Git LFS tracked
│   └── creditcard_tmp.csv      # Temporary transaction sample
│
├── models/
│   └── fraud_model.pkl         # Trained Random Forest model package
│
├── notebooks/
│   └── 01_exploration.ipynb    # Exploratory Data Analysis notebook
│
├── frontend/
│   ├── index.html              # Single-page dashboard application
│   ├── style.css               # Dashboard styles
│   ├── app.js                  # Dashboard logic & API calls
│   └── assets/
│       └── logo.jpg            # CardSentinel logo
│
├── simulator.py                # Streaming transaction generator
├── README.md
├── .gitignore
└── .gitattributes              # Git LFS configuration
```

---

# 📊 Dataset

The project uses a credit card transaction dataset containing transaction records with numerical features and fraud labels.

The dataset is used to train and evaluate the fraud detection model and to simulate incoming transaction activity.

The primary dataset is stored in:

```text
data/creditcard.csv
```

Large dataset files are managed using **Git LFS** to avoid unnecessarily increasing the size of the Git repository.

---

# 🤖 Machine Learning Model

The fraud detection engine uses a **Random Forest Classifier**.

Random Forest is an ensemble learning algorithm that combines multiple decision trees to make a classification decision.

For this project, the model performs binary classification:

```text
Transaction
     │
     ├── Fraud
     │
     └── Legitimate
```

### Model Configuration

* **Model type:** Random Forest Classifier
* **Number of features:** 30 (`Time`, `V1`–`V28`, `Amount`)
* **Detection threshold:** 0.35
* **PR-AUC:** 0.801

### Risk Levels

In addition to the binary prediction, the model assigns a **risk level** based on the fraud probability:

| Risk Level | Fraud Probability Range |
|------------|-------------------------|
| **HIGH**   | `>= 0.70`               |
| **MEDIUM** | `>= 0.35` and `< 0.70`  |
| **LOW**    | `< 0.35`                |

The trained model receives transaction features and produces the corresponding fraud/legitimate prediction along with the risk level.

---

# 🔌 API Reference

Base URL: `http://127.0.0.1:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — API status |
| `POST` | `/predict` | Predict fraud/legitimate for a transaction |
| `POST` | `/api/onboard` | Customer risk check (email, IP, limits) |
| `POST` | `/verify-document` | Verify uploaded document (PDF/JPG/PNG) |
| `POST` | `/verify-selfie` | Verify selfie for liveness checks (JPG/PNG) |
| `GET` | `/stats` | Live fraud detection statistics |
| `GET` | `/history` | Full transaction prediction history |
| `GET` | `/transactions` | Recent transactions (latest first) |
| `GET` | `/dashboard` | Compiled dashboard data (overview + risk) |
| `GET` | `/sample-transaction` | Random sample transaction from dataset |
| `GET` | `/sample-fraud-transaction` | Real fraudulent transaction from dataset |

### `POST /predict` — Transaction Prediction

**Request body:**
```json
{
  "Time": 5123.0,
  "V1": -1.359,
  "V2": -0.072,
  "...": "...",
  "V28": 0.235,
  "Amount": 149.62
}
```

**Response:**
```json
{
  "transaction_id": 42,
  "fraud_probability": 0.87,
  "prediction": "FRAUD",
  "risk_level": "HIGH",
  "threshold": 0.35
}
```

### `POST /verify-document` & `POST /verify-selfie`

**Request:** `multipart/form-data` with a `file` field (PDF, JPG, or PNG — max 5 MB)

**Response:**
```json
{
  "verified": true,
  "status": "VERIFIED",
  "score": 100,
  "message": "Document passed basic validation.",
  "file": {
    "name": "statement.pdf",
    "type": "application/pdf",
    "size": 204800,
    "size_formatted": "200.0 KB",
    "sha256": "a3f5c..."
  }
}
```

### `POST /api/onboard` — Customer Onboarding Risk Check

**Request body:**
```json
{
  "name": "John Doe",
  "email": "test@mailinator.com",
  "phone": "1234567890",
  "amount": 15000,
  "country_code": "RU",
  "country_name": "Russia"
}
```

**Response:**
```json
{
  "decision": "decline",
  "flags": [
    { "icon": "🚫", "text": "Disposable email domain detected: mailinator.com" },
    { "icon": "⚠️", "text": "High transaction amount: $15,000.00 exceeds $10,000 threshold." },
    { "icon": "🚫", "text": "Connection from high-risk jurisdiction: Russia (RU)." }
  ]
}
```

---

# ⚙️ Setup & Installation

## 1. Clone the Repository

```bash
git clone https://github.com/tiwariraman884/Datathon.git
cd Datathon
```

## 2. Install Git LFS

Install Git LFS if it is not already installed.

Then retrieve the large dataset files:

```bash
git lfs pull
```

## 3. Create a Virtual Environment

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS / Linux

```bash
python -m venv .venv
source .venv/bin/activate
```

## 4. Install Dependencies

```bash
pip install pandas numpy scikit-learn matplotlib requests fastapi uvicorn joblib python-multipart
```

---

# ▶️ Running the Application

## Step 1 — Start the FastAPI Backend

```bash
python -m uvicorn backend.app:app --reload
```

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:8000/` | API health check |
| `http://127.0.0.1:8000/docs` | Interactive Swagger UI |
| `http://127.0.0.1:8000/redoc` | ReDoc API documentation |

## Step 2 — Open the Frontend Dashboard

Open `frontend/index.html` directly in a browser, or serve it with a local HTTP server:

```bash
# Python built-in server
python -m http.server 5500 --directory frontend
```

Then visit: `http://localhost:5500`

## Step 3 (Optional) — Run the Transaction Simulator

```bash
python backend/simulator.py
```

Or use the streaming generator from the project root:

```python
from simulator import stream_transactions

for tx in stream_transactions(rate=1.0):
    print(tx)
```

---

# 🖥️ Using the Dashboard

After starting the backend, open `frontend/index.html` in your browser.

| Section | What You'll See |
|---------|----------------|
| **Dashboard** | Total transactions, fraud count, fraud rate, recent alerts |
| **Transactions** | Live transaction table with ID, amount, prediction, risk |
| **Risk Analysis** | Risk distribution (HIGH / MEDIUM / LOW) with live counters |
| **System** | Model type, features, threshold, and API health |
| **Transaction Analyzer** | Fill in 30 features → get instant fraud prediction |
| **Document Verifier** | Upload PDF/JPG/PNG → get verification result and SHA-256 hash |

---

# 🔐 Fraud Detection Workflow

The application follows this general workflow:

```text
1. Transaction received
          ↓
2. Transaction features extracted
          ↓
3. Features sent to FastAPI
          ↓
4. /predict endpoint receives request
          ↓
5. Random Forest model processes transaction
          ↓
6. Fraud / Legitimate classification
          ↓
7. Result displayed to user
```

This architecture separates the machine learning inference layer from the frontend presentation layer, making the system easier to demonstrate and extend.

---

# 📱 Responsive Design

The dashboard is designed to work across different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile

The interface adapts its layout for smaller screens while maintaining access to the primary fraud detection functionality.

---

# 📈 Future Enhancements

Potential future improvements include:

* Real-time streaming infrastructure using Apache Kafka or similar technologies.
* Model monitoring and drift detection.
* Advanced fraud-risk scoring.
* Explainable AI for individual fraud predictions.
* User authentication and role-based access.
* Historical fraud trend visualization.
* Automated model retraining.
* Cloud deployment.
* Database-backed transaction storage.
* Advanced anomaly detection alongside supervised classification.

---

# ⚠️ Limitations

This project is primarily a fraud detection prototype and demonstration system.

Its predictions depend on the quality and characteristics of the training dataset. Real-world financial fraud detection systems require additional considerations such as:

* Large-scale streaming infrastructure
* Model monitoring
* Data drift detection
* False-positive management
* Security controls
* Regulatory compliance
* Continuous model evaluation
* Production-grade infrastructure

The system should therefore not be treated as a production financial decision-making system without further validation and security testing.

---

# 🎯 Project Objective

The objective of this project is to demonstrate how machine learning can be integrated with a backend API and interactive dashboard to detect potentially fraudulent credit card transactions.

The project focuses on combining:

```text
Machine Learning
       +
FastAPI
       +
Transaction Simulation
       +
Interactive Dashboard
       =
Fraud Detection System
```

---

# 🏆 IBM Z Datathon

This project was developed as part of the **IBM Z Datathon** challenge.

It demonstrates the use of machine learning, backend APIs, transaction processing, document verification, and data visualization to address the real-world problem of credit card fraud detection.

---

# 📄 License

This project is intended for **educational, demonstration, and hackathon purposes**.
