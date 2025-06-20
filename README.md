# 🛡️ ByteShield – File Scanner with VirusTotal API

ByteShield is a visually enhanced web application that allows users to scan files for malware using the VirusTotal API. It features animated cybersecurity-inspired effects and a simple drag-and-drop interface.

![Screenshot](https://github.com/user-attachments/assets/4045720c-d34a-4f67-bd0c-4bf1417b5aa5)

## 🔮 Features

- 🎨 **Glitch Background Animation** - Canvas-based cyberpunk matrix effect
- 💥 **Split Text Heading Animation** - Stylish animated text displays
- 📁 **Drag & Drop File Upload** - Intuitive file selection interface
- 🔍 **VirusTotal Integration** - Multi-engine malware scanning
- ⚠️ **Threat Detection Display** - Clear visual results for clean or infected files
- ⏱️ **Timeout Handling** - Robust error feedback and validation
- 🧠 **Smooth UX** - Polished user experience with validation

## 🚀 Live Demo

[👉 Try it live](https://your-deployed-url-here.com)

## 🛠️ How to Use

1. **Upload a file** by dragging it into the designated area or clicking to select
2. **Click "Scan File"** to analyze it using VirusTotal's API
3. **View results** - Clean or threat status displayed visually

## 📁 Supported File Types

**Common formats supported:**
- **Executables:** `.exe`, `.msi`, `.deb`, `.rpm`
- **Documents:** `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`
- **Archives:** `.zip`, `.rar`, `.7z`, `.tar`
- **Media:** `.jpg`, `.png`, `.gif`, `.mp4`, `.avi`
- **Text:** `.txt`, `.csv`, `.json`, `.xml`

**Maximum file size:** 32MB

## 🏗️ Project Structure

```
byte-shield/
├── static/
│   ├── styles.css  
│   └── script.js        
├── templates/
│   └── index.html
├── app.py
├── .env
├── requirements.txt
└── README.md
```

## 🧪 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Python Flask
- **API:** VirusTotal Public API
- **Graphics:** Canvas API for animations
- **Effects:** Custom CSS animations and JavaScript

## 🔧 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/HameesNisar/ByteShield.git
cd ByteShield
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
Create a `.env` file and add your VirusTotal API key:
```
VIRUSTOTAL_API_KEY=your_api_key_here
```

4. **Run the application:**
```bash
python app.py
```

5. **Open your browser:**
Navigate to `http://localhost:5000`

## 🔒 Security Features

- **Client-side validation** - File type and size checking before upload
- **No server storage** - Files are not saved to the server
- **Multi-engine scanning** - VirusTotal uses 70+ antivirus engines
- **Secure API integration** - Encrypted communication with VirusTotal

## 🎨 Visual Effects

- **Matrix Glitch Background** - Dynamic canvas-based animation
- **Split Text Animation** - Eye-catching heading effects
- **Loading Animations** - Smooth scan progress indicators
- **Cyberpunk Aesthetic** - Dark theme with neon accents

## 📋 Requirements

```txt
Flask==2.3.3
python-dotenv==1.0.0
requests==2.31.0
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hamees Nisar**
- Cybersecurity Student & Enthusiast
- Future Security Architect
- GitHub: [@HameesNisar](https://github.com/HameesNisar)

## 🙏 Acknowledgments

- 🔬 Malware detection powered by [VirusTotal](https://www.virustotal.com/)
- 🎨 Visual effects handcrafted with pure JavaScript
- 🧠 Inspired by matrix glitch vibes and hacker aesthetics

---

<div align="center">

**© 2025 ByteShield**

*Made with logic, caffeine, and chaos. Stay secure.* 🛡️💻

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-red.svg)](https://flask.palletsprojects.com/)

</div>
