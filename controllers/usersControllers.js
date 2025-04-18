const User = require('../models/userModel');
const AppGlobalErrorClass = require('../utils/appGlobalError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

const filteredFields = (reqObj, ...allowfields) => {
  const result = Object.keys(reqObj).reduce((acc, cur) => {
    if (allowfields.includes(cur)) {
      return { ...acc, [cur]: reqObj[cur] };
    } else {
      return acc;
    }
  }, {});
  return result;
};

// ______________________________________________________________________
// USERS HANDLERS
// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();

//   res.status(200).send({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.updatedata = catchAsync(async (req, res, next) => {
  // 1 check if req body contains  passwrd or passwrdconfirm
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppGlobalErrorClass(
        400,
        'This route is not for password update, Please use /updatepassword',
      ),
    );
  }

  // 3 FILTEROUT THE FILDS FROM REQ BODY

  const fields = filteredFields(req.body, 'name', 'email');
  console.log(fields);

  // 3 IF SO. UPDATE FIELDS
  const updatedUser = await User.findByIdAndUpdate(req.user.id, fields, {
    new: true,
    runValidators: true,
  });
  // 4 LOG THE USER DATA
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deletecurrentuser = catchAsync(async (req, res, next) => {
  // for this we need to login then currt loggedin user will delete means active setto false then middwre do the filtering whcih user not active removes means hides from reqsut
  // 1 activate the active field set to false defult it is true when fiedl created user signined in
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // 3 res send with 204 no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'this route not yet defined',
  });
};
// exports.getSingleUser = (req, res) => {
//   res.status(500).send({
//     status: 'fail',
//     message: 'this route not yet defined',
//   });
// };
// exports.updateUser = (req, res) => {
//   res.status(500).send({
//     status: 'fail',
//     message: 'this route not yet defined',
//   });
// };

// deleting the 1 of the user in users list of data no need for authorizatiz no need for login direct delete
// exports.deleteUser = (req, res) => {
//   res.status(500).send({
//     status: 'fail',
//     message: 'this route not yet defined',
//   });
// };

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteUser = handlerFactory.deleteDoc(User);
exports.updateUser = handlerFactory.updateDoc(User);
// exports.createUser = handlerFactory.createDoc(User); we dont need this because we r create user via aunthencation signup
exports.getAllUsers = handlerFactory.getAllDoc(User);
exports.getSingleUser = handlerFactory.getDoc(User);
// module.exports = filteredFields;
