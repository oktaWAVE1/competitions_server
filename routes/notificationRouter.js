const Router = require('express')
const router = new Router()
const notificationController = require('../controllers/notificationController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', notificationController.subscribe)
router.post('/send', notificationController.sendNotification)


module.exports = router