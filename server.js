// live @  https://acme-web-seq-tm.herokuapp.com/pages/1

const db = require('./db');
const app = require('./app');

const port = process.env.PORT || 1338;

app.listen(port, () => console.log(`listening on port ${port}`));

db.setupDb();