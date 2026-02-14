import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("GEMINI_API_KEY not found!")
    exit(1)

print(f"API Key found: {GEMINI_API_KEY[:10]}...")
genai.configure(api_key=GEMINI_API_KEY)

print("\n=== Listing all available models ===")
for m in genai.list_models():
    print(f"\nModel: {m.name}")
    print(f"  Supported methods: {m.supported_generation_methods}")

print("\n\n=== Testing gemini-1.5-pro ===")
try:
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content("Say hello in Portuguese")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR with gemini-1.5-pro: {e}")

print("\n\n=== Testing gemini-1.5-flash ===")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello in Portuguese")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR with gemini-1.5-flash: {e}")

print("\n\n=== Testing gemini-pro ===")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello in Portuguese")
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"ERROR with gemini-pro: {e}")
