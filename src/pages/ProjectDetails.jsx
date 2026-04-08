import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const projectData = {
  poppins: {
    title: 'Poppins',
    subtitle: 'Full-Stack E-Commerce & Dropshipping Platform',
    image: '/Gemini_Generated_Image_b8t7mrb8t7mrb8t7.png',
    role: 'Lead Full-Stack Developer',
    timeline: '2026',
    platform: 'Progressive Web App (PWA)',
    problem: 'Traditional e-commerce platforms often struggle with real-time state synchronization across carts, orders, and dashboards, resulting in bloated UX and abandoned checkouts.',
    solution: 'Engineered Poppins, a high-performance dropshipping solution built with a rapid Vite + TypeScript stack. Integrated Socket.io for instantaneous real-time updates and encapsulated the platform as an installable PWA to maximize mobile user retention.',
    tech: ['React (TypeScript) & Vite', 'Node.js & Express.js', 'MongoDB', 'Socket.io', 'Tailwind CSS', 'Radix / Shadcn UI'],
    features: ['Dropshipping Core (Cart, Checkout & Order Tracking)', 'Secure Admin Dashboard with Live Analytics', 'Real-time Database Sync via WebSockets', 'Installable Progressive Web App (PWA) Capabilities'],
    outcome: 'Successfully launched a highly-scalable product catalog and checkout pipeline backed by a strictly protected administrative environment driving deep user-engagement.',
    link: 'https://poppins-store.vercel.app/'
  },
  smartattend: {
    title: 'smartAttend',
    subtitle: 'College Attendance Tracker',
    image: '/Gemini_Generated_Image_hie5buhie5buhie5.png',
    role: 'Full-Stack Developer / AI Engineer',
    timeline: '2026',
    platform: 'Web Application',
    problem: 'Manual attendance tracking is time-consuming and prone to proxy attendance. Educational institutions needed a foolproof, automated system to verify student presence without interrupting lecture time or compromising on accuracy.',
    solution: 'Built smartAttend from the ground up using Flask, PostgreSQL, and InsightFace. It leverages an advanced deep learning pipeline (MTCNN + FaceNet) for real-time face detection via webcam. To ensure high performance, I implemented skip-frame processing (detection every 3rd frame) smoothly across a live MJPEG stream.',
    tech: ['Python & Flask', 'PostgreSQL', 'InsightFace (Deep Learning)', 'MTCNN & FaceNet', 'OpenCV', 'Plus Jakarta Sans (UI)'],
    features: ['MTCNN + FaceNet Real-time Detection (99%+ acc)', 'Role-Based Access (Admin/Teacher/Advisor)', 'Timetable System & Conflict Detection', 'Smart Session Termination', 'Hierarchical Face Data Storage', 'Inline AJAX Editing & Cascade Deletions', 'Comprehensive CSV Analytics Reports'],
    outcome: 'Established an orientation-agnostic pipeline achieving 99%+ accuracy (vastly outperforming Haar/LBPH). The shift to PostgreSQL secured concurrent access and safe cascade deletes for a strictly production-ready deployment.',
    github: 'https://github.com/jaikisan157/Smart-Attendance-System'
  },
  shadowchat: {
    title: 'shadowchat',
    subtitle: 'Anonymized Real-Time Chat & Mini-Games',
    image: '/Gemini_Generated_Image_iqmwaxiqmwaxiqmw.png',
    role: 'Lead Full-Stack Developer',
    timeline: '2025',
    platform: 'Web Application',
    problem: 'Modern social platforms force heavy registration processes and track permanent data footprints, completely losing the simple, spontaneous human connection of the early internet.',
    solution: 'Engineered shadowchat, a zero-registration, no-log anonymous chat environment featuring an edgy "Neon Noir" aesthetic. Powered by raw WebSockets for instant matchmaking, the platform features live mini-games, typing indicators, and a deeply integrated Google Gemini AI chatbot.',
    tech: ['React 19 & TypeScript', 'Vite & Tailwind CSS', 'GSAP Animations', 'Radix UI / Shadcn', 'Node.js & Express', 'ws (WebSockets)', 'Google Gemini (@google/genai)', 'React Hook Form & Zod'],
    features: ['Queue-Based Smart Stranger Matchmaking', 'Integrated Google Gemini AI Bot (botService)', 'Live 2-Player Games (Tic-Tac-Toe, RPS, Connect 4)', 'High-Accessibility Keyboard Shortcuts & Audio FX', 'Strict Zero-Log Volatile Architecture'],
    outcome: 'Successfully established a highly engaging, zero-footprint social environment capable of instantaneously connecting strangers via raw WebSockets.',
    link: 'https://shadowchat-psi.vercel.app/'
  },
  pairon: {
    title: 'PairOn',
    subtitle: 'Developer Collaboration Platform',
    image: '/Gemini_Generated_Image_wtqtfywtqtfywtqt.png',
    role: 'Lead Full-Stack Developer',
    timeline: '2026',
    platform: 'Web Application',
    problem: 'Developers often struggle to find reliable partners for hackathons or side projects, and existing platforms lack integrated coding environments to test compatibility.',
    solution: 'Created PairOn, a unified ecosystem where developers can match based on tech-stack, instantly spin up collaborative coding sessions, and build together in real-time.',
    tech: ['React 18 & TypeScript', 'Vite & Tailwind CSS', 'Shadcn/Radix UI', 'Framer Motion', 'WebContainers (In-Browser Node.js)', 'Monaco Editor', 'Express.js', 'MongoDB Atlas', 'Socket.IO', 'JWT & OAuth (Google/GitHub)', 'Groq API (Llama 3 AI)', 'Vercel & Render'],
    features: ['Algorithmic Tech-Stack Matching', 'Real-Time Shared IDE Integration', 'Live Voice Communication'],
    outcome: 'Successfully launched a thriving community platform that connects developers globally and dramatically accelerates indie project development workflows.',
    link: 'https://pair-on-green.vercel.app/'
  }
};

function ProjectDetails() {
  const { id } = useParams();
  const project = projectData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <section className="hero" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h1 className="hero-title">Project Not Found</h1>
          <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}><span>Back to Portfolio</span></Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        .pd-hero-sec { min-height: 75vh; padding: 15vh 6vw 5vh; display: flex; flex-direction: column; animation: fadeIn 0.8s ease; justify-content: center; }
        .pd-title { font-size: clamp(2.5rem, 10vw, 6.5rem); line-height: 1.1; margin: 0 0 1rem 0; animation-delay: 0.2s; word-break: break-word; }
        .pd-meta { display: flex; gap: 4rem; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 1.5rem 0; animation: fadeUp 0.8s ease both; animation-delay: 0.4s; flex-wrap: wrap; }
        .pd-grid { padding: 8vh 6vw; display: grid; grid-template-columns: minmax(250px, 1fr) 2.5fr; gap: 8vw; }
        .pd-img-sec { padding: 0 6vw 5vh; }
        .pd-img { width: 100%; aspect-ratio: 16/9; background-color: #0D0C0A; background-position: center; background-size: contain; background-repeat: no-repeat; }
        .pd-nav-bot { padding: 0 6vw 10vh; display: flex; gap: 1.5rem; flex-wrap: wrap; }
        
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr; gap: 3rem; }
          .pd-meta { gap: 1.5rem; flex-direction: column; padding: 1.5rem 0; }
          .pd-hero-sec { min-height: 50vh; padding-top: 26vh; }
          .pd-img { aspect-ratio: auto; min-height: 250px; }
        }
      `}</style>
      <section className="pd-hero-sec">
        <p className="hero-eyebrow" style={{ animationDelay: '0.1s', marginBottom: '1rem', color: 'var(--gold)' }}>Case Study</p>
        <h1 className="hero-title pd-title">
          {project.title}
        </h1>
        <p className="hero-desc" style={{ animationDelay: '0.3s', fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'var(--light-ink)', marginBottom: '3rem', maxWidth: '600px' }}>
          {project.subtitle}
        </p>
        
        {/* Project Meta Details */}
        <div className="pd-meta">
          <div>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.5rem' }}>Role</p>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--ink)' }}>{project.role}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.5rem' }}>Timeline</p>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--ink)' }}>{project.timeline}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.5rem' }}>Platform</p>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--ink)' }}>{project.platform}</p>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="pd-img-sec">
        <div className="pd-img" style={{ backgroundImage: `url(${project.image})` }}></div>
      </section>

      {/* Content Details */}
      <section className="pd-grid">
        <div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '1.5rem' }}>The Stack</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {project.tech.map((tech, i) => (
              <span key={i} style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.85rem', color: 'var(--light-ink)', wordBreak: 'break-word' }}><span style={{ color: 'var(--gold)', marginRight: '0.5rem' }}>✦</span>{tech}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '4rem', wordWrap: 'break-word' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 8vw, 2.5rem)', color: 'var(--ink)', marginBottom: '1.5rem' }}>The Problem</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--light-ink)', fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', fontWeight: '300' }}>{project.problem}</p>
          </div>

          <div style={{ marginBottom: '4rem', wordWrap: 'break-word' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 8vw, 2.5rem)', color: 'var(--ink)', marginBottom: '1.5rem' }}>The Solution</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--light-ink)', fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', fontWeight: '300' }}>{project.solution}</p>
          </div>

          <div style={{ marginBottom: '4rem', wordWrap: 'break-word' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 8vw, 2.5rem)', color: 'var(--ink)', marginBottom: '1.5rem' }}>Key Features</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {project.features.map((feature, i) => (
                <li key={i} style={{ lineHeight: '1.8', color: 'var(--light-ink)', fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', fontWeight: '300', marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--gold)', borderRadius: '50%', flexShrink: 0, marginTop: '9px' }}></div>
                  <span style={{flex: 1}}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '4rem', wordWrap: 'break-word' }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 8vw, 2.5rem)', color: 'var(--ink)', marginBottom: '1.5rem' }}>The Outcome</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--light-ink)', fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', fontWeight: '300' }}>{project.outcome}</p>
          </div>
        </div>
      </section>

      <div className="pd-nav-bot">
        <Link to="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}><span>← Back to Portfolio</span></Link>
        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center', padding: '1rem', border: '1px solid var(--light-ink)' }}>View Live App ↗</a>
        ) : project.github ? (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center', padding: '1rem', border: '1px solid var(--light-ink)' }}>View GitHub Repo ↗</a>
        ) : null}
      </div>
    </>
  );
}

export default ProjectDetails;
