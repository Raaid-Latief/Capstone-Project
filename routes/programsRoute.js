const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM programs", (err, result) => {
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
      `SELECT * FROM programs WHERE program_id=${req.params.id}`,
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
     gender,
     price,
    } = req.body;
    try {
      con.query(
        `INSERT INTO programs (category,title,description,imgURL,gender,price) VALUES ("${category}","${title}","${description}", "${imgURL}", "${gender}", "${price}")`,
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
   gender,
   price,
  } = req.body;
  try {
    con.query(
      `UPDATE programs SET category = "${category}", title = "${title}", description = "${description}",  imgURL = "${imgURL}", gender = "${gender}", price = "${price}"
       WHERE program_id=${req.params.id}`,
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
        `DELETE FROM programs WHERE program_id=${req.params.id}`,
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