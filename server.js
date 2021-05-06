const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
var printerDriver = require("@thiagoelg/node-printer");
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;
const NAMESPACE = "NODE-PRINTER";

const router = express();

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const config = {
  server: SERVER,
};

/* -------------------------------- FUNCTIONS ------------------------------- */
const printHandler = async (data) => {
  let printer = new ThermalPrinter({
    type: Types.EPSON, // 'star' or 'epson'
    interface: "Buffer",
    options: {
      timeout: 1000,
    },
    width: 32, // Number of characters in one line - default: 48
    characterSet: "SLOVENIA", // Character set - default: SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "-", // Use custom character for drawing lines - default: -
  });

  let isConnected = await printer.isPrinterConnected();
  console.log("Printer connected:", isConnected);
  data.printerCommands.forEach((command) => {
    // printer.newLine();
    return eval(command);
  });

  printer.openCashDrawer();

  try {
    await printer.execute();

    printerDriver.printDirect({
      data: printer.getBuffer(), // or simple String: "some text"
      printer: data.printerName, // printer name, if missing then will print to default printer
      type: "RAW", // type: RAW, TEXT, PDF, JPEG, .. depends on platform
      success: function (jobID) {
        console.log("sent to printer with ID: " + jobID);
      },
      error: function (err) {
        console.log(err);
      },
    });
  } catch (error) {
    console.error("Print error:", error);
  }
};

const postPrintData = (req, res, next) => {
  console.log(req.body);
  printHandler(req.body);

  return res.status(201).json(req.body);
};

/** Rules of our API */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/printer-data", postPrintData);

router.get("/", (req, res) => {
  res.json({ name: "asdf", age: 22 });
});
let counter = 0;

router.post("/add", (req, res) => {
  console.log(req.body);
  counter += req.body.number;

  res.json({ counter: counter });
});

/* ----------------------------- ERROR HANDLING ----------------------------- */

router.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () =>
  console.info(
    NAMESPACE,
    `Server is running ${config.server.hostname}:${config.server.port}`
  )
);
