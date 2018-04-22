package com.lenovohit.ssm.payment.web.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.User;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.PayChannel;

@RestController
@RequestMapping("/ssm/payment/payChannel")
public class PayChannelRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<PayChannel,String> payChannelManager;
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		PayChannel query =  JSONUtils.deserialize(data, PayChannel.class);
		StringBuilder jql = new StringBuilder(" from PayChannel where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code = ? ");
			values.add(query.getCode());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("'%"+ query.getName() + "%'");
		}
		jql.append(" order by regTime desc");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		payChannelManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<PayChannel> payChannels = payChannelManager.find(" from PayChannel payChannel order by regTime desc");
		return ResultUtils.renderSuccessResult(payChannels);
	}
	
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		PayChannel payChannel =  JSONUtils.deserialize(data, PayChannel.class);
		User user = this.getCurrentUser();
		payChannel.setUpdateUser(user.getName());
		payChannel.setRegUser(user.getName());
		Date now =  new Date();
		payChannel.setUpdateTime(now);
		payChannel.setRegTime(now);
		PayChannel saved = this.payChannelManager.save(payChannel);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdate(@RequestBody String data){
		PayChannel payChannel =  JSONUtils.deserialize(data, PayChannel.class);
		User user = this.getCurrentUser();
		payChannel.setUpdateUser(user.getName());
		Date now =  new Date();
		payChannel.setUpdateTime(now);
		PayChannel saved = this.payChannelManager.save(payChannel);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		System.out.println("idDel:"+id);
		try {
			if(!"".equals(id) && id!=null){
				PayChannel payChannel = this.payChannelManager.delete(id);
				return ResultUtils.renderSuccessResult(payChannel);
			}
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderFailureResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		System.out.println("Data:"+data);
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_PAY_CHANNEL WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println("Sql"+idSql.toString());
			System.out.println("Idvalues"+idvalues);
			if(!"".equals(idvalues) && idvalues!=null){
				this.payChannelManager.executeSql(idSql.toString(), idvalues.toArray());
				return ResultUtils.renderSuccessResult(idvalues);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderFailureResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
}
