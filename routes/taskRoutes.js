const routes = require('express').Router();
const checkAuth = require('../middelwear/jwtAuth')
const {status,statusview, statusdelete, updated}= require('../controllers/statusCantrollers')
const{ taskCreate, taskView, taskFindOne, deleteRecord, updatedRecod }= require('../controllers/taskCantrollers')


routes.post('/taskAdd',checkAuth, taskCreate);
routes.get('/taskFind',checkAuth, taskView);
routes.get('/taskFindOne/:id',checkAuth,taskFindOne );
routes.delete('/taskDelete/:id',checkAuth, deleteRecord)
routes.patch('/taskUpdated/:id',checkAuth,updatedRecod)

// status routes
routes.post('/statusAdd',checkAuth, status);
routes.get('/statusView',checkAuth, statusview);
routes.delete('/statusDelete/:id',checkAuth, statusdelete)
routes.patch('/statusUpdated/:id',checkAuth, updated)


module.exports = routes;