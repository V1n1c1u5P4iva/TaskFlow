import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Test models
models_to_test = [
    'gemini-1.5-pro',
    'gemini-1.5-flash', 
    'gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
]

for model_name in models_to_test:
    try:
        print(f"\nTesting: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say 'OK' in one word")
        print(f"  ✓ SUCCESS: {response.text.strip()}")
        break  # If one works, use it
    except Exception as e:
        print(f"  ✗ FAILED: {str(e)[:100]}")
