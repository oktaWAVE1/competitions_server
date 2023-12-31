const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const contestantRouter = require('./contestantRouter')
const teamRouter = require('./teamRouter')
const categoryRouter = require('./categoryRouter')
const sportRouter = require('./sportRouter')
const trickRouter = require('./trickRouter')
const groupRouter = require('./groupRouter')
const competitionRouter = require('./competitionRouter')
const heatRouter = require('./heatRouter')
const notificationRouter = require('./notificationRouter')

router.use('/user', userRouter)
router.use('/contestant', contestantRouter)
router.use('/team', teamRouter)
router.use('/category', categoryRouter)
router.use('/sport', sportRouter)
router.use('/trick', trickRouter)
router.use('/group', groupRouter)
router.use('/competition', competitionRouter)
router.use('/heat', heatRouter)
router.use('/notification', heatRouter)

module.exports = router