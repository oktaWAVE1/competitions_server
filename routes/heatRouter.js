const Router = require('express')
const router = new Router()
const heatController = require('../controllers/heatController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/current/:id', heatController.get)
router.patch('/current/:id', checkRole('ADMIN'), heatController.modify)
router.post('/', checkRole('ADMIN'), heatController.create)
router.delete('/current/:id', checkRole('ADMIN'), heatController.delete)
router.get('/team_heat/:id', heatController.getTeamHeat)
router.patch('/team_heat/:id', checkRole('ADMIN'), heatController.modifyTeamHeat)
router.post('/team_heat/', checkRole('ADMIN'), heatController.createTeamHeat)
router.post('/group/', checkRole('ADMIN'), heatController.createGroupHeats)
router.get('/group/:groupId', heatController.getGroupHeats)
router.delete('/team_heat/:id', checkRole('ADMIN'), heatController.deleteTeamHeat)
router.post('/calculate_heat/:id', checkRole('ADMIN'), heatController.heatCalculate)
router.post('/calculate_team_heat/:id', checkRole('ADMIN'), heatController.teamHeatCalculate)
router.get('/trick/:id', heatController.getTrick)
router.patch('/trick/:id', checkRole('ADMIN'), heatController.modifyTrick)
router.post('/trick', checkRole('ADMIN'), heatController.addTrick)
router.post('/calculate_trick/:id', checkRole('ADMIN'), heatController.trickCalculate)
router.delete('/trick/:id', checkRole('ADMIN'), heatController.deleteTrick)
router.patch('/modifier/:id', checkRole('ADMIN'), heatController.editTrickModifier)


module.exports = router