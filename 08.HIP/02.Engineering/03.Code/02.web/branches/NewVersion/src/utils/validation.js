/**
 * Validations of form text input
 */

/**
 * 校验数字
 */
export function testNumber(num) {
  if (!num) { return true; }

  const pattern = /^[0-9]*$/;
  if (pattern.test(num)) {
    return true;
  }
  return false;
}

/**
 * 校验整数
 */
export function testInt(i) {
  if (!i) { return true; }

  const pattern = /^-?\d+$/;
  if (pattern.test(i)) {
    return true;
  }
  return false;
}

/**
 * 校验手机号
 * (1)必须全为数字;
 * (2)必须是11位;
 * (3)必须以1开头;
 * (4)第2位是34578中的一个.
 */
export function testMobile(mobile) {
  if (!mobile) { return true; }

  const pattern = /^1[34578]\d{9}$/;
  if (pattern.test(mobile)) {
    return true;
  }
  return false;
}


/**
 * 校验中国大陆身份证号
 */
export function testCnIdNo(idNo) {
  if (!idNo) { return true; }

  const cnIdCity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };

  // 检查号码是否符合规范，包括长度，类型
  const isCardNo = function (card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    const reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
      return false;
    }
    return true;
  };

  // 取身份证前两位,校验省份
  const checkProvince = function (card) {
    const province = card.substr(0, 2);
    if (cnIdCity[province] === undefined) {
      return false;
    }
    return true;
  };

  // 检查生日是否正确
  const checkBirthday = function (card) {
    const len = card.length;
    let arrData;
    let year;
    let month;
    let day;
    let birthday;
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len === '15') {
      const reFifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
      arrData = card.match(reFifteen);
      year = arrData[2];
      month = arrData[3];
      day = arrData[4];
      birthday = new Date(`19${year}/${month}/${day}`);
      return verifyBirthday(`19${year}`, month, day, birthday);
    }
    // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if (len === '18') {
      const reEighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
      arrData = card.match(reEighteen);
      year = arrData[2];
      month = arrData[3];
      day = arrData[4];
      birthday = new Date(`${year}/${month}/${day}`);
      return verifyBirthday(year, month, day, birthday);
    }
    return false;
  };

  // 校验日期
  const verifyBirthday = function (year, month, day, birthday) {
    const now = new Date();
    const nowYear = now.getFullYear();
    // 年月日是否合理
    if (birthday.getFullYear() === year && (birthday.getMonth() + 1) === month && birthday.getDate() === day) {
      // 判断年份的范围（3岁到100岁之间)
      const time = nowYear - year;
      if (time >= 3 && time <= 100) {
        return true;
      }
      return false;
    }
    return false;
  };

  // 校验位的检测
  const checkParity = function (cardArg) {
    // 15位转18位
    const card = changeFivteenToEighteen(cardArg);
    const len = card.length;
    if (len === '18') {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let cardTemp = 0;
      let i;
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      const valnum = arrCh[cardTemp % 11];
      if (valnum === card.substr(17, 1)) {
        return true;
      }
      return false;
    }
    return false;
  };

  // 15位转18位身份证号
  const changeFivteenToEighteen = function (card) {
    if (card.length === '15') {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let cardTemp = 0;
      let i;
      let cardRtn = `${card.substr(0, 6)}19${card.substr(6, card.length - 6)}`;
      for (i = 0; i < 17; i++) {
        cardTemp += cardRtn.substr(i, 1) * arrInt[i];
      }
      cardRtn += arrCh[cardTemp % 11];
      return cardRtn;
    }
    return card;
  };

  // 是否为空
  /* if(idNo === '') {
return "请输入身份证号，身份证号不能为空";
} */
  // 校验长度，类型
  if (isCardNo(idNo) === false) {
    return false;
    // return "您输入的身份证号码不正确，请重新输入";
  }
  // 检查省份
  if (checkProvince(idNo) === false) {
    return false;
    // return "您输入的身份证号码不正确,请重新输入";
  }
  // 校验生日
  if (checkBirthday(idNo) === false) {
    return false;
    // return "您输入的身份证号码生日不正确,请重新输入";
  }
  // 检验位的检测
  if (checkParity(idNo) === false) {
    return false;
    // return "您的身份证校验位不正确,请重新输入";
  }

  return true;
}

/**
 * 校验电子邮箱
 */
export function testEmail(email) {
  if (!email) { return true; }

  // var pattern = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
  const pattern = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
  const rst = pattern.test(email);
  return rst;
}

/**
 * 校验金额合法性
 */
export function testAmt(amt) {
  if (!amt) { return true; }

  const pattern = /^-?\d+\.{0,1}\d{0,}$/;
  const rst = pattern.test(amt);
  return rst;
}

/**
 * 校验银行账号合法性
 */
export function testBankAcct(acctNo) {
  if (!acctNo) { return true; }

  return true;
}

/**
 * 校验体温
 */
export function testtemperature(value) {
  if (value > 42) { return false; }
  return true;
}
/**
 * 校验两个数字大小
 */
export function compareSize(startNum, endNum) {
  if (startNum * 1 > endNum * 1) {
    return false;
  } else {
    return true;
  }
}
