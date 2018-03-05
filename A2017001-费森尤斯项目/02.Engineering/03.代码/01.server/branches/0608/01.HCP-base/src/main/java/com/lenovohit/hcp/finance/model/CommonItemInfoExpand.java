package com.lenovohit.hcp.finance.model;

import com.lenovohit.hcp.base.model.CommonItemInfo;

/**    
 *         
 * 类描述：   收费中除了CommonItemInfo中的基本信息
 * 			还有可能含有其他相关信息所以在此做扩展
 *@author GW
 *@date 2017年4月27日          
 *     
 */
public class CommonItemInfoExpand extends CommonItemInfo{

	private String recipeDept;
	private String recipeDoc;
	private String feeType;
	
	public String getFeeType() {
		return feeType;
	}
	
	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}
	
	public String getRecipeDept() {
		return recipeDept;
	}
	
	public void setRecipeDept(String recipeDept) {
		this.recipeDept = recipeDept;
	}
	
	public String getRecipeDoc() {
		return recipeDoc;
	}
	
	public void setRecipeDoc(String recipeDoc) {
		this.recipeDoc = recipeDoc;
	}
}
