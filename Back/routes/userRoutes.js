const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const multer = require("multer");
const {
    register,
    login,
    getAllUser,
    getMe,
    elveszettallat,
    talaltallat,
    osszesallat
} = require('../controllers/userController');


// Multer konfiguráció
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images"); // A feltöltött fájlok mentési helye
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`); // Fájlnév konfiguráció
    },
  });
  
  const upload = multer({ storage });
  


router.post("/regisztracio", register);
router.post("/login", login);
router.post("/elveszettallat", protect, upload.single("file"), elveszettallat);
router.post("/talaltallat", protect, upload.single("file"), talaltallat);


router.get("/alluser", protect ,getAllUser);
router.get("/me", protect, getMe)
router.get("/osszallat", osszesallat)

module.exports = router