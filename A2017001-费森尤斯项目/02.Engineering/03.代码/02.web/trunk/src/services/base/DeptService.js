

import ajax from '../../utils/ajax';

const apiRoot = '/api/hcp/base/dept/';

let options = {};
let idx = {};

export async function loadDepts() {
  return ajax.GET(`${apiRoot}deptlist`);
}
export async function loadDept(id) {
  return ajax.GET(`${apiRoot}info/${id}`);
}
export async function createDept(data) {
  return ajax.POST(`${apiRoot}create`, data);
}
export async function deleteAll(ids) {
  return ajax.DELETE(`${apiRoot}removeAll/`, ids);
}
export async function loadDeptByTypes(types) {
	return ajax.GET(`${apiRoot}listByDeptType/`, types);
}

export async function loadDeptByIsRegDept(IsRegDept) {
	return ajax.GET(`${apiRoot}listByDeptIsRegDept/`, IsRegDept);
}
export async function loadDeptss() {
   // 取所有科室类型
  const deptTypes = await ajax.GET('/api/hcp/base/dictionary/listByColName/', ['DEPT_TYPE']);
  console.log(deptTypes);
  // 取所有科室信息
  const depts = await ajax.GET(`${apiRoot}list/`);
  console.log(depts);
  // console.log(deptTypes, depts);
  // 将科室类别作为第一层放入缓存
  if (deptTypes.data && deptTypes.data.success) {
    for (let i = 0; i < deptTypes.data.result.length; i += 1) {
      const item = deptTypes.data.result[i];
      options[item.columnKey] = {
        key: `DICT_${i}_${item.columnKey}`,
        value: item.columnKey,
        title: item.columnVal,
        deptType: item.columnKey,
        children: [],
      };
    }
  }
  // 将科室信息放入缓存
  if (depts.data && depts.data.success) {
    for (let i = 0; i < depts.data.result.length; i += 1) {
      const item = depts.data.result[i];
      if (item.deptType && options[item.deptType]) {
        options[item.deptType].children.push({
          key: item.id,
          value: item.id,
          title: item.deptName,
          deptId: item.deptId,
          isRegdept: item.isRegdept,
          spellCode: item.spellCode,
          wbCode: item.wbCode,
          customCode: item.customCode,
          deptType: item.deptType,
        });
        idx[item.id] = {
          deptType: item.deptType,
          idx: options[item.deptType].children.length - 1,
        };
        idx[item.deptId] = {
          deptType: item.deptType,
          idx: options[item.deptType].children.length - 1,
        };
      }
    }
  }
  console.log(idx);
  console.log(options);
  return { depts: options, deptsIdx: idx };
}
