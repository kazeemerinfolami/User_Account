//how a user can get his profile after login>>

const express = require("express");

const { requireSignIn, adminMiddleware } = require("../controllers/controller");
const router = express.Router();

const { read, update } = require("../controllers/user");

router.get("/user/:id", requireSignIn, read);
router.put("/user/update", requireSignIn, update);
router.put("/admin/update", requireSignIn, adminMiddleware, update);

module.exports = router;
