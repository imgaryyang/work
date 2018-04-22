import React from 'react';
import { connect } from 'dva';

import styles from './ReportPacsLink.less';

class ReportPacsLink extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.onFrameLoad = this.onFrameLoad.bind(this);
  // }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '特检报告详情',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  // onFrameLoad(e) {
  //   console.log(e.target);
  //   console.log(this.iframe);
  //   // console.log(document.getElementById('#iframeId').contentWindow.location.href);
  // }

  render() {
    // TODO: 正式上线时根据条件组合URL
    console.log('this.props', this.props);
    const data = this.props.location.state;
    const { detailUrl } = data;
    // const url = 'http://dqlnyy.webris.cn:8904/index.aspx?accessno=NHII8JZcF26YpJV67bHzOA%3d%3d';
    return (
      <div className={styles.container}>
        <iframe
          ref={(c) => { this.iframe = c; }}
          src={detailUrl}
          className={styles.iframe}
          title="特检详情"
          frameBorder={0}
          // onLoad={this.onFrameLoad}
        />
      </div>
    );
  }
}

ReportPacsLink.propTypes = {
};

export default connect(({ report, base }) => ({ report, base }))(ReportPacsLink);

