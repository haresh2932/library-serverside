const express = require('express');
const router = express.Router();
const { registerController } = require('../../../controller');


router.post(
  "/",
  registerController.listUsers
)

router.post(
  "/register",
  registerController.registerUsers
)

router.post(
  '/login',
  registerController.loginUser
);
router.get(
  '/logout',
  registerController.logoutUser
);

router.get('/profile', registerController.authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access to profile",
    user: req.user,
  });
});

module.exports = router;
