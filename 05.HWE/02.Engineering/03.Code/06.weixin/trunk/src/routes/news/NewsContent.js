import React from 'react';
import { connect } from 'dva';

import styles from './NewsContent.less';
import { image } from '../../services/baseService';
import { colors } from '../../utils/common';

class NewsContent extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '新闻详情',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  render() {
    const { screen } = this.props.base;
    const { dataArray, rowID } = this.props.news;
    const content = dataArray[rowID];
    return (
      <div className={styles.container} >
        <div className={styles['title']} >{content ? content.caption || '' : ''}</div>
        <div className={styles['date']} >{content ? content.createdAt || '' : ''}</div>
        <div className={styles['body']} style={{ color: colors.FONT_GRAY }}>{content ? content.digest || '' : ''}</div>
        <div
          className={styles['image']}
          style={{
            width: screen.width - 40,
            height: (screen.width - 40) * 177 / 340,
            backgroundImage: content && content.image ? `url(${image(content.image)})` : '',
          }}
        />
        <div className={styles['body']}>{content ? content.body || '' : ''}</div>
        <div style={{ height: 40 }} />
      </div>
    );
  }
}

NewsContent.propTypes = {
};

export default connect(({ news, base }) => ({ news, base }))(NewsContent);
