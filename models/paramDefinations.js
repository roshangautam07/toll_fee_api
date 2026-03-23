
export default function ParameterDefinations (sequelize,Sequelize){
  const ParameterDefinations = sequelize.define(
    "parameterDefination",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      //form key label to show
      keyLabel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //form key
      keyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //parent tag path: ROOT, network.server, transaction.aid[]
      parentPath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paramCategory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      //string, number, boolean, array
      dataType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scopeLevel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isArrayItem: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isCritical: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "parameterDefination",
      freezeTableName: true,

    //   timestamps: true, // set false if you don’t want createdAt/updatedAt
    //   underscored: true, // converts camelCase to snake_case in DB
    }
  );

  return ParameterDefinations;
};