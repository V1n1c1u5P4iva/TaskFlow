import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("❌ GEMINI_API_KEY not found in .env file")
    exit(1)

print(f"✓ API Key found: {GEMINI_API_KEY[:15]}...")
print(f"✓ Library version: {genai.__version__}")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    print("✓ API configured successfully")
except Exception as e:
    print(f"❌ Error configuring API: {e}")
    exit(1)

print("\n" + "="*60)
print("LISTING AVAILABLE MODELS")
print("="*60)

try:
    models = list(genai.list_models())
    if not models:
        print("\n❌ NO MODELS AVAILABLE!")
        print("\nThis means your API key doesn't have access to any models.")
        print("Please check:")
        print("1. Is the 'Generative Language API' enabled in Google Cloud Console?")
        print("2. Is your API key valid and not restricted?")
        print("3. Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
    else:
        print(f"\n✓ Found {len(models)} models\n")
        for m in models:
            print(f"  • {m.name}")
            if hasattr(m, 'supported_generation_methods'):
                print(f"    Methods: {', '.join(m.supported_generation_methods)}")
except Exception as e:
    print(f"\n❌ Error listing models: {e}")
    print("\nThis usually means:")
    print("1. The API key is invalid")
    print("2. The 'Generative Language API' is not enabled")
    print("3. There are network/firewall issues")
