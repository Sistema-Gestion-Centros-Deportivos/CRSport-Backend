const express = require('express');
const { getInstalaciones, createInstalacion } = require('../controllers/instalacionesController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

router.get('/', authenticateToken, getInstalaciones);
router.post('/', authenticateToken, createInstalacion);

module.exports = router;
