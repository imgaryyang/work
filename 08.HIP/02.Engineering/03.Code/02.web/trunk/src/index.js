import dva from 'dva';
import './index.css';
import './utils/prototype';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

const models = require('./models');

for (const i in models) {
  if ({}.hasOwnProperty.call(models, i)) {
    app.model(models[i]);
  }
}

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
