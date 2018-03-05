import React, { Component } from 'react';
import { connect } from 'dva';
import { sumBy, multiply } from 'lodash';
import { Button, Icon, Row, Col, Popconfirm, Tooltip, Card, notification, Select } from 'antd';
import ShadowDiv from '../../../components/ShadowDiv';
import EditTable from '../../../components/editTable/EditTable';
import styles from './InstockPlanEdit.less';
import { testNumber } from '../../../utils/validation.js';

const Option = Select.Option;

class InstockPlanEditList extends Component {

  constructor(props) {
    super(props);
    this.onDelete = ::this.onDelete;
    this.onCommit = ::this.onCommit;
    this.refreshTable = ::this.refreshTable;
    this.onSelectPlanEvent = ::this.onSelectPlanEvent;
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'instockPlanEdit/loadPlanListData',
      payload: {
        query: { appState: '1,7' },
      },
    });
    this.props.dispatch({
      type: 'instockPlanEdit/setState',
      payload: {
        planData: [],
        currentAppBill: '',
      },
    });
  }

  onDelete(record, index) {
    this.props.dispatch({
      type: 'instockPlanEdit/deletePlan',
      record,
      index,
    });
  }

  onCommit() {
    // 校验todo
    const { planData } = this.props.instockPlanEdit;
    
    if (planData && planData.length > 0) {
      const index = planData.findIndex(value => value.appNum === 0 || testNumber(value.appNum) === false);
      if (index !== -1) {
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
      type: 'instockPlanEdit/savePlan',
      appState: '1',
    });
  }

  onSelectPlanEvent(value) {
    // 查询请领明细
    this.props.dispatch({
      type: 'instockPlanEdit/loadPlan',
      payload: { query: { appBill: value } },
    });

    // 设置当前请领单号
    this.props.dispatch({
      type: 'instockPlanEdit/setState',
      payload: { currentAppBill: value },
    });
  }

  refreshTable(value, index, key) {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    console.info(newData)
    if (key === 'appNum') {
      if (!testNumber(value) || value === 0) {
        notification.error({
          message: '提示',
          description: '申请数量请输入非0数字！',
        });
      }
    }
    this.props.dispatch({
      type: 'instockPlanEdit/setState',
      payload: {
        planData: newData,
      },
    });
  }

  render() {
    const { instockPlanEdit: { planData }, base } = this.props;
    const { wsHeight, user: { name: userName, loginDepartment: { deptName } } } = base;

    const totalAmt = sumBy(planData, v => multiply(v.appNum, v.salePrice));

    const bottomHeight = wsHeight - 39 - 6 - 5;

    const { planListData } = this.props.instockPlanEdit;
    const applyListHtml = planListData.map((data, index) =>
      <Option key={index} value={data[0]}>
        {data[0]} {}
      </Option>,
    );

    const columns = [
      { title: '药品名称',
        dataIndex: 'tradeName',
        key: 'tradeName',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              {`${text}(${record.materialSpecs || '-'})`}<br />
              {`厂商：${record.producerName || '-'}`}<br />
            </div>
          );
        },
      },
      { title: '生产厂家', dataIndex: 'producerName', key: 'producerName' },
      { title: '零售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 100,
        className: 'text-align-right text-no-wrap',
        render: text => text.formatMoney(4),
      },
      { title: '最小单位', dataIndex: 'minUnit', key: 'minUnit', width: 70, className: 'text-no-wrap' },
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
      {
        title: '申请数量',
        dataIndex: 'appNum',
        key: 'appNum',
        editable: true,
        width: 80,
        className: 'text-align-center',
        addonAfter: (text, record) => {
          return record.appUnit;
        },
      },
      {
        title: '申请金额',
        dataIndex: 'saleCost',
        key: 'saleCost',
        width: 100,
        className: 'text-align-right text-no-wrap',
        render: (text, record) => {
          return multiply(record.appNum, record.salePrice).formatMoney();
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 50,
        className: 'text-align-center',
        render: (text, record, index) => (
          <span>
            <Popconfirm
              placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText="是"
              onConfirm={this.onDelete.bind(this, record, index)}
            >
              <Tooltip placement="top" title={'删除'}>
                <Icon type="delete" style={{ cursor: 'pointer', color: 'red' }} />
              </Tooltip>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div style={{ padding: '3px' }} >
        <Card className={styles.infoCard} >
          <Row>
            <Col span={8}>搜索请领计划：
            <Select
              showSearch style={{ width: 160 }}
              onSelect={(value, option) => this.onSelectPlanEvent(value, option)}
              optionFilterProp="children"
              placeholder="请选择"
            >
              {applyListHtml}
            </Select>
            </Col>

            <Col span={6} ><div style={{ paddingTop: 4 }}>申领科室：{deptName}</div></Col>
            <Col span={6} ><div style={{ paddingTop: 4 }}>操作员：{userName}</div></Col>
            <Col span={4} ><div style={{ paddingTop: 4 }}>请领总金额：{totalAmt.formatMoney()}</div></Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <ShadowDiv showTopShadow={false} style={{ height: `${bottomHeight - 52}px` }} >
            <EditTable
              ref="commonTable"
              data={planData}
              onChange={this.refreshTable}
              pagination={false}
              columns={columns}
              bordered
              rowSelection={false}
              scroll={{ y: (bottomHeight - 52 - 33 - 3) }}
            />
          </ShadowDiv>
          <div style={{ textAlign: 'right', paddingTop: '5px' }} >
            <Button type="primary" size="large" onClick={this.onCommit} icon="save" >提交</Button>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(
  ({ instockPlanEdit, base }) => ({ instockPlanEdit, base }),
)(InstockPlanEditList);
