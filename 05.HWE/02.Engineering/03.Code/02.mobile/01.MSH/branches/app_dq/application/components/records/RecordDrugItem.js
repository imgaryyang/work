import React, { PureComponent } from 'react';

import {
  View,
  Text,
  TouchableOpacity, StyleSheet,
} from 'react-native';

class RecordDrugItem extends PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.data, this.props.index);
  };
  render() {
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[{ flexDirection: 'row', paddingLeft: 20, padding: 7 }]}
      >
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }} >
          <View style={{ flex: 2, flexDirection: 'row' }} >
            <Text style={styles.titleText}>{this.props.data.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default RecordDrugItem;
