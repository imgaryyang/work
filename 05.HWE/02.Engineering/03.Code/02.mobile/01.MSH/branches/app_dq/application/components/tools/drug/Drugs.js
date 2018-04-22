/**
 * 药品库
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import EasyIcon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import Global from '../../../Global';

class Drugs extends Component {
  static displayName = 'Drugs';
  static description = '药品库';

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
    this.searchByType = this.searchByType.bind(this);
    this.searchRrecueDrug = this.searchRrecueDrug.bind(this);
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
  // 1.常见药品分类搜索 2.药品分类
  searchCommon() {
    this.props.navigation.navigate('CommonDrugType', { type: '1' });
  }
  // 按照药品分类搜索
  searchByType() {
    this.props.navigation.navigate('MutilDrugType');
  }

  searchRrecueDrug() {
    this.props.navigation.navigate('DrugList', {
      type: '2',
      item: { classificationName: '抢救药物' },
    });
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Drugs.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER_BG} >
        <ScrollView style={styles.scrollview} >
          <TouchableOpacity
            style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
            onPress={this.searchCommon}
          >
            <Text style={{ flex: 1, marginLeft: 15 }}>常见药品</Text>
            <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
          </TouchableOpacity>
          <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
          <TouchableOpacity
            style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
            onPress={this.searchByType}
          >
            <Text style={{ flex: 1, marginLeft: 15 }}>药品分类</Text>
            <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
          </TouchableOpacity>
          <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
          {/*  <TouchableOpacity
            style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
            onPress={this.searchByPart}
          >
            <Text style={{ flex: 1, marginLeft: 15 }}>用药须知</Text>
            <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
          </TouchableOpacity>*/}
          <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
          <TouchableOpacity
            style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
            onPress={this.searchRrecueDrug}
          >
            <Text style={{ flex: 1, marginLeft: 15 }}>抢救药物</Text>
            <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
          </TouchableOpacity>
          <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
          <View height={40} />
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

Drugs.navigationOptions = {
  title: '药品库',
};

export default Drugs;
