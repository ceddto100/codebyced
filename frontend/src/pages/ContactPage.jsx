import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageLayout from '../components/PageLayout';
import ContactForm from '../components/ContactForm';
import CalButton from '../components/CalButton';

const SERVICE_LABELS = {
  'web-dev': 'Web Development & Maintenance',
  maintenance: 'Website Maintenance',
  automation: 'Workflow & Automation',
  ai: 'AI & Conversational Tools',
  apps: 'App & Software Development',
  consulting: 'Technical Consulting',
  seo: 'SEO Boost',
};

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const serviceKey = searchParams.get('service') || '';
  const plan = searchParams.get('plan') || '';
  const service = SERVICE_LABELS[serviceKey] || serviceKey;

  return (
    <PageLayout>
      <Helmet>
        <title>Contact | CodeByCed</title>
        <meta
          name="description"
          content="Tell me about your project and I'll get back to you within one business day. Prefer to talk live? Book a free call instead."
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
            Let's Build Something Together
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Share a few details about what you need and I'll reply within one business day.
            No obligation, no pressure &mdash; just a conversation about your goals.
          </p>
        </div>

        <div className="backdrop-blur-sm bg-gray-900/60 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <ContactForm service={service} plan={plan} />
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">Prefer to talk it through live?</p>
          <CalButton
            handle="cedrick-carter-ndeqh2"
            event="secret"
            label="Book a Free Call Instead"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 transition-all duration-300"
            metadata={{ page: 'contact', service: serviceKey, plan }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
