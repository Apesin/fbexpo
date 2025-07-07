module.exports = function(sequelize, DataTypes) {
    const User =  sequelize.define('generalsettings', {
      id: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true,
      },
      volunteer_text: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      volunteer_link: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      donate_text: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      donate_link: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      facebook: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      instagram: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      youtube: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      twitter: {
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
      tableName: 'generalsettings',
    }
    );
    return User;
  };
  