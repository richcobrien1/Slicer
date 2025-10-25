import Link from "next/link";
import { Box, MessageSquare, Mic, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-8">
              <Box size={40} className="text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              3D Slicer
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              AI-Powered 3D Model Creator
            </p>
            
            <p className="text-lg md:text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              Create, refine, and slice 3D models using voice commands and AI chat.
              Generate ORCA-compatible .slt files for 3D printing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                View Dashboard
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <MessageSquare className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">AI Chat Interface</h3>
                <p className="text-white/80">
                  Describe your 3D model and let AI help you create it
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Mic className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Voice Commands</h3>
                <p className="text-white/80">
                  Create and modify models using your voice
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Download className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">ORCA Standard</h3>
                <p className="text-white/80">
                  Generate .slt files for 3D print engines
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-16 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60 mb-4">Powered by</p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
                <span>Cloudflare R2</span>
                <span>•</span>
                <span>Cloudflare KV</span>
                <span>•</span>
                <span>Next.js</span>
                <span>•</span>
                <span>Three.js</span>
                <span>•</span>
                <span>AI Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
