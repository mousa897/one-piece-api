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
  affiliation: {
    type: String,
    enum: ['Pirate', 'Marine', 'Revolutionary', 'Civilian', 'World Government'],
    default: 'Civilian',
  },
  title: {
    type: String,
    enum: [
      'Yonko',
      'Warlord',
      'Admiral',
      'Fleet Admiral',
      'Worst Generation',
      'Legend',
      'None',
    ],
    default: 'None',
  },
  role: {
    type: String,
    enum: [
      'Captain',
      'First Mate',
      'Swordsman',
      'Navigator',
      'Cook',
      'Doctor',
      'Sniper',
      'Helmsman',
      'Shipwright',
      'Musician',
      'Fighter',
      'Commander',
      'Admiral',
      'Scientist',
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
  image: {
    type: String,
  },
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
