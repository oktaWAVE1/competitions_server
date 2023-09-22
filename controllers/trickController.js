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
            const {sportId} = req.params
            const tricks = await Trick.findAll({where: {sportId}, order:[['categoryId', 'ASC']], include: [
                    {model: Category,
                        include: [
                            {model: Category, as: 'parent'}
                        ]},
                ]})
            return res.json(tricks)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {name, description, defaultPoints, defaultLevel, categoryId} = req.body
            let {id} = req.params
            await Trick.update({name, description, defaultPoints, defaultLevel, categoryId}, {where: {id}})
            return res.json('Информация о трюке обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {name, description, defaultPoints, defaultLevel, categoryId, sportId} = req.body
            await Trick.create({name, description, defaultPoints, defaultLevel, categoryId, sportId})
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