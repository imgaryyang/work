import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import PintrestTabBar from '../../../modules/PintrestTabBar';
import NewCousult from './NewConsult';
import CurrentConsult from './CurrentConsult';
import HistoryConsult from './HistoryConsult';
import Global from '../../../Global';


class ConsultRecords extends Component {
  constructor(props) {
    super(props);
    this.gotoEdit = this.gotoEdit.bind(this);
    this.afterEdit = this.afterEdit.bind(this);
  }

  state = {
    refresh: false,
  };

  componentDidMount() {
    const user = Global.getUser();
    this.props.navigation.setParams({
      title: '医患沟通',
      headerRight: (
        <Text
          onPress={() => {
            this.gotoEdit();
          }}
          style={{ color: Global.styles.FONT_GRAY, fontSize: 14 }}
        >
          添加咨询
        </Text>
      ),

      showCurrHospitalAndPatient: !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: true,
    });
  }

  // 跳转到添加记录界面
  gotoEdit(item, index) {
    // 隐藏多选按钮并清除被选数据
    let newState = {
      selectedIds: [],
      showChooseButton: false,
    };
    if (typeof index !== 'undefined') newState = { ...newState, index };
    this.setState(newState);
    this.props.navigation.navigate('SelectDept', {
      flag: 'consult',
      data: item,
      callback: this.afterEdit,
      index,
    });
  }
  // 修改完成后回调
  afterEdit() {
    console.info('刷新');
    this.setState({ refresh: true });
  }


  render() {
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollableTabView
          initialPage={0}
          renderTabBar={() => <PintrestTabBar />}
        >
          <NewCousult tabLabel="未回复" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} refresh={this.state.refresh} />
          <CurrentConsult tabLabel="已回复" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} />
          <HistoryConsult tabLabel="已完成" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} />
        </ScrollableTabView>
      </View>
    );
  }
}


export default ConsultRecords;

