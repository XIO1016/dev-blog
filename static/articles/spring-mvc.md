---
title: 스프링 부트 입문하기 1
slug: spring-mvc
category: spring
date: 2023.02.06
description: 김영한 강사님의 스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술 강의를 보며 공부하고 느낀 내용입니다.
img: spring-mvc.png
author: XIO1016
visibility: true
main: false
---

<p align="center">
<img src="/spring-mvc/spring-mvc.png"  width="300">
</p>

많은 대기업들이 사용하는 벡엔드 프레임워크 스프링을 공부하기로 마음 먹었고,
입문으로는 많은 사람들이 추천해줬던 김영한님의 스프링 부트, 웹 MVC 강의를 보았다.

> 전체 실습 코드: https://github.com/XIO1016/springMVC-enter

## 프로젝트 설정

### 프로젝트 생성

강의에 나온 것처럼 스프링 부트 스타터를 사용해서 스프링 프로젝트를 생성했으나, 시간이 지남에 따라 살짝 설정을 변경하고 진행했다.

````text
Gradle Project - Groovy
Spring Boot : 3.0.4
Language : Java
Packaging : Jar
Java : 17
Dependencies : Spring Web, Thymeleaf
IDE : IntelliJ
````

### 라이브러리

Gradle은 의존관계가 있는 라이브러리를 함께 다운로드한다

````text
* Spring Boot 라이브러리
spring-boot-starter-web
spring-boot-starter-tomcat: 톰캣 (웹서버)
spring-webmvc: 스프링 웹 MVC
spring-boot-starter-thymeleaf: 타임리프 템플릿 엔진(View)
spring-boot-starter(공통): 스프링 부트 + 스프링 코어 + 로깅
spring-boot
- spring-core
  spring-boot-starter-logging
- logback, slf4j
````

````text
* 테스트 라이브러리
junit : 테스트 프레임워크
mockito : 목 라이브러리
assertj : 테스트코드를 좀 더 편하게 작성할 수 있도록 도와주는 라이브러리
spring-test : 스프링 통합 테스트 지원
````

## 스프링 웹 개발 종류

### 정적 컨텐츠

URL로 접속하면 서버가 파일을 브라우저로 바로 내려주는 방식
ex) welcome page

### MVC와 템플릿 엔진

서버를 거쳐서 페이지를 변형한 뒤 브라우저로 전송하는 방식(뷰 반환)
controller : 비지니스 로직을 작성하는 등 내부의 작업에 집중해야함
view : 화면을 그리는데에 집중해야함

````java

@Controller
public class HelloController {
    @GetMapping("hello-mvc")
    public String helloMvc(@RequestParam("name") String name, Model model) {
        model.addAttribute("name", name);
        return "hello-template";
    }
}
````

````html

<html xmlns:th="http://www.thymeleaf.org">
<body>
<p th:text="'hello ' + ${name}">hello! empty</p>
</body>
</html>
````

ViewResolver를 통해 템플릿을 처리한다.

### API

반환값으로 JSON을 사용하여 클라이언트에게 데이터 전달(데이터 반환)
화면은 클라이언트가 알아서 그려야한다.

````java

@Controller
public class HelloController {
    @GetMapping("hello-api")
    @ResponseBody
    public Hello helloApi(@RequestParam("name") String name) {
        Hello hello = new Hello();
        hello.setName(name);
        return hello; //객체반환
    }

    static class Hello {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
````

@ResponseBody를 사용하고, 객체를 반환하면 객체가 JSON으로 변환됨
HTTP의 BODY부에 데이터를 직접 반환한다.

viewResolver 대신에 HttpMessageConverter가 동작한다.
<br />
기본 문자처리 : StringHttpMessageConverter
<br />
기본 객체처리 : MappingJackson2HttpMessageConverter
