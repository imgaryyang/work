import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button, Tooltip, Icon, Modal } from 'antd';
import { testInt } from '../../../utils/validation';
import EditTable from '../../../components/editTable/EditTable';
import ShadowDiv from '../../../components/ShadowDiv';

import styles from './ProcurePlan.less';

class ProcurePlanList extends Component {

  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.onSaveBuy = this.onSaveBuy.bind(this);
    this.onCommitBuy = this.onCommitBuy.bind(this);
    this.onNew = this.onNew.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
  }

  state = {
    x: null,
    record: {},
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'procurePlan/loadBuy',
    });
  }

  onDelete(record) {
    // console.info('onDelete', record);
    this.props.dispatch({
      type: 'procurePlan/deleteBuyDetail',
      record,
    });
  }

  onSaveBuy() {
    this.props.dispatch({
      type: 'procurePlan/saveBuy',
      buyState: '0',
    });
  }

  onCommitBuy() {
    this.props.dispatch({
      type: 'procurePlan/saveBuy',
      buyState: '1',
    });
  }

  onNew() {
    this.props.dispatch({
      type: 'procurePlan/deleteBuy',
    });
  }

  refreshTable(value, index, key) {
//    const table = this.refs.commonTable;
//    const newData = table.getUpdatedData();
    const { buy } = this.props.procurePlan;
//    buy.buyDetail = newData;
//    // console.log('value, index, key', value, index, key);
//    let reg = '';
//    if (key === 'buyNum') {
//      reg = /^-?([1-9][0-9]*)?$/;
//    } else if (key === 'buyPrice') {
//      reg = /^-?\d+\.{0,1}\d{0,4}$/;
//    }
//    return;
//    // console.log('reg, reg.test(value)', reg, reg.test(value));
//    if (!reg.test(value)) {
//      Modal.error({ content: '出库数量请输入数字！' });
//      return;
//    }
    this.props.dispatch({
      type: 'procurePlan/setState',
      payload: {
        buy,
      },
    });
  }

  render() {
    const { procurePlan, base, utils } = this.props;
    const { id: deptId } = base.user.loginDepartment;
    const { buy } = procurePlan || {};
    const buyDetail = buy.buyDetail || [];
    const rowIndex = this.state.x;
    // console.info('rowIndex', rowIndex, base, deptId, buy);
    const columns = [
      { title: '药品信息',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 280,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`生产厂商：${record.producer ? (record.producer.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'specs', key: 'specs', width: 50 },*/
      { title: '计划购入价',
        dataIndex: 'buyPrice',
        key: 'buyPrice',
        width: 105,
        className: 'text-align-center',
        editable: true,
        render: (text, record) => {
          // console.info("---", record, typeof record.buyPrice);
          return record.buyPrice ? record.buyPrice.formatMoney(4) : '0.0000';
        },
      },
      { title: '计划数量',
        dataIndex: 'buyNum',
        key: 'buyNum',
        width: 105,
        className: 'text-align-center',
        editable: true,
        editorConfig: { verfy: (v) => { return testInt(v); } },
        addonAfter: (text, record) => {
          return record.buyUnit;
        },
      },
      /* { title: '单位', dataIndex: 'buyUnit', key: 'buyUnit', width: 50 },*/
      { title: '计划金额',
        dataIndex: 'buyCost',
        key: 'buyCost',
        className: 'text-align-right',
        width: 85,
        render: (text, record) => (record.buyNum * record.buyPrice !== 0 ? (record.buyNum * record.buyPrice).formatMoney(2) : 0.00),
      },
      { title: '本科库存',
        dataIndex: 'deptSum',
        key: 'deptSum',
        width: 80,
        className: 'text-align-right',
        render: (text, record) => {
          let storeStr = '';
          let storeSumMin = 0;
          let store = 0;
          // console.info('本科库存', record);
          if (record.drugInfo.packQty > 0) {
            storeSumMin = record.storeDept % record.drugInfo.packQty;
            store = record.storeDept / record.drugInfo.packQty;
          }
          if (storeSumMin > 0) {
            storeStr = store.formatMoney(0) +
            record.buyUnit +
            storeSumMin.formatMoney(0) +
            record.miniUnit;
          } else {
            storeStr = store.formatMoney(0) +
            record.buyUnit;
          }
          return storeStr;
        },
      },
      { title: '全院库存',
        dataIndex: 'totalSum',
        key: 'totalSum',
        width: 80,
        className: 'text-align-right',
        render: (text, record) => {
          let storeStr = '';
          let storeSumMin = 0;
          let store = 0;
          if (record.drugInfo.packQty > 0) {
            storeSumMin = record.storeSum % record.drugInfo.packQty;
            store = record.storeSum / record.drugInfo.packQty;
          }
          if (storeSumMin > 0) {
            storeStr = store.formatMoney(0) +
            record.buyUnit +
            storeSumMin.formatMoney(0) +
            record.miniUnit;
          } else {
            storeStr = `${store.formatMoney(0)} ${record.buyUnit}`;
          }
          return storeStr;
        },
      },
      /* { title: '生产厂商', dataIndex: 'producer.companyName', key: 'producer.companyName', width: 50 },*/
      { title: '操作',
        key: 'action',
        width: 55,
        className: 'text-align-center',
        render: (text, record) => (
          <Tooltip placement="top" title={'删除'}>
            <Icon type="delete" style={{ cursor: 'pointer', color: 'red' }} onClick={this.onDelete.bind(this, record)} />
          </Tooltip>
        ),
      },
    ];

    // const page = { total: 0, pageSize: 10, pageNo: 1 };
    const { depts, deptsIdx } = utils || {};
    const dept = depts.disDeptName(deptsIdx, deptId);
    const user = base.user.name;
    let totAmount = 0;
    for (const i of buyDetail) {
      totAmount += i.buyPrice * i.buyNum || 0;
    }

    const { wsHeight } = base;
    const bottomHeight = wsHeight - 39 - 6 - 5;

    // console.info('-------======================', buyDetail);
    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row >
            <Col span={6} >
              <div>计划科室：{dept}</div>
            </Col>
            <Col span={6} >
              <div>计划人：{user}</div>
            </Col>
            <Col span={6} >
              <div>单据号：{buy.buyBill}</div>
            </Col>
            <Col span={6} >
              <div>计划金额：{totAmount.formatMoney(2)}</div>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <ShadowDiv showTopShadow={false} style={{ height: `${bottomHeight - 52}px` }} >
            <EditTable
              data={buyDetail} page={buy.page} pagination={false} columns={columns} size="middle"
              rowSelection={false} bordered ref="commonTable"
              onChange={this.refreshTable.bind(this)}
              scroll={{ y: (wsHeight - 52 - 33 - 53) }}
            />
          </ShadowDiv>
          <div style={{ textAlign: 'right', paddingTop: '5px' }} >
            <Button size="large" onClick={() => this.onNew()} style={{ marginRight: '10px' }} icon="plus" >新建</Button>
            <Button size="large" onClick={() => this.onSaveBuy()} style={{ marginRight: '10px' }} icon="cloud-upload-o" >暂存</Button>
            <Button type="primary" size="large" onClick={() => this.onCommitBuy()} icon="save" >提交</Button>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(({ procurePlan, base, utils }) => ({ procurePlan, base, utils }))(ProcurePlanList);
// onRowClick={(record,index)=>this.setState({x: index})}

// <span>
// {
// index!=rowIndex?
// <Tooltip placement="top" title={"编辑"}>
// <Icon type="edit" style={{cursor:'pointer',color:'red'}}
// onClick={this.edit.bind(this, index)} />
// </Tooltip>
// :
// <span>
// <Tooltip placement="top" title={"保存"}>
// <Icon type="save" style={{cursor:'pointer',color:'red'}}
// onClick={this.editDone.bind(this, index, 'save')} />
// </Tooltip>
// <span className="ant-divider" />
// <Tooltip placement="top" title={"取消"}>
// <Icon type="rollback" style={{cursor:'pointer',color:'red'}}
// onClick={this.editDone.bind(this, index, 'cancel')} />
// </Tooltip>
// </span>
// }
// <span className="ant-divider" />
// </span>
//
// render: (text, record, index )=>this.renderColumns( index, 'buyPrice', text
// ),
// render: (text, record, index )=>this.renderColumns( index, 'buyNum', text ),

// renderColumns( index, key, text) {
//
// let editable;
// if( typeof text === 'undefined' || text == null ){
//  text = "";
// }
// if( index !== this.state.x  ){
//  return text;
// }
// console.info("====text====", text, editable, status, index, this.state.x);
// return (<EditableCell
//    value={text}
//    onChange={value => this.handleChange(key, index, value)}
// />);
// }
// handleChange(key, index, value) {
// console.info("handleChange", key, index, value);
// if( typeof this.state.record === 'object' )
//  this.state.record[key] = value;
// console.info("handleChange", key, index, value);
// }
//
// edit(index){
// console.info("=edit=", index);
// const { buyDetail } = this.props.procurePlan.buy || [];
// const record = {...buyDetail[index]};
// console.info("=record=", record);
// this.setState({x: index, record: record});
// }
//
// editDone(index, type){
// const { buy } = this.props.procurePlan || {};
// if( type === 'cancel'){
//  this.setState({x: -1});
//  return;
// }
//
// if( type === 'save'){
//  this.props.dispatch({
//    type:'procurePlan/modifyCol',
//    index: index,
//    record: this.state.record,
//  });
//  this.setState({x: -1});
// }
// }
//
