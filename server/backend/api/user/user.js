const router = require('express').Router();

import {getUser, registerUser, getHouse} from './assets/user.controller'

router.get('/', getUser);

router.post('/register', registerUser);

router.get('/:houseid', getHouse);

module.exports = router;