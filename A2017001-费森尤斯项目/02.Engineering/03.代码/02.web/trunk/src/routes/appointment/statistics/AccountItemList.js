import React, { Component } from 'react';
import _ from 'lodash';
import CommonTable from '../../../components/CommonTable';

class AccountItemList extends Component {

  state = {
    accountItemDto: {
      westMedicineFee: '西药费',
      radiationFee: '放射费',
      surgeryFee: '手术费',
      assayFee: '化验费',
      bloodTransFee: '输血费',
      oxygenTransFee: '输氧费',
      attendaceFee: '护理费',
      otherFee: '其他',
      pathology: '病理',
      functionFee: '功能费',
      chineseMedicine: '中药费',
      anaesthesiaFee: '麻醉费',
      electromyography: '肌电图',
      lungFuction: '肺功',
      endoscopy: '内窥镜',
      deliverFee: '接生费',
      isotopeCure: '同位素治疗',
      rescueFee: '抢救',
      dialysisFee: '透析费',
      laserCureFee: '激光治疗费',
      chineseHerbsFee: '中草药费',
      needlePhysiotherapyFee: '针体理疗费',
      bloodCure: '血疗',
      radiationTherapy: '放疗费',
      materialFee: '材料费',
      operateMaterialFee: '手术材料费',
      researchFee: '科研',
      proxyCookFee: '代煎费',
      cureRadiationFee: '治疗类放射收入',
      operateRadiationFee: '手术类放射费',
      regFee: '挂号费',
      checkSpecialMateralFee: '检查类特殊材料',
      cureSpecialMateralFee: '治疗特殊材料费',
      operateSpecialMateralFee: '手术特殊材料费',
      caseRecordFee: '病例费',
      bedFee: '床位费',
      diagnosisFee: '诊断费',
      checkFee: '检查费',
      cureFee: '治疗费',
      allSum: '汇总',
    },
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['INVOICE_TYPE'],
    });
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['hcpUserCashier'],
    });
    this.props.dispatch({
      type: 'accountItem/load',
      payload: { query: {} },
    });
  }

  render() {
    const { wsHeight } = this.props;

    let { data } = this.props;

    const totalRow = data.filter(item => item.person === '总计');

    const totalObj = _.omit(totalRow[0], ['person']) || {};

    const dynamicColumn = [];

    const formatMoney = v => (v || 0).formatMoney();

    Object.keys(totalObj).map((k) => {
      const amt = totalObj[k];
      if (amt > 0) {
        dynamicColumn.push({
          title: this.state.accountItemDto[k],
          dataIndex: k,
          key: k,
          width: '5%',
          className: 'column-right',
          render: (value) => { return formatMoney(value); },
        });
      }
      return dynamicColumn;
    });

    let defaultColumn = [
      {
        title: '收款员',
        dataIndex: 'person',
        key: 'person',
        width: '5%',
      },
    ];

    defaultColumn = dynamicColumn.length > 0 ? defaultColumn : [];

    data = dynamicColumn.length > 0 ? data : [];

    const columns = [...defaultColumn, ...dynamicColumn];

    return (
      <div>
        <CommonTable
          bordered
          rowSelection={false}
          data={data}
          columns={columns}
          pagination={false}
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default AccountItemList;
