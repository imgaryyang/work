import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import Payment from './Payment';
import PayCounter from './PayCounter';

class PaymentMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.url}/payment`} component={Payment} />
        <Route path={`${match.url}/payCounter`} component={PayCounter} />
      </div>
    );
  }
}

PaymentMain.propTypes = {
};

export default connect()(PaymentMain);
