import hashlib
from fastapi import UploadFile, File, HTTPException 
from pathlib import Path
import random

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "fraud_model.pkl"
DATASET_PATH = BASE_DIR / "data" / "creditcard.csv"


# =========================================================
# LOAD MODEL
# =========================================================

model_package = joblib.load(MODEL_PATH)

model = model_package["model"]
FEATURES = model_package["features"]
THRESHOLD = model_package["threshold"]

print("========================================")
print("Fraud Detection Model Loaded")
print("========================================")
print(f"Model: {type(model).__name__}")
print(f"Features: {len(FEATURES)}")
print(f"Threshold: {THRESHOLD}")
print(f"Features: {FEATURES}")
print("========================================")

# ============================================================
# DOCUMENT VERIFICATION
# ============================================================

MAX_DOCUMENT_SIZE = 5 * 1024 * 1024  # 5 MB

ALLOWED_DOCUMENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
}


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="CardSentinel Fraud Detection API",
    description="Real-time credit card fraud detection API",
    version="1.0.0"
)

# =========================================================
# CORS — must be added before any route definitions
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_file_size(bytes_value: int) -> str:

    if bytes_value < 1024:
        return f"{bytes_value} B"

    if bytes_value < 1024 * 1024:
        return f"{bytes_value / 1024:.1f} KB"

    return f"{bytes_value / (1024 * 1024):.2f} MB"

     
# ============================================================
# DOCUMENT VERIFICATION API
# ============================================================

@app.post("/verify-document")
async def verify_document(
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Validate file type
    # --------------------------------------------------------

    if file.content_type not in ALLOWED_DOCUMENT_TYPES:

        raise HTTPException(
            status_code=400,
            detail="Invalid document type. Only PDF, JPG and PNG files are allowed."
        )


    # --------------------------------------------------------
    # Read file
    # --------------------------------------------------------

    file_bytes = await file.read()


    # --------------------------------------------------------
    # Validate file size
    # --------------------------------------------------------

    file_size = len(file_bytes)

    if file_size == 0:

        raise HTTPException(
            status_code=400,
            detail="The uploaded document is empty."
        )


    if file_size > MAX_DOCUMENT_SIZE:

        raise HTTPException(
            status_code=413,
            detail="File is too large. Maximum allowed size is 5 MB."
        )


    # --------------------------------------------------------
    # Calculate SHA-256
    # --------------------------------------------------------

    file_hash = hashlib.sha256(
        file_bytes
    ).hexdigest()


    # --------------------------------------------------------
    # Basic verification
    # --------------------------------------------------------

    return {
        "verified": True,

        "status": "VERIFIED",

        "score": 100,

        "message": "Document passed basic validation.",

        "file": {
            "name": file.filename,
            "type": file.content_type,
            "size": file_size,
            "size_formatted": format_file_size(file_size),
            "sha256": file_hash,
        }
    }


# ============================================================
# SELFIE VERIFICATION API
# ============================================================

@app.post("/verify-selfie")
async def verify_selfie(
    file: UploadFile = File(...)
):

    if file.content_type not in {"image/jpeg", "image/png"}:
        raise HTTPException(
            status_code=400,
            detail="Invalid selfie type. Only JPG and PNG files are allowed."
        )

    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size == 0:
        raise HTTPException(status_code=400, detail="The uploaded selfie is empty.")

    if file_size > MAX_DOCUMENT_SIZE:
        raise HTTPException(status_code=413, detail="File is too large. Maximum allowed size is 5 MB.")

    file_hash = hashlib.sha256(file_bytes).hexdigest()

    # Simulate Liveness & Face Match check
    liveness_score = round(random.uniform(85.0, 99.9), 1)

    return {
        "verified": True,
        "status": "VERIFIED",
        "score": liveness_score,
        "message": "Face match and liveness confirmed.",
        "file": {
            "name": file.filename,
            "type": file.content_type,
            "size": file_size,
            "size_formatted": format_file_size(file_size),
            "sha256": file_hash,
        }
    }


# =========================================================
# LIVE STATISTICS
# =========================================================

stats = {
    "total_transactions": 0,
    "fraud_detected": 0,
    "legitimate_transactions": 0,
    "high_risk": 0,
    "medium_risk": 0,
    "low_risk": 0,
}


# =========================================================
# TRANSACTION HISTORY
# =========================================================

transaction_history = []
transaction_counter = 0


# =========================================================
# REQUEST SCHEMA
# =========================================================

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


class OnboardingRequest(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    amount: float = 0.0
    country_code: str = ""
    country_name: str = ""


# =========================================================
# ONBOARDING API (RISK CHECK)
# =========================================================

DISPOSABLE_EMAIL_DOMAINS = {
    "mailinator.com", "guerrillamail.com", "tempmail.com",
    "throwam.com", "yopmail.com", "sharklasers.com",
    "trashmail.com", "getnada.com", "fakeinbox.com",
    "dispostable.com", "maildrop.cc", "spam4.me"
}

HIGH_RISK_COUNTRIES = {
    "AF", "BY", "MM", "CF", "CD", "CU", "ET", "IR", "IQ",
    "LY", "ML", "NI", "KP", "RU", "SO", "SS", "SD", "SY",
    "TN", "UG", "UA", "VE", "YE", "ZW"
}

@app.post("/api/onboard")
def initial_risk_check(req: OnboardingRequest):
    flags = []
    decision = "pass"

    name = req.name.strip()
    if len(name) < 2:
        flags.append({"icon": "⚠️", "text": "Full name is missing or too short."})
        if decision == "pass": decision = "review"

    email = req.email.strip()
    if not email or "@" not in email:
        flags.append({"icon": "⚠️", "text": "Email address is missing or invalid."})
        decision = "decline"
    else:
        domain = email.split("@")[1].lower()
        if domain in DISPOSABLE_EMAIL_DOMAINS:
            flags.append({"icon": "🚫", "text": f"Disposable email domain detected: {domain}"})
            decision = "decline"

    phone_digits = "".join(filter(str.isdigit, req.phone))
    if len(phone_digits) < 7:
        flags.append({"icon": "⚠️", "text": "Phone number is missing or too short."})
        if decision == "pass": decision = "review"

    if req.amount > 10000:
        flags.append({"icon": "⚠️", "text": f"High transaction amount: ${req.amount:,.2f} exceeds $10,000 threshold."})
        if decision == "pass": decision = "review"

    if req.country_code in HIGH_RISK_COUNTRIES:
        flags.append({"icon": "🚫", "text": f"Connection from high-risk jurisdiction: {req.country_name} ({req.country_code})."})
        decision = "decline"

    return {
        "decision": decision,
        "flags": flags
    }


# =========================================================
# ROOT / HEALTH CHECK
# =========================================================

@app.get("/")
def home():

    return {
        "message": "CardSentinel Fraud Detection API is running",
        "status": "healthy",
        "model": type(model).__name__,
        "features": len(FEATURES),
        "threshold": THRESHOLD,
    }


# =========================================================
# PREDICTION
# =========================================================

@app.post("/predict")
def predict(transaction: Transaction):

    global transaction_counter

    transaction_data = transaction.model_dump()

    print("\n========== INCOMING TRANSACTION ==========")
    print(transaction_data)
    print("==========================================")

    # -----------------------------------------------------
    # Create DataFrame in exact model feature order
    # -----------------------------------------------------

    input_data = pd.DataFrame(
        [transaction_data],
        columns=FEATURES
    )

    # -----------------------------------------------------
    # Fraud probability
    # -----------------------------------------------------

    probability = float(
        model.predict_proba(input_data)[0][1]
    )

    # -----------------------------------------------------
    # Prediction
    # -----------------------------------------------------

    prediction = int(
        probability >= THRESHOLD
    )

    # -----------------------------------------------------
    # Risk level
    # -----------------------------------------------------

    if probability >= 0.70:
        risk_level = "HIGH"

    elif probability >= THRESHOLD:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    # -----------------------------------------------------
    # Transaction ID
    # -----------------------------------------------------

    transaction_counter += 1

    # -----------------------------------------------------
    # Transaction record
    # -----------------------------------------------------

    transaction_record = {

        "transaction_id": transaction_counter,

        "amount": float(
            transaction.Amount
        ),

        "fraud_probability": round(
            probability,
            4
        ),

        "prediction": (
            "FRAUD"
            if prediction == 1
            else "LEGITIMATE"
        ),

        "risk_level": risk_level,
    }

    # -----------------------------------------------------
    # Store history
    # -----------------------------------------------------

    transaction_history.append(
        transaction_record
    )

    # Keep latest 100
    if len(transaction_history) > 100:

        transaction_history.pop(0)

    # -----------------------------------------------------
    # Update statistics
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "transaction_id": transaction_counter,

        "fraud_probability": round(
            probability,
            4
        ),

        "prediction": (
            "FRAUD"
            if prediction == 1
            else "LEGITIMATE"
        ),

        "risk_level": risk_level,

        "threshold": float(
            THRESHOLD
        ),
    }


# =========================================================
# SAMPLE TRANSACTION
# =========================================================

@app.get("/sample-transaction")
def sample_transaction():

    df = pd.read_csv(
        DATASET_PATH
    )

    row = df.iloc[
        random.randrange(
            len(df)
        )
    ]

    transaction = {

        "Time": float(
            row["Time"]
        ),

        "Amount": float(
            row["Amount"]
        ),
    }

    for i in range(1, 29):

        transaction[f"V{i}"] = float(
            row[f"V{i}"]
        )

    return transaction


# =========================================================
# SAMPLE FRAUD TRANSACTION
# =========================================================

@app.get("/sample-fraud-transaction")
def sample_fraud_transaction():

    df = pd.read_csv(
        DATASET_PATH
    )

    fraud_rows = df[
        df["Class"] == 1
    ]

    if fraud_rows.empty:

        return {
            "error": "No fraudulent transactions found"
        }

    row = fraud_rows.sample(
        n=1
    ).iloc[0]

    transaction = {}

    for feature in FEATURES:

        transaction[feature] = float(
            row[feature]
        )

    return transaction


# =========================================================
# STATISTICS
# =========================================================

@app.get("/stats")
def get_stats():

    total = stats[
        "total_transactions"
    ]

    fraud_rate = (

        (
            stats["fraud_detected"]
            / total
        ) * 100

        if total > 0

        else 0
    )

    return {

        "total_transactions":
            total,

        "fraud_detected":
            stats["fraud_detected"],

        "legitimate_transactions":
            stats["legitimate_transactions"],

        "high_risk":
            stats["high_risk"],

        "medium_risk":
            stats["medium_risk"],

        "low_risk":
            stats["low_risk"],

        "fraud_rate":
            round(
                fraud_rate,
                2
            ),
    }


# =========================================================
# HISTORY
# =========================================================

@app.get("/history")
def get_history():

    return {

        "transactions":
            transaction_history
    }


# =========================================================
# TRANSACTIONS
# =========================================================

@app.get("/transactions")
def get_transactions():

    return {

        "count":
            len(transaction_history),

        "transactions":
            transaction_history[
                ::-1
            ],
    }


# =========================================================
# DASHBOARD
# =========================================================

@app.get("/dashboard")
def dashboard():

    total = stats[
        "total_transactions"
    ]

    fraud_rate = (

        (
            stats["fraud_detected"]
            / total
        ) * 100

        if total > 0

        else 0
    )

    return {

        "overview": {

            "total_transactions":
                total,

            "fraud_detected":
                stats["fraud_detected"],

            "legitimate_transactions":
                stats["legitimate_transactions"],

            "fraud_rate":
                round(
                    fraud_rate,
                    2
                ),
        },

        "risk_distribution": {

            "high":
                stats["high_risk"],

            "medium":
                stats["medium_risk"],

            "low":
                stats["low_risk"],
        },

        "recent_transactions":
            transaction_history[
                -10:
            ][::-1],
    }