const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://namastedev:saibaba01@namastenode.gfqmf.mongodb.net/devTinder');
};

module.exports = connectDB;
