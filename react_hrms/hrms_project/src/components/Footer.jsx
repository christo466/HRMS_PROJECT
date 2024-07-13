import './Footer.css'; 

function Footer() {
  return (
    
      <div className="footer-content">
        <p>&copy; 2024 Mind Hive. All rights reserved.</p>
        <nav>
          <ul className="footer-nav">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </nav>
      </div>
   
  );
}

export default Footer;