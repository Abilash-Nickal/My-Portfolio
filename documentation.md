# Abilashan | Portfolio & Admin Ecosystem
## Full Project Documentation

### 1. Project Overview
This project is a high-performance, visually stunning personal portfolio designed for a multidisciplinary engineer. It features a seamless 3D backgrounds, real-time data integration, and a dedicated Administrative Panel for content management.

---

### 2. Core Technology Stack
- **Frontend Framework**: [React.js](https://reactjs.org/) (Vite-powered)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom UI/UX with Glassmorphism and Neon Aesthetics)
- **3D Visuals**: [Three.js](https://threejs.org/) (Interactive backgrounds and geometric animations)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Hosting**: [Firebase Hosting](https://firebase.google.com/docs/hosting)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)

---

### 3. Key Features & Components

#### 3D Hero Section ([Hero.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Hero.jsx))
- **Ghost Typing Profile**: Dynamic typing effect for branding phrases ("ENGINEERING smart AUTOMATION", etc.).
- **Dynamic Profile Image**: Circular-masked image fetched directly from Firestore.
- **Glassmorphic Hero Card**: Personalized bio with a high-contrast theme-aware layout.

#### Core Skills Marquee ([Skills.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Skills.jsx))
- **Infinite Scroll**: Dual-row horizontal scrolling marquee for technical icons.
- **Pillar Overlays**: Interactive detail views for each skill, linking related projects.

#### Dynamic Projects Grid ([Projects.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Projects.jsx))
- **Multi-Category Support**: Projects can have up to 3 categories (e.g., Robotics, Web, Arduino).
- **Filtering System**: Dynamic category extraction and filter bar.
- **Corner-Hug Badges**: High-glow badges in the top-left (mimicking education duration tags).

#### Experience & Education ([Experience.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Experience.jsx), [Education.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Education.jsx))
- **Mobile Optimization**: Vertical stacking on smaller viewports.
- **Visual Impact**: Large, contained logos and chronological layouts.

#### Content Admin Panel (`/admin`)
- **Authentication**: Secure login via Firebase Auth.
- **Dashboard**: Full CRUD (Create, Read, Update, Delete) for Projects, Experience, Education, and Skills.
- **Profile Management**: Direct editing of name, bio, and image via the 'About Me' section.

---

### 4. Technical Architecture
The application follows a standard React component hierarchy.
- `App.js` serves as the root, managing global states like `isLightMode`, `profileData`, and `allProjects`.
- **Firebase Provider**: Real-time listeners or on-demand fetching via Firestore hooks.
- **Persistence**: Content added in the Admin Dashboard is immediately reflected across the portfolio.

---

### 5. Deployment Guide
1. **Local Development**: `npm run dev`
2. **Production Build**: `npm run build`
3. **Firebase Deployment**: `npx firebase-tools deploy --only hosting`

---

### 6. Customization Highlights
- **Theme Color**: Easily adjusted via Tailwind config and [ThreeBackground.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/ThreeBackground.jsx) constants.
- **Professional Links**: Located in [Hero.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Hero.jsx), [Contact.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Contact.jsx), and [Footer.jsx](file:///c:/Users/abila/Desktop/portfolio/my-portfolio/src/components/Footer.jsx).
- **CV Download**: The file `ABILASHAN Resume.pdf` is located in the `/public` directory.

---

### 7. Recent UI/UX Evolution (March 20, 2026 - Present)

#### 7.1 Project Detail Overlay Restructure
The project detail view was transformed from a static popup into a professional, two-pane interactive interface:
- **Dual-Pane Layout**: Main content (description/tech) on the left, sticky action sidebar on the right.
- **Structured Content Parser**: Implemented `formatDescription` to convert raw text into styled HTML (bold headers, bullet points, justified paragraphs).
- **Sticky Actions**: Moved Live Demo and Source buttons to a sidebar that remains visible during scroll (`lg:sticky`).
- **Visual Refinement**: Removed "side shadow" gradients for a cleaner edge-to-edge look.

#### 7.2 Browser History & Navigation Fix
Resolved the common SPA issue where the back button exits the application:
- **State Synchronization**: Integrated `window.history.pushState` and `window.history.popstate`.
- **Back-to-Close Logic**: Opening any overlay pushes a temporary state to the history stack. Pressing 'Back' triggers a state pop that closes the overlay instead of navigating away.

#### 7.3 Multi-Profile Image Management
Added flexibility to the Admin Ecosystem for branding:
- **Three-Image Architecture**: Separate fields for **Header Avatar**, **Hero Section Image**, and **About Section Image**.
- **Fallback Logic**: Implemented intelligent defaults where the Hero/About sections automatically inherit the Header Avatar if specific images aren't provided.

---

**Generated on:** March 22, 2026
**Version:** 1.5.0 (Enhanced Navigation & UI)
