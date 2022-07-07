const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const secondName = req.body.lname;
  const email = req.body.email;

  const client = require("@mailchimp/mailchimp_marketing");

  client.setConfig({
    apiKey: "4f876319fd26eef538ef2fa18ffffd8d-us9",
    server: "us9",
  });

  console.log(firstName);
  console.log(secondName);
  console.log(email);

  const run = async () => {
    const response = await client.lists.batchListMembers("614ec699dc", {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: secondName,
          },
        },
      ],
    });
    if (response.error_count === 0) {
      res.sendFile(__dirname + "/sucess.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.listen(port || 3000, function () {
  console.log("Running on Port: " + port);
});
