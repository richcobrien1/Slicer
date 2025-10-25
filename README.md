# Slicer - AI-Powered 3D Printing Request Platform

## Overview

Slicer is a modern web application that allows users to request 3D models to be printed using AI prompting and voice commands. The platform streamlines the process of describing, specifying, and submitting 3D printing requests.

## Features

- 🤖 **AI-Powered Prompting**: Describe your 3D model in natural language and get intelligent specifications
- 🎤 **Voice Commands**: Use your voice to describe what you want printed
- 📝 **Text Input**: Traditional text-based request submission
- 📋 **Automated Specifications**: AI generates detailed manufacturing specifications
- 🎨 **User-Friendly Interface**: Modern, responsive web design
- 📚 **Comprehensive Documentation**: Guides for voice commands, AI prompting, and 3D printing basics

## Quick Start

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/richcobrien1/Slicer.git
cd Slicer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Development

Run the development server with auto-reload:
```bash
npm run dev
```

## Project Structure

```
Slicer/
├── server.js              # Express server and API endpoints
├── package.json           # Project dependencies and scripts
├── .env.example          # Environment variable template
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   ├── styles.css        # CSS styling
│   ├── app.js           # Client-side JavaScript
│   └── docs/            # Documentation
│       ├── api-documentation.md
│       ├── voice-commands-guide.md
│       ├── ai-prompting-tips.md
│       ├── 3d-printing-basics.md
│       └── integration-guide.md
└── README.md            # This file
```

## Usage

### Text Prompting

1. Navigate to the "Text Prompt" tab
2. Describe your 3D model in detail
3. Click "Generate Specifications"
4. Review AI-generated suggestions
5. Fill out the request form
6. Submit your request

### Voice Commands

1. Navigate to the "Voice Command" tab
2. Click the microphone button
3. Speak your request clearly
4. Stop recording when finished
5. Review the transcription
6. Submit your request

## API Endpoints

- `POST /api/process-prompt` - Process AI prompts
- `POST /api/submit-request` - Submit print requests
- `POST /api/transcribe-voice` - Process voice commands

See [API Documentation](public/docs/api-documentation.md) for details.

## Documentation

Comprehensive guides are available in the `public/docs/` directory:

- **[API Documentation](public/docs/api-documentation.md)** - REST API reference
- **[Voice Commands Guide](public/docs/voice-commands-guide.md)** - How to use voice features
- **[AI Prompting Tips](public/docs/ai-prompting-tips.md)** - Best practices for descriptions
- **[3D Printing Basics](public/docs/3d-printing-basics.md)** - Introduction to 3D printing
- **[Integration Guide](public/docs/integration-guide.md)** - How to integrate external services

## Browser Compatibility

- ✅ Chrome (recommended for voice features)
- ✅ Edge
- ✅ Safari (limited voice support)
- ⚠️ Firefox (no voice support)

## Future Enhancements

- [ ] OpenAI GPT integration for intelligent model analysis
- [ ] Real-time 3D model preview
- [ ] User authentication and order tracking
- [ ] Payment processing integration
- [ ] Multi-language support
- [ ] Mobile app
- [ ] CAD file upload support
- [ ] Real-time collaboration features

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Resources

### External Resources
- [Thingiverse](https://www.thingiverse.com/) - 3D model repository
- [Printables](https://www.printables.com/) - 3D printing community
- [OpenAI API](https://openai.com/api/) - AI integration
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Voice recognition

### Learning Resources
- [3D Printing for Beginners](https://all3dp.com/1/3d-printing-for-beginners/)
- [CAD Software Guide](https://all3dp.com/1/best-free-cad-software-2d-3d-cad-programs-design/)
- [Material Selection Guide](https://all3dp.com/1/3d-printer-filament-types-3d-printing-3d-filament/)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check the documentation in `public/docs/`
- Review existing issues and discussions

## Acknowledgments

Built with:
- Express.js for the server
- Vanilla JavaScript for the frontend
- Web Speech API for voice recognition
- Modern CSS for responsive design

---

**Note**: This is a demonstration platform. For production use, implement proper authentication, database storage, AI service integration, and security measures as outlined in the Integration Guide.
