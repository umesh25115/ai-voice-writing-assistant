import os
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
load_dotenv("venv/.env")
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


model = genai.GenerativeModel("gemini-2.0-flash")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running Successfully 🚀"}

@app.get("/hello")
def hello():
    return {"message": "Hello from FastAPI 🚀"}

@app.get("/test-gemini")
def test_gemini():
    try:

        response = model.generate_content("Say hello in one sentence.")
        return {"result": response.text}

    except Exception as e:
        return {"error": str(e)}
    
    
class TextRequest(BaseModel):
    text: str
    mode: str


@app.post("/process")
def process_text(data: TextRequest):

    if data.mode == "summarize":
        result = f"Summary: {data.text[:30]}..."

    elif data.mode == "grammar":
        result = f"Grammar Fixed: {data.text}"

    elif data.mode == "formal":
        result = f"Formal Version: {data.text}"

    elif data.mode == "expand":
        result = f"Expanded Version: {data.text} ... with additional details."

    else:
        result = "Invalid Mode"

    return {"result": result}



