/**
 * 联系我们
 */
import React from 'react';
import { connect } from 'dva';
import { TextareaItem, Button, WhiteSpace, Toast } from 'antd-mobile';
import style from './FeedBack.less';

class FeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  state={
    data: null,
  }

  onChange(data) {
    this.setState({ data });
  }
  submit() {
    const { data } = this.state;
    if (data === null || data === ' ') {
      Toast.info('您还没有输入哦');
    } else {
      Toast.loading('正在提交', 1, () => {
      });
      const query = { feedback: data, appId: '8a8c7db154ebe90c0154ebfdd1270004' };
      this.props.dispatch({
        type: 'feedBack/submit',
        payload: query,
      });
    }
  }


  render() {
    return (
      <div>
        <div className={style['text']}>反馈意见:</div>
        <TextareaItem
          onChange={this.onChange}
          className={style['input']}
          placeholder="您好，请描述你遇到的问题，或提出你宝贵的意见，我们将有专人及时与你联系！"
          rows={5}
          count={200}
        />
        <Button type="primary" className={style['button']} size={10} onClick={this.submit}>提交</Button><WhiteSpace />
      </div>

    );
  }
}


FeedBack.propTypes = {
};

export default connect(feedBack => (feedBack))(FeedBack);
