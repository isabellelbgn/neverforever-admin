const dbConnection = require("../config/db");

module.exports = {
  findAdminByUsername: (username, callback) => {
    const query = "SELECT * FROM admin WHERE admin_username = ?";
    dbConnection.query(query, [username], callback);
  },

  findAllAdmins: (callback) => {
    const query = "SELECT * FROM admin";
    dbConnection.query(query, callback);
  },

  createAdmin: (
    admin_name,
    admin_emailAddress,
    admin_username,
    admin_password,
    callback
  ) => {
    const query = `
      INSERT INTO admin (admin_name, admin_emailAddress, admin_username, admin_password)
      VALUES (?, ?, ?, ?)
    `;
    dbConnection.query(
      query,
      [admin_name, admin_emailAddress, admin_username, admin_password],
      callback
    );
  },

  findAdminById: (adminId, callback) => {
    const query = "SELECT * FROM admin WHERE admin_id = ?";
    dbConnection.query(query, [adminId], callback);
  },

  updateAdmin: (
    adminId,
    adminName,
    adminEmailAddress,
    adminUsername,
    adminPassword,
    callback
  ) => {
    const query = `
      UPDATE admin
      SET admin_name = ?, admin_emailAddress = ?, admin_username = ?, admin_password = ?
      WHERE admin_id = ?
    `;
    dbConnection.query(
      query,
      [adminName, adminEmailAddress, adminUsername, adminPassword, adminId],
      callback
    );
  },

  deleteAdmin: (adminId, callback) => {
    const query = "DELETE FROM admin WHERE admin_id = ?";
    dbConnection.query(query, [adminId], callback);
  },
};
