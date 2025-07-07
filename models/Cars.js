module.exports = function(sequelize, DataTypes) {
    const Cars =  sequelize.define('cars', {
      id: {
        type: DataTypes.STRING(256),
        allowNull: false,
        primaryKey: true,
      },
      car_name: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.STRING(256),
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      features: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      model: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      color: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      vin: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      engine_size: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      cylinder: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      doors: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      fuel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      drive_unit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      car_condition: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      mileage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      selling_price: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      vehicle_history: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      transmission: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: true
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
      tableName: 'cars',
    }
    );
    
    return Cars;
  };
  