const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema(
  {
    automationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    makeSharedLink: {
      type: String,
      required: true,
      trim: true,
    },
    demoAudioUrl: {
      type: String,
      default: '',
      trim: true,
    },
    demoVideoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    stripeCheckoutLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

automationSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Automation', automationSchema);
