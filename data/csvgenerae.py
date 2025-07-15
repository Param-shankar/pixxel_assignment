import pandas as pd
from datetime import timedelta
import random
import os 
from datetime import datetime

def generate_example_csv(filename="example_next_166_days.csv"):
    # Start from today
    start_date = datetime.now().date()
    rows = []
    for day_offset in range(7):
        current_date = start_date + timedelta(days=day_offset)
        for hour in range(24):
            # Generate a timestamp for each hour
            timestamp = datetime.combine(current_date, datetime.min.time()) + timedelta(hours=hour)
            # Generate random quaternion values
            q0 = round(random.uniform(-1, 1), 6)
            q1 = round(random.uniform(-1, 1), 6)
            q2 = round(random.uniform(-1, 1), 6)
            q3 = round(random.uniform(-1, 1), 6)
            # Optionally, add a predicted value (random True/False)
            predicted = random.choice([True, False])
            rows.append({
                "Q0": q0,
                "Q1": q1,
                "Q2": q2,
                "Q3": q3,
                "Timestamp": timestamp.isoformat(),
            })
    df = pd.DataFrame(rows)
    # path= os.path.join("")

    csvfile =df.to_csv(filename, index=False)
    print(f"Example CSV generated: {filename}")

# Example usage:
generate_example_csv()
