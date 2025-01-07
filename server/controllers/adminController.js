const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

exports.getAllAdmins = (req, res) => {
  Admin.findAllAdmins((err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.json("Error");
    }
    return res.json(data);
  });
};

exports.addAdmin = async (req, res) => {
  try {
    const { admin_name, admin_emailAddress, admin_username, admin_password } =
      req.body;
    const hashedPassword = await bcrypt.hash(admin_password, 10);
    Admin.createAdmin(
      admin_name,
      admin_emailAddress,
      admin_username,
      hashedPassword,
      (err, data) => {
        if (err) {
          console.error("Error inserting into the database:", err);
          return res.json("Error");
        }
        return res.json(data);
      }
    );
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAdminById = (req, res) => {
  const adminId = req.params.id;
  Admin.findAdminById(adminId, (err, data) => {
    if (err) {
      console.error("Error fetching admin:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(data[0]);
  });
};

exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { adminName, adminEmailAddress, adminUsername, adminPassword } =
      req.body;
    let hashedPassword = adminPassword;
    if (adminPassword) {
      hashedPassword = await bcrypt.hash(adminPassword, 10);
    }
    Admin.updateAdmin(
      adminId,
      adminName,
      adminEmailAddress,
      adminUsername,
      hashedPassword,
      (err, data) => {
        if (err) {
          console.error("Error updating admin:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json("Admin has been updated successfully.");
      }
    );
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteAdmin = (req, res) => {
  const adminId = req.params.id;
  Admin.deleteAdmin(adminId, (err, data) => {
    if (err) return res.json(err);
    return res.json("Admin has been deleted successfully.");
  });
};
