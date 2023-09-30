const {User} = require("../models/models");
const ApiError = require("../error/ApiError");
const webPush = require("web-push");
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
}


class NotificationController {

    async sendNotification (req, res, next) {
        try {
            const {message} = req.body
            const users = await User.findAll({
                where: {
                    subscription: {
                        [Op.ne]: null
                    }
                }
            })
            if (users) {
                users.forEach(async (u) => {
                    webPush.setVapidDetails(
                        `mailto:${user?.email}`,
                        vapidKeys.publicKey,
                        vapidKeys.privateKey
                    )
                    webPush.sendNotification(user.subscription, message)
                })
            }
            return res.json('success')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async subscribe (req, res, next) {
        try {
            const {user, subscription} = req.body
            if (user?.isAuth) {
                await User.update({subscription}, {where: {userId: user.id}})
            }
            return res.json('Подписан на уведомления')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }



}

module.exports = new NotificationController()