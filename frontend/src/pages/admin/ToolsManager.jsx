import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyTool = { name: '', description: '', category: '', logo: '', link: '', features: '', recommended: true, order: 0 };

const ToolsManager = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTool);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchTools = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/tools'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      const json = await res.json();
      setTools(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchTools(); }, [fetchTools]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : name === 'order' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        features: typeof form.features === 'string' ? form.features.split('\n').map(f => f.trim()).filter(Boolean) : form.features,
      };
      if (editing === 'new') {
        await apiRequest('/tools', 'POST', payload);
      } else {
        await apiRequest(`/tools/${editing}`, 'PUT', payload);
      }
      setEditing(null);
      setForm(emptyTool);
      await fetchTools();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (tool) => {
    setEditing(tool._id);
    setForm({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      logo: tool.logo || '',
      link: tool.link,
      features: (tool.features || []).join('\n'),
      recommended: tool.recommended !== false,
      order: tool.order || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tool?')) return;
    try {
      await apiRequest(`/tools/${id}`, 'DELETE');
      await fetchTools();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <button onClick={() => { setEditing(null); setForm(emptyTool); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Tools</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Add Tool' : 'Edit Tool'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                <input name="logo" value={form.logo} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Link</label>
              <input name="link" value={form.link} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Features (one per line)</label>
              <textarea name="features" value={form.features} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="recommended" checked={form.recommended} onChange={handleChange} className="w-4 h-4 rounded" />
                Recommended
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} className="w-24 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Add Tool' : 'Update Tool'}</Button>
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
            <h1 className="text-2xl font-bold text-white">Tools Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyTool); }} size="sm">+ New Tool</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : tools.length === 0 ? <p className="text-gray-500">No tools yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tools.map((tool) => (
                  <tr key={tool._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{tool.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{tool.category}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(tool)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(tool._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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

export default ToolsManager;
