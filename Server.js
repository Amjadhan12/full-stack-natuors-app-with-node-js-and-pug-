const mongoose = require('mongoose');

const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaught Exception 💥 shuting down ... ');
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE_local)
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log('Errore', err));

// console.log(process.env)

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}......`);
});

process.on('unhandleREjection', (err) => {
  console.log(err);
  console.log('unhandler rejection 💥 shuting down ... ');
  server.close(() => {
    process.exit(1);
  });
});
