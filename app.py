from flask import Flask, render_template, request, jsonify
import requests
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Get API key from environment
API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan_file():
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Step 1: Upload file to VirusTotal
        files = {'file': (file.filename, file.read())}
        headers = {'x-apikey': API_KEY}
        
        upload_response = requests.post(
            'https://www.virustotal.com/api/v3/files',
            files=files,
            headers=headers
        )
        
        if upload_response.status_code != 200:
            return jsonify({'error': 'Failed to upload file to VirusTotal'}), 500
        
        # Get analysis ID
        analysis_id = upload_response.json()['data']['id']
        
        # Step 2: Wait and get results
        # Wait a bit for analysis to complete
        time.sleep(2)
        
        analysis_response = requests.get(
            f'https://www.virustotal.com/api/v3/analyses/{analysis_id}',
            headers=headers
        )
        
        if analysis_response.status_code != 200:
            return jsonify({'error': 'Failed to get analysis results'}), 500
        
        # Parse results
        data = analysis_response.json()
        stats = data.get('data', {}).get('attributes', {}).get('stats', {})
        
        malicious = stats.get('malicious', 0)
        suspicious = stats.get('suspicious', 0)
        
        # Return simple response
        if malicious == 0 and suspicious == 0:
            return jsonify({
                'clean': True,
                'threats': 0,
                'suspicious': 0
            })
        else:
            return jsonify({
                'clean': False,
                'threats': malicious,
                'suspicious': suspicious
            })
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Scanning failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)