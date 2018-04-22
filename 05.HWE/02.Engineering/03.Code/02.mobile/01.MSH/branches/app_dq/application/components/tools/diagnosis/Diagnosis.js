/**
 * 疾病库
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Button from 'rn-easy-button';
import EasyIcon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SearchInput from '../../../modules/SearchInput';
import Global from '../../../Global';

const dismissKeyboard = require('dismissKeyboard');

class Diagnosis extends Component {
  static displayName = 'Diagnosis';
  static description = '疾病库';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.searchCommon = this.searchCommon.bind(this);
    this.searchByPart = this.searchByPart.bind(this);
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

  // 1.按照关键字 2.常见疾病搜索 3.按照部位
  searchCommon() {
    this.props.navigation.navigate('DiagnosisList', { type: '2' });
  }
  searchByPart() {
    this.props.navigation.navigate('PartList');
  }


  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Diagnosis.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER_BG} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible="false" >
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" >

            <TouchableOpacity
              style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
              onPress={this.searchCommon}
            >
              <Text style={{ flex: 1, marginLeft: 15 }}>常见疾病</Text>
              <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
            </TouchableOpacity>
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
            <TouchableOpacity
              style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
              onPress={this.searchByPart}
            >
              <Text style={{ flex: 1, marginLeft: 15 }}>按部位查询</Text>
              <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
            </TouchableOpacity>
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

Diagnosis.navigationOptions = {
  title: '疾病库',
};

export default Diagnosis;
