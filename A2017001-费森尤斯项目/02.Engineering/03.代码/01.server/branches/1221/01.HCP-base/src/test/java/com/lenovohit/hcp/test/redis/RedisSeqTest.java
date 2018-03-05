package com.lenovohit.hcp.test.redis;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.RedisSequence;
import com.lenovohit.hcp.test.BaseTest;

public class RedisSeqTest extends BaseTest {
	
	@Autowired
	private IRedisSequenceManager redisSequenceManager;

	@Test
	public void testGetSeq() {
		String hosId = redisSequenceManager.get("B_HOSINFO", "HOS_ID");
		String deptId = redisSequenceManager.get("B_DEPTINFO", "DEPT_ID");
		String patientId = redisSequenceManager.get("B_PATIENTINFO", "PATIENT_ID");
		String recipeId = redisSequenceManager.get("OC_CHARGEDETAIL", "RECIPE_ID");
		RedisSequence comboNo = redisSequenceManager.getSeq("ITEM_GROUP_DETAIL", "COMBO_NO");
		
		System.out.println(hosId);
	}

}
