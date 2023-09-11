const {Team, Contestant, ContestantResults} = require('../models/models')
const ApiError = require("../error/ApiError");
const imageService = require('../service/image-service')
const path = require("path");
const directory = path.resolve(__dirname, '..', 'static/images/contestants')
const resizeWidth = parseInt(process.env.RESIZE_WIDTH)


class ContestantController {
    async getOne (req, res, next) {
        try {
            const {id} = req.params
            const contestant = await Contestant.findOne({where: {id}, include: [
                    {model: ContestantResults},
                    {model: Team},
                ]})
            return res.json(contestant)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get (req, res, next) {
        try {
            const {competitionId} = req.params
            const contestants = await Contestant.findAll({where: {competitionId}, include: [
                    {model: Team},
                ]})
            return res.json(contestants)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {name, number, group, status, competitionId, teamId} = req.body
            let {id} = req.params
            await Contestant.update({name, number, group, status, competitionId, teamId}, {where: {id}})
            return res.json('Информация обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {name, number, group, status, competitionId, teamId} = req.body
            let file
            try {
                file = req.files.file
                console.log(file.length)
            } catch {
                console.log("no imgs")
            }
            let img
            if (file){
                img = await imageService.saveImg(file, directory, resizeWidth)
            }
            await Contestant.create({name, number, group, status, img, competitionId, teamId}).then(
                async (data) => {
                    await ContestantResults.create({contestantId: data.id, competitionId})
                }

            )
            return res.json('Участник добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await Contestant.destroy({where: {id}})
            await ContestantResults.destroy({where: {contestantId: id}})
            return res.json('Участник удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteImg (req, res, next) {
        try {
            const {id} = req.params
            const contestant = await Team.findByPk(id)
            if (contestant?.img){
                await imageService.delImg(contestant?.img, directory)
                await Contestant.update({img: null},{where: {id: team.id}})
            }
            return res.json('Изображение участника удалено')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeImg (req, res, next){
        try {
            const {id} = req.params
            const contestant = await Contestant.findByPk(id)
            if (contestant?.img){
                await imageService.delImg(contestant?.img, directory)
            }
            let file
            try {
                file = req.files.file
                console.log(file.length)
            } catch {
                console.log("no imgs")
            }
            let img
            if (file){
                img = await imageService.saveImg(file, directory, resizeWidth)
            }
            await Contestant.update({img},{where: {id: contestant.id}})
            return res.json('Изображение участника изменено')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }




}


module.exports = new ContestantController()