# 3D Slicer - AI-Powered 3D Model Creator

A mobile-first web application for creating, refining, and slicing 3D models with AI assistance. Features voice and chat interfaces, Cloudflare R2/KV integration, and ORCA-compatible .slt file generation for 3D printing.

## Features

### Core Functionality
- ✅ **Mobile-First Responsive Design** - Optimized for smartphones, tablets, and desktops
- ✅ **Secure Authentication** - Login system with session management
- ✅ **Cloudflare R2 Integration** - S3-compatible storage for 3D model files
- ✅ **Cloudflare KV Integration** - Fast key-value store for metadata and sessions
- ✅ **3D Model Viewer** - Interactive Three.js-based 3D visualization
- ✅ **AI Chat Interface** - Natural language model creation and refinement
- ✅ **Voice Input** - Voice commands for hands-free operation
- ✅ **CRUD Operations** - Create, Read, Update, Delete, and Copy 3D models
- ✅ **SLT File Generation** - ORCA standard output for 3D print engines

### User Interface
- Visual panel-based design (inspired by digital vending machines/smart appliances)
- Real-time 3D model preview
- Drag-and-drop file upload
- Chat-based AI assistance
- Voice command support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js, React Three Fiber
- **Authentication**: NextAuth.js
- **Storage**: Cloudflare R2 (S3-compatible)
- **Database**: Cloudflare KV
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Cloudflare account with R2 and KV access

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
```

4. Configure your `.env` file with your Cloudflare credentials:
```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=slicer-3d-models
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# Cloudflare KV Configuration
CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id
CLOUDFLARE_KV_API_TOKEN=your_kv_api_token

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cloudflare Setup

### Setting up R2

1. Log in to your Cloudflare dashboard
2. Navigate to R2 Object Storage
3. Create a new bucket named `slicer-3d-models`
4. Generate API tokens with read/write permissions
5. Copy the credentials to your `.env` file

### Setting up KV

1. Navigate to Workers & Pages > KV
2. Create a new KV namespace
3. Note the namespace ID
4. Create an API token with KV permissions
5. Add the credentials to your `.env` file

## Usage

### Login
- Navigate to `/login`
- In demo mode, enter any username and password
- You'll be redirected to the dashboard

### Dashboard
The dashboard has three main panels:

1. **Model Library (Left Panel)**
   - Upload 3D models (STL, OBJ, 3MF)
   - View your model collection
   - Select, copy, refine, or delete models

2. **3D Viewer (Center Panel)**
   - Real-time 3D model visualization
   - Rotate, zoom, and pan controls
   - Interactive model preview

3. **Chat Interface (Right Panel)**
   - AI-powered assistance
   - Voice input support
   - Natural language model creation

### Creating Models

**Via Chat:**
```
"Create a sphere with 20mm diameter"
"Make a cube 10x10x10mm"
"Design a vase"
```

**Via Upload:**
- Drag and drop files into the upload area
- Or click to browse and select files

**Via Voice:**
- Click the microphone button
- Speak your command
- The system will process your request

### Exporting to SLT
1. Select a model from the library
2. Click the "Export .slt" button
3. The system generates an ORCA-compatible .slt file
4. Download the file for your 3D printer

## Project Structure

```
Slicer/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── models/        # Model CRUD operations
│   │   └── chat/          # AI chat interface
│   ├── dashboard/         # Main dashboard page
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── ChatInterface.tsx  # Chat UI component
│   ├── ModelPanel.tsx     # Model library panel
│   ├── ModelViewer.tsx    # 3D viewer component
│   └── SessionProvider.tsx # Auth session provider
├── lib/
│   ├── cloudflare-r2.ts   # R2 storage utilities
│   ├── cloudflare-kv.ts   # KV store utilities
│   └── slt-generator.ts   # SLT file generation
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Models
- `GET /api/models` - List user's models
- `POST /api/models` - Upload new model
- `DELETE /api/models?id={id}` - Delete model

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat` - Get chat history

## Development

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## Mobile-First Design

The application is optimized for mobile devices:
- Responsive grid layout
- Touch-friendly controls
- Collapsible side panels on mobile
- Optimized for various screen sizes
- Progressive enhancement

## Security Features

- Secure authentication with NextAuth
- Session-based access control
- Environment variable protection
- HTTPS recommended for production
- Cloudflare security features

## Future Enhancements

- [ ] Integration with advanced AI models (OpenAI, Anthropic)
- [ ] Real-time collaborative editing
- [ ] Advanced 3D modeling tools
- [ ] More file format support
- [ ] Print cost estimation
- [ ] Material recommendations
- [ ] Slicing parameter optimization
- [ ] Print preview simulation
- [ ] Social features (sharing, community models)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Acknowledgments

- Built with Next.js and React
- 3D rendering powered by Three.js
- Storage provided by Cloudflare R2 and KV
- Icons by Lucide React
