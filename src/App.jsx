import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './pages/LoginPage';
import InquiryFormPage from './pages/InquiryFormPage';
import InquiryListPage from './pages/InquiryListPage';
import PrintInquiryPage from './pages/PrintInquiryPage';
import CoursesPage from './pages/CoursesPage';

function ProtectedRoute({ session, children }) {
  if (session === undefined) return <div className="page-status">Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/inquiries" replace /> : <LoginPage />} />
      <Route
        path="/inquiries"
        element={
          <ProtectedRoute session={session}>
            <InquiryListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inquiries/new"
        element={
          <ProtectedRoute session={session}>
            <InquiryFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inquiries/:id/edit"
        element={
          <ProtectedRoute session={session}>
            <InquiryFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inquiries/:id/print"
        element={
          <ProtectedRoute session={session}>
            <PrintInquiryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute session={session}>
            <CoursesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/inquiries" replace />} />
    </Routes>
  );
}
