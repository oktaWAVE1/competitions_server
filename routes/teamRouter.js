const Router = require('express')
const router = new Router()
const teamController = require('../controllers/teamController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/current/:id', teamController.getOne)
router.get('/:competitionId', teamController.getAll)
router.patch('/current/:id', checkRole('ADMIN'), teamController.modify)
router.post('/', checkRole('ADMIN'), teamController.create)
router.delete('/current/:id', checkRole('ADMIN'), teamController.delete)
router.patch('/img', checkRole('ADMIN'), teamController.changeImg)
router.delete('/img/:id', checkRole('ADMIN'), teamController.deleteImg)



module.exports = router