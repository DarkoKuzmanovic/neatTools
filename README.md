# NeatTools

A collection of modern, user-friendly tools built with SvelteKit and Skeleton UI. Currently featuring a ZPL Reader and Audio Transcriber.

## Features

### ZPL Reader

- Live preview of ZPL (Zebra Programming Language) code
- Drag & drop file upload support
- Real-time preview using Labelary API
- Zoom and rotation controls
- Download preview as PNG
- Copy preview to clipboard
- Dark mode support

### Audio Transcriber

- Audio-to-text transcription using Google's Gemini AI
- Support for various audio formats
- Customizable AI settings:
  - Adjustable temperature (0-1)
  - Customizable system prompt
- Markdown preview support
- Export options:
  - Download as TXT
  - Download as Markdown
- Dark mode support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm/pnpm/yarn
- Google API Key for Gemini AI (user-provided)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/DarkoKuzmanovic/neattools.git
cd neattools
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks
- `npm run lint` - Run linting checks
- `npm run format` - Format code with Prettier

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/) - Web application framework
- [Skeleton UI](https://www.skeleton.dev/) - UI component library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini AI](https://ai.google.dev/) - AI transcription service
- [Labelary API](http://labelary.com/) - ZPL preview service
- [Marked](https://marked.js.org/) - Markdown parsing
- [FontAwesome](https://fontawesome.com/) - Icons

## Environment Variables

No environment variables are required for deployment as API keys are user-provided.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
