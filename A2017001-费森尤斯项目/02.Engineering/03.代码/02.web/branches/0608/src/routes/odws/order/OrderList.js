import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Button, notification, Checkbox } from 'antd';
import _ from 'lodash';
import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import ShadowDiv from '../../../components/ShadowDiv';

import styles from './Order.less';

class OrderList extends Component {

  constructor(props) {
    super(props);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.makeGroup = this.makeGroup.bind(this);
    this.delFromGroup = this.delFromGroup.bind(this);
    this.sort = this.sort.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  onSelectChange(rowKeys) {
    this.props.dispatch({
      type: 'odwsOrder/setState',
      payload: {
        selectedItemRowKeys: rowKeys,
      },
    });
  }

  onEdit(record, idx) {
    console.log(record, idx);
    this.props.dispatch({
      type: 'odwsOrder/setState',
      payload: {
        order: record,
        listIdx: idx,
      },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'odwsOrder/deleteItem',
      id: record.id,
    });
  }

  makeGroup() {
    const { selectedItemRowKeys, orders } = this.props.odwsOrder;
    if (selectedItemRowKeys.length < 2) {
      notification.warning({
        message: '警告',
        description: '请选择至少两条需要组合的明细！',
      });
    } else {
      let recipeId = '';
      for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < selectedItemRowKeys.length; j++) {
          if (orders[i].id === selectedItemRowKeys[j]) {
            if (recipeId && recipeId !== orders[i].recipeId) {
              notification.warning({
                message: '警告',
                description: '不允许跨处方组合项目！',
              });
              return;
            }
            recipeId = orders[i].recipeId;
          }
        }
      }
      this.props.dispatch({
        type: 'odwsOrder/makeGroup',
      });
    }
  }

  delFromGroup() {
    const { selectedItemRowKeys } = this.props.odwsOrder;
    if (selectedItemRowKeys.length === 0) {
      notification.warning({
        message: '警告',
        description: '请选择要移除的明细！',
      });
    } else {
      this.props.dispatch({
        type: 'odwsOrder/deleteFromGroup',
      });
    }
  }

  sort(record, idx, direction) {
    const { orders } = this.props.odwsOrder;
    // 处方中明细项数量
    // const count = itemCount[record.recipeId];
    // 如果只有一项或没有明细项，则不触发排序
    // if (count < 2) return;

    // 如果上移且上一项是处方信息组合项，则不触发排序
    if (direction === 'up' && !orders[idx - 1].itemName) return;
    // 如果下移且下一项是处方信息组合项或最后一项，则不触发排序
    if (direction === 'down' && (idx === orders.length - 1 || !orders[idx + 1].itemName)) return;

    this.props.dispatch({
      type: 'odwsOrder/sortItems',
      payload: {
        record,
        idx,
        direction,
      },
    });
  }

  selectItem(e, id) {
    console.log(e, id);
    const { selectedItemRowKeys } = this.props.odwsOrder;
    if (e.target.checked) {
      selectedItemRowKeys.push(id);
      this.props.dispatch({
        type: 'odwsOrder/setState',
        payload: {
          selectedItemRowKeys,
        },
      });
    } else {
      const deleted = _.remove(selectedItemRowKeys, id);
      this.props.dispatch({
        type: 'odwsOrder/setState',
        payload: {
          selectedItemRowKeys: deleted,
        },
      });
    }
  }

  render() {
    const { odwsOrder, odws, utils } = this.props;
    const { orders, listIdx, selectedItemRowKeys, order, totalAmt } = odwsOrder;
    console.log('selectedItemRowKeys:', selectedItemRowKeys);
    const { odwsWsHeight } = odws;
    // drugFlag === ‘3’ 时选择的是收费项，否则选择的是药品
    const bottomCardHeight = order.drugFlag !== '3' ?
      (odwsWsHeight - 147 - 10 - 6) :
      (odwsWsHeight - 106 - 10 - 6);

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

    const columns = [
      { title: '选择',
        dataIndex: 'id',
        key: 'id',
        width: 45,
        className: 'text-no-wrap text-align-center',
        render: (text, record) => {
          return {
            children: (
              <Checkbox
                onChange={e => this.selectItem(e, text)}
              />
            ),
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
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
                colSpan: 9,
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
          const qty = `${record.qty ? parseFloat(record.qty) : '- '}${record.unit}`;
          const days = ` | ${record.days ? record.days : '-'}天`;
          const usage = record.usage ? `${utils.dicts.dis('USAGE', record.usage)} ` : '';
          const dosage = record.doseOnce || record.doseUnit ? ` 每次 ${record.doseOnce ? parseFloat(record.doseOnce) : '-'}${record.doseUnit || ''}` : '';
          const freq = record.freqDesc ? ` | ${record.freqDesc} ` : '';
          return {
            children: (
              <div>
                {`${text} (${qty}${record.drugFlag !== '3' ? days : ''})`}
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
            children: text ? parseFloat(text).formatMoney(4) : '',
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
      { title: '数量',
        dataIndex: 'qty',
        key: 'qty',
        width: 45,
        className: 'text-no-wrap text-align-right',
        render: (text, record) => {
          return {
            children: parseFloat(text),
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
      { title: '总价',
        dataIndex: 'salePrice',
        key: 'sumAmt',
        width: 80,
        className: 'text-no-wrap text-align-right',
        render: (text, record) => {
          return {
            children: text && record.qty ? (parseFloat(text) * parseFloat(record.qty)).formatMoney() : '',
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
      { title: '操作',
        dataIndex: 'id',
        key: 'operation',
        width: 120,
        className: 'text-align-center text-no-wrap',
        render: (value, record, idx) => {
          return {
            children: record.orderState === '1' && record.chargeFlag === '0' ? (
              <span>
                <Tooltip placement="left" title="修改" >
                  <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record, idx)} />
                </Tooltip>
                <span className="ant-divider" />
                <Tooltip placement="right" title="删除" >
                  <RowDelBtn onOk={() => this.onDelete(record, idx)} />
                </Tooltip>
                <span className="ant-divider" />
                <Tooltip placement="left" title="上移" >
                  <Icon type="up-circle-o" onClick={() => this.sort(record, idx, 'up')} />
                </Tooltip>
                <span className="ant-divider" />
                <Tooltip placement="right" title="下移" >
                  <Icon type="down-circle-o" onClick={() => this.sort(record, idx, 'down')} />
                </Tooltip>
              </span>
            ) : (
              <div />
            ),
            props: {
              colSpan: record.itemName ? 1 : 0,
            },
          };
        },
      },
    ];

    return (
      <div>
        <ShadowDiv showTopShadow={false} style={{ height: `${bottomCardHeight - 5 - 50}px` }} >
          <CommonTable
            data={orders}
            columns={columns}
            pagination={false}
            bordered
            className="compact-table"
            scroll={{
              y: (bottomCardHeight - 10 - 33 - 52),
            }}
            rowClassName={
              (record, idx) => { return idx === listIdx ? 'selectedRow' : ''; }
            }
            rowSelection={false}
          />
        </ShadowDiv>
        <div className={styles.totalAmt} >共计：<font>{totalAmt.formatMoney()}</font> 元</div>
        <div className={styles.btnContainer} >
          <Button onClick={this.makeGroup} style={{ marginRight: '10px' }} icon="switcher" size="large" >成组</Button>
          <Button onClick={this.delFromGroup} icon="menu-unfold" size="large" >从组合删除</Button>
          {/* <Button onClick={this.sort} icon="retweet" size="large" >更新排序</Button>*/}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ utils, odws, odwsOrder }) => ({ utils, odws, odwsOrder }),
)(OrderList);

