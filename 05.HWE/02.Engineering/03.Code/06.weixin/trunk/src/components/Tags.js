import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Tags.less';

export default class Tags extends PureComponent {
  render() {
    const { tags, containerStyle } = this.props;
    // const { tagConfig } = Global.Config;
    if (tags.length === 0) return <div className={styles.tagsContainer} style={containerStyle} />;
    return (
      <div className={styles.tagsContainer} style={containerStyle} >
        {tags.map((tag, idx) => {
          return (
            <div key={`tag_${idx + 1}`} className={styles.tagContainer} style={{ backgroundColor: tag.bgColor, borderColor: tag.borderColor }} >
              <span className={styles.tag} >{tag.label}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

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
