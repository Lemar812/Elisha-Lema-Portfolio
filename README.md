# Portfolio Website

A premium, designer-first portfolio website built with React, Vite, TypeScript, TailwindCSS, and Framer Motion.

## Features
- **Premium Design**: Dark mode aesthetic with carefully curated colors and typography.
- **Smooth Motion**: Integrated Framer Motion for scroll reveals, staggers, and micro-interactions.
- **Smooth Scrolling**: Powered by Lenis for a fluid experience.
- **Responsive**: Fully optimized for all devices.
- **Works Gallery**: Filterable project showcase with lightbox details.

## Tech Stack
- React + TypeScript + Vite
- TailwindCSS (Styling)
- Framer Motion (Animation)
- Lenis (Smooth Scroll)
- Lucide React (Icons)

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Assets
To populate the portfolio with your work:
1. Extract the contents of `graphix.zip` into the `public/works/` directory.
   - The structure should look like:
     - `public/works/Logos/`
     - `public/works/Posters & Banners/`
     - `public/works/Screenshot*.png`
2. Add your personal photo as `public/me.jpg`.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
The output will be in the `dist` folder.

## Customization
- **Content**: Update `src/data/works.ts` to match your filenames if they differ from the defaults.
- **Theme**: Modify `tailwind.config.js` to adjust colors and fonts.
