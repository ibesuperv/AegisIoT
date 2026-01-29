// Accident.js 

import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";
import User from "./User.js";

const Accident = sequelize.define("Accident", {
  accident_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
  },
  status: {
    type: DataTypes.ENUM("DETECTED", "RESOLVED"),
    defaultValue: "DETECTED",
  },
}, {
  tableName: "accidents",
  timestamps: true,
});

User.hasMany(Accident, { foreignKey: "user_id" });
Accident.belongsTo(User, { foreignKey: "user_id" });

export default Accident;
