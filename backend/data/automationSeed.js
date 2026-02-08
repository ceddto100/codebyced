const STRIPE_PLACEHOLDER = 'https://example.com/stripe-checkout-placeholder';

const automationSeed = [
  {
    automationId: 'lead-ops-ai',
    name: 'AI Lead Capture + Qualification Engine',
    description:
      'Instantly routes inbound leads, enriches records, scores buyer intent, and notifies your sales team in real time without manual follow-up.',
    makeSharedLink: 'https://www.make.com/en/templates',
    demoVideoUrl:
      'https://res.cloudinary.com/demo/video/upload/samples/sea-turtle.mp4',
    stripeCheckoutLink: STRIPE_PLACEHOLDER,
  },
  {
    automationId: 'content-multichannel',
    name: 'Multichannel AI Content Distribution Workflow',
    description:
      'Turns one content draft into channel-specific social posts, schedules delivery, and tracks engagement so your team can stay focused on strategy.',
    makeSharedLink: 'https://www.make.com/en/templates',
    demoVideoUrl:
      'https://res.cloudinary.com/demo/video/upload/samples/elephants.mp4',
    stripeCheckoutLink: STRIPE_PLACEHOLDER,
  },
  {
    automationId: 'invoice-sync',
    name: 'Invoice to Books Reconciliation Automation',
    description:
      'Syncs payment events to your accounting stack, updates ledger status, and sends stakeholder alerts to eliminate financial ops bottlenecks.',
    makeSharedLink: 'https://www.make.com/en/templates',
    demoVideoUrl:
      'https://res.cloudinary.com/demo/video/upload/samples/surfing.mp4',
    stripeCheckoutLink: STRIPE_PLACEHOLDER,
  },
];

module.exports = { automationSeed, STRIPE_PLACEHOLDER };
