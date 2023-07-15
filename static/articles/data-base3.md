---
title: 데이터베이스 설계) Database Design Normalization
slug: data-base3
category: CS
date: 2023.02.01
description: 데이터베이스 설계 기초
img: database3.png
author: XIO1016
visibility: true
main: false
---
_이 글은 "Database System Concepts, 7th edition"을 바탕으로 작성되었습니다._

## **1\. Overview of Normalization**

### 1) Features of Good Relational Designs

-   instructor과 department table을 합쳤을 때, good design?

<p align="center">
<img src="/databasedesign/37.PNG"  width="400">
</p>

-   redundancy -> 같은 dept\_name의 building budget이 중복
-   incomplete -> new department를 추가했을때, 교수가 null값인 상황 -> ID에 null값이 들어감(삽입 이상)
-   mozart를 삭제했을때 music과도 사라지게 됨 (삭제 이상)

### 2) A combined schema without repetition

-   combine하는게 꼭 나쁘지는 않음
-   sec\_class(sec\_id, building, room\_number) + section(course\_id, sec\_id, semester, year)
-   section(course\_id, sc\_id, semester, year, building, room\_number)
-   no repetition, 합치는게 맞다.

### 3) Decomposition

-   문제가 되는 table을 분해
-   Not all decomposition are good

<p align="center">
<img src="/databasedesign/38.PNG"  width="400">
</p>

-   employee(ID, name, street, city, salary)
-   분해 ->employee1(ID, name) , employee2(name, street, city, salary)
-   name=name으로 join
-   kim이라는 동명이인 때문에 서로 다른 사람이 join됨
-   lossy decomposition (정확성 손실 분해)

### 4) lossless decomposition (무손실 분해)

-   R = R1 ∪ R2 로 분해
<p align="center">
    <img src="/databasedesign/39.PNG"  width="400">
</p>

-   lossy decomposition-> join한 table이 original보다 크다

<p align="center">
<img src="/databasedesign/40.PNG"  width="400">
</p>

### 5) Normalization theory

-   R이 good form이 아니면 decompose한다. -> 계속 분해하여 n개의 table
-   n개가 다 bcnf가 되는가-> good form, 무손실 분해
-   functional dependency 함수 종속

### 6) Functional dependency

-   다양한 제약들이 데이터에 있다
-   X와 Y를 임의의 속성 집합이라 할때, X의 값이 Y의 값을 유일하게 결정할 경우.
-   "X는 Y를 함수적으로 결정"하고, "Y는 X에 함수적으로 종속된다" 라고 한다.
-   쉽게 말해 X가 같을 때, Y도 같으면 된다. -> x는 결정자, y는 종속자
-   x, y는 복수개가 가능하다.

-   함수 종속 정의 :
-   x ⊆ R and y ⊆ R
-   x -> y  functional dependency일때,
-   t1\[x\] =t2\[x\]  =>  t1\[y\] =t2\[y\]
-   y->x hold, x->y not hold

### 7) Closure a set of functional dependencies

-   함수적 종속성의 집합인 F가 있다고 할 때, F로부터 자연스럽게 유도되는 함수적 종속성이 있다.
-   추론: A->B, B->C, => A->C (transitive)
-   이렇게 나온 모든 함수적 종속성의 집합을 F의 closure라고 하고 기호로 F+로 표시한다

### 8) Keys and Functional Dependencies

-   K가 릴레이션 스키마 R의 슈퍼키(고유식별자)이면 K→R이다.
-   K가 릴레이션 스키마 R의 후보키(고유식별자 중 불필요한 요소 제외해 minimal)이면  K→R이다.
-   a ⊂ K, a->R은 성립하지 않는다.

\* instructor table에서 name ->ID가 성립? 

-   성립하지 않는다. (동명이인인 경우)
-   insert했을 때를 확인해야한다. 응용의 내용과 제약을 봐야지, 특정 시점의 예시를 보면 안된다.

\* Trivial functional dependencies 

-   당연히 성립하는 함수 종속
-   ID, name -> ID
-   name-> name
-   일반적으로 b가 a에 포함되면, a→b 은 Trivial 이다.

### 9) Lossless Decomposition

-   무손실 분해인지 판별하는 법

<p align="center">
<img src="/databasedesign/41.PNG"  width="400">
</p>

-   겹치는 것이 R1 또는 R2 table의 superkey이어야 한다.

<p align="center">
<img src="/databasedesign/42.PNG"  width="400">
</p>

### 10) Dependency Preservation

-   매번 데이터베이스가 업데이트 될 때마다 종속성 체크는 비효율.
-   분해된 릴레이션들 중 하나의 릴레이션에서만 종속성이 확인되면 종속성 보존.
-   종속성 확인을 위해 카티전 프로젝트로 여러 릴레이션을 재구성해야 되는 경우는 비효율. 종속성 보존 안됨.
-   함부로 분해하면 종속성 보존 안됨. 제약 조건을 보고 종속성에 영향 없게 분해.


### 11) Boyce -Codd Normal Form (BCNF)

-   R이 bcnf인가? -> 테이블의 함수 종속을 알아야함. (F+)
-   F+ 중 trivial 한 것과 non-trivial 한 것이 있음
-   a -> b 가 trivial
-   nontrivial일 때 a가 superkey
-   모든 F+에서 두 조건 중 하나를 만족해야함

example)

-   in\_dep(ID, name, salary, dept\_name, building, budget)
-   위는 bcnf가 아니다.
-   dept\_name-> building, budget (non-trivial)
-   dept\_name이 superkey가 아니기 때문
-   instructor와 department로 나누면 둘다 bcnf

### 12) Decomposing a schema into BCNF

-   table R이 bcnf가 아니면 분해한다. (a->b,  nontrivial FD에서 고유식별자가 아닐때)
-   a∪b: 문제가 되는 함수종속의 결정자와 종속자를 독립시킨다.
-   R-(B-a): 종속자를 빼고 나머지 칼럼을 만든다. (대부분은 a와 b는 겹치지 않음)

<p align="center">
<img src="/databasedesign/43.PNG"  width="400">
</p>

-   example)

<p align="center">
<img src="/databasedesign/45.PNG"  width="400">
</p>

-   course\_id가 superkey? 아니다.
-   building, room\_number superkey? 아니다.
-   course\_id, sec\_id, semester, year superkey? 맞다.
-   문제가 되는 부분 분해

<p align="center">
<img src="/databasedesign/46.PNG"  width="400">
</p>

-   class-1: bcnf 아님(building, room\_number -> capacity, building, room\_number가 superkey아님), 다시분해

<p align="center">
<img src="/databasedesign/47.PNG"  width="400">
</p>

-   bcnf됨.

\*overall database design process

-   각각 ermodeling을 하여 table을 만드는 게 아닌, 하나의 relation으로 만들어 nomalization하는 방법도 있따.
-   ERD를 잘 그리면 normalization 과정이 필요없다.

\*denormalization

-   denormalization : 모든 table이 무조건 bcnf가 되어야하나? 설계자의 판단
-   검색 성능, 공간 시간의 이득 (검색할 때마다 join을 해야할 경우 중복성을 포기할 수도 있음.)

\*other design issue

-   earning(company\_id, year, amount)
-   earnings\_2004, earnings\_2005 (company\_id, earnings)
-   company\_tear(company\_id, earnings\_2004, earnings\_2005)
-   이런식으로 나누면 좋지 않은 스키마임에도 모두 bcnf이다. normalization이 잡아내지 못하는 bad design

\*1NF: 임의의 row와 column이 교차하는 지점이 atomic 해야한다. 가장 기본조건

\*2NF: 완전종속, 부분종속 (합성키)

\*3NF: 이행(transitive) 종속

\*bcnf 

\- 후보키 1개일때 가정, 3nf와 bcnf는 장단점이 있다.
