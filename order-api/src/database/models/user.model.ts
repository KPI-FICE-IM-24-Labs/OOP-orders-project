import { Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

export interface UserCreationAttributes {
  email: string;
  password: string;
  name: string;
}

@Table({ tableName: 'users', timestamps: true })
export class UserModel extends Model<UserModel, UserCreationAttributes> {
  @PrimaryKey
  @Column
  id!: string;

  @Unique
  @Column
  email!: string;

  @Column
  password!: string;

  @Column
  name!: string;
}
