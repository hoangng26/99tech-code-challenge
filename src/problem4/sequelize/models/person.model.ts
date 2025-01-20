import { Column, Model, Table } from 'sequelize-typescript';

@Table
class Person extends Model {
  @Column
  name!: string;

  @Column
  birthday!: Date;
}

export default Person;
