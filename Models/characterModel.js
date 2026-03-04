const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A character must have a name'],
    unique: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    default: 'Unknown',
  },
  bounty: {
    type: Number,
    default: 0,
  },
  crew: {
    type: String,
    default: 'No Crew',
  },
  role: {
    type: String,
    enum: [
      'Captain',
      'Swordsman',
      'Navigator',
      'Cook',
      'Doctor',
      'Sniper',
      'Civilian',
    ],
    default: 'Civilian',
  },
  devilFruit: {
    type: String,
    default: 'none',
  },
  status: {
    type: String,
    enum: ['Alive', 'Dead', 'Unknown'],
    default: 'Alive',
  },
  debutArc: {
    type: String,
    required: [true, 'A character must have a debut arc'],
  },
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
