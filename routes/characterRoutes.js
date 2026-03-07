const express = require('express');
const characterController = require('./../controllers/characterController');

const router = express.Router();

router
  .route('/top-5-bounties')
  .get(
    characterController.aliasTopBounty,
    characterController.getAllCharacters,
  );

router
  .route('/')
  .get(characterController.getAllCharacters)
  .post(characterController.createCharacter);

router
  .route('/:id')
  .get(characterController.getCharacter)
  .patch(characterController.updateCharacter)
  .delete(characterController.deleteCharacter);

module.exports = router;
