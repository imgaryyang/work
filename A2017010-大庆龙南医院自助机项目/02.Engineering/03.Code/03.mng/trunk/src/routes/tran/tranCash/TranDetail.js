import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Button, Row, Col} from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import FieldSet from '../../../components/FieldSet';
import { order, settlement, prestore } from '../../base/Dict';

import styles from './TranCash.less';

class TranDetail extends Component {

  constructor(props) {
    super(props);
    this.handleCallBack = this.handleCallBack.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
  }

  handleCallBack() {
	  const { cashTran } = this.props;
	  const { details } = cashTran;
	 
	  Modal.confirm({
        title: '确认',
        content: '是否确认该笔现金补录？',
        okText: '确认',
        cancelText: '我再看看',
        onOk: () => { 
        	this.props.dispatch({
       	      	type: 'cashTran/cashCallBack',
       	      	payload: {...details}
   	  		});
    	},
      });
  }
  
  handleCancel() {
    this.props.dispatch({
      type: 'cashTran/setState',
      payload: {
        detailSpin: false,
        detailVisible: false,
        briefRecord: {},
      },
    });
  }

  render() {
    const { cashTran } = this.props;
    const { detailSpin, detailVisible, details } = cashTran;
    const hisColumns = [
      { title: '患者',
        dataIndex: 'prestoreTime',
        key: 'prestoreTime',
        width: 100,
        render: (value, record) => {
          return (
            <div>
              {record.patientNo || '-'} <br />
              {moment(value).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          );
        },
      },
      { title: '预存记录',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          render: (value, record) => {
            return (
              <div>
                {prestore.ly[record.source] || '-'} | {prestore.ycfs[record.prestoreType] || '-'} <br />
                {record.id || '-'} | {prestore.ztbz[record.status] || '-'} | {record.operId || '-'} 
              </div>
            );
          },
        },
      { title: '金额', dataIndex: 'amt', key: 'amt', width: 100, className: 'text-align-right', render: value => value.formatMoney() },
    ];

    const orderColumns = [
      { title: '患者',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
        render: (value, record) => {
          return (
            <div>
              {record.patientNo || '-'} | {record.patientName || '-'} <br />
              {value}
            </div>
          );
        },
      },
      { title: '订单',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          render: (value, record) => {
            return (
              <div>
                {record.machineCode || '-'} | {record.machineUser || '-'} <br />
                {record.orderNo || '-'} | {order.status[record.status] || '-'} 
              </div>
            );
          },
      },
      { title: '金额', dataIndex: 'realAmt', key: 'realAmt', width: 100, className: 'text-align-right', render: value => value.formatMoney() },
    ];

    const settleColumns = [
      { title: '患者',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
        render: (value, record) => {
        	 return (
	            <div>
	              {value}
	            </div>
	          );
        },
      },
      { title: '结算单',
          dataIndex: 'settleNo',
          key: 'settleNo',
          width: 150,
          render: (value, record) => {
            return (
              <div>
	              {record.machineCode || '-'} | {record.machineUser || '-'} | {record.payChannelName || '-'} | {record.payChannelCode || '-'} <br />
	              {record.settleNo || '-'} | {settlement.status[record.status] || '-'} 
              </div>
            );
          },
      },
      { title: '交易报文', dataIndex: 'respText', key: 'respText', width: 300,  render: value => value },
      { title: '金额', dataIndex: 'amt', key: 'amt', width: 50, className: 'text-align-right', render: value => value.formatMoney() },
    ];

    return (
      <Modal
        width={1000}
        title="交易明细"
        visible={detailVisible}
        closable
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
        style={{ top: '25px' }}
      >
        <Spin spinning={detailSpin} >
          <div >
            <FieldSet title="HIS 预存明细" style={{ marginBottom: '10px' }} >
              <CommonTable
                data={details.hisDetail}
                columns={hisColumns}
                bordered
                size="middle"
                className="compact-table"
                pagination={false}
                rowSelection={false}
              />
            </FieldSet>
            <FieldSet title="订单" style={{ marginBottom: '10px' }} >
              <CommonTable
                data={details.order}
                columns={orderColumns}
                bordered
                size="middle"
                className="compact-table"
                pagination={false}
                rowSelection={false}
              />
            </FieldSet>
            <FieldSet title="结算单" style={{ marginBottom: '10px' }} >
              <CommonTable
                data={details.settlements}
                columns={settleColumns}
                bordered
                size="middle"
                className="compact-table"
                pagination={false}
                rowSelection={false}
              />
            </FieldSet>
            <Row>
				<Col span={11}> </Col>
				<Col span={1}><Button onClick={this.handleCallBack}>现金补录</Button></Col>
				<Col span={11}> </Col>
			</Row>
          </div>
        </Spin>
      </Modal>
    );
  }
}
export default connect(({ cashTran }) => ({ cashTran }),)(TranDetail);
