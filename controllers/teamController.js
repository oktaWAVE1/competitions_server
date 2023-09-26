const {Team, Contestant, TeamResults, ContestantResults, TeamHeat} = require('../models/models')
const ApiError = require("../error/ApiError");
const imageService = require('../service/image-service')
const path = require("path");
const directory = path.resolve(__dirname, '..', 'static/images/teams')
const resizeWidth = parseInt(process.env.RESIZE_WIDTH)


class TeamController {
    async getOne (req, res, next) {
        try {
            console.log(req.params)
            const {id} = req.params
            const team = await Team.findOne({where: {id}, include: [
                    {model: TeamResults},
                    {model: TeamHeat},
                    {model: Contestant},
                ]})
            return res.json(team)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll (req, res, next) {
        try {
            const {competitionId} = req.params
            console.log(competitionId)
            const team = await Team.findAll({where: {competitionId}, include: [
                    {model: TeamResults},
                    {model: Contestant, include: [
                        {model: ContestantResults}
                        ]},
                ]})
            return res.json(team)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async modify (req, res, next) {
        try {
            const {name, description, color, competitionId} = req.body
            const {id} = req.params
            await Team.update({name, description, color, competitionId}, {where: {id}})
            return res.json('Информация обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {name, description, color, competitionId} = req.body
            let file
            try {
                file = req.files.file
            } catch {
                console.log("no imgs")
            }
            let img
            if (file){
            img = await imageService.saveImg(file, directory, resizeWidth)
            }
            await Team.create({name, description, color, img, competitionId}).then(async (data) => {
                await TeamResults.create({teamId: data.id, competitionId})
            })
            return res.json('Команда добавлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            const team = await Team.findByPk(id)
            if (team?.img){
            await imageService.delImg(team?.img, directory)
            }
            await Team.destroy({where: {id}})
            await Contestant.destroy({where: {teamId: id}})
            await TeamResults.destroy({where: {teamId: id}})
            return res.json('Команда удалена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async deleteImg (req, res, next) {
        try {
            const {id} = req.params
            const team = await Team.findOne({where: {id}})
            if (team?.img){
                await imageService.delImg(team?.img, directory)
                await Team.update({img: null},{where: {id}})
            }
            return res.json('Изображение команды удалено')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeImg (req, res, next){
        try {
            const {id} = req.body
            const team = await Team.findOne({where: {id}})
            if (team?.img){
                await imageService.delImg(team?.img, directory)
            }
            let file
            try {
                file = req.files.file
            } catch {
                console.log("no imgs")
            }
            let img
            if (file){
                img = await imageService.saveImg(file, directory, resizeWidth)
            }
            await Team.update({img},{where: {id}})
            return res.json('Изображение команды изменено')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}


module.exports = new TeamController()