const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/:sportId', categoryController.get)
router.get('/current/:id', categoryController.getOne)
router.patch('/current/:id', checkRole('ADMIN'), categoryController.modify)
router.post('/', checkRole('ADMIN'), categoryController.create)
router.delete('/current/:id', checkRole('ADMIN'), categoryController.delete)


module.exports = router