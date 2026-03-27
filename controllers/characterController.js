const Character = require('./../Models/characterModel');
const ApiFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopBounty = (req, res, next) => {
  req.url = '/?limit=5&sort=-bounty&fields=name,bounty,crew,title';
  next();
};

exports.getAllCharacters = catchAsync(async (req, res, next) => {
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
});

exports.getCharacter = catchAsync(async (req, res, next) => {
  const character = await Character.findById(req.params.id);

  if (!character) {
    return next(new AppError('No character found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      character,
    },
  });
});

exports.createCharacter = catchAsync(async (req, res, next) => {
  const newCharacter = await Character.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      character: newCharacter,
    },
  });
});

exports.updateCharacter = catchAsync(async (req, res, next) => {
  const character = await Character.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!character) {
    return next(new AppError('No character found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      character,
    },
  });
});

exports.deleteCharacter = catchAsync(async (req, res, next) => {
  const character = await Character.findByIdAndDelete(req.params.id);

  if (!character) {
    return next(new AppError('No character found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.totalBountyPerCrew = catchAsync(async (req, res, next) => {
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
});

exports.pirateCrewInfo = catchAsync(async (req, res, next) => {
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
});
