import app from './app';
import { PORT } from './utils/config';
import logger from './utils/logger';

const port = PORT ?? 3003;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
