import express from 'express';
import config from './config/env';
import routes from './config/routes';

const app = express();

app.use(express.json());

app.use((req, resp, next) => {
  const { body } = req;
  console.log('body: ', body);
  next();
});

app.use(`/${config.API_S6_PREFIX}/v1`, routes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

export default app;
