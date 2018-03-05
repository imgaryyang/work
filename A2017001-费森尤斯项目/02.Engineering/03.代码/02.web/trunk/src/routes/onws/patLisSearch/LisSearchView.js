import React, { Component } from 'react';
import { floor } from 'lodash';
import { connect } from 'dva';
import { Row, Col, Button, Modal, notification } from 'antd';
import CommonTable from '../../../components/CommonTable';

class LisSearchView extends Component {
  constructor(props) {
    super(props);
    this.printData = ::this.printData;
    this.handleReset = ::this.handleReset;
  }
  printData() {
    const p = this.props.print;
    console.info(p)
    this.props.dispatch({
        type: 'phaLisResult/print',
        payload: { result: p },
    });
  }

  handleReset() {
    this.props.dispatch({ type: 'phaLisResult/toggleVisible' });
  }

  render() {
    const { phaLisResult, utils, base, print, dispatch } = this.props;
    const { wsHeight } = this.props.base;
    const { visible } = this.props.phaLisResult;
    const { map, printTemplate, printData } = this.props.print;
    console.info(map)
    let title = '泉州费森安馨血液透析中心临床检验结果报告单';
    const columns = [
      {
        title: '序号',
        width: 60,
        render: (value, record, index) => {
          return index + 1;
        },
      },
      {
        title: '检查项目',
        width: 200,
        dataIndex: 't1',
        key: 't1',
      },
      {
        title: '测定结果',
        width: '100px',
        dataIndex: 't2',
        key: 't2',

      },
      {
        title: '单位',
        width: '100px',
        dataIndex: 't3',
        key: 't3',

      },
      {
        title: '参考范围',
        width: '90px',
        dataIndex: 't4',
        key: 't4',

      },
    ];
    return (
      <Modal
        style={{ top: 20 }}
        width={1080}
        title={title}
        visible={visible}
        onOk={this.printData}
        okText='打印'
        onCancel={this.handleReset}
      >
        <Row type="flex" justify="space-between" align="middle" marginLeft='100px'>
          <div style={{ marginLeft: '300px' }}>
            <font style={{ fontSize: '18px', fontWeight: 'bold' }} >
              {title}
            </font>
          </div> 
        </Row>
        <Row type="flex" justify="space-between" align="middle" >
          <Col span="4">
            <div >泉州费森安馨血液透析中心</div>
          </Col>
          <Col span="4">
            <div >检测编号：{typeof( printData.t5 ) === 'undefined' ? "" : printData.t5}</div>
          </Col>
          <Col span="5">
            <div >流水号：{typeof( printData.t4 ) === 'undefined' ? "" : printData.t4}</div>
          </Col>
        </Row>
        <hr />
        <Row type="flex" justify="space-between" align="middle" >
          <Col span="4">
            <div >姓名：{typeof( printData.t1 ) === 'undefined' ? "" : printData.t1}</div>
          </Col>
          <Col span="4">
            <div >性别：{typeof( printData.t2 ) === 'undefined' ? "" : printData.t2}</div>
          </Col>
          <Col span="5">
            <div >样本类别：{typeof( printData.t3 ) === 'undefined' ? "" : printData.t3}</div>
          </Col>
        </Row>
        <hr />
        <CommonTable
          data={map ? map['0'] : []}
          columns={columns}
          rowSelection={false}
          bordered
          pagination={false}
          size="middle"
        />
        <div style={{ position: 'absolute', left: '10px', bottom: '15px' }} >
          <font style={{ fontSize: '14px' }} >
            {`送检医师：送检医师1，检验日期：检验日期1，检验师：检验师1， `}
          </font> 
        </div>
      </Modal>
    );
  }
}
export default connect(
  ({ phaLisResult, utils, base, print }) => ({ phaLisResult, utils, base, print }),
)(LisSearchView);
