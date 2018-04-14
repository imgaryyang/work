/**
 * 退款完成
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

class CompleteRefundSuccess extends Component {
  static displayName = 'CompleteRefundSuccess';
  static description = '退款成功界面';

  constructor(props) {
    super(props);

    this.gotoRoot = this.gotoRoot.bind(this);
    this.goto = this.gotoRoot.bind(this);

    this.state = {
      doRenderScene: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ doRenderScene: true }));
    this.props.navigation.setParams({
      title: '退款成功',
    });
  }

  gotoRoot() {
    // 返回首页
    this.props.navigation.goBack(this.props.nav.routes[1].key);
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
          <Text style={styles.infoText}>退款成功</Text>
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
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: 180,
  },
  buttonText: {
    fontSize: 15,
  },
});

CompleteRefundSuccess.navigationOptions = { title: '退款成功' };

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(CompleteRefundSuccess);
