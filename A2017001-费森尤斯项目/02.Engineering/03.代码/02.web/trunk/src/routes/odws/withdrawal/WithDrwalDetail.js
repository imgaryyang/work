import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, notification, Button } from 'antd';
import EditTable from '../../../components/editTable/EditTable';
import styles from './WithDrwal.less';

class WithDrwalDetail extends Component {
  constructor(props) {
    super(props);
    this.refreshTable = this.refreshTable.bind(this);
    this.onCommit = this.onCommit.bind(this);
  }

  onCommit() { 
    const { orders } = this.props.visitRecord;
    console.info(orders)
    let flag = 0;
    if (orders !== null) {
      for (let i = 0; i < orders.length; i++) {
        if (typeof(orders[i].backqty) !== 'undefined') {
          if (orders[i].backqty !== '' && orders[i].backqty !== 0 && orders[i].backqty !== '0') {
            flag++;
          } 
        }
      }
    }
    if (flag === 0) {
      notification.info({
        message: '提示',
        description: '请填写退药数量之后再退药！',
      });
      return;
    } else {
      if (orders !== null) {
      for (let i = 0; i < orders.length; i++) {
        if (( typeof (orders[i].backqty) !== 'undefined') && orders[i].backqty !== '' && orders[i].backqty !== 0 && orders[i].backqty !== '0') {
          if (orders[i].packUnit === orders[i].phaDrugInfo.packUnit ) {
            orders[i].qty = orders[i].qty - (orders[i].backqty * orders[i].phaDrugInfo.packQty);
          } else {
            orders[i].qty = orders[i].backqty;
          }
        }
      }
    }

    }
    this.props.dispatch({
      type: 'visitRecord/splitOrders',
    });
    this.props.dispatch({
      type: 'visitRecord/setState',
      payload: { visible: true },
    });
  }

  refreshTable(value, index, key) {
    const { orders } = this.props.visitRecord;
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    if (value > orders[index].packQty) {
      notification.info({
        message: '提示',
        description: '数量不能大于原处方数量！',
      });
      return;
    }
    this.props.dispatch({
      type: 'visitRecord/setState',
      payload: {
        newOrders: newData,
      },
    });
  }
  render() {
    const { odws, utils, visitRecord } = this.props;
    const { odwsWsHeight } = odws;
    const { reg, orders, totalAmt } = visitRecord;

    let totalCost;
    if (totalAmt != null && reg.totalFee != null) {
      totalCost = totalAmt + reg.totalFee;
      // console.info(totalCost.formatMoney());
    }

    // 不需要特殊渲染的列使用此方法公用判断是否跨列
    const renderContent = (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      if (!row.itemName) {
        obj.props.colSpan = 0;
      }
      return obj;
    };


    const orderColumns = [
      { title: '组合号',
        dataIndex: 'comboNo',
        key: 'comboNo',
        width: 60,
        className: 'text-no-wrap text-align-center',
        render: (text, record) => {
          if (record.itemName) {
            return text;
          } else {
            return {
              children: (
                <div style={{ fontWeight: 'bold', textAlign: 'left' }} >
                  {`处方号：${record.recipeId} (${utils.dicts.dis('GROUP_TYPE', record.drugFlag)})`}
                </div>
              ),
              props: {
                colSpan: 6,
              },
            };
          }
        },
      },
      { title: '序号',
        dataIndex: 'recipeNo',
        key: 'recipeNo',
        width: 45,
        className: 'text-no-wrap text-align-center',
        render: renderContent,
      },
      { title: '项目',
        dataIndex: 'itemName',
        key: 'itemName',
        className: styles.itemNameCol,
        render: (text, record) => {
          const packQty = `${record.packQty ? parseFloat(record.packQty) : '- '}${record.packUnit}`;
          const days = ` | ${record.days ? record.days : '-'}天`;
          const usage = record.usage ? `${utils.dicts.dis('USAGE', record.usage)} ` : '';
          const dosage = record.doseOnce || record.doseUnit ? ` 每次 ${record.doseOnce ? parseFloat(record.doseOnce) : '-'}${record.doseUnit || ''}` : '';
          const freq = record.freqDesc ? ` | ${record.freqDesc} ` : '';
          return {
            children: (
              <div>
                {`${text} (${packQty}${record.drugFlag !== '3' ? days : ''})`}
                {
                  record.drugFlag !== '3' ? (
                    <div>
                      {`${usage}${dosage}${freq}`}
                    </div>
                  ) : null
                }
              </div>
            ),
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
      { title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 80,
        className: 'text-no-wrap text-align-right',
        render: (text, record) => {
          return {
            children: text ? parseFloat(text).formatMoney() : '',
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
      { title: '原数量',
        dataIndex: 'packQty',
        key: 'packQty',
        width: 45,
        className: 'text-align-right text-no-wrap',
        colSpan: (text, record) => {
          return record.itemName ? 1 : 0;
        },
        render: (text, record) => (record.packQty ? record.packQty + record.packUnit : ''),
      },
      { title: '退药数量',
        dataIndex: 'backqty',
        key: 'backqty',
        width: 80,
        className: 'text-align-right text-no-wrap',
        editable: (text, record) => {
          return record.itemName ? true : false;
        },
        colSpan: (text, record) => {
          return record.itemName ? 1 : 0;
        },
        addonAfter: (text, record) => {
          return record.packUnit;
        },
      },
      { title: '总价',
        dataIndex: 'salePrice',
        key: 'sumAmt',
        width: 50,
        className: 'text-no-wrap text-align-right',
        render: (text, record) => {
          return {
            children: text && record.packQty ? (parseFloat(text) * parseFloat(record.packQty)).formatMoney() : '',
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
      { title: '执行科室',
        dataIndex: 'exeDept',
        key: 'exeDept',
        width: 80,
        render: (text, record) => {
          return {
            children: utils.depts.disDeptName(utils.deptsIdx, text),
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
    ];

    return (
      <div className={styles.detailContainer} style={{ height: `${odwsWsHeight}px` }} >

        <Card className={styles.detailCard} title="医嘱" >
          <EditTable
            data={orders}
            pagination={false}
            columns={orderColumns}
            bordered
            rowSelection={false}
            ref="commonTable"
            onChange={this.refreshTable.bind(this)}
          />
        </Card>
        <div style={{ textAlign: 'right', paddingTop: '5px' }} >
          <Button type="primary" size="large" onClick={() => this.onCommit()} icon="save" >退药</Button>
        </div>
      </div>
    );
  }
}
export default connect(
  ({ odws, odwsDiagnose, utils, visitRecord }) => ({ odws, odwsDiagnose, utils, visitRecord }),
)(WithDrwalDetail);
