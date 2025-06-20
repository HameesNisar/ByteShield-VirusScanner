# 🛡️ ByteShield – File Scanner with VirusTotal API

ByteShield is a visually enhanced web application that allows users to scan files for malware using the VirusTotal API. It features animated cybersecurity-inspired effects and a simple drag-and-drop interface.

## 🔮 Features

- 🎨 **Glitch Background Animation** (Canvas-based cyberpunk matrix effect)
- 💥 **Split Text Heading Animation**
- 📁 **Drag & Drop File Upload**
- 🔍 **VirusTotal Integration** for malware scanning
- ⚠️ **Threat Detection Display** with clean or infected results
- ⏱️ **Timeout Handling** and error feedback
- 🧠 **Smooth UX and Validation**

## 🚀 Live Demo

[👉 Try it live](https://your-deployed-url-here.com)

## 🛠️ How to Use

1. Upload a file by dragging it into the area or clicking to select.
2. Click **Scan File** to analyze it using VirusTotal.
3. See clean/threat results visually displayed.

## 📁 Supported File Types

Includes common formats:
- `.exe`, `.pdf`, `.zip`, `.txt`, `.jpg`, `.png`, `.gif`, `.doc`, `.xls`, etc.

Max file size: **32MB**

## 📁 File Structure Overview

byte-shield/
├── static/
│   ├── css/
│   └── js/
├── templates/
│   └── index.html
├── app.py
├── .env
└── requirements.txt

## 🧪 Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Canvas API
- VirusTotal Public API
- Animations via custom JS and CSS

## 🔒 Security

- Only client-side file validation; no file is stored on the server.
- VirusTotal scan ensures multi-engine malware analysis.

## 🔒 Security Notes
- No files are saved to the server.
- All scans are securely done via VirusTotal API.
- Client-side validation handles size/type before upload.

## 🎨 Visual Effects

- **Letter Glitch Matrix** (`<canvas>`) background
- **Split Text Animation** for stylish headings
- **Animated scan button & loaders**

## 📸 Screenshots

*![Screenshot (2)](https://github.com/user-attachments/assets/4045720c-d34a-4f67-bd0c-4bf1417b5aa5)*

---

## 🙏 Credits
- ✨ Developed entirely by Hamees Nisar
- 🎨 Visual Effects handcrafted with pure JavaScript
- 🔬 Malware detection powered by VirusTotal
- 🧠 Inspired by matrix glitch vibes and hacker aesthetics


## 🧾 License
- This project is licensed under the MIT License.

## 💀 Author
- Hamees Nisar – Cybersecurity student, enthusiast, and future analyst
GitHub: **@HameesNisar**

© 2025 ByteShield. Made with logic, caffeine, and chaos. Stay secure. 🧠💥


