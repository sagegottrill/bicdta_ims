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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="accent-bar" />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading data</p>
          </div>
        </div>
      ) : currentUser ? (
        currentUser.role === 'admin' ? <AdminDashboard /> : <InstructorDashboard />
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default AppLayout;