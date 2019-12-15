const advancedResult = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query into a variable usign spread operator
  const queryStr = { ...req.query };

  // Array for fields to be removed
  const remove = ['select', 'sort', 'page', 'limit'];

  // Remove fields from req.query
  remove.forEach(param => delete queryStr[param]);

  // Convert req.query from JSON to String
  query = JSON.stringify(queryStr);

  // Replace gte, lte, etc to $gte, $lte, etc
  query = query.replace(/gt|gte|lt|lte|in/g, match => `$${match}`);

  // Convert the query string into JSON Object
  let result = model.find(JSON.parse(query));

  // Select & Sort query Logic
  if (req.query.select) {
    const advQuery = req.query.select.split(',').join(' ');
    result = result.select(advQuery).sort(req.query.sort);
  }

  // Sort query Logic
  if (req.query.sort) {
  }

  // Populate
  if (populate) {
    result = result.populate(populate);
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = limit * page;
  const total = await model.countDocuments();

  // Pagination Result
  let pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    };
  }

  query = result.skip(startIndex).limit(limit);

  const data = await result;

  res.advancedResult = {
    success: true,
    count: data.length,
    pagination,
    data
  };

  next();
};

module.exports = advancedResult;
