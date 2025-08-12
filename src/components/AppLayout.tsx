import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import LoginPage from './LoginPage';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

const AppLayout: React.FC = () => {
  const { currentUser, loading } = useAppContext();

  console.log('🎯 AppLayout rendering:', { currentUser, loading }); // Added for debugging
  console.log('🎯 AppLayout - currentUser:', currentUser);
  console.log('🎯 AppLayout - loading:', loading);

  // Show UI immediately, don't block with loading spinner
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="accent-bar" />
      {currentUser ? (
        currentUser.role === 'admin' ? <AdminDashboard /> : <InstructorDashboard />
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default AppLayout;