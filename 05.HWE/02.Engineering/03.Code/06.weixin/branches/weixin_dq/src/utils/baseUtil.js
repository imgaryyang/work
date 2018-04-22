const openLog = true;
const dev_mode = true;
const NoticeProviders = [];
const loginUser = {
  openid: 'oFTG9w2g0hkaicjWXp8pfO9lHxxx',
  // userId: '2088602198268947',
};

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
  const args = arguments;
  if (args.length == 1) {
    msg = type;
    type = '';
  } else if (args.length == 2) {
    msg = title;
    title = type;
    type = '';
  }
  for (const provider of AlertProviders) {
    if (typeof provider === 'function')provider(type, title, msg);
  }
}
function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
}
// function loggerFactory(module){
//	function logger(msg){
//		if(openLog)console.info(module+"."+msg);
//	}
//	return logger;
// }
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

// 获取浏览器类型
function getBroswerType() {
  const userAgent = navigator.userAgent.toLowerCase();
  console.log(`getBroswerType:${userAgent}`);
  if (userAgent.match(/Alipay/i) === 'alipay') {
    return 'A';
  } else if (userAgent.match(/MicroMessenger/i) === 'micromessenger') {
    return 'W';
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
  dev_mode,
  loginUser,
  getBroswerType,
};
export default util;
