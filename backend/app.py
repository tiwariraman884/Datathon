from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "fraud_model.pkl"


# --------------------------------------------------
# Load model
# --------------------------------------------------

model_package = joblib.load(MODEL_PATH)

model = model_package["model"]
FEATURES = model_package["features"]
THRESHOLD = model_package["threshold"]


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="IBM Z Fraud Detection API",
    description="Real-time credit card fraud detection API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Live monitoring statistics
# --------------------------------------------------

stats = {
    "total_transactions": 0,
    "fraud_detected": 0,
    "legitimate_transactions": 0,
    "high_risk": 0,
    "medium_risk": 0,
    "low_risk": 0
}

# --------------------------------------------------
# Transaction history
# --------------------------------------------------

transaction_history = []
transaction_counter = 0


# --------------------------------------------------
# Request schema
# --------------------------------------------------

class Transaction(BaseModel):
    Time: float

    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float

    Amount: float


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "IBM Z Fraud Detection API is running",
        "status": "healthy"
    }


# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

@app.post("/predict")
def predict(transaction: Transaction):
    global transaction_counter

    transaction_data = transaction.model_dump()

    print("\n========== INCOMING TRANSACTION ==========")
    print(transaction_data)
    print("==========================================\n")

    # Create DataFrame in exactly the same feature order
    input_data = pd.DataFrame(
        [transaction_data],
        columns=FEATURES
    )

    # Get fraud probability
    probability = model.predict_proba(input_data)[0][1]

    # Apply detection threshold
    prediction = int(probability >= THRESHOLD)

    # Determine risk level
    if probability >= 0.70:
        risk_level = "HIGH"
    elif probability >= 0.35:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # --------------------------------------------------
    # Update transaction counter
    # --------------------------------------------------

    transaction_counter += 1

    # --------------------------------------------------
    # Create transaction record
    # --------------------------------------------------

    transaction_record = {
        "transaction_id": transaction_counter,
        "amount": float(transaction.Amount),
        "fraud_probability": round(float(probability), 4),
        "prediction": (
            "FRAUD"
            if prediction == 1
            else "LEGITIMATE"
        ),
        "risk_level": risk_level
    }

    # Add to history
    transaction_history.append(transaction_record)

    # Keep latest 100 transactions only
    if len(transaction_history) > 100:
        transaction_history.pop(0)

    # --------------------------------------------------
    # Update monitoring statistics
    # --------------------------------------------------

    stats["total_transactions"] += 1

    if prediction == 1:
        stats["fraud_detected"] += 1
    else:
        stats["legitimate_transactions"] += 1

    if risk_level == "HIGH":
        stats["high_risk"] += 1
    elif risk_level == "MEDIUM":
        stats["medium_risk"] += 1
    else:
        stats["low_risk"] += 1

    # --------------------------------------------------
    # Return prediction
    # --------------------------------------------------

    return {
        "fraud_probability": round(float(probability), 4),
        "prediction": (
            "FRAUD"
            if prediction == 1
            else "LEGITIMATE"
        ),
        "risk_level": risk_level,
        "threshold": float(THRESHOLD)
    }

    # --------------------------------------------------
    # Update monitoring statistics
    # --------------------------------------------------

    stats["total_transactions"] += 1

    if prediction == 1:
        stats["fraud_detected"] += 1
    else:
        stats["legitimate_transactions"] += 1

    if risk_level == "HIGH":
        stats["high_risk"] += 1
    elif risk_level == "MEDIUM":
        stats["medium_risk"] += 1
    else:
        stats["low_risk"] += 1

    return {
        "fraud_probability": round(float(probability), 4),
        "prediction": "FRAUD" if prediction == 1 else "LEGITIMATE",
        "risk_level": risk_level,
        "threshold": THRESHOLD
    }

        # --------------------------------------------------
        # Sample transaction endpoint
        # --------------------------------------------------

@app.get("/sample-transaction")
def sample_transaction():
    import random

    df = pd.read_csv(
        BASE_DIR / "data" / "creditcard.csv"
    )

    row = df.iloc[random.randrange(len(df))]

    transaction = {
        "Time": float(row["Time"]),
        "Amount": float(row["Amount"])
    }

    for i in range(1, 29):
        transaction[f"V{i}"] = float(row[f"V{i}"])

    return transaction


@app.get("/sample-fraud-transaction")
def sample_fraud_transaction():
    """Return a real fraudulent transaction from the dataset."""

    import random

    dataset_path = BASE_DIR / "data" / "creditcard.csv"

    df = pd.read_csv(dataset_path)

    fraud_rows = df[df["Class"] == 1]

    if fraud_rows.empty:
        return {"error": "No fraudulent transactions found"}

    row = fraud_rows.sample(n=1).iloc[0]

    transaction = {}

    for feature in FEATURES:
        transaction[feature] = float(row[feature])

    return transaction



# --------------------------------------------------
# Statistics endpoint
# --------------------------------------------------

@app.get("/stats")
def get_stats():

    total = stats["total_transactions"]

    fraud_rate = (
        (stats["fraud_detected"] / total) * 100
        if total > 0
        else 0
    )

    return {
        "total_transactions": total,
        "fraud_detected": stats["fraud_detected"],
        "legitimate_transactions": stats["legitimate_transactions"],
        "high_risk": stats["high_risk"],
        "medium_risk": stats["medium_risk"],
        "low_risk": stats["low_risk"],
        "fraud_rate": round(fraud_rate, 2)
    }

# --------------------------------------------------
# History endpoint
# --------------------------------------------------

@app.get("/history")
def get_history():
    return {
        "transactions": transaction_history
    }

    # --------------------------------------------------
    # Recent transaction history
    # --------------------------------------------------

@app.get("/transactions")
def get_transactions():

    return {
        "count": len(transaction_history),
        "transactions": transaction_history[::-1]
    }

    # --------------------------------------------------
    # Dashboard endpoint
    # --------------------------------------------------

@app.get("/dashboard")
def dashboard():

    total = stats["total_transactions"]

    fraud_rate = (
        (stats["fraud_detected"] / total) * 100
        if total > 0
        else 0
    )

    return {
        "overview": {
            "total_transactions": total,
            "fraud_detected": stats["fraud_detected"],
            "legitimate_transactions": stats["legitimate_transactions"],
            "fraud_rate": round(fraud_rate, 2)
        },

        "risk_distribution": {
            "high": stats["high_risk"],
            "medium": stats["medium_risk"],
            "low": stats["low_risk"]
        },

        "recent_transactions": transaction_history[-10:][::-1]
    }