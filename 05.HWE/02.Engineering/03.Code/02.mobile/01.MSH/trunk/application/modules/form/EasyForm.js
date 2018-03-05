
/**
 * EasyForm
 */
import React, {
  Component,
} from 'react';

import {
  View,
} from 'react-native';

import PropTypes from 'prop-types';
import dftConfig from './config/DefaultConfig';

import EasyTextInputField from './EasyTextInputField';
import EasyPickerField from './EasyPickerField';
import EasyCheckboxField from './EasyCheckboxField';
import EasySwitchField from './EasySwitchField';
import EasyDatePickerField from './EasyDatePickerField';

class EasyFrom extends Component {
  static TextInput = EasyTextInputField;
  static Picker = EasyPickerField;
  static Checkbox = EasyCheckboxField;
  static Switch = EasySwitchField;
  static Date = EasyDatePickerField;
  static displayName = 'EasyFrom';
  static description = 'EasyFrom Component';

  _form = null;
  _fields = [];
  _realTextInputs = [];

  static propTypes = {

    /**
     * form configuration
     * default to config/DefaultConfig
     */
    config: PropTypes.object,

    /**
     * 是否显示标签，如果传入将覆盖对应配置项
     */
    showLabel: PropTypes.bool,

    /**
     * 标签宽度，如果传入将覆盖对应配置项
     */
    labelWidth: PropTypes.number,

    /**
     * 标签位置，如果传入将覆盖对应配置项
     */
    labelPosition: PropTypes.string,

    /**
     * 整个表单的onChange事件
     */
    onChange: PropTypes.func,

    /**
     * init value
     */
    value: PropTypes.object,
  };

  static defaultProps = {
    config: dftConfig,
  };

  constructor(props) {
    super(props);
    // console.log(this.props.config);

    this.registerChild = this.registerChild.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.validate = this.validate.bind(this);
  }

  state = {};

  /**
   * register all child fields
   */
  registerChild(fieldName, child, type) {
    // console.log('child');
    if (type === '1') { // 注册EasyTextInputField
      this._fields[this._fields.length] = child;
      this[fieldName] = child;
    } else if (type === '2') { // 注册real TextInput
      this._realTextInputs[this._realTextInputs.length] = child;
    }
  }

  /**
   * onChange function of the form, any form child change value will trigger this function
   * @param  {[string]} fieldName  [event target]
   * @param  {[object]} fieldValue [value of event target]
   */
  onChange(fieldName, fieldValue) {
    let value = this.props.value;
    value = value || {};
    value[fieldName] = fieldValue;
    if (this.props.onChange) { this.props.onChange(fieldName, fieldValue, value); }
  }

  /**
   * 表单校验
   */
  validate() {
    // console.log('in form validate.');
    let rtn = true;
    for (const field of this._fields) {
      // console.log(field);
      if (!field.validate()) { rtn = false; }
    }
    return rtn;
  }

  /**
   * 渲染子对象
   */
  renderChildren() {
    const config = this.props.config;

    if (this.props.showLabel === true || this.props.showLabel === false) config.fields.label.showLabel = this.props.showLabel;
    if (this.props.labelWidth) config.fields.label.width = this.props.labelWidth;
    if (this.props.labelPosition) config.fields.label.position = this.props.labelPosition;

    const onChange = this.onChange;
    const registerChild = this.registerChild;

    let children = this.props.children;
    if (!Array.isArray(children)) { children = [children]; }

    return children.map((item, idx) => {
      if (!item) { return null; }

      const key = `from_items_${idx}`;

      if (item.type.displayName === '_EasyTextInputField_'
          || item.type.displayName === '_EasyPickerField_'
          || item.type.displayName === '_EasyCheckboxField_'
          || item.type.displayName === '_EasySwitchField_'
          || item.type.displayName === '_EasyDatePickerField_') {
        const value = this.props.value ? (
          typeof this.props.value[item.props.name] === 'undefined' ? null : this.props.value[item.props.name]
        ) : null;
        return React.cloneElement(item, {
          key, config, onChange, registerChild, value,
        });
      } else { return React.cloneElement(item, { key }); }
    });
  }

  render() {
    // console.log(this.props.children);
    // console.log(this.props.config.style);
    return (
      <View
        ref={(c) => { this._form = c; }}
        style={[this.props.config.style]}
      >
        {this.renderChildren()}
      </View>
    );
  }
}

export default EasyFrom;

