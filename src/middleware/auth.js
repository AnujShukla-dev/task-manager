const jwt = require('jsonwebtoken');
const {User} = require('../models/user.js');

const auth = async (req, res, next)=>{
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'thisismynewcourse');
    const user = await User.findOne({'_id': decoded._id, 'tokens.token': token});
    if (!user) {
      throw new Error();
    }

    req.user= user;
    req.token = token;
    next();
    console.log('auth middleware');
  } catch (e) {
    res.status(403).send({error: e+' Please Authenticate'});
  }
};


module.exports = auth;
