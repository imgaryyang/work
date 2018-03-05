import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import RecordList from './InpatientPaymentRecordList';

class PaymentMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.url}/inpatientPaymentRecordList`} component={RecordList} />
      </div>
    );
  }
}

PaymentMain.propTypes = {
};

export default connect()(PaymentMain);
