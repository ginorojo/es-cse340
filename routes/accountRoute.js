// Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

// Route that will be sent when "My account" link is clicked
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to process of registration
router.get(
  '/registration',
  utilities.handleErrors(accountController.buildRegister)
);

// Route to submit the registration form
router.post(
  '/registration',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to successfully logged in
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Vista para actualizar cuenta
router.get(
  '/update/:accountId',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdateView)
);

// Procesar actualización de información
router.post(
  '/update-info',
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// Procesar cambio de contraseña
router.post(
  '/update-password',
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountPassword)
);

router.get('/logout', (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});


module.exports = router;