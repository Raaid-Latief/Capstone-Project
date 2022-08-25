const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM plans", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
});



//Get one program by the ID
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM plans WHERE plan_id=${req.params.id}`,
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
router.post("/",  (req, res) => {
    const {
      category,
      title,
      description,
     imgURL,
     price,
    } = req.body;
    try {
      con.query(
        `INSERT INTO plans (category,title,description,imgURL,price) VALUES ("${category}","${title}","${description}", "${imgURL}", "${price}")`,
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
  
    category,
    title,
    description,
   imgURL,
   price,
  } = req.body;
  try {
    con.query(
      `UPDATE plans SET category = "${category}", title = "${title}", description = "${description}",  imgURL = "${imgURL}", price = "${price}"
       WHERE plan_id=${req.params.id}`,
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



//   DELETE BY ID
  router.delete("/:id", (req, res) => {
    try {
      con.query(
        `DELETE FROM plans WHERE plan_id=${req.params.id}`,
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