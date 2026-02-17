import api from './api';

const fallbackAutomations = [
  {
    id: 'auto-blog',
    name: 'Auto Blog',
    description:
      'Auto Blog is an AI-powered automation that generates blog posts and automatically publishes them to your site, handling content creation, organization, and posting in one seamless workflow.',
    makeSharedLink: 'https://us2.make.com/public/shared-scenario/jho52fGXKo2/auto-blog',
    demoAudioUrl:
      'https://res.cloudinary.com/drssz6lnm/video/upload/v1770704461/Auto_Blog_tiztai.mp3',
    stripeCheckoutLink: 'https://buy.stripe.com/6oUcN6emwalpdE037Fawo0L',
  },

  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description:
      'This workflow uses an AI research assistant to analyze selected content, summarize key insights, and send results to your email. The output can also trigger follow-up automations, such as generating blog posts or other content automatically.',
    makeSharedLink:
      'https://us2.make.com/public/shared-scenario/ahIlSzt3vnq/research-assistant-and-zoho-mail',
    stripeCheckoutLink: 'https://buy.stripe.com/8x24gA7Y83X17fC5fNawo0M',
    demoAudioUrl:
      'https://res.cloudinary.com/drssz6lnm/video/upload/v1771284710/reseaech_email_swq8ix.mp3',
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

export const uploadAutomationAudio = async (automationId, audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await api.post(`/automations/${automationId}/upload-demo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};


export const uploadAutomationDemoVideo = uploadAutomationAudio;
