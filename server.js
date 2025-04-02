const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// START SERVER

console.log(app.get('env'));
console.log(process.env);
// const port = 3000;
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening for request......');
});
