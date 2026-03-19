import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyAutomation = { automationId: '', name: '', description: '', makeSharedLink: '', demoAudioUrl: '', demoVideoUrl: '', stripeCheckoutLink: '' };

const AutomationsManager = () => {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyAutomation);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchAutomations = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/automations'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      const json = await res.json();
      setAutomations(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchAutomations(); }, [fetchAutomations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        id: form.automationId,
        name: form.name,
        description: form.description,
        makeSharedLink: form.makeSharedLink,
        demoAudioUrl: form.demoAudioUrl,
        demoVideoUrl: form.demoVideoUrl,
        stripeCheckoutLink: form.stripeCheckoutLink,
      };
      if (editing === 'new') {
        await apiRequest('/automations', 'POST', payload);
      } else {
        await apiRequest(`/automations/${editing}`, 'PUT', {
          name: form.name,
          description: form.description,
          makeSharedLink: form.makeSharedLink,
          demoAudioUrl: form.demoAudioUrl,
          demoVideoUrl: form.demoVideoUrl,
          stripeCheckoutLink: form.stripeCheckoutLink,
        });
      }
      setEditing(null);
      setForm(emptyAutomation);
      await fetchAutomations();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (automation) => {
    setEditing(automation.id);
    setForm({
      automationId: automation.id,
      name: automation.name,
      description: automation.description,
      makeSharedLink: automation.makeSharedLink || '',
      demoAudioUrl: automation.demoAudioUrl || '',
      demoVideoUrl: automation.demoVideoUrl || '',
      stripeCheckoutLink: automation.stripeCheckoutLink || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this automation?')) return;
    try {
      await apiRequest(`/automations/${id}`, 'DELETE');
      await fetchAutomations();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <button onClick={() => { setEditing(null); setForm(emptyAutomation); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Automations</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Create Automation' : 'Edit Automation'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Automation ID</label>
              <input name="automationId" value={form.automationId} onChange={handleChange} disabled={editing !== 'new'} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Make.com Shared Link</label>
              <input name="makeSharedLink" value={form.makeSharedLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stripe Checkout Link</label>
              <input name="stripeCheckoutLink" value={form.stripeCheckoutLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Demo Audio URL</label>
                <input name="demoAudioUrl" value={form.demoAudioUrl} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Demo Video URL</label>
                <input name="demoVideoUrl" value={form.demoVideoUrl} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Create Automation' : 'Update Automation'}</Button>
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
            <h1 className="text-2xl font-bold text-white">Automations Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyAutomation); }} size="sm">+ New Automation</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : automations.length === 0 ? <p className="text-gray-500">No automations yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {automations.map((automation) => (
                  <tr key={automation.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{automation.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{automation.id}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(automation)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(automation.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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

export default AutomationsManager;
