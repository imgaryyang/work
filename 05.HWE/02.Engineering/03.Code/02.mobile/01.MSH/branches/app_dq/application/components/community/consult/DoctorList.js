
import React, { Component, PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';
import Portrait from 'rn-easy-portrait';
import EasyCard from 'rn-easy-card';

import Global from '../../../Global';
import ctrlState from '../../../modules/ListState';
import BottomBar from '../../../modules/BottomBar';
import { listByDept } from '../../../services/hospital/DoctorService';


const initPage = { start: 0, limit: 20 };

class Item extends PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.data, this.props.index);
  };

  render() {
    const record = this.props.data;
    const portrait = (<Portrait
      width={46}
      height={46}
      radius={23}
      bgColor={Global.colors.FONT_LIGHT_GRAY1}
      imageSource={record.photo === null ?
        Global.Config.defaultImgs.docPortrait : ({ uri: `${Global.getImageHost()}${record.photo}` })}
    />);
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={styles.item}
      >
        <EasyCard hideBottomBorder hideTopBorder fullWidth style={{ backgroundColor: '#FFFFFFFF', flexDirection: 'column', paddingTop: 10, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {portrait}
            <View style={{ flexDirection: 'column' }}>
              <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 16, width: 80, color: '#2C3742', fontWeight: 'bold' }}>{record.name}</Text>
                <Text style={{ fontSize: 10, paddingTop: 2, paddingBottom: 2 }}>{record.jobTitle}</Text>
              </View>
              <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 16, width: 90, color: '#2C3742' }}>{record.depName}</Text>
                <Text style={{ fontSize: 16, width: 90, color: '#FE4D3D', marginLeft: Global.getScreen().width - 2 }}>120.00/次</Text>
              </View>
            </View>
            {/* <View style={{ marginLeft: 10 }}>
              <EasyCard style={{ width: 73, height: 36, borderRadius: 10 }}><Text style={{ alignItems: 'center', justifyContent: 'center' }}>问医生</Text></EasyCard>
            </View>*/}
          </View>
          <Sep style={[Global.styles.BORDER, { marginTop: 8 }]} />
          <View style={{ flexDirection: 'row', paddingTop: 6 }}>
            <Text style={{ fontSize: 10 }}>擅长：</Text>
            <Text numberOfLines={2} style={{ fontSize: 10, alignItems: 'center', width: Global.getScreen().width - 55 }}>{record.speciality ? record.speciality : '暂无简介' } </Text>
          </View>
        </EasyCard>
      </TouchableOpacity>
    );
  }
}

class DoctorList extends Component {
  static displayName = 'DoctorList';
  static description = '选择医生';

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
    this.gotoEdit = this.gotoEdit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderBottomBar = this.renderBottomBar.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.afterEdit = this.afterEdit.bind(this);
  }

  state = {
    page: initPage,
    doRenderScene: false,
    data: [],
    selectedIds: [],
    showChooseButton: false,
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
      title: '选择医生',
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


  // 跳转到修改记录界面
  gotoEdit(item, index) {
    // 隐藏多选按钮并清除被选数据
    let newState = {
      selectedIds: [],
      showChooseButton: false,
    };
    if (typeof index !== 'undefined') newState = { ...newState, index };
    this.setState(newState);
    this.props.navigation.navigate('EditConsult', {
      data: item,
      index,
      callback: this.afterEdit,
    });
  }


  afterEdit() {
    // 回调列表更新数据
    const { callback } = this.props.navigation.state.params;
    if (typeof callback === 'function') callback();
    // 返回列表页
    this.props.navigation.goBack();
  }


  // 查询数据
  async fetchData() {
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    try {
      const responseData = await listByDept(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        {
          depId: this.props.navigation.state.params.deptId,
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
      // console.log('exception in DoctorList fetchData:', e);
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
      <Text style={{ fontSize: 12, marginTop: 4, marginLeft: (Global.getScreen().width / 2) - 50, alignItems: 'center', justifyContent: 'center' }}>为您找到{this.state.data.length}位医生</Text>
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
    return (
      <Item
        data={item}
        index={index}
        onPressItem={this.gotoEdit}
      >
        {/* <View style={{ height: 120, flexDirection: 'row' }}>
          {portrait}
          <View style={{ width: 280, flexDirection: 'column' }} >
            <Text><Text style={{ fontSize: 20, width: 100 }} >{item.name}</Text>       <Text style={{ width: 200, textAlign: 'right', color: 'red' }}>咨询费：50.00元</Text></Text>
            <Text><Text style={{ color: 'red' }}>{item.jobTitle}</Text>     {item.depName}</Text>
            <Text style={{ height: 30, width: 280, flexDirection: 'row'  }}>
              <Text style={{ width: 120 }}>{item.hosName}</Text>

              <Text
                style={{ marginLeft: 50, height: 28, backgroundColor: 'green', color: 'white'}}
              >发起咨询
              </Text>
            </Text>
            <Sep style={Global.styles.BORDER} />
            <Text>{item.speciality ? item.speciality.substring(0, 20) + '......' : '暂无简介' }  </Text>
          </View>
        </View> */}
      </Item>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return DoctorList.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
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
  item: {
    marginTop: 6,
  },
});

DoctorList.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : '选择医生',
});

export default DoctorList;
