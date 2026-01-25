
import requests
import sys

BASE_URL = "http://localhost:3000"

# List of routes to check (replacing dynamic segments with valid test values)
ROUTES = [
    "/",
    "/previsions",
    "/vigilance",
    "/meteo-marine",
    "/carte",
    "/contact",
    "/login",
    "/register",
    "/cartes/temperature",
    "/cartes/vent",
    "/cartes/pluie",
    "/cartes/uv",
    "/cartes/plages",
    "/previsions/0",  # Test 'today'
    "/previsions/1",  # Test 'tomorrow'
    "/alertes",
    "/alertes/checkout", # Might redirect
    "/mentions-legales",
    "/confidentialite",
    "/conditions-generales",
    "/admin", # Might be 403 or redirect
    "/dashboard" # Might redirect
]

def check_page(route):
    url = f"{BASE_URL}{route}"
    try:
        response = requests.get(url, timeout=5)
        status = response.status_code
        content = response.text

        # Basic error detection in HTML (Next.js error overlay text)
        error_indicators = [
            "Runtime Error",
            "Unhandled Runtime Error",
            "Something went wrong",
            "Application error: a client-side exception has occurred"
        ]

        found_errors = [err for err in error_indicators if err in content]
        
        # Check for 500 status specifically
        if status == 500:
            print(f"❌ [500 ERROR] {route}")
            return False
            
        if found_errors:
            print(f"❌ [JS/HTML ERROR] {route} - Found: {found_errors}")
            return False

        if status == 404:
            print(f"⚠️ [404 NOT FOUND] {route}")
            return False

        print(f"✅ [{status}] {route}")
        return True

    except Exception as e:
        print(f"❌ [CONNECTION ERROR] {route}: {str(e)}")
        return False

print(f"Checking pages on {BASE_URL}...")
success_count = 0
for route in ROUTES:
    if check_page(route):
        success_count += 1

print(f"\nChecked {len(ROUTES)} pages. {success_count} passed.")
