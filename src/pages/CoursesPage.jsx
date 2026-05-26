import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import { listCourses, createCourse, deleteCourse, updateCourse } from '../lib/courses';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    listCourses()
      .then(setCourses)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

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

  return (
    <>
      <TopBar />
      <main className="list-card">
        <h2>Manage Courses</h2>
        {error && <div className="page-error">{error}</div>}
        <form onSubmit={handleAdd} style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New course name" />
          <button type="submit" className="add-course-button" disabled={loading}>{loading ? 'Adding...' : 'Add Course'}</button>
        </form>

        <table className="student-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>
                  {editingId === c.id ? (
                    <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                  ) : (
                    c.name
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <>
                      <button className="add-course-button" type="button" onClick={() => saveEdit(c.id)} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                      <button className="add-course-cancel" type="button" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="add-course-button" type="button" onClick={() => startEdit(c)}>Edit</button>
                      <button className="delete-button" type="button" onClick={() => handleDelete(c.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
