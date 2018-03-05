import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function createTrainingInfo(data) {
  return ajax.POST(`${apiRoot.userTraining}/create`, data);
}

export async function loadTrainingInfo(data) {
  return ajax.GET(`${apiRoot.userTraining}/listByUser/${data}`);
}

export async function removeTrainingInfo(data) {
  return ajax.DELETE(`${apiRoot.userTraining}/remove/${data}`);
}
