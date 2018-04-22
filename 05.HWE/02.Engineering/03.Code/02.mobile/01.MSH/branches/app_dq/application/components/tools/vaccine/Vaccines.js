/**
 * 疾病库
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import EasyIcon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const dismissKeyboard = require('dismissKeyboard');

import SearchInput from '../../../modules/SearchInput';
import Global from '../../../Global';

class Vaccines extends Component {
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
      this.renderToolBar = this.renderToolBar.bind(this);
      this.searchAll = this.searchAll.bind(this);
      this.searchRecent = this.searchRecent.bind(this);
      this.searchByKeyWords = this.searchByKeyWords.bind(this);
    }

    state = {
      doRenderScene: false,
      keyWords: '',
    };

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          doRenderScene: true,
        });
      });
    }
    /**
     * 渲染顶端工具栏
     */

    // 1.按照关键字 2.常见疾病搜索 3.按照部位
    searchAll() {
      this.props.navigation.navigate('VaccinesList', { type: '1' });
    }
    searchRecent() {
      this.props.navigation.navigate('VaccinesList', { type: '2' });
    }
    searchByKeyWords() {
      this.props.navigation.navigate('VaccinesList', { type: '3', keywords: this.state.keyWords });
    }
    renderToolBar() {
      return (
        <View style={Global.styles.TOOL_BAR.FIXED_BAR} >
          <SearchInput placeholder="请输入关键字" onSearch={this.searchByKeyWords} value={this.state.keyWords} onChangeText={value => this.setState({ keyWords: value })} />
        </View>
      );
    }
    render() {
      // 场景过渡动画未完成前，先渲染过渡场景
      if (!this.state.doRenderScene) {
        return Vaccines.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER_BG} >
          <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible="false" >
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always" >
            {/*  {this.renderToolBar()}*/}
              <TouchableOpacity
                style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
                onPress={this.searchAll}
              >
                <Text style={{ flex: 1, marginLeft: 15 }}>全部疫苗接种</Text>
                <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
              </TouchableOpacity>
              <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
              <TouchableOpacity
                style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
                onPress={this.searchRecent}
              >
                <Text style={{ flex: 1, marginLeft: 15 }}>新生儿疫苗接种</Text>
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

Vaccines.navigationOptions = {
  title: '疾病库',
};

export default Vaccines;
