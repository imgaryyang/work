import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import _ from 'lodash';
import { Icon, notification, Button } from 'antd';
import EditTable from '../../../components/editTable/EditTable';
import Styles from './PatientStoreExecList.less';

class PhaLisList extends React.Component {

  onPageChange(page) {
    this.props.dispatch({ type: 'phaLis/load', payload: { page } });
  }

  confirm(record) {
    const newRecord = _.omit(record, 'patient.identityPic');
    if (!newRecord.specimenType || newRecord.specimenType === '' || newRecord.specimenType === null) {
      notification.info({ message: '提示信息：', description: '样本类型不能为空！' });
      return false;
    }
    if (!newRecord.specimencount || newRecord.specimencount === '' || newRecord.specimencount === null) {
      notification.info({ message: '提示信息：', description: '样本数量不能为空！' });
      return false;
    }
    if (!newRecord.specimendate || newRecord.specimendate === '' || newRecord.specimendate === null) {
      notification.info({ message: '提示信息：', description: '采样时间不能为空！' });
      return false;
    }
    this.props.dispatch({
      type: 'phaLis/save',
      payload: { newRecord },
    });
  }

  loadDetail(record) {
    this.props.dispatch({
      type: 'phaLis/setState',
      payload: { record },
    });
    const search = { recipeId: record.recipeId, recipeNo: record.recipeNo, itemCode: record.itemInfo.id };
    this.props.dispatch({
      type: 'phaLis/loadRecord',
      payload: { query: search },
    });
  }

  doPrint() {
    let print = {};
    // 姓名：章珠珍  化验类型：血清总蛋白  条码：4028b8825cdf0974015cdf663890000c
    print.name = '章珠珍';
    print.type = '血清总蛋白';
    print.code = '4028B8825CDF09';
    this.props.dispatch({
      type: 'print/getPrint',
      payload: { code: '118', printData: print },
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
          return false;
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
        type: 'phaLis/setState',
        payload: { data: newData },
      });
    }
  }

  render() {
    const { page, data } = this.props;
    const { dicts } = this.props.utils;
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (!data[i].specimenType || data[i].specimenType === null) {
          data[i].specimenType = '03';
        }
      }
    }
    const columns = [
      { title: '就诊号', dataIndex: 'regNo', key: 'regNo', width: '120px' },
      { title: '姓名', dataIndex: 'patient.name', key: 'patient.name' },
      { title: '性别', dataIndex: 'patient.sex', key: 'patient.sex', render: text => (text ? dicts.dis('SEX', text) : '') },
      { title: '出生日期', dataIndex: 'patient.birthday', key: 'patient.birthday', width: '80px', render: text => (text ? moment(text).format('YYYY-MM-DD') : '') },
      { title: '传染病', dataIndex: 'patient.infectiousDisease', key: 'patient.infectiousDisease', render: text => (text ? dicts.dis('INFECTIOUS_DISEASE', text) : '') },
      { title: '开单科室', dataIndex: 'seeDept.deptName', key: 'seeDept.deptName' },
      { title: '开单医生', dataIndex: 'seeDoc.name', key: 'seeDoc.name' },
      { title: '处方号', dataIndex: 'recipeId', key: 'recipeId', width: '120px' },
      { title: '项目名称', dataIndex: 'itemInfo.itemName', key: 'itemInfo.itemName' },
      { title: '样本类型',
        dataIndex: 'specimenType',
        key: 'specimenType',
        editor: 'dictSelect',
        width: 90,
        className: 'text-align-center',
        editorConfig: {
          columnName: 'SPECIMENT',
        },
        editable: true,
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
        width: 78,
        dataIndex: 'specimencount',
        key: 'specimencount',
        editable: true,
        className: 'text-align-center',
      },
      { title: '剩余次数', dataIndex: 'remainQty', key: 'remainQty', width: 78 },
      { title: '操作',
        key: 'action',
        width: 90,
        className: 'text-align-center',
        render: (text, record) => {
          return <Button onClick={this.confirm.bind(this, record)} disabled={record.useQty === record.qty} style={{ width: '70px' }} ><Icon type="save" />确认</Button>;
        },
      },
    ];

    return (
      <div>
        <EditTable
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

export default connect(({ utils, phaLis }) => ({ utils, phaLis }))(PhaLisList);
