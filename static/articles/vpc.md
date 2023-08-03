---
title: NCloud 속 VPC에 대해 알아보자
slug: vpc
category: cloud
date: 2023.07.25
description: Naver Cloud Platform의 Virtual Private Cloud (VPC)에 대해 공부한 내용
img: ncloud.jpg
author: XIO1016
visibility: true
main: false
---


<p align="center">
<img src="../../images/ncloud.jpg" alt="ncloud" width="500">
</p>

VPC가 어떤 것인지, 어떻게 활용할 수 있는지에 관한 기록입니다.

#
### VPC (Virtual Private Cloud)

- VPC는 클라우드 환경에서 네트워크를 프라이빗하게 분리하여 보안성과 관리성을 높여주는 기능이다.
- 이를 통해 사용자는 자체 가상 네트워크를 구축하여 클라우드 인프라를 보다 안전하게 운영할 수 있다.
- Naver Cloud의 VPC 서비스는 이러한 기능을 제공하며, 기업과 사용자들이 클라우드 리소스를 안전하게 사용할 수 있도록 지원한다.

(1) VPC가 없을때와 있을때의 차이

<div style="display: flex; justify-content: center;">
  <img src="/vpc/1.png" alt="ncloud" style="width: 50%;">
  <img src="/vpc/2.png" alt="ncloud" style="width: 50%;">
</div>

- VPC가 없다면 tenant들이 서로 거미줄처럼 연결되고 인터넷과 연결된다. 이런 구조는 시스템의 복잡도를 엄청나게 끌어올릴뿐만 아니라 하나의 tenant만 추가되도 모든 tenant를 수정해야하는 불편함이 생긴다.
- VPC를 적용하면 VPC별로 네트워크를 구성할 수 있고 각각의 VPC에 따라 다르게 네트워크 설정을 줄 수 있다. 또한 각각의 VPC는 **완전히 독립된** 네트워크처럼 작동하게 된다.
- ACG (Access Control Group)을 따로 설정하지 않아도 격리된 네트워크 환경을 제공한다.
- 서버 생성 시 원하는 사설 IP로 설정이 가능하다.
- Subnet을 통해 원하는 사설 IP 대역을 설정할 수 있고, IP 대역을 통한 보안 관리 측면에서 효율적이다.

<p align="center">
<img src="/vpc/3.png" alt="ncloud" style="width: 70%;">
</p>

- VPC는 공인 Subnet(Public Subnet- 인터넷 연결됨) 또는 사설 Subnet(Private Subnet- 인터넷 연결 안됨)으로 나뉘어 용도에 맞는 아키텍처를 구성할 수 있다. 외부 연결이 필수인 웹 서버는 Front-end 서브넷에 배치를 하고, 제한적으로 외부 연결이 필요한 서버는 오직 NAT 게이트웨이 통해 접속하는 서브넷에 배치하여 비즈니스 요구 사항을 충족시키는 형태이다.
- 기타 구성

    - Internet Gateway: VPC에 붙어 있는 라우팅 테이블과 외부 인터넷을 연결해주는 통로
    - 네트워크 ACL, ACG: 방화벽과 같은 역할을 하며 인바운드 트래픽과 아웃바운드 트래픽 보안정책을 설정할 수 있다.
    - NAT Gateway: 비공인 IP를 가진 고객의 서버가 공인 IP 주소를 가진 외부 서버와 통신할 수 있도록 연결하는 NAT 서비스

#
> 비슷한 이름이지만 다른 VPN
### VPN (Virtual Private Network)

- VPN은 공용 네트워크(예: 인터넷)를 통해 데이터를 암호화하여 보안적으로 안전한 사설 네트워크처럼 통신하는 기술이다.
- 일반적으로 인터넷을 통해 연결되는 장소(예: 가정, 사무실)의 사용자들이 사설 네트워크 내 리소스에 접근하거나 데이터를 안전하게 전송하기 위해 사용된다.
- VPN을 이용하면 외부에서도 내부 네트워크에 접속한 것처럼 보이지만, 데이터는 암호화되어 보안이 강화된다.

##
#### VPC와 차이
- VPN과 VPC는 서로 다른 개념이지만, 클라우드 환경에서 VPC 내에 있는 리소스들과 외부 네트워크 간의 안전한 통신을 위해 함께 사용될 수 있다.

- 예를 들어, 기업이 클라우드 환경에 VPC를 구성하여 클라우드 리소스를 안전하게 운영하는 동시에, 회사 사무실의 로컬 네트워크와 VPC 간에 안전한 통신을 위해 VPN을 설정할 수 있다.

- 이렇게 하면 기업 직원들은 회사 사무실 내에서 작업하듯이 클라우드 내 리소스에 접근할 수 있으며, 데이터는 VPN을 통해 암호화되어 전송되어 보안성이 높아진다.


요약하면, VPN은 인터넷을 통해 데이터를 암호화하여 안전하게 통신하는 기술이며, 
VPC는 클라우드 환경에서 사용자가 자체 가상 네트워크를 구성할 수 있는 기능이다. 
클라우드 환경에서 이 둘을 함께 사용하여 안전하고 효율적인 네트워크 환경을 구축할 수 있다.

