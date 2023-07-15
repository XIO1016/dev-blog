---
title: 데이터베이스 설계) Database Design Using the E-R Model(1)
slug: data-base
category: CS
date: 2023.02.01
description: 데이터베이스 설계 기초
img: database1.png
author: XIO1016
visibility: true
main: false
---

_이 글은 "Database System Concepts, 7th edition"을 바탕으로 작성되었습니다._

## **1\. Database Design**

### **1) Design Phases**

Initial phase (초기 단계)

- 데이터베이스 사용자 관점에서 data needs( requirement analysis)를 완전히 characterize (특성화)한다.

Second phase (두번째 단계) : data model을 고른다.

- requirements (data needs)를 충족시킬 수 있는 데이터베이스의 개념적 스키마( conceptual schema modeling (ER model), RDB로 구체화하기 전 단계로
  abstract한 형태의 RDB를 만듦)를 설계한다.
- functional requirements (operations: 검색, 삽입, 삭제, 갱신 등)를 충족하여 완전히 발전된 개념적 스키마를 만든다.

Final phase (마지막 단계) : 추상적인 데이터 모델 (ER model)에서 데이터베이스 구현 (RDB)으로 진행한다.

- Logical Design : 데이터베이스 스키마를 결정한다. 어떤 relation schema로 디자인하는게 좋은가. 제약사항 확인.

(Business decision : 데이터베이스 레코드에 어떤 속성이 있어야 할 지(RDB schema) / CS decision : 어떤 relation Database? (Normalization))

- Physical Design : 어떤 파일 구조?

### **2) Design Alternatives : 유일한 설계가 나올 수 없다.**

Bad design은 피해야 한다.

(1) 중복성 (Redundancy)

- 동일한 data가 db내에 반복해서 저장되는 경우 -> update 시킬 때 모든 중복된 속성을 다 update 시켜줘야 불일치 오류가 나오지 않는다. ex) course, section table을 합칠때, 한
  과목에 두번 개설되면 그 과목에 대한 학점, 부서 등의 정보가 중복되어 나온다.

(2) 불완전성 (Imcompleteness)

- 구현이 아주 어렵거나 불가능하게 만드는 설계 ex) section에 course를 합칠때, 개설되지 않은 과목은 표현할 수 없다.

Good design에서도 적절한 것을 골라야 한다.

### **3) Design Approaches**

- Entity Relationship Model (6장) : ER diagram 작성
- Normalization (7장) : 설계의 잘못된 점을 파악

## **2\. Outline of the ER Model**

### **1) ER model**

- ER data Model은 데이터베이스의 전체적인 논리 구조를 나타내는데 용이하게 하기위해 만들어졌다.
- 3가지 기본 개념으로 이루어진다. (entity sets, relationship sets, attributes)
- ERD (Entity Relationship Diagram)은 ER data Model을 그래픽으로 표현한 것이다.

### **2) Entity Sets** 

- entity: 하나의 객체, 식별성을 가진다. ex) specific person, company, event...
- entity sets: 같은 속성을 공유하는 같은 타입인 객체들의 집합 ex) set of all persons, companies...
- entity는 속성의 집합으로 표현된다. ex) instrustor = (ID, name, salry)
- primary key: entity를 구별할 수 있는 key

<p align="center">
<img src="/databasedesign/1.PNG"  width="400">
</p>

### **3) Relationship Sets**

- 객체간의 관계를 나타낸다. ex) 학생- 지도교수 - 교수

<p align="center">
<img src="/databasedesign/2.PNG"  width="400">
</p>

(1) Relationship은 attribute를 가질 수 있다.

<p align="center">
<img src="/databasedesign/16.PNG"  width="400">
</p>

(2) Relationship은 Role을 가질 수 있다.

- Role로 label을 작성해 의미를 정확하게 표현한다. (unary)

<p align="center">
<img src="/databasedesign/3.PNG"  width="400">
</p>

(3) Degree

- degree = 1 (unary relationship), degree = 2 (binary relationship), degree =3 (ternary relationship), degree = n (n-ary
  relationship)- 대부분은 binary

<p align="center">
<img src="/databasedesign/4.png"  width="400">
</p>

### **4) Attributes types**

(1) simple and compossite (합성)

- 합성 : subpart를 구분하여 각각을 속성으로 처리 ex) 이름, 주소, 거리 등

<p align="center">
<img src="/databasedesign/5.PNG"  width="400">
</p>

(2) single-valued and mulivalued

- 다중값 속성 : 속성은 하나지만 여러 값을 가짐 ex) 전화번호- 집, 사무실,....

(3) derived attributes

- 다른 속성으로부터 계산될 수 있는 속성 ex) 생일으로부터 나이 도출

<p align="center">
<img src="/databasedesign/6.PNG"  width="200">
</p>

\- name, address (composite) : 들여쓰기

\- phone number (multivalued) : { }

\- age (derived) : age()

<p align="center">
<img src="/databasedesign/7.PNG"  width="400">
</p>

### **5) Mapping Cardinality Constraints**

- relationship이 존재하는 한 entity에서 다른 entity 몇개의 개체와 대응되는지 나타내는 제약조건이다.
- Mapping Cardinality의 종류

- One to one : 1대1 대응 ex) 교수가 학생을 지도할 때 한명씩 대해서만 전담해서 한다.

- One to many : 1대다 대응 ex) 교수는 여러학생, 학생은 한 교수가 배정된다.

- Many to one : 다대1 대응 ex) 교수는 한 학생, 학생은 여러 교수가 배정된다.

- Many to many : 다대다 대응 ex) 여러학생 지도, 여러 지도 교수

<p align="center">
<img src="/databasedesign/8.PNG"  width="400">
</p>

- Cardinality constraints in ERD- ERD에서 화살표(->)는 1개 대응을 뜻하고 선(-)은 여러개 대응을 뜻한다.

<p align="center">
<img src="/databasedesign/9.PNG"  width="400">
</p>

- chen의 표기법에서는 화살표를 사용하지 않고 선 위에 '\*, 1'이라고 쓴다.

### **6) Total and Partial Participation**

- 전체 참여 (Total Participation): 전체 참여는 두줄로 표현하고 예시는 아래와 같다.
- 부분 참여 (Partial Participation):어떤 entities는 관계에 참여 안할 수 있다. 한줄로 표현, 일반적

<p align="center">
<img src="/databasedesign/10.PNG"  width="400">
</p>

- student와 관계가 없는 instructor가 존재할 수는 있지만 모든 student는 무조건 instructor와 관계가 있어야한다.
- 어떤 instructor는 student와 관계를 안가지고 있을 수 있다. 즉, 지도교수 업무를 하지 않을 수 있다.

### **7) more complex constraints**

- 선에 mininum, maximum cardinality가 있을 수 있다.

- minimum=1 : 전체 참여를 뜻한다.

- maximum=1 : cardinality에서 화살표를 뜻한다 (상대랑 최대 한개가 mapping

- maximum=\* : no limit을 뜻한다.

<p align="center">
<img src="/databasedesign/11.PNG"  width="400">
</p>

- 교수는 한명이 학생을 몇명 전담하든지 상관 없다. 학생은 모두 한명의 지도교수 배정을 받아야한다.

### **8) Primary key**

\- ERD가 Table schema로 변환될 때 누가 primary key가 되는가?

(1) Entity sets : primary attribute

(2) Relationship sets

- 각 entity sets의 primary key를 조합하여 사용
- Mapping Cardinality에 따라 달라질 수 있다.

- many-to-many : 두 primary keys를 합성하여 사용

- one-to-many, many -to-one : many side의 primary key를 사용

- one-to-one : 둘 다 사용 가능

(3) Weak entity sets

### **9) Weak entity sets**

<p align="center">
<img src="/databasedesign/12.PNG"  width="400">
</p>

- payment의 개념이 loan이라는 전제로 생기는 객체
- L1, L2 loan 에 대하여 상환이 payment number, payment date, payment amount가 다 같을 수 있다.
- loan number까지 붙여야 구분 가능- weak entity는 자체 primary key가 없을뿐, primary key가 존재하긴 한다.
- 대신 discriminator(구분자)가 존재한다. : payment\_number
- payment의 primary key는 (loan\_num, payment\_num) 합성키

<p align="center">
<img src="/databasedesign/13.PNG"  width="400">
</p>

- section 객체를 weak 말고 strong entity로 만드려면, c\_id를 추가해야한다. -> c\_id의 redundancy 존재
- identifying relationship : weak와 strong 객체를 연결지음으로써, weak entity를 식별할 수 있게 함. 겹선 다이아몬드

\* weak entity를 결정할 때는 자체속성 내 primary key가 있는지 확인한다.

### **10) Redundant attributes**

<p align="center">
<img src="/databasedesign/14.PNG"  width="400">
</p>

- 학과 속성이 student의 속성으로도 존재하고, relationship도 맺어져 있음
- 중복성 문제 -> dept\_name 속성을 student 객체에서 삭제한다.

### **11) ERD example**

<p align="center">
<img src="/databasedesign/15.PNG"  width="400">
</p>

- section : weak entity
- sec\_course : identify relationship
- prereq : unary relationship
- classroom : 합성 primary key
- 겹선 : total participation ex) 학생은 반드시 과가 정해져 있어야 한다. 수업이 있으면 교수 배정이 있어야 함...
- takes : 다 대 다 관계
- time\_slot : multivalued, meeting : composite
