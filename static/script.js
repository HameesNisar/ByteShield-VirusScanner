// ===== LETTER GLITCH BACKGROUND EFFECT =====
class LetterGlitch {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Cybersecurity themed colors
        this.glitchColors = options.glitchColors || [
            '#00ff88', '#00d4ff', '#5b21b6', '#dc2626', 
            '#ff6b35', '#8b5cf6', '#06d6a0', '#f72585'
        ];
        
        this.glitchSpeed = options.glitchSpeed || 50;
        this.smooth = options.smooth !== undefined ? options.smooth : true;
        
        this.fontSize = 12;
        this.charWidth = 8;
        this.charHeight = 16;
        
        this.letters = [];
        this.grid = { columns: 0, rows: 0 };
        this.lastGlitchTime = Date.now();
        this.animationId = null;
        
        this.lettersAndSymbols = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/',
            '[', ']', '{', '}', ';', ':', '<', '>', ',', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '|', '\\', '~', '`', '^', '%'
        ];
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.animate();
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                cancelAnimationFrame(this.animationId);
                this.resizeCanvas();
                this.animate();
            }, 100);
        });
    }
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        const columns = Math.ceil(rect.width / this.charWidth);
        const rows = Math.ceil(rect.height / this.charHeight);
        
        this.initializeLetters(columns, rows);
        this.drawLetters();
    }
    
    initializeLetters(columns, rows) {
        this.grid = { columns, rows };
        const totalLetters = columns * rows;
        
        this.letters = Array.from({ length: totalLetters }, () => ({
            char: this.getRandomChar(),
            color: this.getRandomColor(),
            targetColor: this.getRandomColor(),
            colorProgress: 1,
            alpha: Math.random() * 0.8 + 0.2
        }));
    }
    
    getRandomChar() {
        return this.lettersAndSymbols[Math.floor(Math.random() * this.lettersAndSymbols.length)];
    }
    
    getRandomColor() {
        return this.glitchColors[Math.floor(Math.random() * this.glitchColors.length)];
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    interpolateColor(start, end, factor) {
        if (typeof start === 'string') start = this.hexToRgb(start);
        if (typeof end === 'string') end = this.hexToRgb(end);
        
        if (!start || !end) return '#00ff88';
        
        const result = {
            r: Math.round(start.r + (end.r - start.r) * factor),
            g: Math.round(start.g + (end.g - start.g) * factor),
            b: Math.round(start.b + (end.b - start.b) * factor),
        };
        return `rgb(${result.r}, ${result.g}, ${result.b})`;
    }
    
    drawLetters() {
        if (!this.ctx || this.letters.length === 0) return;
        
        const { width, height } = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.textBaseline = 'top';
        
        this.letters.forEach((letter, index) => {
            const x = (index % this.grid.columns) * this.charWidth;
            const y = Math.floor(index / this.grid.columns) * this.charHeight;
            
            this.ctx.globalAlpha = letter.alpha;
            this.ctx.fillStyle = letter.color;
            this.ctx.fillText(letter.char, x, y);
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    updateLetters() {
        if (!this.letters || this.letters.length === 0) return;
        
        const updateCount = Math.max(1, Math.floor(this.letters.length * 0.03));
        
        for (let i = 0; i < updateCount; i++) {
            const index = Math.floor(Math.random() * this.letters.length);
            if (!this.letters[index]) continue;
            
            this.letters[index].char = this.getRandomChar();
            this.letters[index].targetColor = this.getRandomColor();
            this.letters[index].alpha = Math.random() * 0.8 + 0.2;
            
            if (!this.smooth) {
                this.letters[index].color = this.letters[index].targetColor;
                this.letters[index].colorProgress = 1;
            } else {
                this.letters[index].colorProgress = 0;
            }
        }
    }
    
    handleSmoothTransitions() {
        let needsRedraw = false;
        
        this.letters.forEach((letter) => {
            if (letter.colorProgress < 1) {
                letter.colorProgress += 0.05;
                if (letter.colorProgress > 1) letter.colorProgress = 1;
                
                letter.color = this.interpolateColor(
                    letter.color, 
                    letter.targetColor, 
                    letter.colorProgress
                );
                needsRedraw = true;
            }
        });
        
        if (needsRedraw) {
            this.drawLetters();
        }
    }
    
    animate() {
        const now = Date.now();
        
        if (now - this.lastGlitchTime >= this.glitchSpeed) {
            this.updateLetters();
            this.drawLetters();
            this.lastGlitchTime = now;
        }
        
        if (this.smooth) {
            this.handleSmoothTransitions();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ===== SPLIT TEXT EFFECT =====
class SplitTextEffect {
    constructor(selector) {
        this.element = document.querySelector(selector);
        if (!this.element) return;
        
        this.originalText = this.element.textContent;
        this.splitText();
        this.animateLetters();
    }
    
    splitText() {
        const text = this.originalText;
        this.element.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.animationDelay = `${0.1 * (i + 1)}s`;
            this.element.appendChild(span);
        }
    }
    
    animateLetters() {
        const letters = this.element.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.addEventListener('animationend', () => {
                if (index === letters.length - 1) {
                    // All letters have animated
                    this.onComplete?.();
                }
            });
        });
    }
    
    onComplete() {
        // Animation complete callback
        console.log('Split text animation complete!');
    }
}

// ===== MAIN APPLICATION LOGIC =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize visual effects
    const glitchEffect = new LetterGlitch('glitchCanvas', {
        glitchSpeed: 80,
        smooth: true,
        glitchColors: ['#00ff88', '#00d4ff', '#5b21b6', '#dc2626', '#ff6b35', '#8b5cf6']
    });
    
    const splitText = new SplitTextEffect('.split-text');
    
    // Get elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const scanBtn = document.getElementById('scanBtn');
    const result = document.getElementById('result');
    
    let selectedFile = null;

    // Enhanced file validation
    const allowedTypes = [
        'application/x-msdownload', 'application/x-msdos-program',
        'application/x-executable', 'application/octet-stream',
        'application/pdf', 'application/zip', 'application/x-zip-compressed',
        'text/plain', 'image/jpeg', 'image/png', 'image/gif',
        'application/vnd.ms-excel', 'application/msword'
    ];
    
    const maxFileSize = 32 * 1024 * 1024; // 32MB limit

    function validateFile(file) {
        if (file.size > maxFileSize) {
            return { valid: false, error: 'File size exceeds 32MB limit' };
        }
        return { valid: true };
    }

    function updateFileInfo(file) {
        const validation = validateFile(file);
        if (!validation.valid) {
            fileInfo.innerHTML = `<span style="color: #ff6b6b;">❌ ${validation.error}</span>`;
            scanBtn.disabled = true;
            return false;
        }
        
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileInfo.innerHTML = `
            <div style="color: #00ff88;">✅ Selected: <strong>${file.name}</strong></div>
            <div style="color: #00d4ff; font-size: 0.9em; margin-top: 5px;">
                Size: ${fileSize} MB | Type: ${file.type || 'Unknown'}
            </div>
        `;
        scanBtn.disabled = false;
        return true;
    }

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        selectedFile = e.target.files[0];
        if (selectedFile && updateFileInfo(selectedFile)) {
            // Add subtle animation to scan button
            scanBtn.style.animation = 'pulse 0.5s ease';
            setTimeout(() => scanBtn.style.animation = '', 500);
        }
    });

    // Enhanced drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        selectedFile = e.dataTransfer.files[0];
        if (selectedFile && updateFileInfo(selectedFile)) {
            // Add file drop animation
            uploadArea.style.transform = 'scale(0.98)';
            setTimeout(() => uploadArea.style.transform = '', 200);
        }
    });

    // Enhanced scan button click
    scanBtn.addEventListener('click', async function() {
        if (!selectedFile) return;

        // Enhanced loading state
        result.style.display = 'block';
        result.className = 'result loading';
        result.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <div style="width: 20px; height: 20px; border: 2px solid #00d4ff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>Analyzing file with VirusTotal...</span>
            </div>
        `;
        scanBtn.disabled = true;

        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Send to server with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch('/scan', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Enhanced result display
            if (data.clean) {
                result.className = 'result clean';
                result.innerHTML = `
                    <div style="font-size: 1.2em; margin-bottom: 10px;">✅ FILE IS CLEAN</div>
                    <div style="opacity: 0.9;">No threats detected by VirusTotal scan</div>
                    <div style="font-size: 0.9em; margin-top: 10px; color: #00d4ff;">
                        🛡️ ByteShield Analysis Complete
                    </div>
                `;
            } else {
                result.className = 'result threat';
                result.innerHTML = `
                    <div style="font-size: 1.2em; margin-bottom: 10px;">⚠️ THREATS DETECTED</div>
                    <div style="margin-bottom: 10px;">
                        <strong>${data.threats}</strong> malicious • <strong>${data.suspicious}</strong> suspicious
                    </div>
                    <div style="font-size: 0.9em; color: #ff6b6b;">
                        🚨 Recommend immediate quarantine
                    </div>
                `;
            }

        } catch (error) {
            console.error('Scan error:', error);
            result.className = 'result threat';
            
            if (error.name === 'AbortError') {
                result.innerHTML = `
                    <div style="font-size: 1.2em; margin-bottom: 10px;">⏱️ SCAN TIMEOUT</div>
                    <div>The scan took too long to complete. Please try again.</div>
                `;
            } else {
                result.innerHTML = `
                    <div style="font-size: 1.2em; margin-bottom: 10px;">❌ SCAN FAILED</div>
                    <div style="margin-bottom: 10px;">Unable to complete security analysis</div>
                    <div style="font-size: 0.9em; opacity: 0.8;">
                        Error: ${error.message || 'Unknown error occurred'}
                    </div>
                `;
            }
        }

        scanBtn.disabled = false;
    });

    // Click upload area to trigger file input
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // Add CSS animation for spinning loader
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
});