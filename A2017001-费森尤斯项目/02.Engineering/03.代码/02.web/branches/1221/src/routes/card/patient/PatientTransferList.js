import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';

class PatientTransferList extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'patienttransfer/loadPatientTransfer',
      payload: {
        query: { dateRange: [moment(), moment()] },
      },
    });
  }

  render() {
    const { patienttransfer, utils, base } = this.props;
    const { wsHeight } = base;
    const { patientTransferData } = patienttransfer;
    console.log(patientTransferData[0]);

    const columns = [
      {
        title: '月份',
        dataIndex: '0',
        key: '0',
        width: 80,
        className: 'text-align-center',
      },
       {
        title: '患者转入',
        dataIndex: '1',
        key: '1',
        width: 80,
        className: 'text-align-center',
      },
      {
        title: '患者转出',
        dataIndex: '2',
        key: '2',
        width: 80,
        className: 'text-align-center',
      },
    ];
    return (
      <div>
        <CommonTable
          data={patientTransferData}
          pagination={false}
          columns={columns}
          bordered
          scroll={{ y: (wsHeight - 75 - 40) }}
          rowSelection={false}
        />
      </div>
    );
  }
}
export default connect(
  ({ patienttransfer, base }) => ({ patienttransfer, base }),
)(PatientTransferList);
