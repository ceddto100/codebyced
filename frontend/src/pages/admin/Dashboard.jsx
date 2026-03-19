import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import { getApiUrl } from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const res = await fetch(getApiUrl('/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Unauthorized');
        const json = await res.json();
        setAdmin(json);
      } catch {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (checking) {
    return (
      <PageLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <p className="text-gray-400">Verifying credentials...</p>
        </div>
      </PageLayout>
    );
  }

  const sections = [
    { to: '/admin/blog', label: 'Blog Manager', icon: '📝', desc: 'Create, edit, and manage blog posts' },
    { to: '/admin/projects', label: 'Project Manager', icon: '🛠', desc: 'Manage your portfolio projects' },
    { to: '/admin/resume', label: 'Resume Manager', icon: '📄', desc: 'Update work experience entries' },
    { to: '/admin/services', label: 'Services Manager', icon: '💼', desc: 'Manage service offerings and pricing' },
    { to: '/admin/ideas', label: 'Ideas Manager', icon: '💡', desc: 'Track and manage creative ideas' },
    { to: '/admin/tools', label: 'Tools Manager', icon: '🔧', desc: 'Curate your recommended tools' },
    { to: '/admin/honors', label: 'Honors Manager', icon: '🏆', desc: 'Manage awards and recognitions' },
    { to: '/admin/automations', label: 'Automations Manager', icon: '⚡', desc: 'Manage automation offerings' },
  ];

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
            {admin?.username && (
              <p className="text-gray-400 mt-1">Welcome, {admin.username}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="backdrop-blur-sm bg-gray-900/80 rounded-xl p-6 border border-gray-800 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-3">{section.icon}</div>
              <h2 className="text-xl font-semibold text-white mb-2">{section.label}</h2>
              <p className="text-gray-400 text-sm">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
