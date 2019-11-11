const express = require("express");
const app = express();
const { promisify } = require("util");
const path = require("path");
const bodyParser = require("body-parser");
const GoogleSpreadsheet = require("google-spreadsheet");
const credentials = require("./bugtracker.json");
const sgMail = require("@sendgrid/mail");

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

const docId = "1HwNxwP2I-vSGj5DQf9C2cXw1WMt8Tux01nAEKyUYnWA";
const worksheetsIndex = 0;

const SENDGRID_API_KEY =
  "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";

app.get("/", (req, res) => {
  res.render("home");
  // res.send({
  //   data: [{ id: 1, name: "Fabio" }, { id: 2, name: "Juraci" }]
  // });
  // res.send(req.query);
});
app.post("/", async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(docId);
    await promisify(doc.useServiceAccountAuth)(credentials);
    console.log("planilha aberta");
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[worksheetsIndex];
    await promisify(worksheet.addRow)({
      name: req.body.name,
      email: req.body.email,
      source: req.query.source || "direct",
      userAgent: req.body.userAgent,
      issueType: req.body.issueType,
      HowToReproduce: req.body.HowToReproduce,
      expectedOuput: req.body.expectedOuput,
      receivedOuput: req.body.receivedOuput,
      date: req.body.date
    });
    if (req.body.issueType === "critical") {
      sgMail.setApiKey(SENDGRID_API_KEY);
      const msg = {
        to: "agsuperpoder@gmail.com",
        from: "agsuperpoder@gmail.com",
        subject: "Sending with SendGrid API + NODE",
        text: `${req.body.name} enviou uma requisição`,
        html: "<strong>and easy to do anywhere, even with Node.js</strong>"
      };
      sgMail.send(msg);
    }
    res.send(
      `bug reportado com sucesso, 
      <div class="alert alert-primary" role="alert">
        <a href="/">Enviar mais requisições<a>
      </div>`
    );
  } catch (error) {
    res.send("erro ao enviar dados do form");
  }
});

app.listen(3000);
