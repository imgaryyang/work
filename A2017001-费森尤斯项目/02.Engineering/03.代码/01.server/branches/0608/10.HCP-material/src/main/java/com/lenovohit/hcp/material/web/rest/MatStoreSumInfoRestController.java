package com.lenovohit.hcp.material.web.rest;

import java.math.BigDecimal;
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

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpCtrlParam;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.utils.CtrlParamUtil;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.model.MatStoreSumInfo;

@RestController
@RequestMapping("/hcp/material/matStoreSumInfo")
public class MatStoreSumInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MatStoreSumInfo, String> matStoreSumInfoManager;
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
		MatStoreSumInfo storeQuery = JSONUtils.deserialize(data, MatStoreSumInfo.class);
		StringBuilder jql = new StringBuilder( " select store from MatStoreSumInfo store left join store.materialInfo mat left join store.companyInfo company where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(storeQuery.getTradeName())){
			jql.append("and (store.tradeName like ? or mat.commonSpell like ? or mat.commonWb like ? or store.materialCode like ? or mat.barcode = ? ) ");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add("%"+storeQuery.getTradeName()+"%");
			values.add(storeQuery.getTradeName());
		}
		if(!StringUtils.isEmpty(storeQuery.getMaterialType())){
			jql.append("and store.materialType = ? ");
			values.add(storeQuery.getMaterialType());
		}
//		if (storeQuery.getMatInfo() != null) {
//			if(!StringUtils.isEmpty(storeQuery.getMatInfo().getMaterialQuality())){
//				jql.append("and drug.drugQuality = ? ");
//				values.add(storeQuery.getMatInfo().getMaterialQuality());
//			}
//		}

		if(!StringUtils.isEmpty(storeQuery.getMaterialSpecs())){
			jql.append("and store.materialSpecs = ? ");
			values.add(storeQuery.getMaterialSpecs());
		}
		if(!StringUtils.isEmpty(storeQuery.getDeptId())){
			jql.append("and store.deptId = ? ");
			values.add(storeQuery.getDeptId());
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		matStoreSumInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	
	 /**
     * 库存预警分页查询
     * @param start
     * @param limit
     * @param data
     * @return
     */
    @RequestMapping(value = "/pageInventWarn/{start}/{limit}/{isWarn}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    public Result forInventWarnPage(@PathVariable("start") String start, @PathVariable("limit") String limit,@PathVariable("isWarn") boolean isWarn,
            @RequestParam(value = "data", defaultValue = "") String data){
        MatStoreSumInfo storeQuery = JSONUtils.deserialize(data, MatStoreSumInfo.class);
        StringBuilder jql = new StringBuilder( " select store from MatStoreSumInfo store left join store.materialInfo mat left join store.companyInfo company where 1 = 1 ");
        List<Object> values = new ArrayList<Object>();
        
        // 当前医院
        jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
        // 当前科室
        jql.append(" and store.deptId = '" + this.getCurrentUser().getLoginDepartment().getId() + "' ");
        // 临界值
        jql.append(" and (store.alertNum - store.storeSum) >= 0");
        
        //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
        if(!StringUtils.isEmpty(storeQuery.getTradeName())){
            jql.append("and (store.tradeName like ? or mat.commonSpell like ? or mat.commonWb like ? or store.materialCode like ? or mat.barcode = ? ) ");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add("%"+storeQuery.getTradeName()+"%");
            values.add(storeQuery.getTradeName());
        }
        if(!StringUtils.isEmpty(storeQuery.getMaterialType())){
            jql.append("and store.materialType = ? ");
            values.add(storeQuery.getMaterialType());
        }
//        if (storeQuery.getMatInfo() != null) {
//            if(!StringUtils.isEmpty(storeQuery.getMatInfo().getMaterialQuality())){
//                jql.append("and drug.drugQuality = ? ");
//                values.add(storeQuery.getMatInfo().getMaterialQuality());
//            }
//        }

        if(!StringUtils.isEmpty(storeQuery.getMaterialSpecs())){
            jql.append("and store.materialSpecs = ? ");
            values.add(storeQuery.getMaterialSpecs());
        }
        if(!StringUtils.isEmpty(storeQuery.getDeptId())){
            jql.append("and store.deptId = ? ");
            values.add(storeQuery.getDeptId());
        }
        
        Page page = new Page();
        page.setStart(start);
        page.setPageSize(limit);
        page.setQuery(jql.toString());
        page.setValues(values.toArray());
        matStoreSumInfoManager.findPage(page);
        return ResultUtils.renderPageResult(page);
    }
    
    /**
    * 滞留预警分页查询
    * @param start
    * @param limit
    * @param data
    * @return
    */
   @RequestMapping(value = "/pageDetentWarn/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
   public Result forDetentWarnPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
           @RequestParam(value = "data", defaultValue = "") String data){
       MatStoreSumInfo storeQuery = JSONUtils.deserialize(data, MatStoreSumInfo.class);
       StringBuilder jql = new StringBuilder( " select store from MatStoreSumInfo store left join store.materialInfo mat left join store.companyInfo company where 1 = 1 ");
       List<Object> values = new ArrayList<Object>();
       
       // 当前医院
       jql.append(" and store.hosId = '" + this.getCurrentUser().getHosId() + "' ");
       // 当前科室
       jql.append(" and store.deptId = '" + this.getCurrentUser().getDeptId() + "' ");
       
       HcpCtrlParam hcpCtrlParam = CtrlParamUtil.getCtrlParm(this.getCurrentUser().getHosId(), "MARETIAL_UPDATE_TIME");
       if (hcpCtrlParam != null)
       {
           jql.append(" and DATEDIFF(DAY,store.updateTime,getdate()) >= " + hcpCtrlParam.getControlParam() + " ");
       }
       
       //查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
       if(!StringUtils.isEmpty(storeQuery.getTradeName())){
           jql.append("and (store.tradeName like ? or mat.commonSpell like ? or mat.commonWb like ? or store.materialCode like ? or mat.barcode = ? ) ");
           values.add("%"+storeQuery.getTradeName()+"%");
           values.add("%"+storeQuery.getTradeName()+"%");
           values.add("%"+storeQuery.getTradeName()+"%");
           values.add("%"+storeQuery.getTradeName()+"%");
           values.add(storeQuery.getTradeName());
       }
       if(!StringUtils.isEmpty(storeQuery.getMaterialType())){
           jql.append("and store.materialType = ? ");
           values.add(storeQuery.getMaterialType());
       }
//       if (storeQuery.getMatInfo() != null) {
//           if(!StringUtils.isEmpty(storeQuery.getMatInfo().getMaterialQuality())){
//               jql.append("and drug.drugQuality = ? ");
//               values.add(storeQuery.getMatInfo().getMaterialQuality());
//           }
//       }

       if(!StringUtils.isEmpty(storeQuery.getMaterialSpecs())){
           jql.append("and store.materialSpecs = ? ");
           values.add(storeQuery.getMaterialSpecs());
       }
       if(!StringUtils.isEmpty(storeQuery.getDeptId())){
           jql.append("and store.deptId = ? ");
           values.add(storeQuery.getDeptId());
       }
       
       Page page = new Page();
       page.setStart(start);
       page.setPageSize(limit);
       page.setQuery(jql.toString());
       page.setValues(values.toArray());
       matStoreSumInfoManager.findPage(page);
       return ResultUtils.renderPageResult(page);
   }
    
	/**
	 * 查询列表
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		MatStoreSumInfo query =  JSONUtils.deserialize(data, MatStoreSumInfo.class);
		StringBuilder jql = new StringBuilder( " select store from MatStoreSumInfo store left join store.materialInfo mat  where 1 = 1 ");
		List<Object> values = new ArrayList<Object>();
		
		//查询码（药品名称/拼音/五笔/药品编码）、药品分类、药品性质、药品规格、库房、有效期（默认<=）
		if(!StringUtils.isEmpty(query.getTradeName())){
			jql.append("and (store.tradeName like ? or mat.commonSpell like ? or mat.commonWb like ? or store.materialCode like ? or mat.barcode = ? ) ");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add(query.getTradeName());
		}
		if(StringUtils.isNotBlank(query.getMaterialInfo())&& StringUtils.isNotBlank(query.getMaterialInfo().getId())){
			jql.append(" and mat.id = ?");
			values.add(query.getMaterialInfo().getId());
		}
		if(StringUtils.isNotEmpty(query.getMaterialCode())){
			jql.append(" and store.materialCode = ?");
			values.add(query.getMaterialCode());
		}
		if(StringUtils.isNotEmpty(query.getDeptId())){
			jql.append(" and store.deptId = ?");
			values.add(query.getDeptId());
		}
		if(StringUtils.isNotEmpty(query.getHosId())){
			jql.append(" and store.hosId = ?");
			values.add(query.getHosId());
		}
		
		if( query.getMaterialInfo() != null){
			if( !StringUtils.isNotEmpty(query.getMaterialInfo().getId())){
				jql.append("and mat.id = ? ");
				values.add(query.getMaterialInfo().getId());
			}
		}
		
		List<MatStoreSumInfo> models = matStoreSumInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	/**
	 * 查询列表--本院库存
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/loadHosSum", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forloadHosSum(@RequestParam(value = "data", defaultValue = "") String data) {
		System.out.println(data);
		MatStoreSumInfo query =  JSONUtils.deserialize(data, MatStoreSumInfo.class);
		StringBuilder jql = new StringBuilder( " select sum(storeSum),materialCode,hosId from MatStoreSumInfo group by hosId,materialCode having hosId=? and materialCode = ? ");
		List<Object> values = new ArrayList<Object>();
		System.out.println(query);
		
		values.add(query.getHosId());
		values.add(query.getMaterialCode());
		
		
		List<MatStoreSumInfo> models = matStoreSumInfoManager.find(jql.toString(), values.toArray());
		return ResultUtils.renderSuccessResult(models);
	}
	
	
	/**
	 * 更新
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		MatStoreSumInfo model =  JSONUtils.deserialize(data, MatStoreSumInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Date now =  new Date();
		HcpUser user = this.getCurrentUser();
		model.setUpdateOper(user.getName());
		model.setUpdateTime(now);
//		PhaMatInfo info = this.phaMatInfoManager.get(model.getMatInfo().getId());
//		model.setMatInfo(info);
		this.matStoreSumInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	// 只允许更新部分字段
	@RequestMapping(value = "/saveEdit", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSaveEdit(@RequestBody String data) {
		try {
			List<MatStoreSumInfo> inputList =  (List<MatStoreSumInfo>) JSONUtils.parseObject(data,new TypeReference< List<MatStoreSumInfo>>(){});
			if (inputList==null){
				throw new RuntimeException("不存在inputList对象");
			}
			List<MatStoreSumInfo> storeSumInfoList = new ArrayList<>();
	
			for( MatStoreSumInfo input : inputList ) {
				if(input==null || StringUtils.isBlank(input.getId())){
					throw new RuntimeException("不存在input对象");
				}
				
				// 先查再更新，只更新部分字段，不影响其他字段
				MatStoreSumInfo storeSumInfo = (MatStoreSumInfo) matStoreSumInfoManager.get(input.getId());
				if (storeSumInfo == null) {
					throw new RuntimeException("未找到【"+input.getTradeName()+"】库存明细记录");
				}
//				PhaMatInfo MatInfo = (PhaMatInfo) phaMatInfoManager.get(inputInfo.getMaterialId());
				
				// 警戒库存量、药品位置、停用标志
				BigDecimal inputNum = input.getAlertNum();
				if (inputNum == null) inputNum = new BigDecimal(0);
//				BigDecimal packQty = new BigDecimal(input.getMatInfo().getPackQty());
//				BigDecimal alertNum = inputNum.multiply(packQty);
				
				storeSumInfo.setAlertNum(inputNum);
				storeSumInfo.setLocation(input.getLocation());
				storeSumInfo.setStop(input.isStop());
				storeSumInfoList.add(storeSumInfo);
			}

			matStoreSumInfoManager.batchSave(storeSumInfoList);
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult("保存成功");
	}
}
