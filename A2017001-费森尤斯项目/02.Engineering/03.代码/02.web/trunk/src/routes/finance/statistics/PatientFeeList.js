import { connect } from 'dva';
import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';

class PatientFeeList extends Component {

  constructor(props) {
    super(props);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'financeStatistics/loadPatientFee',
      payload: {
        query: { dateRange: [moment(), moment()] },
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'financeStatistics/loadPatientFee',
      payload: {
        page,
        query: this.props.financeStatistics.query,
      },
    });
  }

  render() {
    const { financeStatistics, utils, base } = this.props;
    const { wsHeight } = base;
    const { patientFeePage, patientFeeData } = financeStatistics;

    const columns = [
      {
        title: '医保类别',
        dataIndex: '0',
        key: 'feeType',
        width: 110,
      }, {
        title: '就诊日期',
        dataIndex: '1',
        key: 'regDate',
        width: 110,
        className: 'text-align-center text-no-wrap',
      }, {
        title: '姓名',
        dataIndex: '2',
        key: 'patientName',
        width: 100,
      }, {
        title: '个人编号',
        dataIndex: '3',
        key: 'patientID',
        width: 130,
        className: 'text-align-center text-no-wrap',
      }, {
        title: '项目名称',
        dataIndex: '4',
        key: 'feeCode',
        width: 130,
      }, {
        title: '项目金额',
        dataIndex: '5',
        key: 'amt',
        width: 130,
        className: 'text-align-right text-no-wrap',
        render: value => value.formatMoney(),
      },
    ];
    return (
      <div>
        <CommonTable
          data={patientFeeData}
          pagination={false}
          columns={columns}
          onPageChange={this.onPageChange}
          bordered
          scroll={{ y: (wsHeight - 43 - 35) }}
          rowSelection={false}
        />
      </div>
    );
  }
}
export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(PatientFeeList);
