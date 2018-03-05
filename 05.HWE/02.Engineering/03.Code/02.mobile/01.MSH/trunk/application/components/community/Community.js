import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import PintrestTabBar from '../../modules/PintrestTabBar';
import Button from 'rn-easy-button';
import EasyCard from 'rn-easy-card';
import Icon from 'rn-easy-icon';

import SearchInput from '../../modules/SearchInput';

import LatestRelease from './forum/LatestRelease';
import HotConsult from './forum/HotConsult';
import DoctorSay from './forum/DoctorSay';
import Global from '../../Global';


class Community extends Component {
  constructor(props) {
    super(props);
    this.renderToolBar = this.renderToolBar.bind(this);
  }

  state = {
    name: '',
  };

  componentDidMount() {
    this.props.navigation.setParams({
      hideNavBarBottomLine: true,
      // showCurrHostAndPatient: !!user,
      // allowSwitchHospital: true,
      // allowSwitchPatient: true,
    });
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={[Global.styles.TOOL_BAR.FIXED_BAR_WITH_NAV, { borderBottomWidth: 0 }]} >
        <SearchInput
          value={this.state.name}
          onChangeText={value => this.setState({ name: value })}
          onSearch={this.onSearch}
          style={{ borderBottomWidth: 0 }}
        />
      </View>
    );
  }


  render() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {this.renderToolBar()}

        {/* <EasyCard radius={8} hideBottomBorder hideTopBorder fullWidth style={{ marginTop: 6, backgroundColor: '#FFFFFFFF', marginLeft: 8, marginRight: 8, justifyContent: 'center'}}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 16, color: '#999999', paddingTop: 4 }}>交流健康经验，分享就医经历</Text>
            <Button
              text="发布"
              style={{ flexDirection: 'row', borderRadius: 6, marginLeft: 40, height:30 }}
              onPress={() => {

              }}
            >
              <Icon iconLib="fa" name="pencil" size={15} color="#ffffff" />
              <Text style={{
                marginLeft: 10, color: '#ffffff',
              }}
              >
                发布
              </Text>
            </Button>
          </View>
        </EasyCard>*/}

        <ScrollableTabView
          initialPage={0}
          renderTabBar={() => <PintrestTabBar />}
        >
          <LatestRelease tabLabel="最新发布" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} />
          <HotConsult tabLabel="热门咨询" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} />
          <DoctorSay tabLabel="医生说说" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} />
        </ScrollableTabView>
      </View>
    );
  }
}


export default Community;

