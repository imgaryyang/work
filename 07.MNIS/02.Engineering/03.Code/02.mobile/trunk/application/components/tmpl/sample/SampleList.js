
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';
import Portrait from 'rn-easy-portrait';

import Global from '../../../Global';
import SearchInput from '../../../modules/SearchInput';
import Item from '../../../modules/PureListItem';
import ctrlState from '../../../modules/ListState';
import BottomBar from '../../../modules/BottomBar';
import { page, removeSelected } from '../../../services/tmpl/SampleService';

const portraits = {
  p002: require('../../../assets/images/user/p0002.jpg'),
  u0001: require('../../../assets/images/user/u0001.jpg'),
  u0002: require('../../../assets/images/user/u0002.jpg'),
  u0003: require('../../../assets/images/user/u0003.jpg'),
  u0004: require('../../../assets/images/user/u0004.jpg'),
  u0005: require('../../../assets/images/user/u0005.jpg'),
  dft: require('../../../assets/images/me-portrait-dft.png'),
};

const initPage = { start: 0, limit: 20 };

class SampleList extends Component {
  static displayName = 'SampleList';
  static description = '列表样例';

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.toggleChooseBtn = this.toggleChooseBtn.bind(this);
    this.gotoDelete = this.gotoDelete.bind(this);
    this.confirmBatchDelete = this.confirmBatchDelete.bind(this);
    this.delete = this.delete.bind(this);
    this.gotoCopy = this.gotoCopy.bind(this);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.onSwipeOutOpen = this.onSwipeOutOpen.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.renderBottomBar = this.renderBottomBar.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.afterEdit = this.afterEdit.bind(this);
  }

  state = {
    page: initPage,
    doRenderScene: false,
    data: [],
    selectedIds: [],
    showChooseButton: false,
    closeSwipeOut: false,
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.fetchData());
    });
    this.props.navigation.setParams({
      title: 'FlatList Sample',
      gotoEdit: this.gotoEdit,
    });
  }

  // 搜索
  onSearch() {
    // console.log('.......ctrlState in onSearch:', this.state.ctrlState);
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  // 列表滑动到底部自动触发
  onEndReached() {
    // console.log('.......ctrlState in onEndReached:', this.state.ctrlState);
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
    this.onInfiniteLoad();
  }

  // 无限加载请求
  onInfiniteLoad() {
    // console.log('.......ctrlState in onInfinitedLoad:', this.state.ctrlState);
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: true,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  // 选择行项目
  onSelect(id) {
    this.setState((state) => {
      const ids = state.selectedIds.concat();
      const idx = _.indexOf(ids, id);
      if (idx === -1) {
        ids[ids.length] = id;
      } else {
        ids.splice(idx, 1);
      }
      return { selectedIds: ids };
    });
  }

  // 左滑操作开启时触发
  onSwipeOutOpen() {
    // 隐藏多选按钮并清除被选数据
    this.setState({
      selectedIds: [],
      showChooseButton: false,
    });
  }

  // 全选
  selectAll() {
    this.setState((state) => {
      const ids = [];
      for (let i = 0; i < state.data.length; i++) ids[ids.length] = state.data[i].id;
      return { selectedIds: ids };
    });
  }

  // 全不选
  clearSelection() {
    this.setState({ selectedIds: [] });
  }

  // 控制多选按钮
  toggleChooseBtn() {
    if (!this.state.closeSwipeOut) {
      this.setState({ closeSwipeOut: true }, () => {
        this.setState({
          showChooseButton: !this.state.showChooseButton,
        }, () => {
          this.setState({ closeSwipeOut: false });
        });
      });
    }
  }

  // 删除单条记录前确认
  gotoDelete(item) {
    Alert.alert(
      '提示',
      '您确定要删除此条记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            this.setState({ selectedIds: [item.id] }, () => {
              this.delete();
            });
          },
        },
      ],
    );
  }

  // 批量删除确认
  confirmBatchDelete() {
    if (this.state.selectedIds.length === 0) {
      Toast.show('请选择要删除的项！');
      return;
    }
    Alert.alert(
      '提示',
      `您确定要删除选中的 ${this.state.selectedIds.length} 条记录吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            this.delete();
          },
        },
      ],
    );
  }

  // 复制记录
  gotoCopy(item) {
    this.gotoEdit({ ...item, id: null });
  }

  // 跳转到修改记录界面
  gotoEdit(item, index) {
    // 隐藏多选按钮并清除被选数据
    let newState = {
      selectedIds: [],
      showChooseButton: false,
    };
    if (typeof index !== 'undefined') newState = { ...newState, index };
    this.setState(newState);
    this.props.navigation.navigate('SampleEdit', {
      data: item,
      callback: this.afterEdit,
      index,
    });
  }

  // 删除记录（单条或批量）
  async delete() {
    try {
      this.props.screenProps.showLoading();
      // 调用批量删除接口
      await removeSelected(this.state.selectedIds);
      // 删除后处理
      this.setState((state) => {
        const data = state.data.concat();
        for (let i = data.length - 1; i >= 0; i--) {
          if (_.indexOf(state.selectedIds, data[i].id) !== -1) data.splice(i, 1);
        }
        return { data, selectedIds: [] };
      });
      this.props.screenProps.hideLoading();
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  // 修改完成后回调
  afterEdit(item) {
    this.setState((state) => {
      const data = state.data.concat();
      if (typeof this.state.index === 'number') data.splice(this.state.index, 1, item);
      else data.splice(0, 0, item);
      return { data };
    });
  }

  // 查询数据
  async fetchData() {
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    try {
      const responseData = await page(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        { cond: this.state.cond },
      );
      if (responseData.success) {
        // 下拉刷新则使用新数据取代所有已有的数据，如果是无限加载，则在数据底端追加数据
        const data = this.state.ctrlState.refreshing ? responseData.result : this.state.data.concat(responseData.result);
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: (responseData.start + responseData.pageSize >= responseData.total),
        };
        const newPage = {
          ...this.state.page,
          total: responseData.total,
          start: responseData.start + responseData.pageSize,
        };
        this.setState({
          data,
          ctrlState: newCtrlState,
          page: newPage,
        });
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
            noMoreData: true,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
        });
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      // console.log('exception in SampleList fetchData:', e);
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={Global.styles.TOOL_BAR.FIXED_BAR} >
        <Button text="选择" clear stretch={false} style={{ width: 50 }} onPress={this.toggleChooseBtn} />
        <SearchInput value={this.state.cond} onChangeText={value => this.setState({ cond: value })} />
        <Button text="查询" clear stretch={false} style={{ width: 50 }} onPress={this.onSearch} />
      </View>
    );
  }

  /**
   * 渲染底端工具栏
   */
  renderBottomBar() {
    return (
      <BottomBar visible={this.state.showChooseButton} >
        <Button
          text={this.state.data.length === this.state.selectedIds.length ? '全不选' : '全选'}
          clear
          onPress={() => {
            if (this.state.data.length === this.state.selectedIds.length) this.clearSelection();
            else this.selectAll();
          }}
        />
        <Button
          text="删除"
          disabled={this.state.selectedIds.length === 0}
          clear
          onPress={this.confirmBatchDelete}
        />
        <Button text="完成" onPress={this.toggleChooseBtn} clear />
      </BottomBar>
    );
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    const portrait = item.portrait ? (
      <Portrait width={32} height={32} radius={5} imageSource={portraits[item.portrait]} />
    ) : (
      <Portrait width={32} height={32} radius={5} imageSource={portraits.dft} />
    );
    return (
      <Item
        data={item}
        index={index}
        onPress={this.gotoEdit}
        chevron
        swipeoutButtons={[
          { text: '删除', type: 'delete', onPress: () => this.gotoDelete(item) },
          { text: '复制', type: 'primary', onPress: () => this.gotoCopy(item) },
        ]}
        showChooseButton={this.state.showChooseButton}
        selected={_.indexOf(this.state.selectedIds, item.id) !== -1}
        onSelect={() => this.onSelect(item.id)}
        swipeoutConfig={{
          onOpen: this.onSwipeOutOpen,
          close: this.state.closeSwipeOut,
        }}
      >
        {portrait}
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }} >
          <Text style={{ flex: 1 }} >{item.name}</Text>
          <Text style={{ width: 20 }} >{item.gender === '1' ? '男' : '女'}</Text>
        </View>
        <Icon
          name={item.gender === '1' ? 'md-female' : 'md-male'}
          color={item.gender === '1' ? 'blue' : 'pink'}
          size={15}
          width={40}
          height={15}
        />
      </Item>
    );
  }

  renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} >
        {this.renderToolBar()}
      </View>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER}>
        {this.renderToolBar()}
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            ref={(c) => { this.listRef = c; }}
            data={this.state.data}
            style={styles.list}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            // 渲染行
            renderItem={this.renderItem}
            // 渲染行间隔
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            // 控制无限加载
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.05}
            // 无数据占位符
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '暂无人员信息',
                reloadMsg: '点击刷新按钮重新查询',
                reloadCallback: this.onSearch,
                ctrlState: this.state.ctrlState,
              });
            }}
            // 列表底部
            ListFooterComponent={() => {
              return this.renderFooter({
                data: this.state.data,
                ctrlState: this.state.ctrlState,
                callback: this.onInfiniteLoad,
              });
            }}
          />
        </View>
        {this.renderBottomBar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    minHeight: 200,
  },
});

SampleList.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : 'FlatList Sample',
  headerRight: (
    <Text
      onPress={() => {
        if (typeof navigation.state.params.gotoEdit === 'function') {
          navigation.state.params.gotoEdit();
        }
      }}
      style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}
    >
      添加
    </Text>
  ),
});

export default SampleList;
