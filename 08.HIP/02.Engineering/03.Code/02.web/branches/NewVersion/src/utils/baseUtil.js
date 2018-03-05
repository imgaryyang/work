const openLog = true;

const NoticeProviders = [];
function addNoticeProvider(provider) {
  NoticeProviders.push(provider);
}

function notice(msg) {
  for (const provider of NoticeProviders) {
    if (typeof provider === 'function')provider(msg);
  }
}

const ErrorProviders = [];
function addErrorProvider(provider) {
  ErrorProviders.push(provider);
}

function error(msg) {
  for (const provider of ErrorProviders) {
    if (typeof provider === 'function')provider(msg);
  }
}

const AlertProviders = [];
function addAlertProvider(provider) {
  AlertProviders.push(provider);
}

function alert(type, title, msg) {
  // const args = arguments;
  let msg1;
  let type1;
  let title1;
  if (!title && !msg) {
    msg1 = type;
    type1 = '';
  } else if (!msg) {
    msg1 = title;
    title1 = type;
    type1 = '';
  }
  for (const provider of AlertProviders) {
    if (typeof provider === 'function') {
      provider(type, title, msg);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getLogger(module) {
  function log(msg) {
    if (openLog)console.info(`${module}.${msg}`);
  }
  return { log };
}

function launchFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

const util = {
  sleep,
  getLogger,
  addNoticeProvider,
  notice,
  addErrorProvider,
  error,
  alert,
  addAlertProvider,
  launchFullScreen,
};

export default util;
