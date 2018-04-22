import './index.html';
import './index.css';
import dva from 'dva';
import tools from './utils/tools'
/**
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
const app = dva({
   history: useRouterHistory(createHashHistory)({ queryKey: false }),
});
 */

// 1. Initialize
//const app = dva();
const app = dva();
// 2. Plugins
//app.use({});

// 3. Model
//app.model(require('./models/example'));
 
const models = require('./models')
for(var i in models){
 app.model(models[i]);
}
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
