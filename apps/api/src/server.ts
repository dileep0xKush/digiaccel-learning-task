import app from './app.js';
import { config } from './config/index.js';

const port = config.port;
const host = config.host;

app.listen(port, () => {
  console.log(`✅ Server is running on ${host}:${port}`);
  console.log(`📚 API docs: ${host}:${port}/health`);
});
