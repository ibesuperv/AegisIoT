// accidentAlertWorker.js
import dotenv from "dotenv";
import axios from "axios";
import { firebaseDB } from "../config/firebase.js";

import User from "../models/User.js";
import EmergencyContact from "../models/EmergencyContact.js";
import Accident from "../models/Accident.js";
import Alert from "../models/Alert.js";

dotenv.config();

/* ---------------- FIREBASE ---------------- */
const userRef = firebaseDB.ref("user");

/* ---------------- TWILIO (COMMENTED) ---------------- */
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

/* ---------------- HELPERS ---------------- */

const formatPhone = (num) => {
  if (!num) return null;
  const clean = num.toString().replace(/\s+/g, "");
  if (clean.startsWith("+")) return clean;
  return `+91${clean}`;
};

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

/* ---------------- HOSPITAL LOOKUP ---------------- */

async function getNearestHospital(lat, lng) {
  try {
    const nearbyURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=hospital&key=${googleMapsApiKey}`;

    const res = await axios.get(nearbyURL);
    const hospitals = res.data.results;

    if (!hospitals || hospitals.length === 0) return null;

    const placeId = hospitals[0].place_id;

    const detailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number&key=${googleMapsApiKey}`;
    const detailsRes = await axios.get(detailsURL);

    return {
      name: detailsRes.data.result?.name || "Unknown Hospital",
      phone: detailsRes.data.result?.formatted_phone_number || null,
    };
  } catch (err) {
    console.error("❌ Hospital lookup failed:", err.message);
    return null;
  }
}

/* ---------------- FIREBASE LISTENER ---------------- */

userRef.on("child_changed", async (snapshot) => {
  const firebaseKey = snapshot.key;
  const data = snapshot.val();

  console.log(`📡 Firebase update for user: ${firebaseKey}`);

  if (data.accident !== true || data.smsSent === true) {
    console.log("ℹ️ No action required");
    return;
  }

  try {
    /* ---------------- FIND USER ---------------- */
    const email = firebaseKey.replace(/_/g, ".");
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.warn(`⚠️ User not found in DB: ${email}`);
      return;
    }

    /* ---------------- CREATE ACCIDENT ---------------- */
    const accident = await Accident.create({
      user_id: user.user_id,
      latitude: data.lat ?? null,
      longitude: data.lng ?? null,
    });

    console.log("🚨 Accident record created");

    /* ---------------- FETCH CONTACTS ---------------- */
    const contacts = await EmergencyContact.findOne({
      where: { user_id: user.user_id },
    });

    const locationLink =
      data.lat && data.lng
        ? `https://maps.google.com/?q=${data.lat},${data.lng}`
        : "Location unavailable";

    /* ---------------- HOSPITAL LOOKUP ---------------- */
    let hospital = null;
    if (data.lat && data.lng) {
      hospital = await getNearestHospital(data.lat, data.lng);
    }

    const message = ` ACCIDENT ALERT
User: ${user.username}
Location: ${locationLink}
Hospital: ${hospital?.name || "N/A"}
Hospital Phone: ${hospital?.phone || "N/A"}`;

    /* ---------------- RELATIVE ALERT ---------------- */
    if (contacts?.contact1) {
      console.log(`📨 Relative Alert → ${contacts.contact1}`);
      console.log(message);

      await client.messages.create({
        body: message,
        from: twilioNumber,
        to: contacts.contact1,
      });

      await Alert.create({
        accident_id: accident.accident_id,
        alert_type: "RELATIVE",
        recipient: contacts.contact1,
        status: "SENT",
      });
    }

    /* ---------------- SECOND RELATIVE ---------------- */
    if (contacts?.contact2) {
      console.log(`📨 Relative Alert → ${contacts.contact2}`);
      console.log(message);

      await client.messages.create({
        body: message,
        from: twilioNumber,
        to: contacts.contact2,
      });

      await Alert.create({
        accident_id: accident.accident_id,
        alert_type: "RELATIVE",
        recipient: contacts.contact2,
        status: "SENT",
      });
    }

    /* ---------------- HOSPITAL ALERT ---------------- */
    if (hospital?.phone) {
      console.log(`🏥 Hospital Alert → ${hospital.phone}`);
      console.log(message);

      // await client.messages.create({
      //   body: message,
      //   from: twilioNumber,
      //   to: formatPhone(hospital.phone),
      // });

      await Alert.create({
        accident_id: accident.accident_id,
        alert_type: "HOSPITAL",
        recipient: formatPhone(hospital.phone),
        status: "SENT",
      });
    }

    /* ---------------- FIREBASE FLAGS ---------------- */
    await snapshot.ref.update({ smsSent: true });
    console.log("✅ smsSent set to true");

    setTimeout(async () => {
      await snapshot.ref.update({ smsSent: false });
      console.log("🔁 smsSent reset after 15 mins");
    }, 15 * 60 * 1000);

    setTimeout(async () => {
      await snapshot.ref.update({ accident: false });
      console.log("🕒 accident reset after 24 hrs");
    }, 24 * 60 * 60 * 1000);
  } catch (err) {
    console.error("❌ Accident worker error:", err.message);
  }
});
