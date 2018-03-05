import { get } from '../../utils/Request';
import { todoList } from '../RequestTypes';

export async function page(start, limit, query) {
  return get(`${todoList().page}/${start}/${limit}`, query);
}

export async function todo(/* query*/) {
  return {
    success: true,
    total: 3,
    result: [
      { id: '00001', index: 1, content: '有 3 病人联方未提交' },
      { id: '00002', index: 2, content: '有 3 病人治疗未执行计费' },
      { id: '00003', index: 3, content: '有 2 病人医嘱待导入' },
    ],
  };
  // return get(`${todoList().todo}`, query);
}
