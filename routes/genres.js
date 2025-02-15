const validateObjectId = require("../middleware/validateObjectId");
const { default: mongoose } = require("mongoose");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Genre, validate } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");
    console.log("Fetched genres:", genres); // Debugging line
    res.send(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  ); 

  if (!genre)
    return res.status(404).send("The genre with given id does not exist");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with given id does not exist");

  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with given id does not exist");

  res.send(genre);
});

module.exports = router;
