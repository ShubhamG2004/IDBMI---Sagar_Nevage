import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

const quickLinks = [
  {
    title: 'All Students',
    text: 'View, search, edit, print, and export inquiry records.',
    to: '/inquiries',
  },
  {
    title: 'New Form',
    text: 'Create a new student inquiry form for IDEMI courses.',
    to: '/inquiries/new',
  },
  {
    title: 'Courses',
    text: 'Manage the course options used inside inquiry forms.',
    to: '/courses',
  },
];

export default function DashboardPage() {
  return (
    <>
      <TopBar />
      <main className="dashboard-page">
        <section className="dashboard-hero container">
          <div className="dashboard-copy">
            <p className="dashboard-welcome">Welcome!!!</p>
            <h1>IDEMI - We Build MSME's</h1>
            <p>
              IDEMI is an Organization established by the Government Of India Society in the year 1968 as a
              service to Industry Organisation. The main objective of setting up this Institute was to gear
              up the growth potential of indigenous industry and hence to meet the ever growing needs of
              the country by augmenting productivity & quality control in industrial sector like Electrical,
              Electronics, Process Control Instrumentation, Mechanical Engineering & Information Technology
              etc. The Institute is looked upon a nodal centre in view of its multifarious activities
              offered to suit various needs of industry.
            </p>
          </div>
        </section>

        <section className="dashboard-links container" aria-label="Portal pages">
          {quickLinks.map((item, index) => (
            <Link
              className="redirect-card"
              style={{ animationDelay: `${index * 120}ms` }}
              to={item.to}
              key={item.title}
            >
              <span>{item.title}</span>
              <p>{item.text}</p>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
