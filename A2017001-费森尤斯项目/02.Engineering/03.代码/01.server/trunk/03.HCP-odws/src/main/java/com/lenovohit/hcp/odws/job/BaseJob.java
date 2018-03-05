package com.lenovohit.hcp.odws.job;

/**
 * @author duanyanshan
 * 2015-10-14上午09:38:43
 */
public abstract class BaseJob {
	
	public void jobMethod() {
		try {
			doJob();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected abstract void doJob();

}
