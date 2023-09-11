const {Sport, Category} = require("../models/models");
const ApiError = require("../error/ApiError");


class SportController {
    async getOne (req, res, next) {
        try {
            const {id} = req.params
            const sport = await Sport.findOne({where: {id}, include: [
                    {model: Category, include: [{
                            model: Category, as: "children"
                        }]}
                ]})
            return res.json(sport)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get (req, res, next) {
        try {
            const sports = await Sport.findAll({include: [
                    {model: Category, include: [{
                        model: Category, as: "children"
                        }]
                        },
                ]})
            return res.json(sports)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {name, categoryId} = req.body
            let {id} = req.params
            await Sport.update({name, categoryId}, {where: {id}})
            return res.json('Информация обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {name, categoryId} = req.body
            await Sport.create({name, categoryId})
            return res.json('Вид спорта добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await Sport.destroy({where: {id}})
            return res.json('Вид спорта удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }




}

module.exports = new SportController()