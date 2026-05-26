import { Link } from 'react-router-dom';
import idemiLogo from '../../img/idemi.jpeg';

const services = [
  'Calibration and Testing',
  'Design & Manufacturing of Mechanical Tools',
  'Technical Training',
  'Manufacturing of Mechanical Components',
  'Technical Consultancy',
  'Industry Sponsored Projects',
];

export default function HomePage() {
  return (
    <main className="home-page">
      <header className="home-nav container">
        <Link to="/" className="home-brand" aria-label="IDEMI home">
          <img src={idemiLogo} alt="IDEMI logo" />
          <span>IDEMI</span>
        </Link>
        <Link to="/login" className="home-login-button">Login</Link>
      </header>

      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="home-kicker">Government of India Society, established 1968</p>
            <h1 className="home-title">IDEMI - We Build MSME's</h1>
            <p className="home-lead">
              IDEMI is an Organization established by the Government Of India Society in the year 1968 as a
              service to Industry Organisation. The main objective of setting up this Institute was to gear
              up the growth potential of indigenous industry and hence to meet the ever growing needs of
              the country by augmenting productivity & quality control in industrial sector like Electrical,
              Electronics, Process Control Instrumentation, Mechanical Engineering & Information Technology
              etc. The Institute is looked upon a nodal centre in view of its multifarious activities
              offered to suit various needs of industry.
            </p>
            <div className="home-actions">
              <Link to="/login" className="primary-link">Login to Portal</Link>
              <a href="#services" className="secondary-link">Explore Services</a>
            </div>
          </div>

          <div className="home-logo-panel" aria-label="IDEMI institute overview">
            <img src={idemiLogo} alt="IDEMI logo" />
            <div>
              <span>Since</span>
              <strong>1968</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-about">
        <div className="container home-about-grid">
          <div>
            <h2>IDEMI - We Build MSME's</h2>
            <p>
              IDEMI is an Organization established by the Government Of India Society in the year 1968 as a
              service to Industry Organisation. The main objective of setting up this Institute was to gear
              up the growth potential of indigenous industry and hence to meet the ever growing needs of
              the country by augmenting productivity & quality control in industrial sector like Electrical,
              Electronics, Process Control Instrumentation, Mechanical Engineering & Information Technology
              etc.
            </p>
          </div>
          <div className="home-highlight">
            The Institute is looked upon a nodal centre in view of its multifarious activities offered to
            suit various needs of industry.
          </div>
        </div>
      </section>

      <section className="home-services container" id="services">
        <div className="section-heading">
          <p>Capabilities</p>
          <h2>Services for industry growth</h2>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service}>{service}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
