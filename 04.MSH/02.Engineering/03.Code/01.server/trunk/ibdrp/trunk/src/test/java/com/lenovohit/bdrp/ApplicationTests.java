package com.lenovohit.bdrp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.lenovohit.core.IcoreApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = IcoreApplication.class)
@WebIntegrationTest(randomPort = false)
@DirtiesContext
public class ApplicationTests {
	
	protected transient final Log log = LogFactory.getLog(getClass());
	
	@Test
	public void contextLoads() {
	}

}
