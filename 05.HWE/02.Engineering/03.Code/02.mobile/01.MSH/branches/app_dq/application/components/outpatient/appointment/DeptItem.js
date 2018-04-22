import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'rn-easy-icon';
import Global from '../../../Global';

export default class Item extends PureComponent {
  onPress = () => {
    if (typeof this.props.onPress === 'function') {
      this.props.onPress(this.props.data, this.props.index);
    }
  };

  render() {
    const { selected, data } = this.props;
    const selectedItemStyle = selected ? { backgroundColor: 'white' } : null;
    const selectedTextStyle = selected ? { color: Global.colors.IOS_BLUE } : null;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[styles.item, selectedItemStyle]}
      >
        {
          selected ?
            <Icon name="md-arrow-dropright" size={16} color={Global.colors.IOS_BLUE} style={[null, styles.icon]} /> :
            null
        }
        <Text style={[styles.text, selectedTextStyle]} >{data.name || data}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 6,
  },
  item: {
    flex: 1,
    height: 45,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: Global.colors.FONT_GRAY,
  },
});
