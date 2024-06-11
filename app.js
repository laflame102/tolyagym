const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Membership = require("./models/Membership");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// підключення до бази даних
mongoose
  .connect(
    "mongodb+srv://tolyaandrik:lsACNwG0b2wkS2ny@tolik.vzi5nei.mongodb.net/gym_db?retryWrites=true&w=majority&appName=tolik"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// маршрути
app.get("/memberships", async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/memberships", async (req, res) => {
  try {
    const { name, price } = req.body;
    const membership = new Membership({ name, price });
    await membership.save();
    res.status(201).json(membership);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/memberships/:id", async (req, res) => {
  try {
    const { name, price } = req.body;
    await Membership.findByIdAndUpdate(req.params.id, { name, price });
    res.json({ message: "Membership updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/memberships/:id", async (req, res) => {
  try {
    await Membership.findByIdAndDelete(req.params.id);
    res.json({ message: "Membership deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// оброблюєм помилку
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
