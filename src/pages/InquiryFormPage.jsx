import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InquiryForm from '../components/InquiryForm';
import TopBar from '../components/TopBar';
import { createInquiry, getInquiry, updateInquiry } from '../lib/inquiries';

export default function InquiryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!id) return;
    getInquiry(id)
      .then(setInquiry)
      .catch((fetchError) => setError(fetchError.message));
  }, [id]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateInquiry(id, payload);
        navigate('/inquiries');
      } else {
        await createInquiry(payload);
        navigate('/inquiries');
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && !inquiry && !error) return <div className="page-status">Loading...</div>;

  return (
    <>
      <TopBar />
      {error && <div className="page-error">{error}</div>}
      <InquiryForm initialValue={inquiry || undefined} mode={isEdit ? 'edit' : 'create'} onSubmit={handleSubmit} loading={loading} />
    </>
  );
}
