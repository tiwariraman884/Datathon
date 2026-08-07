from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
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

@app.post("/predict")
def predict(transaction: Transaction):

    transaction_data = transaction.model_dump()

    print("\n========== INCOMING TRANSACTION ==========")
    print(transaction_data)
    print("==========================================\n")

    # Create DataFrame
    input_data = pd.DataFrame(
        [transaction_data],
        columns=FEATURES
    )

    # Fraud probability
    probability = model.predict_proba(input_data)[0][1]

    # Prediction using our selected threshold
    prediction = int(probability >= THRESHOLD)

    # Risk level
    if probability >= 0.70:
        risk_level = "HIGH"
    elif probability >= 0.35:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "fraud_probability": round(float(probability), 4),
        "prediction": "FRAUD" if prediction == 1 else "LEGITIMATE",
        "risk_level": risk_level,
        "threshold": THRESHOLD
    }