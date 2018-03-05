import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Icon, notification, Button } from 'antd';
import { testInt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';

class PatientStoreExecList extends React.Component {

  onPageChange(page) {
    this.props.dispatch({ type: 'patientStoreExec/load', payload: { page } });
  }

  loadDetail(record, e) {
    const search = { recipeId: record.recipeId, recipeNo: record.recipeNo, itemCode: record.itemCode };
    this.props.dispatch({
      type: 'patientStoreExec/loadDetail',
      payload: { query: search },
    });
  }

  refreshTable() {
    const dataList = this.props.data;
    if (dataList && dataList.length > 0) {
      let newData = [];
      for (const tmp of dataList) {
        /*
         判断填写数量
        */
        if (tmp.thisQty && tmp.thisQty > tmp.remainQty) {
          notification.info({ message: '提示信息：', description: '填写数量不能大于剩余数量！' });
        }
        /*
        动态计算金额
         */
        if (tmp.thisQty != null && tmp.thisQty !== 0 && tmp.unitPrice != null && tmp.unitPrice !== 0) {
          tmp.totalMoney = tmp.unitPrice * tmp.thisQty;
        }
        newData.push(tmp);
      }

      this.props.dispatch({
        type: 'patientStoreExec/setState',
        payload: { data: newData },
      });
    }
  }

  render() {
    const { page, data } = this.props;
    const { dicts } = this.props.utils;
    const columns = [
      { title: '就诊号', dataIndex: 'regNo', key: 'regNo' },
      { title: '姓名', dataIndex: 'patient.name', key: 'patient.name' },
      { title: '性别', dataIndex: 'patient.sex', key: 'patient.sex', render: text => (text ? dicts.dis('SEX', text) : '') },
      { title: '出生日期', dataIndex: 'patient.birthday', key: 'patient.birthday', render: text => (text ? moment(text).format('YYYY-MM-DD') : '') },
      { title: '开单科室', dataIndex: 'seeDept.deptName', key: 'seeDept.deptName' },
      { title: '开单医生', dataIndex: 'seeDoc.name', key: 'seeDoc.name' },
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName' },
      { title: '单位', dataIndex: 'unit', key: 'unit' },
      { title: '价格', dataIndex: 'unitPrice', key: 'unitPrice', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      { title: '总数量', dataIndex: 'qty', key: 'qty' },
      { title: '已执行', dataIndex: 'useQty', key: 'useQty' },
      { title: '余量', dataIndex: 'remainQty', key: 'remainQty' },
      {
        title: '本次数量',
        width: '100px',
        dataIndex: 'thisQty',
        key: 'thisQty',
        editable: true,
        editorConfig: { verfy: (v) => { return testInt(v); } },
      },
      { title: '总金额', dataIndex: 'totalMoney', key: 'totalMoney', render: text => (text ? text.formatMoney(2) : '0.00'), className: 'text-align-right' },
      { title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.loadDetail.bind(this, record)} disabled={record.useQty === 0} style={{ width: '70px' }} ><Icon type="copy" />明细</Button>;
        },
      }];
    return (
      <div>
        <EditTable
          data={data} page={page} columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onChange={this.refreshTable.bind(this)}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ utils }) => ({ utils }))(PatientStoreExecList);
