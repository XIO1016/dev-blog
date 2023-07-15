---
title: Flutter의 Unit test
slug: flutter-test
category: flutter
date: 2023.02.20
description: flutter의 세가지 테스트 중 unit test
img: flutter.png
author: XIO1016
visibility: true
main: true
---

<p align="center">
    <img src="/images/flutter.png"  width="300" alt="flutter.png">
</p>

플러터로 간단한 프로젝트를 몇 번 했는데도, 핫리로딩 기능이 너무 좋아서 unit test의 필요성을 느끼지 못했다.
앱의 기능이 많아질수록 수동으로 테스트하기는 더 어려워지고, 코드의 품질 관리를 위해서는 테스트 코드를 작성하는 것이 필수이다.
자동 테스트는 기능과 버그 개선 속도를 유지하여 앱을 출시하기 전에 정상적으로 작동할 수 있도록 보장해준다.

플러터에서 테스트는 다음과 같이 나뉜다.

````text
단위 테스트: 단위 기능, 방법 또는 클래스를 테스트
위젯 테스트: 단일 위젯을 테스트
통합 테스트: 완성된 앱이나 앱의 상당 부분을 테스트
````

해당 글에서는 flutter의 단위 테스트에 대해서 알아보려고 한다.

## Unit Testing

유닛 테스팅은 메소트나 클래스처럼 작은 단위를 테스트할 때 쓰인다. 외부에 의존하는 IO 처리, 데이터베이스에 접근 하는 경우는
Mockito라는 테스트 프레임워크를 사용한다.

### 설정 및 첫 테스트 실행하기

1. test 라이브러리 추가
- pubspec.yaml
````json
dev_dependencies:
  test: any
````

2. test 폴더에 이름_test.dart 파일 추가 (파일 이름은 test로 끝나야 함)

3. test 코드 작성
- test/test.dart
````dart
import 'package:test/test.dart';

void main() { 
  test('should be lowercase', () { // 테스트 설명을 적고, 실행
    String hello = "Hello World"; 
    expect(hello.toLowerCase(), "hello world"); // 기댓값과 실제 값 비교
  });
}
````
test 함수와 expect 함수를 쓴다.
테스트를 실행해보면 문제 없이 잘 실행되는 것을 볼 수 있다.

### test 함수
- test
테스트에 대한 설명과 실제 테스트 코드를 적는다.
시간 제한(timeout) 이나 테스트 환경 (브라우저, OS) 등도 적을 수 있다.
- expect
expect(실제값, 기대값),
테스트의 기대값과 실제값을 비교한다.
- setup
테스트 시작하기 전에 설정을 한다.
테스트 단위 하나마다 실행 ( test() 함수 하나가 테스트 단위 하나, 한 파일에 여러 test() 가 있으면 여러번 실행된다. )
- setupAll
테스트 시작하기 전에 설정을 한다.
파일 하나에 한번만 실행 (데이터 베이스 설정 등)
- teardown
테스트를 마치고 할 작업
테스트 단위 하나마다 실행
- teardownAll()
테스트를 마치고 할 작업
파일 하나에 한번만 실행
- group()
관련 있는 테스트를 결합할 수 있다.

## 예제
### 비동기 테스트
플러터를 다루다 보면, 비동기 데이터를 다룰때가 많다.
테스트를 어떻게 해야하는지 알아보겠다.

````dart
void main() {
  test('new Future.value() returns the value', () {
    var value = Future.value(10);
    expect(value, Future.value(10));
  });
}
````
위와 같이 실행하면 test를 통과할 것 같지만, 실제로는 fail를 내뱉는다.
````text
Expected: <Instance of 'Future<int>'>
  Actual: <Instance of 'Future<int>'>
````
둘 다 퓨처의 인스턴스지만 같은 인스턴스는 아니라서 실패한다.

퓨처를 테스트할때는 expect(실제값, 기대값) 중 기대값을 completion으로 해줘야 한다.
<br />
completion은 퓨처가 완료될 때까지 테스트를 기다린다.

````dart
void main() {
  test('new Future.value() returns the value with completion', () {
    var value = Future.value(10);
    expect(value, completion(10));
  });
}
````

