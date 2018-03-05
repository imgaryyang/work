import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import _ from 'lodash';
import { Icon, notification, Button, Modal } from 'antd';
import CommonTable from '../../../components/CommonTable';
import Styles from './PatientStoreExecList.less';

class LisSearchList extends React.Component {

  onPageChange(page) {
    this.props.dispatch({ type: 'phaLisResult/load', payload: { page } });
  }
  confirm(record) {
    const newRecord = _.omit(record, 'patient.identityPic');
    this.props.dispatch({
      type: 'phaLisResult/save',
      payload: { newRecord },
    });
  }
  loadDetail(record) {
    this.props.dispatch({
      type: 'phaLisResult/setState',
      payload: { record },
    });
    const search = { recipeId: record.recipeId, recipeNo: record.recipeNo, itemCode: record.itemInfo.id };
    this.props.dispatch({
      type: 'phaLisResult/loadRecord',
      payload: { query: search },
    });
  }

  printData(record, e) {
    const exambarcode = record.exambarcode;
    const stateFlag = record.stateFlag;
    if (stateFlag === '2') {
      /*Modal.confirm({
        content: '确定要打印吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.dispatch({
            type: 'print/getPrintInfo',
            payload: { code: '119', bizId: exambarcode },
          });
        },
      });*/

      this.props.dispatch({ type: 'phaLisResult/toggleVisible' });
      this.props.dispatch({
        type: 'print/getPrintView',
        payload: { code: '119', bizId: exambarcode, url:'phaLisResult/setState' },
      });
    } else {
      Modal.confirm({
        content: '样本已送检，暂无检测结果！',
        cancelText: '取消',
      });
    }
  }


  render() {
    const { page, data } = this.props;
    const { dicts } = this.props.utils;
    if (data && data.length > 0) {
      data[0].specimenType = '01';
    }
    const columns = [
      { title: '就诊号', dataIndex: 'regNo', key: 'regNo', width: '120px' },
      { title: '姓名', dataIndex: 'patient.name', key: 'patient.name', width: '75px' },
      { title: '性别', dataIndex: 'patient.sex', key: 'patient.sex', render: text => (text ? dicts.dis('SEX', text) : '') },
      { title: '出生日期', dataIndex: 'patient.birthday', key: 'patient.birthday', width: '80px', render: text => (text ? moment(text).format('YYYY-MM-DD') : '') },
      { title: '传染病', dataIndex: 'patient.infectiousDisease', width: '80px', key: 'patient.infectiousDisease', render: text => (text ? dicts.dis('INFECTIOUS_DISEASE', text) : '') },
      { title: '项目名称', dataIndex: 'itemInfo.itemName', key: 'itemInfo.itemName' },
      { title: '处方号', dataIndex: 'recipeId', key: 'recipeId', width: '120px' },
      { title: '样本类型',
        dataIndex: 'specimenType',
        key: 'specimenType',
        width: 90,
        className: 'text-align-center',
        render: (value) => {
          return dicts.dis('SPECIMENT', value);
        },
      },
      { title: '采样时间',
        width: 120,
        dataIndex: 'specimendate',
        key: 'specimendate',
        editor: 'date',
        className: 'text-align-center',
        editable: true,
      },
      { title: '送检时间',
        width: 120,
        dataIndex: 'senddate',
        key: 'senddate',
        editor: 'date',
        className: 'text-align-center',
        editable: true,
      },
      { title: '标本个数',
        width: 70,
        dataIndex: 'specimencount',
        key: 'specimencount',
        editable: true,
        className: 'text-align-center',
      },
      { title: '状态',
        dataIndex: 'stateFlag',
        key: 'stateFlag',
        width: 78,
        render: (value) => {
          return dicts.dis('STATE_FLAG', value);
        },
      },
      { title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.printData.bind(this, record)} disabled={record.useQty === record.qty} style={{ width: '70px' }} ><Icon type="copy" />查看</Button>;
        },
      },
    ];

    return (
      <div>
        <CommonTable
          data={data} page={page} columns={columns}
          rowClassName={rowClassName}
          onPageChange={this.onPageChange.bind(this)}
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

export default connect(({ utils, phaLis }) => ({ utils, phaLis }))(LisSearchList);
