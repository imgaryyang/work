/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2016/5/31 11:26:34                           */
/*==============================================================*/


DROP TABLE IF EXISTS IH_ACCESS;

DROP TABLE IF EXISTS IH_ACCESS_RES;

DROP TABLE IF EXISTS IH_BASE_ROLE;

DROP TABLE IF EXISTS IH_DEPT;

DROP TABLE IF EXISTS IH_DEPT_PER;

DROP TABLE IF EXISTS IH_DEPT_POST;

DROP TABLE IF EXISTS IH_FUNCTION;

DROP TABLE IF EXISTS IH_MENU;

DROP TABLE IF EXISTS IH_ORG;

DROP TABLE IF EXISTS IH_ORG_PER;

DROP TABLE IF EXISTS IH_PERSON;

DROP TABLE IF EXISTS IH_PERSON_ROLE;

DROP TABLE IF EXISTS IH_PER_POST;

DROP TABLE IF EXISTS IH_POST;

DROP TABLE IF EXISTS IH_RESOURCE;

DROP TABLE IF EXISTS IH_ROLE_ACC;

DROP TABLE IF EXISTS IH_USER;

/*==============================================================*/
/* Table: IH_ACCESS                                             */
/*==============================================================*/
CREATE TABLE IH_ACCESS
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(50),
   FUNCTION             CHAR(32),
   DESCP                VARCHAR(255),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_ACCESS_RES                                         */
/*==============================================================*/
CREATE TABLE IH_ACCESS_RES
(
   AID                  CHAR(32) NOT NULL,
   RID                  CHAR(32) NOT NULL,
   PRIMARY KEY (AID, RID)
);

/*==============================================================*/
/* Table: IH_BASE_ROLE                                          */
/*==============================================================*/
CREATE TABLE IH_BASE_ROLE
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(100),
   MEMO                 VARCHAR(255),
   ORGID                CHAR(32),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_DEPT                                               */
/*==============================================================*/
CREATE TABLE IH_DEPT
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(32),
   CODE                 VARCHAR(50) NOT NULL COMMENT '便于程序编码实现的代码',
   DESCRIPTION          VARCHAR(255),
   ORG                  CHAR(32),
   PARENT               CHAR(32),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_DEPT_PER                                           */
/*==============================================================*/
CREATE TABLE IH_DEPT_PER
(
   DEP_ID               CHAR(32) NOT NULL,
   PER_ID               CHAR(32) NOT NULL,
   PRIMARY KEY (DEP_ID, PER_ID)
);

/*==============================================================*/
/* Table: IH_DEPT_POST                                          */
/*==============================================================*/
CREATE TABLE IH_DEPT_POST
(
   DID                  CHAR(32),
   PID                  CHAR(32)
);

/*==============================================================*/
/* Table: IH_FUNCTION                                           */
/*==============================================================*/
CREATE TABLE IH_FUNCTION
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(50),
   DESCP                VARCHAR(255),
   URI                  VARCHAR(200),
   FTYPE                VARCHAR(2) DEFAULT '1' COMMENT '功能的类型，
            1-url
            2-func
            3-other',
   PARENT               CHAR(32),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_MENU                                               */
/*==============================================================*/
CREATE TABLE IH_MENU
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(25),
   NAME                 VARCHAR(50),
   PARENT               CHAR(32),
   DESCP                VARCHAR(255),
   ICON                 VARCHAR(255),
   URI                  VARCHAR(255),
   TYPE_                CHAR(2) COMMENT '0-toALL
            1-',
   SORTER               INT,
   AID                  CHAR(32) NOT NULL,
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_ORG                                                */
/*==============================================================*/
CREATE TABLE IH_ORG
(
   ID                   CHAR(32) NOT NULL,
   CUSTCODE             CHAR(16),
   BRCCODE              CHAR(6),
   NAME                 VARCHAR(70) NOT NULL,
   ENNAME               VARCHAR(50),
   SHORTNAME            VARCHAR(20),
   STATUS               CHAR(1),
   IDTYPE               CHAR(2),
   IDNO                 VARCHAR(18),
   VISADATE             CHAR(10),
   EFFECTIVEDATE        CHAR(10),
   EXPIREDDATE          CHAR(10),
   VISAADDR             VARCHAR(100),
   CATEGRY              VARCHAR(50),
   TYPE                 CHAR(50),
   TYPE2                CHAR(10) NOT NULL COMMENT '类别码
            第一位：1-代发 0-非代发
            第二位：1-易健康接入医院 0-非易健康接入医院
            第三位：1-易健康接入药店 0-非易健康接入药店
            第四位：1-收费机构 0-非收费机构
            第五位：1/0 是否社保
            第六位：1/0 是否卫计委
            第七位：1/0 是否合作银行
            第八位：1/0 是否平台运营机构
            ',
   ORG_NO               CHAR(30),
   LICNUM               CHAR(50),
   SI_ID                CHAR(20),
   EMPLOYEES            INT,
   REGISTERED_CAPITAL   NUMERIC(8,0),
   AREA_CODE            CHAR(6),
   AREA_NAME            VARCHAR(200),
   MEMO                 VARCHAR(500),
   PARENT               CHAR(32),
   LVL                  INT,
   CASCAD               VARCHAR(50),
   ISLEAF               CHAR(1),
   PHONE                VARCHAR(50),
   PHONE1               VARCHAR(20),
   MOBILE               VARCHAR(50),
   MOBILE1              VARCHAR(50),
   ZIP                  CHAR(6),
   PROVINCE             CHAR(6),
   CITY                 CHAR(6),
   UPDATEDON            CHAR(19) NOT NULL,
   ADDRESS              VARCHAR(100),
   TAGS                 CHAR(100),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_ORG_PER                                            */
/*==============================================================*/
CREATE TABLE IH_ORG_PER
(
   PER_ID               CHAR(32) NOT NULL,
   ORG_ID               CHAR(32) NOT NULL,
   EFFON                CHAR(19) NOT NULL,
   OFFON                CHAR(19),
   STATE                CHAR(1) NOT NULL,
   PRIMARY KEY (PER_ID, ORG_ID, EFFON, STATE)
);

/*==============================================================*/
/* Table: IH_PERSON                                             */
/*==============================================================*/
CREATE TABLE IH_PERSON
(
   ID                   CHAR(32) NOT NULL,
   CUSTCODE             CHAR(16),
   USERCODE             CHAR(8),
   STATUS               CHAR(1),
   NAME                 VARCHAR(70),
   ENNAME               VARCHAR(50),
   SHORTNAME            VARCHAR(20),
   IDTYPE               CHAR(2),
   IDNO                 VARCHAR(18),
   VISADATE             CHAR(10),
   EFFECTIVEDATE        CHAR(10),
   EXPIREDDATE          CHAR(10),
   VISAADDR             VARCHAR(100),
   SI_ID                CHAR(20),
   HOMEPLACE            VARCHAR(100),
   BORNDATE             VARCHAR(20),
   SEX                  VARCHAR(10),
   FOLK                 VARCHAR(10),
   MARRSTATUS           CHAR(1),
   EDULEVEL             VARCHAR(50),
   PHONE                VARCHAR(50),
   PHONE1               VARCHAR(20),
   MOBILE               VARCHAR(50),
   MOBILE1              VARCHAR(50),
   ZIP                  CHAR(6),
   PROVINCE             CHAR(6),
   CITY                 CHAR(6),
   ADDRESS              VARCHAR(100),
   MAIL                 VARCHAR(30),
   UPDATEDON            CHAR(19),
   PINYIN               VARCHAR(50),
   OWNERORG             CHAR(32),
   USERNAME             VARCHAR(50) NOT NULL,
   PASSWORD             VARCHAR(64) NOT NULL,
   ISACTIVE             VARCHAR(1) DEFAULT '0',
   ISEXPE               VARCHAR(1) DEFAULT '0',
   TYPE                 CHAR(1),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_PERSON_ROLE                                        */
/*==============================================================*/
CREATE TABLE IH_PERSON_ROLE
(
   PID                  CHAR(32) NOT NULL,
   RID                  CHAR(32) NOT NULL,
   ID                   CHAR(32),
   PRIMARY KEY (PID, RID)
);

/*==============================================================*/
/* Table: IH_PER_POST                                           */
/*==============================================================*/
CREATE TABLE IH_PER_POST
(
   PTID                 CHAR(32) NOT NULL,
   PID                  CHAR(32) NOT NULL,
   PRIMARY KEY (PTID, PID)
);

/*==============================================================*/
/* Table: IH_POST                                               */
/*==============================================================*/
CREATE TABLE IH_POST
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(50),
   ORG                  CHAR(32),
   DESCRIPTION          VARCHAR(255),
   PARENT               CHAR(32),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_RESOURCE                                           */
/*==============================================================*/
CREATE TABLE IH_RESOURCE
(
   ID                   CHAR(32) NOT NULL,
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(50),
   FUNCID               CHAR(32),
   MEMO                 VARCHAR(255),
   OPTYPE               VARCHAR(2),
   URI                  VARCHAR(255),
   PRIMARY KEY (ID)
);

/*==============================================================*/
/* Table: IH_ROLE_ACC                                           */
/*==============================================================*/
CREATE TABLE IH_ROLE_ACC
(
   RID                  CHAR(32) NOT NULL,
   AID                  CHAR(32) NOT NULL,
   PRIMARY KEY (RID, AID)
);

/*==============================================================*/
/* Table: IH_USER                                               */
/*==============================================================*/
CREATE TABLE IH_USER
(
   ID                   CHAR(32) NOT NULL,
   ORG_ID               CHAR(32),
   USER_NAME            VARCHAR(100),
   NAME                 VARCHAR(100),
   PASSWROD             VARCHAR(100),
   MOBILE               CHAR(11),
   OTHER_CONTACT_WAY    VARCHAR(100),
   STATE                CHAR(1) COMMENT '1 - 正常
            2 - 冻结',
   CREATED_AT           CHAR(19),
   PRIMARY KEY (ID)
);

ALTER TABLE IH_ACCESS ADD CONSTRAINT FK_ACCFUNC_FUNC FOREIGN KEY (FUNCTION)
      REFERENCES IH_FUNCTION (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_ACCESS_RES ADD CONSTRAINT FK_ACCRES_ACC FOREIGN KEY (AID)
      REFERENCES IH_ACCESS (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_ACCESS_RES ADD CONSTRAINT FK_ACCRES_RES FOREIGN KEY (RID)
      REFERENCES IH_RESOURCE (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_BASE_ROLE ADD CONSTRAINT FK_BASEROLE_ORG FOREIGN KEY (ORGID)
      REFERENCES IH_ORG (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_DEPT ADD CONSTRAINT FK_DEPT_ORG FOREIGN KEY (ORG)
      REFERENCES IH_ORG (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_DEPT ADD CONSTRAINT FK_DEPT_PARENT FOREIGN KEY (PARENT)
      REFERENCES IH_DEPT (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_DEPT_PER ADD CONSTRAINT FK_DEPTPER_DEPT FOREIGN KEY (DEP_ID)
      REFERENCES IH_DEPT (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_DEPT_PER ADD CONSTRAINT FK_DEPTPER_PER FOREIGN KEY (PER_ID)
      REFERENCES IH_PERSON (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_DEPT_POST ADD CONSTRAINT FK_DEPTPOST_DEPT FOREIGN KEY (DID)
      REFERENCES IH_DEPT (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_DEPT_POST ADD CONSTRAINT FK_DEPTPOST_POST FOREIGN KEY (PID)
      REFERENCES IH_POST (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_MENU ADD CONSTRAINT FK_MENU_ACC FOREIGN KEY (AID)
      REFERENCES IH_ACCESS (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_MENU ADD CONSTRAINT FK_MENU_PARENT FOREIGN KEY (PARENT)
      REFERENCES IH_MENU (ID) ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE IH_ORG_PER ADD CONSTRAINT FK_ORGPRE_ORG FOREIGN KEY (ORG_ID)
      REFERENCES IH_ORG (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_ORG_PER ADD CONSTRAINT FK_ORGPRE_PERSON FOREIGN KEY (PER_ID)
      REFERENCES IH_PERSON (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_PERSON_ROLE ADD CONSTRAINT FK_BASEROLE_PER FOREIGN KEY (ID)
      REFERENCES IH_PERSON (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_PERSON_ROLE ADD CONSTRAINT FK_PERROLE_ROLE FOREIGN KEY (RID)
      REFERENCES IH_BASE_ROLE (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_PER_POST ADD CONSTRAINT FK_PERPOST_PER FOREIGN KEY (PID)
      REFERENCES IH_PERSON (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE IH_PER_POST ADD CONSTRAINT FK_PERPOST_POST FOREIGN KEY (PTID)
      REFERENCES IH_POST (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_POST ADD CONSTRAINT FK_POST_ORG FOREIGN KEY (ORG)
      REFERENCES IH_ORG (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_RESOURCE ADD CONSTRAINT RESOURE_FUNC_FUNCID FOREIGN KEY (FUNCID)
      REFERENCES IH_FUNCTION (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_ROLE_ACC ADD CONSTRAINT FK_ACCROLE_ROLE FOREIGN KEY (RID)
      REFERENCES IH_BASE_ROLE (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE IH_ROLE_ACC ADD CONSTRAINT FK_ROLEACC_ACC FOREIGN KEY (AID)
      REFERENCES IH_ACCESS (ID) ON DELETE CASCADE ON UPDATE RESTRICT;

