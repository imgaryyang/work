import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function findChargePkgList(data) {
  return ajax.GET(`${apiRoot.chargePkg}findChargePkgList`, data || {});
}

export async function loadTreeData(data) {
  return ajax.GET(`${apiRoot.chargePkg}tree/list`, data || {});
}

export async function loadGroupPage(start, limit, query) {
  return ajax.GET(`${apiRoot.chargePkg}page/${start}/${limit}`, query || {});
}

export async function savePkg(data) {
  return ajax.POST(`${apiRoot.chargePkg}save`, data || {});
}

export async function saveItem(data) {
  return ajax.POST(`${apiRoot.chargePkg}item/save`, data || {});
}

export async function loadItems(comboId) {
  return ajax.GET(`${apiRoot.chargePkg}items/list/${comboId}`);
}

export async function deleteGroup(id) {
  return ajax.DELETE(`${apiRoot.chargePkg}remove/${id}`);
}

export async function deleteItem(id) {
  return ajax.DELETE(`${apiRoot.chargePkg}item/remove/${id}`);
}

export async function makeGroup(data) {
  return ajax.GET(`${apiRoot.chargePkg}item/makeGruop`, data || []);
}

export async function deleteFromGroup(data) {
  return ajax.GET(`${apiRoot.chargePkg}item/deleteFromGroup`, data || []);
}

export async function sortItems(data) {
  return ajax.GET(`${apiRoot.chargePkg}item/sort`, data || []);
}
