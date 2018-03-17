import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import style from './NewsContent.less';


class NewsContent extends React.Component {
  render() {
    const { data, rowID } = this.props.news;
    // const a = data[rowID].createdAt;
    // const a = eval('5');
    // data[rowID].body.replace(/\n/g, '<br />');
    // document.write('<div><div className={style['header']}><div className={style[\'title\']} >{data[rowID].caption}</div><div className={style[\'date\']} >{data[rowID].createdAt}</div></div><div className={style[\'img\']} ><img style={{ height: 170, marginTop: 10 }} alt="" src={require(`../../assets/images/${data[rowID].image}`)} /></div><div>{ data[rowID].body.replace(/\\n/g, \'<br />\')}</div></div>');
    /* document.write(data[rowID].body.replace(/\n/g, '<br />'));
    document.write('<div>你好</div>');
    document.write(eval(`(${data[rowID].createdAt})`));*/
    // document.write(JSON.parse(a));
    // console.log(eval(`(${data[rowID].createdAt})`));
    return (
      <div >
        <div className={style['header']}>
          <div className={style['title']} >{data[rowID].caption}</div>
          <div className={style['date']} >{data[rowID].createdAt}</div>
        </div>
        <div className={style['img']} >
          <img
            style={{ width: 320, height: 170, marginTop: 10 }}
            alt=""
            // TODO: 图片指向java后台维护的新闻图片
            // src={require(`../../assets/images/${data[rowID].image}`)}
          />
        </div>
        <div className={style['body']}>&nbsp;&nbsp;{ data[rowID].body}</div>
      </div>
    );
  }
}
NewsContent.propTypes = {
};
export default connect(news => (news))(NewsContent);
