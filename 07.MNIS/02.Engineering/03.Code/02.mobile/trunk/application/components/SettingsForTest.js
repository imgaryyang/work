/**
 * 系统设置
 * 1、后台连接及后台超时
 */

import React, {
  Component,
} from 'react';

import {
  View,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';
import Button from 'rn-easy-button';

import Global from '../Global';

import Form from '../modules/form/EasyForm';

class SettingsForTest extends Component {
  static displayName = 'SettingsForTest';
  static description = '设置';

  static navigationOptions = () => ({
    title: '设置',
  });

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: 'white' }]} />
    );
  }

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {
      host: Global.host,
      hostTimeout: `${Global.hostTimeout}`,
    },
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillUnmount() {
    dismissKeyboard();
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  form = null;

  async save() {
    if (this.form.validate()) {
      try {
        console.log(this.state.value);
        await Global.setHost(this.state.value.host);
        await Global.setHostTimeout(parseFloat(this.state.value.hostTimeout));
        Toast.show('保存配置信息成功！');
        this.props.navigation.goBack();
      } catch (e) {
        Toast.show('保存配置信息失败！');
        console.warn(e);
      }
    }
  }

  render() {
    if (!this.state.doRenderScene) { return SettingsForTest.renderPlaceholderView(); }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: 'white' }]} >
        <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
          <Form
            ref={(c) => { this.form = c; }}
            showLabel
            labelPosition="top"
            labelWidth={100}
            onChange={this.onChange}
            value={this.state.value}
          >

            <Form.TextInput name="host" label="后台地址" required />
            <Form.TextInput name="hostTimeout" label="连接超时时间(毫秒)" dataType="number" required />

          </Form>

          <View style={{
              flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
            }}
          >
            <Button text="保存" onPress={this.save} />
          </View>

        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default SettingsForTest;
