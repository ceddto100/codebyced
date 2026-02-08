import api from './api';

const fallbackAutomations = [
  {
    id: 'lead-ops-ai',
    name: 'AI Lead Capture + Qualification Engine',
    description:
      'Qualify leads, enrich records, and alert sales in real time with zero manual hand-offs.',
    makeSharedLink: 'https://www.make.com/en/templates',
    demoVideoUrl: 'https://res.cloudinary.com/demo/video/upload/samples/sea-turtle.mp4',
    stripeCheckoutLink: 'https://example.com/stripe-checkout-placeholder',
  },
  {
    id: 'content-multichannel',
    name: 'Multichannel AI Content Distribution Workflow',
    description:
      'Turn one draft into social-ready assets, auto-schedule distribution, and monitor performance automatically.',
    makeSharedLink: 'https://www.make.com/en/templates',
    demoVideoUrl: 'https://res.cloudinary.com/demo/video/upload/samples/elephants.mp4',
    stripeCheckoutLink: 'https://example.com/stripe-checkout-placeholder',
  },
];

export const getAutomations = async () => {
  try {
    const response = await api.get('/automations');
    return response.data?.data?.length ? response.data.data : fallbackAutomations;
  } catch (error) {
    console.error('Failed to load automations:', error);
    return fallbackAutomations;
  }
};

export const uploadAutomationDemoVideo = async (automationId, videoFile) => {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await api.post(`/automations/${automationId}/upload-demo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
