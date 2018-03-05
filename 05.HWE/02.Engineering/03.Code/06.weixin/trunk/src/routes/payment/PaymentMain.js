import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import styles from './PaymentMain.less';
import InputMoney from './InputMoney';
import CashierDesk from './CashierDesk';
class PaymentMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles['container']}>
        <Route path={`${match.url}/inputMoney`} component={InputMoney} />
        <Route path={`${match.url}/cashierDesk`} component={CashierDesk} />
      </div>
    );
  }
}

PaymentMain.propTypes = {
};

export default connect()(PaymentMain);
