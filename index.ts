import app from './app';
import config from './utils/config';
import logger from './utils/logger';

const port = config.PORT ?? 3003;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
