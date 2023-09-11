const Router = require('express')
const router = new Router()
const groupController = require('../controllers/groupController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/', groupController.get)
router.get('/current/:id', groupController.getOne)
router.patch('/current/:id', checkRole('ADMIN'), groupController.modify)
router.delete('/current/:id', checkRole('ADMIN'), groupController.delete)
router.post('/', checkRole('ADMIN'), groupController.create)
router.post('/member', checkRole('ADMIN'), groupController.addMember)
router.delete('/member/:id', checkRole('ADMIN'), groupController.deleteMember)
router.patch('/member/:id', checkRole('ADMIN'), groupController.editMember)



module.exports = router