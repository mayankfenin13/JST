const { body, validationResult } = require('express-validator');

// Validation middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Movie validation rules
const movieValidationRules = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('director')
      .notEmpty()
      .withMessage('Director is required')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Director must be between 1 and 100 characters'),
    
    body('releaseYear')
      .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
      .withMessage(`Release year must be between 1900 and ${new Date().getFullYear() + 5}`),
    
    body('genre')
      .notEmpty()
      .withMessage('Genre is required')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Genre must be between 1 and 50 characters')
  ];
};

// Search query validation rules
const searchValidationRules = () => {
  return [
    body('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search query must be less than 100 characters'),
    
    body('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    body('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ];
};

module.exports = {
  handleValidationErrors,
  movieValidationRules,
  searchValidationRules
};
