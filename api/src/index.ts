import express, { json, urlencoded, Request } from 'express';
import cors from 'cors';
import productsRoutes from './routes/products/index.js';
import apiRoutes from './routes/api/index.js';

const port = process.env.PORT || 3001;
// const cors = require('cors');
const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(cors({
  origin: '*'
}));


app.get('/', (req, res) => {
    res.send('Hello World! Pisey Sreng Hehe');
});

app.use('/products', productsRoutes);
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})