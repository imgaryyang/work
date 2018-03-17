
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
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';

import Global from '../../../Global';
import SearchInput from '../../../modules/SearchInput';
import Item from '../../../modules/PureListItem';
import ctrlState from '../../../modules/ListState';
import BottomBar from '../../../modules/BottomBar';
import { list, removeSelected, updateUserPatients } from '../../../services/me/PatientService';
import { afterLogout, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

const relations = {
  0: '本人',
  1: '父母',
  2: '夫妻',
  3: '子女',
  4: '其他',
};

class Patients2 extends Component {
  static displayName = 'Patients2';
  static description = '常用就诊人';
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.toggleChooseBtn = this.toggleChooseBtn.bind(this);
    this.gotoDelete = this.gotoDelete.bind(this);
    this.confirmBatchDelete = this.confirmBatchDelete.bind(this);
    this.delete = this.delete.bind(this);
    this.gotoCopy = this.gotoCopy.bind(this);
    this.gotoEdit = this.gotoEdit.bind(this);
    // this.onSwipeOutOpen = this.onSwipeOutOpen.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.renderBottomBar = this.renderBottomBar.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.afterEdit = this.afterEdit.bind(this);
    this.gotoAdd = this.gotoAdd.bind(this);
    this.afterAdd = this.afterAdd.bind(this);
    this.updateUserPatient = this.updateUserPatient.bind(this);
    this.checkProfile = this.checkProfile.bind(this);
  }

  state = {
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
        data: this.props.auth.user.map ? this.props.auth.user.map.userPatients : [],
      });
    });
    this.props.navigation.setParams({
      title: '常用就诊人',
      headerRight: (
        <Text
          onPress={() => {
            this.gotoAdd();
          }}
          style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}
        >
          添加
        </Text>
      ),
      hideNavBarBottomLine: true,
    });
  }
  // 搜索
  onSearch() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
      },
    }, () => this.updateUserPatient());
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
  // onSwipeOutOpen() {
  //   // 隐藏多选按钮并清除被选数据
  //   this.setState({
  //     selectedIds: [],
  //     showChooseButton: false,
  //   });
  // }
  async updateUserPatient() {
    try {
      // this.props.screenProps.showLoading();
      const res = await updateUserPatients({ name: this.state.cond });
      if (res.success) {
        const { user } = this.props.auth;
        const userPatients = res.result;
        user.map = { userPatients };
        this.props.updateUser(user);
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
        // this.props.screenProps.hideLoading();
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
        // this.props.screenProps.hideLoading();
        this.handleRequestException({ msg: res.msg });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
      // this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
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
    const { relation } = item;
    this.props.navigation.navigate(relation === '0' ? 'EditMyPatient' : 'EditPatient', {
      data: item,
      callback: this.afterEdit,
      index,
      title: '编辑就诊人',
    });
  }
  // 跳转到新增记录界面
  gotoAdd(item, index) {
    // 隐藏多选按钮并清除被选数据
    let newState = {
      selectedIds: [],
      showChooseButton: false,
    };
    if (typeof index !== 'undefined') newState = { ...newState, index };
    this.setState(newState);
    const path = this.props.base.edition === Global.EDITION_SINGLE ? 'AddPatientSingle' : 'AddPatient';
    console.log('path', path);
    this.props.navigation.navigate(path, {
      data: item,
      callback: this.afterAdd,
      index,
      title: '添加就诊人',
    });
  }
  // 新增完成后回调
  afterAdd(item) {
    this.setState((state) => {
      const data = state.data.concat();
      if (typeof this.state.index === 'number') data.splice(this.state.index, 1, item);
      else data.splice(0, 0, item);
      return { data };
    });
    const { user } = this.props.auth;
    user.map.userPatients = this.state.data;
    this.props.updateUser(user);
  }

  // 修改完成后回调
  afterEdit(item) {
    this.setState((state) => {
      const data = state.data.concat();
      if (typeof this.state.index === 'number') data.splice(this.state.index, 1, item);
      else data.splice(0, 0, item);
      return { data };
    });
    const { user } = this.props.auth;
    user.map.userPatients = this.state.data;
    this.props.updateUser(user);
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
      this.onSearch();
      this.props.screenProps.hideLoading();
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }
  // 查询数据
  async fetchData() {
    try {
      this.props.screenProps.showLoading();
      const responseData = await list();
      if (responseData.success) {
        // 下拉刷新则使用新数据取代所有已有的数据，如果是无限加载，则在数据底端追加数据
        const data = this.state.ctrlState.refreshing ? responseData.result : this.state.data;
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
        };
        this.setState({
          data,
          ctrlState: newCtrlState,
        });
        const { user } = this.props.auth;
        const userPatients = this.state.data;
        user.map = { userPatients };
        this.props.updateUser(user);
        this.props.screenProps.hideLoading();
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
        });
        this.props.screenProps.hideLoading();
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
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} >
        {this.renderToolBar()}
        <View style={[Global.styles.CENTER, { flex: 1 }]} >
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={Global.styles.TOOL_BAR.FIXED_BAR_WITH_NAV} >
        <Button text="选择" clear stretch={false} style={{ width: 50 }} onPress={this.toggleChooseBtn} />
        <SearchInput
          value={this.state.cond}
          onChangeText={value => this.setState({ cond: value })}
          onSearch={this.onSearch}
        />
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
  checkProfile(profiles, currHospital) {
    const { id } = currHospital;
    let num = 0;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].hosId === id) {
        num = num + 1;
      }
    }
    return num;
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    const { currHospital, edition } = this.props.base;
    const profiles = item.profiles ? item.profiles : [];
    const flag = edition === Global.EDITION_SINGLE ? true : false;
    const num1 = item.profiles ? item.profiles.length : '0';
    const num2 = this.checkProfile(profiles, currHospital);
    const no = flag ? num2 : num1;
    return (
      <Item
        data={item}
        index={index}
        onPress={this.gotoEdit}
        chevron
        showChooseButton={this.state.showChooseButton}
        selected={_.indexOf(this.state.selectedIds, item.id) !== -1}
        onSelect={() => this.onSelect(item.id)}
        // swipeoutConfig={{
        //   onOpen: this.onSwipeOutOpen,
        //   close: this.state.closeSwipeOut,
        // }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} >
          <View style={{ flex: 7, flexDirection: 'column' }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={{ color: '#2C3742', fontSize: 15, fontWeight: '600' }}>{item.name}</Text>
              <Sep width={10} />
              <Text style={{ color: '#2C3742', fontSize: 13 }}>{item.gender === '1' ? '男' : '女'}</Text>
              <View style={styles.tagContainer} >
                <Text style={styles.tag}>{relations[item.relation]}</Text>
              </View>
            </View>
            <Sep height={8} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={{ color: '#999999', fontSize: 13 }}>身份证</Text>
              <Sep width={10} />
              <Text style={{ color: '#999999', fontSize: 13 }}>{item.idNo}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={{ color: '#999999', fontSize: 13 }}>手机号</Text>
              <Sep width={10} />
              <Text style={{ color: '#999999', fontSize: 13 }}>{item.mobile}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={{ color: '#999999', fontSize: 13 }}>已绑定</Text>
              <Sep width={10} />
              <Text style={{ color: '#999999', fontSize: 13 }}>{no} 张就诊卡</Text>
            </View>
          </View>
        </View>
      </Item>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    const { userPatients } = this.props.auth.user.map;
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          {this.renderToolBar()}
          <FlatList
            data={userPatients}
            style={styles.list}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            // 渲染行
            renderItem={this.renderItem}
            // 渲染行间隔
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            onEndReachedThreshold={0.01}
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
                data: userPatients,
                ctrlState: this.state.ctrlState,
              });
            }}
          />
          {this.renderBottomBar()}
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
  lock: {
    backgroundColor: Global.colors.IOS_BLUE,
  },
  unlock: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E4E4E4',
  },
  img: {
    width: 28,
    height: 28,
  },
  tagContainer: {
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    marginLeft: 8,
    backgroundColor: Global.colors.IOS_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    fontSize: 9,
    lineHeight: 9,
    color: 'white',
  },
});

Patients2.navigationOptions = ({ navigation }) => ({
  headerTitle: '常用就诊人',
  headerRight: (
    <Text
      onPress={() => {
        if (typeof navigation.state.params.gotoAdd === 'function') {
          navigation.state.params.gotoAdd();
        }
      }}
      style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}
    >
      添加
    </Text>
  ),
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogout: () => dispatch(afterLogout()),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Patients2);
