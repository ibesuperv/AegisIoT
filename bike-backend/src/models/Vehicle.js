// Vehicle.js


import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";
import User from "./User.js";

const Vehicle = sequelize.define("Vehicle", {
  vehicle_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicle_number: {
    type: DataTypes.STRING,
  },
  vehicle_type: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "vehicles",
  timestamps: false,
});

User.hasMany(Vehicle, { foreignKey: "user_id" });
Vehicle.belongsTo(User, { foreignKey: "user_id" });

export default Vehicle;
