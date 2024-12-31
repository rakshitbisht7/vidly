const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
// const Fawn = require("fawn/lib/fawn");
const router = express.Router();

// Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

// router.post("/", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const customer = await Customer.findById(req.body.customerId);
//   if (!customer) return res.status(404).send("Invalid customer.");

//   const movie = await Movies.findById(req.body.movieId);
//   if (!movie) return res.status(404).send("Invalid movie.");

//   if (movie.numberInStock === 0)
//     return res.status(400).send("Movie is out of stock.");

//   let rental = new Rental({
//     customer: {
//       _id: customer._id,
//       name: customer.name,
//       phone: customer.phone,
//     },
//     movie: {
//       _id: movie._id,
//       title: movie.title,
//       dailyRentalRate: movie.dailyRentalRate,
//     },
//   });
//   try {
//     new Fawn.Task()
//       .save("rentals", rental )
//       .update(
//         "movies",
//         { _id: movie._id },
//         {
//           $inc: { numberInStock: -1 },
//         }
//       )
//       .run();

//     res.send(rental);
//   } catch (ex) {
//     res.status(500).send("Something went wrong.");
//   }
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    await rental.save(); // Save rental without transaction
    movie.numberInStock--; // Decrement the stock
    await movie.save(); // Update movie stock

    res.send(rental); // Send the created rental as response
  } catch (ex) {
    console.error("Error during rental creation:", ex.message);
    res.status(500).send("Something went wrong."); // Send error response
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");
  res.send(rental);
});

module.exports = router;
