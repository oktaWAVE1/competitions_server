const Router = require('express')
const router = new Router()
const contestantController = require('../controllers/constestantController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')
const teamController = require("../controllers/teamController");


router.get('/current/:competitionId', contestantController.get)
router.get('/person/:id', contestantController.getOne)
router.patch('/person/:id', checkRole('ADMIN'), contestantController.modify)
router.post('/', checkRole('ADMIN'), contestantController.create)
router.delete('/person/:id', checkRole('ADMIN'), contestantController.delete)
router.patch('/img/:id', checkRole('ADMIN'), contestantController.changeImg)
router.delete('/img/:id', checkRole('ADMIN'), contestantController.deleteImg)


module.exports = router