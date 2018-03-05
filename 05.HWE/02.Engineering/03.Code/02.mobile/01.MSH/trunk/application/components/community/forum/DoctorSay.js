import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import EasyCard from 'rn-easy-card';
import { NavigationActions } from 'react-navigation';

import Global from '../../../Global';
import ctrlState from '../../../modules/ListState';
import { page } from '../../../services/community/ConsultRecordsService';


const initPage = { start: 0, limit: 20 };

class DoctorSay extends Component {
  static displayName = 'DoctorSay';
  static description = '医生说说';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.gotoReply = this.gotoReply.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  state = {
    page: initPage,
    doRenderScene: false,
    data: [],
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

  // 跳转到查看详情
  gotoReply() {
    console.info('敬请期待');
  }

  // 查询数据
  async fetchData() {
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    try {
      const responseData = await page(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        {
          // createdBy: this.props.auth.user.id,
          status: '1',
          // hosId: this.props.base.currHospital.id,
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
      // console.log('exception in ConsultRecords fetchData:', e);
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
   * 渲染行数据
   */
  renderItem({ item }) {
    const scenerySource = item.images.length > 0 ?
      { uri: `${Global.getImageHost()}${item.images[0].fileName}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.hospScenery;

    return (
      <TouchableOpacity
        onPress={this.gotoReply}
        style={{ marginTop: 6, marginLeft: 6, marginRight: 6, borderRadius: 20 }}
      >
        <EasyCard hideBottomBorder hideTopBorder fullWidth style={{ backgroundColor: '#FFFFFFFF', flexDirection: 'column' }}>
          <View style={{ backgroundColor: Global.colors.IOS_GRAY_BG }}>
            <Image source={scenerySource} style={{ height: 200, width: Global.getScreen().width - 40 }} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={{ fontSize: 13, color: '#999999' }}>{item.createdAt}</Text>
            </View>
            <View style={{ paddingLeft: Global.getScreen().width - 233 }}>
              <Text style={{ fontSize: 10, color: '#999999' }}>1290赞 | 320评论</Text>
            </View>
          </View>
          <View style={{ paddingTop: 3 }}>
            <Text style={{ color: '#2C3742', fontSize: 16, alignItems: 'center', width: Global.getScreen().width - 40 }}>{item.consultDetail.length > 100 ? `${item.consultDetail.substring(0, 100)}...` : item.consultDetail }</Text>
          </View>
        </EasyCard>
      </TouchableOpacity>
    );
  }


  render() {
    if (!this.state.doRenderScene) {
      return DoctorSay.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
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
                msg: '暂无新的咨询信息',
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


const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});


export default connect(mapStateToProps, mapDispatchToProps)(DoctorSay);

