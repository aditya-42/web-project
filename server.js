// // ITE5315 – Project *
// //   I declare that this assignment is my own work in accordance with Humber Academic Policy.
// //   * No part of this assignment has been copied manually or electronically from any other source
// //   * (including web sites) or distributed to other students. 
// //   * Group member 
//      Smith Dias n01607819
//      Aditya Purohit n01610857

//      Date: 08/12/2024



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));


db.initialize(process.env.DB_CONN_STRING)
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

const router = express.Router();

router.post('/api/restaurants', async (req, res) => {
  try {
    const result = await db.addNewRestaurant(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/restaurants', async (req, res) => {
  try {
    const { page = 1, perPage = 10, borough } = req.query; // give default values
    const result = await db.getAllRestaurants(Number(page), Number(perPage), borough);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/restaurants/:id', async (req, res) => {
  try {
    const result = await db.getRestaurantById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/restaurants/:id', async (req, res) => {
    try {
      const restaurant = await db.getRestaurantById(req.params.id);
      if (restaurant) {
        res.render('restaurant-details', { restaurant });
      } else {
        res.status(404).send('Restaurant not found');
      }
    } catch (err) {
      res.status(500).send('Error retrieving restaurant: ' + err.message);
    }
  });

router.put('/api/restaurants/:id', async (req, res) => {
  try {
    const result = await db.updateRestaurantById(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/restaurants/:id', async (req, res) => {
  try {
    const result = await db.deleteRestaurantById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/restaurants/search', async (req, res) => {
    try {
      const { page = 1, perPage = 10, borough } = req.query; // default query
      const results = await db.getAllRestaurants(Number(page), Number(perPage), borough);
      console.log(results.json);
      res.render('search', { results });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }                                                                   
  });
  

app.use(router);


