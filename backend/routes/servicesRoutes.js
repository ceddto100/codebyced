// backend/routes/servicesRoutes.js
const express = require('express');
const router = express.Router();
const { isValidObjectId } = require('mongoose');
const Service = require('../models/Service'); // <- make sure this exists

/**
 * Suggested Service model fields (for reference)
 * {
 *   name: String,
 *   slug: { type: String, unique: true, index: true },
 *   category: String,          // e.g., "web-dev"
 *   featured: Boolean,         // highlight on site
 *   active: Boolean,           // available for sale
 *   plans: [                   // maintenance or pricing tiers
 *     { name: String, price: String, features: [String] }
 *   ],
 *   packages: [                // project packages
 *     { tier: String, price: String, timeline: String, items: [String] }
 *   ],
 *   alacarte: [{ name: String, price: String }],
 *   faq: [{ q: String, a: String }],
 * }, { timestamps: true }
 *
 * // If you want text search:
 * ServiceSchema.index({ name: 'text', slug: 'text', category: 'text' })
 */

// GET /api/services
// List services with optional filters, search, and pagination
router.get('/', async (req, res) => {
  try {
    const filter = {};

    // Filters
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';
    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    if (req.query.slug) filter.slug = req.query.slug; // exact match if provided

    // Text search
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    // Sorting (default: newest first)
    // Example: ?sort=createdAt or ?sort=-createdAt or ?sort=name
    const sort = req.query.sort || '-createdAt';

    const services = await Service.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        limit,
      },
      data: services,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to fetch by id OR slug
async function findByIdOrSlug(idOrSlug) {
  if (isValidObjectId(idOrSlug)) {
    const byId = await Service.findById(idOrSlug);
    if (byId) return byId;
  }
  return Service.findOne({ slug: idOrSlug });
}

// GET /api/services/:idOrSlug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const svc = await findByIdOrSlug(req.params.idOrSlug);

    if (!svc) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({ success: true, data: svc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/services
router.post('/', async (req, res) => {
  try {
    const created = await Service.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/services/:idOrSlug
router.put('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const query = isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const updated = await Service.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/services/:idOrSlug
router.delete('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const toDelete = isValidObjectId(idOrSlug)
      ? await Service.findByIdAndDelete(idOrSlug)
      : await Service.findOneAndDelete({ slug: idOrSlug });

    if (!toDelete) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

