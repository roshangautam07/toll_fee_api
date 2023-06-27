import authRouter from "./auth.js";
import usersRouter from "./users.js";
import dashRouter from "./dashboard.js";
import billRouter from "./billing.js";
import billReturnRouter from "./billReturn.js";


export default function routes(app, express) {
  app.use('/api', usersRouter(express));
  app.use('/api', authRouter(express));
  app.use('/api', dashRouter(express));
  app.use('/api',billRouter(express));
  app.use('/api',billReturnRouter(express));
  
}