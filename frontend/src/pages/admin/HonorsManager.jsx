import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyHonor = { title: '', organization: '', description: '', year: '', image: '', link: '', featured: false, order: 0 };

const HonorsManager = () => {
  const navigate = useNavigate();
  const [honors, setHonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyHonor);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchHonors = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/honors'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      const json = await res.json();
      setHonors(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchHonors(); }, [fetchHonors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'order' || name === 'year') ? parseInt(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, year: form.year ? parseInt(form.year) : undefined };
      if (editing === 'new') {
        await apiRequest('/honors', 'POST', payload);
      } else {
        await apiRequest(`/honors/${editing}`, 'PUT', payload);
      }
      setEditing(null);
      setForm(emptyHonor);
      await fetchHonors();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (honor) => {
    setEditing(honor._id);
    setForm({
      title: honor.title,
      organization: honor.organization || '',
      description: honor.description,
      year: honor.year || '',
      image: honor.image || '',
      link: honor.link || '',
      featured: honor.featured || false,
      order: honor.order || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this honor?')) return;
    try {
      await apiRequest(`/honors/${id}`, 'DELETE');
      await fetchHonors();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <button onClick={() => { setEditing(null); setForm(emptyHonor); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Honors</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Add Honor' : 'Edit Honor'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Organization</label>
                <input name="organization" value={form.organization} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <input name="year" type="number" value={form.year} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Link</label>
                <input name="link" value={form.link} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded" />
                Featured
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} className="w-24 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Add Honor' : 'Update Honor'}</Button>
          </form>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button to="/admin/dashboard" variant="ghost" size="sm" className="mb-4">&larr; Dashboard</Button>
            <h1 className="text-2xl font-bold text-white">Honors Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyHonor); }} size="sm">+ New Honor</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : honors.length === 0 ? <p className="text-gray-500">No honors yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Organization</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Year</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {honors.map((honor) => (
                  <tr key={honor._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{honor.title}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{honor.organization}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{honor.year}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(honor)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(honor._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default HonorsManager;
