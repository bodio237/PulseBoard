from fastapi import APIRouter
from database import get_metrics_df
import pandas as pd

router = APIRouter()

@router.get("/summary")
def get_summary():
    df = get_metrics_df()
    if df.empty:
        return []

    summary = []
    for name, group in df.groupby("name"):
        values = group["value"].astype(float)
        summary.append({
            "metric": name,
            "avg": round(float(values.mean()), 2),
            "min": round(float(values.min()), 2),
            "max": round(float(values.max()), 2),
            "count": int(len(values)),
            "trend": get_trend(values.tolist())
        })
    return summary

@router.get("/trend/{metric_name}")
def get_metric_trend(metric_name: str):
    df = get_metrics_df(metric_name)
    if df.empty:
        return []

    return [
        {
            "recorded_at": str(row["recorded_at"]),
            "value": float(row["value"])
        }
        for _, row in df.iterrows()
    ]

def get_trend(values: list) -> str:
    if len(values) < 2:
        return "stable"

    diff = values[-1] - values[0]

    if diff > 0:
        return "up"
    elif diff < 0:
        return "down"

    return "stable"