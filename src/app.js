// import statements
const EXPRESS = require("express");
require("./connection"); // making connection to db
const APP_MODEL = require("./schema_model");
const PATH = require("path");

// creating an express app
const APP = EXPRESS();
const IP = "localhost";
const PORT = 4090;

// getting our static folder
const STATIC_PATH = PATH.join(__dirname, "../public/");
APP.use(EXPRESS.static(STATIC_PATH));

const VIEWS_PATH = PATH.join(__dirname, "../views/");
APP.set("views", VIEWS_PATH);
APP.set("view engine", "hbs");

// to get the submitted data in encoded form from url
APP.use(
  EXPRESS.urlencoded({
    extended: false,
  })
);

// Handling Form get request
APP.get("/form-fill", (req, res) => {
  res.render("index");
});

// Handling Form submit request
APP.post("/submitForm", async (req, res) => {
  console.log("----------------------------------------------------------");
  console.log("trying to add data ...");
  try {
    let first_name = String(req.body.firstName);
    let last_name = String(req.body.lastName);
    let roll_num = String(req.body.rollNumber);
    let matric_marks = Number(req.body.matricMarks);
    let inter_marks = Number(req.body.interMarks);
    let email = String(req.body.email);
    let tel_num = Number(req.body.telNum);
    let aadhar_num = Number(req.body.aadharNum);

    if (checkData(matric_marks, inter_marks, tel_num, aadhar_num)) {
      const addDataToDb = new APP_MODEL({
        first_name: first_name,
        last_name: last_name,
        roll_num: roll_num,
        matric_marks: matric_marks,
        inter_marks: inter_marks,
        email: email,
        mobile_num: tel_num,
        aadhar_num: aadhar_num,
      });
      await addDataToDb.save();
      console.log(`[+] Data added to database`);
      res.render("successIndex");
    } else {
      console.log("[-] Invalid values are given");
      res.render("errorIndex");
    }
  } catch (err) {
    console.log(`[-] Error while saving data`);
    console.log(err);
  }
});

// Handling Data fetch request
APP.get("/get-data", (req, res) => {
  console.log("----------------------------------------------------------");
  console.log(`fetching data...`);
  APP_MODEL.find()
    .then((data) => {
      // console.log(data);
      console.log(`[+] data fetched successfully`);
      res.render("getDataIndex", { data: data });
    })
    .catch((error) => {
      console.log(`[-] Error while finding data`);
      console.log(error);
    });
});

// Handling DELETE request
APP.post("/del-doc/:slug", async (req, res) => {
  console.log("----------------------------------------------------------");
  console.log(`Deleting document ...`);
  await APP_MODEL.deleteOne({ _id: req.params.slug })
    .then((data) => {
      console.log(`[+] Document deleted`);
      res.redirect("/get-data");
    })
    .catch((error) => {
      console.log(`[-] Error while delting`);
      console.log(error);
    });
});

// Handling UPDATE request
APP.get("/update-doc/:slug", (req, res) => {
  console.log("----------------------------------------------------------");
  console.log("trying to update document ...");
  APP_MODEL.findOne({ _id: req.params.slug })
    .then((data) => {
      res.render("updateDataIndex", { data: data });
    })
    .catch((error) => {
      console.log(`[-] Error while finding document`);
      console.log(error);
      res.send(`!Page not Found, check the typed URL`);
    });
});

APP.post("/update-requested/:slug", (req, res) => {
  console.log("----------------------------------------------------------");
  let first_name = String(req.body.firstName);
  let last_name = String(req.body.lastName);
  let roll_num = String(req.body.rollNumber);
  let matric_marks = Number(req.body.matricMarks);
  let inter_marks = Number(req.body.interMarks);
  let email = String(req.body.email);
  let tel_num = Number(req.body.mobileNum);
  let aadhar_num = Number(req.body.aadharNumber);
  APP_MODEL.updateMany(
    { _id: req.params.slug },
    {
      $set: {
        first_name: first_name,
        last_name: last_name,
        roll_num: roll_num,
        matric_marks: matric_marks,
        inter_marks: inter_marks,
        email: email,
        mobile_num: tel_num,
        aadhar_num: aadhar_num,
      },
    }
  )
    .then((data) => {
      console.log(`[+] document updated`);
      res.redirect("/get-data");
    })
    .catch((error) => {
      console.log(`[-] Error while updating`);
      console.log(error);
    });
});

// user defined functions
function checkData(matric_marks, inter_marks, mobile_num, aadhar_num) {
  if (matric_marks < 0 || matric_marks > 100) {
    console.log("[-] matic marks is wrong");
    return false;
  } else if (inter_marks < 0 || inter_marks > 100) {
    console.log("[-] inter marks is wrong");
    return false;
  } else if (String(mobile_num).length != 10) {
    console.log("[-] mobile num is wrong");
    return false;
  } else if (String(aadhar_num).length != 12) {
    console.log("[-] aadhar num is wrong");
    return false;
  } else {
    console.log(`[+] entered credentials are correct`);
    return true;
  }
}

// starting
APP.listen(PORT, (error) => {
  if (error) {
    console.log(`[-] Error occured in connecting.`);
    return error;
  }
  console.log(`[+] Server is Listening ...`);
  console.log(`[+] Visit the site: http://${IP}:${PORT}/form-fill`);
  console.log(`[+] Visit the site: http://${IP}:${PORT}/get-data`);
});
