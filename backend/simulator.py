import time
import requests
import pandas as pd


# Configuration
API_URL = "http://127.0.0.1:8000/predict"
DATA_PATH = "data/creditcard_tmp.csv"

# How many transactions to simulate
NUM_TRANSACTIONS = 20

# Delay between transactions
DELAY_SECONDS = 1


def main():
    print("Loading transaction dataset...")

    df = pd.read_csv(DATA_PATH)

    print(f"Dataset loaded: {len(df)} transactions")
    print("-" * 60)

    total_transactions = 0
    fraud_detected = 0
    legitimate_detected = 0
    high_risk_transactions = 0
    total_probability = 0.0

    # Take a sample of transactions
    transactions = df.sample(
        n=NUM_TRANSACTIONS,
        random_state=42
    )

    for index, row in transactions.iterrows():

        # Remove the target column
        transaction = row.drop("Class").to_dict()

        try:
            response = requests.post(
                API_URL,
                json=transaction,
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()

                prediction = result["prediction"]
                probability = result["fraud_probability"]
                risk = result["risk_level"]

                total_transactions += 1
                total_probability += probability

                if prediction == "FRAUD":
                    fraud_detected += 1
                else:
                    legitimate_detected += 1

                if risk == "HIGH":
                    high_risk_transactions += 1
                print(
                    f"Transaction {index} | "
                    f"Amount: ${row['Amount']:.2f} | "
                    f"Actual: {int(row['Class'])} | "
                    f"Prediction: {prediction} | "
                    f"Fraud Probability: {probability * 100:.2f}% | "
                    f"Risk: {risk}"
                )

            else:
                print(
                    f"Transaction {index} | "
                    f"API Error: {response.status_code}"
                )

        except requests.exceptions.RequestException as error:
            print(
                f"Transaction {index} | "
                f"Connection error: {error}"
            )

        time.sleep(DELAY_SECONDS)

    # Final summary
    print("\n")
    print("=" * 60)
    print("REAL-TIME FRAUD DETECTION SUMMARY")
    print("=" * 60)

    print(f"Total transactions:       {total_transactions}")
    print(f"Fraud detected:           {fraud_detected}")
    print(f"Legitimate transactions:  {legitimate_detected}")
    print(f"High-risk transactions:   {high_risk_transactions}")

    if total_transactions > 0:
        fraud_rate = (fraud_detected / total_transactions) * 100
        avg_probability = total_probability / total_transactions

        print(f"Detected fraud rate:       {fraud_rate:.2f}%")
        print(f"Average fraud probability: {avg_probability * 100:.2f}%")

    print("=" * 60)


if __name__ == "__main__":
    main()