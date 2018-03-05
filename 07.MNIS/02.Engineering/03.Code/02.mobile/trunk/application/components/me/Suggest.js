/**
 * 反馈意见
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  InteractionManager,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import Global from '../../Global';
import { submit } from '../../services/me/FeedBackService';

class Suggest extends Component {
  static displayName = 'Suggest';
  static description = '反馈意见';

  static navigationOptions = () => ({
    title: '反馈意见',
  });

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.changeFeedBack = this.changeFeedBack.bind(this);
    this.doSave = this.doSave.bind(this);
    this.goPop = this.goPop.bind(this);
    this.showLoading = this.showLoading.bind(this);
  }

  state = {
    doRenderScene: false,
    // data: null,
    feedback: null,
    loading: false,
    // connect: null,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillReceiveProps() {

  }
  showLoading() {
    this.setState({
      loading: true,

    });
  }
  // 保存反馈意见
  async doSave() {
    this.showLoading();
    this.setState({
      loaded: false,
      fetchForbidden: false,
    });
    const data = {
      feedback: this.state.feedback, appId: '8a8c7db154ebe90c0154ebfdd1270004', hospId: '123', userId: Global.user.id,
    };
    try {
      const responseData = await submit(data);
      // this.hideLoading();
      if (responseData.success === false) {
        Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
                this.setState({ value: {} });
              },
            },
          ],
        );
      } else {
        Toast.show('保存成功！');
        // UserAction.onUpdateUser(responseData.result);
        this.goPop();
        // this.props.navigator.popToTop();
      }
    } catch (e) {
      // this.hideLoading();
      this.handleRequestException(e);
    }
  }
  refresh() {
    this.setState({
      // data: null,
      feedback: null,
      // connect: null,
    });
  }
  changeFeedBack(value) {
    this.setState({
      feedback: value,
    });
  }

  goPop() {
    this.props.navigation.goBack();
  }

  render() {
    if (!this.state.doRenderScene) { return Suggest.renderPlaceholderView(); }
    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <View style={Global.styles.PLACEHOLDER20} />
          <View>
            <Text style={styles.text}>反馈意见:</Text>
            <View style={Global.styles.PLACEHOLDER20} />
            <View style={[styles.viewInputHolder]}>
              <TextInput
                style={[styles.rowInput]}
                multiline
                maxLength={500}
                onChangeText={(value) => { this.changeFeedBack(value); }}
                placeholder="您好，请你描述你遇到的问题，或提出你宝贵的意见，我们将有专人及时与你联系！"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <Separator height={20} />
          <View style={styles.buttonHolder} >
            <Button text="取消" onPress={this.goPop} theme={Button.THEME.BLUE} />
            <Separator width={10} />
            <Button text="提交" onPress={this.doSave} theme={Button.THEME.BLUE} />
          </View>
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // backgroundColor: 'white',
    marginBottom: Global.os === 'ios' ? 48 : 0,
    padding: 10,
  },
  text: {
    fontSize: 14,
    width: 80,
    fontWeight: '500',
    color: 'rgba(93,93,93,1)',
  },
  rowInput: {
    flex: 1,
    fontSize: 14,
    backgroundColor: 'white',
    padding: 6,
  },
  viewInputHolder: {
    height: 120,
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.LINE,
    borderRadius: 5,
    overflow: 'hidden',
  },
  buttonHolder: {
    flexDirection: 'row',
  },
});

export default Suggest;
