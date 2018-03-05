import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './ReceptionSearchBar';

import styles from './Reception.less';

/**
 * 判断日期是否当天
 */
function isToday(date) {
  return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
}

class ReceptionList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onRecipeRowClick = this.onRecipeRowClick.bind(this);
  }

  onSearch(query, search) {
    this.props.dispatch({
      type: 'odws/loadRegInfo',
      payload: {
        query,
        search,
      },
    });
  }

  onRecipeRowClick(text, record, idx) {
    // 非当天且正在就诊时，只能查看
    if (!isToday(record.regTime) || record.regState !== '21') {
      this.props.dispatch({
        type: 'odws/setState',
        payload: {
          listIdx: idx, // 选中列表中的当前行
          currentReg: record,
          currTabKey: '2', // 指定打开第二个 tab 页
          treatStep: isToday(record.regTime) && (record.regState === '30' || record.regState === '31') ? 'diagnose' : 'history', // 继续就诊导向“就诊”，查看导向“就诊记录”
        },
      });
      return;
    }
    this.props.dispatch({
      type: 'odws/visiting',
      payload: {
        listIdx: idx,
        currentReg: record,
        currTabKey: '2',
      },
    });
  }

  render() {
    const { odws, utils } = this.props;
    const { regs, listIdx, odwsWsHeight } = odws;
    const listCardHeight = odwsWsHeight - 3 - 116 - 30;

    const columns = [
      { title: '序号', dataIndex: 'seeNo', key: 'seeNo', width: 40, className: 'text-align-center text-no-wrap' },
      { title: '就诊号', dataIndex: 'regId', key: 'regId', width: 130, className: 'text-align-center text-no-wrap' },
      { title: '患者ID', dataIndex: 'patient.patientId', key: 'patientCode', width: 130, className: 'text-align-center text-no-wrap' },
      { title: '姓名',
        dataIndex: 'patient.name',
        key: 'patientName',
        width: 150,
        render: (text, record) => {
          return `${text}（${utils.dicts.dis('SEX', record.patient.sex)} | ${record.patient.birthday == null ? " " : moment().diff(moment(record.patient.birthday), 'years')}岁）`;
        },
      },
      { title: '费别', dataIndex: 'feeType', key: 'feeType', width: 50, render: text => utils.dicts.dis('FEE_TYPE', text) },
      { title: '号别', dataIndex: 'regLevel', key: 'regLevel', width: 80, render: text => utils.dicts.dis('REG_LEVEL', text) },
      { title: '状态', dataIndex: 'regState', key: 'regState', width: 80, render: text => utils.dicts.dis('REG_STATE', text) },
      { title: '是否急诊', dataIndex: 'emergencyFalg', key: 'emergencyFalg', width: 70, className: 'text-align-center text-no-wrap', render: text => (text ? '是' : '否') },
      { title: '挂号日期', dataIndex: 'regTime', key: 'regTime', width: 100, className: 'text-align-center text-no-wrap', render: (text) => { return text ? moment(text).format('YYYY-MM-DD') : ''; } },
      { title: '接诊医生', dataIndex: 'seeDoc.name', key: 'seeDoc', width: 90 },
      { title: '操作',
        dataIndex: 'id',
        key: 'operation',
        width: 110,
        className: 'text-align-center text-no-wrap',
        render: (text, record, idx) => {
          let btnText = '';
          // 只能接诊当天的挂号
          if (moment(this.props.odws.query.regTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) {
            if (record.regState === '21') btnText = '接诊';
            else btnText = '继续就诊';
          } else {
            btnText = '查看';
          }
          return <Button onClick={() => this.onRecipeRowClick(text, record, idx)} size="small" style={{ width: '70px' }} >{btnText}</Button>;
        },
      },
    ];

    return (
      <div style={{ paddingTop: '3px' }} >
        <Card className={styles.receptionTopCard} >
          <SearchBar onSearch={this.onSearch} />
        </Card>
        <Card style={{ height: `${listCardHeight}px` }} className={styles.receptionBottomCard} >
          <CommonTable
            rowSelection={false}
            data={regs}
            columns={columns}
            pagination={false}
            scroll={{ y: (listCardHeight - 10 - 37) }}
            rowClassName={
              (record, idx) => { return idx === listIdx ? 'selectedRow' : ''; }
            }
            bordered
            size="middle"
          />
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ odws, base, utils }) => ({ odws, base, utils }),
)(ReceptionList);

