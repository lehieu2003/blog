# Blog CMS - Rich Text Editor Setup

## Đã hoàn thành:

### 1. ✅ Rich Text Editor với TipTap

- Text formatting: Bold, Italic, Headings (H1, H2, H3)
- Lists: Bullet & Numbered
- Code blocks với syntax highlighting
- Blockquotes
- Links
- Images (upload & URL)

### 2. ✅ Image Upload System

- API endpoint: `/api/upload`
- Local storage: `public/uploads/`
- Validation: type (jpg, png, webp, gif) & size (max 5MB)
- Chỉ authenticated users mới upload được

### 3. ✅ Updated Database Schema

- Added `coverImage` field
- Added `readingTime` field
- Support rich HTML content

### 4. ✅ Content Rendering

- Component `RichContentRenderer`
- Support cả HTML (TipTap) và Markdown
- Syntax highlighting với highlight.js
- Responsive images

## Cài đặt:

```bash
npm install
```

## Packages mới:

- @tiptap/react, @tiptap/starter-kit
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-code-block-lowlight
- lowlight (syntax highlighting)
- rehype-highlight, remark-gfm

## Features:

### Editor Toolbar:

- **B** Bold
- _I_ Italic
- H1, H2, H3 Headings
- Bullet & Numbered Lists
- Code Block
- Quote
- Link
- Image Upload
- Undo/Redo

### Bảo mật:

- Chỉ logged-in users mới upload được
- File type validation
- File size limit (5MB)
- Sanitized output

## Next Steps (Optional):

### Phase 2:

- [ ] Video embed (YouTube, Vimeo)
- [ ] Link preview (Twitter, Open Graph)
- [ ] Table support
- [ ] Autosave drafts
- [ ] Real-time preview
- [ ] Cloudinary/S3 integration
- [ ] Image optimization & resize

### UX Improvements:

- [ ] Loading states
- [ ] Upload progress bar
- [ ] Drag & drop images
- [ ] Paste images from clipboard
- [ ] Warning before leaving unsaved changes
