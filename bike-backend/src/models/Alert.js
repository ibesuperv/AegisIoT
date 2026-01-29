// Alert.js 

import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";
import Accident from "./Accident.js";

const Alert = sequelize.define("Alert", {
  alert_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  alert_type: {
    type: DataTypes.ENUM("RELATIVE", "HOSPITAL"),
    allowNull: false,
  },
  recipient: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("SENT", "FAILED"),
    defaultValue: "SENT",
  },
}, {
  tableName: "alerts",
  timestamps: true,
});

Accident.hasMany(Alert, { foreignKey: "accident_id" });
Alert.belongsTo(Accident, { foreignKey: "accident_id" });

export default Alert;
