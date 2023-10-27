import { app } from './config/express-config';
import { getEnv } from './utils/functions/get-env';

app.listen(getEnv('PORT'), () => {
  console.log(`API listening on port ${getEnv('PORT')}`);
});