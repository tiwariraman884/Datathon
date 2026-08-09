# IBM Z Fraud Detection

An AI-powered credit card fraud detection system designed to analyze transaction data, identify potentially fraudulent transactions, and present the results through an interactive fraud detection dashboard.

The project combines a **Random Forest machine learning model**, **FastAPI backend**, transaction simulation, and a responsive web-based dashboard to demonstrate a real-time fraud detection workflow.

---

## 🚀 Key Features

### 🤖 Machine Learning Fraud Detection

* Random Forest classification model.
* Classifies transactions as:

  * **Fraud**
  * **Legitimate**
* Provides fraud detection results through the backend prediction API.
* Uses transaction features from the credit card fraud dataset.

### ⚡ FastAPI Backend

* REST API built with FastAPI.
* Provides the `/predict` endpoint for transaction prediction.
* Receives transaction features and returns the model prediction.
* Designed to support real-time transaction analysis.

### 📊 Interactive Fraud Detection Dashboard

The frontend provides a centralized dashboard for monitoring fraud detection activity.

It includes:

* Total transactions
* Fraud detected
* Risk overview
* Transaction monitoring
* Risk analysis
* Model information
* System status
* Fraud alerts
* Transaction analyzer

### 🔍 Transaction Analyzer

Users can enter transaction feature values and submit them to the fraud detection system.

The system processes the transaction through the Random Forest model and displays the resulting classification.

### 🔄 Transaction Simulator

The simulator can stream historical transaction records to the backend to simulate incoming transaction traffic.

It can be used to demonstrate:

* Transaction processing
* Fraud predictions
* Risk assessment
* Detection statistics

### 📈 Data Exploration

The project includes notebooks for exploring and analyzing the credit card transaction dataset.

These notebooks can be used for:

* Exploratory Data Analysis (EDA)
* Data visualization
* Understanding transaction patterns
* Studying fraudulent transaction distributions

---

# 🏗️ System Architecture

The overall workflow is:

```text
Credit Card Transaction
          │
          ▼
   Transaction Input
          │
          ▼
   FastAPI Backend
          │
       /predict
          │
          ▼
   Random Forest Model
          │
          ▼
 Fraud / Legitimate
          │
          ▼
   Dashboard / Result
```

For simulated real-time processing:

```text
Historical Dataset
        │
        ▼
Transaction Simulator
        │
        ▼
FastAPI /predict
        │
        ▼
Random Forest Model
        │
        ▼
Prediction + Risk Information
        │
        ▼
Detection Statistics
```

---

# 🛠️ Technology Stack

## Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Random Forest

## Backend

* FastAPI
* Uvicorn
* Python

## Frontend

* HTML
* CSS
* JavaScript
* Responsive dashboard UI

## Data & Analysis

* Credit card transaction dataset
* Jupyter Notebook
* Matplotlib
* Exploratory Data Analysis

## Development & Version Control

* Git
* GitHub
* Git LFS

---

# 📁 Project Structure

```text
IBM-Z-FRAUD-DETECTION
│
├── backend/
│   ├── app.py              # FastAPI application
│   └── simulator.py        # Transaction simulator (sends to /predict)
│
├── data/
│   ├── creditcard.csv      # Full dataset (Git LFS tracked)
│   └── creditcard_tmp.csv  # Temporary transaction sample
│
├── models/
│   └── fraud_model.pkl     # Trained Random Forest model
│
├── notebooks/
│   └── 01_exploration.ipynb
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── simulator.py            # Streaming transaction generator
├── README.md
└── ...
```

> The exact contents of `models/`, `notebooks/`, and other project directories may vary depending on the final repository version.

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

# 🔌 API

The FastAPI backend exposes a REST API with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — verifies the API is running |
| `POST` | `/predict` | Predicts fraud/legitimate for a transaction |
| `GET` | `/stats` | Returns live monitoring statistics |
| `GET` | `/history` | Returns the transaction history |
| `GET` | `/transactions` | Returns recent transactions (latest first) |
| `GET` | `/dashboard` | Returns compiled dashboard data |
| `GET` | `/sample-transaction` | Returns a random sample transaction |
| `GET` | `/sample-fraud-transaction` | Returns a real fraudulent transaction |

## Prediction Endpoint

### `POST /predict`

The `/predict` endpoint receives transaction information and returns the model's prediction.

### Purpose

The endpoint is responsible for:

1. Receiving transaction features.
2. Processing the input.
3. Passing the transaction to the Random Forest model.
4. Generating a fraud/legitimate prediction.
5. Returning the prediction to the client.

### Prediction Output

The primary classification produced by the model is:

```text
Fraud
```

or

```text
Legitimate
```

### Example Request

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

### Example Response

```json
{
  "fraud_probability": 0.87,
  "prediction": "FRAUD",
  "risk_level": "HIGH",
  "threshold": 0.35
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
pip install pandas numpy scikit-learn matplotlib requests fastapi uvicorn joblib
```

---

# ▶️ Running the Application

## Start the FastAPI Backend

From the project root:

```bash
python -m uvicorn backend.app:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

FastAPI's interactive API documentation can normally be accessed at:

```text
http://127.0.0.1:8000/docs
```

## Run the Transaction Simulator

Open another terminal and run:

```bash
python backend/simulator.py
```

The simulator sends transaction records to the backend and can display prediction and detection statistics.

The project also includes a streaming transaction generator (`simulator.py` at the project root) that cycles through the full dataset indefinitely:

```python
from simulator import stream_transactions

for tx in stream_transactions(rate=1.0):
    print(tx)
```

---

# 🖥️ Using the Dashboard

After starting the required backend services, open the frontend application.

The dashboard provides several sections for monitoring the fraud detection system.

### Dashboard

Provides a high-level overview of:

* Total transactions
* Fraudulent transactions
* Risk levels
* Detection activity
* Model information
* System status

### Transactions

Provides transaction-level information and prediction results.

### Risk Analysis

Provides a more detailed view of transaction risk and model-related information.

### System

Provides information about the fraud detection engine and system status.

### Transaction Analyzer

Allows a user to provide transaction feature values and request a fraud prediction.

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

The project demonstrates the use of machine learning, backend APIs, transaction processing, and data visualization to address the problem of credit card fraud detection.

---

# 📄 License

This project is intended for educational, demonstration, and hackathon purposes.
