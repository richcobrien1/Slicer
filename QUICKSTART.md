# Quick Start Guide

Get up and running with Slicer in under 5 minutes!

## Prerequisites

- Node.js 14+ installed ([Download](https://nodejs.org/))
- A modern web browser (Chrome recommended)
- Terminal/Command Prompt access

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/richcobrien1/Slicer.git
cd Slicer
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express (web server)
- body-parser (request parsing)
- cors (cross-origin requests)
- dotenv (environment variables)

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
Slicer 3D Printing Server running on port 3000
Visit http://localhost:3000 to access the application
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

## Using the Application

### Method 1: Text Prompt (Recommended for First Try)

1. You'll see the "Text Prompt" tab selected by default
2. In the text area, type a description like:
   ```
   I need a phone stand that is 15cm tall with a 1cm wide slot
   to hold my phone. It should have a cable management hole at
   the bottom and be made from PLA material in black color.
   ```
3. Click **"Generate Specifications"**
4. Review the AI-generated suggestions (currently placeholder responses)
5. The form below will auto-fill with your description
6. Fill in your name and email
7. Click **"Submit Request"**
8. See the success message with your request ID!

### Method 2: Voice Command (Chrome/Edge Only)

1. Click the **"🎤 Voice Command"** tab
2. Click the **"Start Recording"** button
3. Allow microphone access when prompted
4. Speak clearly: "I need a phone stand that is 15 centimeters tall"
5. Click the button again to stop recording
6. Your speech will be transcribed automatically
7. Fill in the rest of the form and submit

## Testing the API

Open a new terminal and test the endpoints:

### Test AI Prompt Processing
```bash
curl -X POST http://localhost:3000/api/process-prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need a custom desk organizer"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Prompt received successfully",
  "prompt": "I need a custom desk organizer",
  "modelSuggestions": [
    "Based on your request, we recommend a standard 3D print",
    "Estimated dimensions: To be determined",
    "Recommended material: PLA or ABS"
  ]
}
```

### Test Request Submission
```bash
curl -X POST http://localhost:3000/api/submit-request \
  -H "Content-Type: application/json" \
  -d '{
    "modelDescription": "Phone stand",
    "specifications": "15cm tall, PLA",
    "contactInfo": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "requestId": "1234567890",
  "message": "Print request submitted successfully",
  "estimatedTime": "3-5 business days"
}
```

## Troubleshooting

### Port 3000 Already in Use
Change the port in `.env`:
```bash
cp .env.example .env
# Edit .env and change PORT=3000 to PORT=3001
```

Or start with a different port:
```bash
PORT=3001 npm start
```

### Voice Commands Not Working
- **Check browser**: Use Chrome or Edge
- **Check permissions**: Allow microphone access
- **Check microphone**: Ensure it's working in system settings
- **Try text prompt**: Voice is optional, text works everywhere

### Dependencies Not Installing
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

### 1. Explore the Documentation
- **[API Documentation](public/docs/api-documentation.md)** - Learn the API
- **[Voice Commands Guide](public/docs/voice-commands-guide.md)** - Master voice input
- **[AI Prompting Tips](public/docs/ai-prompting-tips.md)** - Write better prompts
- **[3D Printing Basics](public/docs/3d-printing-basics.md)** - Learn about 3D printing

### 2. Add AI Integration
See **[Integration Guide](public/docs/integration-guide.md)** for:
- OpenAI GPT integration
- Claude/Anthropic integration
- Google Cloud services
- Azure services

### 3. Add a Database
Choose from:
- MongoDB (flexible, document-based)
- PostgreSQL (structured, relational)
- Firebase (real-time, hosted)

Integration examples in the **[Integration Guide](public/docs/integration-guide.md)**

### 4. Deploy to Production
Recommended platforms:
- **Vercel** - Easy, free tier, optimized for Node.js
- **Netlify** - JAMstack hosting with serverless functions
- **Railway** - Full-stack with database included
- **DigitalOcean** - More control, VPS hosting

### 5. Customize the Design
Edit `public/styles.css` to:
- Change color scheme (see `:root` variables)
- Adjust layout and spacing
- Add your logo
- Customize fonts

## Development Mode

For development with auto-reload:
```bash
npm run dev
```

This uses `nodemon` to restart the server on file changes.

## Project Structure at a Glance

```
Slicer/
├── server.js          # Backend API server
├── package.json       # Dependencies and scripts
├── public/            # Frontend files
│   ├── index.html    # Main page
│   ├── styles.css    # Styling
│   ├── app.js        # Frontend logic
│   └── docs/         # Documentation
└── resources/        # External resource links
```

## Common Use Cases

### Example 1: Simple Object
```
Text: "I need a cable clip to hold 3 cables on my desk edge"
Result: AI suggests dimensions, material, mounting method
```

### Example 2: Complex Request
```
Text: "Create a modular desk organizer with compartments for
pens (5cm diameter), sticky notes (8cm x 8cm), and paperclips.
Total size should be 25cm x 15cm x 8cm in navy blue PETG."
Result: Detailed specifications with material recommendations
```

### Example 3: Voice Command
```
Voice: "I want a plant pot for succulents, eight centimeters
in diameter, seven centimeters tall, with drainage holes"
Result: Transcribed and processed like text input
```

## Getting Help

### Resources in This Project
- Check the `public/docs/` folder for detailed guides
- See `resources/README.md` for external service links
- Read `IMPLEMENTATION_SUMMARY.md` for technical details

### External Help
- **3D Printing**: r/3Dprinting subreddit
- **Web Development**: Stack Overflow
- **Node.js**: Node.js documentation
- **AI Integration**: OpenAI/Anthropic docs

## What's Next?

You now have a working 3D printing request platform! Here's what you can do:

1. ✅ Test both text and voice input methods
2. ✅ Review the documentation
3. ✅ Plan your AI service integration
4. ✅ Customize the design to match your brand
5. ✅ Add database for persistent storage
6. ✅ Deploy to a hosting platform
7. ✅ Share with users and gather feedback

**Need more help?** Check the comprehensive guides in `public/docs/`!

---

**Enjoy building with Slicer!** 🖨️
