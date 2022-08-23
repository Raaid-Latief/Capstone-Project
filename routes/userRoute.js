const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }
});


//GET SINGLE USERS BY ID
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users WHERE user_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//ADDING A NEW POST
router.post("/", (req, res) => {
  const {
    
    fullname,
    email,
    password,
    role,
    joinDate,
    cart

  } = req.body;
  try {
    con.query(
      `INSERT INTO users (fullname,email,password,role,joinDate,cart) VALUES ("${email}", "${password}", "${fullname}", "${role}", "${joinDate}" , "${cart}")`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});



// UPDATE
router.put("/:id", (req, res) => {
  const {
   user_id,
    fullname,
    email,
    password,
    role,
   joinDate,
   cart,
  } = req.body;
  try {
    con.query(
      `UPDATE users
       SET  user_id = "${user_id}", fullname = "${fullname}", email = "${email}", password = "${password}",  role = "${role}", joinDate = "${joinDate}", cart = "${cart}"
       WHERE user_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// DELETE USER BY ID
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM users WHERE user_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;