import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import OutpatientRefundList from './OutpatientRefundList';

class PaymentMain extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.url}/outpatientRefundList`} component={OutpatientRefundList} />
      </div>
    );
  }
}

PaymentMain.propTypes = {
};

export default connect()(PaymentMain);
