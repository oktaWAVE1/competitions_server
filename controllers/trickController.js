const {Trick, Category} = require("../models/models");
const ApiError = require("../error/ApiError");


class TrickController {
    async getOne (req, res, next) {
        try {
            const {id} = req.params
            const trick = await Trick.findOne({where: {id}, include: [
                    {model: Category}
                ]})
            return res.json(trick)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get (req, res, next) {
        try {
            const {categoryId} = req.params
            const tricks = await Trick.findAll({where: {categoryId}, include: [
                    {model: Category},
                ]})
            return res.json(tricks)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {name, description, defaultPoints, categoryId} = req.body
            let {id} = req.params
            await Trick.update({name, description, defaultPoints, categoryId}, {where: {id}})
            return res.json('Информация о трюке обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {name, description, defaultPoints, categoryId} = req.body
            await Trick.create({name, description, defaultPoints, categoryId})
            return res.json('Трюк добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await Trick.destroy({where: {id}})
            return res.json('Трюк удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}


module.exports = new TrickController()