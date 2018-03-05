/**
 * 所有公用过滤器
 */

import _ from 'lodash';

/**
 * 格式化卡号，显示卡号后4位，前面所有数字显示为 *
 * @param  {[string]}
 * @return {[string]}
 */
export function filterCardNumLast4(cn) {
  if (cn !== null) { return `**** **** ${cn.substr(cn.length - 4)}`; }
}

/**
 * 格式化身份证号，显示前4位及后4位，中间的所有数字显示为 *
 * @param  {[type]}
 * @return {[type]}
 */
export function filterIdCard(cn) {
  let rtn = '';
  if (cn !== null) {
    rtn = cn.substr(0, 4);
    rtn += ' ****** ****** ';
    rtn += cn.substr(cn.length - 4);
  }
  return rtn;
}
/**
 * 格式化电话号码，显示前3位及后4位，中间的所有数字显示为 *
 * @param  {[type]}
 * @return {[type]}
 */
export function filterMobile(cn) {
  let rtn = '';
  if (cn !== null) {
    rtn = cn.substr(0, 3);
    rtn += ' **** ';
    rtn += cn.substr(cn.length - 4);
  }
  return rtn;
}
/**
 * 格式化卡号为每4为加一空格
 */
export function filterBankCard(cn) {
  let rtn = '';
  for (let i = 0; cn && i <= cn.length; i++) {
    if (i !== 0 && i % 4 === 0) { rtn += ' '; }
    rtn += cn.substr(i, 1);
  }
  return rtn;
}

/**
 * 数字格式化金额，整数位每三位用逗号隔开，小数点保留n位(默认保留两位)
 */
export function filterMoney(s, n) {
  if (s !== null && typeof s !== 'undefined') {
    n = n > 0 && n <= 20 ? n : 2;
    s = `${parseFloat((`${s}`).replace(/[^\d\.-]/g, '')).toFixed(n)}`;
    let l = s.split('.')[0].split('').reverse(),
      r = s.split('.')[1];
    let t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    return `${t.split('').reverse().join('')}.${r}`;
  }
  return null;
}

/**
 * 格式化医院等级
 */
export function filterHospLevel(level) {
  const levelDic = {
    1: '一级',
    2: '二级',
    3: '三级',
    A: '甲等',
    B: '乙等',
    C: '丙等',
  };
  return levelDic[level.substring(0, 1)] + levelDic[level.substring(1, 2)];
}

/**
 * 格式化医院等级
 */
export function filterHospType(type) {
  const typeDic = {
    1: '综合医院',
    2: '专科医院',
  };
  return typeDic[type];
}

/**
 * 格式化联系方式类型，根据code返回中文
 */
export function filterContactWay(code) {
  // 1 - 手机号
  // 2 - 电话
  // 3 - 传真
  // 4 - 400电话
  // 5 - 微信
  // 6 - 微博
  // 7 - QQ
  // 8 - EMAIL
  const contactWay = {
    1: '手机',
    2: '座机',
    3: '传真',
    4: '服务热线',
    5: '微信',
    6: '微博',
    7: 'QQ',
    8: 'EMAIL',
  };

  return contactWay[code];
}

export function filterHtmlForWiki(str) {
  // console.log('>>>>>str:', str);
  const rst = _.replace(str, /(?:<br\/>\\r\\n|\\r\\n|\\r|\\n)/g, `${'\n'}`);
  // console.log('>>>>>rst:', rst);
  return rst;
}
