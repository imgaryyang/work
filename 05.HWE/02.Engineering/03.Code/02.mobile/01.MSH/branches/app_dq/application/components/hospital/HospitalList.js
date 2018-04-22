
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  InteractionManager,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
// import Button from 'rn-easy-button';

import Global from '../../Global';
import SearchInput from '../../modules/SearchInput';
import Item from '../../modules/PureListItem';
import ctrlState from '../../modules/ListState';
import { page } from '../../services/hospital/HospitalService';
import HospitalListItem from './HospitalItem';

const initPage = { start: 0, limit: 20 };

class HospitalList extends Component {
  static displayName = 'HospitalList';
  static description = '医院列表';

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.gotoHospitalHome = this.gotoHospitalHome.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  state = {
    page: initPage,
    doRenderScene: false,
    data: [],
    ctrlState,
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params && (typeof params.chooseHospital === 'function' || typeof params.chooseHospitalForNext === 'function') ?
        '选择医院' : '找医院',
      hideNavBarBottomLine: true,
      hideShadow: true,
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.fetchData());
    });
    this.props.screenProps.getCurrentLocation();
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

  // 跳转到修改记录界面
  gotoHospitalHome(item) {
    this.props.navigation.navigate('Hospital', {
      title: '医院信息',
      hospital: item,
    });
  }

  // 查询数据
  async fetchData() {
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    try {
      const responseData = await page(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        { name: this.state.cond },
      );
      // console.log('responseData in HospitalList.fetchData():', responseData);
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
      // console.log('exception in HospitalList fetchData:', e);
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

  renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} >
        {this.renderToolBar()}
      </View>
    );
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={[Global.styles.TOOL_BAR.FIXED_BAR_WITH_NAV]} >
        <SearchInput
          value={this.state.cond}
          onChangeText={value => this.setState({ cond: value })}
          onSearch={this.onSearch}
        />
      </View>
    );
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    // 默认显示医院实景图
    let showScenery = true;
    // 默认不显示导向到医院详情的按钮
    let showGotoButton = false;

    const { params } = this.props.navigation.state;
    // console.log('this.props.navigation.state.params in HospitalList.renderItem():', params);

    // 用于公用选择界面
    if (params && (typeof params.chooseHospital === 'function' || typeof params.chooseHospitalForNext === 'function')) {
      // 不显示医院实景图
      showScenery = false;
      // 显示导向到医院详情的按钮
      showGotoButton = true;
    }
    return (
      <Item
        data={item}
        index={index}
        onPress={(hosp) => {
          // 业务操作，把选择医院作为过渡场景
          if (params && typeof params.chooseHospitalForNext === 'function') {
            params.chooseHospitalForNext(hosp, params.routeName, params.passProps);
          } else if (params && typeof params.chooseHospital === 'function') { // 公用选择医院时，回调后调用返回
            params.chooseHospital(hosp);
            this.props.navigation.goBack();
          } else {
            this.gotoHospitalHome(hosp);
          }
        }}
        chevron={false}
        contentStyle={{ padding: 0 }}
      >
        <HospitalListItem
          item={item}
          index={index}
          showScenery={showScenery}
          showGotoButton={showGotoButton}
          navigation={this.props.navigation}
        />
      </Item>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    // console.log('this.props in HospitalList.render():', this.props);
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {this.renderToolBar()}
        <FlatList
          ref={(c) => { this.listRef = c; }}
          data={this.state.data}
          style={styles.list}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          // 渲染行
          renderItem={this.renderItem}
          // 渲染行间隔
          ItemSeparatorComponent={() => (<Sep height={15} />)}
          // 控制下拉刷新
          refreshing={this.state.ctrlState.refreshing}
          onRefresh={this.onSearch}
          // 控制无限加载
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.01}
          // 无数据占位符
          ListEmptyComponent={() => {
            return this.renderEmptyView({
              msg: '暂无符合查询条件的医院信息',
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
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 200,
    // paddingTop: 15,
  },
});

HospitalList.navigationOptions = () => ({
});

export default HospitalList;
