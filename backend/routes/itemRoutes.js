// itemRoutes.js
// Defines the URL paths for the item API.

const express = require('express');
const router = express.Router();
const { getItems, addItem } = require('../controllers/itemController');

// GET /api/items — get all active items
router.get('/', getItems);

// POST /api/items — add a new item
router.post('/', addItem);

module.exports = router;
