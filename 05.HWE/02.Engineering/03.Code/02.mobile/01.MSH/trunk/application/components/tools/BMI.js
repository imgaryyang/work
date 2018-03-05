/**
 * BMI自查
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Global from '../../Global';
import Form from '../../modules/form/EasyForm';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';

import Toast from 'react-native-root-toast';
import { login } from '../../services/base/AuthService';

class BMI extends Component {
  static displayName = 'BMI';
  static description = 'BMI自查';

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
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cal = this.cal.bind(this);
    this.getPosition = this.getPosition.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    BMI: '',
    modalVisible: false,
    position: { marginLeft: 500 },

  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }


  async getPosition(resul) {
    let position = 0;
    let color = 'red';
    if (resul >= 0 && resul <= 18.5) {
      position = ((resul * 190) / 18.5) - 330;
      color = 'rgba(254,208,116,1)';
    }
    if (resul > 18.5 && resul <= 23.9) {
      position = (((resul - 18.5) * 190) / 5.4) - 140;
      color = 'rgba(155,211,96,1)';
    }
    if (resul > 23.9 && resul <= 27.9) {
      position = (((resul - 23.9) * 95) / 4) + 50;
      color = 'rgba(101,152,216,1)';
    }
    if (resul >= 28) {
      position = (((resul - 28) * 180) / 72) + 145;
      color = 'rgba(254,96,96,1)';
    }
    position = await parseInt(position);
    await this.setState({ BMI: resul, position: { marginLeft: position } });
  }
  async cal() {
    const h = this.state.value.hight;
    const w = this.state.value.wight;
    const rh = parseInt(h) / 100;
    console.log(rh);
    const BMI = w / (rh * rh);
    await this.getPosition(BMI.toFixed(2));
    if (isNaN(this.state.BMI)) {
      Toast.show('您还没有输入哦');
    } else {
      await this.setState({ modalVisible: true });
    }
  }
  submit() {
    this.cal();
  }
  render() {
    console.log(this.state.BMI.isNaN);
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return BMI.renderPlaceholderView();
    }
    const min = '体重过低 < 18.5';
    const normal = '体重正常  18.5~23.9';
    const over = '体重超重 24.0~ 27.9';
    const very = '肥胖 > 28.0';
    /* const result = () => {
      return ();
    };*/

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
          <Card fullWidth noPadding style={{ padding: 5, borderTopWidth: 0 }} >
            <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.value} >
              <Form.TextInput
                name="hight"
                dataType="int"
                placeholder="请输入您的身高"
                autoFocus
                required
                leftComponent={(<Text style={{ marginLeft: 20 }}>身高：</Text>)}
                rightComponent={(<Text style={{ marginRight: 20, fontSize: 12, color: Global.colors.FONT_LIGHT_GRAY }}>CM(厘米)</Text>)}
              />
              <Form.TextInput
                name="wight"
                placeholder="请输入您的体重"
                maxLength={16}
                minLength={6}
                leftComponent={(<Text style={{ marginLeft: 20 }}>体重：</Text>)}
                rightComponent={(<Text style={{ marginRight: 20, fontSize: 12, color: Global.colors.FONT_LIGHT_GRAY }}>KG(公斤)</Text>)}
                required
              />
            </Form>

            <View style={{ flexDirection: 'row', margin: 10 }} >
              <Button text="BMI计算" onPress={this.submit} disabled={this.state.buttonDisabled} />
            </View>
          </Card>
          {/* <View style={styles.card} >
            { this.state.modalVisible ? result() : null}
          </View>*/}
          <View style={{ marginTop: 15, flex: 1 }} >
            <Card fullWidth >
              <Text style={styles.bmi}>您的BMI值是: {this.state.BMI}</Text>
              <Icon name="ios-arrow-round-down" size={30} color={this.state.position.bgColor} style={this.state.position} />
              <View style={styles.image} >
                <Text style={[styles.normal, { backgroundColor: 'rgba(254,208,116,1)' }]}>体重过低</Text>
                <Text style={[styles.normal, { backgroundColor: 'rgba(155,211,96,1)' }]}>体重正常</Text>
                <Text style={styles.aa}>超重</Text>
                <Text style={[styles.normal, { backgroundColor: 'rgba(254,96,96,1)' }]}>肥胖</Text>
              </View>
              <Text style={[styles.bmi1, { paddingTop: 20 }]}>{min}</Text>
              <Text style={styles.bmi1}>{normal}</Text>
              <Text style={styles.bmi1}>{over}</Text>
              <Text style={styles.bmi1}>{very}</Text>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.colors.IOS_GRAY_BG,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
  },
  bmi: {
    fontSize: 15,
    flex: 1,

  },
  bmi1: {
    alignItems: 'center',
    fontSize: 12,
    flex: 1,

  },
  image: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Global.getScreen().width - 30,
    borderRadius: 4,
    overflow: 'hidden',
  },
  normal: {
    color: 'white',
    flex: 2,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
  },
  aa: {
    backgroundColor: 'rgba(101,152,216,1)',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
  },
});


BMI.navigationOptions = {
  title: 'BMI自查',
};

export default BMI;
