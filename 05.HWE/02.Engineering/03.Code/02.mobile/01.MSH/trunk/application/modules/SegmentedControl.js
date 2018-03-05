
var React = require('react-native');
var Global = require('../../Global');

import PropTypes from 'prop-types';

var {
  Text,
  TouchableOpacity,

} = React;

var SegmentedControl = React.createClass({

  statics: {
    title: 'SegmentedControl',
    description: '顶端网格菜单',
  },

  propTypes: {

    /**
     * 显示的菜单项
     * 必填
     */
    items: PropTypes.array.isRequired,

    /**
     * 默认被选中项的序列
     */
    selected: PropTypes.number,

    /**
     * 边框颜色
     */
    borderColor: PropTypes.string,

    /**
     * 未选中项的背景色
     */
    backgroundColor: PropTypes.string,

    /**
     * 未选中项的字体颜色
     */
    textColor: PropTypes.string,

    /**
     * 被选中项的背景色
     */
    activeBackgroundColor: PropTypes.string,

    /**
     * 被选中项的字体颜色
     */
    activeTextColor: PropTypes.string,

  },

  getStyles: function () {
    return {
      holder: {
        overflow: 'hidden',
        height: 28,
        flexDirection: 'row',
        backgroundColor: 'transparent',
      },

      item: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        height: 28,
        backgroundColor: this.props.backgroundColor,
        borderWidth: 1 / Global.pixelRatio,
        borderColor: this.props.borderColor,
        borderRightWidth: 0,
      },
      text: {
        fontSize: 12,
        color: this.props.textColor,
        backgroundColor: 'transparent',
      },

      activeItem: {
        backgroundColor: this.props.activeBackgroundColor,
      },
      activeText: {
        color: this.props.activeTextColor,
      },

      firstItem: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      },
      lastItem: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        borderRightWidth: 1 / Global.pixelRatio,
      },
    };
  },

  getInitialState: function () {
    return {
      selected: this.props.selected ? this.props.selected : 0,
    };
  },

  getDefaultProps: function () {
    return {
      borderColor: Global.colors.IOS_BLUE,
      backgroundColor: 'white',
      textColor: 'black',
      activeBackgroundColor: Global.colors.IOS_BLUE,
      activeTextColor: 'white',
    };
  },

  componentDidMount: function () {
  },

  /**
   * 组件接收参数变化
   */
  componentWillReceiveProps: function (props) {
    if (props.selected != this.state.selected)
      this.setState({selected: props.selected});
  },

  onPress: function (idx, text, onPress) {
    this.setState({selected: idx});
    if (typeof onPress == 'function')
      onPress(idx, text);
  },

  render: function () {

    var items = this.props.items.map(
      ({text, onPress}, idx) => {
        var itemStyle = this.state.selected == idx ? this.getStyles().activeItem : null;
        var textStyle = this.state.selected == idx ? this.getStyles().activeText : null;

        var firstItem = idx == 0 ? this.getStyles().firstItem : null;
        var lastItem = idx == this.props.items.length - 1 ? this.getStyles().lastItem : null;

        return (
          <TouchableOpacity key={'TGM_' + idx}
                            style={[Global.styles.CENTER, this.getStyles().item, itemStyle, firstItem, lastItem]}
                            onPress={(item) => this.onPress(idx, text, onPress)}>
            <Text style={[this.getStyles().text, textStyle]}>{text}</Text>
          </TouchableOpacity>
        );
      }
    );

    return (
      {items}
  </View>
  );
  },

  });

  module.exports = SegmentedControl;
