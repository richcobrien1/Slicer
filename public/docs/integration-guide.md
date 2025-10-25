# Integration Guide

## Integrating Slicer with Your Systems

This guide covers how to integrate the Slicer 3D printing platform with external systems and services.

## Table of Contents
- [API Integration](#api-integration)
- [AI Service Integration](#ai-service-integration)
- [Voice Recognition Integration](#voice-recognition-integration)
- [Database Integration](#database-integration)
- [Payment Processing](#payment-processing)
- [File Upload & Storage](#file-upload--storage)
- [Webhook Integration](#webhook-integration)

## API Integration

### Authentication Setup

For production environments, implement API key authentication:

```javascript
// server.js
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized' 
    });
  }
  
  next();
};

// Apply to routes
app.post('/api/process-prompt', authenticateAPIKey, async (req, res) => {
  // Handler code
});
```

### CORS Configuration

Configure CORS for specific domains:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## AI Service Integration

### OpenAI Integration

```javascript
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/process-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a 3D printing expert. Analyze user requests and provide detailed specifications for 3D models including dimensions, materials, and manufacturing considerations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const aiResponse = completion.data.choices[0].message.content;
    
    res.json({
      success: true,
      prompt: prompt,
      analysis: aiResponse,
      modelSuggestions: parseAIResponse(aiResponse)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function parseAIResponse(response) {
  // Parse AI response into structured suggestions
  const lines = response.split('\n').filter(line => line.trim());
  return lines.slice(0, 5); // Return top 5 suggestions
}
```

### Claude/Anthropic Integration

```javascript
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/process-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `As a 3D printing expert, analyze this request and provide specifications: ${prompt}`
        }
      ],
    });
    
    res.json({
      success: true,
      prompt: prompt,
      analysis: message.content[0].text,
      modelSuggestions: parseAIResponse(message.content[0].text)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Voice Recognition Integration

### Google Cloud Speech-to-Text

```javascript
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

app.post('/api/transcribe-voice', async (req, res) => {
  try {
    const { audioData } = req.body; // base64 encoded audio
    
    const audio = {
      content: audioData,
    };
    
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    
    const request = {
      audio: audio,
      config: config,
    };
    
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    res.json({
      success: true,
      transcription: transcription,
      confidence: response.results[0]?.alternatives[0]?.confidence || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Azure Speech Services

```javascript
const sdk = require('microsoft-cognitiveservices-speech-sdk');

app.post('/api/transcribe-voice', async (req, res) => {
  try {
    const { audioData } = req.body;
    
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );
    
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      Buffer.from(audioData, 'base64')
    );
    
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
    recognizer.recognizeOnceAsync(result => {
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        res.json({
          success: true,
          transcription: result.text
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Speech recognition failed'
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Database Integration

### MongoDB Example

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  await client.connect();
  return client.db('slicer');
}

app.post('/api/submit-request', async (req, res) => {
  try {
    const db = await connectDB();
    const requests = db.collection('print_requests');
    
    const requestDoc = {
      ...req.body,
      createdAt: new Date(),
      status: 'pending',
      requestId: Date.now().toString()
    };
    
    const result = await requests.insertOne(requestDoc);
    
    res.json({
      success: true,
      requestId: requestDoc.requestId,
      message: 'Print request submitted successfully',
      estimatedTime: '3-5 business days'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### PostgreSQL Example

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/api/submit-request', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { modelDescription, specifications, contactInfo } = req.body;
    const requestId = Date.now().toString();
    
    const query = `
      INSERT INTO print_requests 
      (request_id, model_description, specifications, contact_name, contact_email, created_at, status)
      VALUES ($1, $2, $3, $4, $5, NOW(), 'pending')
      RETURNING *
    `;
    
    const values = [
      requestId,
      modelDescription,
      specifications,
      contactInfo.name,
      contactInfo.email
    ];
    
    const result = await client.query(query, values);
    
    res.json({
      success: true,
      requestId: requestId,
      message: 'Print request submitted successfully',
      estimatedTime: '3-5 business days'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});
```

## Payment Processing

### Stripe Integration

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', requestId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency,
      metadata: {
        requestId: requestId
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## File Upload & Storage

### Local File Storage

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.stl', '.obj', '.3mf', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.post('/api/upload-file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size
  });
});
```

### AWS S3 Integration

```javascript
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    }
  })
});

app.post('/api/upload-file', upload.single('file'), (req, res) => {
  res.json({
    success: true,
    location: req.file.location,
    key: req.file.key
  });
});
```

## Webhook Integration

### Receiving Webhooks

```javascript
app.post('/api/webhooks/:service', async (req, res) => {
  const { service } = req.params;
  const payload = req.body;
  
  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'];
  if (!verifyWebhookSignature(signature, payload)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook based on service
  switch (service) {
    case 'payment':
      await handlePaymentWebhook(payload);
      break;
    case 'print-status':
      await handlePrintStatusWebhook(payload);
      break;
    default:
      return res.status(400).json({ error: 'Unknown service' });
  }
  
  res.json({ received: true });
});

function verifyWebhookSignature(signature, payload) {
  const crypto = require('crypto');
  const secret = process.env.WEBHOOK_SECRET;
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const calculatedSignature = hmac.digest('hex');
  
  return signature === calculatedSignature;
}
```

## Environment Variables

Create a `.env` file with all necessary credentials:

```env
# Server
PORT=3000
NODE_ENV=production

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Azure
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus

# Database
MONGODB_URI=mongodb://localhost:27017/slicer
# OR
DATABASE_URL=postgresql://user:password@localhost:5432/slicer

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET_NAME=slicer-uploads

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhooks
WEBHOOK_SECRET=your-secret-key
```

## Testing Integration

Use tools like:
- **Postman**: Test API endpoints
- **curl**: Command-line testing
- **ngrok**: Expose local server for webhook testing

Example curl command:
```bash
curl -X POST http://localhost:3000/api/process-prompt \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"prompt": "I need a phone stand"}'
```

## Best Practices

1. **Always use environment variables** for sensitive data
2. **Implement rate limiting** to prevent abuse
3. **Validate all inputs** on the server side
4. **Use HTTPS** in production
5. **Log errors** for debugging
6. **Implement retry logic** for external API calls
7. **Cache responses** when appropriate
8. **Monitor API usage** and costs

## Next Steps

1. Choose which integrations you need
2. Set up accounts with required services
3. Install necessary npm packages
4. Configure environment variables
5. Test each integration thoroughly
6. Deploy to production

For questions or issues, consult the specific service documentation or contact support.
