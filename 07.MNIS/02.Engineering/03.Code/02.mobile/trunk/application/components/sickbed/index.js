/**
 * 床旁服务首页
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Sep from 'rn-easy-separator';

import Global from '../../Global';
import { setTabWSHeight } from '../../actions/base/BaseAction';
import Todo from '../todo/Todo';
import AppFuncs from '../common/AppFuncs';
import AreasAndPatients from '../common/AreasAndPatients';
import PatientInfo from '../common/PatientInfo';

class Sickbed extends Component {
  static displayName = 'Sickbed';
  static description = '床旁服务首页';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER]} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
  }

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onLayout(e) {
    // console.log('onLayout() in MainView:', e.nativeEvent.layout);
    this.props.setTabWSHeight(e.nativeEvent.layout.height);
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Sickbed.renderPlaceholderView();
    }

    const { auth } = this.props;
    const { user } = auth;
    const userRole = user ? user.role : null;
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} onLayout={this.onLayout} >
        <ScrollView style={styles.scrollView} >
          <AreasAndPatients />
          {/* <Sep height={15} />
          <PatientInfo />*/}
          <Sep height={15} />
          <Todo />
          <Sep height={15} />
          <AppFuncs userRole={userRole} mainMenu="sickbed" navigate={this.props.navigate} />
          <Sep height={15} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

Sickbed.navigationOptions = {
  headerTitle: '床旁服务',
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
  nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
  setTabWSHeight: height => dispatch(setTabWSHeight(height)),
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sickbed);
