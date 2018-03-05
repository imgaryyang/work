import React, { PureComponent } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';

import Global from '../../Global';
import Item from '../../modules/PureListItem';

class RecipeItem extends PureComponent {
  static displayName = 'RecipeItem';
  static description = '药物医嘱';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.renderDrugItem = this.renderDrugItem.bind(this);
  }


  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }
  /**
   * 渲染药品行数据
   */
  renderDrugItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        contentStyle={{ padding: 0 }}
      >
        <View style={{ flex: 1, margin: 15, marginLeft: 0 }} >
          <View style={[styles.itemRowContainer, styles.mainItemRowContainer]} >
            <Text style={{ flex: 1 }} >{item.name}{item.form ? ` ( ${item.form} )` : null}</Text>
            <Text style={styles.itemBarcode} >{item.barcode}</Text>
          </View>
          <View style={styles.itemRowContainer} >
            <Text style={{ flex: 1 }} ><Text style={styles.normalLabel} >剂量：</Text><Text style={styles.normalValue} >{item.dose}</Text></Text>
            <Text style={{ flex: 1 }} ><Text style={styles.normalLabel} >频率：</Text><Text style={styles.normalValue} >{item.frequency}</Text></Text>
            <Text style={{ flex: 1 }} ><Text style={styles.normalLabel} >用法：</Text><Text style={styles.normalValue} >{item.unit}</Text></Text>
          </View>
          {
            item.desc ? (
              <View style={styles.itemRowContainer} >
                <Text style={styles.normalLabel} >备注：</Text>
                <Text style={styles.normalValue} >{item.desc}</Text>
              </View>
            ) : null
          }
        </View>
      </Item>
    );
  }

  render() {
    return (
      <View style={Global.styles.CONTAINER}>
        <FlatList
          data={this.props.data}
          ref={(e) => { this.listRef = e; }}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
          renderItem={this.renderDrugItem}
          style={styles.list}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 15,
    textAlign: 'left',
    color: Global.colors.FONT,
  },
  list: {
    flex: 1,
  },
  itemRowContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
  mainItemRowContainer: {
    paddingBottom: 5,
  },
  itemBarcode: {
    width: 100,
    textAlign: 'right',
  },
  normalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  normalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Global.colors.FONT_GRAY,
  },
  planedExecTime: {
    color: Global.colors.IOS_RED,
  },
});

export default RecipeItem;
