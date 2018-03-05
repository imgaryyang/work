import React, { Component } from 'react';
import { Icon, Button, Menu, Dropdown, Modal, Badge } from 'antd';
import moment from 'moment';
import CommonTable from '../../../components/CommonTable';

const confirm = Modal.confirm;

class RegVisitList extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'regVisit/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'regVisit/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, dicts, depts, deptsIdx } = this.props;

    const handleMenuClick = (record, e) => {
      const self = this;
      if (e.key === '1') {
        self.props.dispatch({
          type: 'regVisit/setState',
          payload: { record },
        });
      } else if (e.key === '2') {
        confirm({
          title: '您确定要删除这条记录吗?',
          onOk() {
            self.props.dispatch({
              type: 'regVisit/delete',
              id: record.id,
            });
          },
        });
      }
    };

    const columns = [
      {
        title: '出诊科室',
        dataIndex: 'deptId',
        key: 'deptId',
        render: (value) => {
          return depts.disDeptNameByDeptId(deptsIdx, value);
        },
      }, {
        title: '挂号级别',
        dataIndex: 'levelName',
        key: 'levelName',
        render: (value) => {
          return dicts.dis('REG_LEVEL', value);
        },
      },
      { title: '出诊医生', dataIndex: 'docName', key: 'docName' },
      {
        title: '午别',
        dataIndex: 'noon',
        key: 'noon',
        render: (value) => {
          return dicts.dis('NOON_TYPE', value);
        },
      }, {
        title: '上班时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (value) => {
          return moment(value).format('HH:mm');
        },
      }, {
        title: '下班时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (value) => {
          return moment(value).format('HH:mm');
        },
      },
      { title: '现场限额', dataIndex: 'regLmt', key: 'reglmt' },
      { title: '预约限额', dataIndex: 'orderLmt', key: 'orderLmt' },
      { title: '现场已挂', dataIndex: 'reged', key: 'reged' },
      { title: '预约已挂', dataIndex: 'ordered', key: 'ordered' },
      {
        title: '允许加号',
        dataIndex: 'allowAdd',
        key: 'allowAdd',
        className: 'column-left',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '允许' : '不允许'}</span>
        ),
      },
      { title: '停诊原因', dataIndex: 'stopReson', key: 'stopReson' },
      { title: '诊区名称', dataIndex: 'areaName', key: 'areaName' },
      {
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
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

    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          onSelectChange={this.rowSelectChange.bind(this)}
        />
      </div>
    );
  }
}
export default RegVisitList;
