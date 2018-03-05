/**
 * 
 */
package com.lenovohit.hcp.card.manager.impl;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.card.manager.PatientCardManager;
import com.lenovohit.hcp.card.model.Card;
import com.lenovohit.hcp.card.model.Patient;

/**
 * @author duanyanshan
 * @date 2017年11月14日 下午7:26:35
 */
@Service
@Transactional
public class PatientCardManagerImpl implements PatientCardManager{
	
	@Autowired
	private GenericManager<Patient, String> patientManager;
	
	@Autowired
	private GenericManager<Card, String> cardManager;

	/* (non-Javadoc)
	 * @see com.lenovohit.hcp.card.manager.PatientCardManager#createCard(com.lenovohit.hcp.card.model.Patient)
	 */
	@Override
	public Patient updateCard(Patient model) {
		try{
			if(StringUtils.isNotBlank(model.getLeaveCause())){
				if(StringUtils.isEmpty(model.getLeaveTime())){//如果填写了转出原因没有填写转出时间默认为当天
					model.setLeaveTime(new Date());
				}
			}
			Patient saved = this.patientManager.save(model);

			//保存就诊卡信息
			if (!StringUtils.isEmpty(saved.getMedicalCardNo())) {
				//查询有没有正在使用的卡
				List<Card> cards = cardManager.find("from Card where patientId = ? and cardFlag = ?", saved.getPatientId(), "1");
				if (cards.size() > 0) {
					Card card = cards.get(0);
					if (!card.getCardNo().equals(saved.getMedicalCardNo())) { // 换卡
						// 原卡挂起
						card.setCardFlag("2");
						this.cardManager.save(card);
						// 新建卡
						this.createNewCard(saved);
					} else { // 修改卡信息
						card.setName(saved.getName());
						this.cardManager.save(card);
					}
				} else { // 新建卡
					this.createNewCard(saved);
				}
			}
			return saved;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			throw new RuntimeException("修改用户信息出错！");
		}
	}
	
	private Card createNewCard(Patient patient) {
		Card card = new Card();
		card.setPatientId(patient.getPatientId());
		card.setName(patient.getName());
		card.setCardNo(patient.getMedicalCardNo());
		card.setCardFlag("1");
		card.setCardType("1");
		card = this.cardManager.save(card);
		return card;
	}

	/* (non-Javadoc)
	 * @see com.lenovohit.hcp.card.manager.PatientCardManager#createCard(com.lenovohit.hcp.card.model.Patient)
	 */
	@Override
	public Patient createCard(Patient model) {
		
		try{
			/*StringBuffer no = new StringBuffer("MZ");
			for(int i = 0 ; i < 10 ; i += 1) {
				no.append((int)(10*(Math.random())));
			}*/
			/*String patientId = redisSequenceManager.get("B_PATIENTINFO", "PATIENT_ID");
			System.out.println("PatientRestController() - patientId:" + patientId);*/

			//保存患者对象
			Patient saved = this.patientManager.save(model);
			
			//保存就诊卡信息
			if (!StringUtils.isEmpty(saved.getMedicalCardNo())) {
				Card card = new Card();
				card.setPatientId(saved.getPatientId());
				card.setName(saved.getName());
				card.setCardNo(saved.getMedicalCardNo());
				card.setCardFlag("1");
				card.setCardType("1");
				this.cardManager.save(card);
			}
			return saved;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			throw new RuntimeException("建档失败！！");
		}
		
	}

}
