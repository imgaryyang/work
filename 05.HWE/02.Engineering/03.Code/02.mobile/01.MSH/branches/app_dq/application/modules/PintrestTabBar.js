import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

import Global from '../Global';

class PintrestTabBar extends React.Component {
  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue(/* { value }*/) {
  }

  render() {
    const { tabs, activeTab, scrollValue } = this.props;

    const containerWidth = (Global.getScreen().width - 30 - 6);
    const bgWidth = containerWidth / tabs.length;
    const activeTabBg = {
      position: 'absolute',
      width: bgWidth,
      height: 28,
      top: 3,
      backgroundColor: 'white',
      borderRadius: 4,
    };

    const translateX = scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [3, 3 + (containerWidth / tabs.length)],
    });

    return (
      <View style={[styles.tabsContainer, this.props.containerStyle]} >
        <View style={styles.tabs} >
          <Animated.View
            style={[
              activeTabBg,
              {
                transform: [
                  { translateX },
                ],
              },
            ]}
          />
          {
            tabs.map((tab, i) => {
              const activeColor = i === activeTab ? '#000000' : Global.colors.FONT_GRAY;
              return (
                <TouchableOpacity
                  key={`${tab}_${i + 1}`}
                  onPress={() => this.props.goToPage(i)}
                  style={styles.tab}
                >
                  <Text style={[styles.text, { color: activeColor }]} numberOfLines={1} >{tab}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: 'white',
    height: 42,
    paddingTop: 0,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.NAV_BAR_LINE,
  },
  tabs: {
    height: 34,
    padding: 3,
    flexDirection: 'row',
    backgroundColor: '#efeeee',
    borderRadius: 6,
  },
  tab: {
    flex: 1,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 4,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PintrestTabBar;
