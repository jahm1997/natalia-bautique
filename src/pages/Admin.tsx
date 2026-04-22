import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import { AppPage } from '../types';

interface Props {
  onNavigate: (page: AppPage) => void;
}

export default function Admin({ onNavigate }: Props) {
  const { user, loading } = useAuth();
  const [authKey, setAuthKey] = useState(0);

  const handleBack = () => {
    window.location.hash = '';
    onNavigate('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          <p className="text-cream/20 text-xs tracking-widest uppercase">Cargando</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        key={authKey}
        onSuccess={() => setAuthKey(k => k + 1)}
        onBack={handleBack}
      />
    );
  }

  return <AdminDashboard onNavigate={onNavigate} />;
}
