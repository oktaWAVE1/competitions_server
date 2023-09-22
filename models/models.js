const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'user', allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
    telephone: {type: DataTypes.STRING, unique: true}
})

const UserRefreshToken = sequelize.define('user_refresh_token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING},
})

const Contestant = sequelize.define('contestant', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    number: {type: DataTypes.INTEGER, allowNull: true},
    img: {type: DataTypes.STRING, allowNull: true},
    teamOrder: {type: DataTypes.INTEGER, allowNull: true},
    status: {type: DataTypes.STRING, allowNull: true}
})

const ContestantResults = sequelize.define('contestant_results', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    total: {type: DataTypes.FLOAT, defaultValue: 0}
}, {timestamps: false})

const Referee = sequelize.define('referee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Team = sequelize.define('team', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    color: {type: DataTypes.STRING, allowNull:true},
    img: {type: DataTypes.STRING, allowNull: true}
}, {timestamps: false})

const TeamResults = sequelize.define('team_results', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    total: {type: DataTypes.FLOAT, defaultValue: 0}
}, {timestamps: false})

const Sport = sequelize.define('sport', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
}, {timestamps: false})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false})


const Trick = sequelize.define('trick', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    defaultLevel: {type: DataTypes.INTEGER, defaultValue: 1},
    defaultPoints: {type: DataTypes.FLOAT, allowNull: true},
    description: {type: DataTypes.STRING, allowNull: true}
}, {timestamps: false})

const CompetitionTrick = sequelize.define('competition_trick', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    level: {type: DataTypes.INTEGER, allowNull: false},
    points: {type: DataTypes.FLOAT, allowNull: false}
}, {timestamps: false})

const Competition = sequelize.define('competition', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    teamType: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    adminId: {type: DataTypes.INTEGER, allowNull: false}
})

const CompetitionImages = sequelize.define('competition_images', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING, allowNull: true}
}, {timestamps: false})

const CompetitionModifier = sequelize.define('competition_modifier', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    multiplier: {type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false},
    min: {type: DataTypes.FLOAT, allowNull: false},
    max: {type: DataTypes.FLOAT, allowNull: false},
    step: {type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.05},
    defaultValue: {type: DataTypes.FLOAT, allowNull: false},
    order: {type: DataTypes.INTEGER, allowNull:false}
}, {timestamps: false})

const TeamHeat = sequelize.define('team_heat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order: {type: DataTypes.INTEGER, defaultValue: 1},
    round: {type: DataTypes.INTEGER, defaultValue: 1},
    pointsSum: {type: DataTypes.FLOAT, defaultValue: 0},
    bonus: {type: DataTypes.FLOAT, defaultValue: 0},
    bonusDescription: {type: DataTypes.STRING, defaultValue: ''},
    total: {type: DataTypes.FLOAT, allowNull: true, defaultValue: 0}
}, {timestamps: false})

const Heat = sequelize.define('heat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order: {type: DataTypes.INTEGER, defaultValue: 1},
    round: {type: DataTypes.INTEGER, defaultValue: 1},
    pointsSum: {type: DataTypes.FLOAT, defaultValue: 0},
    bonus: {type: DataTypes.FLOAT, defaultValue: 0},
    bonusDescription: {type: DataTypes.STRING, defaultValue: ''},
    total: {type: DataTypes.FLOAT, allowNull: true, defaultValue: 0}
})

const Group = sequelize.define('group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING, defaultValue: ''},
    status: {type: DataTypes.STRING, defaultValue: ''},
    level: {type: DataTypes.INTEGER, defaultValue: 5},
    round: {type: DataTypes.INTEGER, defaultValue: 1}
}, {timestamps: false})

const GroupMember = sequelize.define('group_member', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, allowNull: true}
}, {timestamps: false})

const HeatTrick = sequelize.define('heat_trick', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    basePoints: {type: DataTypes.FLOAT, allowNull: false},
    modifiers: {type: DataTypes.FLOAT, allowNull: true},
    total: {type: DataTypes.FLOAT, allowNull: true}
})

const HeatTrickModifier = sequelize.define('heat_trick_modifier', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.FLOAT, allowNull: false},
    multiplier: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    order: {type: DataTypes.INTEGER, allowNull:false}
}, {timestamps: false})

Sport.hasMany(Category)
Category.belongsTo(Sport)

Category.hasMany(Category, {as: "children", foreignKey: 'categoryId'})
Category.belongsTo(Category, {as: "parent", foreignKey: 'categoryId'})

Category.hasMany(Trick)
Trick.belongsTo(Category)

Trick.hasMany(CompetitionTrick)
CompetitionTrick.belongsTo(Trick)

Competition.hasMany(CompetitionTrick)
CompetitionTrick.belongsTo(Competition)

CompetitionTrick.hasMany(HeatTrick)
HeatTrick.belongsTo(CompetitionTrick)

Competition.hasMany(Group)
Group.belongsTo(Competition)

Sport.hasMany(Trick)
Trick.belongsTo(Sport)

Group.hasMany(GroupMember)
GroupMember.belongsTo(Group)

Contestant.hasMany(GroupMember)
GroupMember.belongsTo(Contestant)

Competition.hasMany(CompetitionImages)
CompetitionImages.belongsTo(Competition)

Competition.hasMany(Contestant)
Contestant.belongsTo(Competition)

Team.hasMany(Contestant)
Contestant.belongsTo(Team)

Team.hasOne(TeamResults)
TeamResults.belongsTo(Team)

Contestant.hasOne(ContestantResults)
ContestantResults.belongsTo(Competition)

Competition.hasMany(ContestantResults)
ContestantResults.belongsTo(Competition)

Competition.hasMany(TeamResults)
TeamResults.belongsTo(Competition)

Competition.hasMany(CompetitionModifier)
CompetitionModifier.belongsTo(Competition)

Competition.hasMany(Team)
Team.belongsTo(Competition)

CompetitionModifier.hasMany(HeatTrickModifier)
HeatTrickModifier.belongsTo(CompetitionModifier)

Team.hasMany(TeamHeat)
TeamHeat.belongsTo(Team)

TeamHeat.hasMany(Heat)
Heat.belongsTo(TeamHeat)

Heat.hasMany(HeatTrick)
HeatTrick.belongsTo(Heat)

HeatTrick.hasMany(HeatTrickModifier)
HeatTrickModifier.belongsTo(HeatTrick)

Contestant.hasMany(Heat)
Heat.belongsTo(Contestant)

Competition.hasMany(Heat)
Heat.belongsTo(Competition)

Group.hasMany(Heat)
Heat.belongsTo(Group)

Group.hasMany(TeamHeat)
TeamHeat.belongsTo(Group)

Sport.hasMany(Competition)
Competition.belongsTo(Sport)

Competition.hasMany(Referee)
Referee.belongsTo(Competition)

User.hasMany(Referee)
Referee.belongsTo(User)

User.hasOne(UserRefreshToken)
UserRefreshToken.belongsTo(User)

module.exports = {
    Competition,
    CompetitionModifier,
    CompetitionTrick,
    CompetitionImages,
    User,
    UserRefreshToken,
    Contestant,
    ContestantResults,
    Team,
    TeamResults,
    Heat,
    TeamHeat,
    HeatTrick,
    HeatTrickModifier,
    Trick,
    Category,
    Sport,
    Referee,
    GroupMember,
    Group
}