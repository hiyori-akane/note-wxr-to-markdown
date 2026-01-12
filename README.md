# WXR to Markdown Converter

A web tool to convert Note's WXR (WordPress eXport RSS) files to Markdown format.

🔗 **Live Demo:** https://hiyori-akane.github.io/note-wxr-to-markdown/

## Features

- 📤 **Easy Upload**: Drag & drop or select WXR files
- 📝 **Markdown Conversion**: Converts HTML content to Markdown with frontmatter
- 📋 **Article List**: View all articles with metadata
- 👁️ **Preview**: Preview converted Markdown before downloading
- 💾 **Flexible Download**: Download individual files or bulk download as ZIP
- 🌓 **Dark Mode**: Toggle between light and dark themes
- ♿ **Accessible**: WCAG 2.2 Level AA compliant
- 🎯 **Keyboard Navigation**: Full keyboard support

## Technical Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Styling with dark mode
- **Turndown** - HTML to Markdown conversion
- **JSZip** - ZIP file generation
- **FileSaver.js** - File downloads

## Output Format

### Filename
```
{yyyyMMddHHmmss}_{guid}.md
Example: 20251127235756_nfca4a1660e06.md
```

### Frontmatter
```yaml
---
title: "Article Title"
pubDate: "2025-11-27T23:57:56+09:00"
modifiedDate: "2025-11-27T23:57:56+09:00"
guid: "nfca4a1660e06"
link: "https://note.com/xxx/n/nfca4a1660e06"
creator: "Author Name"
status: "publish"
draft: false
description: ""
---
```

## Development

### Prerequisites
- Node.js 20 or higher
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

## License

MIT
