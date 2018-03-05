import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import _ from 'lodash';
import { Icon, notification, Button } from 'antd';
import CommonTable from '../../../components/CommonTable';
import Styles from './PatientStoreExecList.less';

class PatientStoreExecList extends React.Component {

  onPageChange(page) {
    this.props.dispatch({ type: 'patientStoreExec/load', payload: { page } });
  }
  confirm(record) {
    const isgather = record.itemInfo.isgather;
    const newRecord = _.omit(record, 'patient.identityPic');
    if (isgather) {
      this.props.dispatch({
        type: 'patientStoreExec/loadConfirm',
        payload: { query: newRecord },
      });
    } else {
      this.props.dispatch({
        type: 'patientStoreExec/loadMatInfo',
        payload: { query: newRecord },
      });
    }
  }
  loadDetail(record) {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { record },
    });
    const search = { recipeId: record.recipeId, recipeNo: record.recipeNo, itemCode: record.itemInfo.id };
    this.props.dispatch({
      type: 'patientStoreExec/loadRecord',
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
        if (tmp.thisQty != null && tmp.thisQty !== 0 && tmp.itemInfo.unitPrice != null && tmp.itemInfo.unitPrice !== 0) {
          tmp.totalMoney = tmp.itemInfo.unitPrice * tmp.thisQty;
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
    const { page, data, patientStoreExec } = this.props;
    const { dicts } = this.props.utils;
    const { isShow } = patientStoreExec;
    // console.log(isShow);
    const columns = [
      { title: '就诊号', dataIndex: 'regNo', key: 'regNo' },
      { title: '姓名', dataIndex: 'patient.name', key: 'patient.name' },
      { title: '性别', dataIndex: 'patient.sex', key: 'patient.sex', render: text => (text ? dicts.dis('SEX', text) : '') },
      { title: '出生日期', dataIndex: 'patient.birthday', key: 'patient.birthday', render: text => (text ? moment(text).format('YYYY-MM-DD') : '') },
      { title: '传染病', dataIndex: 'patient.infectiousDisease', key: 'patient.infectiousDisease', render: text => (text ? dicts.dis('INFECTIOUS_DISEASE', text) : '') },
      { title: '开单科室', dataIndex: 'seeDept.deptName', key: 'seeDept.deptName' },
      { title: '开单医生', dataIndex: 'seeDoc.name', key: 'seeDoc.name' },
      { title: '项目名称', dataIndex: 'itemInfo.itemName', key: 'itemInfo.itemName' },
      { title: '单位', dataIndex: 'itemInfo.unit', key: 'itemInfo.unit' },
      { title: '价格', dataIndex: 'itemInfo.unitPrice', key: 'itemInfo.unitPrice', render: text => (text ? text.formatMoney(4) : '0.0000'), className: 'text-align-right' },
      { title: '总数量', dataIndex: 'qty', key: 'qty' },
      { title: '已执行', dataIndex: 'useQty', key: 'useQty' },
      { title: '余量', dataIndex: 'remainQty', key: 'remainQty' },
      { title: '总金额', dataIndex: 'totalMoney', key: 'totalMoney', render: text => (text ? text.formatMoney(2) : '0.00'), className: 'text-align-right' },
      { title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.confirm.bind(this, record)} disabled={isShow || record.useQty === record.qty} style={{ width: '70px' }} ><Icon type="save" />确认</Button>;
        },
      },
      { title: '明细',
        key: 'detail',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.loadDetail.bind(this, record)} disabled={record.useQty === 0} style={{ width: '70px' }} ><Icon type="copy" />明细</Button>;
        },
      },
    ];
    return (
      <div>
        <CommonTable
          data={data} page={page} columns={columns}
          rowClassName={rowClassName}
          onPageChange={this.onPageChange.bind(this)}
          onChange={this.refreshTable.bind(this)}
          bordered
        />
      </div>
    );
  }
}

const rowClassName = (record) => {
  if (record.patient != null && record.patient.infectiousDisease != null && record.patient.infectiousDisease !== '') {
    return Styles.red;
  }
};

export default connect(({ utils, patientStoreExec }) => ({ utils, patientStoreExec }))(PatientStoreExecList);
