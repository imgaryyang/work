import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Button, notification, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import ShadowDiv from '../../../components/ShadowDiv';

import styles from './ChargePkg.less';

class ChargePkgItemList extends Component {

  constructor(props) {
    super(props);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.makeGroup = this.makeGroup.bind(this);
    this.delFromGroup = this.delFromGroup.bind(this);
    this.createItem = this.createItem.bind(this);
    this.sort = this.sort.bind(this);
  }

  componentWillReceiveProps(props) {
    // 当前组套发生改变
    if (this.props.chargePkg.groupRecord.id !== props.chargePkg.groupRecord.id) {
      // 载入组套明细
      this.props.dispatch({
        type: 'chargePkg/loadItems',
        comboId: props.chargePkg.groupRecord.id,
      });
      // 清空被选明细
      this.props.dispatch({
        type: 'chargePkg/setState',
        payload: {
          itemRecord: {},
          listIdx: -1,
        },
      });
    }
  }

  onSelectChange(rowKeys) {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        selectedItemRowKeys: rowKeys,
      },
    });
  }

  onEdit(record, idx) {
    console.log(record, idx);
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        itemRecord: record,
        listIdx: idx,
      },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'chargePkg/deleteItem',
      id: record.id,
    });
  }

  makeGroup() {
    const { selectedItemRowKeys } = this.props.chargePkg;
    if (selectedItemRowKeys.length < 2) {
      notification.warning({
        message: '警告',
        description: '请选择至少两条需要组合的明细！',
      });
    } else {
      this.props.dispatch({
        type: 'chargePkg/makeGroup',
      });
    }
  }

  delFromGroup() {
    const { selectedItemRowKeys } = this.props.chargePkg;
    if (selectedItemRowKeys.length === 0) {
      notification.warning({
        message: '警告',
        description: '请选择要移除的明细！',
      });
    } else {
      this.props.dispatch({
        type: 'chargePkg/deleteFromGroup',
      });
    }
  }

  createItem() {
    this.props.dispatch({
      type: 'chargePkg/setState',
      payload: {
        itemRecord: {},
        listIdx: -1,
      },
    });
  }

  sort(record, idx, direction) {
    const { items } = this.props.chargePkg;
    if (items.length < 2) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === items.length - 1) return;
    this.props.dispatch({
      type: 'chargePkg/sortItems',
      payload: {
        record,
        idx,
        direction,
      },
    });
  }

  render() {

    const { chargePkg, base, utils } = this.props;
    const { items, groupRecord, listIdx, selectedItemRowKeys } = chargePkg;
    const { wsHeight } = base;
    // drugFlag === ‘3’ 时选择的是收费项，否则选择的是药品
    const bottomCardHeight = groupRecord.drugFlag !== '3' ?
      (wsHeight - 146 - 10 - 6) :
      (wsHeight - 104 - 10 - 6);
    console.info(chargePkg);
    const columns = [
      { title: '组合号', dataIndex: 'comboNo', key: 'comboNo', width: 60, className: 'text-no-wrap text-align-center' },
      { title: '序号', dataIndex: 'comboSort', key: 'comboSort', width: 45, className: 'text-no-wrap text-align-center' },
      /* { title: '项目名称', dataIndex: 'itemName', key: 'itemName', width: 150 },*/
      { title: '项目',
        dataIndex: 'itemName',
        key: 'itemName',
        render: (text, record) => {
          const defaultNum = `${record.defaultNum ? parseFloat(record.defaultNum) : '- '}${record.unit}`;
          const days = ` | ${record.days ? record.days : '-'}天`;
          const usage = record.usage ? `${utils.dicts.dis('USAGE', record.usage)} ` : '';
          const dosage = record.dosage || record.dosageUnit ? ` 每次 ${record.dosage ? parseFloat(record.dosage) : '-'}${record.dosageUnit || ''}` : '';
          const freq = record.freqDesc ? ` | ${record.freqDesc} ` : '';
          return {
            children: (
              <div>
                {`${text} (${defaultNum}${record.drugFlag !== '3' ? days : ''})`}
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
      { title: '数量',
        dataIndex: 'defaultNum',
        key: 'defaultNum',
        width: 70,
        render: (text, record) => {
          const defaultNum = text ? `${text} ` : '- ';
          return `${defaultNum}${record.unit}`;
        },
        className: 'text-align-center text-no-wrap',
      },
      /* { title: '用法',
        dataIndex: 'usage',
        key: 'usage',
        render: (text, record) => {
          const usage = text ? `${utils.dicts.dis('USAGE', text)} ` : '';
          const freq = record.freq ? ` ${record.freq} ` : '';
          const dosage = record.dosage || record.dosageUnit ? ` 每次 ${record.dosage || '-'} ${record.dosageUnit || ''}` : '';
          return `${usage}${dosage}${freq}`;
        },
        width: 120,
      },
      { title: '付数', dataIndex: 'days', key: 'days', width: 45, className: 'text-no-wrap text-align-center' },*/
      { title: '执行科室',
        dataIndex: 'defaultDept',
        key: 'defaultDept',
        render: (value) => { return utils.depts.disDeptName(utils.deptsIdx, value); },
        width: 80,
      },
      { title: '停用',
        dataIndex: 'stop',
        key: 'stop',
        render: value => (
          <span><Badge status={value === '1' ? 'success' : 'error'} />{value === '1' ? '是' : '否'}</span>
        ),
        width: 50,
        className: 'text-align-center text-no-wrap',
      },
      { title: '操作',
        dataIndex: 'id',
        key: 'operation',
        render: (value, record, idx) => {
          return (
            <span>
              <Tooltip placement="left" title="修改" >
                <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record, idx)} />
              </Tooltip>
              <span className="ant-divider" />
              <Tooltip placement="right" title="删除" >
                <RowDelBtn onOk={() => this.onDelete(record, idx)} />
              </Tooltip>
            </span>
          );
        },
        width: 70,
        className: 'text-align-center text-no-wrap',
      },
      { title: '排序',
        dataIndex: 'id',
        key: 'sort',
        render: (value, record, idx) => {
          return (
            <span>
              <Tooltip placement="left" title="上移" >
                <Icon type="up-circle-o" onClick={() => this.sort(record, idx, 'up')} />
              </Tooltip>
              <span className="ant-divider" />
              <Tooltip placement="right" title="下移" >
                <Icon type="down-circle-o" onClick={() => this.sort(record, idx, 'down')} />
              </Tooltip>
            </span>
          );
        },
        width: 70,
        className: 'text-align-center text-no-wrap',
      },
    ];

    return (
      <div>
        <ShadowDiv showTopShadow={false} style={{ height: `${bottomCardHeight - 5 - 50}px` }} >
          <CommonTable
            data={items}
            columns={columns}
            pagination={false}
            bordered
            scroll={{
              x: 400,
              y: (bottomCardHeight - 10 - 33 - 52),
            }}
            rowClassName={
              (record, idx) => { return idx === listIdx ? 'selectedRow' : ''; }
            }
            onSelectChange={this.onSelectChange}
            selectedRowKeys={selectedItemRowKeys}
          />
        </ShadowDiv>
        <div className={styles.btnContainer} >
          {/* <Button onClick={this.createItem} style={{ marginRight: '10px' }}
            icon="plus" size="large" >新增明细</Button>*/}
          <Button onClick={this.makeGroup} style={{ marginRight: '10px' }} icon="switcher" size="large" >成组</Button>
          <Button onClick={this.delFromGroup} icon="menu-unfold" size="large" >从组合删除</Button>
          {/* <Button onClick={this.sort} icon="retweet" size="large" >更新排序</Button>*/}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ base, utils, chargePkg }) => ({ base, utils, chargePkg }),
)(ChargePkgItemList);
