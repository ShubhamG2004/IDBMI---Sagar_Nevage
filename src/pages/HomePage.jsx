import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="container">
      <section className="home-hero card" style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 420px' }}>
            <h1 className="home-title">IDEMI — We Build MSMEs</h1>
            <p className="home-lead">
              IDEMI is an Organization established by the Government Of India Society in the year 1968 as a
              service to Industry. The Institute's main objective is to harness the growth potential of
              indigenous industry by augmenting productivity and quality control across Electrical,
              Electronics, Process Control Instrumentation, Mechanical Engineering and Information
              Technology sectors.
            </p>

            <p className="home-cta">
              As a nodal centre, IDEMI offers a wide range of services tailored to industry needs. Explore
              our inquiry forms or view available courses to get started.
            </p>

            <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/inquiries/new" className="primary-link">New Inquiry</Link>
              <Link to="/courses" className="primary-link">View Courses</Link>
            </div>
          </div>

          <div style={{ flex: '0 0 320px' }}>
            <div className="home-card" aria-hidden>
              <strong>Established</strong>
              <div>1968</div>
              <hr />
              <strong>Focus</strong>
              <div>Productivity • Quality • Training</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-services" style={{ marginTop: 20 }}>
        <h2 className="entry-header">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">Calibration and Testing</div>
          <div className="service-card">Design &amp; Manufacturing of Mechanical Tools</div>
          <div className="service-card">Technical Training</div>
          <div className="service-card">Manufacturing of Mechanical Components</div>
          <div className="service-card">Technical Consultancy</div>
          <div className="service-card">Industry Sponsored Projects</div>
        </div>
      </section>
    </main>
  );
}
