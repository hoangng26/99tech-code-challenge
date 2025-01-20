import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite',
});

export default sequelize;

export function initDatabase() {
  sequelize.addModels([__dirname + '/models/*.model.ts']);
  sequelize.sync();
}
