// EmergencyContact.js

import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";
import User from "./User.js";

const EmergencyContact = sequelize.define("EmergencyContact", {
  contact_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  contact1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "emergency_contacts",
  timestamps: false,
});

// 1–1 relationship
User.hasOne(EmergencyContact, { foreignKey: "user_id" });
EmergencyContact.belongsTo(User, { foreignKey: "user_id" });

export default EmergencyContact;
