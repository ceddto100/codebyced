import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ResumePage from './pages/ResumePage';
import IdeasPage from './pages/IdeasPage';
import ProjectsPage from './pages/ProjectsPage';
import ToolsPage from './pages/ToolsPage';
import HonorableMentionsPage from './pages/HonorableMentionsPage';
import WebDevMaintenancePage from './pages/WebDevMaintenancePage';
import WorkflowAutomationPage from './pages/WorkflowAutomationPage';
import AIConversationalToolsPage from './pages/AIConversationalToolsPage';
import AppSoftwareDevPage from './pages/AppSoftwareDevPage';

function App() {
  return (
    // If deploying under a subpath, set basename on Router (Vite: import.meta.env.BASE_URL, CRA: process.env.PUBLIC_URL)
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/mentions" element={<HonorableMentionsPage />} />

          {/* Services */}
          {/* Web Dev & Maintenance */}
          <Route path="/services/web-development-maintenance" element={<WebDevMaintenancePage />} />

          {/* Workflow & Automation */}
          <Route path="/services/workflow-automation" element={<WorkflowAutomationPage />} />

          {/* AI & Conversational Tools (alias /services/ai redirects to canonical) */}
          <Route path="/services/ai-conversational-tools" element={<AIConversationalToolsPage />} />
          <Route path="/services/ai" element={<Navigate to="/services/ai-conversational-tools" replace />} />

          {/* App & Software Development (alias /services/apps redirects to canonical) */}
          <Route path="/services/app-development" element={<AppSoftwareDevPage />} />
          <Route path="/services/apps" element={<Navigate to="/services/app-development" replace />} />

          {/* (Optional) 404 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;



