const {Category} = require("../models/models");
const ApiError = require("../error/ApiError");


class CategoryController {

    async getOne (req, res, next) {
        try {
            const {id} = req.params
            const category = await Category.findOne({where: {id}, include: [
                    {model: Category, as: 'children'}
                ]})
            return res.json(category)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get (req, res, next) {
        try {
            const {sportId} = req.params
            const categories = await Category.findAll({where: {sportId}, include: [
                    {model: Category, as: 'children'},
                ]})
            return res.json(categories)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {name, sportId, categoryId} = req.body
            let {id} = req.params
            await Category.update({name, sportId, categoryId}, {where: {id}})
            return res.json('Информация обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {name, sportId, categoryId} = req.body
            await Category.create({name, sportId, categoryId})
            return res.json('Категория добавлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await Category.destroy({where: {id}})
            return res.json('Категория удалена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }





}

module.exports = new CategoryController()