import psycopg2
import pandas as pd
import os

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def get_metrics_df(metric_name: str = None):
    try:
        conn = get_connection()

        if metric_name:
            query = """
                SELECT name, value, recorded_at
                FROM metrics
                WHERE name = %s
                ORDER BY recorded_at ASC
            """
            df = pd.read_sql(query, conn, params=(metric_name,))
        else:
            query = """
                SELECT name, value, recorded_at
                FROM metrics
                ORDER BY recorded_at ASC
            """
            df = pd.read_sql(query, conn)

        conn.close()
        return df

    except Exception as e:
        print(f"Database error: {e}")
        return pd.DataFrame()