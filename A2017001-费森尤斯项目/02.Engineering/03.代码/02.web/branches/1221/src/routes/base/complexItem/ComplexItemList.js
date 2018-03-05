import React, { Component } from 'react';
import { connect } from 'dva';
import { sumBy, multiply } from 'lodash';
import {
  Button, Icon, Row, Col, Popconfirm, Tooltip,
  Card, notification, Select, Spin,
} from 'antd';
import ShadowDiv from '../../../components/ShadowDiv';
import EditTable from '../../../components/editTable/EditTable';
import styles from './ComplexItem.less';
import { testNumber } from '../../../utils/validation.js';

const Option = Select.Option;

class ComplexItemList extends Component {

  constructor(props) {
    super(props);
    this.onDelete = ::this.onDelete;
    this.onCommit = ::this.onCommit;
    this.refreshTable = ::this.refreshTable;
    this.onSelectItemEvent = ::this.onSelectItemEvent;
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'complexItem/loadComplexItemData',
      payload: {
        query: { itemName: '' },
      },
    });
    this.props.dispatch({
      type: 'complexItem/setState',
      payload: {
        itemData: [],
        selectedItemGroup: '',
      },
    });
  }

  onDelete(index) {
    this.props.dispatch({
      type: 'complexItem/deleteRow',
      index,
    });
  }

  onCommit() {
    const { itemData } = this.props.complexItem;
    if (itemData && itemData.length > 0) {
      const index = itemData.findIndex(value => value.defaultNum === 0 || testNumber(value.defaultNum) === false);
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
      type: 'complexItem/saveItem',
    });
  }

  onSelectItemEvent(value) {
    this.props.dispatch({
      type: 'complexItem/loadItemDetail',
      payload: { query: { id: value } },
    });
  }

  refreshTable(value, index, key) {
    const table = this.refs.commonTable;
    const newData = table.getUpdatedData();
    if (key === 'defaultNum') {
      if (!testNumber(value) || value === 0) {
        notification.error({
          message: '提示',
          description: '申请数量请输入非0数字！',
        });
      }
    }
    this.props.dispatch({
      type: 'complexItem/setState',
      payload: {
        itemData: newData,
      },
    });
  }

  render() {
    const {
      complexItem: { itemData, complexItemData, isRightSpin },
      base,
      utils,
    } = this.props;
    const {
      user: { name: userName, loginDepartment: { deptName } },
      wsHeight,
    } = base;
    const { depts, deptsIdx } = utils;

    const totalAmt = sumBy(itemData, v => multiply(v.defaultNum, v.unitPrice));

    const bottomHeight = wsHeight - 50;

    const complexItemDom = complexItemData.map((data, index) =>
      <Option key={index} value={data.id}>
        {data.itemName}
      </Option>,
    );

    const columns = [
      { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 200 },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: 50 },
      {
        title: '价格',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 100,
        className: 'text-align-right text-no-wrap',
        render: (text = 0, record) => {
          return `${text.formatMoney()}/${record.unit}`;
        },
      },
      {
        title: '默认科室',
        dataIndex: 'defaultDept',
        key: 'defaultDept',
        width: 80,
        render: (value) => {
          return depts.disDeptNameByDeptId(deptsIdx, value);
        },
      },
      {
        title: '申请数量',
        dataIndex: 'defaultNum',
        key: 'defaultNum',
        editable: true,
        width: 80,
        className: 'text-align-center',
        addonAfter: (text, record) => {
          return record.unit;
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
              onConfirm={this.onDelete.bind(this, index)}
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
            <Col span={8}>
              复合收费项目：
              <Select
                showSearch style={{ width: 160 }}
                onSelect={value => this.onSelectItemEvent(value)}
                optionFilterProp="children"
                placeholder="请选择"
                allowClear = 'true'
              >
                {complexItemDom}
              </Select>
            </Col>

            <Col span={6} ><div style={{ paddingTop: 4 }}>操作科室：{deptName}</div></Col>
            <Col span={6} ><div style={{ paddingTop: 4 }}>操作员：{userName}</div></Col>
            <Col span={4} >
              <div style={{ paddingTop: 4 }}>
                总金额：<strong style={{ color: '#F09700' }}>{totalAmt.formatMoney()}</strong>
              </div>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} style={{ height: `${bottomHeight}px` }} >
          <ShadowDiv showTopShadow={false} style={{ height: `${bottomHeight - 52}px` }} >
            <Spin spinning={isRightSpin}>
              <EditTable
                ref="commonTable"
                data={itemData}
                onChange={this.refreshTable}
                pagination={false}
                columns={columns}
                bordered
                rowSelection={false}
                scroll={{ y: (bottomHeight - 52 - 33 - 3) }}
              />
            </Spin>
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
  ({ complexItem, base, utils }) => ({ complexItem, base, utils }),
)(ComplexItemList);
