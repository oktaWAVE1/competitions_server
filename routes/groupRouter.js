const Router = require('express')
const router = new Router()
const groupController = require('../controllers/groupController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/:competitionId', groupController.get)
router.get('/current/:id', groupController.getOne)
router.patch('/current/:id', checkRole('ADMIN,MODERATOR'), groupController.modify)
router.delete('/current/:id', checkRole('ADMIN,MODERATOR'), groupController.delete)
router.post('/', checkRole('ADMIN,MODERATOR'), groupController.create)
router.post('/group/:groupId', checkRole('ADMIN,MODERATOR'), groupController.addAllContestants)
router.post('/member/:groupId', checkRole('ADMIN,MODERATOR'), groupController.addMember)
router.delete('/member/:id', checkRole('ADMIN,MODERATOR'), groupController.deleteMember)
router.patch('/member/:id', checkRole('ADMIN,MODERATOR'), groupController.editMember)



module.exports = router