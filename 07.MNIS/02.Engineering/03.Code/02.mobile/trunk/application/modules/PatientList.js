
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';
import Portrait from 'rn-easy-portrait';

import Global from '../Global';
import SearchInput from '../modules/SearchInput';
import Item from '../modules/PureListItem';
import ctrlState from '../modules/ListState';
import { page } from '../services/me/PatientService';

const initPage = { start: 0, limit: 20 };

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
    this.renderItem = this.renderItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
  }
  state = {
    page: initPage,
    data: [],
    ctrlState,
  };
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
  // 查询数据
  async fetchData() {
    try {
      const responseData = await page(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        {
          cond: this.state.cond,
          hospitalId: this.props.hospitalId,
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
        Toast.show(responseData.msg);
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }
  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={Global.styles.TOOL_BAR.FIXED_BAR} >
        <SearchInput value={this.state.cond} onChangeText={value => this.setState({ cond: value })} />
        <Button text="查询" clear stretch={false} style={{ width: 50 }} onPress={this.onSearch} />
      </View>
    );
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    const portrait = item.portrait ? (
      <Portrait width={32} height={32} radius={5} imageSource={this.props.portraits[item.portrait]} />
    ) : (
      <Portrait width={32} height={32} radius={5} imageSource={this.props.portraits.dft} />
    );
    return (
      <Item
        data={item}
        index={index}
        onPress={this.props.callback}
        chevron
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
        <Text>关系</Text>
      </Item>
    );
  }

  render() {
    // const data = this.state.data ? this.state.data : [] ;
    this.state.data = Global.user.patients ? Global.user.patients : this.state.data;
    console.log('render>>>>>>', this.state.data);
    console.log('render>>>>>>', Global.user.patients);
    return (
      <View style={Global.styles.CONTAINER}>
        {this.renderToolBar()}
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

PatientList.propTypes = {
  /**
   * 点击行回调
   */
  callback: PropTypes.func,
  /**
   * data数据
   */
  data: PropTypes.array,
  /**
   *  头像
   */
  portraits: PropTypes.object,
  /**
   * 医院信息
   */
  hospitalId: PropTypes.string,
};

PatientList.defaultProps = {
  chevron: true,
  onPress: () => {},
};
export default PatientList;
