---
title: Terraform으로 NCloud VPC 관리해보기
slug: terraform-vpc
category: cloud
date: 2023.08.01
description: Terraform을 이용하여 Naver Cloud Platform의 Virtual Private Cloud (VPC)생성과 삭제 실습
img: ncloud.jpg
author: XIO1016
visibility: true
main: true
---


<p align="center">
<img src="../../images/ncloud.jpg" alt="ncloud" width="500">
</p>

NCloud provider 공식 깃허브의 example scenario2를 실습한 내용입니다.

#

## 시나리오2. Public과 Private Subnet 구성

<p align="center">
<img src="/vpc/4.png" alt="ncloud" width="500">
</p>

### 1. 개요

하나의 VPC 환경에서 KR-2 ZONE의 Public Subnet 에 FE서버 를 두고, Private Subnet에 WAS와 같은 Server 를 생성해야 한다.

### 2. Subnet

subnet으로 VPC 내의 주소 범위를 지정할 수 있다. Private 과 Public 2개의 Subnet을 제공한다. Subnet이 속할 Zone 을 지정할 수 있다. KR Region을 기준으로 KR-1 또는
KR-2 에 생성할 수 있다. 고가용성을 위해 두 개 Zone에 각각 서비스를 구성할 수 있다.

- **Public Subnet:** `10.0.0.0/24`의 CIDR 블록을 가지며, 해당 서브넷 내에서는 10.0.0.X 형식으로 IPv4 주소를 250개*(Reserved IP address 6개 제외)*를
  생성할 수 있다. Public Subnet 의 경우 기본적으로 Internet Gateway 와 연결 되어있어 외부 통신이 가능하며 외부에서도 Subnet 으로 접근이 가능하다. 베스천 호스트를 두기에 적합하다.
- **Private Subnet:** `10.0.1.0/24`의 CIDR 블록을 가지며, 해당 서브넷 내에서는 10.0.1.X 형식으로 IPv4 주소를 250개를 생성할 수 있다. 기본적으로는 외부 네트워크가 차단
  되어있고, VPC 내에서만 통신이 가능하다. 하지만 NAT Gateway 를 통해 인터넷 연결이 가능하다. WAS 와 DB와 같은 서버들은 여기에 둔다.

    - **Network ACL:** 보안을 위해 ACG 또는 Network ACL 을 사용하지만, ACG 는 서버의 Inbound/Outbound 트래픽을 제어하고, Network ACL 은 서브넷의
      Inbound/Outbound 트래픽을 제어할 수 있다. 기본적으로는 0.0.0.0/0 소스에 대해 allow 되어있기 때문에, 보안을 위해 ACL 룰 설정이 필요하다.

<br/>

- 리소스 구성

```text
- VPC 1개
- Subnet 2개 (Public, Private)
- NAT Gateway 1개
- Network ACL 2개
- Server 2개 (Frontend, Backend)
- Public IP 1개
```

<br/>

### 3. variables.tf

```terraform
variable name_scn02 {
  default = "tf-scn02"
}
variable client_ip {
  default = "YOUR_CLIENT_IP" // To access ssh
}
variable access_key {
  default = "YOUR_ACCESS_KEY"
}
variable secret_key {
  default = "YOUR_SECRET_KEY"
}
```

<br/>

### 4. main.tf

해당 파일에서는 provider 설정과, VPC 를 포함한 대부분의 인프라 코드를 포함한다.

(1) ncloud provider 설정

```terraform
provider "ncloud" {
  support_vpc = true
  region      = "KR"
  access_key  = var.access_key
  secret_key  = var.secret_key
}
```

<br/>

(2) ncloud_vpc 리소스를 이용하여 VPC 를 정의
<p align="center">
<img src="/vpc/5.png" alt="ncloud" width="500">
</p>

- VPC 생성시에는 기본적으로 Internet Gateway, Route Table, Network ACL 그리고 ACG(Access Control Group)가 생성됨.

```terraform
# VPC
resource "ncloud_vpc" "vpc_scn_02" {
  name            = var.name_scn02
  ipv4_cidr_block = "10.0.0.0/16"
}
```

<br/>

(3) Subnet & Network ACL (ncloud_subnet, ncloud_network_acl)
<p align="center">
<img src="/vpc/6.png" alt="ncloud" width="500">
</p>

```terraform
# Public Subnet
resource "ncloud_subnet" "subnet_scn_02_public" {
  name           = "${var.name_scn02}-public"
  vpc_no         = ncloud_vpc.vpc_scn_02.vpc_no
  subnet         = cidrsubnet(ncloud_vpc.vpc_scn_02.ipv4_cidr_block, 8, 0) // "10.0.0.0/24"
  zone           = "KR-2"
  network_acl_no = ncloud_network_acl.network_acl_02_public.id
  subnet_type    = "PUBLIC" // PUBLIC(Public)
}

# Private Subnet
resource "ncloud_subnet" "subnet_scn_02_private" {
  name           = "${var.name_scn02}-private"
  vpc_no         = ncloud_vpc.vpc_scn_02.vpc_no
  subnet         = cidrsubnet(ncloud_vpc.vpc_scn_02.ipv4_cidr_block, 8, 1) // "10.0.1.0/24"
  zone           = "KR-2"
  network_acl_no = ncloud_network_acl.network_acl_02_private.id
  subnet_type    = "PRIVATE" // PRIVATE(Private)
}

# Network ACL
resource "ncloud_network_acl" "network_acl_02_public" {
  vpc_no = ncloud_vpc.vpc_scn_02.id
  name   = "${var.name_scn02}-public"
}
resource "ncloud_network_acl" "network_acl_02_private" {
  vpc_no = ncloud_vpc.vpc_scn_02.id
  name   = "${var.name_scn02}-private"
}
```

- Subnet 은 VPC 안에 만들어지기 때문에, `vpc_no`를 지정해줘야 한다.
- cidrsubnet(10.0.0.0/16, 8, 1)과 같은 함수를 통해 CIDR 블록을 계산할 수 있다.

```terraform
cidrsubnet(prefix, newbits, netnum)
```

- cidrsubnet("10.0.0.0/16", 8, 1) > 10.0.1.0/24
- VPC 생성시 기본으로 제공되는 Network ACL 로 설정할 수 있지만, Private 과 Public 의 ACL 설정을 따로 하기위해 각각 만들어 준다.
  <br/>

(4) Server

```terraform
# Login Key
resource "ncloud_login_key" "key_scn_02" {
  key_name = var.name_scn02
}

# Server

# for Front-end (bastion) server
resource "ncloud_server" "server_scn_02_public" {
  subnet_no                 = ncloud_subnet.subnet_scn_02_public.id
  name                      = "${var.name_scn02}-public"
  server_image_product_code = "SW.VSVR.OS.LNX64.CNTOS.0703.B050"
  login_key_name            = ncloud_login_key.key_scn_02.key_name
  //server_product_code       = "SVR.VSVR.STAND.C002.M008.NET.SSD.B050.G002"
}

# for Back-end (WAS) server
resource "ncloud_server" "server_scn_02_private" {
  subnet_no                 = ncloud_subnet.subnet_scn_02_private.id
  name                      = "${var.name_scn02}-private"
  server_image_product_code = "SW.VSVR.OS.LNX64.CNTOS.0703.B050"
  login_key_name            = ncloud_login_key.key_scn_02.key_name
  //server_product_code       = "SVR.VSVR.STAND.C002.M008.NET.SSD.B050.G002"
}
```

- VPC Server는 Subnet 을 지정 해야 한다.
- `server_image_product_code`를 통해 서버 이미지를 설정할 수 있는데, 예제에서는 CentOS 7.3으로 지정하였다.
    - 코드 가져오는 법
        - <a href=" https://github.com/NaverCloudPlatform/terraform-ncloud-docs/blob/main/docs/server_image_product.md"> @깃허브</a>

```terraform
    data "ncloud_server_images" "images" {
      filter {
        name = "product_name"
        values = ["CentOS 7.3 (64-bit)"]
      }
    
      output_file = "image.json" 
    }
    
    output "list_image" {
      value = {
        for image in data.ncloud_server_images.images.server_images:
        image.id => image.product_name
      }
    }
 ```
- `server_product_code`설정을 통해 서버의 스펙을 지정할 수 있는데, 미 입력시에는 가장 낮은 스펙으로 설정된다.
- 공인 IP(Public IP ) 설정
```terraform
# Public IP
resource "ncloud_public_ip" "public_ip_scn_02" {
  server_instance_no = ncloud_server.server_scn_02_public.id
  description        = "for ${var.name_scn02}"
}
```
- 외부에서 Frontend 서버를 접근하게 해주고, 관리자도 SSH 에 접속할 수 있게 한다.

<br/>

(5) NAT Gateway
- NAT Gateway 를 통해 Private Subnet 에서 외부 인터넷과 연결 할 수 있다.

```terraform
# NAT Gateway
resource "ncloud_nat_gateway" "nat_gateway_scn_02" {
  vpc_no = ncloud_vpc.vpc_scn_02.id
  zone   = "KR-2"
  name   = var.name_scn02
}
```
<br/>

(6) Route 설정
- Private Subnet에서 외부통신`(0.0.0.0/0)`이 NAT Gateway까지 갈수 있게 길을 만들어 줘야 한다.
- 기본 Route Table 은 Public, Private 용으로 각각 1개씩 생성이 되는데 NAT Gateway를 붙이기 위해 Private Route Table 을 참조해야 한다.
```terraform
# Route
resource "ncloud_route" "route_scn_02_nat" {
  route_table_no         = ncloud_vpc.vpc_scn_02.default_private_route_table_no
  destination_cidr_block = "0.0.0.0/0"
  target_type            = "NATGW" // NATGW (NAT Gateway) | VPCPEERING (VPC Peering) | VGW (Virtual Private Gateway).
  target_name            = ncloud_nat_gateway.nat_gateway_scn_02.name
  target_no              = ncloud_nat_gateway.nat_gateway_scn_02.id
}
```
- `destination_cidr_block`을 `0.0.0.0/0`으로 지정하여, 해당 주소로 가는 요청이 NAT Gatway 로 가도록 한다.
- `target_type`과 `target_no`을 위에서 정의한 NAT Gateway를 참조하도록 한다.
<br/>

### 5. security.tf
- Network ACL 을 생성하였지만, 기본 Network ACL 룰은 모든 IP와 port 에 대해 allow 되어 있는 상태이다. 즉 외부에서 ssh 나 서비스에 접근하여 해킹시도를 할 수 있는 위험이 있다.

<br />

(1) Network ACL

a. Public Subnet : Inbound
<p align="center">
<img src="/vpc/7.png" alt="public-in" width="70%">
</p>

b. Public Subnet : Outbound
<p align="center">
<img src="/vpc/8.png" alt="public-out" width="70%">
</p>

c. Private Subnet : Inbound
<p align="center">
<img src="/vpc/9.png" alt="private-in" width="70%">
</p>

b. Private  Subnet : Outbound
<p align="center">
<img src="/vpc/10.png" alt="private-out" width="70%">
</p>
<br />

## 실습
### 1. terraform init
<p align="center">
<img src="/vpc/11.png" alt="private-out" width="60%">
</p>

### 2. terraform plan
<p align="center">
<img src="/vpc/12.png" alt="private-out" width="60%">
</p>

### 3. terraform apply
<p align="center">
<img src="/vpc/13.png" alt="private-out" width="60%">
</p>
<p align="center">
<img src="/vpc/14.png" alt="private-out" width="60%">
</p>
<p align="center">
<img src="/vpc/15.png" alt="private-out" width="60%">
</p>

### 3. terraform destroy
<p align="center">
<img src="/vpc/16.png" alt="private-out" width="60%">
</p>