import Sequelize from 'sequelize';
import User from './users.js';
import Branch from './branch.js';
import BillingCategory from '././billingCategory.js'
import FiscalYear from './fiscalYear.js';
import Billing from './billing.js'
import BillingDetails from './billingDetails.js';
import BillReturn from './billiReturn.js';
import sequelize from '../config/mysql.js';
sequelize.authenticate()
  .then(() => {
    console.log('\x1b[32m', 'DB connected', '\x1b[0m');
  })
  .catch((e) => {
    console.log('\x1b[41m', 'Fail to connect DB', '\x1b[0m',e);
    // eslint-disable-next-line no-undef
    process.exit(1);
  });
const db = {};
db.Users = User(sequelize, Sequelize);
db.Branch = Branch(sequelize, Sequelize);
db.BillingCategory = BillingCategory(sequelize, Sequelize);

db.BillingCategory.belongsTo(db.Branch, {
  foreignKey: {
    name: 'branch_id',
    field: 'branch_id',
  },
});
db.Branch.hasMany(db.BillingCategory, {
  foreignKey: {
    name: 'branch_id',
    field: 'branch_id',
  },
})

db.FiscalYear = FiscalYear(sequelize, Sequelize);
db.Billing = Billing(sequelize, Sequelize);
db.BillingDetails = BillingDetails(sequelize, Sequelize);

db.BillingCategory.hasMany(db.BillingDetails, {
  foreignKey: {
    name: 'billing_category_id',
    field: 'billing_category_id',
  },
});
db.BillingDetails.belongsTo(db.BillingCategory, {
  foreignKey: {
    name: 'billing_category_id',
    field: 'billing_category_id',
  },
});

db.BillingDetails.belongsTo(db.Billing, {
  foreignKey: {
    name: 'billing_id',
    field: 'billing_id',
  },
});
db.Billing.hasOne(db.BillingDetails, {
  foreignKey: {
    name: 'billing_id',
    field: 'billing_id',
  },
})

db.BillReturn = BillReturn(sequelize, Sequelize);

db.BillReturn.belongsTo(db.Billing, {
  foreignKey: {
    name: 'billing_id',
    field: 'billing_id',
  },
})

db.Billing.hasOne(db.BillReturn, {
  foreignKey: {
    name: 'billing_id',
    field: 'billing_id',
  },
})








db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;