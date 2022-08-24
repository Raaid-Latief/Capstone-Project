const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const middleware = require("../middleware/auth");
const jwt = require('jsonwebtoken');

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
router.post("/", middleware, (req, res) => {
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
router.put("/:id", middleware, (req, res) => {
  const {
  
    fullname,
    email,
    password,
    role,
   joinDate,
   cart,
  } = req.body;
  try {
    con.query(
      `UPDATE users SET fullname = "${fullname}", email = "${email}", password = "${password}",  role = "${role}", joinDate = "${joinDate}", cart = "${cart}"
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
router.delete("/:id", middleware, (req, res) => {
  try {
    con.query(
      `DELETE FROM users WHERE user_id=${req.params.id};
      ALTER TABLE programs AUTO_INCREMENT = 1`,
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


// Password Encryption 


const bcrypt = require('bcryptjs');

// Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const {
      user_id,
      fullname,
      email,
      password,
    role,
    joinDate,
    cart
    } = req.body;

    // The start of hashing / encryption
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      user_id,
      fullname,
      email,
      // We sending the hash value to be stored witin the table
      password: hash,
   role,
   joinDate,
   cart
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(`User ${(user.fullname, user.email)} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
});


 // Login
  // The Route where Decryption happens
  router.post("/login", (req, res) => {
    try {
      let sql = "SELECT * FROM users WHERE ?";
      let user = {
        email: req.body.email,
      };
      con.query(sql, user, async (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send("Email not found please register");
        } else {
          const isMatch = await bcrypt.compare(
            req.body.password,
            result[0].password
          );
          if (!isMatch) {
            res.send("Password incorrect");
          } else {
            // The information the should be stored inside token
            const payload = {
              user: {
                user_id: result[0].user_id,
                fullname: result[0].fullname,
                email: result[0].email,
                password: result[0].password,
                joinDate: result[0].joinDate,
              cart: result[0].cart,
              
              },
            };
            // Creating a token and setting expiry date
            jwt.sign(
              payload,
              process.env.jwtSecret,
              {
                expiresIn: "365d",
              },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
                console.log(req.body);
              }
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  // Verify
router.get("/users/verify", (req, res) => {
const token = req.header("x-auth-token");
jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
  if (error) {
    res.status(401).json({
      msg: "Unauthorized Access!",
    });
  } else {
    res.status(200);
    res.send(decodedToken);
  }
});
});
router.get("/", middleware, (req, res) => {
try {
  let sql = "SELECT * FROM users";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
} catch (error) {
  console.log(error);
}
});

// Forgot Password

// Importing the dependencies
const nodemailer = require('nodemailer');



router.post('/forgot-psw', (req, res) => {
    try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if(result === 0) {
        res.status(400), res.send("Email not found")
      }
      else {

        // Allows me to connect to the given email account || Your Email
        const transporter = nodemailer.createTransport({
          host: process.env.MAILERHOST,
          port: process.env.MAILERPORT,
          auth: {
            user: process.env.MAILERUSER,
            pass: process.env.MAILERPASS,
          },
        });

        // How the email should be sent out
      var mailData = {
        from: process.env.MAILERUSER,
        // Sending to the person who requested
        to: result[0].email,

        subject: 'Password Reset',
        html:
          `<div>
            <h3>Hi ${result[0].full_name},</h3>
            <br>
            <h4>Click link below to reset your password</h4>

            <a href="https://user-images.githubusercontent.com/4998145/52377595-605e4400-2a33-11e9-80f1-c9f61b163c6a.png">
              Click Here to Reset Password
              user_id = ${result[0].user_id}
            </a>

            <br>
            <p>For any queries feel free to contact us...</p>
            <div>
              Email: ${process.env.MAILERUSER}
              <br>
              Tel: If needed you can add this
            <div>
          </div>`
      };

      // Check if email can be sent
      // Check password and email given in .env file
      transporter.verify((error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email valid! ', success)
        }
      });

      transporter.sendMail(mailData,  (error, info) => {
        if (error) {
          console.log(error);
        } else {
          res.send('Please Check your email', result[0].user_id)
        }
      });

      }
    });
  } catch (error) {
    console.log(error);
  }
})


// Rest Password Route

router.put('reset-psw/:id', (req, res) => {
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    user_id: req.params.id,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        user_id: result[0].user_id,
        fullname: result[0].fullname,
        email: result[0].email,
        joinDate: result[0].joinDate,
      cart: result[0].cart,

        // Only thing im changing in table
        password: hash,
      };

      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Password Updated please login");
      });
    }
  });
})






module.exports = router;

















