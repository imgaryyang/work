import ajax from '../../utils/ajax';
import config from '../../utils/config';

export async function createTrainingInfo(data) {
  return ajax.POST(`${config.apiRoot.userTraining}/create`, data);
}

export async function loadTrainingInfo(data) {
  return ajax.GET(`${config.apiRoot.userTraining}/listByUser/${data}`);
}

export async function removeTrainingInfo(data) {
  return ajax.DELETE(`${config.apiRoot.userTraining}/remove/${data}`);
}
