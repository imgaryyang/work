
'use strict';

import React from 'react-native';

import SampleList 			from './view/sample/list';
import WebView 				from './view/sample/WebViewSample';
import EmpSalaryList 		from './view/empSalary/SalaryList';
import BossSalaryList 		from './view/bossSalary/SalaryList';
import EmployeeList 		from './view/employee/employee-list';
import WelfareList 			from './view/welfare/list';
import WelfareListEmp 		from './view/welfare/listemp';
import ReimburseMng 		from './view/reimburseMng/ReimburseMng';
import TransferMng 			from './view/mng/TransferMng';
import CreditCrad 			from './view/creditCard/CreditCard';
import EmpVacaList          from './view/vacation/empVacaList';
import BossVacaMng			from './view/vacation/bossVacaMng';
import MovieHome			from './iMovie/Home';



/**
 * 系统提供的服务
 * basic - 基础金融服务
 * boss  - 企业主服务
 * empl  - 员工端服务
 */
export const services = {
	fixed: [
		{code: 'f01', name: '账单', 			icon: 'navicon', 			iconSize: 28, iconColor: '#FFFFFF', component: null, 				hideNavBar: false, navTitle: '账单',},
		{code: 'f02', name: '收款', 			icon: 'download', 			iconSize: 28, iconColor: '#FFFFFF', component: null, 				hideNavBar: false, navTitle: '收款',},
		{code: 'f03', name: '付款', 			icon: 'credit-card-alt', 	iconSize: 24, iconColor: '#FFFFFF', component: null, 				hideNavBar: false, navTitle: '付款',},
		{code: 'f04', name: '扫一扫', 		icon: 'barcode', 			iconSize: 28, iconColor: '#FFFFFF', component: null, 				hideNavBar: false, navTitle: '扫一扫',},
	],
	basic: [
		{code: '001', name: '转账', 			icon: 'random', 			iconSize: 23, iconColor: '#FF6600', component: TransferMng, 		hideNavBar: false, navTitle: '转账',},
		{code: '002', name: '信用卡还款', 	icon: 'calendar-check-o', 	iconSize: 23, iconColor: '#FF6600', component: CreditCrad, 			hideNavBar: true,  navTitle: '信用卡还款',},
		{code: '003', name: '生活缴费', 		icon: 'fire', 				iconSize: 28, iconColor: '#FF6600', component: null, 				hideNavBar: false, navTitle: '生活缴费',},
		{code: '004', name: '手机充值', 		icon: 'mobile', 			iconSize: 33, iconColor: '#FF6600', component: null, 				hideNavBar: false, navTitle: '手机充值',},
		{code: '005', name: '影票', 			icon: 'film', 				iconSize: 22, iconColor: '#FF6600', component: MovieHome, 			hideNavBar: true,  navTitle: '首页',},
		{code: '006', name: '城市服务', 		icon: 'fort-awesome', 		iconSize: 22, iconColor: '#FF6600', component: null, 				hideNavBar: false, navTitle: '城市服务',},
		{code: '901', name: '样例', 			icon: 'space-shuttle', 		iconSize: 25, iconColor: '#FF6600', component: SampleList, 			hideNavBar: true,  navTitle: '样例',},
		{code: '902', name: 'WebView', 		icon: 'chrome', 			iconSize: 23, iconColor: '#FF6600', component: WebView, 			hideNavBar: true,  navTitle: 'WebView',},
	],
	boss: [
		{code: '101', name: '员工', 			icon: 'group', 				iconSize: 20, iconColor: '#FF6600', component: EmployeeList, 		hideNavBar: true, navTitle: '员工',},
		{code: '102', name: '薪酬', 			icon: 'credit-card', 		iconSize: 23, iconColor: '#FF6600', component: BossSalaryList, 		hideNavBar: false, navTitle: '薪酬',},
		{code: '103', name: '报销', 			icon: 'paper-plane', 		iconSize: 25, iconColor: '#FF6600', component: ReimburseMng, 		hideNavBar: false, navTitle: '报销',},
		{code: '104', name: '福利', 			icon: 'gift', 				iconSize: 28, iconColor: '#FF6600', component: WelfareList, 		hideNavBar: true, navTitle: '福利',},
		{code: '105', name: '休假管理', 		icon: 'calendar', 			iconSize: 23, iconColor: '#FF6600', component: BossVacaMng, 		hideNavBar: false, navTitle: '休假管理',},
		{code: '106', name: '记账', 			icon: 'calculator', 		iconSize: 23, iconColor: '#FF6600', component: null, 				hideNavBar: false, navTitle: '记账',},
		{code: '107', name: '报表', 			icon: 'dashboard', 			iconSize: 25, iconColor: '#FF6600', component: null, 				hideNavBar: false, navTitle: '报表',},
	],
	empl: [
		{code: '201', name: '薪酬', 			icon: 'credit-card', 		iconSize: 23, iconColor: '#FF6600', component: EmpSalaryList, 		hideNavBar: false, navTitle: '薪酬',},
		{code: '202', name: '报销', 			icon: 'paper-plane', 		iconSize: 25, iconColor: '#FF6600', component: ReimburseMng, 		hideNavBar: false, navTitle: '报销',},
		{code: '203', name: '福利', 			icon: 'gift', 				iconSize: 28, iconColor: '#FF6600', component: WelfareListEmp, 		hideNavBar: true, navTitle: '福利',},
		{code: '204', name: '请假', 			icon: 'calendar', 			iconSize: 23, iconColor: '#FF6600', component: EmpVacaList, 		hideNavBar: true, navTitle: '请假',},
	],
};
