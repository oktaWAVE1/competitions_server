const {Group, GroupMember, Contestant} = require("../models/models");
const ApiError = require("../error/ApiError");


class GroupController {
    async getOne (req, res, next) {
        try {
            const {id} = req.params
            const group = await Group.findOne({where: {id}, include: [
                    {model: GroupMember, include: [
                            {model: Contestant}
                        ]}
                ]})
            return res.json(group)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get (req, res, next) {
        try {
            const {competitionId} = req.body
            const groups = await Group.findAll({where: {competitionId}, include: [
                    {model: GroupMember, include: [
                            {model: Contestant}
                        ]}
                ]})
            return res.json(groups)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {description, competitionId, status, round} = req.body
            let {id} = req.params
            await Group.update({description, competitionId, status, round}, {where: {id}})
            return res.json('Информация о группе обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {description, competitionId, status, round} = req.body
            await Group.create({description, competitionId, status, round})
            return res.json('Группа добавлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addMember (req, res, next) {
        try {
            const {contestantId, groupId, status} = req.body
            await GroupMember.create({contestantId, groupId, status})
            return res.json('Участник добавлен в группу')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async editMember (req, res, next) {
        try {
            const {id} = req.params
            const {contestantId, groupId, status} = req.body
            await GroupMember.update({contestantId, groupId, status}, {where: {id}})
            return res.json('Участник группы изменен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteMember (req, res, next) {
        try {
            const {id} = req.params
            await GroupMember.delete({where: {id}})
            return res.json('Участник удален из группы')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await Group.destroy({where: {id}})
            return res.json('Группа удалена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new GroupController()