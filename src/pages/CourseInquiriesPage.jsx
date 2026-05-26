import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { listInquiries } from '../lib/inquiries';

const columns = [
  ['enrollment_number', 'Enrollment Number'],
  ['date', 'Date'],
  ['name', 'Name'],
  ['qualification', 'Qualification'],
  ['address', 'Address'],
  ['category', 'Category'],
  ['contact_mobile', 'Contact Mobile'],
  ['contact_home', 'Contact Home'],
  ['email', 'Email'],
  ['course_name', 'Course Name'],
  ['reference', 'Reference'],
  ['other_reference', 'Other Reference'],
  ['office_enrollment_number', 'Office Enrollment Number'],
  ['short_topic1', 'Short Topic 1'],
  ['short_topic2', 'Short Topic 2'],
  ['short_comments1', 'Short Comments 1'],
  ['short_comments2', 'Short Comments 2'],
  ['batch_timing', 'Batch Timing'],
  ['course_fees', 'Course Fees'],
  ['application_fees', 'Application Fees'],
];

export default function CourseInquiriesPage() {
  const { courseName = '' } = useParams();
  const navigate = useNavigate();
  const selectedCourse = decodeURIComponent(courseName);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    listInquiries()
      .then(setInquiries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => inquiries.filter((item) => item.course_name === selectedCourse),
    [inquiries, selectedCourse],
  );

  const exportCsv = () => {
    if (!filtered.length) {
      alert('No records to export.');
      return;
    }

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      return `"${String(value).replace(/"/g, '""')}"`;
    };

    const headers = columns.map(([, label]) => escapeCsv(label)).join(',');
    const rows = filtered.map((row) => columns.map(([key]) => escapeCsv(row[key])).join(','));
    const csv = `\uFEFF${[headers, ...rows].join('\r\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = selectedCourse.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

    link.href = url;
    link.download = `${fileName || 'course'}-inquiries.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopBar />
      <main className="course-detail-page container">
        <section className="course-detail-header">
          <div>
            <p>Course Forms</p>
            <h1>{selectedCourse}</h1>
            <span>{filtered.length} forms found</span>
          </div>
          <div className="course-detail-actions">
            <Link className="secondary-link" to="/courses">Back to Courses</Link>
            <button className="export-button" type="button" onClick={exportCsv}>Export CSV</button>
            <Link className="primary-link" to="/inquiries/new">New Form</Link>
          </div>
        </section>

        {error && <div className="page-error">{error}</div>}

        <section className="course-inquiries-panel">
          {loading ? (
            <div className="page-status">Loading inquiries...</div>
          ) : filtered.length > 0 ? (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Actions</th>
                  {columns.map(([, label]) => <th key={label}>{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} onDoubleClick={() => navigate(`/inquiries/${row.id}/print`)}>
                    <td>
                      <div className="button-group">
                        <button type="button" className="edit-button" onClick={() => navigate(`/inquiries/${row.id}/edit`)}>Edit</button>
                        <button type="button" className="print-button" onClick={() => navigate(`/inquiries/${row.id}/print`)}>Print</button>
                      </div>
                    </td>
                    {columns.map(([key]) => <td key={key}>{row[key] || ''}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-card">No forms found for this course.</div>
          )}
        </section>
      </main>
    </>
  );
}
