import React, { Component } from 'react';
import { Icon, Button, Menu, Dropdown, Modal, Badge } from 'antd';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

const confirm = Modal.confirm;

class RegVisitTempList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'regVisitTemp/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'regVisitTemp/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, controlParam } = this.props;
    const { dicts, depts, deptsIdx } = this.props.utils;
    const { wsHeight } = this.props.base;

    const handleMenuClick = (record, e) => {
      const self = this;
      if (e.key === '1') {
        self.props.dispatch({ type: 'regVisitTemp/toggleVisible' });
        self.props.dispatch({
          type: 'utils/setState',
          payload: { record },
        });
      } else if (e.key === '2') {
        confirm({
          title: '您确定要删除这条记录吗?',
          onOk() {
            self.props.dispatch({
              type: 'regVisitTemp/delete',
              id: record.id,
            });
          },
        });
      }
    };

    const leftColumns = [
      {
        title: '号源ID',
        dataIndex: 'numSourceId',
        key: 'numSourceId',
        width: '8%',
      }, {
        title: '挂号级别',
        dataIndex: 'regLevel',
        key: 'regLevel',
        width: '10%',
        render: (value) => {
          return dicts.dis('REG_LEVEL', value);
        },
      }, {
        title: '出诊科室',
        dataIndex: 'deptId',
        key: 'deptId',
        width: '15%',
        render: (value) => {
          return depts.disDeptNameByDeptId(deptsIdx, value);
        },
      },
    ];

    const hiddenColumns = [
      {
        title: '午别',
        dataIndex: 'noon',
        key: 'noon',
        width: 100,
        render: (value) => {
          return dicts.dis('NOON_TYPE', value);
        },
      }, {
        title: '上班时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 50,
        render: (value) => {
          return moment(value).format('HH:mm');
        },
      }, {
        title: '下班时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 50,
        render: (value) => {
          return moment(value).format('HH:mm');
        },
      },
    ];

    const rightColumns = [
      {
        title: '现场限额',
        dataIndex: 'regLmt',
        key: 'reglmt',
        width: '8%',
      }, {
        title: '预约限额',
        dataIndex: 'orderLmt',
        key: 'orderLmt',
        width: '8%',
      }, {
        title: '允许加号',
        dataIndex: 'allowAdd',
        key: 'allowAdd',
        className: 'column-left',
        width: '10%',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '允许' : '不允许'}</span>
        ),
      }, {
        title: '诊区名称',
        dataIndex: 'areaName',
        key: 'areaName',
        width: '15%',
      }, {
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: '10%',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: '10%',
        render: (text, record) => {
          return (
            <Dropdown
              overlay={
                <Menu onClick={e => handleMenuClick(record, e)}>
                  <Menu.Item key="1">编辑</Menu.Item>
                  <Menu.Item key="2">删除</Menu.Item>
                </Menu>}
            >
              <Button style={{ border: 'none' }}>
                <Icon style={{ marginRight: 2 }} type="bars" />
                <Icon type="down" />
              </Button>
            </Dropdown>
          );
        },
      },
    ];

    const middleColumns = controlParam === 0 ? hiddenColumns : [];

    const columns = [
      ...leftColumns,
      ...middleColumns,
      ...rightColumns,
    ];

    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default RegVisitTempList;
