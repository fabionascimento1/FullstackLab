const GoogleSpreadsheet = require("google-spreadsheet");
const credentials = require("./bugtracker.json");

const doc = new GoogleSpreadsheet(
  "1HwNxwP2I-vSGj5DQf9C2cXw1WMt8Tux01nAEKyUYnWA"
);
doc.useServiceAccountAuth(credentials, err => {
  if (err) {
    console.log("error");
  } else {
    console.log("planilha aberta");
    doc.getInfo((err, info) => {
      const worksheet = info.worksheets[0];
      worksheet.addRow({ name: "Fabio", email: "feio15@hotmail.com" }, err => {
        console.log("linha add");
      });
    });
  }
});
