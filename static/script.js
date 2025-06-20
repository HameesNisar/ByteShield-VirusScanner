// Get elements
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const scanBtn = document.getElementById('scanBtn');
        const result = document.getElementById('result');
        
        let selectedFile = null;

        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            selectedFile = e.target.files[0];
            if (selectedFile) {
                fileInfo.textContent = `Selected: ${selectedFile.name}`;
                scanBtn.disabled = false;
            }
        });

        // Handle drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function() {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            selectedFile = e.dataTransfer.files[0];
            if (selectedFile) {
                fileInfo.textContent = `Selected: ${selectedFile.name}`;
                scanBtn.disabled = false;
            }
        });

        // Handle scan button click
        scanBtn.addEventListener('click', async function() {
            if (!selectedFile) return;

            // Show loading state
            result.style.display = 'block';
            result.className = 'result loading';
            result.textContent = 'Scanning file, please wait...';
            scanBtn.disabled = true;

            try {
                // Create form data
                const formData = new FormData();
                formData.append('file', selectedFile);

                // Send to server
                const response = await fetch('/scan', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                // Show result
                if (data.clean) {
                    result.className = 'result clean';
                    result.textContent = '✅ File is clean! No threats detected.';
                } else {
                    result.className = 'result threat';
                    result.textContent = `⚠️ Threats detected: ${data.threats} malicious, ${data.suspicious} suspicious`;
                }

            } catch (error) {
                result.className = 'result threat';
                result.textContent = '❌ Error scanning file. Please try again.';
            }

            scanBtn.disabled = false;
        });

        // Click upload area to trigger file input
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });