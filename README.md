<h1 align="center">🛡️ ByteShield - Virus Scanner Web App</h1>

<p align="center">
  <em>A lightweight web-based antivirus scanner using Flask and VirusTotal API.</em>
</p>

<hr>

<h2>🚀 About the Project</h2>
<p><strong>ByteShield</strong> is a simple, secure web application that allows users to scan uploaded files for viruses or malware using the VirusTotal public API. Built using <strong>Python</strong>, <strong>Flask</strong>, and <strong>HTML/CSS</strong>, it's perfect for cybersecurity projects or demos.</p>

<h2>🛠️ Features</h2>
<ul>
  <li>📁 Upload and scan files via VirusTotal</li>
  <li>🧪 Real-time detection of malicious/suspicious files</li>
  <li>🔐 API key stored securely in <code>.env</code></li>
  <li>🌐 Beginner-friendly codebase using Flask</li>
</ul>

<h2>📂 Project Structure</h2>
<pre>
ByteShield-VirusScanner/
├── app.py
├── templates/
│   └── index.html
├── static/
│   └── (Optional CSS)
├── requirements.txt
├── .gitignore
└── README.md
</pre>

<h2>🔐 API Key Setup</h2>
<ol>
  <li>Get a free API key from <a href="https://www.virustotal.com/">VirusTotal</a></li>
  <li>Create a file called <code>.env</code> in the root folder</li>
  <li>Inside it, add:<br><code>VIRUSTOTAL_API_KEY=your_virustotal_api_key_here</code></li>
</ol>

<h2>💻 How to Run</h2>
<pre><code>pip install -r requirements.txt
python app.py
</code></pre>

<h2>📜 License</h2>
<p>Free to use. Educational purposes only.</p>

<h2>🙌 Credits</h2>

Developed by **Hamees Nisar**.  
ByteShield was crafted as a lightweight Flask-based virus scanning app using the VirusTotal API — to demonstrate security awareness and ethical file analysis.


