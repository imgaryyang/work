/** ***************************工具函数 ********* */
const DEVICES = {};
function addListener(device, eventName, func) {
  let events = DEVICES[device];
  if (!events) {
    events = {};
    DEVICES[device] = events;
  }

  let eventArray = events[eventName];
  let index = 0;
  if (!eventArray) {
    eventArray = [];
    events[eventName] = eventArray;
  }

  if (eventArray.length > 1) {
    const max = eventArray[eventArray.length - 1];
    index = max.key + 1;
  }
  events[eventName].push({ key: index, func });

  return index;
}

function removeListener(device, eventName, index) {
  const events = DEVICES[device];
  if (!events) return;

  const eventArray = events[eventName];
  if (!eventArray) return;

  for (let i = 0; i < eventArray.length; i++) {
    if (eventArray[i].key === index) {
      eventArray.splice(i, 1);
      break;
    }
  }
}

function fireEvents(device, eventName, arg) {
  const events = DEVICES[device];
  if (!events) return;

  const eventArray = events[eventName];
  if (!eventArray) return;

  for (let i = 0; i < eventArray.length; i++) {
    eventArray[i].func(eventName, arg);
  }
}

const event = {
  on: addListener,
  un: removeListener,
  listen: addListener,
  addListener,
  removeListener,
  fire: fireEvents,
  fireEvents,
};
export default event;
