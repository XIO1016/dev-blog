---
title: 데이터베이스 설계) Database Design Using the E-R Model(2)
slug: data-base2
category: CS
date: 2023.02.01
description: 데이터베이스 설계 기초
img: database2.png
author: XIO1016
visibility: true
main: false
---
_이 글은 "Database System Concepts, 7th edition"을 바탕으로 작성되었습니다._

## **1\. Reduction to Relation Schemas**

### 1) Redcution to Relation Schemas

ERD -> RDB 변환 규칙

-   entity와 relationship 각각이 table 하나로 변환
-    column으로 만드는 것은 변환 규칙이 다 정해줌 

### 2) Representing Entity Sets

<p align="center">
<img src="/databasedesign/17.PNG"  width="400">
</p>

-   strong: course (course\_id,title,credits)  
-   weak: section(course\_id,sec\_id,sem,year) (strong pk와 합성)
-   sec(course\_ id) ->course(course\_id) foreign key

### 3) Representation of entity sets with composite attributes

<p align="center">
<img src="/databasedesign/18.PNG"  width="200">
</p>

-   위 객체를 RDB로 표현하면
-   instructor (ID, first\_n,middle\_n,last\_n,street\_num,street\_n,apt\_num,city,state,zip\_code,dateofbirth)
-   ERD가 RDB보다 더 많은 속성 표현
-   composite attribute는 하위 속성만 작성한다. (flattened out)
-   도출 속성 age()는 표현 x

### 4) Representation of entity sets with multivalued attributes

-   multivalued는 별도의 table로 만든다.
-   inst\_phone = (ID, phone\_num)
-   본래 객체의 pk와 속성이 합성하여 primary key 가 된다.
-   inst\_phone(ID) -> instructor(ID) foreign key

### 5) Representing Relationship Sets

<p align="center">
<img src="/databasedesign/19.PNG"  width="400">
</p>

-   3개의 table이 만들어짐.
-   advisor = (s\_id,i\_id,date) 다 대 다 관계이기 때문에 합성하여 primary key, 두 값은 각각 fk
-   inst(ID,n,s)
-   stud(ID,n,tot)

### 6) Redundancy of Schemas

<p align="center">
<img src="/databasedesign/20.png"  width="400">
</p>

-   각각 table을 만들었을때 good design 인가? -> 아니다. redundancy가 많이 생겨서.
-   다 : 다 라면 변환규칙이 각각 table로 만드는 것밖에 없었다.
-   1 : 다 라면 별도 table로 만들어도 되고, 외래키를 통해 table를 만들지 않아도 된다.
-   1: dept(dn, building, budget)
-   다: instrucor(ID, name, salary)
-   i\_d(ID, dn) (1:다 여서 다 쪽이 pk) -> 별도의 table로 만들 경우 redundancy 존재
-   해결
-   dept(dn, building, budget)
-   instrucor(ID, name, salary, dn)
-   다 쪽에 fk, 만약 1에 fk 를 설치하면 중복 값이 나온다.
-   단, total이 아니라 단선이면, null 값이 생길 수 있음
-   1 : 1 이라면 어느쪽에 fk 삽입해도 좋음

<p align="center">
<img src="/databasedesign/21.png"  width="400">
</p>

-   sec\_course (cid, sid, sem, year)
-   section ( cid, sid, sem, year ) 
-   두 table이 redundant 해진다. -> 해결: identifier relationship은 무시(삭제)한다.

## **2\. Extendend ER features**

-   더 복잡한 data때문에 ER model을 향상시키기 위해 향상된 ER model이 개발되었다.

- Specialization

- Generalization

- Aggregation

<p align="center">
<img src="/databasedesign/22.PNG"  width="400">
</p>

### 1) Specialization

-   하나의 entity가 두개의 하위 level entity로 나눠지는 top-down approach를 specialization이라 한다.
-   하위 level entity는 상위 level entity의 속성과 relationship participation을 모두 상속받는다.

### 2) Generalization(=ISA relationship)

-   같은 feature를 갖는 하위 level entity들을 bottom up으로 결합하는 것을 Generalization이라 한다.
-   Specialization과 Generalization은 접근법과 시작점의 차이이다. (generalization 을 더 많이 사용)
-   instructor is a person -> ISA relationship
-   Overlapping : person(100) employee(60) and student(50) 조교 같은 경우

<p align="center">
<img src="/databasedesign/23.PNG"  width="200">
</p>

-   Disjoint : emloyee(60) instructor(30) and secretary(30)

<p align="center">
<img src="/databasedesign/24.PNG"  width="200">
</p>

-   total : 객체가 무조건 low level에 전부 포함되어야 한다.<-> partial (선 위에 써준다.)

### 3) Representing specialization via Schemas

(1) method 1

<p align="center">
<img src="/databasedesign/25.PNG"  width="400">
</p>

-   각각 고유속성으로 table을 만들고, high level의 pk를 fk로 가져온다.
-   단점 : 각각의 고유속성만 보이고, 상위의 속성을 보려면 비용이 비싼 join(id=id)을 해야한다. 

(2) method 2

<p align="center">
<img src="/databasedesign/26.PNG"  width="400">
</p>

-   미리 join을 하여 상속받은 속성들까지 다 속으로 사용한다.
-   단점 : name, street, city가 중복적으로 나타난다.

### 4) Aggregation (IS\_PART\_OF\_RELATIONSHIP) 

-   어떤 entities들 사이의 관계가 entity로 여겨질때 Aggregation을 사용한다.
-   composite 속성이 aggregation의 예

<p align="center">
<img src="/databasedesign/27.PNG"  width="400">
</p>

-   aggregation을 통해 추상화를 하여 중복성을 제거하자

<p align="center">
<img src="/databasedesign/28.PNG"  width="400">
</p>

-   evaluation entity와 추상화된 project entity 로 binary relationship을 표현하여 이해하기 쉽게 만든다.
-   p\_g(iID,sID,pID)
-   eval\_for(eID,iID,sID,pID)
-   redundant -> p\_g table 삭제

## **3\. Design Issues**

### 1) Common mistakes in ER diagrams

<p align="center">
<img src="/databasedesign/29.PNG"  width="400">
</p>

-   a : student entity에 dept\_name이 있는데 stud\_dept relationship도 존재, 중복성 속성 삭제
-   b : 다 : 다 로 모델링 됐는데, 이렇게 되면 assignment marks가 한번만 존재

<p align="center">
<img src="/databasedesign/30.PNG"  width="400">
</p>

-   해결
-   c : weak entity 사용, 각각 과제마다 연결
-   d : 다중값 속성 사용

### 2) Entities vs Attributes

<p align="center">
<img src="/databasedesign/31.PNG"  width="400">
</p>

-   상황에 따라 다름.
-   entity set: 식별자에 의해 descriptive한 선택이 필요 (자택, 사무실 등 location에 따라 분류를 해야하면 오른쪽 선택)
-   attributes: 값이 하나만 있어도 되면 왼쪽 선택

### 3) Entities vs Relationship sets

<p align="center">
<img src="/databasedesign/32.PNG"  width="400">
</p>

-    takes relationship sets으로 하는 경우 : 단순하게 양자간의 관계만 표현 
-   registration entities 로 하는 경우 : 간접적 표현, 또다른 제약이 있음 (section\_reg, student\_reg 새로운 관계)

<p align="center">
<img src="/databasedesign/33.PNG"  width="400">
</p>

-   date를 relationship에 넣는가 다른 객체에 속성으로 넣는가?
-   다 : 다 상황 - advisor에 넣는 법 밖에 없음
-   1 : 다 상황 - 다 쪽에 할 수도 있음
-   1 : 1 상황 - 다 됨

### 4) Binary vs n-ary relationships

<p align="center">
<img src="/databasedesign/34.PNG"  width="400">
</p>

-   binary 로 바꿀 수도 있음

### 5) ER notations

<p align="center">
<img src="/databasedesign/35.PNG"  width="400">
</p>
<p align="center">
<img src="/databasedesign/36.PNG"  width="400">
</p>
