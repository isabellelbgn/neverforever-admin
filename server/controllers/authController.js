const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

exports.login = (req, res) => {
  const { username, password } = req.body;

  Admin.findAdminByUsername(username, (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ success: false });
    }

    if (results.length > 0) {
      const hashedPassword = results[0].admin_password;

      bcrypt.compare(password, hashedPassword, (compareErr, match) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          return res.status(500).json({ success: false });
        }

        if (match) {
          req.session.adminId = results[0].admin_id;
          req.session.adminName = results[0].admin_name;

          res.json({
            Login: true,
            adminId: results[0].admin_id,
            adminName: results[0].admin_name,
          });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } else {
      res.status(404).json({ error: "No matching records found" });
    }
  });
};

exports.getLoginStatus = (req, res) => {
  if (req.session.adminId) {
    res.send({
      loggedIn: true,
      adminId: req.session.adminId,
      adminName: req.session.adminName,
    });
  } else {
    res.send({ loggedIn: false });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ error: "Error logging out" });
    }
    res.json({ loggedOut: true });
  });
};
