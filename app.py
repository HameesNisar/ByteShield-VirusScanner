from flask import Flask, render_template, request, jsonify
import requests
import os
import time
import hashlib
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configuration
API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
MAX_FILE_SIZE = 32 * 1024 * 1024  # 32MB
UPLOAD_TIMEOUT = 30  # seconds

# Allowed file extensions (security measure)
ALLOWED_EXTENSIONS = {
    'exe', 'dll', 'sys', 'bin', 'com', 'scr', 'bat', 'cmd', 'ps1',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'zip', 'rar', '7z', 'tar', 'gz',
    'jpg', 'jpeg', 'png', 'gif', 'bmp',
    'txt', 'rtf', 'csv',
    'apk', 'ipa', 'deb', 'rpm'
}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_hash(file_data):
    """Calculate SHA256 hash of file"""
    return hashlib.sha256(file_data).hexdigest()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan_file():
    # Validate API key
    if not API_KEY:
        return jsonify({'error': 'VirusTotal API key not configured'}), 500
    
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Validate file
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not supported for scanning'}), 400

    try:
        # Read file data
        file_data = file.read()
        
        # Check file size
        if len(file_data) > MAX_FILE_SIZE:
            return jsonify({'error': f'File size exceeds {MAX_FILE_SIZE // 1024 // 1024}MB limit'}), 400
        
        if len(file_data) == 0:
            return jsonify({'error': 'File is empty'}), 400

        # Get file hash for potential duplicate check
        file_hash = get_file_hash(file_data)
        secure_name = secure_filename(file.filename)
        
        print(f"Scanning file: {secure_name} (SHA256: {file_hash[:12]}...)")

        # Step 1: Try to get existing analysis first (faster)
        headers = {'x-apikey': API_KEY}
        
        hash_check_response = requests.get(
            f'https://www.virustotal.com/api/v3/files/{file_hash}',
            headers=headers,
            timeout=10
        )
        
        if hash_check_response.status_code == 200:
            # File already analyzed, return cached results
            print("Using cached analysis results")
            data = hash_check_response.json()
            stats = data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {})
            
            malicious = stats.get('malicious', 0)
            suspicious = stats.get('suspicious', 0)
            
            return jsonify({
                'clean': malicious == 0 and suspicious == 0,
                'threats': malicious,
                'suspicious': suspicious,
                'cached': True
            })

        # Step 2: Upload file for new analysis
        print("Uploading file for new analysis...")
        files = {'file': (secure_name, file_data)}
        
        upload_response = requests.post(
            'https://www.virustotal.com/api/v3/files',
            files=files,
            headers=headers,
            timeout=UPLOAD_TIMEOUT
        )
        
        if upload_response.status_code != 200:
            error_msg = 'Failed to upload file to VirusTotal'
            if upload_response.status_code == 429:
                error_msg = 'Rate limit exceeded. Please wait before scanning again.'
            elif upload_response.status_code == 413:
                error_msg = 'File too large for VirusTotal analysis'
            
            return jsonify({'error': error_msg}), 500
        
        # Get analysis ID
        upload_data = upload_response.json()
        analysis_id = upload_data['data']['id']
        
        print(f"Analysis ID: {analysis_id}")

        # Step 3: Poll for results with exponential backoff
        max_attempts = 12  # ~2 minutes total wait time
        wait_time = 2
        
        for attempt in range(max_attempts):
            print(f"Checking analysis results... (attempt {attempt + 1}/{max_attempts})")
            
            analysis_response = requests.get(
                f'https://www.virustotal.com/api/v3/analyses/{analysis_id}',
                headers=headers,
                timeout=10
            )
            
            if analysis_response.status_code != 200:
                if attempt == max_attempts - 1:
                    return jsonify({'error': 'Failed to get analysis results'}), 500
                time.sleep(wait_time)
                wait_time = min(wait_time * 1.5, 15)  # Cap at 15 seconds
                continue
            
            # Parse results
            data = analysis_response.json()
            attributes = data.get('data', {}).get('attributes', {})
            status = attributes.get('status', '')
            
            if status == 'completed':
                stats = attributes.get('stats', {})
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                
                print(f"Analysis complete: {malicious} malicious, {suspicious} suspicious")
                
                return jsonify({
                    'clean': malicious == 0 and suspicious == 0,
                    'threats': malicious,
                    'suspicious': suspicious,
                    'cached': False
                })
            
            elif status == 'queued':
                print("Analysis queued, waiting...")
                time.sleep(wait_time)
                wait_time = min(wait_time * 1.2, 10)  # Gradual increase
            
            else:
                print(f"Analysis status: {status}")
                time.sleep(wait_time)
                wait_time = min(wait_time * 1.2, 10)
        
        # If we get here, analysis timed out
        return jsonify({
            'error': 'Analysis timeout. The file is being processed by VirusTotal. Please try again in a few minutes.'
        }), 202

    except requests.exceptions.Timeout:
        print("Request timeout occurred")
        return jsonify({'error': 'Request timeout. Please try again.'}), 500
    
    except requests.exceptions.ConnectionError:
        print("Connection error occurred")
        return jsonify({'error': 'Connection error. Please check your internet connection.'}), 500
    
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        return jsonify({'error': 'Network error occurred. Please try again.'}), 500
    
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large'}), 413

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check if API key is set
    if not API_KEY:
        print("⚠️  WARNING: VIRUSTOTAL_API_KEY not found in environment variables!")
        print("   Please create a .env file with your VirusTotal API key")
        print("   Example: VIRUSTOTAL_API_KEY=your_api_key_here")
    else:
        print("✅ VirusTotal API key configured")
    
    print("🛡️  ByteShield starting...")
    app.run(debug=True, host='0.0.0.0', port=5000)