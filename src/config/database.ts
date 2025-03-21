import mongoose from 'mongoose';
import config from './env';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class Database {
  private count = 0;
  private maxConnectTry = 10;
  private url = config.MONGODB_URI;

  private options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false
  };

  constructor() {
    this.connectWithRetry();
  }

  getDatabase() {
    return mongoose;
  }

  connectWithRetry = async () => {
    if (this.count > this.maxConnectTry) {
      process.exit(1);
    }

    log('Intentando conectar con MongoDB (se reintentará de ser necesario)');
    mongoose
      .connect(this.url, this.options)
      .then(() => {
        log('conectado a MongoDB');
      })
      .catch(err => {
        const retrySeconds = 5;
        log(`Conexión a MongoDB no satisfactoria (reintento #${++this.count} despues ${retrySeconds} segundos):`, err);
        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}

export default new Database();
