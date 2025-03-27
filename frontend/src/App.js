import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Import page components
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ResumePage from './pages/ResumePage';
import IdeasPage from './pages/IdeasPage';
import ProjectsPage from './pages/ProjectsPage';
import ToolsPage from './pages/ToolsPage';
import HonorableMentionsPage from './pages/HonorableMentionsPage';

function App() {
  return (
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

