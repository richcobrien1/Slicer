# API Documentation

## Overview
The Slicer API provides endpoints for processing 3D printing requests using AI prompts and voice commands.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Process AI Prompt
Process a text description of a 3D model and generate specifications.

**Endpoint:** `POST /api/process-prompt`

**Request Body:**
```json
{
  "prompt": "I need a custom phone stand that can hold my device vertically..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prompt received successfully",
  "prompt": "I need a custom phone stand...",
  "modelSuggestions": [
    "Based on your request, we recommend a standard 3D print",
    "Estimated dimensions: To be determined",
    "Recommended material: PLA or ABS"
  ]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### 2. Submit Print Request
Submit a formal 3D printing request with specifications.

**Endpoint:** `POST /api/submit-request`

**Request Body:**
```json
{
  "modelDescription": "Custom phone stand with vertical and horizontal support",
  "specifications": "15cm tall, 1cm slot width, PLA material",
  "contactInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "requestId": "1698235200000",
  "message": "Print request submitted successfully",
  "estimatedTime": "3-5 business days"
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

### 3. Transcribe Voice Command
Process voice audio data and convert to text (placeholder for future implementation).

**Endpoint:** `POST /api/transcribe-voice`

**Request Body:**
```json
{
  "audioData": "base64_encoded_audio_data"
}
```

**Response:**
```json
{
  "success": true,
  "transcription": "Voice transcription would appear here",
  "message": "Voice command processed"
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

## Authentication
Currently, the API does not require authentication. In production, implement:
- API keys for server-to-server communication
- OAuth 2.0 for user authentication
- Rate limiting to prevent abuse

## Error Handling
All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Rate Limiting
In production, implement rate limiting:
- 100 requests per hour for anonymous users
- 1000 requests per hour for authenticated users

## Future Enhancements
- AI model integration (OpenAI GPT, Claude, etc.)
- Real-time voice transcription
- File upload for reference images
- 3D model preview generation
- Payment processing integration
- Order tracking system
