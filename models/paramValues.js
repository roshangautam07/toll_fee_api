
export default function ParameterValues (sequelize,Sequelize){
    const ParameterValues = sequelize.define(
      "parameterValues",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      paramDefId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: 'parameterDefination',
            key: 'id',
        },
      },
      instanceIndex: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      schemeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      defaultValue: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
      {
        tableName: "parameterValues",
        freezeTableName: true,

      //   timestamps: true, // set false if you don’t want createdAt/updatedAt
      //   underscored: true, // converts camelCase to snake_case in DB
      }
    );
  
    return ParameterValues;
  };