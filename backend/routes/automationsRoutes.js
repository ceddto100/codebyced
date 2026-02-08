const express = require('express');
const multer = require('multer');
const Automation = require('../models/Automation');
const { automationSeed } = require('../data/automationSeed');
const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const serializeAutomation = (record) => ({
  id: record.automationId,
  name: record.name,
  description: record.description,
  makeSharedLink: record.makeSharedLink,
  demoVideoUrl: record.demoVideoUrl,
  stripeCheckoutLink: record.stripeCheckoutLink,
});

router.get('/', async (_req, res) => {
  try {
    const records = await Automation.find({}).sort({ createdAt: -1 });

    if (!records.length) {
      return res.status(200).json({
        success: true,
        source: 'seed',
        data: automationSeed.map((item) => ({
          id: item.automationId,
          name: item.name,
          description: item.description,
          makeSharedLink: item.makeSharedLink,
          demoVideoUrl: item.demoVideoUrl,
          stripeCheckoutLink: item.stripeCheckoutLink,
        })),
      });
    }

    return res.status(200).json({
      success: true,
      source: 'database',
      data: records.map(serializeAutomation),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await Automation.create({
      automationId: req.body.id,
      name: req.body.name,
      description: req.body.description,
      makeSharedLink: req.body.makeSharedLink,
      demoVideoUrl: req.body.demoVideoUrl,
      stripeCheckoutLink: req.body.stripeCheckoutLink,
    });

    return res.status(201).json({ success: true, data: serializeAutomation(created) });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/:id/upload-demo', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Video file is required in `video` field.' });
    }

    if (!hasCloudinaryConfig) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary credentials are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
      });
    }

    const existing = await Automation.findOne({ automationId: req.params.id });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Automation not found.' });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'codebyced/automations',
          resource_type: 'video',
          public_id: `${req.params.id}-demo-${Date.now()}`,
          overwrite: true,
        },
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    existing.demoVideoUrl = uploadResult.secure_url;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: 'Demo video uploaded and linked to automation.',
      data: serializeAutomation(existing),
      cloudinary: {
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
