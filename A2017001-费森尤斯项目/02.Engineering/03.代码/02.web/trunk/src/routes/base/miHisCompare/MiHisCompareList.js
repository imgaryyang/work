import React, { Component } from 'react';
import { Icon, Popconfirm, Badge } from 'antd';
import CommonTable from '../../../components/CommonTable';

class MiHisCompareList extends Component {

  onEdit(record) {
    /* this.props.dispatch({ type: 'miHisCompare/toggleVisible' });
    this.props.dispatch({
      type: 'utils/setState',
      payload: { record },
    });*/
  }

  onDelete(record) {
    /* this.props.dispatch({
      type: 'miHisCompare/delete',
      id: record.id,
    });*/
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'miHisCompare/load',
      payload: { values },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'miHisCompare/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'miHisCompare/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data, wsHeight } = this.props;
    const columns = [
      {
        title: '院内信息',
        children: [{
          title: '项目院内编码',
          width: '100px',
          dataIndex: 'itemCode',
          key: 'itemCode',
        }, {
          title: '项目名称',
          width: '100px',
          dataIndex: 'itemName',
          key: 'itemName',
        }, {
          title: '药品类别',
          dataIndex: 'drugType',
          width: '100px',
          key: 'drugType',
        }],
      }, {
        title: '医保信息',
        children: [{
          title: '医保编码',
          dataIndex: 'miCode',
          width: '100px',
          key: 'miCode',
        }, {
          title: '名称',
          dataIndex: 'miName',
          width: '100px',
          key: 'miName',
        }, {
          title: '分类',
          dataIndex: 'miClass',
          width: '100px',
          key: 'miClass',
        }, {
          title: '等级',
          dataIndex: 'miGrade',
          width: '100px',
          key: 'miGrade',
        }],
      }, {
        title: '有效标志',
        dataIndex: 'stopFlag',
        width: '10%',
        key: 'stopFlag',
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '启用' : '停用'}</span>
        ),
      }, {
        title: '操作',
        width: '10%',
        key: 'action',
        className: 'text-align-center text-no-wrap',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <Popconfirm placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText={'是'} onConfirm={this.onDelete.bind(this, record)}>
              <Icon type="delete" className="tableDeleteIcon" />
            </Popconfirm>
          </span>
        ),
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
          rowSelection={false}
          bordered
          scroll={{ y: (wsHeight - 47 - 33 - 62 - 2) }}
        />
      </div>
    );
  }
}
export default MiHisCompareList;
