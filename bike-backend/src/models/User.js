// User.js 

import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../lib/db.js";

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_image: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "users",
  timestamps: true,
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(user.password_hash, salt);
});

User.prototype.comparePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

export default User;
