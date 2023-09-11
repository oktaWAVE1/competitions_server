const {Competition, Category, CompetitionImages, CompetitionTrick, Trick, CompetitionModifier, Referee, TeamResults, Team, ContestantResults, Contestant} = require("../models/models");
const ApiError = require("../error/ApiError");
const imageService = require('../service/image-service')
const path = require("path");
const directory = path.resolve(__dirname, '..', 'static/images/competitions')
const resizeWidth = parseInt(process.env.RESIZE_WIDTH)


class CompetitionController {
    async getAll (req, res, next) {
        try {
            const competition = await Competition.findAll({include: [
                    {model: CompetitionImages}
                ]})
            return res.json(competition)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getCurrent (req, res, next) {
        try {
            const {id} = req.params
            const competitions = await Competition.findAll({where: {id}, include: [
                    {model: CompetitionImages},
                    {model: CompetitionTrick, include: [
                            {model: Trick, include: [
                                    {model: Category, include: [
                                            {model: Category, as: "parent"}
                                        ]}
                                ]}
                        ]},
                    {model: Team, include: [
                        {model: TeamResults},
                        {model: Contestant, include: [{model: ContestantResults}]}
                        ]},
                    {model: Contestant, include: [{model: ContestantResults}]},
                ]})
            return res.json(competitions)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async modify (req, res, next) {
        try {
            const {name, description, type, adminId} = req.body
            let {id} = req.params
            await Competition.update({name, description, type, adminId}, {where: {id}})
            return res.json('Информация о соревновании обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            let file
            try {
                file = req.files.file
            } catch {
                console.log("no imgs")
            }
            const {name, description, type, adminId, copy, competitionId} = req.body
            await Competition.create({name, description, type, adminId}).then(async (data) => {
                if(file) {
                    if(Array.isArray(file)) {
                        file.forEach(async(img) => {
                            const fileName = await imageService.saveImg(img, directory, resizeWidth)
                            await CompetitionImages.create({img: fileName, competitionId: data.id} )
                        })
                    } else {
                        (async () => {
                            const fileName = await imageService.saveImg(file, directory, resizeWidth)
                            await CompetitionImages.create({img: fileName, competitionId: data.id})
                        })()
                    }
                }
                if (copy) {
                    const tricks = await CompetitionTrick.findAll({where: {competitionId}})
                    const modifiers = await CompetitionModifier.findAll({where: {competitionId}})
                    tricks.forEach(async (t) => {
                        CompetitionTrick.create({competitionId: data.id, points: t.points, trickId: t.trickId})
                    })
                    modifiers.forEach((async (m) => {
                        CompetitionModifier.create({competitionId: data.id, name: m.name, description: m.description, multiplier: m.multiplier, min: m.min, max: m.max, defaultValue: m.defaultValue})
                    }))
                }
                return res.json('Соревнование добавлено')
            })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async addImg (req, res, next) {
        const {competitionId} = req.body
        const file = req?.files?.file
        try {
            if(Array.isArray(file)) {
                file.forEach(async(img) => {
                    const fileName = await imageService.saveImg(img, directory, resizeWidth)
                    await CompetitionImages.create({img: fileName, competitionId} )
                })
                return res.json('Файлы добавлены')
            } else if (file){
                (async () => {
                    const fileName = await imageService.saveImg(file, directory, resizeWidth)
                    await CompetitionImages.create({img: fileName, competitionId})
                })()
                return res.json('Файлы добавлены')
            }
            return res.json('Нет файлов')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async delImg (req, res, next) {
        const {id} = req.body
        const img = await CompetitionImages.findOne({where: {id}})
        try {
            await imageService.delImg(img?.dataValues?.img, directory)
            await CompetitionImages.destroy({
                where: {id},
            })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        return res.json('Файл удален')
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            const imgList = await CompetitionImages.findAll({where: {competitionId: id}})
            await Competition.destroy({where: {id}})
            await CompetitionImages.destroy({where: {competitionId: id}})
            imgList.forEach(async (img) => {
                await imageService.delImg(img?.dataValues?.img, directory)
            })
            return res.json('Соревнование удалено')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async getTrick (req, res, next) {
        try {
            console.log(req.body)
            const {id}  = req.params
            const competitionTricks = await CompetitionTrick.findOne({where:{id}, include: [
                    {model: Trick, include: [
                            {model: Category, include: [
                                    {model: Category, as: "parent"}
                                ]}
                        ]}
                ]})
            return res.json(competitionTricks)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addTrick (req, res, next) {
        try {
            const {competitionId, trickId}  = req.body
            let {points} = req.body
            if(!points){
                await Trick.findOne({where: {id: trickId}}).then( async (data) => {
                    await CompetitionTrick.create({competitionId, trickId, points: data.defaultPoints})
                })

            } else {
                await CompetitionTrick.create({competitionId, trickId, points})
            }
            return res.json('Трюк добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modifyTrick (req, res, next) {
        try {
            const {id, points}  = req.body

            await CompetitionTrick.update({points}, {where: {id}})
            return res.json('Значение обновлено')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteTrick (req, res, next) {
        try {
            const {id}  = req.body
            await CompetitionTrick.destroy({where: {id}})
            return res.json('Трюк удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getModifier (req, res, next) {
        try {
            const {competitionId}  = req.body
            const competitionModifiers = await CompetitionModifier.findAll({where:{competitionId}})
            return res.json(competitionModifiers)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addModifier (req, res, next) {
        try {
            const {name, description, multiplier, min, max, defaultValue, competitionId}  = req.body

            await CompetitionModifier.create({name, description, multiplier, min, max, defaultValue, competitionId})
            return res.json('Модификатор добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modifyModifier (req, res, next) {
        try {
            const {name, description, multiplier, min, max, defaultValue, id}  = req.body

            await CompetitionModifier.update({name, description, multiplier, min, max, defaultValue}, {where: {id}})
            return res.json('Модификатор обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteModifier(req, res, next) {
        try {
            const {id}  = req.body
            await CompetitionModifier.destroy({where: {id}})
            return res.json('Модификатор удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async addReferee (req, res, next) {
        try {
            const {userId, competitionId}  = req.body
            await Referee.create({userId, competitionId})
            return res.json('Судья добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getReferee (req, res, next) {
        try {
            const {competitionId}  = req.body
            const referees = await Referee.findAll({where:{competitionId}})
            return res.json(referees)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteReferee(req, res, next) {
        try {
            const {id}  = req.body
            await Referee.destroy({where: {id}})
            return res.json('Судья удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new CompetitionController()