/**
 * 退款缴费
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Global from '../../Global';
import PlaceholderView from '../../modules/PlaceholderView';

class CompleteRefundFailure extends Component {
  static displayName = 'CompleteRefundFailure';
  static description = '退款失败界面';

  constructor(props) {
    super(props);

    this.gotoRoot = this.gotoRoot.bind(this);
    this.goto = this.gotoRoot.bind(this);

    this.state = {
      doRenderScene: false,
      data: [],
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ doRenderScene: true }));
    this.props.navigation.setParams({
      title: '完成',
    });
  }

  gotoRoot() {
    // 返回首页
    this.props.navigation.goBack(this.props.nav.routes[1].key);
  }

  gotoAppointRecords() {
    this.props.navigation.navigate('AppAndRegRecords');
  }

  render() {
    const { doRenderScene } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <View style={Global.styles.CONTAINER}>
        <View style={styles.info}>
          <Icon name="ios-checkmark-circle-outline" color={Global.colors.IOS_BLUE} size={175} width={175} height={175} />
          <Text style={styles.infoText}>完成</Text>
          <Button
            text="返回首页"
            style={styles.button}
            textStyle={styles.buttonText}
            outline
            onPress={this.gotoRoot}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
  },
  button: {
    flex: 0,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: 120,
  },
  buttonText: {
    fontSize: 15,
  },
});

CompleteRefundFailure.navigationOptions = { title: '退款失败' };

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(CompleteRefundFailure);
