const express = require('express');
const router = express.Router();
const { createUser, getUserById, getUserByPAN } = require('../controllers/userController');

router.post('/', createUser);

router.get('/:id', getUserById);

router.get('/pan/:pan', getUserByPAN);

module.exports = router;