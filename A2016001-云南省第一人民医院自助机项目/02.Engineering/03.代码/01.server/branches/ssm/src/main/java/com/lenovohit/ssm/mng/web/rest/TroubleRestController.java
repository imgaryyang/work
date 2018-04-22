package com.lenovohit.ssm.mng.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.User;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.mng.model.Trouble;

@Controller
@RequestMapping("/ssm/trouble")
public class TroubleRestController  extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Trouble, String> troubleManager;
	
	@RequestMapping(value="/demo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result demo(){
		List<Trouble> troubles = this.troubleManager.find(" from Trouble ");
		return ResultUtils.renderSuccessResult(troubles);
	}
	
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		Trouble query =  JSONUtils.deserialize(data, Trouble.class);
		StringBuilder jql = new StringBuilder( " from Trouble where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		troubleManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 查询所有故障
	 */
	@RequestMapping(value = "/loadTroubles", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTroubles(){
		List<Trouble> list = troubleManager.find(" from Trouble ");
		return ResultUtils.renderSuccessResult(list);
	}
	@RequestMapping(value = "/trouble/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTroubleList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Trouble> troubles = troubleManager.find(" from Trouble order by sort");
		return ResultUtils.renderSuccessResult(troubles);
	}
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		System.out.println(data);
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_TROUBLE  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			System.out.println(idvalues);
			this.troubleManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 新增故障信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		Trouble trouble =  JSONUtils.deserialize(data, Trouble.class);
		
		//调整同级其它菜单位置
		if (trouble.getId() != null) {  //修改
			Trouble oldTrouble = troubleManager.findOneByProp("id", trouble.getId());
			//trouble.setTrouble(oldTrouble);
			int oldTroubleSort = oldTrouble.getSort();
			System.out.println(oldTroubleSort);
			if (oldTroubleSort > trouble.getSort()) {  //向前调整位置
				//大于等于现有位置且小于原位置的同级菜单 +1
				String sql = "UPDATE SSM_TROUBLE SET SORT = SORT + 1 WHERE PARENT = ? and ID != ? and SORT >= ? and Sort < ?";
		        int rst = troubleManager.executeSql(sql,trouble.getParent(), trouble.getId(), trouble.getSort(), oldTroubleSort);
		        System.out.println(rst);
			} else if (oldTroubleSort < trouble.getSort()) {  //向后调整
				//小于等于现有位置且大于原位置的同级菜单 +1
				String sql = "UPDATE SSM_TROUBLE SET SORT = SORT - 1 WHERE PARENT = ? and ID != ? and SORT <= ? and Sort > ?";
		        int rst = troubleManager.executeSql(sql, trouble.getParent(), trouble.getId(), trouble.getSort(), oldTroubleSort);
		        System.out.println(rst);
			}
		} else {  //新建时，将排序位置大于或等于新菜单位置的同级菜单 +1
			String sql = "UPDATE SSM_TROUBLE SET SORT = SORT + 1 WHERE PARENT = ?  and SORT >= ?";
	        troubleManager.executeSql(sql, trouble.getParent(),trouble.getSort());
		}
		//TODO 校验
		Date now =  new Date();
		String time = DateUtils.date2String(now, "yyyy-MM-dd HH:mm:ss");
		trouble.setCreateTime(time);
		User user = this.getCurrentUser();
		trouble.setOperator(user.getName());
		Trouble saved = this.troubleManager.save(trouble);
		        
		return ResultUtils.renderSuccessResult(saved);
	}
}
