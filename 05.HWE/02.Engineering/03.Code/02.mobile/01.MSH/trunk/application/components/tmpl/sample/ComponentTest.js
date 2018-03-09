
import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';

import { B, I, U, S } from 'rn-easy-text';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Picker from 'rn-easy-picker';
import Portrait from 'rn-easy-portrait';
import Sep from 'rn-easy-separator';

import Global from '../../../Global';
import DatePicker from '../../../modules/EasyDatePicker';

class ComponentTest extends Component {
  static displayName = 'ComponentTest';
  static description = '组件测试';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER]} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.clearLoading = this.clearLoading.bind(this);
  }

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: 'Private Modules',
    });
  }

  componentWillUnmount() {
    if (this.loadingTimer) clearTimeout(this.loadingTimer);
  }

  loadingTimer = null;

  clearLoading() {
    this.timer = setTimeout(
      () => {
        this.props.screenProps.hideLoading();
      },
      3000,
    );
  }

  render() {
    if (!this.state.doRenderScene) return ComponentTest.renderPlaceholderView();

    const picker1DS = [
      { label: 'Java', value: '1' },
      { label: 'C++', value: '2' },
      { label: 'C#', value: '3' },
      { label: 'Javascript', value: '4' },
      { label: 'Html', value: '5' },
      { label: 'CSS', value: '6' },
      { label: 'Ruby', value: '7' },
      { label: 'Basic', value: '8' },
      { label: 'Go', value: '9' },
      { label: 'Objective C', value: '10' },
      { label: 'SQL', value: '11' },
      { label: 'Visual Basic', value: '12' },
      { label: 'VBScript', value: '13' },
    ];

    const picker2DS = [
      { label: 'Microsoft', value: '1' },
      { label: 'IBM', value: '2' },
      { label: 'Apple', value: '3' },
      { label: 'Google', value: '4' },
      { label: 'Facebook', value: '5' },
      { label: 'Cisco', value: '6' },
    ];

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <ScrollView style={styles.scrollView} >

          <View style={styles.fieldset}>
            <Text>lib.EasyCard</Text>
          </View>
          <Card fullWidth >
            <Text>content in EasyCard</Text>
          </Card>

          <View style={styles.fieldset}>
            <Text>lib.EasyButton</Text>
          </View>

          <Card radius={8} style={{ margin: 20 }} >
            <Button
              text="保存"
              style={{ marginTop: 10 }}
              onPress={() => {
                console.log('do save.....');
                this.setState({ btn2Disabled: !this.state.btn2Disabled });
              }}
            />

            <Button
              text="测试吧"
              theme={Button.THEME.ORANGE}
              disabled={this.state.btn2Disabled}
              outline
              size="small"
              style={{ marginTop: 10 }}
              onPress={() => {
                console.log('do test.....');
              }}
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }} >
              <Button
                text="显示遮罩"
                theme={Button.THEME.ORANGE}
                disabled={this.state.btn2Disabled}
                onPress={() => {
                  this.props.screenProps.showLoading();
                  this.clearLoading();
                }}
              />
              <Sep width={10} />
              <Button
                text="测试吧2"
                disabled={this.state.btn2Disabled}
                onPress={() => {
                  this.props.screenProps.hideLoading();
                }}
              />
            </View>

            <Button
              text="测试吧"
              style={{ marginTop: 10, flexDirection: 'row' }}
              onPress={() => {
                this.props.navigation.navigate('ChooseHospital', {
                  chooseHospital: (hosp) => {
                    console.log('you choosed this hospital:', hosp);
                  },
                });
              }}
            >
              <Icon name="md-flag" size={25} width={50} height={25} color="#ffffff" />
              <Text style={{
                  flex: 1, color: '#ffffff', marginRight: 17, textAlign: 'center',
                }}
              >
                选择医院
              </Text>
            </Button>

            <Button
              text="测试吧"
              style={{
                marginTop: 10, width: 170, height: 80, borderRadius: 12,
              }}
              onPress={() => {
                console.log('do test zzz.....');
              }}
            >
              <Icon name="md-flag" size={28} width={30} height={40} color="#ffffff" />
              <Text style={{ color: '#ffffff', height: 30, fontSize: 20 }} >达盖尔的旗帜</Text>
            </Button>
          </Card>

          <View style={styles.fieldset}>
            <Text>lib.EasyIcon</Text>
          </View>

          <Card style={{ margin: 10 }} >
            <View style={{ flexDirection: 'row' }} >
              <Icon name="ios-card" />
              <Sep width={15} />
              <Icon iconLib="fa" name="gitlab" />
              <Sep width={15} />
              <Icon iconLib="FontAwesome" name="gitlab" color="#ffffff" bgColor={Global.colors.IOS_RED} size={18} width={30} height={30} radius={5} />
              <Sep width={15} />
              <Icon iconLib="mi" name="android" color="#ffffff" bgColor={Global.colors.IOS_RED} size={20} width={40} height={40} radius={20} />
              <Sep width={15} />
              <Icon iconLib="fd" name="social-reddit" color={Global.colors.IOS_RED} borderColor={Global.colors.IOS_RED} borderWidth={1 / Global.pixelRatio} size={25} width={40} height={40} radius={20} />
              <Sep width={15} />
              <Icon iconLib="oi" name="bug" color="white" bgColor="rgba(254, 0, 0, .5)" size={25} width={40} height={40} radius={7} />
            </View>
          </Card>

          <Card style={{ margin: 10 }} >
            <View style={{ flexDirection: 'row' }} >
              <Icon name="ios-bulb" size={38} color="white" width={60} height={60} bgColor="rgba(255,102,0,1)" />
              <Sep width={25} />
              <Icon name="ios-water" size={35} color="white" width={60} height={60} bgColor="rgba(0,122,255,1)" />
              <Sep width={25} />
              <Icon name="md-flame" size={35} color="white" width={60} height={60} bgColor="rgba(255,59,48,1)" />
              <Sep width={25} />
            </View>
          </Card>

          <View style={styles.fieldset}>
            <Text>lib.EasyPicker</Text>
          </View>

          <Card style={{ margin: 10 }} >
            <Picker
              ref={(c) => { this.easyPicker1 = c; }}
              dataSource={picker1DS}
              selected={this.state.skill}
              onChange={(selected) => {
                this.setState({
                  skill: selected ? selected.label : null,
                });
              }}
              center
            />
            <Picker
              ref={(c) => { this.easyPicker2 = c; }}
              dataSource={picker2DS}
              selected={this.state.co}
              onChange={(selected) => {
                this.setState({
                  co: selected ? selected.label : null,
                });
              }}
            />

            <View style={{ flexDirection: 'row' }} >
              <Button
                text={this.state.skill ? this.state.skill : 'Pick Skill'}
                outline
                onPress={() => this.easyPicker1.toggle()}
              />
              <Sep width={10} />
              <Button
                text={this.state.co ? this.state.co : 'Pick Co.'}
                outline
                onPress={() => this.easyPicker2.toggle()}
              />
            </View>

          </Card>

          <View style={styles.fieldset}>
            <Text>lib.EasyDatePicker</Text>
          </View>

          <Card style={{ margin: 10 }} >
            <DatePicker ref={(c) => { this.easyDatePicker = c; }} />

            <View style={{ flexDirection: 'row' }} >
              <Button
                text="Pick Date"
                outline
                onPress={() => {
                  this.easyDatePicker.pickDate({
                    date: new Date(),
                  }, (date) => {
                    console.log(`-----onPicked in ComponentTest : ${
                       date.toLocaleDateString()
                       }${date.toLocaleTimeString()}`);
                  });
                }}
              />
              <Sep width={10} />
              <Button
                text="Pick Time"
                outline
                onPress={() => {
                  this.easyDatePicker.pickTime({
                    hour: 11,
                    minute: 11,
                    is24Hour: true,
                  }, (date) => {
                    console.log(`-----onPicked in ComponentTest : ${
                       date.toLocaleDateString()
                       }${date.toLocaleTimeString()}`);
                  });
                }}
              />
              <Sep width={10} />
              <Button
                text="Pick DateTime"
                outline
                onPress={() => {
                  this.easyDatePicker.pickDateTime({
                    date: new Date(),
                  }, (date) => {
                    console.log(`-----onPicked in ComponentTest : ${
                       date.toLocaleDateString()
                       }${date.toLocaleTimeString()}`);
                  });
                }}
              />
            </View>
          </Card>


          <View style={styles.fieldset}>
            <Text>lib.EasyText</Text>
          </View>

          <Card radius={8} style={{ margin: 10 }} >
            <Text><B>粗体、斜体及下划线</B></Text>
            <Text>As long as the world shall last there will be <U>wrongs</U>, and if no man rebelled, <B>those wrongs would last forever</B>. （ <I>C. Darrow</I> ）</Text>
          </Card>

          <Card radius={8} style={{ margin: 10, backgroundColor: Global.colors.FONT_LIGHT_GRAY1 }} >
            <Text><B>阴影</B></Text>
            <Text style={{ fontSize: 17, color: 'white' }} ><S>波多野结衣</S></Text>
          </Card>

          <View style={styles.fieldset}>
            <Text>lib.EasyPortrait</Text>
          </View>

          <Card radius={8} style={{ margin: 10, flexDirection: 'row' }} >
            <Portrait imageSource={require('../../../../assets/images/user/u0002.jpg')} bgColor={Global.colors.IOS_GRAY_BG} width={50} height={50} radius={7} />
            <Sep width={20} />
            <Portrait imageSource={require('../../../../assets/images/user/u0003.jpg')} bgColor={Global.colors.IOS_GRAY_BG} width={50} height={50} radius={25} />
          </Card>

          <Button
            text="Push Test"
            theme={Button.THEME.ORANGE}
            size="small"
            outline
            style={{ margin: 10 }}
            onPress={() => this.props.navigation.navigate('ComponentTest')}
          />

          <Sep height={100} />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    lineHeight: 14,
    paddingLeft: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  fieldset: {
    borderLeftWidth: 4,
    borderLeftColor: Global.colors.IOS_GREEN,
    paddingLeft: 10,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10,
    height: 30,
    // alignItems: 'center',
    justifyContent: 'center',
  },
});

ComponentTest.navigationOptions = {
};

export default ComponentTest;

