---
title: Django 서비스 AWS로 배포하기 - [1] AWS 설정 및 github 연동
slug: django-aws
category: django
date: 2023.02.09
description: django 첫 배포를 하고 나서.
img: django.png
author: XIO1016
visibility: true
main: false
---

<p align="center">
<img src="/images/django.png"  width="300">
</p>

django를 공부하고, 프로젝트를 하던 하던 중 프론트엔드인 flutter와 연동하기 위해서 서버를 올리기로 마음 먹었다.
굳이 서버를 올리지 않고 2시간마다 한 번씩 주소를 바꿔서 한다거나 하는 방법도 있지만, 보통 그렇게 하지 않으니 기업에서 많이 쓰는 AWS로 배포하기로 했다.

막상 올려보니까 방법이 그리 쉽지 않고 또 까먹을 것 같아서 기록한다.

````text
개발환경
- MAC os
- AWS EC2 서비스의 Ubuntu 18.04
- django 프로젝트 만드는 법은 안다고 생각하고 진행
````

## requirements.txt

프로젝트를 업로드할 준비가 되면, 프로젝트에 사용한 패키지들을 서버 컴퓨터에서도 똑같은 패키지를 설치할 수 있도록 requirements.txt에 만들어 두는 것이 좋다.

- manage.py 폴더에서

````text
pip3 freeze >> requirements.txt
````

## 서버 임대하기

AWS 계정을 만든 뒤, 로그인하고 상단 "서비스" 메뉴를 클릭한 뒤, EC2 를 검색해 들어간다.

<p align="center">
<img src="/django-aws/1.png"  width="600">
</p>

좌측 메뉴에 인스턴스를 클릭하고 인스턴스 시작을 누른다.
<p align="center">
<img src="/django-aws/2.png"  width="600">
</p>

컴퓨터 이미지를 선택하라는 화면이 나오는데 Ubuntu Server 18.04 LTS를 선택한다.
인스턴스 유형은 프리티어가 붙은 걸로.

다른 건 놔두고, 바로 시작하기 누르면 키 페어를 생성하라고 나온다.
새 키 페어 생성 후 다운로드

기다리면 인스턴스가 켜진다. 그 다음 필요한 건 pem키 관리.
다운로드된 폴더에 있는 키 페어를 홈 폴더(~)의 .ssh 폴더로 옮긴다. 만약 홈 폴더에 .ssh 폴더가 없다면 만든 뒤에 옮다.

````linux
(~/.ssh 폴더가 없을 경우) $ mkdir ~/.ssh/
$ mv ~/Downloads/deploy_test.pem ~/.ssh/
````

키 페어 파일의 권한을 소유주만 읽을 수 있도록 변경한다.

````linux
$ chmod 400 ~/.ssh/deploy_test.pem
````

## EC2 서버 원격 접속

자신이 만든 프로젝트를 배포하려면 서버에도 그 프로젝트 파일들이 있어야 한다. 그러기 위해서 EC2 컴퓨터로 원격 접속을 해야한다.
키 페어와 함께 다음과 같이 원격 접속을 할 수 있다.

````linux
$ ssh -i [키 페어 경로] [유저 이름]@[퍼블릭 DNS 주소]
````

유저 이름은 ubuntu, 퍼블릭 DNS 주소는 ec2 설정화면에서 볼 수 있다.
yes 로 연결 진행.

항상 키페어로 접속하면 명령어가 길어지니 추가 설정으로 줄여줄 수 있다.

1. id_rsa.pub 생성

````linux
$ ssh-keygen
````

2. rsa 값 읽어오기

````linux
$ cat ~/.ssh/id_rsa.pub
````

ssh-rsa ~ 포함해서 모두 복사

3. 등록하고자 하는 컴퓨터에 접속

````linux
$ vi ~/.ssh/authorized_keys
````

4. i 를 눌러 수정 모드로 바꾼 뒤, 복사한 id_rsa.pub 값을 첫 줄에 붙여넣기
5. 로컬 컴퓨터에서 ssh configuration 파일을 수정

````linux
$ vi ~/.ssh/config
````

````linux
Host strawberry
        Hostname ec2-123-123-123-123.ap-northeast-2.compute.amazonaws.com
        User ubuntu
````

형태로 작성 후 저장

6. 해당 이름으로 원격 접속 가능

````linux
$ ssh strawberry
````

## AWS EC2 기본 설정

````linux
$ sudo apt-get update
$ sudo apt-get dist-upgrade //패키지 의존성 검사 업데이트
$ sudo apt-get install python3-pip //pip3 설치
````

## 깃허브 설정

깃허브에 프로젝트 파일들 올리고, AWS EC2에 접속

프로젝트 파일들은 모두 /srv/ 폴더에 다운로드

````linux
$ sudo chown -R ubuntu:ubuntu /srv/
````

git clone

````linux
$ cd /srv
$ git clone [레포지토리 주소]
````

