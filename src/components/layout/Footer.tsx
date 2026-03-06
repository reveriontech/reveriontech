import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import '../../styles/layout.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h3>REVERIONTECH</h3>
          <p>
            We craft digital experiences that drive growth. From web development to AI integration,
            we bring your vision to life with clean code and modern design.
          </p>
        </div>

        <div>
          <h4 className="footer__heading">Quick Links</h4>
          <div className="footer__links">
            <Link to="/">Home</Link>
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/auth">Login</Link>
          </div>
        </div>

        <div>
          <h4 className="footer__heading">Contact</h4>
          <div className="footer__contact-item">
            <Icon name="mail" size={16} />
            <span>hello@reveriontech.com</span>
          </div>
          <div className="footer__contact-item">
            <Icon name="phone" size={16} />
            <span>+63 82 282 0645</span>
          </div>
          <div className="footer__contact-item">
            <Icon name="map-pin" size={16} />
            <span>Davao City, Philippines, 8000</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>Poweredby <span>REVERIONTECH</span></p>
      </div>
    </footer>
  );
}
