const {Heat, HeatTrickModifier, HeatTrick, TeamHeat, Trick, CompetitionTrick, CompetitionModifier, TeamResults,
    Contestant, ContestantResults, GroupMember, Group, Competition, Category, Team
} = require("../models/models");
const ApiError = require("../error/ApiError");


class HeatController {
    async get (req, res, next) {
        try {
            const {id}  = req.params
            const heat = await Heat.findOne({where:{id}, include: [
                    {model: Competition, include: [
                            {model: CompetitionModifier}
                        ]},
                    {model: HeatTrick, include: [
                            {model: HeatTrickModifier, include: [
                                    {model: CompetitionModifier}
                                ]},
                            {model: CompetitionTrick, include: [
                                    {model: Trick, include: [
                                            {model: Category, include: [
                                                    {model: Category, as: 'parent'}
                                                ]}
                                        ]}
                                ]}
                        ]},
                    {model: Contestant},
                    {model: Group}
                ]})
            return res.json(heat)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const {order, round, teamHeatId, contestantId, competitionId, groupId}  = req.body
            const {pointsSum} = req.body || 0
            const {bonus} = req.body || 0
            const {total} = req.body || 0
            const {bonusDescription} = req.body || ""
            await Heat.create({order, round, teamHeatId, contestantId, competitionId, pointsSum, bonus, bonusDescription, total, groupId})
            return res.json('Заезд добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modify (req, res, next) {
        try {
            const {id} = req.params
            const {order, round, teamHeatId, contestantId, competitionId, pointsSum, bonus, bonusDescription, total, groupId}  = req.body

            await Heat.update({order, round, teamHeatId, contestantId, competitionId, pointsSum, bonus, bonusDescription, total, groupId}, {where: {id}})
            return res.json('Заезд обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            await Heat.destroy({where: {id}})
            return res.json('Заезд удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getTeamHeat (req, res, next) {
        try {
            const {id}  = req.params
            const teamHeat = await TeamHeat.findOne({where:{id}, include: [
                    {model: Competition},
                    {model: Heat, include: [
                            {model: HeatTrick, include: [
                                    {model: HeatTrickModifier},
                                    {model: CompetitionTrick, include: [
                                            {model: Trick}
                                        ]}
                                ]}
                        ]}
                ]})
            return res.json(teamHeat)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createTeamHeat(req, res, next) {
        try {
            const {teamId, order, round, groupId} = req.body
            await TeamHeat.create({teamId, order, round, groupId}).then(async (th) => {

                await Contestant.findAll({where: {teamId}, order:[['teamOrder', 'ASC']]}).then(async (data) => {
                    data.forEach(async (d) => {
                        Heat.create({order, round, teamHeatId: th.id, contestantId: d.id, competitionId: d.competitionId, groupId})
                    })
                })
            })
            return res.json('Командный заезд добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }




    async createFirstGroupHeats (req, res, next) {
        try {
            const {groupId, round} = req.body
            const group = await Group.findOne({where: {id: groupId}})
            let order = 0
            await GroupMember.findAll({where: {groupId}}).then(async (data) => {
                data.forEach(async d => {
                    order = order +1
                    await Heat.create({order: order, contestantId: d.contestantId, competitionId: group.competitionId, round, groupId})
                })
            })

            return res.json('Заезд группы добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async createNextRoundTeamHeats(req, res, next) {
        try {
            const {round, groupId} = req.body
            const teamHeats = await TeamHeat.findAll({where: {groupId, round}, order:[['total', 'ASC']]})
            let order = 0
            for (let i=0; i<teamHeats.length; i++) {
                order = order +1
                await TeamHeat.create({order: order, teamId: teamHeats[i]['teamId'], round: (Number(round)+1), groupId}).then(async(data)=> {
                const contestantHeats = await Heat.findAll({where: {groupId, teamHeatId: teamHeats[i]['id'], round}, order:[['order', 'ASC']]})
                let heatOrder = 0
                        console.log(contestantHeats.length)
                for (let j=0; j<contestantHeats.length; j++) {
                    console.log('******************')
                    console.log(j)
                    heatOrder = heatOrder +1
                    await Heat.create({order: heatOrder, teamHeatId: data.dataValues.id, contestantId: contestantHeats[j]['contestantId'], competitionId: contestantHeats[j]['competitionId'], round: (Number(round)+1), groupId})
                }
                }
                )
            }

            return res.json('Командный заезд добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createNextRoundsHeats (req, res, next) {
        try {
            const {groupId, round, nextRoundNum, nextGroupNum, nextGroupId, totalNum} = req.body
            const contestantHeats = await Heat.findAll({where: {groupId, round}, order:[['total', 'ASC']]})
            let order = 0
            for (let i=(totalNum-nextRoundNum); i<totalNum; i++) {
                order = order +1
                await Heat.create({order: order, contestantId: contestantHeats[i]['contestantId'], competitionId: contestantHeats[i]['competitionId'], round: (Number(round)+1), groupId})
            }
            for (let i=(totalNum-nextRoundNum-nextGroupNum); i<(totalNum-nextRoundNum); i++) {
                await GroupMember.update({groupId: nextGroupId}, {where: {contestantId: contestantHeats[i]['contestantId'], groupId}})
            }
            for (let i=0; i<(totalNum-nextRoundNum-nextGroupNum); i++) {
                await GroupMember.destroy({where: {contestantId: contestantHeats[i]['contestantId'], groupId}})
            }



            return res.json('Следующий этап добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async getGroupHeats (req, res, next) {
        try {
            const {groupId}  = req.params
            const {round} = req.query
            const groupHeats = await Heat.findAll({where:{groupId, round}, order: [['round', 'ASC']], include: [
                {model: Contestant},
                {model: HeatTrick, include: [
                    {model: HeatTrickModifier},
                    {model: CompetitionTrick, include: [
                        {model: Trick}
                    ]}
                ]}
            ]})
            return res.json(groupHeats)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getTeamGroupHeats (req, res, next) {
        try {
            const {groupId}  = req.params
            const {round} = req.query
            const teamHeats = await TeamHeat.findAll({where:{groupId, round}, order: [['round', 'ASC']], include: [
                    {model: Team},
                    {model: Heat, include: [
                            {model: Contestant},
                            {model: HeatTrick, include: [
                                    {model: HeatTrickModifier},
                                    {model: CompetitionTrick, include: [
                                            {model: Trick}
                                        ]}
                                ]}
                        ]}
                ]})
            return res.json(teamHeats)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async modifyTeamHeat (req, res, next) {
        try {
            const {id} = req.params
            const {order, round, bonus, bonusDescription, total}  = req.body
            await TeamHeat.update({order, round, bonus, bonusDescription, total}, {where: {id}})
            return res.json('Командный заезд обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteTeamHeat(req, res, next) {
        try {
            const {id} = req.params
            await TeamHeat.destroy({where: {id}})
            await Heat.destroy({where: {teamHeatId: id}})
            return res.json('Командный заезд удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async getTrick (req, res, next) {
        try {
            const {id}  = req.params
            const heatTrick = await HeatTrick.findOne({where:{id}})
            return res.json(heatTrick)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async addTrick(req, res, next) {
        try {
            const {basePoints, modifiers, total, heatId, competitionTrickId, competitionId}  = req.body
            const mods = await CompetitionModifier.findAll({where: {competitionId}, order: [['order', 'ASC']]})
            await HeatTrick.create({basePoints, modifiers, total, heatId, competitionTrickId}).then( async (data) => {
                mods.forEach(async (m) => {
                    await HeatTrickModifier.create({heatTrickId: data.id, value: m.defaultValue, multiplier: m.multiplier, competitionModifierId: m.id, order: m.order})
                })
            })

            return res.json('Трюк добавлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async modifyTrick (req, res, next) {
        try {
            const {id} = req.params
            const {basePoints, modifiers, total, heatId, competitionTrickId}  = req.body

            await HeatTrick.update({basePoints, modifiers, total, heatId, competitionTrickId}, {where: {id}})
            return res.json('Трюк обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteTrick(req, res, next) {
        try {
            const {id} = req.params
            await HeatTrick.destroy({where: {id}})
            await HeatTrickModifier.destroy({where: {heatTrickId: id}})
            return res.json('Трюк удален')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async editTrickModifier (req, res, next) {
        try {
            const {id} = req.params
            const {value}  = req.body
            await HeatTrickModifier.update({value}, {where: {id}})
            return res.json('Модификатор обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async trickCalculate (req, res, next) {
        try {
            const {id} = req.params
            const heatTrick = await HeatTrick.findOne({where: {id}})
            let total = heatTrick.basePoints
            await HeatTrickModifier.findAll({where: {heatTrickId: id}, order: [['order', 'ASC']]}).then(async (data) => {
                data.forEach(m => m.multiplier ? total*=m.value : total+=m.value)
                const modifiers = total - heatTrick.basePoints
                await HeatTrick.update({total, modifiers}, {where: {id}})
            })

            return res.json('Результат трюка обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async heatCalculate (req, res, next) {
        try {
            const {id} = req.params
            let {bonus, bonusDescription} = req.body
            let heat
            Heat.findOne({raw: true, where: {id}}).then(data => {
                if (!bonus) {
                    bonus = data.bonus || 0
                    bonusDescription = data.bonusDescription
                }
                    heat=data
            }).then(async () => {
            await HeatTrick.findAll({where: {heatId: id}}).then(async (heatTricks) => {
                let pointsSum = 0
                heatTricks.forEach(ht => pointsSum+=ht.total)
                let total = Number(pointsSum) + Number(bonus)
                await Heat.update({pointsSum, bonus, bonusDescription, total}, {where: {id}})
            }).then( async () => {

                await Heat.findAll({where: {competitionId: heat.competitionId, contestantId: heat.contestantId}}).then(async (heats) => {
                    let result = 0
                    heats.forEach(h => result += h.total)
                    await ContestantResults.update({total: result}, {where: {competitionId: heat.competitionId, contestantId: heat.contestantId}})
                })
            })

            })

            return res.json('Результат заезда обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async teamHeatCalculate (req, res, next) {
        try {
            const {id} = req.params
            const {bonus, bonusDescription} = req.body
            await Heat.findAll({where: {teamHeatId: id}}).then(async (heats) => {
                let pointsSum = 0
                heats.forEach(h => pointsSum+=h.total)
                let total = pointsSum + (bonus || 0)
                let team
                await TeamHeat.findOne({where: {id}}).then((data) => team=data)
                await TeamHeat.update({pointsSum, bonus, bonusDescription, total}, {where: {id}}).then(async ()=> {
                    let teamTotal = 0
                    await TeamHeat.findAll({where: {teamId: id}}).then(async (data)=> {
                        data.forEach(th => teamTotal= teamTotal+ Number(th.total))
                        console.log(teamTotal)
                        await TeamResults.update({total: teamTotal}, {where: {teamId: team.id}})
                    })
                })
            })


            return res.json('Результат командного заезда обновлен')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new HeatController()