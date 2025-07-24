import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import LoginPage from './LoginPage';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

const AppLayout: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginPage />;
  }

  if (currentUser.role === 'instructor') {
    return <InstructorDashboard />;
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  return <LoginPage />;
};

export default AppLayout;