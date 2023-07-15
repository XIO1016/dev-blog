---
title: 자바 복습 1
slug: java-intermediate
category: spring
date: 2023.01.07
description: 프로그래머스 자바 중급 강의를 듣고 배운점
img: java.png
author: XIO1016
visibility: true
main: false
---

# 자바
자바를 사용할 때마다 구글링으로 간단한 것들을 찾아보고 코딩을 하면서 나는 자바를 잘 사용하지 못하고 있구나 생각했다.
자바에 대해서 잘 모르니 효율적인 코드를 작성하지 못하고, 무엇보다 자바가 가진 특성을 제대로 활용하지 못한 코딩을 하는 느낌이 들었다.
그래서 이번에 다시 기본기를 잡는다는 느낌으로 프로그래머스에 있는 자바 중급 강의를 듣고 글을 작성한다.
<p align="center">
<img src="/java-intermediate/1.PNG"  width="200">
</p>


## Object class
### Override
모든 클래스는 Object 클래스의 메서드를 사용할 수 있다. 
<br />
ex) equals, toString, hashCode 등의 메서드를 사용할 경우, 오버라이딩하여 사용한다.

````text
- equals : 객체 간의 값 비교시 사용
- toString : 객체가 가진 값을 문자열로 반환
- hashCode : 객체의 해시코드 값 반환
````
override 부분은 flutter를 하면서 봤어서 조금 익숙하다. 새로운 객체를 만들고 toString, toMap 같은 함수들을 오버라이드해서 편하게 썼던 기억이 난다.

## java.lang
자바에서 가장 중요하고 기본이 되는 패키지이다.
<br />
다음과 같은 클래스들이 있다.
````text
- wrapper 클래스 : 8가지의 기본형 타입을 객체로 변환시킬 때 사용하는 클래스
  ex) Boolean, Byte, Short, Integer, Long, Float, Double
- Object 클래스 : 모든 클래스의 최상위 클래스
- String, StringBuffer, StringBuilder 클래스 : 문자열 관련
- System 클래스 : 화면 값 출력
- Math 클래스 : 수학
  이 외에도 Thread와 관련된 클래스 등이 java.lang 패키지에 존재한다.
````
### 오토박싱(Auto Boxing)
  기본형 값을 객체 타입으로 형변환해주는 기능
````java
Integer i3 = 5;
````

### 오토언박싱(Auto unboxing)

  객체 타입 값을 기본형으로 자동 형변환하여 값을 할당

  wrapper 클래스를 사용하여 컴파일러가 자동으로 메서드(ex. intValue) 호출
````java
int i4 = i2.intValue();
int i5 = i2;      
````

## 문자열 다루기
### String Buffer class
문자열을 다룰 때 사용하며 가변 클래스이다. 
````java
StringBuffer sb = new StringBuffer();
sb.append("hello");
sb.append(" ");
sb.append("world");
// StringBuffer에 추가된 값을 toString()메소드를 이용하여 반환

  String str = sb.toString();
````
위와 같이 문자열 뒤에 문자열을 추가하는 등 변화시킬 수 있다.
### 메소드 체이닝
StringBuffer가 가지고 있는 메소드들은 대부분 자기 자신, this를 반환한다.
자기 자신의 메소드를 호출하여 자기 자신의 값을 바꿔나가는 것을 메소드체이닝 이라고 한다.
즉, append 하면 자기자신이 변한 뒤, 그것을 리턴하는 방식이다.

### String class
문자열을 다룰 때 사용하며 불변 클래스이다.

````java
String str1 = "hello world";
String str2 = str1.substring(5);
````
str1의 부분 문자열을 str2에 저장할지라도 str1 자체는 전혀 변화가 없다.

### String class의 문제점
for문 안에서 String 클래스를 사용할 경우, 반복 횟수만큼 String 객체를 생성한다.
````java
String str5 = "";
for (int i=0; i < 100; i++) {
    str5 = str5 + "*";
    }

StringBuffer sb = new StringBuffer();
for (int i=0; i<100; i++) {
    sb.append("*");
}
String s = sb.toString();

````
두 경우 결과는 같지만 +연산을 한 경우에는 반복문 안에서 내부적으로 String 객체를 만든다. 매번 new를 사용해서 연산을 해야하기 때문에 속도가 그만큼 느려진다.


예전에 자바 코드를 작성할 때 1번의 문제가 있는 코드를 작성했는데, 그때마다 이유를 모른 채
intellij의 해결을 수용하곤 했다 .

### Math class
수학 계산을 위한 클래스이다.
</br>
Math 클래스의 생성자가 private이기에 new 연산자로 객체를 생성할 수는 없다.
하지만 모든 메서드와 속성이 static으로 정의되어 있기 때문에 객체를 생성하지 않고 사용할 수 있다.
````java
int value = Math.max(5, 30);
````

## java.util 패키지

- 날짜와 관련된 클래스인 Date, Calendar클래스
  - Date클래스는 지역화를 지원하지 않는다. 지역화란 국가별로 현재 날짜와 시간은 다를 수 있는데, 그 부분을 지원하지 못한다.
  - 이런 문제를 해결하기 위하여 나온 클래스가 Calendar클래스. 
- 자료구조와 관련된 컬렉션 프레임워크와 관련된 인터페이스와 클래스
  - List, Set, Collection, Map은 자료구조 즉 컬렉션 프레임워크와 관련된 인터페이스

### Collection framework

- 자료구조 클래스들. 자료구조란 자료를 저장할 수 있는 구조를 뜻한다.

<p align="center">
<img src="/java-intermediate/collection.png"  width="200">
</p>

- Collection interface
  - 가장 기본이 되는 인터페이스. 중복을 허용하고 자료의 순서를 기억하지 못함.
    특정 위치에 존재하는 자료를 꺼낼 수 없음.
  - add(), size(), iterator()
  - Collection은 저장된 자료를 하나씩 하나씩 꺼낼 수 있는 Iterator 인터페이스를 반환한다.

- Iterator interface
  - 꺼낼것이 있는지 없는지 살펴보는 hasNext() 메소드, 하나씩 자료를 꺼낼때 사용하는 next() 메소드
- Set Interface
  - 중복을 허용하지 않으며, Collection 인터페이스를 상속받는다.
  - add 메소드: 같은 자료가 있으면 false, 없으면 true를 반환
- List Interface
  - 중복은 허용하면서 순서를 기억하는 자료구조이며 Collection 인터페이스를 상속받고 있다.
  - List는 순서를 기억하고 있기 때문에 0번째 1번째 n번째의 자료를 꺼낼 수 있는 get(int)메소드를 가지고 있다.
- Map Interface
  - Key와 Value를 가지는 자료구조이다.
  - 저장할 때 put() 메소드를 이용하여 key와 value를 함께 저장한다.
  - 원하는 값을 꺼낼때는 key를 매개변수로 받아들이는 get()메소드를 이용하여 값을 꺼낸다.
  - Map에 저장되어 있는 모든 Key들은 중복된 값을 가지면 안된다.
  - Key의 이런 특징 때문에 Map은 자신이 가지고 있는 모든 Key들에 대한 정보를 읽어들일 수 있는 Set을 반환하는 keySet() 메소드를 가지고 있다.

### Generic class

````java
box.setObj("hello");
String str = (String)box.getObj();
````
Object를 받아들일 수 있으면 Object의 후손이라면 무엇이든 받아들일 수 있다.
즉, String class로 설정하고 반환할 수 있다는 뜻

- Java5에는 Generic이라는 문법이 사용됨으로써 인스턴스를 만들때 사용하는 타입을 지정하는 문법이 추가

````java
public class Box <E> {
    private E obj;
    public void setObj(E obj){
        this.obj = obj;
    }

    public E getObj(){
        return obj;
    }
}
````
클래스 이름 뒤에 <E>가 제네릭을 적용한 것이다. Box는 가상의 클래스 E를 사용한다는 의미.
Object를 받아들이고, 리턴하던 부분이 E로 변경. E는 실제로 존재하는 클래스는 아니다.  

````java
Box<Object> box = new Box<>();
box.setObj(new Object());
Object obj = box.getObj();

Box<String> box2 = new Box<>();
box2.setObj("hello");
String str = box2.getObj();
````
참조타입에 <Object> , <String>, <Integer>가 있는 것을 볼 수 있다.

### Set class
set은 중복이 없고, 순서도 없는 자료구조. Hashset과 TreeSet이 있다.
````java
    import java.util.HashSet;
    import java.util.Iterator;
    import java.util.Set;

    public class SetExam {
        public static void main(String[] args) {
            Set<String> set1 = new HashSet<>();

            boolean flag1 = set1.add("kim");
            boolean flag2 = set1.add("lee");
            boolean flag3 = set1.add("kim");

            System.out.println(set1.size());   //저장된 크기를 출력합니다. 3개를 저장하였지만, 이미 같은 값이 있었기 때문에 2개가 출력
            System.out.println(flag1);  //true
            System.out.println(flag2);  //true
            System.out.println(flag3);  //false

            Iterator<String> iter = set1.iterator();

            while (iter.hasNext()) {   // 꺼낼 것이 있다면 true 리턴.          
                String str = iter.next(); // next()메소드는 하나를 꺼낸다. 하나를 꺼내면 자동으로 다음것을 참조한다.
                System.out.println(str);
            }
        }
    }
````
### List class
list는 데이터의 중복이 있을 수 있고, 순서도 있다.
````java
    import java.util.ArrayList;
    import java.util.List;

    public class ListExam {

        public static void main(String[] args) {
            List<String> list = new ArrayList<>();

            // list에 3개의 문자열을 저장합니다.
            list.add("kim");
            list.add("lee");
            list.add("kim");

            System.out.println(list.size()); //list에 저장된 자료의 수를 출력 (중복을 허용하므로 3 출력) 
            for(int i = 0; i < list.size(); i++){
                String str = list.get(i);
                System.out.println(str);
            }
        }   
    }
````
### Map class
Map은 key와 value를 쌍으로 저장하는 자료구조 키는 중복될 수 없고, 값은 중복될 수 있다.
````java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;   
public class MapExam {  
public static void main(String[] args) {
// Key, Value가 모두 String 타입인 HashMap인스턴스를 만듭니다.
Map<String, String> map = new HashMap<>();

            // key와 value값을 put으로 저장합니다.
            map.put("001", "kim");
            map.put("002", "lee");
            map.put("003", "choi");
            // 같은 key가 2개 있을 수 없습니다. 첫번째로 저장했던 001, kim은 001, kang으로 바뀐다.
            map.put("001", "kang");

            // map에 저장된 자료의 수를 추력합니다. 3이 출력됩니다.
            System.out.println(map.size());

            // 키가 001, 002, 003인 값을 꺼내 출력합니다.
            System.out.println(map.get("001"));
            System.out.println(map.get("002"));
            System.out.println(map.get("003"));

            // map에 저장된 모든 key들을 Set자료구조로 꺼냅니다.
            Set<String> keys = map.keySet();
            // Set자료구조에 있는 모든 key를 꺼내기 위하여 Iterator를 구합니다.
            Iterator<String> iter = keys.iterator();
            while (iter.hasNext()) {
                // key를 꺼냅니다.
                String key = iter.next();
                // key에 해당하는 value를 꺼냅니다.
                String value = map.get(key);
                // key와 value를 출력합니다.
                System.out.println(key + " : " + value);
            }
        }
    }
````
