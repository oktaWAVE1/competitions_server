const Router = require('express')
const router = new Router()
const competitionController = require('../controllers/competitionController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/', competitionController.getAll)
router.get('/current/:id', competitionController.getCurrent)
router.patch('/current/:id', checkRole('ADMIN'), competitionController.modify)
router.post('/', checkRole('ADMIN'), competitionController.create)
router.delete('/current/:id', checkRole('ADMIN'), competitionController.delete)
router.post('/img/', checkRole("ADMIN"), competitionController.addImg)
router.delete('/img/', checkRole("ADMIN"), competitionController.delImg)
router.post('/trick/', checkRole("ADMIN"), competitionController.addTrick)
router.get('/trick/:id', checkRole("ADMIN"), competitionController.getTrick)
router.delete('/trick/', checkRole("ADMIN"), competitionController.deleteTrick)
router.patch('/trick/', checkRole("ADMIN"), competitionController.modifyTrick)
router.post('/modifier/', checkRole("ADMIN"), competitionController.addModifier)
router.get('/modifier/', checkRole("ADMIN"), competitionController.getModifier)
router.delete('/modifier/', checkRole("ADMIN"), competitionController.deleteModifier)
router.patch('/modifier/', checkRole("ADMIN"), competitionController.modifyModifier)
router.post('/referee/', checkRole("ADMIN"), competitionController.addReferee)
router.get('/referee/', checkRole("ADMIN"), competitionController.getReferee)
router.delete('/referee/', checkRole("ADMIN"), competitionController.deleteReferee)


module.exports = router