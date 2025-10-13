// Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");


// Route to build the inventory classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build the inventory detail view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

//Management view route
router.get("/", utilities.handleErrors(invController.buildManagementview));

//Add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Post a new classification
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

//Add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Post an inventory item
router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

//fetch route
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to update inventory item
router.post(
  "/update",
  invValidate.updateInventoryRules(),   // reglas de validación
  invValidate.checkUpdateData,       // middleware para chequear errores
  utilities.handleErrors(invController.updateInventory) // controlador
);

// Deliver delete confirmation view
router.get('/delete/:inv_id', utilities.handleErrors(invController.buildDeleteView));

// Process delete request
router.post('/delete', utilities.handleErrors(invController.deleteInventory));

router.post('/add-review', utilities.checkLogin, utilities.handleErrors(invController.addReview));
module.exports = router;
