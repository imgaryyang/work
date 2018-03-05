import React, { Component } from 'react';
import { Row, Modal, Button, Spin } from 'antd';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class WithDrwalModal extends Component {

  onRefund() {
    Modal.confirm({
      content: '退药操作不可撤销，确定退药？',
      okText: '确定',
      cancelText: '我再看看',
      onOk: () => {
        this.props.dispatch({
          type: 'visitRecord/save',
        });
      },
    });
  }

  close() {
    this.props.dispatch({
      type: 'visitRecord/setState',
      payload: { visible: false },
    });
  }

  render() {
    const { temOrder, visible, spin } = this.props.visitRecord;
    const columns = [
      { title: '名称', dataIndex: 'itemName', key: 'itemName', width: 100 },
      { title: '原数量',
        width: 100,
        render: (text, record) => {
          return `${record.packQty}${record.packUnit}`;
        },
      },
      { title: '要退数量',
        dataIndex: 'backqty',
        key: 'backqty',
        width: 100,
        render: (text, record) => {
          return `${record.backqty}${record.packUnit}`;
        },
      },
      // { title: '取消人员', dataIndex: 'cancelOper', key: 'cancelOper', width: 100 },
      // { title: '取消时间', dataIndex: 'cancelTime', key: 'cancelTime', width: 100 },
    ];

    // hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
    return (
      <Modal
        width={540}
        title="门诊退药"
        visible={visible}
        closable
        maskClosable={false}
        footer={null}
        onCancel={this.close.bind(this)}
      >
        <Spin spinning={spin}>
          <Row style={{ marginBottom: 8 }}>
            <CommonTable
              rowSelection={false}
              data={temOrder}
              columns={columns}
              pagination={false}
              bordered
            />
          </Row>
          <Row className="text-align-right">
            <Button type="primary" onClick={this.onRefund.bind(this)} style={{ marginRight: '10px' }} icon="pay-circle-o" size="large" >退药</Button>
            <Button onClick={this.close.bind(this)} icon="reload" size="large" >取消</Button>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ visitRecord, utils, base }) =>
  ({ visitRecord, utils, base }))(WithDrwalModal);
