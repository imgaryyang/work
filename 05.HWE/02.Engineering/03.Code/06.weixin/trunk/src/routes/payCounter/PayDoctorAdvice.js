import { List, Checkbox, Flex } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import styles from './PayDoctorAdvice.less';

const { CheckboxItem } = Checkbox;

class PayDoctorAdvice extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    // if (arr.length !== 0) {
    this.loadData(currProfile);
    // }
  }
  onChange = (val) => {
    console.log(val);
  }
  loadData(profile) {
    console.info('loadData begin');
    console.log(`loadData begin${typeof this.props.dispatch}`);
    // const query = { proNo: profile.no, hosNo: profile.hosNo };
    const query = { proNo: 'P0000000000170', hosNo: 'H31AAAA001' };
    console.info('query', query);
    this.props.dispatch({
      type: 'paymentRecord/findChargeList',
      payload: { query },
    });
    console.info('loadData end');
  }

  render() {
    const { data } = this.props.paymentRecord;
    let lastRecipeNo = '';
    let currentRecipeItem = null;
    const convertedData = [];
    for (let idx = 0; idx < data.length; idx += 1) {
      // 新建处方项目
      if (lastRecipeNo === '' || lastRecipeNo != data[idx].recipeNo) {
        currentRecipeItem = {};
        currentRecipeItem.recipeNo = data[idx].recipeNo;
        currentRecipeItem.items = [];
        convertedData.push(currentRecipeItem);
        lastRecipeNo = data[idx].recipeNo;
      }

      const item = {};
      item.name = data[idx].name;
      item.num = data[idx].num;
      item.price = data[idx].price;
      item.cost = data[idx].cost;
      currentRecipeItem.items.push(item);
    }

    return (<div>
      {
        convertedData.map(recipeItem => (
          <CheckboxItem key={recipeItem.recipeNo} onChange={() => this.onChange(recipeItem.recipeNo)}>
            <Flex className={styles['title']}>
              <Flex.Item>
                处方&nbsp;&nbsp;{recipeItem.recipeNo}
              </Flex.Item>
            </Flex>
            <Flex className={styles['header']}>
              <Flex.Item style={{ flex: 5, textAlign: 'left' }}>
                项目
              </Flex.Item>
              <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                数量
              </Flex.Item>
              <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                单价
              </Flex.Item>
              <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                总价
              </Flex.Item>
            </Flex>
            {
              recipeItem.items.map((detailItem, detailItemIndex) => (
                <Flex key={detailItemIndex} className={styles['detailContent']}>
                  <Flex.Item style={{ flex: 5, textAlign: 'left', fontWeight: 'bold' }}>
                    {detailItem.name}
                  </Flex.Item>
                  <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                    {detailItem.num}
                  </Flex.Item>
                  <Flex.Item style={{ flex: 2, textAlign: 'right' }} >
                    {detailItem.price}
                  </Flex.Item>
                  <Flex.Item style={{ flex: 2, textAlign: 'right' }}>
                    {detailItem.cost}
                  </Flex.Item>
                </Flex>
              ))
            }
          </CheckboxItem>
        ))}
    </div>);
  }
}

export default connect(({ user, base, paymentRecord }) => ({ user, base, paymentRecord }))(PayDoctorAdvice);
