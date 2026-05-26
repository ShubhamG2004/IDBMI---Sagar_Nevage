import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { listCourses, createCourse, deleteCourse, updateCourse } from '../lib/courses';
import { listInquiries } from '../lib/inquiries';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setError('');
    listCourses()
      .then((items) => {
        setCourses(items);
      })
      .catch((e) => setError(e.message));
  };

  const loadInquiries = () => {
    setInquiriesLoading(true);
    listInquiries()
      .then(setInquiries)
      .catch((e) => setError(e.message))
      .finally(() => setInquiriesLoading(false));
  };

  useEffect(load, []);
  useEffect(loadInquiries, []);

  const handleAdd = async (ev) => {
    ev.preventDefault();
    const v = (name || '').trim();
    if (!v) return;
    setLoading(true);
    try {
      await createCourse(v);
      setName('');
      load();
    } catch (e) {
      setError(e.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete');
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditingName(c.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (id) => {
    const v = (editingName || '').trim();
    if (!v) return;
    setSaving(true);
    try {
      await updateCourse(id, v);
      cancelEdit();
      load();
    } catch (e) {
      setError(e.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const inquiryCounts = useMemo(() => {
    const counts = new Map();
    inquiries.forEach((item) => {
      counts.set(item.course_name, (counts.get(item.course_name) || 0) + 1);
    });
    return counts;
  }, [inquiries]);

  return (
    <>
      <TopBar />
      <main className="courses-page container">
        <section className="courses-header">
          <div>
            <p>Course Dashboard</p>
            <h1>Manage Courses</h1>
          </div>
          <form onSubmit={handleAdd} className="course-add-form">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New course name" />
            <button type="submit" className="add-course-button" disabled={loading}>{loading ? 'Adding...' : 'Add Course'}</button>
          </form>
        </section>

        {error && <div className="page-error">{error}</div>}

        <section className="course-card-grid" aria-label="Courses">
          {courses.length > 0 ? (
            courses.map((c) => (
              <article
                className="course-tile"
                key={c.id}
                onClick={() => navigate(`/courses/${encodeURIComponent(c.name)}/inquiries`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    navigate(`/courses/${encodeURIComponent(c.name)}/inquiries`);
                  }
                }}
              >
                <div className="course-tile-main">
                  {editingId === c.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onClick={(event) => event.stopPropagation()}
                    />
                  ) : (
                    <h2>{c.name}</h2>
                  )}
                  <p>{inquiryCounts.get(c.name) || 0} inquiries</p>
                </div>
                <div className="course-tile-actions">
                  {editingId === c.id ? (
                    <>
                      <button
                        className="add-course-button"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          saveEdit(c.id);
                        }}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="add-course-cancel"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          cancelEdit();
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="add-course-button"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          startEdit(c);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(c.id);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="empty-card">No courses found.</div>
          )}
        </section>
        {inquiriesLoading && <div className="page-status">Loading inquiry counts...</div>}
      </main>
    </>
  );
}
