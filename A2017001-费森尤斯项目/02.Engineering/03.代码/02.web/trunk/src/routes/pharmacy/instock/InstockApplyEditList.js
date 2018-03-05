import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Popconfirm, Tooltip, Card, notification, Select } from 'antd';
import moment from 'moment';

import ShadowDiv from '../../../components/ShadowDiv';

import EditTable from '../../../components/editTable/EditTable';

import styles from './InstockApplyEdit.less';
import { testNumber, testlnt } from '../../../utils/validation.js';

class InstockApplyEditList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.refreshTable = this.refreshTable.bind(this);
    this.onSelectApplyEvent = this.onSelectApplyEvent.bind(this);
  }

  componentWillMount() {
    // alert(1);
    this.props.dispatch({
      type: 'instockApplyEdit/loadApplyListData',

      payload: {
        query: { appState: '1,7' },
      },
    });

    /* this.props.dispatch({
      type: 'instockApplyEdit/loadApply',
    });*/
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'instockApplyEdit/setState',

      payload: {
        dataApply: [],
        currentAppBill: '',
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'instock/loadSearchBar',
      payload: {
        query: values,
      },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'instockApplyEdit/deleteApply',
      record,
    });
  }

  onNew(dataApply) {
    this.props.dispatch({
      type: 'instock/newApply',
      dataApply,
    });
  }

  onSave() {
    // 校验todo
    const { dataApply } = this.props.instockApplyEdit;
    if (dataApply && dataApply.length > 0) {
      const index = dataApply.findIndex(value => value.appNum == 0 || testNumber(value.appNum) == false);
      if (index != -1) {
        notification.error({
          message: '提示',
          description: '申请数量请输入非0的数字！！',
        });
        return;
      }
    } else {
      notification.error({
        message: '提示',
        description: '请输入数据后，再操作保存',
      });
      return;
    }


    this.props.dispatch({
      type: 'instock/saveApply',
      appState: '0',
    });
  }

  onCommit() {
    // 校验todo
    const { dataApply } = this.props.instockApplyEdit;
    if (dataApply && dataApply.length > 0) {
      const index = dataApply.findIndex(value => value.appNum == 0 || testNumber(value.appNum) == false);
      if (index != -1) {
        notification.error({
          message: '提示',
          description: '申请数量请输入非0的数字！',
        });
        return;
      }
    } else {
      notification.error({
        message: '提示',
        description: '请输入数据后，再操作保存',
      });
      return;
    }
    this.props.dispatch({
      type: 'instockApplyEdit/saveApply',
      appState: '1',
    });
  }

  refreshTable(value, index, key) {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    const reg = '';
    if (key === 'appNum') {
      if (!testNumber(value) || value == 0) {
        notification.error({
          message: '提示',
          description: '申请数量请输入非0数字！',
        });
      }
    }
    this.props.dispatch({
      type: 'instockApplyEdit/setState',
      payload: {
        dataApply: newData,
      },
    });
  }

  onSelectApplyEvent(value, option) {
    // 查询请领明细
    this.props.dispatch({
      type: 'instockApplyEdit/loadApply',

      payload: {
        query: { appBill: value },
      },

    });

    // 设置当前请领单号
    this.props.dispatch({
      type: 'instockApplyEdit/setState',
      payload: {
        currentAppBill: value,
      },
    });
  }

  render() {
    const { instockApplyEdit, base } = this.props;
    const { dataApply } = (instockApplyEdit || {});
    const userName = base.user.name;
    const deptName = base.user.loginDepartment.deptName;
    const columns = [
      { title: '药品名称',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.specs || '-'})`}<br />
              {`厂商：${record.producerName || '-'}`}<br />
            </div>
          );
        },
      },
      /* { title: '规格', dataIndex: 'specs', key: 'specs' },
      { title: '生产厂家', dataIndex: 'producerName', key: 'producerName' },*/
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 100,
        className: 'text-align-right text-no-wrap',
        render: text => text.formatMoney(4),
      },
      { title: '最小单位', dataIndex: 'minUnit', key: 'minUnit', width: 70, className: 'text-no-wrap' },
      /* { title: '批次', dataIndex: 'batchNo', key: 'batchNo', width: 70, className: 'text-no-wrap' },*/
      { title: '批号/批次',
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        width: 90,
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.batchNo}
            </div>
          );
        },
      },
      /* { title: '申请单位', dataIndex: 'appUnit', key: 'appUnit' },*/
      { title: '申请数量',
        dataIndex: 'appNum',
        key: 'appNum',
        editable: true,
//        editorConfig:{verfy:(v)=>{return !testlnt(v);}},
        width: 80,
        className: 'text-align-center',
        addonAfter: (text, record) => {
          return record.appUnit;
        },
      },
      { title: '申请金额',
        dataIndex: 'buyCost',
        key: 'buyCost',
        width: 100,
        className: 'text-align-right text-no-wrap',
        render: text => text.formatMoney(),
      },
      { title: '操作',
        key: 'action',
        width: 50,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Popconfirm
              placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText="是"
              onConfirm={this.onDelete.bind(this, record)}
            >
              <Tooltip placement="top" title={'删除'}>
                <Icon type="delete" style={{ cursor: 'pointer', color: 'red' }} />
              </Tooltip>
            </Popconfirm>
          </span>
        ),
      },
    ];

    let total = 0;
    for (const i of dataApply) {
      i.buyCost = i.appNum * i.salePrice;
      total += i.buyCost;
    }

    const { wsHeight } = base;
    const bottomHeight = wsHeight - 39 - 6 - 5;
    const { applyListData } = this.props.instockApplyEdit;
    const Option = Select.Option;
    const applyListHtml = applyListData.map((applyData, index) =>
      <Option key={index} value={applyData[0]}>
        {applyData[0]} {}
      </Option>,
    );

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row>

            <Col span={8}>搜索请领计划&nbsp;&nbsp;:&nbsp;&nbsp;
              <Select
                showSearch style={{ width: 160 }}
                onSelect={(value, option) => this.onSelectApplyEvent(value, option)}
                optionFilterProp="children"
                /* filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/
                placeholder="请选择"
              >
                {applyListHtml}
              </Select>
            </Col>

            <Col span={6} ><div style={{ paddingTop: 4 }}>申领科室&nbsp;&nbsp;:&nbsp;&nbsp;{deptName}</div></Col>
            <Col span={6} ><div style={{ paddingTop: 4 }}>操作员&nbsp;&nbsp;:&nbsp;&nbsp;{userName}</div></Col>
            <Col span={4} ><div style={{ paddingTop: 4 }}>请领总金额&nbsp;&nbsp;:&nbsp;&nbsp;{total.formatMoney()}</div></Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <ShadowDiv showTopShadow={false} style={{ height: `${bottomHeight - 52}px` }} >
            <EditTable
              ref="commonTable"
              data={dataApply}
              onChange={this.refreshTable.bind(this)}
              pagination={false}
              columns={columns}
              bordered
              rowSelection={false}
              scroll={{ y: (bottomHeight - 52 - 33 - 3) }}
            />
          </ShadowDiv>
          <div style={{ textAlign: 'right', paddingTop: '5px' }} >
            {/**
             <Button size="large" onClick={() => this.onNew(dataApply)} style={{ marginRight: '10px' }} icon="plus" >新建</Button>
             <Button size="large" onClick={() => this.onSave()} style={{ marginRight: '10px' }} icon="cloud-upload-o" >暂存</Button>
             */}
            <Button type="primary" size="large" onClick={() => this.onCommit()} icon="save" >提交</Button>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ instockApplyEdit, base }) => ({ instockApplyEdit, base }),
)(InstockApplyEditList);
