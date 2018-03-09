/**
 * 科室介绍
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Global from '../../Global';
import { sectionDescs } from '../../services/base/BaseService';
import ctrlState from '../../modules/ListState';
import { forDeptList } from '../../services/outpatient/AppointService';

class Department extends Component {
  static displayName = 'Department';
  static description = '科室介绍';

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.fetchDescData = this.fetchDescData.bind(this);
    this.renderDescs = this.renderDescs.bind(this);
    this.onPressRegister = this.onPressRegister.bind(this);
  }

  state = {
    doRenderScene: false,
    descs: [],
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => this.refresh());
    });
    // const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: /* params && params.dept ? params.dept.name || '科室信息' : */'科室信息',
    });
  }

  /**
   * 导向到预约挂号
   */
  async onPressRegister(dept) {
    const { hosp, screenProps, navigation, nav } = this.props;
    const { showLoading, hideLoading } = screenProps;
    showLoading();
    try {
      const responseData = await forDeptList({ hosId: hosp.id, hosNo: hosp.no, name: dept.name });
      const { success, result, msg } = responseData;
      if (success) {
        if (result.length > 1) {
          Toast.show('错误：返回多个科室！');
        }
        hideLoading();
        navigation.navigate('Schedule', {
          backIndex: nav.index,
          title: result[0].name,
          depNo: result[0].no,
          hosNo: result[0].hosNo,
          showCurrHospitalAndPatient: true,
          allowSwitchHospital: false,
          allowSwitchPatient: true,
          afterChooseHospital: null,
          afterChoosePatient: null,
          hideNavBarBottomLine: false,
        });
      } else {
        this.handleRequestException({ msg });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
    hideLoading();

    // this.props.navigator.push({
    //   title: '挂号',
    //   component: RegisterResource,
    //   hideNavBar: true,
    //   passProps: {
    //     hospitalId: dept.hospitalId,
    //     departmentId: dept.id,
    //   }
    // });
  }

  refresh() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchDescData());
  }

  /**
   * 异步加载数据
   */
  async fetchDescData() {
    try {
      const { dept } = this.props.navigation.state.params;
      const responseData = await sectionDescs(0, 100, { fkId: dept.id, fkType: 'deptDesc' });
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
        };
        this.setState({
          descs: responseData.result,
          ctrlState: newCtrlState,
        });
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
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
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        {this.renderBaseInfo()}
      </View>
    );
  }

  renderBaseInfo() {
    const { dept } = this.props.navigation.state.params;
    return (
      <View>
        <Card style={{ borderTopWidth: 0 }} >
          <View style={Global.styles.CARD_TITLE} >
            <Text style={Global.styles.CARD_TITLE_TEXT} >{dept.name}</Text>
          </View>
          <Text style={Global.styles.CARD_CONTENT_TEXT} >{dept.brief || '暂无简介'}</Text>
          <Button
            text="去挂号"
            theme={Button.THEME.ORANGE}
            outline
            onPress={() => this.onPressRegister(dept)}
            style={styles.button}
          />
        </Card>
        <Sep height={15} />
        <Card >
          <View style={Global.styles.CARD_TITLE} >
            <Text style={Global.styles.CARD_TITLE_TEXT} >院内地址</Text>
          </View>
          <Text style={Global.styles.CARD_CONTENT_TEXT} >{dept.address || '暂无院内地址信息'}</Text>
        </Card>
        <Sep height={15} />
      </View>
    );
  }

  renderDescs() {
    if (!this.state.descs || this.state.descs.length === 0) {
      return null;
    }
    return (
      <Card >
        {this.state.descs.map((item, idx) => {
          return (
            <View key={`desc_${idx + 1}`} >
              <View style={Global.styles.CARD_TITLE} >
                <Text style={Global.styles.CARD_TITLE_TEXT} >{item.caption}</Text>
              </View>
              <Text style={Global.styles.CARD_CONTENT_TEXT} >{item.body}</Text>
            </View>
          );
        })}
      </Card>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }

    const emptyView = this.renderEmptyView({
      msg: '暂无更多科室介绍',
      reloadMsg: '点击刷新按钮重新查询',
      reloadCallback: this.refresh,
      ctrlState: this.state.ctrlState,
      data: this.state.descs,
      showActivityIndicator: true,
    });

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <ScrollView style={styles.scrollView} >
          {this.renderBaseInfo()}
          {emptyView}
          {this.renderDescs()}
          <Sep height={40} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  addrTitle: {
    fontSize: 18,
    color: Global.colors.FONT_GRAY,
    marginTop: 5,
  },
  addr: {
    fontSize: 14,
    lineHeight: 30,
  },
  button: {
    position: 'absolute',
    top: 8,
    right: 15,
    width: 70,
    height: 25,
  },
});

const mapStateToProps = state => ({
  nav: state.nav,
  hosp: state.base.currHospital,
});

export default connect(mapStateToProps)(Department);

// Department.navigationOptions = () => ({
// });
//
// export default Department;
