---
title: 스프링 부트 입문하기 2
slug: spring-mvc2
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

회원 관리 예제를 통한 스프링 공부.
> 전체 실습 코드: https://github.com/XIO1016/springMVC-enter

## 비즈니스 요구사항 정리
- 데이터: 회원ID, 이름
- 기능: 회원 등록, 조회 (간단한 기능만)
- 아직 데이터 저장소가 선정되지 않음(가상의 시나리오)

<p align="center">
<img src="/spring-mvc/1.png"  width="400">
</p>

- 컨트롤러: 웹 MVC의 컨트롤러 역할
- 서비스: 핵심 비즈니스 로직 구현
- 리포지토리: 데이터베이스에 접근, 도메인 객체를 DB에 저장하고 관리
- 도메인: 비즈니스 도메인 객체, 예) 회원, 주문, 쿠폰 등등 주로 데이터베이스에 저장하고 관리됨

<p align="center">
<img src="/spring-mvc/2.png"  width="400">
</p>

- 아직 데이터 저장소가 선정되지 않아서, 우선 인터페이스로 구현 클래스를 변경할 수 있도록 설계 데이터 저장소는 RDB, NoSQL 등등 다양한 저장소를 고민중인 상황으로 가정
- 개발을 진행하기 위해서 초기 개발 단계에서는 구현체로 가벼운 메모리 기반의 데이터 저장소 사용

## 회원 도메인과 리포지토리 만들기

- Member 객체
````java
package hello.hellospring.domain;
  public class Member {
      private Long id;
      private String name;
      public Long getId() {
          return id;
    }
      public void setId(Long id) {
          this.id = id;
    }
      public String getName() {
          return name;
    }
      public void setName(String name) {
          this.name = name;
    }
  }
````
- MemberRepository interface
````java
package hello.hellospring.repository;
import hello.hellospring.domain.Member;
import java.util.List;
import java.util.Optional;
public interface MemberRepository { 
    Member save(Member member);
    Optional<Member> findById(Long id);
    Optional<Member> findByName(String name);
    List<Member> findAll();
}
````
- MemoryMemberRepository 구현체
````java
package hello.hellospring.repository;
import hello.hellospring.domain.Member;
import java.util.*;

public class MemoryMemberRepository implements MemberRepository{

    private static Map<Long, Member> store = new HashMap<>();
    private static long sequence = 0L;

    @Override
    public Member save(Member member) {
        member.setId(++sequence);
        store.put(member.getId(), member);
        return member;
    }

    @Override
    public Optional<Member> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Optional<Member> findByName(String name) {
        return store.values().stream()
                .filter(member -> member.getName().equals(name))
                .findAny(); // Optional: 있으면 해당 객체 반환, 없으면 널 반환
    }

    @Override
    public List<Member> findAll() {
        return new ArrayList<>(store.values()); 
        // 만들어진 필드는 Map, list(반복등으로 사용이 편하기 때문에 많이 사용)로 반환하기 위해 새로운 객체를 생성해서 반환
    }
}
````
## MemberRepository test case 작성
- Unit test로 정확도 향상(JUnit)
````java
package hello.hellospring.repository;

import hello.hellospring.domain.Member;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

public class MemoryMemberRepositoryTest {

    MemoryMemberRepository repository = new MemoryMemberRepository();

    @AfterEach
    public void afterEach() {
        repository.clearStore();
    }

    @Test
    public void save(){
        Member member = new Member();
        member.setName("Spring");

        repository.save(member);

        Member result = repository.findById(member.getId()).get();
        Assertions.assertEquals(member, result);
    }
    @Test
    public void findByName() {
        //given
        Member member1 = new Member();
        member1.setName("spring1");
        repository.save(member1);
        Member member2 = new Member();
        member2.setName("spring2");
        repository.save(member2);
        //when
        Member result = repository.findByName("spring1").get();
        //then
        assertThat(result).isEqualTo(member1);
    }
    @Test
    public void findAll() {
        //given
        Member member1 = new Member();
        member1.setName("spring1");
        repository.save(member1);
        Member member2 = new Member();
        member2.setName("spring2");
        repository.save(member2);
        //when
        List<Member> result = repository.findAll();
        //then
        assertThat(result.size()).isEqualTo(2);
    }
}
````
- 테스트코드는 빌드시 생성된 test 폴더 하위에 같은 이름의 패키지를 만들고 작성한다.
- 각 메소드마다 @Test 어노테이션으로 테스트코드임을 알려주고 내가 작성한 코드가 정상적으로 돌아가는지 확인하는 코드를 작성한다. 
- @AfterEach : 한번에 여러 테스트를 실행하면 메모리 DB에 직전 테스트의 결과가 남을 수 있다. 이렇게 되면 다음 이전 테스트 때문에 다음 테스트가 실패할 가능성이 있다. @AfterEach 를 사용하면 각 테스트가 종료될 때 마다 이 기능을 실행한다. 여기서는 메모리 DB에 저장된 데이터를 삭제한다.
- 테스트는 각각 독립적으로 실행되어야 한다. 테스트 순서에 의존관계가 있는 것은 좋은 테스트가 아니다.

## Member Service
````java
package hello.hellospring.service;
  import hello.hellospring.domain.Member;
  import hello.hellospring.repository.MemberRepository;
  import java.util.List;
  import java.util.Optional;
public class MemberService {
  private final MemberRepository memberRepository = new
    MemoryMemberRepository();
  /**
   * 회원가입
   */
  public Long join(Member member) {
    validateDuplicateMember(member); //중복 회원 검증 memberRepository.save(member);
    return member.getId();
  }
  private void validateDuplicateMember(Member member) {
      memberRepository.findByName(member.getName())
              .ifPresent(m -> {
                  throw new IllegalStateException("이미 존재하는 회원입니다.");
              });
  }
  /**
   *전체 회원 조회
   */
  public List<Member> findMembers() {
    return memberRepository.findAll();
  }
  public Optional<Member> findOne(Long memberId) {
    return memberRepository.findById(memberId);
  } 
}
````
- 람다 함수를 사용해서 만약 repository에 해당 회원이 있으면 중복 오류를 던진다.
- 회원 리포지토리의 코드가 회원 서비스 코드를 DI 가능하게 변경한다.

````java
public class MemberService {
      private final MemberRepository memberRepository;
      public MemberService(MemberRepository memberRepository) {
          this.memberRepository = memberRepository;
}
... 
}
````
## MemberServiceTest 작성
````java
class MemberServiceTest {
  MemberService memberService;
  MemoryMemberRepository memberRepository;
  @BeforeEach
  public void beforeEach() {
    memberRepository = new MemoryMemberRepository();
    memberService = new MemberService(memberRepository);
  }
  @AfterEach
  public void afterEach() {
    memberRepository.clearStore();
  }
  @Test
  public void 회원가입() throws Exception {
//Given
    Member member = new Member();
    member.setName("hello");
//When
    Long saveId = memberService.join(member);
//Then
    Member findMember = memberRepository.findById(saveId).get();
    assertEquals(member.getName(), findMember.getName());
  }
  @Test
  public void 중복_회원_예외() throws Exception {
//Given
    Member member1 = new Member();
    member1.setName("spring");
    Member member2 = new Member();
    member2.setName("spring");
    //When
    memberService.join(member1);
    IllegalStateException e = assertThrows(IllegalStateException.class,
      () -> memberService.join(member2));//예외가 발생해야 한다. assertThat(e.getMessage()).isEqualTo("이미 존재하는 회원입니다.");
  }
}
````
- @BeforeEach : 각 테스트 실행 전에 호출된다. 테스트가 서로 영향이 없도록 항상 새로운 객체를 생성하고, 의존관계도 새로 맺어준다.

## 스프링 빈과 의존관계
- 스프링의 가장 큰 특징인 의존성 주입(DI)를 위해 스프링 빈을 등록하는 과정이 필요하다.
- 예제에서는 회원 컨트롤러가 회원서비스와 회원 리포지토리를 사용할 수 있게 의존관계를 준비해야 한다.
- 스프링 빈 등록에는 두가지 방법이 있다. 
1. 컴포넌트 스캔과 자동 의존관계 설정
2. 자바 코드로 직접 스프링 빈 등록하기

### 컴포넌트 스캔으로 자동 의존관계 설정
- 생성자에 @Autowired 가 있으면 스프링이 연관된 객체를 스프링 컨테이너에서 찾아서 넣어준다.
- 이렇게 객체 의존관계를 외부에서 넣어주는 것을 DI (Dependency Injection), 의존성 주입이라 한다.
이전 테스트에서는 개발자가 직접 주입했고, 여기서는 @Autowired에 의해 스프링이 주입해준다.
````java
@Controller
  public class MemberController {
      private final MemberService memberService;
      @Autowired
      public MemberController(MemberService memberService) {
        this.memberService = memberService;
      }
}
````
컴포넌트 스캔 원리
- @Component 애노테이션이 있으면 스프링 빈으로 자동 등록된다.
- @Controller 컨트롤러가 스프링 빈으로 자동 등록된 이유도 컴포넌트 스캔 때문이다.
- @Component 를 포함하는 다음 애노테이션도 스프링 빈으로 자동 등록된다. @Controller
  @Service
  @Repository

<p align="center">
<img src="/spring-mvc/3.png"  width="300">
</p>

> 참고: 스프링은 스프링 컨테이너에 스프링 빈을 등록할 때, 기본으로 싱글톤으로 등록한다(유일하게 하나만 등록해서 공유한다) 따라서 같은 스프링 빈이면 모두 같은 인스턴스다. 설정으로 싱글톤이 아니게 설정할 수 있지만, 특별한 경우를 제외하면 대부분 싱글톤을 사용한다.

### 자바 코드로 직접 스프링 빈 등록하기
````java
package hello.hellospring;
    import hello.hellospring.repository.MemberRepository;
    import hello.hellospring.repository.MemoryMemberRepository;
    import hello.hellospring.service.MemberService;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    @Configuration
    public class SpringConfig {
      @Bean
      public MemberService memberService() {
        return new MemberService(memberRepository());
      }
      @Bean
      public MemberRepository memberRepository() {
        return new MemoryMemberRepository();
      }
    }
````
해당 예제에서는 향후 메모리 리포지토리를 다른 리포지토리로 변경할 예정이므로, 컴포넌트 스캔 방식 대신에 자바 코드로 스프링 빈을 설정하였다.
> 참고: XML로 설정하는 방식도 있지만 최근에는 잘 사용하지 않으므로 생략한다.

> 참고: DI에는 필드 주입, setter 주입, 생성자 주입 이렇게 3가지 방법이 있다. 의존관계가 실행중에 동적으로 변하는 경우는 거의 없으므로 생성자 주입을 권장한다.

> 참고: 실무에서는 주로 정형화된 컨트롤러, 서비스, 리포지토리 같은 코드는 컴포넌트 스캔을 사용한다. 그리고 정형화 되지 않거나, 상황에 따라 구현 클래스를 변경해야 하면 설정을 통해 스프링 빈으로 등록한다.

> 주의: @Autowired 를 통한 DI는 helloController , memberService 등과 같이 스프링이 관리하는 객체에서만 동작한다. 스프링 빈으로 등록하지 않고 내가 직접 생성한 객체에서는 동작하지 않는다.
