# IBM Z Fraud Detection

This project implements a real-time credit card fraud detection system, simulating streaming transaction data and evaluating it through a FastAPI backend.

## 🚀 Features
- **FastAPI Backend**: Serves predictions and risk assessments on incoming transactions.
- **Transaction Simulator**: Streams historical credit card transactions to the backend for real-time inference and computes summary statistics.
- **Data Exploration**: Jupyter notebooks for exploratory data analysis (EDA).
- **Git LFS**: Seamlessly handles large datasets (e.g., `creditcard.csv`) without bloating the repository.

## 📁 Project Structure

- `backend/app.py` – FastAPI server serving the ML model.
- `backend/simulator.py` – Script to simulate real-time transactions and log detection statistics.
- `data/` – Contains the raw dataset files (tracked via Git LFS).
- `notebooks/` – Jupyter notebooks for data analysis and visualization.
- `models/` – Saved machine learning models.
- `frontend/` – Client-side UI placeholder.

## ⚙️ Setup & Installation

### 1. Clone the repository and fetch LFS files
Ensure you have [Git LFS](https://git-lfs.github.com/) installed, then run:
```bash
git clone https://github.com/tiwariraman884/Datathon.git
cd Datathon
git lfs pull
```

### 2. Install dependencies
It is recommended to use a virtual environment:
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate
pip install pandas numpy scikit-learn matplotlib requests fastapi uvicorn
```

## 🏃‍♂️ Running the Application

### Start the Backend Server
Run the FastAPI application using uvicorn:
```bash
python -m uvicorn backend.app:app --reload
```
The API will be available at `http://127.0.0.1:8000/`.

### Run the Real-Time Simulator
In a separate terminal window, run the simulator script to stream transactions to the backend:
```bash
python backend/simulator.py
```
This will output real-time predictions, fraud probability, risk levels, and summarize the overall detection statistics when finished.
