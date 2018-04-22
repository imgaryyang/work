package com.lenovohit.ssm.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Model;

@RestController
@RequestMapping("/ssm/base/model")
public class ModelRestController {
	@Autowired
	private GenericManagerImpl<Model,String> modelManager;
	
	/**
	 * 新增型号
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreatemodel(@RequestBody String data){
		Model model =  JSONUtils.deserialize(data, Model.class);
		
		//调整同级其它地址位置
		if (model.getId() != null) {  //修改
			Model oldmodel = modelManager.get(model.getId());
			int oldmodelSort = oldmodel.getSort();
			if (oldmodelSort > model.getSort()) {  //向前调整位置
				//大于等于现有位置且小于原位置的同级地址 +1
				String sql = "UPDATE SSM_MODEL SET SORT = SORT + 1 WHERE PARENT = ? and ID != ? and SUPPLIER = ? and SORT >= ? and Sort < ?";
		        modelManager.executeSql(sql, model.getParent(), model.getId(), model.getSupplier(), model.getSort(), oldmodelSort);
			} else if (oldmodelSort < model.getSort()) {  //向后调整
				//小于等于现有位置且大于原位置的同级地址 +1
				String sql = "UPDATE SSM_MODEL SET SORT = SORT - 1 WHERE PARENT = ? and ID != ? and SUPPLIER = ? and SORT <= ? and Sort > ?";
		        modelManager.executeSql(sql, model.getParent(), model.getId(), model.getSupplier(), model.getSort(), oldmodelSort);
			}
		} else {  //新建时，将排序位置大于或等于新地址位置的同级地址 +1
			String sql = "UPDATE SSM_MODEL SET SORT = SORT + 1 WHERE PARENT = ? and SUPPLIER = ? and SORT >= ?";
	        modelManager.executeSql(sql, model.getParent(), model.getSupplier(), model.getSort());
		}
		Model saved = this.modelManager.save(model);
		        
		return ResultUtils.renderSuccessResult(saved);
	}
	/**
	 * 加载所有型号
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Model> models = modelManager.find(" from Model order by sort");
		return ResultUtils.renderSuccessResult(models);
	}
	/**
	 * 加载自助机型号
	 * @return
	 */
	@RequestMapping(value = "/loadParent", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result loadParent(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Model> models = modelManager.find(" from Model where parent is null order by sort");
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 删除型号
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_MODEL  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.modelManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
