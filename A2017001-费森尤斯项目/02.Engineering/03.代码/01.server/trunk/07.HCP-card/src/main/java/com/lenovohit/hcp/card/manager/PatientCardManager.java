/**
 * 
 */
package com.lenovohit.hcp.card.manager;

import com.lenovohit.hcp.card.model.Patient;

/**
 * @author duanyanshan
 * @date 2017年11月14日 下午7:25:08
 */
public interface PatientCardManager {
	
	public Patient createCard(Patient model);
	
	public Patient updateCard(Patient model);

}
