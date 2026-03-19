import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyProject = { title: '', description: '', image: '', techStack: '', githubLink: '', demoLink: '', category: 'Web Development', featured: false, completed: true };

const ProjectManager = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchProjects = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/projects'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      const json = await res.json();
      setProjects(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(t => t.trim()).filter(Boolean) : form.techStack,
      };
      if (editing === 'new') {
        await apiRequest('/projects', 'POST', payload);
      } else {
        await apiRequest(`/projects/${editing}`, 'PUT', payload);
      }
      setEditing(null);
      setForm(emptyProject);
      await fetchProjects();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (project) => {
    setEditing(project._id);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image || '',
      techStack: (project.techStack || []).join(', '),
      githubLink: project.githubLink || '',
      demoLink: project.demoLink || '',
      category: project.category || 'Web Development',
      featured: project.featured || false,
      completed: project.completed !== false,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await apiRequest(`/projects/${id}`, 'DELETE');
      await fetchProjects();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <button onClick={() => { setEditing(null); setForm(emptyProject); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Projects</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Create Project' : 'Edit Project'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack (comma-separated)</label>
              <input name="techStack" value={form.techStack} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub Link</label>
                <input name="githubLink" value={form.githubLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Demo Link</label>
                <input name="demoLink" value={form.demoLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input name="image" value={form.image} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-gray-300 text-sm">
                <input type="checkbox" name="completed" checked={form.completed} onChange={handleChange} className="w-4 h-4 rounded" />
                Completed
              </label>
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Create Project' : 'Update Project'}</Button>
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
            <h1 className="text-2xl font-bold text-white">Project Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyProject); }} size="sm">+ New Project</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : projects.length === 0 ? <p className="text-gray-500">No projects yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{project.title}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">{project.category}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`text-xs px-3 py-1 rounded-full ${project.completed ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {project.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(project)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(project._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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

export default ProjectManager;
