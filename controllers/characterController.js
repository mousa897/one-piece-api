const Character = require('./../Models/characterModel');
const ApiFeatures = require('./../utils/apiFeatures');

exports.getAllCharacters = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new ApiFeatures(Character.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const characters = await features.query;

    res.status(200).json({
      status: 'success',
      results: characters.length,
      requestedAt: req.requestTime,
      data: {
        characters,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        character,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createCharacter = async (req, res) => {
  try {
    const newCharacter = await Character.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        character: newCharacter,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        character,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteCharacter = async (req, res) => {
  try {
    await Character.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
