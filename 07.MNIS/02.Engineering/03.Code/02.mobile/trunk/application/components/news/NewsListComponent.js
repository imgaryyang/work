/**
 * 新闻列表
 */

import React, { Component, PureComponent } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import Portrait from 'rn-easy-portrait';
import Button from 'rn-easy-button';
import moment from 'moment';

import SearchInput from '../../modules/SearchInput';
import ctrlState from '../../modules/ListState';
import Global from '../../Global';
import { page } from '../../services/news/NewsService';
import { base } from '../../services/RequestTypes';

class Item extends PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.data, this.props.index);
  };

  render() {
    if (typeof this.props.data.image === 'undefined' || this.props.data.image === '' || this.props.data.image === null) {
      return (
        <TouchableOpacity
          onPress={this.onPress}
        >
          <View style={{ backgroundColor: 'white' }}>
            <View style={{ flex: 1, marginLeft: 20, marginBottom: 15 }} >
              <Text style={{ fontSize: 12, color: Global.colors.FONT_LIGHT_GRAY1 }}>{moment(this.props.data.createdAt).format('YYYY-MM-DD HH:MM')}</Text>
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{this.props.data.caption}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row-reverse', height: 10 }} />
        </TouchableOpacity>
      );
    } else {
      const uriBefore = base().img + this.props.data.image;
      const uriAfter = new Date().getTime();
      const uriImage = `${uriBefore}?timestamp=${uriAfter}`;
      const portrait = (
        <Portrait
          width={Global.screen.width - 20}
          height={(Global.screen.width - 20) * (177 / 340)}
          imageSource={{ uri: uriImage }}
        />
      );
      return (
        <TouchableOpacity
          onPress={this.onPress}
        >
          <View style={{ backgroundColor: 'white' }}>
            <View style={{ flex: 1, margin: 10 }} >
              {portrait}
            </View>
            <View style={{ flex: 1, marginLeft: 20, marginBottom: 15 }} >
              <Text style={{ fontSize: 12, color: Global.colors.FONT_LIGHT_GRAY1 }}>{moment(this.props.data.createdAt).format('YYYY-MM-DD HH:MM')}</Text>
              <Sep height={3} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{this.props.data.caption}</Text>
            </View>
          </View>
          <View style={{ height: 10 }} />
        </TouchableOpacity>
      );
    }
  }
}

const initPage = { start: 0, limit: 5 };
class NewsListComponent extends Component {
  static displayName = 'NewsListComponent';
  static description = '列表信息';
  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.gotoScan = this.gotoScan.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.pullToRefresh = this.pullToRefresh.bind(this);
  }

  state = {
    page: initPage,
    doRenderScene: false,
    data: [],
    caption: '',
    ctrlState,
  };

  componentDidMount() {
    if (typeof this.props.fkType === 'undefined' || this.props.fkType === '' || this.props.fkType === null) {
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      this.fetchData();
    });
    this.props.navigation.setParams({
      title: this.props.title,
      gotoScan: this.gotoScan,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fkType !== this.props.fkType) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          infiniteLoading: false,
          noMoreData: false,
          requestErr: false,
          requestErrMsg: null,
        },
        caption: '',
      }, () => this.fetchData());
    }
    // DeviceEventEmitter.emit(this.props.fkType, this.add());
  }

  // 搜索
  onSearch() {
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
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
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
    this.onInfiniteLoad();
  }
  // 无限加载
  onInfiniteLoad() {
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: true,
        noMoreData: false,
      },
    }, () => this.fetchData());
  }

  gotoScan(item, index) {
    this.props.navigation.navigate('NewsContent', {
      data: item,
      index,
    });
  }
  pullToRefresh() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }
  async fetchData() {
    try {
      const responseData = await page(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        {
          fkType: this.props.fkType,
          fkId: this.props.fkId,
          caption: this.state.caption,
        },
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
    if (typeof this.props.onChildCompLoaded === 'function') this.props.onChildCompLoaded();
  }
  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={[Global.styles.TOOL_BAR.FIXED_BAR, { paddingLeft: 15 }]} >
        <SearchInput value={this.state.caption} onChangeText={value => this.setState({ caption: value })} />
        <Button text="查询" clear stretch={false} style={{ width: 50 }} onPress={this.onSearch} />
      </View>
    );
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        onPressItem={this.gotoScan}
      />
    );
  }
  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return NewsListComponent.renderPlaceholderView();
    }
    // console.log('this.props.navigation in NewsList.render():', this.props.navigation);

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        {this.renderToolBar()}
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            ref={(c) => { this.listRef = c; }}
            data={this.state.data}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            renderItem={this.renderItem}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            // 控制无限加载
            onEndReached={this.onEndReached}
            // onEndReachedThreshold={0.05}
            // ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            ListEmptyComponent={() => {
                return this.renderEmptyView({
                  msg: '暂无信息',
                  reloadMsg: '点击刷新按钮重新加载',
                  ctrlState: this.state.ctrlState,
                  reloadCallback: this.pullToRefresh,
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
          <Sep height={40} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
});

export default NewsListComponent;
