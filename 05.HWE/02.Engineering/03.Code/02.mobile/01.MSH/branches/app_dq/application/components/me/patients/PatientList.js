
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Sep from 'rn-easy-separator';

import Global from '../../../Global';
import Item from '../../../modules/PureListItem';
import ctrlState from '../../../modules/ListState';
import { list } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

const relations = {
  0: '本人',
  1: '父母',
  2: '夫妻',
  3: '子女',
  4: '其他',
};

class PatientList extends Component {
  static displayName = 'PatientList';
  static description = '常用就诊人';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    data: this.props.auth.user.map ? this.props.auth.user.map.userPatients : [],
    hospital: (
      this.props.navigation.state.params.hospital ?
        Object.assign({}, this.props.navigation.state.params.hospital) : null
    ),
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
    });
  }

  // 搜索
  onSearch() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
      },
    }, () => this.fetchData());
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
  gotoEdit(item) {
    // 回调列表更新数据
    this.props.setCurrPatient(item);
    const { callback, route, routeData } = this.props.navigation.state.params;
    const data = this.renderProfile(this.state.hospital, item);
    if (typeof callback === 'function') callback(item, data);
    if (typeof route === 'string') {
      this.props.navigation.navigate(route, { routeData });
    } else {
      this.props.navigation.goBack();
    }
  }
  // 查询数据
  async fetchData() {
    try {
      const responseData = await list(this.state.hospital);
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
        };
        this.setState({
          data: responseData.result,
          ctrlState: newCtrlState,
        });
        const { user } = this.props.auth;
        const userPatients = this.state.data;
        user.map = { userPatients };
        this.props.updateUser(user);
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
  }

  // 根据医院筛选就诊人
  renderProfile(hospital, item) {
    const { profiles } = item;
    if (profiles !== null && hospital !== null) {
      for (let i = 0; i < profiles.length; i++) {
        const pro = profiles[i];
        if (pro.status === '1' && pro.hosId === hospital.id) {
          return pro;
        }
      }
      return null;
    }
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Item
          data={item}
          index={index}
          onPress={this.gotoEdit}
          chevron
          showChooseButton={this.state.showChooseButton}
          selected={_.indexOf(this.state.selectedIds, item.id) !== -1}
          onSelect={() => this.onSelect(item.id)}
          swipeoutConfig={{
            onOpen: this.onSwipeOutOpen,
            close: this.state.closeSwipeOut,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }} >
            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 13 }} >
              <View style={{ flex: 1, flexDirection: 'row' }} >
                <Text>{item.name}</Text>
                <Sep width={20} />
                <Text>{item.gender === '1' ? '男' : '女'}</Text>
                <Sep width={20} />
                <Text>{relations[item.relation]}</Text>
              </View>
              <Sep height={5} />
              <View style={{ flex: 1, flexDirection: 'row' }} >
                <Text style={{ flex: 1 }}>身份证：{item.idNo}</Text>
              </View>
              <Sep height={5} />
              <View style={{ flex: 1, flexDirection: 'row' }} >
                <Text style={{ flex: 1 }}>手机号：{item.mobile}</Text>
              </View>
            </View>
          </View>
        </Item>
      </View>
    );
  }

  render() {
    if (!this.state.doRenderScene) { return PatientList.renderPlaceholderView(); }
    console.log('PatientList', this.state.data);
    return (
      <View style={Global.styles.CONTAINER}>
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
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
  lock: {
    width: 28,
    height: 28,
    marginLeft: 10,
    borderRadius: 14,
    backgroundColor: '#FE4D3D',
  },
  unlock: {
    width: 28,
    height: 28,
    marginLeft: 10,
    borderRadius: 14,
    backgroundColor: '#E4E4E4',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: patient => dispatch(setCurrPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientList);
