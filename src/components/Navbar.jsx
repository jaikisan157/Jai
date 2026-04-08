import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 80) { // Scrolled down
          setShow(false);
        } else { // Scrolled up
          setShow(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav className={`smart-nav ${show ? '' : 'hidden'}`}>
      <Link to="/" className="nav-logo">Jaikisan Jegadeesan</Link>
      <ul className="nav-links">
        <li><a href="/#work">Work</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
