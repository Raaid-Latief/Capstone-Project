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
      user_id,
      fullname,
      email,
      password,
      role,
     joinDate,
     
    } = req.body;
    try {
      con.query(
        `INSERT INTO users (user_id,fullname,email,password,role,joinDate) VALUES ("${user_id}","${email}", "${password}", "${fullname}", "${role}", "${joinDate}")`,
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