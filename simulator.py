# simulator.py
import pandas as pd
import numpy as np
import time
from itertools import cycle

# Load full dataset (LFS tracked)
df = pd.read_csv('data/creditcard.csv')

# Shuffle once and cycle indefinitely
_tx_iter = cycle(df.sample(frac=1, random_state=42).itertuples(index=False))

def get_next_transaction():
    " Return a single transaction as a dict.
    row = next(_tx_iter)
    cols = df.columns
    return {col: getattr(row, i) for i, col in enumerate(cols)}

def stream_transactions(rate=1.0):
    Yield transactions at ate tx/sec.
 while True:
 yield get_next_transaction()
 time.sleep(1.0 / rate)
