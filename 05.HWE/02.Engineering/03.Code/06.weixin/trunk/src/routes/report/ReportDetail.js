import React from 'react';
import { connect } from 'dva';
import { ListView } from 'antd-mobile';
import style from './ReportDetail.less';
import up from '../../assets/images/up.png';
import down from '../../assets/images/down.png';

class ReportDetail extends React.Component {
  componentWillUnmount() {
    this.props.dispatch({
      type: 'report/setState',
      payload: { detail: [] },
    });
  }
  render() {
    const { detail, dataSource, height, rowData } = this.props.report;
    const row = (rowData) => {
      const color = rowData.flag === '0' ? 'black' : rowData.flag === '1' ? 'red' : '#6CD809';
      return (<div className={style['rowcontainer']}>
        <div className={style['c1']}><div>{rowData.subject}</div><div className={style['refer']}>参考值:{rowData.reference}</div></div>
        <div className={color === 'black' ? style['co1'] : color === 'red' ? style['co2'] : style['co3']}>{rowData.result}</div>
        <div className={style['status']} >
          {rowData.flag === '0' ? '正常' : rowData.flag === '1' ? (<img alt="" src={up} className={style['icon']} />) :
          (<img alt="" src={down} className={style['icon']} />)}
        </div>
      </div>);
    };
    const separator = () => {
      return (<div className={style['separator']} />);
    };


    return (
      <div className={style['header']}>
        <div className={style['item']}>{rowData.itemName}</div>
        <div className={style['separator1']} />
        <div className={style['container']}>
          <div className={style['name']}>项目</div>
          <div className={style['c2']}>结果</div>
          <div className={style['c3']}>状态</div>
        </div>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(detail)}
          renderSeparator={separator}
          renderRow={row}
          style={{
          height,
          overflow: 'auto',
        }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div style={{ height: 40 }} />
      </div>
    );
  }
}
ReportDetail.propTypes = {
};
export default connect(report => (report))(ReportDetail);
