const routes = require('express').Router();
const imageUplodes = require('../middelwear/multer')
const { register, loginRecord, logoutRecord, sendemail, otp, newpass, profileUpdated }=require('../controllers/registerCantrollers');


routes.post('/createuser', register)
routes.post('/loginUser', loginRecord)
routes.get('/logout/:id', logoutRecord)
routes.post('/sendemail', sendemail)
routes.post('/otpdata', otp);;
routes.post('/newpassword', newpass);
routes.patch('/profileUpdated/:id',imageUplodes, profileUpdated)

module.exports= routes