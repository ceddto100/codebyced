import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyService = { name: '', slug: '', summary: '', image: '', category: 'Web Development', featured: false, active: true, packagesJson: '[]', faqJson: '[]' };

const ServicesManager = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchServices = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/services'));
      const json = await res.json();
      setServices(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const autoSlug = () => {
    if (form.name && (!form.slug || editing === 'new')) {
      setForm(prev => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let packages = [], faq = [];
      try { packages = JSON.parse(form.packagesJson); } catch { /* keep empty */ }
      try { faq = JSON.parse(form.faqJson); } catch { /* keep empty */ }

      const payload = {
        name: form.name,
        slug: form.slug,
        summary: form.summary,
        image: form.image,
        category: form.category,
        featured: form.featured,
        active: form.active,
        packages,
        faq,
      };
      if (editing === 'new') {
        await apiRequest('/services', 'POST', payload);
      } else {
        await apiRequest(`/services/${editing}`, 'PUT', payload);
      }
      setEditing(null);
      setForm(emptyService);
      await fetchServices();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (service) => {
    setEditing(service._id);
    setForm({
      name: service.name,
      slug: service.slug,
      summary: service.summary || '',
      image: service.image || '',
      category: service.category || 'Web Development',
      featured: service.featured || false,
      active: service.active !== false,
      packagesJson: JSON.stringify(service.packages || [], null, 2),
      faqJson: JSON.stringify(service.faq || [], null, 2),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await apiRequest(`/services/${id}`, 'DELETE');
      await fetchServices();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <button onClick={() => { setEditing(null); setForm(emptyService); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Services</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Create Service' : 'Edit Service'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input name="name" value={form.name} onChange={handleChange} onBlur={autoSlug} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Summary</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 rounded" />
                Active
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Packages (JSON)</label>
              <textarea name="packagesJson" value={form.packagesJson} onChange={handleChange} rows={6} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">FAQ (JSON)</label>
              <textarea name="faqJson" value={form.faqJson} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Create Service' : 'Update Service'}</Button>
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
            <h1 className="text-2xl font-bold text-white">Services Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyService); }} size="sm">+ New Service</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : services.length === 0 ? <p className="text-gray-500">No services yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{service.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{service.category}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`text-xs px-3 py-1 rounded-full ${service.active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(service)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(service._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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

export default ServicesManager;
