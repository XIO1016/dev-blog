---
title: Django 서비스 AWS로 배포하기 - [3] nginx 연결
slug: django-aws3
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

nginx는 대표적인 웹 서버 어플리케이션이다.
웹 서버는 사용자의 요청(request)을 받아 적절한 반응(response)을 해주는 역할을 하는데, 
우리의 Django 프로젝트와 연결한다면 우리가 구축한 이 프로젝트의 방식대로 nginx가 사용자에게 반응해줄 수 있다.

## nginx 연결

먼저 서버 컴퓨터에서 nginx를 설치한다.
````linux
$ sudo apt-get install nginx
````
nginx를 사용하는 유저가 ubuntu임을 알려줘야 한다. 다음 명령어를 통해 설정 파일을 연 뒤,
````linux
$ sudo vi /etc/nginx/nginx.conf

~~ user를 ubuntu로 수정
user ubuntu;
````
로컬 컴퓨터로 돌아와서 nginx 설정 파일을 만들어 준다.
로컬 컴퓨터에서 프로젝트 폴더 내에 .config 폴더 안에 nginx 폴더를 만들고 mysite.conf 파일을 만들어 준다.

````text
.config
├── nginx
│   └── mysite.conf
└── uwsgi
│   └── mysite.ini
````
- .config/mysite.conf 에 입력
````text 
server {
    listen 80;
    server_name *.compute.amazonaws.com;
    charset utf-8;
    client_max_body_size 128M;
 
    location / {
        uwsgi_pass  unix:///tmp/mysite.sock;
        include     uwsgi_params;
    }
}
````
소켓 정보와 소유자, 권한 수정
.config/uwsgi/mysite.ini
````text
[uwsgi]
chdir = /srv/django-deploy-test/
module = mysite.wsgi:application
home = /home/ubuntu/myvenv/

uid = ubuntu
gid = ubuntu

socket = /tmp/mysite.sock
chmod-socket = 666
chown-socket = ubuntu:ubuntu

enable-threads = true
master = true
vacuum = true
pidfile = /tmp/mysite.pid
logto = /var/log/uwsgi/mysite/@(exec://date +%%Y-%%m-%%d).log
log-reopen = true
````
nginx는 항상 켜져있어야 한다.
이전 포스트에서 uwsgi는 결국 명령어를 통해 실행을 해줘야만 켜지는데 uwsgi와 nginx를 연결해야 한다면 uwsgi도 항상 켜져있어야 한다.
따라서 uwsgi를 계속 켜둘 수 있도록 설정 파일을 추가해서 백그라운드에 계속 실행하도록 한다.

로컬 컴퓨터의 프로젝트 폴더의 .config 폴더의 uwsgi 폴더안에 uwsgi.service 파일을 만들어 다음과 같이 입력해주고 저장.

````text
[Unit]
Description=uWSGI service
After=syslog.target
 
[Service]
ExecStart=/home/ubuntu/myvenv/bin/uwsgi -i /srv/django-deploy-test/.config/uwsgi/mysite.ini
 
Restart=always
KillSignal=SIGQUIT
Type=notify
StandardError=syslog
NotifyAccess=all
 
[Install]
WantedBy=multi-user.target
````
uwsgi 실행 명령어를 service 로 등록하여 백그라운드에 계속 실행하게 한다.

깃허브 업로드 후, 먼저 uwsgi.service 파일을 데몬(백그라운드에 실행)에 등록해준다.
이 파일을 /etc/systemd/system/ 에 링크를 걸어준다

````linux
$ sudo ln -f /srv/django-deploy-test/.config/uwsgi/uwsgi.service /etc/systemd/system/uwsgi.service
$ sudo systemctl daemon-reload
$ sudo systemctl enable uwsgi
$ sudo systemctl restart uwsgi
````
Django 프로젝트 내의 nginx 설정 파일을 nginx 어플리케이션에 등록해 주어야 한다.
cp 명령어를 이용해 등록하는 경로(sites-available)로 파일을 복사해준다.

````linux
$ sudo cp -f /srv/django-deploy-test/.config/nginx/mysite.conf /etc/nginx/sites-available/mysite.conf
//sites-available에 복사된 설정 파일을 sites-enables폴더 안에서도 링크
$ sudo ln -sf /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/mysite.conf
//sites-enables폴더 안의 default 파일을 삭제
$ sudo rm /etc/nginx/sites-enabled/default

//새로고침 후 재실행
$ sudo systemctl daemon-reload
$ sudo systemctl restart uwsgi nginx
````

AWS에 들어가서 지금까지 등록하지 않았던 80번 포트를 열어준다.
<p align="center">
<img src="/django-aws/4.png"  width="500">
</p>

EC2 인스턴스의 퍼블릭 DNS 주소로 포트 번호 없이 접속가능.

## static 파일 연결
Django admin 페이지를 보면 원래 알던 것과 다른게 있을 것이다.

html을 꾸며주는 css, js 파일들(정적 파일이라 하여 static 파일이라고 불립니다.)을 로드하지 못했다.
문제는 static 파일의 경로가 nginx에서 설정되어 있지 않기 때문에 발생한다.

static 파일들은 Django 프로젝트 내에 앱 별로 구분되어 놓여있는 경우가 대부분이기 때문에,
이 static 파일들을 하나의 경로로 먼저 모아둘 필요가 있다.

이를 쉽게 해주는 명령어는 python3 manage.py collectstatic.
먼저, 이 명령어를 사용하려면 settings.py에 static 파일이 모이는 경로를 설정해 주어야 한다.


- 로컬 컴퓨터에서 settings.py 파일의 제일 하단 STATIC_URL 밑에 추가
````linux
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
````
STATIC_ROOT 값을 추가한 뒤에 collectstatic 명령어를 사용하면 STATIC_ROOT의 경로에 각 앱의 static 파일들이 모아진다.

서버 컴퓨터의 manage.py가 있는 폴더에 가서 아래 명령어를 친다.
````linux
$ python3 manage.py collectstatic
 
130 static files copied to '/srv/django-deploy-test/static'.
$ ls
db.sqlite3  main  manage.py  mysite  requirements.txt  static
````
그러면 현재 폴더에 static 폴더가 생기고, 다음과 같이 admin폴더를 포함한 static 파일들이 모인 것을 볼 수 있다.

mysite.conf 로 설정한 우리의 nginx는 현재 static 파일들이 어디에 있는지 알 수 없다.
다시 로컬 컴퓨터로 돌아와서 mysite.conf 파일에서 /static/ 요청시 파일의 경로를 알려준다.
````linux
.config/nginx/mysite.conf
server {
listen 80;
server_name *.compute.amazonaws.com;
charset utf-8;
client_max_body_size 128M;

    location / {
        uwsgi_pass  unix:///tmp/mysite.sock;
        include     uwsgi_params;
    }
 
    location /static/ {
        alias /srv/django-deploy-test/static/;
    }
}
````
이제 css, js 등 static 파일의 요청이 있을 경우 프로젝트 폴더의 static 폴더를 찾아 적절히 response 해줄 수 있다.

mysite.conf 파일을 다시 nginx에 등록해 주어야 한다.
mysite.conf 파일이 수정되었으니까, 위에서 처럼 다시 nginx에 등록하기 위한 명령어를 입력해준다.

````linux
$ sudo cp -f /srv/django-deploy-test/.config/nginx/mysite.conf /etc/nginx/sites-available/mysite.conf
$ sudo ln -sf /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/mysite.conf

$ sudo systemctl daemon-reload
$ sudo systemctl restart uwsgi nginx
````
다시 admin 사이트를 들어가면 정상적으로 static 파일들이 적용된 것을 볼 수 있다.
도메인 등록과 https 통신을 사용하고 있지 않지만, 그래도 1차 배포 완료!
