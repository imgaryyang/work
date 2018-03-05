/* eslint linebreak-style: ["error", "windows"]*/
import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function load() {
  return ajax.GET(`${apiRoot.phaRecipe}/list`);
}

export async function loadPage(start, limit, query) {
  return ajax.GET(`${apiRoot.phaRecipe}/page/${start}/${limit}`, query || {});
}

export async function save(data) {
  return data.id
    ? ajax.POST(`${apiRoot.phaRecipe}/update`, data)
    : ajax.POST(`${apiRoot.phaRecipe}/create`, data);
}

export async function update(id) {
  return ajax.POST(`${apiRoot.phaRecipe}/update/${id}`);
}

export async function deleteAll(ids) {
  return ajax.DELETE(`${apiRoot.phaRecipe}/removeAll`, ids);
}

export async function recipe(id) {
  return ajax.GET(`${apiRoot.phaRecipe}/recipe/${id}`);
}

export async function back(id) {
  return ajax.GET(`${apiRoot.phaRecipe}/back/${id}`);
}
