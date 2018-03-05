package com.infohold.ebpp.bill.manager;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.DateUtils;
import com.infohold.ebpp.bill.ApplicationTests;
import com.infohold.ebpp.bill.model.BizChannel;

public class BizChannelManagerTest extends ApplicationTests{
	@Autowired
	private GenericManager<BizChannel, String> bizChannelManager;
	
	@Test
	public void testFindByJql(){
		String jql = "from BizChannel where name like ? ";
		List<BizChannel> lst = (List<BizChannel>) this.bizChannelManager.findByJql(jql, "a");
		
		Assert.notNull(lst);
	}
	
	
	@Test
	public void testSave(){
		BizChannel bc = new BizChannel();
		
		bc.setCode("000003");
		bc.setName("哈哈");
		bc.setStatus(BizChannel.STATUS_DISABLED);
		bc.setRegistedOn(DateUtils.getCurrentDateStr());
		
		this.bizChannelManager.save(bc);
		
		Assert.notNull(bc);
	}
	
	
	@Test
	public void testGet(){
		
		String code = "000003";
		BizChannel bc = this.bizChannelManager.get(code);
		
		Assert.notNull(bc);
		log.info(bc.getName());
	}
}
