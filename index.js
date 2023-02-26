import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import CobaRoute from "./routes/CobaRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import LevelRoute from "./routes/LevelRoute.js";
import FileUpload from "express-fileupload";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db
});



app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: 'auto'
  }
}));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(LevelRoute);


app.use(FileUpload());
app.use(express.static("public"));
app.use(ProductRoute);
app.use(CobaRoute);



// store.sync();
// (async()=>{
//   await db.sync();
// })();

app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running...');
});
