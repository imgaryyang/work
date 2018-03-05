DROP TABLE IF EXISTS TREAT_ACTIVITY;

DROP TABLE IF EXISTS TREAT_APPOINT;

DROP TABLE IF EXISTS TREAT_AREA;

DROP TABLE IF EXISTS TREAT_BED;

DROP TABLE IF EXISTS TREAT_CHARGE;

DROP TABLE IF EXISTS TREAT_CHARGE_DETAIL;

DROP TABLE IF EXISTS TREAT_CONSUME;

DROP TABLE IF EXISTS TREAT_DEPOSIT;

DROP TABLE IF EXISTS TREAT_DEPTMENT;

DROP TABLE IF EXISTS TREAT_DIAGNOSE;

DROP TABLE IF EXISTS TREAT_DOCTOR;

DROP TABLE IF EXISTS TREAT_DRUG;

DROP TABLE IF EXISTS TREAT_DRUG_REMIND;

DROP TABLE IF EXISTS TREAT_FEEITEM;

DROP TABLE IF EXISTS TREAT_HOSPITAL;

DROP TABLE IF EXISTS TREAT_INVOICE;

DROP TABLE IF EXISTS TREAT_MEDICAL_RECORD;

DROP TABLE IF EXISTS TREAT_MED_CARD;

DROP TABLE IF EXISTS TREAT_PATIENT;

DROP TABLE IF EXISTS TREAT_PROFILE;

DROP TABLE IF EXISTS TREAT_RECORD;

DROP TABLE IF EXISTS TREAT_RECORD_DRUG;

DROP TABLE IF EXISTS TREAT_RECORD_LOG;

DROP TABLE IF EXISTS TREAT_RECORD_TEST;

DROP TABLE IF EXISTS TREAT_SCHEDULE;

DROP TABLE IF EXISTS TREAT_TEST_DETAIL;

CREATE TABLE TREAT_ACTIVITY
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DEP_CLAZZ            VARCHAR(50),
   DEP_CLAZZ_NAME       VARCHAR(50),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   DOC_JOB_TITLE        VARCHAR(50),
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CARD_ID              CHAR(32),
   CARD_NO              VARCHAR(50),
   CARD_TYPE            CHAR(1),
   APPOINT_ID           CHAR(32),
   APPOINT_NO           VARCHAR(50),
   NO                   VARCHAR(50),
   DISEASE              VARCHAR(50),
   DISEASE_NAME         VARCHAR(50),
   DISEASE_TYPE         CHAR(1),
   DISEASE_TYPE_NAME    VARCHAR(50),
   TREAT_START          DATETIME,
   TREAT_END            DATETIME,
   DIAGNOSIS            VARCHAR(255),
   PRINT_STATUS         CHAR(1),
   PRINT_COUNT          INT,
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_APPOINT
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DEP_PINYIN           VARCHAR(50),
   DEP_WUBI             VARCHAR(50),
   DEP_CLAZZ            VARCHAR(50),
   DEP_CLAZZ_NAME       VARCHAR(50),
   SEP_ID               CHAR(32),
   SEP_CODE             VARCHAR(50),
   SEP_NAME             VARCHAR(50),
   SEP_TYPE             CHAR(1),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   DOC_JOB_TITLE        VARCHAR(50),
   DOC_PINYIN           VARCHAR(50),
   DOC_WUBI             VARCHAR(50),
   CLINIC_TYPE          CHAR(10),
   CLINIC_TYPE_NAME     VARCHAR(50),
   CLINIC_DATE          CHAR(10),
   SCH_ID               CHAR(32),
   SCH_NO               VARCHAR(50),
   SHIFT                CHAR(1),
   SHIFT_NAME           VARCHAR(50),
   NUM                  VARCHAR(50),
   NO                   VARCHAR(50),
   RESERVE_NO           VARCHAR(50),
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CARD_ID              CHAR(32),
   CARD_NO              VARCHAR(50),
   TYPE                 VARCHAR(50) COMMENT '预约、实时是一种分类方式，需要核实医院是否有自己的分类方式',
   REG_FEE              NUMERIC(17,2),
   TREAT_FEE            NUMERIC(17,2),
   TOTAL_FEE            NUMERIC(17,2),
   IS_REPEATED          CHAR(1),
   ADDRESS              VARCHAR(255),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_AREA
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   NO                   VARCHAR(50),
   NAME                 VARCHAR(50),
   ADDRESS              VARCHAR(100),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_BED
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   AREA_ID              CHAR(32),
   AREA_NO              VARCHAR(50),
   AREA_NAME            VARCHAR(50),
   NUM                  VARCHAR(50),
   NAME                 VARCHAR(50),
   ADDRESS              VARCHAR(100),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_CHARGE
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DEP_CLAZZ            VARCHAR(50),
   DEP_CLAZZ_NAME       VARCHAR(50),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   DOC_JOB_TITLE        VARCHAR(50),
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CARD_ID              CHAR(32),
   CARD_NO              VARCHAR(50),
   CARD_TYPE            CHAR(1),
   ACT_ID               CHAR(32),
   ACT_NO               VARCHAR(50),
   NO                   VARCHAR(50),
   MI_TYPE              CHAR(1),
   MYSELF_SCALE         NUMERIC(5,2),
   AMT                  NUMERIC(17,2),
   REAL_AMT             NUMERIC(17,2),
   MI_AMT               NUMERIC(17,2),
   PA_AMT               NUMERIC(17,2),
   MYSELF_AMT           NUMERIC(17,2),
   REDUCE_AMT           NUMERIC(17,2),
   CHARGE_USER          VARCHAR(50),
   CHARGE_TIME          DATETIME,
   COMMENT              VARCHAR(50),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_CHARGE_DETAIL
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DEP_CLAZZ            VARCHAR(50),
   DEP_CLAZZ_NAME       VARCHAR(50),
   SEP_ID               CHAR(32),
   SEP_CODE             VARCHAR(50),
   SEP_NAME             VARCHAR(50),
   SEP_TYPE             CHAR(1),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   DOC_JOB_TITLE        VARCHAR(50),
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CARD_ID              CHAR(32),
   CARD_NO              VARCHAR(50),
   ACT_ID               CHAR(32),
   ACT_NO               VARCHAR(50),
   RECORD_ID            CHAR(32),
   RECORD_NO            VARCHAR(50),
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(50),
   SPEC                 VARCHAR(50),
   UNIT                 VARCHAR(20),
   NUM                  NUMERIC(10,2),
   PRICE                NUMERIC(17,2),
   TYPE                 CHAR(1) COMMENT '治疗费、X光费、化验费',
   MI_TYPE              CHAR(1),
   MYSELF_SCALE         NUMERIC(5,2),
   COST                 NUMERIC(17,2),
   AMOUNT               NUMERIC(17,2),
   REAL_AMOUNT          NUMERIC(17,2),
   RECIPE_NO            VARCHAR(50),
   RECIPE_TIME          DATETIME,
   INVOICE_NO           VARCHAR(50),
   INVOICE_TIME         DATETIME,
   CHARGE_ID            CHAR(32),
   CHARGE_NO            VARCHAR(50),
   CHARGE_USER          VARCHAR(50),
   CHARGE_TIME          DATETIME,
   COMMENT              VARCHAR(50),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_CONSUME
(
   ID                   CHAR(32) NOT NULL,
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CARD_ID              CHAR(32),
   CARD_NO              VARCHAR(50),
   CARD_TYPE            CHAR(1),
   TRADE_TYPE           CHAR(1) COMMENT '1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账',
   TRADE_TIME           DATETIME,
   TRADE_NO             VARCHAR(50),
   AMT                  NUMERIC(17,2),
   BALANCE              NUMERIC(17,2),
   APP_CHANNEL          CHAR(1),
   APP_ID               CHAR(32),
   OPERATOR             VARCHAR(50),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_DEPOSIT
(
   ID                   CHAR(32) NOT NULL,
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CARD_ID              CHAR(32),
   CARD_NO              VARCHAR(50),
   CARD_TYPE            CHAR(1),
   TRADE_TYPE           CHAR(1),
   TRADE_TIME           DATETIME,
   TRADE_NO             VARCHAR(50),
   OUT_TRADE_NO         VARCHAR(50),
   AMT                  NUMERIC(17,2),
   BALANCE              NUMERIC(17,2),
   USER_ID              VARCHAR(50),
   ACCOUNT              VARCHAR(50),
   ACCOUNT_NAME         VARCHAR(70),
   ACCOUNT_TYPE         CHAR(1),
   APP_CHANNEL          CHAR(1),
   APP_ID               CHAR(32),
   TRADE_CHANNEL        CHAR(1) COMMENT 'C-现金
            Z-支付宝
            W-微信
            B-银行
            …',
   TRADE_CHANNEL_CODE   VARCHAR(10),
   TERMINAL_CODE        VARCHAR(20),
   BATCH_NO             VARCHAR(20),
   AD_FLAG              CHAR(1),
   OPERATOR             VARCHAR(50),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_DEPTMENT
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   PARENT_ID            CHAR(32),
   PARENT_NO            VARCHAR(50),
   NO                   VARCHAR(50),
   NAME                 VARCHAR(50),
   PINYIN               VARCHAR(50),
   WUBI                 VARCHAR(50),
   ADDRESS              VARCHAR(100),
   BRIEF                VARCHAR(200),
   IS_SPECIAL           CHAR(1),
   DESCRIPTION          VARCHAR(2000) COMMENT '描述统一作为公共功能',
   TYPE                 VARCHAR(100),
   TREAT_FEE            NUMERIC(17,2),
   REG_FEE              NUMERIC(17,2),
   SORT                 INT,
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_DIAGNOSE
(
   ID                   CHAR(32) NOT NULL,
   ACT_ID               CHAR(32),
   ACT_NO               VARCHAR(50),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   DISEASE_ID           VARCHAR(20),
   DISEASE_NO           VARCHAR(50) NOT NULL,
   DISEASE_TYPE         VARCHAR(2) COMMENT '诊断类型|DISEASE_TYPE',
   DISEASE_NAME         VARCHAR(100),
   DISEASE_TIME         DATETIME,
   IS_CURRENT           VARCHAR(1),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

ALTER TABLE TREAT_DIAGNOSE COMMENT '门诊医生诊断信息';

CREATE TABLE TREAT_DOCTOR
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   NO                   VARCHAR(50),
   NAME                 VARCHAR(70),
   PINYIN               VARCHAR(50),
   WUBI                 VARCHAR(50),
   GENDER               CHAR(1),
   BIRTHDAY             CHAR(10),
   AGE                  NUMERIC(10,2),
   TELEPHONE            VARCHAR(20),
   MOBILE               VARCHAR(20),
   JOB_NUM              VARCHAR(30),
   CERT_NUM             VARCHAR(50),
   DEGREES              VARCHAR(20),
   MAJOR                VARCHAR(30),
   JOB_TITLE            VARCHAR(20),
   SPECIALITY           VARCHAR(500),
   ENTRY_DATE           CHAR(10),
   WORKED_YEARS         NUMERIC(10,2),
   PHOTO                VARCHAR(50),
   IS_EXPERT            CHAR(1),
   TREAT_FEE            NUMERIC(17,2),
   REG_FEE              NUMERIC(17,2),
   SORTNO               INT,
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_DRUG
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(50),
   PINYIN               VARCHAR(50),
   WUBI                 VARCHAR(50),
   PRICE                NUMERIC(17,2),
   UNIT                 VARCHAR(20),
   SPEC                 VARCHAR(20),
   PACKAGES             CHAR(1),
   SUPPLIER             VARCHAR(100),
   IN_PRICE             NUMERIC(17,2),
   EFFECT_DATE          VARCHAR(20),
   MI_FLAG              CHAR(1),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_DRUG_REMIND
(
   ID                   CHAR(32) NOT NULL,
   DRUG_NAME            VARCHAR(100),
   USE_TIME             CHAR(8),
   DOSAGE               VARCHAR(20),
   FREQUENCY            VARCHAR(20),
   START_DATE           CHAR(10),
   END_DATE             CHAR(10),
   REMARKS              VARCHAR(200),
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_FEEITEM
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   CODE                 VARCHAR(50),
   NAME                 VARCHAR(50),
   PINYIN               VARCHAR(50),
   WUBI                 VARCHAR(50),
   PRICE                NUMERIC(17,2),
   UNIT                 VARCHAR(20),
   SPEC                 VARCHAR(20),
   MI_FLAG              CHAR(1),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_HOSPITAL
(
   ID                   CHAR(32) NOT NULL,
   ORG_ID               CHAR(32),
   NAME                 VARCHAR(50),
   NO                   VARCHAR(50),
   TYPE                 CHAR(2),
   LEVEL                CHAR(2),
   STARS                NUMERIC(5,2),
   LIKES                INT,
   FAVS                 INT,
   GOOD_COMMENT         INT,
   BAD_COMMENT          INT,
   COMMENT              VARCHAR(1000),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_INVOICE
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               VARCHAR(10) NOT NULL COMMENT '医院ID|以H开头，第2、3位为等级，4-7为集团编码，8-10为序号',
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   INVOICE_CUR          VARCHAR(14),
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   INVOICE_TYPE         VARCHAR(2) COMMENT '发票分类|INVOICE_TYPE',
   INVOICE_NUM          VARCHAR(14) NOT NULL,
   INVOICE_END          VARCHAR(14),
   PRO_NAME             VARCHAR(70),
   GET_TIME             DATETIME,
   ISSHARE              VARCHAR(1),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

ALTER TABLE TREAT_INVOICE COMMENT '票据管理';

CREATE TABLE TREAT_MEDICAL_RECORD
(
   ID                   CHAR(32) NOT NULL,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_MED_CARD
(
   ID                   CHAR(32) NOT NULL,
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   CARD_NO              VARCHAR(50),
   CARD_TYPE            CHAR(1),
   ISSUER               VARCHAR(50),
   EFFECT_START         CHAR(10),
   EFFECT_END           CHAR(10),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 已解绑',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_PATIENT
(
   ID                   CHAR(32) NOT NULL,
   NO                   VARCHAR(50),
   WUBI                 VARCHAR(50),
   PINYIN               VARCHAR(50),
   PHOTO                VARCHAR(200),
   ID_NO                VARCHAR(18),
   ID_ISSUER            VARCHAR(50),
   ID_EFFECTIVE         CHAR(10),
   MI_NO                VARCHAR(20),
   MI_CARD_NO           VARCHAR(20),
   COMPANY              VARCHAR(50),
   UNIT_CODE            VARCHAR(20),
   AGE                  NUMERIC(10,0),
   MOBILE               VARCHAR(20),
   PHONE                VARCHAR(20),
   EMAIL                VARCHAR(50),
   GENDER               CHAR(1),
   BIRTHDAY             CHAR(10),
   NATIONALITY          VARCHAR(50),
   NATION               VARCHAR(50),
   ORIGIN               VARCHAR(50),
   HEIGHT               NUMERIC(8,2),
   WEIGHT               NUMERIC(8,2),
   MARRIAGE             CHAR(1),
   OCCUPATION           CHAR(10),
   ADDRESS              VARCHAR(200),
   TYPE                 CHAR(1),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_PROFILE
(
   ID                   CHAR(32) NOT NULL,
   PATIENT_ID           CHAR(32),
   PATIENT_NO           VARCHAR(50),
   PATIENT_NAME         VARCHAR(70),
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   NO                   VARCHAR(50),
   INNO                 VARCHAR(50),
   NAME                 VARCHAR(70),
   WUBI                 VARCHAR(50),
   PINYIN               VARCHAR(50),
   PHOTO                VARCHAR(200),
   IDNO                 VARCHAR(18),
   AGE                  NUMERIC(10,0),
   MOBILE               VARCHAR(20),
   PHONE                VARCHAR(20),
   EMAIL                VARCHAR(50),
   GENDER               CHAR(1),
   BIRTH_DAY            VARCHAR(10),
   NATIONALITY          VARCHAR(50),
   NATION               VARCHAR(50),
   ORIGIN               VARCHAR(50),
   HEIGHT               NUMERIC(17,2),
   WEIGHT               NUMERIC(17,2),
   MARRIAGE             CHAR(1),
   OCCUPATION           CHAR(10),
   ADDRESS              VARCHAR(200),
   TYPE                 CHAR(1),
   BALANCE              NUMERIC(17,2),
   OPEN_TYPE            CHAR(1),
   ACCT_NO              VARCHAR(50),
   ACCT_STATUS          CHAR(1),
   CARD_NO              VARCHAR(50),
   CARD_TYPE            CHAR(1),
   CARD_STATUS          CHAR(1),
   GUARANTEE_IDNO       VARCHAR(18),
   GUARANTEE_NAME       VARCHAR(70),
   GUARANTEE_TYPE       CHAR(1),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_RECORD
(
   ID                   CHAR(32) NOT NULL,
   ACT_ID               CHAR(32),
   ACT_NO               VARCHAR(50),
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   PRO_ID               CHAR(32),
   PRO_NO               VARCHAR(50),
   PRO_NAME             VARCHAR(70),
   CATA_ID              CHAR(32),
   CATA_NO              VARCHAR(50),
   CATA_NAME            VARCHAR(70),
   FEE_ITEM_ID          CHAR(32),
   FEE_ITEM_NO          VARCHAR(50),
   FEE_GROUP_ID         CHAR(32),
   FEE_GROUP_NO         VARCHAR(50),
   NO                   VARCHAR(50),
   APPLY_NO             VARCHAR(50),
   NAME                 VARCHAR(50),
   COUNT                NUMERIC(5,2),
   PRICE                NUMERIC(17,2),
   AMT                  NUMERIC(17,2),
   BIZ_TYPE             CHAR(1),
   BIZ_NAME             VARCHAR(50),
   NEED_PAY             CHAR(1),
   COMMENT              VARCHAR(200),
   TREAT_START          DATETIME,
   TREAT_END            DATETIME,
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_RECORD_DRUG
(
   ID                   CHAR(32) NOT NULL,
   RECORD_ID            CHAR(32),
   RECORD_NO            VARCHAR(50),
   DRUG_ID              CHAR(32),
   DRUG_NO              VARCHAR(50),
   DS_ID                CHAR(32),
   DS_NO                VARCHAR(50),
   NAME                 VARCHAR(100),
   UNIT                 VARCHAR(20),
   FORM                 VARCHAR(20),
   DOSE                 VARCHAR(20),
   PACKAGES             VARCHAR(20),
   PRICE                NUMERIC(17,2),
   COUNT                INT,
   NUM                  INT,
   FREQUENCY            VARCHAR(20),
   ONE_SIZE             NUMERIC(10,2),
   MET_UNIT             VARCHAR(20),
   WAY                  VARCHAR(50),
   SPECIAL_WAY          VARCHAR(50),
   MYSLEF_AMT           NUMERIC(17,2),
   MYSLEF_SCAN          NUMERIC(17,2),
   GROUP_NO             VARCHAR(50),
   GROUP_SORT           INT,
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_RECORD_LOG
(
   ID                   CHAR(32) NOT NULL,
   NAME                 VARCHAR(50),
   BIZ_ID               CHAR(32),
   BIZ                  VARCHAR(50),
   BIZ_NAME             VARCHAR(50),
   NOTIFICATION         VARCHAR(200),
   TREATMENT            CHAR(32),
   UPDATE_TIME          DATETIME NOT NULL,
   CREATE_TIME          DATETIME NOT NULL,
   NEED_PAY             CHAR(1),
   PAYED                CHAR(1),
   DESCRIPTION          VARCHAR(2000),
   OPERATE              VARCHAR(200),
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_RECORD_TEST
(
   ID                   CHAR(32) NOT NULL,
   RECORD_ID            CHAR(32),
   RECORD_NO            VARCHAR(50),
   PKG_ID               CHAR(32),
   PKG_NAME             VARCHAR(200),
   ITEM_ID              CHAR(32),
   ITEM_NAME            VARCHAR(200),
   ITEM_TYPE            VARCHAR(20),
   OPT_DOC              CHAR(32),
   OPT_DOC_NAME         VARCHAR(50),
   APPLY_DOC            CHAR(32),
   APPLY_DOC_NAME       VARCHAR(50),
   AUDIT_DOC            CHAR(32),
   AUDIT_DOC_NAME       VARCHAR(50),
   BARCODE              VARCHAR(50),
   SAMPLE_NO            VARCHAR(50),
   SAMPLE               VARCHAR(100),
   COLLECT_TIME         DATETIME,
   RECEIVE_TIME         DATETIME,
   AUDIT_TIME           DATETIME,
   REPORT_TIME          DATETIME,
   MACHINE_NO           VARCHAR(50),
   MACHINE_NAME         VARCHAR(100),
   COMMENT              VARCHAR(200),
   STATUS               CHAR(1) COMMENT 'A - 初始
            0 - 正常
            1 - 废弃',
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_SCHEDULE
(
   ID                   CHAR(32) NOT NULL,
   HOS_ID               CHAR(32),
   HOS_NO               VARCHAR(50),
   HOS_NAME             VARCHAR(50),
   DEP_ID               CHAR(32),
   DEP_NO               VARCHAR(50),
   DEP_NAME             VARCHAR(50),
   DEP_PINYIN           VARCHAR(50),
   DEP_WUBI             VARCHAR(50),
   DEP_CLAZZ            VARCHAR(50),
   DEP_CLAZZ_NAME       VARCHAR(50),
   SEP_ID               CHAR(32),
   SEP_CODE             VARCHAR(50),
   SEP_NAME             VARCHAR(50),
   SEP_TYPE             CHAR(1),
   DOC_ID               CHAR(32),
   DOC_NO               VARCHAR(50),
   DOC_NAME             VARCHAR(50),
   DOC_JOB_TITLE        VARCHAR(50),
   DOC_PINYIN           VARCHAR(50),
   DOC_WUBI             VARCHAR(50),
   CLINIC_TYPE          CHAR(10),
   CLINIC_TYPE_NAME     VARCHAR(50),
   CLINIC_DATE          CHAR(10),
   NO                   VARCHAR(50),
   SHIFT                CHAR(1),
   SHIFT_NAME           VARCHAR(50),
   DUTY_START           DATETIME,
   DUTY_END             DATETIME,
   TOTAL_NUM            INT,
   ENABLE_NUM           INT,
   DISABLE_NUM          INT,
   REG_FEE              NUMERIC(17,2),
   TREAT_FEE            NUMERIC(17,2),
   TOTAL_FEE            NUMERIC(17,2),
   ADDRESS              VARCHAR(255),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

CREATE TABLE TREAT_TEST_DETAIL
(
   ID                   CHAR(32) NOT NULL,
   TEST_ID              CHAR(32),
   SUBJECT_CODE         VARCHAR(50),
   SUBJECT              VARCHAR(100),
   RESULT               VARCHAR(50),
   FLAG                 CHAR(1),
   UNIT                 VARCHAR(50),
   REFERENCE            VARCHAR(50),
   STATUS               CHAR(1),
   CREATED_BY           VARCHAR(50),
   CREATED_AT           DATETIME,
   UPDATED_BY           VARCHAR(50),
   UPDATED_AT           DATETIME,
   PRIMARY KEY (ID)
);

ALTER TABLE TREAT_AREA ADD CONSTRAINT FK_AREA_HOS FOREIGN KEY (HOS_ID)
      REFERENCES TREAT_HOSPITAL (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_BED ADD CONSTRAINT FK_BED_AREA FOREIGN KEY (AREA_ID)
      REFERENCES TREAT_AREA (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_BED ADD CONSTRAINT FK_BED_HOS FOREIGN KEY (HOS_ID)
      REFERENCES TREAT_HOSPITAL (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_DEPTMENT ADD CONSTRAINT FK_DEPT_HOS FOREIGN KEY (HOS_ID)
      REFERENCES TREAT_HOSPITAL (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_DIAGNOSE ADD CONSTRAINT FK_DIAGNOSE_TREAT FOREIGN KEY (ACT_ID)
      REFERENCES TREAT_ACTIVITY (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_DOCTOR ADD CONSTRAINT FK_DOC_DEPT FOREIGN KEY (DEP_ID)
      REFERENCES TREAT_DEPTMENT (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_DOCTOR ADD CONSTRAINT FK_DOC_HOS FOREIGN KEY (HOS_ID)
      REFERENCES TREAT_HOSPITAL (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_MED_CARD ADD CONSTRAINT FK_CARD_PROFILE FOREIGN KEY (PRO_ID)
      REFERENCES TREAT_PROFILE (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_PROFILE ADD CONSTRAINT FK_PROFILE_PATIENT FOREIGN KEY (PATIENT_ID)
      REFERENCES TREAT_PATIENT (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_RECORD ADD CONSTRAINT FK_RECORD_TREAT FOREIGN KEY (ACT_ID)
      REFERENCES TREAT_ACTIVITY (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_RECORD_DRUG ADD CONSTRAINT FK_DRUG_RECORD FOREIGN KEY (RECORD_ID)
      REFERENCES TREAT_RECORD (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_RECORD_TEST ADD CONSTRAINT FK_TEST_RECORD FOREIGN KEY (RECORD_ID)
      REFERENCES TREAT_RECORD (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TREAT_TEST_DETAIL ADD CONSTRAINT FK_DETAIL_TEST FOREIGN KEY (TEST_ID)
      REFERENCES TREAT_RECORD_TEST (ID) ON DELETE RESTRICT ON UPDATE RESTRICT;

