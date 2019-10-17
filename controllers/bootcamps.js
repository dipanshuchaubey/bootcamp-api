// @desc        Get all bootcamps
// @route       /api/v1/bootcamps
// @access      Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Bootcamps' });
};

// @desc        Get single bootcamp
// @route       /api/v1/bootcamps/:id
// @access      Public

exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Bootcamps for id : ${req.params.id}` });
};

// @desc        create new bootcamp
// @route       /api/v1/bootcamps
// @access      Private

exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, msg: 'Add new Bootcamp' });
};

// @desc        Update bootcamp
// @route       /api/v1/bootcamps/:id
// @access      Private

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamps id : ${req.params.id}` });
};

// @desc        Delete bootcamp
// @route       /api/v1/bootcamps/:id
// @access      Private

exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamps id : ${req.params.id}` });
};
