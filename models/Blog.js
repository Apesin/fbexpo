module.exports = function(sequelize, DataTypes) {
    const Blog =  sequelize.define('blog', {
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
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      poster: {
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
      tableName: 'blog',
    }
    );
    return Blog;
  };
  