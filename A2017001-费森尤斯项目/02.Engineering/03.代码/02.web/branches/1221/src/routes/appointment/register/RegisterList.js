import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CommonTable from '../../../components/CommonTable';
import Styles from './Register.less';

class RegisterList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'register/load',
      payload: {},
    });
  }

  onRowClick(record) {
    const isEmergency = (record.regLevel === '2');
    this.props.dispatch({
      type: 'register/setState',
      payload: { record, isEmergency },
    });
    this.props.dispatch({
      type: 'register/getTotalFee',
      payload: { regLevel: record.regLevel },
    });
    this.onEmergencyFlagChange(isEmergency);
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'register/load',
      payload: { page },
    });
  }

  onEmergencyFlagChange = (emergencyFlag) => {
    this.props.form.setFieldsValue({ emergencyFlag });
  };

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'regVisitTemp/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const self = this;
    const { page, data, wsHeight } = this.props;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const columns = [
      {
        title: '序号',
        dataIndex: 'numSourceId',
        key: 'numSourceId',
        width: 50,
      }, {
        title: '挂号级别',
        dataIndex: 'regLevel',
        key: 'regLevel',
        width: 80,
        render: (value) => {
          return dicts.dis('REG_LEVEL', value);
        },
      }, {
        title: '挂号科室',
        dataIndex: 'deptId',
        key: 'deptId',
        width: 80,
        render: (value) => {
          return depts.disDeptNameByDeptId(deptsIdx, value);
        },
      },
    ];

    return (
      <div>
        <Row>
          <Col span={24}>
            <div className={Styles.fieldSet} >
              <div />
              <span>号源信息</span>
            </div>
          </Col>
        </Row>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          rowSelection={false}
          paginationStyle="mini"
          onRowClick={this.onRowClick.bind(this)}
          onPageChange={self.onPageChange.bind(this)}
          onSelectChange={self.rowSelectChange.bind(this)}
          scroll={{ y: (wsHeight - 250) }}
        />
      </div>
    );
  }
}

export default RegisterList;
