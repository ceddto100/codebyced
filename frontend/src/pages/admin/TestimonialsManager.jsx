import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyTestimonial = {
  clientName: '', clientTitle: '', company: '', quote: '', rating: 5,
  avatar: '', service: '', featured: false, order: 0,
};

const TestimonialsManager = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTestimonial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchTestimonials = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/testimonials'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      const json = await res.json();
      setTestimonials(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'order' || name === 'rating') ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') {
        await apiRequest('/testimonials', 'POST', form);
      } else {
        await apiRequest(`/testimonials/${editing}`, 'PUT', form);
      }
      setEditing(null);
      setForm(emptyTestimonial);
      await fetchTestimonials();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial._id);
    setForm({
      clientName: testimonial.clientName,
      clientTitle: testimonial.clientTitle || '',
      company: testimonial.company || '',
      quote: testimonial.quote,
      rating: testimonial.rating || 5,
      avatar: testimonial.avatar || '',
      service: testimonial.service || '',
      featured: testimonial.featured || false,
      order: testimonial.order || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await apiRequest(`/testimonials/${id}`, 'DELETE');
      await fetchTestimonials();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <button onClick={() => { setEditing(null); setForm(emptyTestimonial); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Testimonials</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                <input name="clientName" value={form.clientName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Client Title</label>
                <input name="clientTitle" value={form.clientTitle} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input name="company" value={form.company} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Related Service</label>
                <input name="service" value={form.service} onChange={handleChange} placeholder="e.g. web-dev, seo, automation" className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quote</label>
              <textarea name="quote" value={form.quote} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
                <input name="avatar" value={form.avatar} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating (1-5)</label>
                <input name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded" />
                Featured (show on homepage)
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} className="w-24 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Add Testimonial' : 'Update Testimonial'}</Button>
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
            <h1 className="text-2xl font-bold text-white">Testimonials Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyTestimonial); }} size="sm">+ New Testimonial</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : testimonials.length === 0 ? <p className="text-gray-500">No testimonials yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Company</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Featured</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{t.clientName}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{t.company}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{t.featured ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(t)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(t._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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

export default TestimonialsManager;
