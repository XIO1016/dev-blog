---
title: Django 서비스 AWS로 배포하기 - [2] uWSGI 연결
slug: django-aws2
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

프로젝트를 웹 서버와 이어주는 작업을 해야하는데,
그 전에 Django는 웹 서버와 직접적으로 통신할 수 없기 때문에 이를 중간에서 이어줄 python 프레임워크인 WSGI(Web Server Gateway Interface) server를 설치해 주어야 한다. 
이번 포스트는 uWSGI python 패키지를 이용해 WSGI 서버를 Django와 연결해 보도록 하겠다.

## runserver
로컬 컴퓨터에서와 동일하게 가상환경을 만들어 주고 패키지 버전들을 저장하기 위해 requirements.txt를 통해 패키지 설치
````linux
$ sudo apt-get install python3-venv

$ cd ~
$ python3 -m venv myvenv

$ source myvenv/bin/activate

$ cd /srv/django-deploy-test/
$ pip3 install -r requirements.txt
````
requirements를 설치해주는 파이썬 버전 때문에 오류가 생겼었다. 따라서 로컬 컴퓨터의 파이썬 버전과 우분투의 파이썬 버전을 맞춰주었다.

- runserver
````linux
$ python3 manage.py runserver 0:8080
````
서버가 구동되면 자신의 퍼블릭 DNS 주소 뒤에 포트 번호를 의미하는 :8080을 붙여 브라우저에 접속할 수 있다.
아마 로딩만 하고 페이지가 띄워지지 않는 것을 볼 수 있다. 우리가 만든 서버의 8080 포트가 열려있지 않기 때문에.

AWS 로 접속하여 EC2 화면으로 가서 보안그룹에서 Edit inbound rules 클릭
새로운 8080 포트를 추가하고 저장

<p align="center">
<img src="/django-aws/3.png"  width="600">
</p>

그 뒤, 로컬 컴퓨터에 있는 프로젝트의 settings.py에 ALLOWED_HOSTS에 주소를 추가해야 한다.

- mysite/settings.py
````text
ALLOWED_HOSTS = [
    ".ap-northeast-2.compute.amazonaws.com"
]
````
저장하고 깃허브 push pull
다시 runserver하면 서버에 잘 접속된 것을 확인할 수 있다.

그렇지만 아직 배포를 성공한 것은 아니다.
runserver는 Django가 제공해주는 작은 개발자용 웹 서버에 불과하다.
nginx라는 웹 서버를 이용해서 안정적인 배포를 할 필요가 있다.

## uWSGI
Django는 웹 서버와 직접 통신할 수 없어서 둘 사이에 WSGI를 두어야 한다.

가상환경 활성화, uwsgi 설치
````linux
$ source ~/myvenv/bin/activate
$ pip3 install uwsgi
````

uwsgi 서버를 이용해 Django 프로젝트를 연결
````linux
$ uwsgi --http :8080 --home /home/ubuntu/myvenv/ --chdir /srv/django-deploy-test/ -w mysite.wsgi
````
다시 사이트에 들어가보면,
runserver를 실행하지 않아도 Django 프로젝트에 접속한 것을 볼 수 있다. 
하지만, 매번 저 복잡한 명령어를 쳐서 서버를 열 수는 없으니 파일로 옵션들을 정해서 실행할 수 있도록 하겠다.

## 명령어 간편화
로컬 컴퓨터로 돌아와서 manage.py가 있는 폴더에서 .config 폴더를 만들고 그 안에 uwsgi 폴더를 만든다.

uwsgi 폴더에서 mysite.ini 를 만들고 다음을 추가한다
- .config/uwsgi/mysite.ini
````linux
[uwsgi]
chdir = /srv/django-deploy-test/
module = mysite.wsgi:application
home = /home/ubuntu/myvenv/
 
uid = ubuntu
gid = ubuntu
 
http = :8080
 
enable-threads = true
master = true
vacuum = true
pidfile = /tmp/mysite.pid
logto = /var/log/uwsgi/mysite/@(exec://date +%%Y-%%m-%%d).log
log-reopen = true
````
> 오타 하나라도 있으면 바로 에러 발생하니 경로를 잘 확인하자.

저장하고 github에 올린 뒤에 서버 컴퓨터에 돌아가서 
다시 git pull 하여 변경 사항(mysite.ini 추가)을 업데이트.
먼저 logto 경로에 폴더 (/var/log/uwsgi/mysite/)가 없기 때문에 만들어주어야 한다.
````linux
$ sudo mkdir -p /var/log/uwsgi/mysite
//이 로그는 uwsgi 실행자는 현재 기본 계정인 ubuntu의 소유여야 로그를 작성할 수 있다.
$ sudo chown -R ubuntu:ubuntu /var/log/uwsgi/mysite/
````
mysite.ini에 있는 옵션을 이용해 uwsgi 서버를 다시 켜본다.
관리자 권한으로 실행해야 하기 때문에 ubuntu의 홈 폴더에 있는 가상환경 내의 uwsgi를 직접 실행한다.
설치한 uwsgi는 가상환경 폴더 안의 bin 폴더에 있다.

````linux
$ sudo /home/ubuntu/myvenv/bin/uwsgi -i /srv/django-deploy-test/.config/uwsgi/mysite.ini
````
정상작동!
