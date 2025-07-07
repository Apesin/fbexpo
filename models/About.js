module.exports = function(sequelize, DataTypes) {
    const About =  sequelize.define('about', {
            id: {
                type: DataTypes.STRING(256),
                allowNull: false,
                primaryKey: true,
            },
            description: {
                type: DataTypes.STRING(256),
                allowNull: false
            },
            dateCreated: {
                type: DataTypes.DATE,
                allowNull: false
            },
            dateModified: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            timestamps: false,
            tableName: 'about',
        }
    );
    return About;
};
