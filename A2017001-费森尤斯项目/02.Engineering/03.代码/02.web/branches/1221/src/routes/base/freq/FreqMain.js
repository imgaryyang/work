import React, { Component } from 'react';
import { Spin, notification } from 'antd';

// import SearchBar from './SearchBar';
import List from './FreqList';
// import Editor from './FreqEditor';

import * as service from '../../../services/base/FreqService';

class FreqMain extends Component {

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.onSearch = ::this.onSearch;
  }

  state = {
    // 分页对象
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    // 查询条件
    query: {},
    // 列表数据
    data: [],
    // 被选中修改的信息
    record: {},
    // 被选中的行
    selectedRowKeys: [],
    // 列表加载指示器
    listSpin: false,
    // 编辑界面加载指示器
    editorSpin: false,
    // 控制修改界面显示/隐藏
    visible: false,
    // 控制重置表单
    resetForm: false,
  }

  componentWillMount() {
    this.onSearch();
  }

  /**
   * 执行查询
   */
  async onSearch(payload) {
    const { query, page, startFrom0 } = (payload || {});
    // 取现有的翻页对象
    const defaultPage = this.state.page;
    const newPage = { ...defaultPage, ...(page || {}) };
    // console.log(newPage);
    const { pageNo, pageSize } = newPage;
    const start = startFrom0 ? 0 : (pageNo - 1) * pageSize;
    // 显示加载指示器
    this.setState({ listSpin: true });
    // 调用载入数据
    const { data } = await service.loadPage(start, pageSize, query || {});

    if (data && data.success) {
      this.setState({
        data: data.result,
        query: query || {},
        page: { pageNo: startFrom0 ? 1 : pageNo, pageSize, total: data.total },
        listSpin: false,
      });
    } else {
      notification.error({
        message: '错误',
        description: `${data.msg || '查询频次列表信息出错！'}`,
      });
      // 隐藏加载指示器
      this.setState({ listSpin: false });
    }
  }

  /**
   * 新增
   */
  onAdd() {

  }

  /**
   * 删除所选
   */
  onDeleteSelected() {

  }

  render() {
    const { wsHeight } = this.getWsSize();
    return (
      <Spin spinning={this.state.listSpin}>
        <div style={{ height: `${wsHeight - 1}px`, overflow: 'hidden' }} >
          <List page={this.state.page} data={this.state.data} />
        </div>
      </Spin>
    );
  }
}

export default FreqMain;
