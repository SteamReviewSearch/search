const express = require('express');
const app = express();
const indexRouter = require("./routes");
require("dotenv").config();
const env = process.env;

app.use(express.json())
app.use("/api", indexRouter);
// app.use(express.static('public'))

// app.set('views', __dirname + '/src/views')
// app.set('view engine', 'jsx')
// app.engine('jsx', require('express-react-views').createEngine())


// app.get('/', (req, res) => {
//     res.render('index', { name: 'Rhapsodist' })
// })


app.listen(env.PORT, () => {
  console.log(env.PORT, 'Welcome Steam Search Service');
});   