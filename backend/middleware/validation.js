const { body, validationResult } = require('express-validator');
const Joi = require('joi');

// Utility function to process validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Blog validation rules
const validateBlogPost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('excerpt')
    .trim()
    .notEmpty().withMessage('Excerpt is required')
    .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  
  body('content')
    .notEmpty().withMessage('Content is required'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  handleValidationErrors
];

// Resume validation rules
const validateResumeEntry = [
  body('jobTitle')
    .trim()
    .notEmpty().withMessage('Job title is required'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required'),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be in ISO format'),
  
  body('description')
    .notEmpty().withMessage('Job description is required'),
  
  handleValidationErrors
];

// Idea validation rules
const validateIdea = [
  body('title')
    .trim()
    .notEmpty().withMessage('Idea title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  body('summary')
    .trim()
    .notEmpty().withMessage('Idea summary is required'),
  
  handleValidationErrors
];

// Project validation rules
const validateProject = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Project description is required'),
  
  handleValidationErrors
];

// Tool validation rules
const validateTool = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tool name is required'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Tool description is required'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Tool category is required'),
  
  body('link')
    .notEmpty().withMessage('External link is required')
    .isURL().withMessage('Link must be a valid URL'),
  
  handleValidationErrors
];

// Contact/lead validation rules
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),

  body('service').optional().trim().isLength({ max: 100 }),
  body('plan').optional().trim().isLength({ max: 100 }),

  handleValidationErrors
];

// Testimonial validation rules
const validateTestimonial = [
  body('clientName')
    .trim()
    .notEmpty().withMessage('Client name is required')
    .isLength({ max: 100 }).withMessage('Client name cannot exceed 100 characters'),

  body('quote')
    .trim()
    .notEmpty().withMessage('Quote is required')
    .isLength({ max: 1000 }).withMessage('Quote cannot exceed 1000 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  handleValidationErrors
];

// Honor validation rules
const validateHonor = [
  body('title')
    .trim()
    .notEmpty().withMessage('Honor title is required'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Honor description is required'),
  
  handleValidationErrors
];

// ElevenLabs webhook validation using Joi
const elevenLabsWebhookSchema = Joi.object({
  query: Joi.string().required().description('Keyword or phrase the user wants to search for.')
});

module.exports = {
  validateBlogPost,
  validateResumeEntry,
  validateIdea,
  validateProject,
  validateTool,
  validateHonor,
  validateContact,
  validateTestimonial,
  validateElevenLabsWebhook: (req, res, next) => {
    const { error } = elevenLabsWebhookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  }
};