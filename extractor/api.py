from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from extract_pdf import get_result

app = FastAPI(title="NEET-PG Result API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://deluxe-taiyaki-55355b.netlify.app",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

PDF_PATH = "NEET-PG.pdf"


@app.get("/")
def home():
    return {"message": "NEET-PG Result API is running"}


@app.get("/result/{roll_number}")
def result(roll_number: str):
    data = get_result(PDF_PATH, roll_number)

    if "error" in data:
        raise HTTPException(status_code=404, detail=data)

    return data
