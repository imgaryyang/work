/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2016/7/12 21:55:24                           */
/*==============================================================*/


drop table if exists ELS_ORG;

drop table if exists ELS_PAY_AGREEMENT;

drop table if exists ELS_PAY_BATCH;

drop table if exists ELS_PAY_BATCHINFO;

drop table if exists ELS_PAY_PREVIEW;

drop table if exists ELS_PER_MNG;

drop table if exists ELS_PER_PREVIEW;

drop table if exists ELS_STUB_BATCH;

drop table if exists ELS_STUB_BATCHINFO;

drop table if exists ELS_STUB_PREVIEW;

drop table if exists ELS_STUB_TEMPLATE;

drop table if exists ELS_STUB_TEMPLATEINFO;

/*==============================================================*/
/* Table: ELS_ORG                                               */
/*==============================================================*/
create table ELS_ORG
(
   ID                   CHAR(32) not null,
   CODE                 CHAR(10) not null,
   NAME                 VARCHAR(100) not null,
   ORG_TYPE             CHAR(1) comment '1 - 政府机构
            2 - 事业单位
            3 - 企业单位
            4 - 教育机构
            5 - 金融机构',
   LINKMAN              VARCHAR(50),
   LM_CONTACT_WAY       VARCHAR(100),
   ZIPCODE              CHAR(6),
   ADDRESS              VARCHAR(200),
   SALESMAN             VARCHAR(50),
   SM_CONTACT_WAY       VARCHAR(100),
   STATE                CHAR(1) comment '1 - 正常
            2 - 已下线',
   MEMO                 VARCHAR(500),
   CREATED_AT           CHAR(19),
   primary key (ID)
);

/*==============================================================*/
/* Table: ELS_PAY_AGREEMENT                                     */
/*==============================================================*/
create table ELS_PAY_AGREEMENT
(
   id                   char(32) not null,
   org_id               char(32) not null,
   agreement_id         char(32) not null,
   bank_id              CHAR(32),
   bank_no              char(10) not null,
   bank_name            char(48) not null,
   acct_no              char(32),
   acct_no_enc          char(50) not null,
   acct_no_hash         char(50) not null,
   acct_name            char(48) not null,
   state                char(1) comment '0-失效
            1-正常',
   effective_date       char(10),
   expiry_date          char(10),
   primary key (id)
);

alter table ELS_PAY_AGREEMENT comment 'ELS_PAY_AGREEMENT--代发协议表';

/*==============================================================*/
/* Table: ELS_PAY_BATCH                                         */
/*==============================================================*/
create table ELS_PAY_BATCH
(
   id                   char(32) not null,
   ORG_ID               CHAR(32),
   batch_no             char(20) not null,
   month                char(6) not null,
   num                  integer,
   amount               decimal(18,2),
   state                char(1) not null comment '0	新建
            1	审核
            2	提交
            3	完成',
   submit_time          char(19),
   pay_time             char(19),
   succ_num             integer,
   succ_amount          decimal(18,2),
   note                 char(200),
   primary key (id)
);

alter table ELS_PAY_BATCH comment 'ELS_PAY_BATCH--发放批次表';

/*==============================================================*/
/* Table: ELS_PAY_BATCHINFO                                     */
/*==============================================================*/
create table ELS_PAY_BATCHINFO
(
   id                   char(32) not null,
   per_id               char(32) not null,
   batch_id             char(32) not null,
   batch_no             char(20) not null,
   month                char(6) not null,
   name                 char(48) not null,
   acct_no              char(32),
   acct_no_enc          char(50) not null,
   acct_no_hash         char(50) not null,
   amount               decimal(18,2),
   pay_time             char(19),
   pay_state            char(1) comment '0	待发放
            1	发放成功
            2	发放失败',
   state_memo           char(128),
   primary key (id)
);

alter table ELS_PAY_BATCHINFO comment 'ELS_PAY_BATCHINFO--发放批次明细表';

/*==============================================================*/
/* Table: ELS_PAY_PREVIEW                                       */
/*==============================================================*/
create table ELS_PAY_PREVIEW
(
   id                   char(32) not null,
   per_id               char(32) not null,
   batch_id             char(32) not null,
   batch_no             char(20) not null,
   month                char(6) not null,
   name                 char(48) not null,
   acct_no              char(32),
   amount               decimal(18,2),
   primary key (id)
);

alter table ELS_PAY_PREVIEW comment 'ELS_PAY_PREVIEW--发放明细文件导入预览表';

/*==============================================================*/
/* Table: ELS_PER_MNG                                           */
/*==============================================================*/
create table ELS_PER_MNG
(
   id                   char(32) not null,
   ORG_ID               CHAR(32),
   id_no                char(18),
   id_no_enc            char(50) not null,
   id_no_hash           char(50) not null,
   name                 char(48) not null,
   bank_no              char(10),
   bank_name            char(48),
   acct_no              char(32),
   acct_no_enc          char(50) not null,
   acct_no_hash         char(50) not null,
   department           char(48),
   mobile               char(20),
   mobile_enc           char(50),
   mobile_hash          char(50),
   state                char(1) comment '1 - 正常
            0 - 失效   离职后原公司删除',
   effective_time       char(19),
   expiry_time          char(19),
   primary key (id)
);

alter table ELS_PER_MNG comment 'ELS_PER_MNG--人员管理表';

/*==============================================================*/
/* Table: ELS_PER_PREVIEW                                       */
/*==============================================================*/
create table ELS_PER_PREVIEW
(
   id                   char(32) not null,
   id_no                char(18),
   name                 char(48),
   bank_no              char(10),
   bank_name            char(48),
   acct_no              char(32),
   department           char(48),
   mobile               char(20),
   batch_no             char(32),
   primary key (id)
);

alter table ELS_PER_PREVIEW comment 'ELS_PER_PREVIEW--人员信息文件导入预览表';

/*==============================================================*/
/* Table: ELS_STUB_BATCH                                        */
/*==============================================================*/
create table ELS_STUB_BATCH
(
   id                   char(32) not null,
   org_id               CHAR(32),
   template_id          char(32) not null,
   template             char(48),
   batch_no             char(20) not null,
   month                char(6) not null,
   num                  integer,
   amount               decimal(18,2),
   state                char(1) not null comment '0	待发
            1	已发',
   submit_time          char(19),
   note                 char(200),
   primary key (id)
);

alter table ELS_STUB_BATCH comment 'ELS_STUB_BATCH--工资明细批次表';

/*==============================================================*/
/* Table: ELS_STUB_BATCHINFO                                    */
/*==============================================================*/
create table ELS_STUB_BATCHINFO
(
   id                   char(32) not null,
   per_id               char(32) not null,
   batch_id             char(32) not null,
   batch_no             char(20) not null,
   month                char(6) not null,
   id_no                char(18),
   id_no_enc            char(50) not null,
   id_no_hash           char(50) not null,
   name                 char(48) not null,
   note                 char(200),
   template_id          char(32),
   template             char(48),
   item1                char(48) comment '工资项值1到30对应工资模板中工资明细项的排列序号',
   item2                char(48),
   item3                char(48),
   item4                char(48),
   item5                char(48),
   item6                char(48),
   item7                char(48),
   item8                char(48),
   item9                char(48),
   item10               char(48),
   item11               char(48),
   item12               char(48),
   item13               char(48),
   item14               char(48),
   item15               char(48),
   item16               char(48),
   item17               char(48),
   item18               char(48),
   item19               char(48),
   item20               char(48),
   item21               char(48),
   item22               char(48),
   item23               char(48),
   item24               char(48),
   item25               char(48),
   item26               char(48),
   item27               char(48),
   item28               char(48),
   item29               char(48),
   item30               char(48),
   primary key (id)
);

alter table ELS_STUB_BATCHINFO comment 'ELS_STUB_BATCHINFO--工资明细批次明细表';

/*==============================================================*/
/* Table: ELS_STUB_PREVIEW                                      */
/*==============================================================*/
create table ELS_STUB_PREVIEW
(
   id                   char(32) not null,
   per_id               char(32) not null,
   batch_id             char(32) not null,
   batch_no             char(20) not null,
   month                char(6) not null,
   id_no                char(18) not null,
   name                 char(48) not null,
   note                 char(200),
   template_id          char(32),
   template             char(48),
   item1                char(48),
   item2                char(48),
   item3                char(48),
   item4                char(48),
   item5                char(48),
   item6                char(48),
   item7                char(48),
   item8                char(48),
   item9                char(48),
   item10               char(48),
   item11               char(48),
   item12               char(48),
   item13               char(48),
   item14               char(48),
   item15               char(48),
   item16               char(48),
   item17               char(48),
   item18               char(48),
   item19               char(48),
   item20               char(48),
   item21               char(48),
   item22               char(48),
   item23               char(48),
   item24               char(48),
   item25               char(48),
   item26               char(48),
   item27               char(48),
   item28               char(48),
   item29               char(48),
   item30               char(48),
   primary key (id)
);

alter table ELS_STUB_PREVIEW comment 'ELS_STUB_PREVIEW--工资明细文件导入预览表';

/*==============================================================*/
/* Table: ELS_STUB_TEMPLATE                                     */
/*==============================================================*/
create table ELS_STUB_TEMPLATE
(
   id                   char(32) not null,
   ORG_ID               CHAR(32),
   template             char(48) not null,
   create_at            char(19),
   primary key (id)
);

alter table ELS_STUB_TEMPLATE comment 'ELS_STUB_TEMPLATE--工资明细模板表';

/*==============================================================*/
/* Table: ELS_STUB_TEMPLATEINFO                                 */
/*==============================================================*/
create table ELS_STUB_TEMPLATEINFO
(
   id                   char(32) not null,
   template_id          char(32) not null,
   template             char(48) not null,
   seqno                integer not null comment '从1开始
            规则:
            第1项必为基本工资
            最后1项必为实发工资',
   item                 char(48) not null,
   is_amt               char(1) not null comment '0否
            1是',
   ioflag               char(1) not null comment '0扣
            1发',
   primary key (id)
);

alter table ELS_STUB_TEMPLATEINFO comment 'ELS_STUB_TEMPLATEINFO--工资明细模板明细表';

alter table ELS_PAY_AGREEMENT add constraint FK_ELS_PAYAGM_PAYBANK foreign key (bank_id)
      references EL_JOINED_BANK on delete restrict on update restrict;

alter table ELS_PAY_AGREEMENT add constraint FK_ELS_PAYAGM_PAYORG foreign key (org_id)
      references ELS_ORG (ID) on delete restrict on update restrict;

alter table ELS_PAY_BATCH add constraint FK_ELS_PAYBAT_ORG foreign key (ORG_ID)
      references ELS_ORG (ID) on delete restrict on update restrict;

alter table ELS_PAY_BATCHINFO add constraint FK_ELS_PAYINFO_PAYBAT foreign key (batch_id)
      references ELS_PAY_BATCH (id) on delete restrict on update restrict;

alter table ELS_PAY_BATCHINFO add constraint FK_ELS_PAYINFO_PER foreign key (per_id)
      references ELS_PER_MNG (id) on delete restrict on update restrict;

alter table ELS_PAY_PREVIEW add constraint FK_ELS_PAYPRE_PAYBAT foreign key (batch_id)
      references ELS_PAY_BATCH (id) on delete restrict on update restrict;

alter table ELS_PAY_PREVIEW add constraint FK_ELS_PAYPRE_PER foreign key (per_id)
      references ELS_PER_MNG (id) on delete restrict on update restrict;

alter table ELS_PER_MNG add constraint FK_ELS_PER_ORG foreign key (ORG_ID)
      references ELS_ORG (ID) on delete restrict on update restrict;

alter table ELS_STUB_BATCH add constraint FK_ELS_STUBBAT_ORG foreign key (org_id)
      references ELS_ORG (ID) on delete restrict on update restrict;

alter table ELS_STUB_BATCH add constraint FK_ELS_STUBBAT_TEMPL foreign key (template_id)
      references ELS_STUB_TEMPLATE (id) on delete restrict on update restrict;

alter table ELS_STUB_BATCHINFO add constraint FK_ELS_STUBINFO_PER foreign key (per_id)
      references ELS_PER_MNG (id) on delete restrict on update restrict;

alter table ELS_STUB_BATCHINFO add constraint FK_ELS_STUBINFO_STUBBAT foreign key (batch_id)
      references ELS_STUB_BATCH (id) on delete restrict on update restrict;

alter table ELS_STUB_PREVIEW add constraint FK_ELS_STUBPRE_PER foreign key (per_id)
      references ELS_PER_MNG (id) on delete restrict on update restrict;

alter table ELS_STUB_PREVIEW add constraint FK_ELS_STUBPRE_STUBBAT foreign key (batch_id)
      references ELS_STUB_BATCH (id) on delete restrict on update restrict;

alter table ELS_STUB_TEMPLATE add constraint FK_ELS_STUBTEMPL_ORG foreign key (ORG_ID)
      references ELS_ORG (ID) on delete restrict on update restrict;

alter table ELS_STUB_TEMPLATEINFO add constraint FK_ELS_STUBTEMPLINFO_TEMPL foreign key (template_id)
      references ELS_STUB_TEMPLATE (id) on delete restrict on update restrict;

