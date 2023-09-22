const Router = require('express')
const router = new Router()
const sportController = require('../controllers/sportController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/', sportController.get)
router.get('/current/:id', sportController.getOne)
router.patch('/current/:id', checkRole('ADMIN'), sportController.modify)
router.post('/', checkRole('ADMIN'), sportController.create)
router.delete('/current/:id', checkRole('ADMIN'), sportController.delete)


module.exports = router