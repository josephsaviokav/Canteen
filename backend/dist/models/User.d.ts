import { Model, type Optional } from 'sequelize';
interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'USER' | 'ADMIN';
    created_at?: Date;
    updated_at?: Date;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'USER' | 'ADMIN';
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map