import { categories, emptyInquiry, references } from '../lib/inquiries';
import { useState, useEffect } from 'react';
import { listCourses } from '../lib/courses';

export default function InquiryForm({ initialValue = emptyInquiry, mode = 'create', onSubmit, loading }) {
  const form = { ...emptyInquiry, ...initialValue };

  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(form.course_name || '');

  useEffect(() => {
    let mounted = true;
    listCourses()
      .then((data) => {
        if (!mounted) return;
        if (data && data.length) {
          const names = data.map((c) => c.name);
          setCourseOptions(names);
          setSelectedCourse(form.course_name || names[0] || '');
        } else {
          // fallback to built-in default if DB empty
          setCourseOptions(['AutoCAD']);
          setSelectedCourse(form.course_name || 'AutoCAD');
        }
      })
      .catch(() => {
        if (!mounted) return;
        setCourseOptions(['AutoCAD']);
        setSelectedCourse(form.course_name || 'AutoCAD');
      });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnrollment = (event) => {
    const value = event.target.value.slice(0, 9);
    event.target.value = value;
    const officeInput = event.currentTarget.form.elements.office_enrollment_number;
    if (officeInput) officeInput.value = value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    onSubmit(data);
  };

  const otherVisible = form.reference === 'Others';
  const receiptVisible = form.confirm === 'yes';

  return (
    <div className="entry-form-container">
      <div className="entry-header">
        <h2>{mode === 'edit' ? 'UPDATE FORM' : 'INQUIRY FORM'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="entry-form-group">
          <label htmlFor="enrollment_number">Enrollment-Cum-Batch Number:</label>
          <input id="enrollment_number" name="enrollment_number" className="small-input" defaultValue={form.enrollment_number} onInput={handleEnrollment} maxLength="9" />
        </div>

        <div className="entry-form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" defaultValue={form.date || ''} required />
        </div>

        <div className="entry-form-group">
          <label htmlFor="name">Name:</label>
          <input id="name" name="name" defaultValue={form.name} required />
        </div>

        <div className="entry-form-group">
          <label htmlFor="qualification">Qualification:</label>
          <input id="qualification" name="qualification" defaultValue={form.qualification} />
        </div>

        <div className="entry-form-group">
          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" defaultValue={form.address} />
        </div>

        <div className="entry-form-group entry-options">
          <label>Category:</label>
          {categories.map((category) => (
            <label key={category}>
              <input type="radio" name="category" value={category} defaultChecked={form.category === category} /> {category}
            </label>
          ))}
        </div>

        <div className="entry-form-group">
          <label htmlFor="contact_mobile">Contact No. (M):</label>
          <input id="contact_mobile" name="contact_mobile" defaultValue={form.contact_mobile} pattern="\d{10}" required />
          <label htmlFor="contact_home" className="short-label">(H):</label>
          <input id="contact_home" name="contact_home" defaultValue={form.contact_home} pattern="\d{10}" />
        </div>

        <div className="entry-form-group">
          <label htmlFor="email">E-mail:</label>
          <input type="email" id="email" name="email" defaultValue={form.email} />
        </div>

        <div className="entry-form-group entry-course-group">
          <label htmlFor="course_name">Course Name:</label>
          <select id="course_name" name="course_name" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            {courseOptions.map((course) => <option key={course} value={course}>{course}</option>)}
          </select>
        </div>

        <ReferenceFields form={form} otherVisible={otherVisible} />

        <AdmissionFields form={form} receiptVisible={receiptVisible} />

        <div className="entry-office-use">
          <h3>FOR OFFICE USE ONLY</h3>
          <div className="entry-form-group">
            <label htmlFor="office_enrollment_number">Enrollment-Cum-Batch Number:</label>
            <input id="office_enrollment_number" name="office_enrollment_number" className="small-input" defaultValue={form.office_enrollment_number || form.enrollment_number} readOnly />
          </div>

          <div className="entry-form-gr1">
            <label className="strong-label">Short Comments</label>
            <div className="entry-comment-topics">
              <input id="short_topic1" name="short_topic1" placeholder="Topic 1" defaultValue={form.short_topic1} />
              <textarea id="short_comments1" name="short_comments1" placeholder="Comments" defaultValue={form.short_comments1} />
            </div>
            <div className="entry-comment-topics">
              <input id="short_topic2" name="short_topic2" placeholder="Topic 2" defaultValue={form.short_topic2} />
              <textarea id="short_comments2" name="short_comments2" placeholder="Comments" defaultValue={form.short_comments2} />
            </div>
          </div>

          <div className="entry-form-group">
            <label htmlFor="batch_timing">Batch Timing:</label>
            <input id="batch_timing" name="batch_timing" defaultValue={form.batch_timing} />
          </div>

          <div className="entry-form-group">
            <label htmlFor="course_fees">Course Fees:</label>
            <input id="course_fees" name="course_fees" defaultValue={form.course_fees} />
          </div>

          <div className="entry-form-group">
            <label htmlFor="application_fees">Application Fees:</label>
            <input id="application_fees" name="application_fees" defaultValue={form.application_fees} />
          </div>
        </div>

        <div className="entry-submit-row">
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
}

function ReferenceFields({ form, otherVisible }) {
  return (
    <>
      <div className="entry-form-group entry-options">
        <label>Reference:</label>
        {references.map((reference) => (
          <label key={reference}>
            <input type="radio" name="reference" value={reference} defaultChecked={form.reference === reference} onChange={(event) => {
              const other = event.currentTarget.form.querySelector('#other_reference_container');
              if (other) other.style.display = event.currentTarget.value === 'Others' ? 'flex' : 'none';
            }} /> {reference}
          </label>
        ))}
      </div>
      <div id="other_reference_container" className="entry-form-group" style={{ display: otherVisible ? 'flex' : 'none' }}>
        <label htmlFor="other_reference">Please specify:</label>
        <input id="other_reference" name="other_reference" defaultValue={form.other_reference} />
      </div>
    </>
  );
}

function AdmissionFields({ form, receiptVisible }) {
  return (
    <>
      <div className="entry-form-group">
        <label htmlFor="confirm">Admission Status:</label>
        <select id="confirm" name="confirm" defaultValue={form.confirm} onChange={(event) => {
          const receipt = event.currentTarget.form.querySelector('#receipt_number_container');
          if (receipt) receipt.style.display = event.currentTarget.value === 'yes' ? 'flex' : 'none';
        }}>
          <option value="yes">confirmed</option>
          <option value="no">Not-confirmed</option>
        </select>
      </div>
      <div id="receipt_number_container" className="entry-form-group" style={{ display: receiptVisible ? 'flex' : 'none' }}>
        <label htmlFor="receipt_number">Receipt Number:</label>
        <input id="receipt_number" name="receipt_number" defaultValue={form.receipt_number} />
      </div>
    </>
  );
}
