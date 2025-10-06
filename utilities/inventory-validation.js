const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};
const invModel = require('../models/inventory-model');

/* **********************************
 * Add a classification data rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Classification name must be between 2 and 30 characters long')
      .matches(/^[A-Za-z0-9]+$/)
      .custom(async (value) => {
        const classification = await invModel.checkExistingClassificationName(value);
        if (classification) {
          throw new Error('Classification name already exists, please try again!.');
        }
      })
  ];
};

/* **********************************
 * Check classification data
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors,
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color
    });
  }
  next();
};

/* **********************************
 * Rules for adding a new inventory item
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    body('classification_id').trim().notEmpty().withMessage('Please select a classification'),
    body('inv_make').trim().isLength({ min: 3, max: 30 }).withMessage('Make must be between 3 and 30 characters long').notEmpty().withMessage('Make is required'),
    body('inv_model').trim().isLength({ min: 3, max: 30 }).withMessage('Model must be between 3 and 30 characters long').notEmpty().withMessage('Model is required'),
    body('inv_year').trim().isInt({ min: 1900, max: 2100 }).withMessage('Year must be a valid 4-digit number').notEmpty().withMessage('Year is required'),
    body('inv_description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters long').notEmpty().withMessage('Description is required'),
    body('inv_price').trim().isFloat({ min: 0 }).withMessage('Price must be a valid number').notEmpty().withMessage('Price is required'),
    body('inv_miles').trim().isInt({ min: 0 }).withMessage('Miles must be a valid integer').notEmpty().withMessage('Miles is required'),
    body('inv_color').trim().isLength({ min: 3, max: 30 }).withMessage('Color must be between 3 and 30 characters long').notEmpty().withMessage('Color is required')
  ];
};

/* **********************************
 * Check data for adding a new inventory item
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  let classificationList = await utilities.buildClassificationList(req.body.classification_id);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('inventory/management', {
      title: 'Add New Inventory Item',
      nav,
      errors,
      classificationList,
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color
    });
  }
  next();
};

/* **********************************
 * Check data for updating inventory item
 * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  let classificationList = await utilities.buildClassificationList(req.body.classification_id);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render('inventory/edit-inventory', {
      title: 'Update Inventory Item',
      nav,
      errors,
      classificationList,
      classification_id: req.body.classification_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_id: req.body.inv_id
    });
  }
  next();
};

/* **********************************
 * Rules for updating an inventory item
 * ********************************* */
validate.updateInventoryRules = () => {
  return [
    ...validate.addInventoryRules(), // reutiliza reglas de agregar
    body('inv_id').notEmpty().withMessage('Inventory ID is required')
  ];
};

module.exports = validate;
