import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  InteractionManager,
} from 'react-native';

import Sep from 'rn-easy-separator';
import Card from 'rn-easy-card';
import { connect } from 'react-redux';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import ArchivesList from './ArchivesList';

class EditMyPatient extends Component {
  static displayName = 'EditMyPatient';
  static description = '编辑就诊人';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }
  static relation(relation) {
    if (relation !== '') {
      if (relation === '0') {
        return '本人';
      } else if (relation === '1') {
        return '父母';
      } else if (relation === '2') {
        return '夫妻';
      } else if (relation === '3') {
        return '子女';
      } else if (relation === '4') {
        return '其他';
      }
    } else {
      return '';
    }
  }
  static sex(gender) {
    if (gender !== '') {
      if (gender === '0') {
        return '女';
      } else if (gender === '1') {
        return '男';
      }
    } else {
      return '';
    }
  }
  constructor(props) {
    super(props);
    this.renderValue = this.renderValue.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    labelPosition: 'left',
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    // this.props.navigation.setParams({
    //   title: '编辑就诊人',
    // });
  }

  componentWillUnmount() {
  }

  form = null;
  renderValue() {
    const { relation, gender } = this.state.value;
    const re = EditMyPatient.relation(relation);
    const sex = EditMyPatient.sex(gender);
    const value = { ...this.state.value, relation: this.state.value.relation ? re : '', gender: this.state.value.gender ? sex : '' };
    return value;
  }
  render() {
    if (!this.state.doRenderScene) { return EditMyPatient.renderPlaceholderView(); }
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView style={styles.scrollView}>
          <Card>
            <Form
              ref={(c) => { this.form = c; }}
              labelWidth={65}
              onChange={this.onChange}
              value={this.renderValue()}
              labelPosition={this.state.labelPosition}
            >
              <Form.TextInput name="relation" label="关系" showClearIcon={false} editable={false} required />
              <Form.TextInput name="name" label="姓名" placeholder="请输入您的真实姓名" showClearIcon={false} editable={false} required />
              <Form.TextInput name="gender" label="性别" required showClearIcon={false} editable={false} />
              <Form.TextInput name="idNo" label="身份证号" placeholder="请输入身份证号码" showClearIcon={false} editable={false} idNo required />
              <Form.TextInput name="mobile" label="手机号码" placeholder="请输入手机号码" mobile showClearIcon={false} editable={false} required />
              <Form.TextInput name="address" label="联系地址" placeholder="请输入联系地址" address showClearIcon={false} editable={false} />
            </Form>
          </Card>
          <ArchivesList data={this.state.value} screenProps={this.props.screenProps} />
          <Sep height={40} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

export default connect(mapStateToProps)(EditMyPatient);
