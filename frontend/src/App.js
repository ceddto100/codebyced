import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import WebDevMaintenancePage from './pages/WebDevMaintenancePage'; // ✅ add this

function App() {
  return (
    <Router /* basename={import.meta.env.BASE_URL} — if you deploy under a subpath */>
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
          <Route
            path="/services/web-development-maintenance"
            element={<WebDevMaintenancePage />}   // ✅ new route
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


