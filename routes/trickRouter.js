const Router = require('express')
const router = new Router()
const trickController = require('../controllers/trickController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/:categoryId', trickController.get)
router.get('/current/:id', trickController.getOne)
router.patch('/current/:id', checkRole('ADMIN'), trickController.modify)
router.post('/', checkRole('ADMIN'), trickController.create)
router.delete('/current/:id', checkRole('ADMIN'), trickController.delete)


module.exports = router