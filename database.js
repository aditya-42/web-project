const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({}, { collection: 'restaurants' });

let Restaurant;

module.exports = {
  initialize: (connectionString) => {
    return new Promise((resolve, reject) => {
      mongoose.connect(connectionString, { 
        useUnifiedTopology: true, 
        dbName: 'sample_restaurants'
      })
        .then(() => {
          Restaurant = mongoose.model('Restaurant', restaurantSchema);
          console.log('Connected to ATLAS: sample_restaurants');
          resolve();
        })
        .catch(err => {
          console.error('DB connection error:', err);
          reject(err);
        });
    });
  },

  addNewRestaurant: (data) => new Restaurant(data).save(),

  getAllRestaurants: (page, perPage, borough) => {
    const query = borough ? { borough } : {};
    return Restaurant.find(query)
      .sort({ restaurant_id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
      .exec();
  },

  getRestaurantById: (id) => Restaurant.findById(id).lean().exec(),

  updateRestaurantById: (id, data) => Restaurant.findByIdAndUpdate(id, data, { new: true }).exec(),

  deleteRestaurantById: (id) => Restaurant.findByIdAndDelete(id).exec(),
};
