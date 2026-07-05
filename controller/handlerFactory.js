const CatchAsync = require('./../utils/catchAssync');
const AppError = require('./../utils/appError');
const apiFeaturs = require('./../utils/apifaeturs');

exports.deleteOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No Document found with this id', 404));
    }
    res.status(204).json({
      status: 'succes',
      data: {
        tour: null,
      },
    });
    next();
  });

exports.updateOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }

    res.status(200).json({
      status: 'succes',
      data: {
        data: doc,
      },
    });
    next();
  });

exports.CreateOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
    next();
  });

exports.getOne = (Model, popOption) =>
  CatchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOption) query = query.populate(popOption);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }

    res.status(200).json({
      status: 'succes',
      data: {
        data: doc,
      },
    });
    next();
  });

exports.getAll = (Model) =>
  CatchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on Tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //execute the query
    const featurs = new apiFeaturs(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitfileds()
      .pigination();

    const doc = await featurs.query;

    res.status(200).json({
      status: 'succes',
      results: doc.length,
      data: {
        data: doc,
      },
    });
    next();
  });
