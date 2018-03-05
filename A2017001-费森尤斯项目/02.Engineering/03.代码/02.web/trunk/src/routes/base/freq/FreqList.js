
import React, { Component, PropTypes } from 'react';
import { Icon, Badge } from 'antd';
import _ from 'lodash';

import CommonTable from '../../../components/CommonTable';
import RowDelBtn from '../../../components/TableRowDeleteButton';

import styles from './Freq.less';

class FreqList extends Component {

  static propTypes = {

    /**
     * 翻页对象
     * @type {[type]}
     */
    page: PropTypes.object.isRequired,

    /**
     * 列表数据
     * @type {[type]}
     */
    data: PropTypes.array.isRequired,

  };

  static defaultProps = {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    data: [],
  };

  constructor(props) {
    super(props);
    this.onEdit = ::this.onEdit;
    this.onDelete = ::this.onDelete;
    this.onPageChange = ::this.onPageChange;
    this.rowSelectChange = ::this.rowSelectChange;
  }

  componentWillMount() {
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'company/setState',
      payload: { record, visible: true },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'company/delete',
      id: record.id,
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'company/load',
      payload: {
        page,
        query: this.props.company.query,
      },
    });
  }

  rowSelectChange(selectedRowKeys) {
    /* this.props.dispatch({
      type: 'company/setState',
      payload: { selectedRowKeys },
    });*/
  }

  render() {
    const { wsHeight } = this.getWsSize();
    const { page, data } = this.props;

    const columns = [
      {
        title: '频次编号',
        dataIndex: 'freqId',
        key: 'freqId',
        width: 110,
        render: value => _.trim(value),
      }, {
        title: '频次描述',
        dataIndex: 'freqName',
        key: 'freqName',
        width: 100,
      }, {
        title: 'intervalNum',
        dataIndex: 'intervalNum',
        key: 'intervalNum',
        width: 100,
      }, {
        title: 'intervalUnit',
        dataIndex: 'intervalUnit',
        key: 'intervalUnit',
        width: 100,
      }, {
        title: 'freqQty',
        dataIndex: 'freqQty',
        key: 'freqQty',
        width: 100,
      }, {
        title: 'freqTime',
        dataIndex: 'freqTime',
        key: 'freqTime',
        width: 100,
      }, {
        title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: 60,
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value === '1' ? 'success' : 'error'} />{value === '1' ? '正常' : '停用'}</span>
        ),
      }, {
        title: '操作',
        key: 'action',
        width: 60,
        className: 'text-align-center text-no-wrap',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
          </span>
        ),
      },
    ];
    return (
      <CommonTable
        data={data}
        page={page}
        columns={columns}
        onPageChange={this.onPageChange}
        onSelectChange={this.rowSelectChange}
        bordered
        scroll={{ y: (wsHeight - 43 - 33 - 48) }}
      />
    );
  }
}

export default FreqList;
