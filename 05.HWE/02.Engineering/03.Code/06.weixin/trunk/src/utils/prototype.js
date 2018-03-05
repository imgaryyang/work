import { Component } from 'react';

/**
 * 取医生对象
 */
Object.defineProperty(Component.prototype, 'getDoctors', {
  value(docIds) {
    const { cache } = this.props;
    const { doctors } = cache;
    const rtn = [];
    const notInCache = [];
    // const res = {};
    for (let i = 0; i < docIds.length; i += 1) {
      const docId = docIds[i];
      if (!doctors[docId]) { // 不存在的字典项
        notInCache.push(docId);
        rtn.push({});
      } else {
        rtn.push(doctors[docId]);
      }
    }
    if (notInCache.length > 0) {
      this.props.dispatch({
        type: 'cache/loadDoctors',
        docIds: notInCache,
      });
    }
    return rtn;
  },
  enumerable: false,
});

/**
 * 为Array扩展 contains 方法，检验数组是否包含某对象
 */
Object.defineProperty(Array.prototype, 'contains', {
  value(needle) {
    for (const i in this) {
      if (this[i] === needle) return true;
    }
    return false;
  },
  enumerable: false,
});

/**
 * 格式化金额
 * c - 精度 默认小数点后两位
 * d - 小数点 默认 .
 * t - 三位分隔符 默认 ,
 */
Object.defineProperty(Number.prototype, 'formatMoney', {
  value(fixed) {
    let n = this;
    const c = isNaN(fixed) ? 2 : fixed;
    const d = d === undefined ? '.' : d;
    const t = t === undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c), 10));
    let j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  },
  enumerable: false,
});

/**
 * 将带parent属性的数组转为树状结构
 */
Object.defineProperty(Array.prototype, 'arrayToTree', {
  value(parentProp) {
    const theParentProp = parentProp || 'parent';
    const array = this;
    const all = {};
    const rtnArr = [];
    for (let i = 0; i < array.length; i += 1) {
      const item = array[i];
      item.children = [];
      item.key = `/${item.code}`;
      all[item.id] = item;
    }
    for (let i = 0; i < array.length; i += 1) {
      const item = array[i];
      const parentId = item[theParentProp];
      if (parentId && all[parentId]) {
        const parent = all[parentId];
        parent.children.push(item);
        item[theParentProp] = parent; // 将父子做关联 child.parent为父，parent.index为第一个子
        if (!parent.index)parent.index = item;
      } else {
        rtnArr.push(item);
      }
    }
    return rtnArr;
  },
  enumerable: false,
});

/**
 * 从字典数据结构中取键对应的值
 */
Object.defineProperty(Object.prototype, 'dis', {
  value(columnName, key) {
    const dicts = this;
    for (let i = 0; dicts[columnName] instanceof Array && i < dicts[columnName].length; i++) {
      const row = dicts[columnName][i];
      if (row.columnKey === key) {
        return row.columnVal;
      }
    }
    return '';
  },
  enumerable: false,
});

/**
 * 根据科室id取存放在前端的科室信息
 */
Object.defineProperty(Object.prototype, 'getDept', {
  value(deptsIdx, id) {
    const depts = this;
    const idxObj = deptsIdx[id];
    if (typeof idxObj === 'undefined') return '';
    const dept = depts[idxObj.deptType].children[idxObj.idx];
    return dept;
  },
  enumerable: false,
});

/**
 * 根据科室id取存放在前端的科室的名称
 */
Object.defineProperty(Object.prototype, 'disDeptName', {
  value(deptsIdx, id) {
    const depts = this;
    const idxObj = deptsIdx[id];
    if (typeof idxObj === 'undefined') return '';
    const dept = depts[idxObj.deptType].children[idxObj.idx];
    return dept.title;
  },
  enumerable: false,
});

/**
 * 根据deptId取存放在前端的科室的名称
 */
Object.defineProperty(Object.prototype, 'disDeptNameByDeptId', {
  value(deptsIdx, deptId) {
    const depts = this;
    const idxObj = deptsIdx[deptId];
    if (typeof idxObj === 'undefined') return '';
    const dept = depts[idxObj.deptType].children[idxObj.idx];
    return dept.title;
  },
  enumerable: false,
});

Object.defineProperty(Object.prototype, 'disDepts', {
  value(deptType, key) {
    const depts = this;
    for (let i = 0; depts[deptType] instanceof Array && i < depts[deptType].length; i++) {
      const row = depts[deptType][i];
      if (row.deptId === key) {
        return row.deptName;
      }
    }
    return '';
  },
  enumerable: false,
});




Object.defineProperty(Array.prototype, 'find', {
  value(func) {
	for (var i = 0; i < this.length; i++) {
        if (func(this[i]))return this[i];
    }
	return;
  },
  enumerable: false,
});
