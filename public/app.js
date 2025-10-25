// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeTextPrompt();
    initializeVoiceCommands();
    initializePrintRequestForm();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Text Prompt Processing
function initializeTextPrompt() {
    const processBtn = document.getElementById('process-prompt-btn');
    const promptInput = document.getElementById('model-prompt');
    
    processBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            alert('Please enter a description of your 3D model');
            return;
        }
        
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';
        
        try {
            const response = await fetch('/api/process-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            
            const data = await response.json();
            
            if (data.success) {
                displayAIResponse(data);
                // Auto-fill the request form
                document.getElementById('model-description').value = prompt;
                document.getElementById('specifications').value = data.modelSuggestions.join('\n');
            } else {
                alert('Error processing prompt: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process prompt. Please try again.');
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = 'Generate Specifications';
        }
    });
}

function displayAIResponse(data) {
    const responseSection = document.getElementById('ai-response');
    const responseContent = document.getElementById('response-content');
    
    let html = `
        <p><strong>Your Request:</strong> ${data.prompt}</p>
        <p><strong>AI Analysis:</strong></p>
        <ul>
    `;
    
    data.modelSuggestions.forEach(suggestion => {
        html += `<li>${suggestion}</li>`;
    });
    
    html += '</ul>';
    
    responseContent.innerHTML = html;
    responseSection.style.display = 'block';
    
    // Scroll to response
    responseSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Voice Command Functionality
function initializeVoiceCommands() {
    const voiceBtn = document.getElementById('voice-record-btn');
    const statusDiv = document.getElementById('voice-status');
    const transcriptionDiv = document.getElementById('transcription-result');
    
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        statusDiv.textContent = 'Voice recognition is not supported in this browser. Please use Chrome or Edge.';
        voiceBtn.disabled = true;
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let isRecording = false;
    let finalTranscript = '';
    
    voiceBtn.addEventListener('click', () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });
    
    function startRecording() {
        recognition.start();
        isRecording = true;
        voiceBtn.classList.add('recording');
        voiceBtn.querySelector('.btn-text').textContent = 'Stop Recording';
        statusDiv.textContent = 'Listening... Speak now!';
        finalTranscript = '';
    }
    
    function stopRecording() {
        recognition.stop();
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.querySelector('.btn-text').textContent = 'Start Recording';
        statusDiv.textContent = 'Processing your voice command...';
    }
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        transcriptionDiv.classList.add('active');
        transcriptionDiv.innerHTML = `
            <strong>Transcription:</strong><br>
            ${finalTranscript}
            <em style="color: #999;">${interimTranscript}</em>
        `;
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        statusDiv.textContent = `Error: ${event.error}. Please try again.`;
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.querySelector('.btn-text').textContent = 'Start Recording';
    };
    
    recognition.onend = () => {
        if (finalTranscript.trim()) {
            statusDiv.textContent = 'Voice command captured successfully!';
            // Auto-fill the model description
            document.getElementById('model-prompt').value = finalTranscript.trim();
            document.getElementById('model-description').value = finalTranscript.trim();
        } else {
            statusDiv.textContent = 'No speech detected. Please try again.';
        }
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.querySelector('.btn-text').textContent = 'Start Recording';
    };
}

// Print Request Form Submission
function initializePrintRequestForm() {
    const form = document.getElementById('print-request-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            modelDescription: document.getElementById('model-description').value,
            specifications: document.getElementById('specifications').value,
            contactInfo: {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value
            }
        };
        
        try {
            const response = await fetch('/api/submit-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                displayRequestSuccess(data);
                form.reset();
            } else {
                alert('Error submitting request: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit request. Please try again.');
        }
    });
}

function displayRequestSuccess(data) {
    const statusSection = document.getElementById('request-status');
    document.getElementById('request-id-display').textContent = `Request ID: ${data.requestId}`;
    document.getElementById('estimated-time').textContent = `Estimated completion: ${data.estimatedTime}`;
    
    statusSection.style.display = 'block';
    statusSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide after 10 seconds
    setTimeout(() => {
        statusSection.style.display = 'none';
    }, 10000);
}
