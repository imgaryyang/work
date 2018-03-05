import React, { Component, PureComponent } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  InteractionManager,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Card from 'rn-easy-card';
import moment from 'moment/moment';
import Sep from 'rn-easy-separator';
import EasyIcon from 'rn-easy-icon';

import Global from '../../Global';
import Form from '../../modules/form/EasyForm';
import FormConfig from '../../modules/form/config/LineInputsConfig';


class DiagnoseDetails extends Component {
  static displayName = 'DiagnoseDetails';
  static description = '医生诊断详情';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    // console.log('.....:', props);
    super(props);
  }

  state = {
    doRenderScene: false,
    showLabel: true,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '医生诊断详情',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  render() {
    // console.log('......:', this.props);
    if (!this.state.doRenderScene) { return DiagnoseDetails.renderPlaceholderView(); }
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          <Card radius={7} style={{ margin: 20, padding: 10 }}>
            <Form
              ref={(c) => { this.form = c; }}
              config={FormConfig}
              showLabel={this.state.showLabel}
              labelPosition={this.state.labelPosition}
              labelWidth={100}
              value={this.state.value}
            >
              <Form.TextInput name="depName" label="科室" placeholder="暂无" showClearIcon={false} editable={false} />
              <Form.TextInput name="docName" label="就诊医生" placeholder="暂无" showClearIcon={false} editable={false} />
              <Form.TextInput name="diseaseType" label="诊断类型" placeholder="暂无" showClearIcon={false} editable={false} />
              <Form.TextInput name="diseaseTime" label="诊断时间" placeholder="暂无" showClearIcon={false} editable={false} />
              <Form.TextInput name="diseaseName" label="诊断描述" placeholder="暂无" showClearIcon={false} editable={false} />
              <Form.TextInput name="isCurrent" label="主要诊断" placeholder="暂无" showClearIcon={false} editable={false} />
            </Form>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

// DiagnoseDetails.navigationOptions = {
//   headerTitle: '医生诊断详情',
// };

export default DiagnoseDetails;
