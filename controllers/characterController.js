const Character = require('./../Models/characterModel');
const ApiFeatures = require('./../utils/apiFeatures');

exports.aliasTopBounty = (req, res, next) => {
  req.url = '/?limit=5&sort=-bounty&fields=name,bounty,crew,title';
  next();
};

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
      message: err.message,
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
      message: err.message,
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
      message: err.message,
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
      message: err.message,
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
      message: err.message,
    });
  }
};

exports.totalBountyPerCrew = async (req, res) => {
  try {
    const bountyPerCrew = await Character.aggregate([
      {
        $match: { bounty: { $gt: 0 } },
      },
      {
        $group: {
          _id: '$crew',
          totalBounty: { $sum: '$bounty' },
          members: { $sum: 1 },
          avgBounty: { $avg: '$bounty' },
        },
      },
      {
        $addFields: { crewName: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: {
          totalBounty: -1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        bountyPerCrew,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.pirateCrewInfo = async (req, res) => {
  try {
    const crew = req.params.crew;

    const crewInfo = await Character.aggregate([
      {
        $match: { crew },
      },
      {
        $group: {
          _id: '$crew',
          memberNum: { $sum: 1 },
          memberNames: { $push: '$name' },
          totalBounty: { $sum: '$bounty' },
          avgBounty: { $avg: '$bounty' },
          highestBounty: {
            $top: {
              output: { name: '$name', bounty: '$bounty' },
              sortBy: { bounty: -1 },
            },
          },
          lowestBounty: {
            $bottom: {
              output: { name: '$name', bounty: '$bounty' },
              sortBy: { bounty: -1 },
            },
          },
          numDevilFruitUsers: {
            $sum: { $cond: [{ $ne: ['$devilFruit', 'none'] }, 1, 0] },
          },
          devilFruitUsers: {
            $push: {
              $cond: [
                { $ne: ['$devilFruit', 'none'] },
                { name: '$name', devilFruit: '$devilFruit' },
                '$$REMOVE',
              ],
            },
          },
          numAlive: {
            $sum: { $cond: [{ $eq: ['$status', 'Alive'] }, 1, 0] },
          },
          numDead: {
            $sum: { $cond: [{ $eq: ['$status', 'Dead'] }, 1, 0] },
          },
        },
      },
      {
        $addFields: { crewName: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        crewInfo,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
