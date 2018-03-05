package com.lenovohit.bdrp.org.dao;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.bdrp.ApplicationTests;
import com.lenovohit.bdrp.org.model.Person;
import com.lenovohit.core.dao.GenericDao;


public class PersonDaoTest extends ApplicationTests {
	
	@Autowired
	private GenericDao<Person, String> personDao;
	
//	@Test
//	public void testSave(){
//		Org o = new Org();
//		o.setId("8a81e4aa4ed82de0014ed82e98180000");
//		o.setName("update");
//		o.setEnName("aaa");
//		
//		this.personDao.save(o);
//	}
//	
//	@Test
//	public void testGet(){
//		String id = "8a81e4aa4ed82de0014ed82e98180000";
//		Org o = this.personDao.get(id);
//		Assert.notNull(o, "is null");
//	}
	
	
	@Test
	public void testFindAll(){
		List<Person> lst = this.personDao.findAll();
		for(Person o : lst){
			System.out.println(o.getId());
		}
	}
}
