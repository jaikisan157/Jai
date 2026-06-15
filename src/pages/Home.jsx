import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const EMAIL_ADDRESS = 'jaikisanjegadeesan02@gmail.com';
const INSTAGRAM_USERNAME = 'whotfisjaii';

const JAIKISAN_PERSONA = `
You are Jaikisan Jegadeesan, a Full-Stack Developer based in Kuwait. You are chatting in real-time with a visitor on your portfolio website.

Your background:
- Experience: 4+ years of experience in system architecture, backend architecture, and frontend design.
- Skills: React, Next.js, Node.js, Express, MongoDB, SQL, API Development, JavaScript, TypeScript, TailwindCSS, Git & Deployment.
- Projects you built:
  1. Poppins: An elegant E-commerce Platform built with modern web tech.
  2. smartAttend: A smart college attendance tracker designed to streamline college check-ins.
  3. shadowchat: An anonymous chatting application focusing on privacy and real-time sockets.
  4. PairOn: A collaborative platform for developers to code and pair program together.
- Services you offer: Full-Stack Development, API Design & Integration, Database Architecture.

Your personality:
- Keep replies short, conversational, and friendly (1-3 sentences maximum).
- Do not use markdown headers or bulleted lists unless requested.
- Sound like a helpful developer, open to chat about freelancing, job opportunities, or system architecture.
- If they want to contact you formally, tell them they can click the "Send via Gmail" button appearing under the chat to send the transcript.
`;

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

  // Chat State Management
  const [chatMessages, setChatMessages] = useState([
    { id: 'init-1', sender: 'bot', text: 'Hey there! 👋 Welcome to my inbox. What kind of project or idea are you looking to bring to life?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { id: 'init-2', sender: 'bot', text: 'Or just drop a message to say hello!', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('user_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [groqApiKey, setGroqApiKey] = useState(() => {
    return localStorage.getItem('user_groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
  });
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isTyping]);



  const callGemini = async (userMsgText, historyLimit) => {
    const relevantMessages = chatMessages.slice(-historyLimit);
    const formattedHistory = relevantMessages
      .filter(msg => !msg.isActions && msg.sender !== 'sys')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: userMsgText }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedHistory,
          systemInstruction: {
            parts: [{ text: JAIKISAN_PERSONA }]
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const callGroq = async (userMsgText, historyLimit) => {
    const relevantMessages = chatMessages.slice(-historyLimit);
    const messages = [
      { role: "system", content: JAIKISAN_PERSONA },
      ...relevantMessages
        .filter(msg => !msg.isActions && msg.sender !== 'sys')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
      { role: "user", content: userMsgText }
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          messages: messages,
          model: "llama-3.1-8b-instant",
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsgText = inputValue.trim();
    setInputValue('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' } : m));
    }, 600);
    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'read' } : m));
    }, 1200);

    setIsTyping(true);

    let botResponseText = "";
    let providerUsed = "";

    // 1. Try Gemini first
    if (apiKey) {
      try {
        botResponseText = await callGemini(userMsgText, 8);
        providerUsed = "Gemini AI";
      } catch (geminiError) {
        console.warn("Gemini API call failed, trying Groq fallback... Error: ", geminiError);
      }
    }

    // 2. Try Groq as fallback
    if (!botResponseText && groqApiKey) {
      try {
        botResponseText = await callGroq(userMsgText, 8);
        providerUsed = "Groq AI";
      } catch (groqError) {
        console.error("Groq Fallback API call also failed. Error: ", groqError);
      }
    }

    setIsTyping(false);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (botResponseText) {
      const fullTranscript = [...chatMessages, userMsg, { sender: 'bot', text: botResponseText }]
        .map(m => `${m.sender === 'user' ? 'Visitor' : 'Jaikisan'}: ${m.text}`)
        .join('\n\n');
        
      const mailSubject = encodeURIComponent('Portfolio Chat Transcript');
      const mailBody = encodeURIComponent(`Hello Jaikisan,\n\nHere is our chat transcript from your portfolio site:\n\n${fullTranscript}`);

      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponseText,
          timestamp: now
        },
        {
          id: `bot-actions-${Date.now()}`,
          sender: 'bot',
          isActions: true,
          mailSubject: mailSubject,
          mailBody: mailBody,
          fullText: fullTranscript,
          text: 'Need to get in touch formally? Send this transcript to my email:',
          timestamp: now
        }
      ]);
    } else {
      const mailSubject = encodeURIComponent(`Portfolio Contact Inquiry`);
      const mailBody = encodeURIComponent(`Hello Jaikisan,\n\nI visited your portfolio and wanted to connect.\n\nMessage:\n${userMsgText}`);
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-missing-key-${Date.now()}`,
          sender: 'bot',
          text: "Hello! My AI clone is currently offline. In the meantime, feel free to email me your message directly using the options below!",
          timestamp: now
        },
        {
          id: `bot-actions-${Date.now()}`,
          sender: 'bot',
          isActions: true,
          mailSubject: mailSubject,
          mailBody: mailBody,
          fullText: `Message:\n${userMsgText}`,
          text: 'Choose an option to send:',
          timestamp: now
        }
      ]);
    }
  };

  const handleCopyMessage = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Failed to copy text using clipboard API: ', err);
          fallbackCopyTextToClipboard(text);
        });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Fallback: Copying text command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleResetChat = () => {
    setChatMessages([
      { id: 'init-1', sender: 'bot', text: 'Hey there! 👋 Welcome to my inbox. What kind of project or idea are you looking to bring to life?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 'init-2', sender: 'bot', text: 'Or just drop a message to say hello!', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setStep(0);
    setProjectDetails('');
    setContactInfo('');
    setInputValue('');
    setIsTyping(false);
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
          <p className="about-body">I'm a passionate Full-Stack Developer based in Kuwait, blending logical architecture with intuitive interfaces to build applications that scale. With over 4+ years of experience, I've architected robust backends, crafted dynamic frontends, and shipped products that prioritize performance and user experience.</p>
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
            <a href={`mailto:${EMAIL_ADDRESS}`} className="contact-link">✉ {EMAIL_ADDRESS}</a>
            <a href={`https://instagram.com/${INSTAGRAM_USERNAME}`} target="_blank" rel="noopener noreferrer" className="contact-link">⟶ Instagram @{INSTAGRAM_USERNAME}</a>
            <a href="https://www.linkedin.com/in/jaikisan-jegadeesan/" target="_blank" rel="noopener noreferrer" className="contact-link">⟶ LinkedIn /in/jaikisan-jegadeesan</a>
          </div>
        </div>
        <div className="contact-right reveal">
          <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar-wrap">
                  <div className="chat-avatar">J</div>
                  <div className="chat-online-badge"></div>
                </div>
                <div className="chat-user-details">
                  <span className="chat-user-name">Jaikisan Jegadeesan</span>
                  <span className="chat-user-status">Active now</span>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-reset-btn" onClick={handleResetChat} title="Reset Chat">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>



            {/* Chat Body */}
            <div className="chat-body" ref={chatBodyRef}>
              {chatMessages.map((msg) => {
                if (msg.isActions) {
                  return (
                    <div key={msg.id} className="message-bubble bot actions-bubble">
                      <p className="msg-text">{msg.text}</p>
                      <div className="chat-actions">
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}&su=${msg.mailSubject}&body=${msg.mailBody}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-chat-action btn-email"
                        >
                          ✉️ Send via Gmail (Web)
                        </a>
                        <button 
                          onClick={() => handleCopyMessage(msg.fullText)} 
                          className={`btn-chat-action btn-copy ${copied ? 'copied' : ''}`}
                        >
                          {copied ? '✅ Copied!' : '📋 Copy Details'}
                        </button>
                        <a 
                          href={`https://ig.me/m/${INSTAGRAM_USERNAME}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-chat-action btn-instagram"
                        >
                          📸 Instagram DM
                        </a>
                      </div>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                  );
                }

                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
                    <p className="msg-text">{msg.text}</p>
                    <div className="message-meta">
                      <span className="message-time">{msg.timestamp}</span>
                      {!isBot && (
                        <span className={`message-status ${msg.status || 'read'}`}>
                          {msg.status === 'sending' && '✓'}
                          {msg.status === 'sent' && '✓'}
                          {msg.status === 'read' && '✓✓'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="message-bubble bot typing-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                disabled={isTyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button 
                type="submit" 
                className="chat-send-btn" 
                disabled={!inputValue.trim() || isTyping}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
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
