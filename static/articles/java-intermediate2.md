---
title: 자바 복습 2
slug: java-intermediate2
category: spring
date: 2023.01.15
description: 프로그래머스 자바 중급 강의를 듣고 배운점
img: java.png
author: XIO1016
visibility: true
main: false
---

<p align="center">
<img src="/java-intermediate/1.PNG"  width="200">
</p>

## Annotation
- 어노테이션은 클래스나 메소드위에 붙는다. @(at)기호로 이름이 시작한다.
- 어노테이션을 클래스나 메타코드에 붙인 후, 클래스가 컴파일되거나 실행될 때 어노테이션의 유무나 어노테이션에 설정된 값을 통하여 클래스가 좀 더 다르게 실행되게 할 수 있다.
이런 이유로 어노테이션을 일정의 설정파일처럼 설명하는 경우도 있다.
- 사용자가 직접 작성하는 어노테이션인 Custom 어노테이션도 있다.

### 커스텀 어노테이션을 이용하는 방법
````text
어노테이션을 정의한다.
어노테이션을 클래스에서 사용한다. (타겟에 적용)
어노테이션을 이용하여 실행.
````
패키지 익스플로러에서 [new - Annotation]을 이용하여 Count100이라는 어노테이션 생성
Count100어노테이션을 JVM실행시에 감지할 수 있도록 하려면 @Retention(RetentionPolicy.RUNTIME)를 붙여줘야 한다.
````java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

    @Retention(RetentionPolicy.RUNTIME)
    public @interface Count100 {

    }
````

"hello"를 출력하는 hello()메소드를 가지는 MyHello라는 클래스를 작성
hello메소드 위에 @Count100 어노테이션을 붙인다.
````java
public class MyHello {
    @Count100
    public void hello(){
        System.out.println("hello");
    }
}
````
MyHello클래스를 이용하는 MyHelloExam클래스를 작성
MyHello의 hello메소드가 @Count100어노테이션이 설정되어 있을 경우, hello()메소드를 100번 호출하도록 한다.
````java
import java.lang.reflect.Method;

    public class MyHelloExam {
        public static void main(String[] args) {
            MyHello hello = new MyHello();

            try{
                Method method = hello.getClass().getDeclaredMethod("hello");
            if(method.isAnnotationPresent(Count100.class)){
                    for(int i = 0; i < 100; i++){
                        hello.hello();
                    }
                }else{
                    hello.hello();
                }
            }catch(Exception ex){
                ex.printStackTrace();
            }       
        }
    }
````

comment: 사용자 annotation을 만드는 것은 한 번도 보지 못했는데, 새로 접하게 되었다. 고수가 되어 잘 사용해보고 싶다.

## Thread

### thread란
  - 프로세스(process) 내에서 실제로 작업을 수행하는 주체, 모든 프로세스에는 한 개 이상의 스레드가 존재하여 작업을 수행한다.
  - 자바 프로그램이 하나의 프로세스라면, 하나의 프로세스 안에서도 다양한 작업이 동작할 수 있고 이것을 Thread라고 한다. 즉, 여러가지 작업을 동시에 수행할 수 있도록 도와주는 것

### thread 만들기
1. Thread class 상속받기
   - java.lang.Thread 클래스를 상속받는다. 그리고 Thread가 가지고 있는 run() 메소드를 오버라이딩한다.
````java
   public class MyThread1 extends Thread {
   String str;
   public MyThread1(String str){
   this.str = str;
   }

        public void run(){
            for(int i = 0; i < 10; i ++){
                System.out.print(str);
                try {
                    //컴퓨터가 너무 빠르기 때문에 수행결과를 잘 확인 할 수 없어서 Thread.sleep() 메서드를 이용해서 조금씩 
                    //쉬었다가 출력할 수 있게한다. 
                    Thread.sleep((int)(Math.random() * 1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } 
        } 
   }
````
   - Thread 클래스를 상속받은 MyThread1을 사용하는 클래스
   Thread를 상속 받았으므로 MyThread1은 Thread 이다.
   - 쓰레드를 생성하고, Thread 클래스가 가지고 있는 start() 메소드를 호출 한다.
   ````java
   public class ThreadExam1 {
   public static void main(String[] args) {
   // MyThread인스턴스를 2개 만듭니다.
   MyThread1 t1 = new MyThread1("*");
   MyThread1 t2 = new MyThread1("-");

            t1.start();
            t2.start();
            System.out.print("!!!!!");  
        }   
   }
   ````
2. Runnable interface 구현
   - Runable 인터페이스가 가지고 있는 run()메소드를 구현한다.
   ````java
   public class MyThread2 implements Runnable {
   String str;
   public MyThread2(String str){
   this.str = str;
   }

        public void run(){
            for(int i = 0; i < 10; i ++){
                System.out.print(str);
                try {
                    Thread.sleep((int)(Math.random() * 1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } 
        } 
   }
   ````
   - MyThread2는 Thread를 상속받지 않았기 때문에 Thread가 아니다.
   - Thread를 생성하고, 해당 생성자에 MyThread2를 넣어서 Thread를 생성한다.
   - Thread 클래스가 가진 start()메소드를 호출한다.
   ````java
   public class ThreadExam2 {  
   public static void main(String[] args) {
   MyThread2 r1 = new MyThread2("*");
   MyThread2 r2 = new MyThread2("-");

            Thread t1 = new Thread(r1);
            Thread t2 = new Thread(r2);

            t1.start();
            t2.start();
            System.out.print("!!!!!");  
        }   
   }
   ````
   
### 공유객체
- 공유객체 MusicBox
````java
    public class MusicBox { 
        //신나는 음악!!! 이란 메시지가 1초이하로 쉬면서 10번 반복출력
        public void playMusicA(){
            for(int i = 0; i < 10; i ++){
                System.out.println("신나는 음악!!!");
                try {
                    Thread.sleep((int)(Math.random() * 1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } // for        
        } //playMusicA

        //슬픈 음악!!!이란 메시지가 1초이하로 쉬면서 10번 반복출력
        public void playMusicB(){
            for(int i = 0; i < 10; i ++){
                System.out.println("슬픈 음악!!!");
                try {
                    Thread.sleep((int)(Math.random() * 1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } // for        
        } //playMusicB
        //카페 음악!!! 이란 메시지가 1초이하로 쉬면서 10번 반복출력
        public void playMusicC(){
            for(int i = 0; i < 10; i ++){
                System.out.println("카페 음악!!!");
                try {
                    Thread.sleep((int)(Math.random() * 1000));
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } // for        
        } //playMusicC  
    }
````
- 각각 3개의 thread 객체로 실행하게 되면, 순서가 섞여져서 동시에 실행된다.


### 동기화 메소드와 동기화 블록
- 공유객체가 가진 메소드를 동시에 호출 되지 않도록 하는 방법 
  - 메소드 앞에 synchronized 를 붙힌다.
  - 여러개의 Thread들이 공유객체의 메소드를 사용할 때 메소드에 synchronized가 붙어 있을 경우 먼저 호출한 메소드가 객체의 사용권(Monitoring Lock)을 얻는다.

````java
public synchronized void playMusicA(){
    for(int i = 0; i < 10; i ++){
        System.out.println("신나는 음악!!!");
        try{
        Thread.sleep((int)(Math.random()*1000));
        }catch(InterruptedException e){
        e.printStackTrace();
        }
    }// for        
  } //playMusicA
````
- 메소드 앞에 synchronized 를 붙혀서 실행해 보면, 메소드 하나가 모두 실행된 후에 다음 메소드가 실행된다.
- 해당 모니터링 락은 메소드 실행이 종료되거나, wait()와 같은 메소드를 만나기 전까지 유지된다.
- 다른 쓰레드들은 모니터링 락을 놓을때까지 대기한다.
- synchronized를 붙히지 않은 메소드는 다른 쓰레드들이 synchronized메소드를 실행하면서 모니터링 락을 획득했다 하더라도, 그것과 상관없이 실행된다.
- synchronized를 메소드에 붙혀서 사용 할 경우, 메소드의 코드가 길어지면, 마지막에 대기하는 쓰레드가 너무 오래 기다리는것을 막기위해서 메소드에 synchronized를 붙이지 않고, 문제가 있을것 같은 부분만 synchronized블록을 사용한다.
````java
public void playMusicB(){
    for(int i = 0; i < 10; i ++){
        synchronized(this){
            System.out.println("슬픈 음악!!!");
        }
        try {
          Thread.sleep((int)(Math.random() * 1000));
          } catch (InterruptedException e) {
          e.printStackTrace();
        }
    } // for        
} //playMusicB
````
### 쓰레드와 상태제어
- 쓰레드가 3개가 있다면 JVM은 시간을 잘게 쪼갠 후에 한번은 쓰레드1을, 한번은 쓰레드 2를, 한번은 쓰레드 3을 실행한다.
이것에 빠르게 일어나다 보니 쓰레드가 모두 동작하는 것처럼 보이는 것이다.

- 쓰레드는 실행가능상태인 Runnable과 실행상태인 Running상태로 나뉜다.
- 실행되는 쓰레드 안에서 Thread.sleep()이나 Object가 가지고 있는 wait()메소드가 호출이 되면 쓰레드는 블록상태가 된다.
- Thread.sleep()은 특정시간이 지나면 자신 스스로 블록상태에서 빠져나와 Runnable이나 Running상태가 된다.
- Object가 가지고 있는 wait()메소드는 다른 쓰레드가 notify()나 notifyAll()메소드를 호출하기 전에는 블록상태에서 해제되지 않는다.
- wait()메소드는 호출이 되면 모니터링 락을 놓게 된다. 그래서 대기중인 다른 메소드가 실행한다.
- 쓰레드의 run메소드가 종료되면, 쓰레드는 종료된다. 즉 Dead상태가 된다.
- Thread의 yeild메소드가 호출되면 해당 쓰레드는 다른 쓰레드에게 자원을 양보하게 된다.
- Thread가 가지고 있는 join메소드를 호출하게 되면 해당 쓰레드가 종료될 때까지 대기하게 된다.

comment: 운영체제 시간에 배웠던 thread 기억이 새록새록 난다. flutter를 사용할 때는 single thread여서 multithread를 사용하지 못했고, 그 덕에 조금 느렸었는데, 자바를 사용하면서 해소될 것 같다.

## 람다식
- 람다식은 다른말로 익명 메소드라고도 한다.
- 인터페이스 중에서 메소드를 하나만 가지고 있는 인터페이스를 함수형 인터페이스라고 한다.
- 쓰레드를 만들때 사용하는 Runnable 인터페이스의 경우 run()메소드를 하나만 가지고 있다.

### Runnable을 이용하여 쓰레드를 만드는 방법
````java
    public class LambdaExam1 {

        public static void main(String[] args) {
            new Thread(new Runnable(){public void run(){
                for(int i = 0; i < 10; i++){
                    System.out.println("hello");
                }
            }}).start();
        }   
    }
````

쓰레드가 실행되면 쓰레드 생성자 안에 넣은 run()메소드가 실행된다.
자바는 메소드만 매개변수로 전달할 방법이 없다. 인스턴스만 전달 할 수 있다.
그렇기때문에 run()메소드를 가지고 있는 Runnable객체를 만들어서 전달한다.

- 메소드만 전달할 수 있다면, 좀더 편리하게 프로그래밍할 수 있을텐데, 자바는 메소드만 전달할 수 있는 방법은 없었기 때문에 매번 객체를 생성해서 매개변수로 전달해야 했다. 이런 부분을 해결한 것이 람다표현식이다.
### 람다식을 이용해서 수정한 코드
````java
    public class LambdaExam1 {  
        public static void main(String[] args) {
            new Thread(()->{
                for(int i = 0; i < 10; i++){
                    System.out.println("hello");
                }
            }).start();
        }   
    }
````
- ()->{ ..... } 부분이 람다식, 다른말로 익명 메소드
- JVM은 Thread 생성자를 보고 ()->{} 이 무엇인지 대상을 추론한다.
Thread 생성자 api를 보면 Runnable 인터페이스를 받아들이는 것을 알 수 있다.
- JVM은 Thread 생성자가 Runnable 인터페이스를 구현한 것이 와야 하는 것을 알게 되고 람다식을 Runnable을 구현하는 객체로 자동으로 만들어서 매개변수로 넣어준다.
