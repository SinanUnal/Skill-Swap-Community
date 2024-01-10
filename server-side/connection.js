const mongoose = require('mongoose');
const URI = "mongodb+srv://usinan9:karina123@cluster0.4tl4ure.mongodb.net/?retryWrites=true&w=majority";


main()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URI);
}

module.exports = main;