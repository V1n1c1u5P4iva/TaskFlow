import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

print("Models that support generateContent:\n")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"  ✓ {m.name}")

# Test the first available one
print("\n\nTesting gemini-flash-latest...")
try:
    model = genai.GenerativeModel('gemini-flash-latest')
    response = model.generate_content("Say 'Hello' in Portuguese")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
