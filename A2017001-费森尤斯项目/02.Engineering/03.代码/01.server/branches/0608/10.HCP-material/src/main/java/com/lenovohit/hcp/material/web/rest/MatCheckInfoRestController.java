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
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.material.manager.MatCheckinfoManager;
import com.lenovohit.hcp.material.model.MatCheckInfo;
import com.lenovohit.hcp.material.model.MatStoreInfo;

@RestController
@RequestMapping("/hcp/material/matCheckInfo")
public class MatCheckInfoRestController extends HcpBaseRestController {
	
	@Autowired
	private GenericManager<MatCheckInfo, String> matCheckInfoManager;
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	@Autowired
	private MatCheckinfoManager matCheckInfoManagerImpl;
	/**
	 * 分页查询
	 * @param start
	 * @param limit
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{type}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("type") String type,@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		MatCheckInfo query =  JSONUtils.deserialize(data, MatCheckInfo.class);
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getLoginDepartment().getHosId();

		StringBuilder jql = new StringBuilder( " from MatCheckInfo check where check.deptId = ? and check.hosId = ? ");
		values.add(deptId);
		values.add(hosId);
		if("check".equalsIgnoreCase(type)){//查询盘点中的状态
			jql.append("and ( check.checkState = ? or check.checkState = ?)");
			values.add("1");//开始状态
			values.add("2");//录入保存
		} else{//查询盘点记录
			jql.append("and ( check.checkState != ? AND check.checkState != ?)");
			values.add("1");//开始状态
			values.add("2");//录入保存
		}
		
		if(!StringUtils.isEmpty(query.getMaterialType())){
			jql.append(" and check.materialType like ? ");
			values.add("%"+query.getMaterialType()+"%");
		}
		if(!StringUtils.isEmpty(query.getTradeName())){
			jql.append(" and ( materialInfo.commonName like ? or materialInfo.commonSpell like ?  or materialInfo.commonWb like ? or materialInfo.barcode like ? ) ");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
			values.add("%"+query.getTradeName()+"%");
		}
		jql.append(" order by check.createTime desc ");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		System.out.println(jql.toString());
		matCheckInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 查询单项
	 * @param id
	 * @return
	 */ 
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		MatCheckInfo model= matCheckInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**    
	 * 功能描述：生成盘点单（封账的查询）
	 *@return       
	 *@author GW
	 *@date 2017年5月12日             
	*/
	@RequestMapping(value = "/getBill", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getBill(){
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getLoginDepartment().getHosId();
		List<MatCheckInfo> checkList = undoneCheckInfoList(hosId, deptId);
		
		String checkBill = "";
		if(checkList!=null && checkList.size()>0){
			checkBill = checkList.get(0).getCheckBill();
		}else{
			checkBill = redisSequenceManager.get("PHA_ADJUST", "ADJUST_BILL");	//生成盘点号(单次封存盘点号相同)
		}
		return ResultUtils.renderSuccessResult(checkBill);
	}
	
	/**    
	 * 功能描述：生成盘点单
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	@RequestMapping(value="/create/{bill}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateCheckInfo(@PathVariable("bill") String checkBill){
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getLoginDepartment().getHosId();
		List<MatCheckInfo> checkList = undoneCheckInfoList(hosId, deptId);
		if(checkList==null||checkList.size()<1){//判断是否有未完成盘点   无未完成盘点执行
			try {
				//盘点列表
				List<MatCheckInfo> checkInfoList =  new ArrayList<MatCheckInfo>();
				//查询条件列表
				List<Object> values = new ArrayList<Object>();
				StringBuilder jql = new StringBuilder( " from MatStoreInfo where stop = '1' AND DATEDIFF(day ,updateTime,getdate())<180 ");
				if(!StringUtils.isEmpty(deptId)){
					jql.append(" and deptId = ?");
					values.add(deptId);
				}
				if(!StringUtils.isEmpty(hosId)){
					jql.append(" and hosId = ?");
					values.add(hosId);
				}
				List<MatStoreInfo> storeInfoList = matStoreInfoManager.find(jql.toString(), values.toArray());
				//封装插入的盘点单
				if(storeInfoList!=null&&storeInfoList.size()>0){//本人所在科室是否有物资信息
					if(!StringUtils.isEmpty(checkBill)){
						for(MatStoreInfo storeInfo:storeInfoList){
							MatCheckInfo model = new MatCheckInfo();
							//将药库相关信息对应赋值到盘点单中
							model.setHosId(hosId);		//医院id
							model.setDeptId(deptId);	//科室id
							model.setMaterialInfo(storeInfo.getMaterialInfo());			//主要获取MaterialId
							model.setCheckBill(checkBill);						//盘点单号
							model.setStoreId(storeInfo.getStoreId());			//库存id
							model.setMaterialType(storeInfo.getMaterialType());			//物资类型
							model.setMaterialCode(storeInfo.getMaterialCode());			//物资编号
							model.setTradeName(storeInfo.getTradeName());		//物资名称
							model.setMaterialSpecs(storeInfo.getMaterialSpecs());				//物资规格
							model.setBatchNo(storeInfo.getBatchNo());			//批次
							model.setApprovalNo(storeInfo.getApprovalNo());		//批号
							model.setProduceDate(storeInfo.getProduceDate());	//生产日期
							if(storeInfo.getCompanyInfo()!=null){
								model.setProducer(storeInfo.getCompanyInfo().getId());		//生产厂家
							}
							model.setValidDate(storeInfo.getValidDate());	//有效期
							model.setBuyPrice(storeInfo.getBuyPrice());		//采购价
							model.setSalePrice(storeInfo.getSalePrice());	//零售价
							model.setLocation(storeInfo.getLocation());		//物资位置
							model.setStartSum(storeInfo.getStoreSum());		//开始数量
							model.setMinUnit(storeInfo.getMinUnit());		//最小单位
							model.setCheckState("1");//盘点状态（1：开始盘点 2：录入保存 3：作废 4：结束盘点）
							
							Date now =  new Date();
							model.setCreateOper(user.getName());
							model.setCreateTime(now);
							model.setUpdateOper(user.getName());
							model.setUpdateTime(now);
							checkInfoList.add(model);
						}
						//向盘点表插入盘点单
						this.matCheckInfoManager.batchSave(checkInfoList);
					}else{
						return ResultUtils.renderFailureResult("无法生成盘点单号，请刷新后重试尝试！！");
					}
				}else{
					return ResultUtils.renderFailureResult("当前登录科室库房中没有物资，不能封账生成盘点单！！");
				}
				return ResultUtils.renderSuccessResult();
				
			} catch (Exception e) {
				e.printStackTrace();
				return ResultUtils.renderFailureResult("生成盘点单错误！！");
			}
		}else{//有未完成盘点给出提示
			return ResultUtils.renderFailureResult("您有未完成盘点，不能进行封账！！");
		}
		
	}
	
	/**    
	 * 功能描述：填写完盘点单
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年3月24日             
	*/
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		HcpUser user = this.getCurrentUser();
		String hosId = user.getHosId();
		String deptId = user.getLoginDepartment().getId();
		//判断是否有盘点单
		List<MatCheckInfo> checkList =undoneCheckInfoList(hosId, deptId);
		if(checkList!=null&&checkList.size()>0){
			List<MatCheckInfo> checkInfoList = JSONUtils.parseObject(data, new TypeReference<List<MatCheckInfo>>(){});
			if(checkInfoList==null || checkInfoList.size()<0){
				return ResultUtils.renderFailureResult("盘点单信息读取错误，请重新填写！！！");
			}else{
				updateCheckinfo(checkInfoList);
			}
			return ResultUtils.renderSuccessResult();
		}else{
			return ResultUtils.renderFailureResult("不存在未结存的盘点单！！");
		}
	}

	/**    
	 * 功能描述：更行列表中盘点数据
	 *@param checkInfoList       
	 *@author GW
	 *@date 2017年5月19日             
	*/
	private void updateCheckinfo(List<MatCheckInfo> checkInfoList) {
		HcpUser user = this.getCurrentUser();
		Date now =  new Date();
		for(MatCheckInfo model:checkInfoList){
			BigDecimal writeSum = model.getWriteSum();
			//包装数量
//			Integer packQty = model.getMatInfo().getPackQty();
			//整盒包装数量
			Integer packSum = model.getPackSum();
			//零散数量
			Integer miniSum = model.getMiniSum();
			
			if(packSum==null&&miniSum==null){//本次操作没有对数据进行修改
				if(writeSum==null){//没有暂存直接盘清
					writeSum = model.getStartSum();
				}
			}else{
				if(miniSum==null){
					miniSum = 0;
				}
				if(packSum==null){
					packSum = 0;
				}
//				writeSum = new BigDecimal(packSum*packQty+miniSum);
			}
			model.setWriteSum(writeSum);
			//盈亏标志修改
			if(model.getWriteSum()!=null){//盘点单已录入
				model.setEndSum(model.getWriteSum());
				if(model.getWriteSum().compareTo(model.getStartSum())==1){//录入数量大于开始数量
					model.setProfitFlag(1);
				}else if(model.getWriteSum().compareTo(model.getStartSum())==-1){//录入数量小于开始数量
					model.setProfitFlag(-1);
				}else{//录入和库存数量相同
					model.setProfitFlag(0);
				}
			}
			
			model.setUpdateOper(user.getName());
			model.setUpdateTime(now);
			model.setCheckState("2");
		}
		//批量更新
		this.matCheckInfoManager.batchSave(checkInfoList);
	}
	
	/**    
	 * 功能描述：盘点作废
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	@RequestMapping(value = "/removeCheck",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result removeCheck(){
		HcpUser user = this.getCurrentUser();
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getLoginDepartment().getHosId();
		List<MatCheckInfo> checkInfoList = undoneCheckInfoList(hosId,deptId);
		try {
			if(checkInfoList!=null&&checkInfoList.size()>0){//判断是否存在未完成盘点单
				List<MatCheckInfo> checkList  = new ArrayList<MatCheckInfo>();
			for(MatCheckInfo model:checkInfoList){
				model.setCheckState("3");//作废
				checkList.add(model);
			}
			//更新数据位作废
			this.matCheckInfoManager.batchSave(checkList);
			}else{
				return ResultUtils.renderFailureResult("作废盘点操作失败：当前科室没有盘点单！！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("作废盘点操作失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	/**    
	 * 功能描述：盘点结清
	 *@param data
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	@RequestMapping(value = "/finish",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result finishCheckInfo(@RequestBody String data){
		HcpUser user = this.getCurrentUser();
		List<MatCheckInfo> checkInfoData = JSONUtils.parseObject(data, new TypeReference<List<MatCheckInfo>>(){});
		//如果提交上来的数据有所更改首先更新数据，然后盘清
		updateCheckinfo(checkInfoData);
		//获取当前登录人科室和医院id作为生成盘点单的依据
		String deptId = user.getLoginDepartment().getId();
		String hosId = user.getLoginDepartment().getHosId();
		List<MatCheckInfo> checkInfoList = undoneCheckInfoList(hosId,deptId);
		try {
			if(checkInfoList!=null&&checkInfoList.size()>0){//判断是否存在
				List<MatCheckInfo> checkList  = new ArrayList<MatCheckInfo>();
				for(MatCheckInfo model:checkInfoList){
					model.setCheckState("4");//完成
					if(model.getWriteSum()!=null){//盘点单已录入
						model.setEndSum(model.getWriteSum());
						if(model.getWriteSum().compareTo(model.getStartSum())==1){//录入数量大于开始数量
							model.setProfitFlag(1);
						}else if(model.getWriteSum().compareTo(model.getStartSum())==-1){//录入数量小于开始数量
							model.setProfitFlag(-1);
						}else{//录入和库存数量相同
							model.setProfitFlag(0);
						}
						checkList.add(model);
					}else{//若录入数量为空时录入结清数量与库存数量相同,盈亏标志设为0
						model.setWriteSum(model.getStartSum());
						model.setEndSum(model.getStartSum());
						model.setProfitFlag(0);
						checkList.add(model);
					}
				}
				//更新数据信息
				matCheckInfoManagerImpl.updateStockInfo(checkList, user);
			}else{
				return ResultUtils.renderFailureResult("结清操作失败：当前科室没有正在进行中的盘点单！！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("结清失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	/**    
	 * 功能描述：正在进行中的盘点
	 *@param hosId 医院id
	 *@param deptId 科室id
	 *@return       
	 *@author gw
	 *@date 2017年3月23日             
	*/
	private List<MatCheckInfo> undoneCheckInfoList(String hosId,String deptId){
		StringBuilder jql = new StringBuilder( "from MatCheckInfo where 1=1 ");
		List<Object> values  = new ArrayList<Object>();
		if(!StringUtils.isEmpty(hosId)){
			jql.append("and hosId = ? ");
			values.add(hosId);
		}
		if(!StringUtils.isEmpty(deptId)){
			jql.append("and deptId = ? ");
			values.add(deptId);
		}
		//未完成条件添加
		jql.append("and ( checkState = ? or checkState = ?)");
		values.add("1");//开始状态
		values.add("2");//录入保存
		
		List<MatCheckInfo> checkInfoList = (List<MatCheckInfo>) matCheckInfoManager.find(jql.toString(), values.toArray());
		return checkInfoList;
	}
	
	
}
