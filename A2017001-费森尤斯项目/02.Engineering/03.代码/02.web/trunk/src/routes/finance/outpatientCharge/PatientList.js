import React, { Component } from 'react';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class PatientList extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'outpatientCharge/loadRegInfoPage',
    });
  }

  onClickRow(record) {
    this.props.dispatch({
      type: 'outpatientCharge/clickPatient',
      payload: { record },
    });
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: {
        isCheckBox: false,
      },
    });
  }
  onPageChange(page) {
    this.props.dispatch({
      type: 'outpatientCharge/loadRegInfoPage',
      payload: { page },
    });
  }
  render() {
    const { page, pdata } = this.props.outpatientCharge;
    const { innerHeight } = this.props;
    const columns = [
      {
        title: '就诊号',
        dataIndex: 'regId',
        key: 'regId',
        width: 145,
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.patient.name}
            </div>
          );
        },
      }, /* {
        title: '姓名',
        dataIndex: 'patient.name',
        key: 'patientName',
      },*/
      { title: '科室',
        dataIndex: 'regDept.deptName',
        key: 'seeDept',
        width: 116,
      },
    ];
    return (
      <div>
        <CommonTable
          data={pdata}
          page={page}
          columns={columns}
          paginationStyle="mini"
          onRowClick={this.onClickRow.bind(this)}
          bordered
          onPageChange={this.onPageChange.bind(this)}
          rowSelection={false}
          className="compact-table"
          scroll={{
            y: (innerHeight - 33 - 48),
          }}
        />
      </div>
    );
  }
}
export default connect(({ outpatientCharge, utils }) => ({ outpatientCharge, utils }))(PatientList);
