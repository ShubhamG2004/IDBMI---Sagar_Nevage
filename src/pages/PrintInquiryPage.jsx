import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categories, getInquiry } from '../lib/inquiries';

const blocks = (value = '') => Array.from({ length: 9 }, (_, index) => value[index] || '');

export default function PrintInquiryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getInquiry(id).then(setRow).catch((fetchError) => setError(fetchError.message));
  }, [id]);

  if (error) return <div className="page-error">{error}</div>;
  if (!row) return <div className="page-status">Loading...</div>;

  return (
    <>
      <button className="print-page" onClick={() => window.print()}>Print Page</button>
      <button className="dis-page" onClick={() => navigate('/inquiries')}>All Student</button>

      <div className="form-container">
        <p style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold' }}>INSTITUTE FOR DESIGN OF ELECTRICAL MEASURING INSTRUMENTS</p>
        <div className="form-header-container">
          <div className="form-header">
            <p>Mumbai - 22</p>
            <h4 style={{ marginTop: 10 }}>MSME - Technology Center</h4>
          </div>
          <div className="document-details">
            <p>Document ID: TRG:FF:01</p>
            <p>Effective Date: 01/12/2016</p>
            <p>Revision Status: 00</p>
          </div>
        </div>
        <h3 style={{ textAlign: 'center', marginTop: -20 }}>INQUIRY FORM</h3>
        <hr />

        <div className="form-section">
          <div className="form-row">
            <label>Enrollment-Cum-Batch Number:</label>
            <div className="data enrollment-blocks no-border-bottom">
              {blocks(row.enrollment_number).map((digit, index) => <div className="enrollment-block" key={index}>{digit}</div>)}
              <div className="confirm-checkbox">{row.confirm === 'yes' ? <span className="checkmark">✓</span> : null}</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-row-reverse">
            <label>Date:</label>
            <div className="data">{row.date || ''}</div>
          </div>
        </div>

        <div className="form-section">
          <Line label="Name:" value={row.name} />
          <Line label="Qualification:" value={row.qualification} />
          <Line label="Address:" value={row.address} />
        </div>

        <div className="form-section">
          <div className="form-row">
            <label style={{ display: 'inline-block', marginRight: 15 }}>Category:</label>
            <div className="data" style={{ display: 'inline', borderBottom: 'none' }}>
              {categories.map((category) => (
                <label key={category} style={{ marginRight: 15 }}>
                  <input type="checkbox" checked={row.category === category} readOnly /> {category}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row-left-right">
            <Line label="Contact No (M):" value={row.contact_mobile} />
            <Line label="(H):" value={row.contact_home} />
          </div>

          <Line label="E-mail:" value={row.email} />
          <Line label="Course Name:" value={row.course_name} />

          <div className="form-row">
            <label>Reference:</label>
            <div className="data" style={{ display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
              {['Student friend', 'Newspaper Adv.'].map((reference) => (
                <label key={reference} style={{ marginRight: 15 }}>
                  <input type="checkbox" checked={row.reference === reference} readOnly /> {reference}
                </label>
              ))}
              <label style={{ marginRight: 10 }}>
                <input type="checkbox" checked={Boolean(row.other_reference)} readOnly />{' '}
                <span style={{ display: 'inline-block', position: 'relative', paddingLeft: 0 }}>
                  {row.other_reference || ''}
                  <span style={{ position: 'absolute', left: -10, bottom: 0, width: 'calc(100% + 100px)', borderBottom: '1px solid black', display: 'block' }} />
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="signature" style={{ marginTop: -10 }}>
          <label>Signature:</label> _________________________
        </div>
        <hr />
        <div className="form-footer">
          <h3 style={{ textAlign: 'center' }}>FOR OFFICE USE ONLY</h3>
          <br />
        </div>

        <div className="form-section">
          <div className="form-row">
            <label>Enrollment-Cum-Batch Number:</label>
            <div className="data enrollment-blocks no-border-bottom">
              {blocks(row.office_enrollment_number).map((digit, index) => <div className="enrollment-block" key={index}>{digit}</div>)}
            </div>
          </div>
          <label>Short Comments:</label>
          <div className="form-row">
            <table>
              <tbody>
                <tr>
                  <td style={{ width: 20 }}>1.</td>
                  <td style={{ width: 200 }}>{row.short_topic1 || ''}</td>
                  <td>{row.short_comments1 || ''}</td>
                </tr>
                <tr>
                  <td style={{ width: 20 }}>2.</td>
                  <td style={{ width: 200 }}>{row.short_topic2 || ''}</td>
                  <td>{row.short_comments2 || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Line label="Batch Timing:" value={row.batch_timing} />
        </div>

        <div>
          <div className="form-row-left-right">
            <Line label="Course Fees:" value={row.course_fees} dataClassName="course-fees-data" />
            <Line label="Application and Examination Fees:" value={row.application_fees} />
          </div>
          <div className="c-signature">
            <label>Counselor&apos;s Signature:</label> _________________________
          </div>
        </div>
      </div>
    </>
  );
}

function Line({ label, value, dataClassName = '' }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      <div className={`data ${dataClassName}`}>{value || ''}</div>
    </div>
  );
}
