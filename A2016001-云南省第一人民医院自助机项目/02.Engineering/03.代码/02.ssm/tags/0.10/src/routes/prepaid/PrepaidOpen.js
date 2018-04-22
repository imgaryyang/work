import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './PrepaidOpen.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Empty                from '../../components/Empty';

import poImg                from '../../assets/base/prepaid-open.png';

class PrepaidOpen extends React.Component {

  static displayName = 'PrepaidOpen';
  static description = '开通预存';

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentWillMount() {
    //测试用，正式版本去掉
    if (!this.props.user.user)
      this.props.dispatch({type: 'user/login'});
  }

  cancel () {
    this.props.dispatch(routerRedux.goBack());
  }

  confirm () {
    //TODO: 修改用户预存开通状态，正式版本应从后台取
    let user = this.props.user.user;
    user.PrepaidOpened = true;
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        user: user
      }
    });

    this.props.dispatch({
      type: 'message/setInfo',
      payload: {
        info: (
          <font style = {{lineHeight: '4rem'}} >就诊卡预存功能已开通<br/>
            <span style = {{fontSize: '2.2rem', lineHeight: '2.5rem'}} >您现在可以通过银行卡、微信、支付宝等各种渠道预存诊疗费<br/>享受更快捷的就诊过程</span>
          </font>
        ),
        autoBack: true,
      }
    });
    this.props.dispatch(routerRedux.push({
      pathname: '/info',
      state: {
        nav: {
          title: '开通预存',
          backDisabled: true,
        },
      },
    }));
  }

  render() {
    console.log(this.props.user);
    const { user } = this.props.user;

    const imgWidth            = config.getWS().width / 6,
          imgHeight           = imgWidth * 332 / 600,
          infoContainerHeight = config.getWS().height - 18 * config.remSize;

    return (
      <WorkSpace fullScreen = {true} style = {{padding: '2rem'}} >
        {
          user && user.PrepaidOpened ? (
            <Empty info = '您已开通过预存功能' />
          ) : (
            <Card shadow = {true} style = {{height: (config.getWS().height - 4 * config.remSize) + 'px', padding: '4rem'}} >
              <div className = {styles.infoContainer} style = {{height: infoContainerHeight + 'px'}} >
                <div>
                  <img src = {poImg} width = {imgWidth} height = {imgHeight} /><br/>
                  <font>您确定要开通就诊卡预存功能吗？</font>
                </div>
              </div>
              <Row>
                <Col span = {12} style = {{paddingRight: '1rem'}} ><Button text = '取消' outline = {true} onClick = {this.cancel} /></Col>
                <Col span = {12} style = {{paddingLeft: '1rem'}} ><Button text = '确定' onClick = {this.confirm} /></Col>
              </Row>
            </Card>
          )
        }
      </WorkSpace>
    );
  }
}
  

export default connect(({user, message}) => ({user, message}))(PrepaidOpen);



