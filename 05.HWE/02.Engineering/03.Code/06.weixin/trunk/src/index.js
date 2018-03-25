import dva from 'dva';
import './index.less';
import './utils/prototype';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/baseModel').default);
app.model(require('./models/homeModel').default);
app.model(require('./models/appointModel').default);
app.model(require('./models/paymentModel').default);
app.model(require('./models/userModel').default);
app.model(require('./models/paymentRecordModel').default);
app.model(require('./models/inpatientPaymentRecordModel').default);
app.model(require('./models/outpatientReturnModel').default);

app.model(require('./models/inpatientBillQueryModel').default);
app.model(require('./models/inpatientDailyModel').default);
app.model(require('./models/newsModel').default);
app.model(require('./models/feedBackModel').default);
app.model(require('./models/reportModel').default);
app.model(require('./models/recordModel').default);
app.model(require('./models/foregiftModel').default);
app.model(require('./models/depositModel').default);


// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
