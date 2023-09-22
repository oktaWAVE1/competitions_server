const {Group, GroupMember, Contestant, Heat} = require("../models/models");
const ApiError = require("../error/ApiError");


class GroupController {
    async getOne (req, res, next) {
        try {
            const {id} = req.params
            const group = await Group.findOne({where: {id}, include: [
                    {model: Heat, include: [
                        {model: Contestant}
                        ]},

                ]})
            return res.json(group)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get (req, res, next) {
        try {
            const {competitionId} = req.params
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
            const {description, competitionId, status, round, level} = req.body
            let {id} = req.params
            await Group.update({description, competitionId, status, round, level}, {where: {id}})
            return res.json('Информация о группе обновлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create (req, res, next) {
        try {
            const {description, competitionId, status, level} = req.body
            await Group.create({description, competitionId, status, level})
            return res.json('Группа добавлена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addMember (req, res, next) {
        try {
            const {groupId} = req.params
            const {contestantId} = req.body
            await GroupMember.create({contestantId: contestantId, groupId: groupId})
            return res.json('Участник добавлен в группу')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addAllContestants (req, res, next) {
        try {
            const {groupId} = req.params
            const {competitionId} = req.body
            await GroupMember.destroy({where: {groupId}})
            const contestants = await Contestant.findAll({where: {competitionId}})
            contestants.forEach(async c =>
                await GroupMember.create({contestantId: c.id, groupId})
            )
            return res.json('Все участники добавлены в группу')
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
            await GroupMember.destroy({where: {id}})
            return res.json('Участник удален из группы')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete (req, res, next) {
        try {
            const {id} = req.params
            await Group.destroy({where: {id}})
            await GroupMember.destroy({where: {groupId: id}})
            return res.json('Группа удалена')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new GroupController()