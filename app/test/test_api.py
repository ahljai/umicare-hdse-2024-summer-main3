import requests

def test_clinic_info():
    url = 'http://localhost:3000/api/clinic-info'  # Replace with your actual URL if different
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        data = response.json()  # Parse JSON response
        print('Status Code:', response.status_code)
        print('Response Data:', data)
        
        # Check for expected fields in the response
        if all(key in data for key in ['clinicName', 'address', 'phone', 'email', 'operatingHours']):
            print("API response contains all expected fields.")
        else:
            print("API response is missing some expected fields.")
    
    except requests.exceptions.RequestException as e:
        print('Request failed:', e)

if __name__ == "__main__":
    test_clinic_info()
