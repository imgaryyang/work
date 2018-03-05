import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import List from './PatientTransferList';
import Chart from './PatientTransferChart';

const TabPane = Tabs.TabPane;

class PatientTransferTab extends Component {
  onChange(key) {
    this.props.dispatch({
      type: 'patienttransfer/setState',
      payload: { activeKey: key },
    });
   // console.log(this.props.patienttransfer.patientTransferQuery);
    this.props.dispatch({
      type: 'patienttransfer/loadPatientTransfer',
      payload: { query: this.props.patienttransfer.patientTransferQuery },
    });
  }

  render() {
    // SearchBar如果放到tabBarExtraContent中，会超长折到第二行
    return (
      <div>
        <Tabs onChange={this.onChange.bind(this)} className="compact-tab" >
          <TabPane tab="列表统计" key="1">
              <List  />
          </TabPane>
          <TabPane tab="图表统计" key="2">
              <Chart  />
         </TabPane>
        </Tabs>
      </div>
    );
  }
}


export default connect(
  ({ patienttransfer, base }) => ({ patienttransfer, base }),
)(PatientTransferTab);
