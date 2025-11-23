# AI Tools Hub - Landing Page

A modern, responsive landing page for AI Tools Bookmark Platform built with Next.js 14, TypeScript, and Tailwind CSS v3.

## Features

- ✨ **Modern Design**: Clean and professional UI with smooth animations
- 🌓 **Dark Mode**: Full dark mode support with smooth transitions
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ⚡ **Fast Performance**: Built with Next.js 14 for optimal speed
- 🎨 **Tailwind CSS v3**: Utility-first CSS framework
- 🔧 **TypeScript**: Type-safe development

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
.
├── app/
│   ├── layout.tsx        # Root layout with ThemeProvider
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── Features.tsx      # Features section
│   ├── HowItWorks.tsx    # How it works section
│   ├── CTA.tsx           # Call to action section
│   ├── Footer.tsx        # Footer
│   ├── ThemeProvider.tsx # Dark mode context provider
│   └── ThemeToggle.tsx   # Theme toggle button
├── public/               # Static assets
└── tailwind.config.ts    # Tailwind configuration
```

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  primary: '#3498db',
  secondary: '#95a5a6',
  // ... more colors
}
```

### Content

Update the content in the respective component files:
- Hero section: `components/Hero.tsx`
- Features: `components/Features.tsx`
- How It Works: `components/HowItWorks.tsx`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

Build the project:
```bash
npm run build
```

The output will be in the `.next` folder, ready for deployment.

## License

MIT License - feel free to use this template for your projects!
