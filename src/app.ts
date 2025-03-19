import express from 'express';
import config from './config/env';
// import routes from './config/routes';
// import Database from './config/database';

const app = express();

app.use(express.json());
// app.use('/api', routes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

export default app;
