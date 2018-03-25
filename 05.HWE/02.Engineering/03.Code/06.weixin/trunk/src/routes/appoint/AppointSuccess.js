import React from 'react';
import { Button, Icon, Flex } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import less from './AppointSuccess.less';

class AppointSuccess extends React.Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.gotoRecords = this.gotoRecords.bind(this);
  }

  goBack() {
    this.props.dispatch(routerRedux.go(-3));
  }

  gotoRecords() {
    // this.props.dispatch(routerRedux.go(-3));
    // this.props.dispatch(routerRedux.push());
    this.props.dispatch(routerRedux.push({
      pathname: 'records',
    }));
  }

  render() {
    return (
      <Flex align="center" direction="column" className={less.container}>
        <Icon type="check-circle" className={less.icon} />
        <div className={less.title}>操作成功</div>
        <div className={less.content}>
          您已预约成功，可到 <span onClick={this.gotoRecords}>预约历史</span> 中查看您的预约信息！
        </div>
        <Button className={less.button} onClick={this.goBack}><span className={less.font15}>确定返回</span></Button>
      </Flex>
    );
  }
}

export default connect(appoint => (appoint))(AppointSuccess);
