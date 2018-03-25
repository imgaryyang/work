import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Global from '../../Global';

export default class Tags extends PureComponent {
  render() {
    const { tags, containerStyle } = this.props;
    // const { tagConfig } = Global.Config;
    if (tags.length === 0) return <View style={[styles.tagsContainer, containerStyle]} />;
    return (
      <View style={[styles.tagsContainer, containerStyle]} >
        {tags.map((tag, idx) => {
          return (
            <View key={`tag_${idx + 1}`} style={[styles.tagContainer, { backgroundColor: tag.bgColor, borderColor: tag.borderColor }]} >
              <Text style={styles.tag} >{tag.label}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tagContainer: {
    padding: 2,
    borderRadius: 3,
    marginLeft: 3,
    borderWidth: 1 / Global.pixelRatio,
  },
  tag: {
    fontSize: 8,
    color: 'white',
  },
});

Tags.propTypes = {
  /**
   * 标签数组
   */
  tags: PropTypes.array,
  /**
   * 标签容器样式
   */
  containerStyle: PropTypes.object,
};

Tags.defaultProps = {
  tags: [],
  containerStyle: {},
};
