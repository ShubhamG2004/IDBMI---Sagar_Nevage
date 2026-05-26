import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { deleteInquiry, listInquiries } from '../lib/inquiries';

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

export default function InquiryListPage() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    listInquiries()
      .then(setInquiries)
      .catch((listError) => setError(listError.message));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const term = search.trim().toUpperCase();
    if (!term) return inquiries;
    return inquiries.filter((item) =>
      `${item.name || ''} ${item.enrollment_number || ''}`.toUpperCase().includes(term),
    );
  }, [inquiries, search]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteInquiry(id);
      load();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <>
      <TopBar />
      <main className="list-card">
        <h2>Inquiry Form Data</h2>
        {error && <div className="page-error">{error}</div>}
        <div className="list-actions">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by Name or Enrollment Number"
          />
          <button type="button" className="export-button" onClick={() => {
            if (!filtered || filtered.length === 0) { alert('No records to export.'); return; }
            const headers = columns.map(([, label]) => label);
            const escape = (v) => {
              if (v === null || v === undefined) return '';
              const s = String(v);
              return '"' + s.replace(/"/g, '""') + '"';
            };
            const rows = filtered.map((row) => columns.map(([key]) => escape(row[key])));
            const csv = [headers.map(h => '"' + String(h).replace(/"/g, '""') + '"').join(','), ...rows.map(r => r.join(','))].join('\r\n');
            const bom = '\uFEFF';
            const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'inquiries.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}>Export CSV</button>
          <Link className="primary-link" to="/inquiries/new">New Form</Link>
        </div>

        {filtered.length > 0 ? (
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
                      <button type="button" className="delete-button" onClick={() => handleDelete(row.id)}>Delete</button>
                    </div>
                  </td>
                  {columns.map(([key]) => <td key={key}>{row[key] || ''}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found.</p>
        )}
      </main>
    </>
  );
}
