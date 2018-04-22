/**
 * 简单数组生成带分隔符的字符串
 */
export function arrayToString(arr, separator) {
  let rtn = '';
  const sep = separator || ';';
  for (let i = 0; i < arr.length; i += 1) {
    // console.log('arr[i] in arrayToString():', arr[i]);
    if (arr[i]) rtn += `${arr[i]}${sep}`;
  }
  return rtn;
}
