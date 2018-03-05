/**
 * 说明
 */

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Global from '../Global';
import RootNavigation from './RootNavigation';
import LoadingView from '../modules/Loading';
import { showLoading, setCurrLocation, resetBackNavigate } from '../actions/base/BaseAction';

class MainView extends Component {
  render() {
    // console.log('>>>>> this.props.base in MainView:', this.props.base);
    return (
      <View style={{ flex: 1, height: Global.getScreen().height }} >
        <RootNavigation
          showLoading={this.props.showLoading}
          resetBackNavigate={this.props.resetBackNavigate}
          getCurrentLocation={compCallBack => this.getCurrentLocation(this.props.setCurrLocation, compCallBack)}
          switchEdition={this.switchEdition}
        />
        <LoadingView visible={this.props.base.loadingVisible} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  showLoading: visible => dispatch(showLoading(visible)),
  setCurrLocation: location => dispatch(setCurrLocation(location)),
  resetBackNavigate: (backIndex, routeName, params) => dispatch(resetBackNavigate(backIndex, routeName, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
