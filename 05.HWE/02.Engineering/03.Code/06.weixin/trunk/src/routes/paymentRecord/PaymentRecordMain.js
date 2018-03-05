import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import styles from './PaymentMain.less';
import PaymentRecordList from './PaymentRecordList';
import CashierDesk from '../payCounter/PayCounter';
import InputMoney from '../payCounter/Payment';

class PaymentMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles['container']}>
        <Route path={`${match.url}/paymentRecordList`} component={PaymentRecordList} />
      </div>
    );
  }
}

PaymentMain.propTypes = {
};

export default connect()(PaymentMain);
