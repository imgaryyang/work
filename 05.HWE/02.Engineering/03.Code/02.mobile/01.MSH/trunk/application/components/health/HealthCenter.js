/**
 * 健康中心
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import {
  VictoryChart,
  VictoryTheme,
  VictoryPolarAxis,
  VictoryBar,
} from 'victory-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';

import Global from '../../Global';

class HealthCenter extends Component {
  static displayName = 'HealthCenter';
  static description = '健康中心';

  static navigationOptions = () => ({
    title: '健康中心',
  });

  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
  }

  state = {
    doRenderScene: false,
    placeholderLayouted: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onLayout(e) {
    if (!this.state.placeholderLayouted) {
      console.log('centerWsHeight', e.nativeEvent.layout.height);
      Global.setLayoutScreen({
        tabWSHeight: e.nativeEvent.layout.height,
      });
      this.setState({ placeholderLayouted: true });
    }
  }

  // directions = {
  //   0: 'E', 45: 'NE', 90: 'N', 135: 'NW',
  //   180: 'W', 225: 'SW', 270: 'S', 315: 'SE',
  // };
  // orange = { base: 'gold', highlight: 'darkOrange' };
  // red = { base: 'tomato', highlight: 'orangeRed' };
  innerRadius = 20;

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} onLayout={this.onLayout} >
        <ActivityIndicator />
      </View>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene || !this.state.placeholderLayouted) {
      return this.renderPlaceholderView();
    }
    const { auth } = this.props;
    if (!auth.isLoggedIn) {
      return (
        <View style={[Global.styles.CONTAINER, Global.styles.CENTER]} >
          <View style={{ width: Global.getScreen().width, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }} >
            <Text style={{ textAlign: 'center', color: Global.colors.FONT_GRAY, fontSize: 16 }} >请登录系统获取您的健康指数</Text>
            <Button
              text="登录系统"
              outline
              stretch={false}
              style={{ width: 245, height: 30, marginTop: 30 }}
              onPress={() => this.props.navigate({ component: 'Login' })}
            />
          </View>
        </View>
      );
    }

    const { tabWSHeight } = Global.getScreen();
    const chartHeight = tabWSHeight - 38 - 140 - 45;
    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <View style={{ padding: 20, paddingBottom: 0, height: 38 }} >
            <Text style={{ fontSize: 16 }} >我的健康指数</Text>
          </View>
          <View style={{ flexDirection: 'row' }} >
            <View style={{ flex: 1 }} >
              <VictoryChart
                polar
                theme={VictoryTheme.material}
                innerRadius={this.innerRadius}
                width={Global.getScreen().width}
                height={chartHeight}
                padding={30}
              >
                {
                  ['intelligence', 'strength', 'speed', 'stealth', 'charisma'].map((d, i) => {
                    return (
                      <VictoryPolarAxis
                        dependentAxis
                        key={`ChartItem_${i + 1}`}
                        label={d}
                        labelPlacement="perpendicular"
                        style={{ tickLabels: { fill: 'none' } }}
                        axisValue={i}
                      />
                    );
                  })
                }
                <VictoryBar
                  style={{ data: { fill: 'orange', width: 30 } }}
                  data={[
                    { x: 0, y: 10 },
                    { x: 1, y: 25 },
                    { x: 2, y: 40 },
                    { x: 3, y: 50 },
                    { x: 4, y: 50 },
                  ]}
                />
              </VictoryChart>
            </View>
          </View>
          <View style={{ paddingLeft: 10, paddingRight: 10 }} >
            <Button
              style={[styles.btn]}
              onPress={() => {
                this.props.navigate({ component: 'Records' });
              }}
              theme={Button.THEME.BLUE}
              outline
            >
              <Icon name="ios-list-box-outline" size={35} width={70} height={35} color={Global.colors.FONT_GRAY} />
              <Text style={styles.btnText} >
                我的就诊记录
              </Text>
            </Button>
            <Button
              style={[styles.btn, { marginTop: 10 }]}
              onPress={() => {
                this.props.navigate({ component: 'Reports' });
              }}
              theme={Button.THEME.BLUE}
              outline
            >
              <Icon name="ios-flask-outline" size={35} width={70} height={35} color={Global.colors.FONT_GRAY} />
              <Text style={styles.btnText} >
                我的检验报告
              </Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  btn: {
    flexDirection: 'row', height: 60, paddingRight: 70,
  },
  btnText: {
    flex: 1, color: Global.colors.FONT_GRAY, fontSize: 18, textAlign: 'center',
  },
});

HealthCenter.navigationOptions = {
  header: null,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(HealthCenter);
