module.exports = function(sequelize, DataTypes) {
    const Events =  sequelize.define('events', {
      id: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      url: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      poster: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      eventDate: {
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
      tableName: 'events',
    }
    );
    return Events;
  };
  