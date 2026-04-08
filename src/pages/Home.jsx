import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  useEffect(() => {
    // Remove loader pointer block
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.style.pointerEvents = 'none';
      }, 2800);
    }

    // Scroll reveal observer
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => observer.observe(r));

    return () => {
      reveals.forEach(r => observer.unobserve(r));
    };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || 'Not provided';
    const email = formData.get('email') || 'Not provided';
    const projectType = formData.get('projectType') || 'General Inquiry';
    const message = formData.get('message') || '';

    const subject = encodeURIComponent(`Portfolio Inquiry: ${projectType} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject Details:\n${message}`);

    window.location.href = `mailto:mgmt.jaiofficial@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* LOADER */}
      <div id="loader">
        <div className="logo-load">
          <span style={{ animationDelay: '0.1s' }}>J</span>
          <span style={{ animationDelay: '0.2s' }}>A</span>
          <span style={{ animationDelay: '0.3s' }}>I</span>
          <span style={{ animationDelay: '0.4s' }}>K</span>
          <span style={{ animationDelay: '0.5s' }}>I</span>
          <span style={{ animationDelay: '0.6s' }}>S</span>
          <span style={{ animationDelay: '0.7s' }}>A</span>
          <span style={{ animationDelay: '0.8s' }}>N</span>
        </div>
        <div className="line-progress"></div>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <p className="hero-eyebrow">Full-Stack Developer</p>
          <h1 className="hero-title">Building<br /><em>Scalable</em><br />Solutions.</h1>
          <p className="hero-desc">I engineer full-stack applications that connect robust backends with seamless user experiences — turning complex problems into elegant code.</p>
          <div className="hero-cta">
            <a href="#work" className="btn-primary"><span>View My Work</span> <span>→</span></a>
            <a href="#contact" className="btn-secondary">Let's Talk</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-wrap"></div>
          <div className="hero-image-placeholder">
            <div className="hero-decor-num">01</div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line"></div>
          Scroll
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex' }}>
              <div className="marquee-item">Frontend Development <span className="marquee-dot">✦</span></div>
              <div className="marquee-item">Backend Architecture <span className="marquee-dot">✦</span></div>
              <div className="marquee-item">RESTful APIs <span className="marquee-dot">✦</span></div>
              <div className="marquee-item">Database Design <span className="marquee-dot">✦</span></div>
              <div className="marquee-item">React & Node.js <span className="marquee-dot">✦</span></div>
              <div className="marquee-item">Deployment & DevOps <span className="marquee-dot">✦</span></div>
              <div className="marquee-item">System Architecture <span className="marquee-dot">✦</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-left reveal">
          <div className="about-img-frame"></div>
          <div className="about-img-accent"></div>
          <div className="about-stats">
            <div className="about-stats-num">4+</div>
            <div className="about-stats-label">Years of Experience</div>
          </div>
        </div>
        <div className="about-right reveal">
          <p className="section-tag">About Me</p>
          <h2 className="section-title">Designing With Purpose & Passion</h2>
          <p className="about-body">I'm a passionate Full-Stack Developer based in India, blending logical architecture with intuitive interfaces to build applications that scale. With over 4+ years of experience, I've architected robust backends, crafted dynamic frontends, and shipped products that prioritize performance and user experience.</p>
          <p className="about-body">My process is rooted in problem-solving. I focus on understanding the core functionality first — then build solutions that are maintainable and fast.</p>
          <div className="skills-list">
            <div className="skill-item">React / Next.js</div>
            <div className="skill-item">Node.js / Express</div>
            <div className="skill-item">MongoDB / SQL</div>
            <div className="skill-item">API Development</div>
            <div className="skill-item">JavaScript / TypeScript</div>
            <div className="skill-item">System Architecture</div>
            <div className="skill-item">TailwindCSS</div>
            <div className="skill-item">Git & Deployment</div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="work" id="work">
        <div className="work-header reveal">
          <div>
            <p className="section-tag" style={{ color: 'var(--gold)' }}>Selected Projects</p>
            <h2 className="section-title" style={{ color: 'var(--cream)' }}>Recent<br />Work.</h2>
          </div>
          <div className="work-count">04</div>
        </div>
        <div className="projects-grid">
          {[
            { id: 'poppins', cat: 'Ecom Platform', title: 'Poppins', year: '2026', image: 'url(/Gemini_Generated_Image_b8t7mrb8t7mrb8t7.png) center/contain no-repeat' },
            { id: 'smartattend', cat: 'A smart attendance tracker for college', title: 'smartAttend', year: '2026', image: 'url(/Gemini_Generated_Image_hie5buhie5buhie5.png) center/contain no-repeat' },
            { id: 'shadowchat', cat: 'Anonymous Chatting App', title: 'shadowchat', year: '2025', image: 'url(/Gemini_Generated_Image_iqmwaxiqmwaxiqmw.png) center/contain no-repeat' },
            { id: 'pairon', cat: 'A Collaborative Platform for developers', title: 'PairOn', year: '2026', image: 'url(/Gemini_Generated_Image_wtqtfywtqtfywtqt.png) center/contain no-repeat' },
          ].map((proj, idx) => (
            <div className="project-card reveal" key={idx}>
              <div
                className="project-img"
                style={proj.image ? { background: proj.image } : {}}
              >
                <div className="project-img-label">{proj.image ? '' : 'PROJECT IMAGE'}</div>
                <div className="project-overlay">
                  <Link to={`/project/${proj.id}`} className="project-overlay-link">View Project →</Link>
                </div>
              </div>
              <div className="project-info">
                <p className="project-category">{proj.cat}</p>
                <h3 className="project-name">{proj.title}</h3>
                <p className="project-year">{proj.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="services-header reveal">
          <div>
            <p className="section-tag">What I Offer</p>
            <h2 className="section-title">Services Built<br />Around You.</h2>
          </div>
          <p className="services-intro">Every project starts with listening. I collaborate closely with clients to understand their vision, their audience, and their goals — then bring the right combination of skills to the table.</p>
        </div>
        <div className="services-grid reveal">
          {[
            { num: '01', name: 'Full-Stack Development', desc: "End-to-end web applications built with modern frameworks. From responsive frontends to scalable backend architectures and secure databases." },
            { num: '02', name: 'API Design & Integration', desc: "Restful and GraphQL APIs designed for speed and reliability, enabling seamless communication between services and third-party platforms." },
            { num: '03', name: 'Database Architecture', desc: "Designing structured and unstructured data models that prioritize fast queries, high availability, and future scalability." },
          ].map((srv, idx) => (
            <div className="service-card" key={idx}>
              <div className="service-num">{srv.num}</div>
              <h3 className="service-name">{srv.name}</h3>
              <p className="service-desc">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testimonial-left reveal">
          <p className="section-tag">Kind Words</p>
          <h2 className="section-title">What Clients Say.</h2>
        </div>
        <div className="testimonial-cards reveal">
          <div className="testimonial-card">
            <p className="testimonial-quote">"Working with Jaikisan was transformative for our brand. The attention to detail, the strategic thinking, and the pure creative output was beyond anything we expected. Our revenue grew 40% after the rebrand."</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <div className="testimonial-name">Sarah Chen</div>
                <div className="testimonial-role">CEO, Aurelia Beauty Co.</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">"Jaikisan doesn't just design — they think. From our first conversation, it was clear we were working with someone who genuinely cares about the problem, not just the deliverable."</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{ background: 'linear-gradient(135deg, var(--sage), #2A5A3A)' }}></div>
              <div>
                <div className="testimonial-name">Marcus Reid</div>
                <div className="testimonial-role">Founder, Verdant Finance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-left reveal">
          <h2 className="contact-title">Let's Create<br /><em>Something</em><br />Together.</h2>
          <p className="contact-subtitle">Open for new projects, collaborations, and creative adventures. Let's make something worth talking about.</p>
          <div className="contact-links">
            <a href="mailto:mgmt.jaiofficial@gmail.com" className="contact-link">✉ mgmt.jaiofficial@gmail.com</a>
            <a href="https://instagram.com/whotfisjaii" target="_blank" rel="noopener noreferrer" className="contact-link">⟶ Instagram @whotfisjaii</a>
            <a href="https://www.linkedin.com/in/jaikisan-jegadeesan/" target="_blank" rel="noopener noreferrer" className="contact-link">⟶ LinkedIn /in/jaikisan-jegadeesan</a>
          </div>
        </div>
        <div className="contact-right reveal">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" name="name" className="form-input" placeholder="Jane Smith" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="jane@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Project Type</label>
              <input type="text" name="projectType" className="form-input" placeholder="Brand identity, Web design..." />
            </div>
            <div className="form-group">
              <label className="form-label">Tell Me About Your Project</label>
              <textarea name="message" className="form-input" placeholder="Give me a brief overview..." required></textarea>
            </div>
            <button type="submit" className="form-submit">Send Message →</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="footer-logo">Jaikisan Jegadeesan</a>
        <span>© 2026 — All Rights Reserved</span>
        <span>Designed with ♥</span>
      </footer>
    </>
  );
}

export default Home;
