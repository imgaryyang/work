package com.infohold.bdrp.org.dao;

import java.util.List;

import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import com.infohold.bdrp.org.model.Org;
import com.infohold.core.IcoreApplication;
import com.infohold.core.dao.GenericDao;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=IcoreApplication.class)
@WebIntegrationTest
@FixMethodOrder(value=MethodSorters.NAME_ASCENDING)
public class OrgDaoTest{
	
	@Autowired
	private GenericDao<Org, String> orgDao;
	
	@Test
	public void testSave(){
		Org o = new Org();
		o.setId("8a81e4aa4ed82de0014ed82e98180000");
		o.setName("update");
		o.setEnName("aaa");
		
		this.orgDao.save(o);
	}
	
	@Test
	public void testGet(){
		String id = "8a81e4aa4ed82de0014ed82e98180000";
		Org o = this.orgDao.get(id);
		Assert.notNull(o, "is null");
	}
	
	
	@Test
	public void testFindAll(){
		List<Org> lst = this.orgDao.findAll();
		for(Org o : lst){
			System.out.println(o.getId());
		}
	}
}
