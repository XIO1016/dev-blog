---
title: Terraform Provider 오픈소스 기여하기
slug: terraform-provider
category: cloud
date: 2023.09.01
description: terraform-provider-ncloud 오픈소스에 기여한 기록
img: ncloud.jpg
author: XIO1016
visibility: true
main: true
---


<p align="center">
<img src="../../images/ncloud.jpg" alt="ncloud" width="500">
</p>

terraform-provider-ncloud에 컨트리뷰트한 방법과 내역입니다.

#

## 첫 컨트리뷰트


### 1. validation 수정

오픈소스 컨트리뷰트 아카데미 활동 중 첫 컨트리뷰트 시도를 어떻게 할 지 막막했던 찰나, 멘토님께서 
이거 한번 고쳐보라고 던져주셨다.
바로 서버 이름의 validation이 api와 달랐던 것!
원래는 아래와 같았는데,
```go
validation.StringMatch(
	regexp.MustCompile(`^[a-z]+[a-z0-9-]+[a-z0-9]$`), 
	"start with an alphabets and composed of alphabets, numbers, hyphen (-) and wild card (*).
	Hyphen (-) cannot be used for the last character"),
```
다음과 같이 수정했다.
```go
validation.StringMatch(
	regexp.MustCompile(`^[a-z]+[a-z0-9-]+[a-z0-9]$`),
	"Allows only lowercase letters(a-z), numbers, hyphen (-). 
	Must start with an alphabetic character, must end with an English letter or number"),
```

첫 pr이라 틀리면 어쩌지 떨려서 혼자 pr 올렸다 닫았다 이상한 짓 했는데, merge된 거 보고 굉장히 뿌듯했다.

<p align="center">
<img src="../../terraform-provider/contribute1.png" alt="ncloud" width="500">
</p>


### 2. 오타 수정
다음으로 수정한거는 혼자 terraform-provider-ncloud에 있는 예제 코드를 연습해보다가 찾은 오류였다.

그냥 하라는 대로 값을 채워넣고 실행해봤는데 계속 오류가 났는데, 내가 뭔가 잘못한 건 줄 알았는데,
알고 보니 예제 코드가 잘못된 거였다.

오류 문구는 다음과 같았다.
```json
Error: Status: 400 Bad Request, Body: {
   "responseError": {
     "returnCode": "10712",
     "returnMessage": "Not found product. Please check your input product.  "
   }
 }
```
product가 잘못됐다고 하는데, 정확히 뭐가 잘못된 건지 몰라서 에러 코드를 ncloud api 문서에 검색해봤다.
알고보니 server_image_product가 잘못 적혀있었던 것!

[이미지 코드가 정리되어 있는 곳(클릭)](https://github.com/NaverCloudPlatform/terraform-ncloud-docs/blob/main/docs/server_image_product.md)를
을 보니 적혀있던  "SW.VSVR.OS.LNX64.CNTOS.0703.B100"가 없었다.
그래서 SW.VSVR.OS.LNX64.CNTOS.0703.B050로 수정 후 pr 했다.

<p align="center">
<img src="../../terraform-provider/contribute2.png" alt="ncloud" width="500">
</p>
<br/>

## 조금 더 복잡한 내용을 도전해보고 싶다!
사소한 컨트리뷰트를 직접 해보고 나니 조금 더 복잡한 내용을 수정해보고 싶었다.
리소스를 새로 만든다거나 framework로 전환하는 작업들 같은 것들...

그런데 나는 provider 기초도 잘 몰라서 리드 멘티님께 도움을 청했다.
친절하신 리드님께서 개발 전반적인 내용을 1대1 강의도 해주시고, Framework 전환 내용도 강의해주셨다.(정말 감사드립니다...)

대충 내용은 다음과 같았다.

### 1. Terraform 개발 가이드
- 주요 내용
- 리소스를 새로 만들때, 5 가지를 중점적으로 만든다
1. 스키마
   어떤 데이터를 저장하고 입력 받을지에 대한 내용
   (api 가이드를 참고해서 만든다)
- 속성값 종류
    - optional
    - computed
    - forcenew
    - required
    - 제약사항 (validation)
1. read
2. create
3. update
4. destroy
- resource vs datasource
    - 리소스는 생성, 수정 시 읽어올때 (저장할 때 리프레쉬 하는 느낌으로 사용)
    - 데이터 소스는 읽는것만 한다.
    - 생성하고 운영하다보면 해당 인스턴스 정보를 읽고 저장하는 상황에서 사용
- 주요 메소드
    - d.Get()
        - 사용자 입력값을 key이름으로 가져오는 메소드
    - d.Set()
        - 입력하는 메소드

### 2. Framework 전환 작업 가이드
- 주요내용
- 프레임워크 개발은 구조체 만들고 상속을 받아 구현을 하는 식으로 개발

    ```go
    func NewInitScriptResource() resource.Resource {
    	return &initScriptResource{}
    }
    
    type initScriptResource struct {
    	config *conn.ProviderConfig
    }
    ```

    - 구현해야 할 부분은 리소스와 비슷함
        - 스키마, CRUD, Metadata, Configure, Import
    - ImportState, Metadata, Configure 예시

    ```go
    func (i *initScriptResource) ImportState(ctx context.Context, 
            req resource.ImportStateRequest, resp *resource.ImportStateResponse) {
    	resource.ImportStatePassthroughID(ctx, path.Root("id"), req, resp)
    }
    
    func (i *initScriptResource) Metadata(_ context.Context, 
            req resource.MetadataRequest, resp *resource.MetadataResponse) {
    	resp.TypeName = req.ProviderTypeName + "_init_script"
    }
    
    func (i *initScriptResource) Configure(_ context.Context, 
		    req resource.ConfigureRequest, resp *resource.ConfigureResponse) {
    	if req.ProviderData == nil {
    		return
    	}
    
    	config, ok := req.ProviderData.(*conn.ProviderConfig)
    
    	if !ok {
    		resp.Diagnostics.AddError(
    			"Unexpected Data Source Configure Type",
    			fmt.Sprintf("Expected *ProviderConfig, 
                got: %T. Please report this issue to the provider developers.", 
				req.ProviderData),
    		)
    		return
    	}
    
    	i.config = config
    }
    ```


- 스키마 전환
    - Forcenew가 planmodifier로 바뀌었다

    ```go
    PlanModifiers: []planmodifier.String{
    			stringplanmodifier.RequiresReplace(),
    },
    ```

    - 값이 수정이 안될때 넣어주는 속성값/ 수정하는 api가 있으면 빼줌
- Crud
    - 값을 저장할 수 있는 구조체를 만들어야한다.

    ```go
    type initScriptResourceModel struct {
    	InitScriptNo types.String `tfsdk:"init_script_no"`
    	OsType       types.String `tfsdk:"os_type"`
    	ID           types.String `tfsdk:"id"`
    	Description  types.String `tfsdk:"description"`
    	Name         types.String `tfsdk:"name"`
    	Content      types.String `tfsdk:"content"`
    }
    ```

1. create 예시
- CreateRequest -> 사용자가 입력한 리소스 값
    - 여기서 값을 꺼내서 api 날리면 된다
- n 구조체에 config 값이 들어가게 바뀌었다 (n.config 로 사용)
- Getok 는 다음과 같이 바뀌었다

```go
Getok ->
if !plan.Name.IsNull(){
	reqParams.NetworkName = plan.Name.ValudStringPointer()
}
```

- 로그  변화

```go
tflog.Info(ctx, "CreateVpcInitScript", map[string]any{
		"reqParams": common.MarshalUncheckedString(reqParams),
	})
```

- wait 부분이 생김
    - sdk에서는 - create-> read해서 저장
    - fw에서는 - create단에서 저장까지
- refreshFromOutput 구현 필요

<br />

### sdkV2에서 Framework로 전환해보기
- NCloud Terraform Provider 컨트리뷰트의 큰 과제 중 하나가 기존 리소스와 데이터소스 코드들을 SDKv2에서 Framework로 전환하는 것이었다.
- ramework로 변경된 이유는 대략 다음과 같다.

> We recommend migrating because the Framework has abstractions
> 
> that make it easier to use, and it represents the future of Terraform plugin development.


라고 하시코프 공식 페이지에 적힌 것처럼, Framwork로의 전환을 추천하고 있다.

[Plugin Development: Migrating from SDKv2 to the plugin Framework | Terraform | HashiCorp Developer](https://developer.hashicorp.com/terraform/plugin/framework/migrating)
a) SDKv2 vs Framework

- 동작하는 방식은 비슷하나, 제공하는 api 및 구현이 달라짐
- SDKv2는 any 타입으로 정의된 인터페이스를 사용할 때마다 정확한 타입으로 변환하는 부분이 많아 불편했는데, Framework는 명시적인 타입을 사용하여 개발 편의성 증가 (런타임 에러 → 컴파일 에러)
- 아래와 같은 이유들이 있다.

(1) ****Expanded Access to Configuration, Plan, and State Data****

기존 SDKv2에서는 single [`schema.ResourceDatatype`](https://pkg.go.dev/github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema#ResourceData)를 사용하여 동작에 따라 구현이 달라지는 코드를 사용했다. 데이터를 어떻게 접근하고 사용해야 하는지에 대한 처리가 각 작업에 따라 달라지며, 여러 데이터 소스로부터 데이터를 가져오는 것도 문제가 될 수 있었다.

즉, 데이터를 처리하는 방식에 따라 발생할 수 있는 문제를 강조하고 있다. 그리고 이러한 문제들을 해결하기 위해 프레임워크에서는 각 작업(Operation)에 따라 사용 가능한 데이터를 요청(Request) 및 응답(Response) 유형의 속성으로 분리하여 노출시킨다.

```go
func (r ThingResource) Create(ctx context.Context,
	req resource.CreateRequest, resp *resource.CreateResponse) {
  req.Config // 구성 데이터
  req.Plan // 계획 데이터
  // req.State는 항상 null이므로 사용되지 않음
  // resp.Config는 생성 중에 공급자가 설정할 수 없는 구성이므로 없음
  // resp.Plan은 생성 중에 공급자가 설정할 수 없는 계획이므로 없음
  resp.State // 새 상태 데이터 (저장용)
}

func (r ThingResource) Read(ctx context.Context,
	req resource.ReadRequest, resp *resource.CreateResponse) {
  // req.Config는 읽기 중에 공급자가 읽을 수 없는 구성이므로 없음
  // req.Plan은 읽기 중에 계획이 없으므로 없음
  req.State // 이전 상태 데이터
  // resp.Config는 읽기 중에 공급자가 설정할 수 없는 구성이므로 없음
  // resp.Plan은 읽기 중에 계획이 없으므로 없음
  resp.State // 새 상태 데이터 (저장용)
}

func (r ThingResource) Update(ctx context.Context, 
	req resource.UpdateRequest, resp *resource.UpdateResponse) {
  req.Config // 구성 데이터
  req.Plan // 계획 데이터
  req.State // 이전 상태 데이터
  // resp.Config는 업데이트 중에 공급자가 설정할 수 없는 구성이므로 없음
  // resp.Plan은 업데이트 중에 공급자가 설정할 수 없는 계획이므로 없음
  resp.State // 새 상태 데이터 (저장용)
}

func (r ThingResource) Delete(ctx context.Context, 
	req resource.DeleteRequest, resp *resource.DeleteResponse) {
  // req.Config는 삭제 중에 공급자가 읽을 수 없는 구성이므로 없음
  // req.Plan은 항상 null이므로 사용되지 않음
  req.State // 이전 상태 데이터
  // resp.Config는 삭제 중에 공급자가 설정할 수 없는 구성이므로 없음
  // resp.Plan은 조정할 수 없으므로 없음
  resp.State // 오류 발생 시 명시적으로 제거할 수 있는 데이터만 포함됨
}
```

(2)****Schema Data Models****

SDKv2에서는 각 속성이나 유형마다 데이터를 개별적으로 가져와야 하기 때문에 데이터의 처리가 번거로울 수 있고, 또한 각 작업마다 필요한 데이터를 따로 정확히 가져오는 것이 중요하다.

반면에 프레임워크에서는 구성, 계획, 상태 데이터를 한 번에 모두 가져와서 관리할 수 있다. 이를 통해 스키마를 한 번 정의하면 각 작업에서 필요한 데이터를 일관되게 다룰 수 있으며, 이로 인해 작업 간에 발생할 수 있는 오류나 데이터 불일치를 방지할 수 있다.

결국 프레임워크를 사용하면 데이터 처리를 보다 효율적이고 일관된 방식으로 수행할 수 있으며, 이는 코드의 가독성과 유지보수성을 향상시키는 데 도움이 된다.

```go
// Example schema data model type
type ThingResourceModel struct {
  Attribute1 types.Bool   `tfsdk:"attribute1"`
  // assuming types.BoolType attribute
  Attribute2 types.Int64  `tfsdk:"attribute2"`
  // assuming types.Int64Type attribute
  Attribute3 types.String `tfsdk:"attribute3"`
  // assuming types.StringType attribute
}

// In resource logic
var data ThingResourceModel

diags := req.Plan.Get(ctx, &data) // framework-defined errors

resp.Diagnostics.Append(diags...)

if resp.Diagnostics.HasError() {
  return
}
```
- init script 프레임워크 전환 작업 후 contribute

<p align="center">
<img src="../../terraform-provider/contribute3.png" alt="ncloud" width="500">
</p>

- 주의할 점은 framework로 전환한 뒤 test를 전부 통과해야하고, 전환 전과 후의 state를 terraform show로 비교해서 다른 점이 없어야 한다.

<br />
<br />

### 오픈소스 컨트리뷰트를 고민하고 있다면?
- 절대 겁을 먹지 말자
- 틀려도 얼마든지 고칠 수 있고, 그 과정에서 더 성장할 수 있다
- 뭐부터 할지 모르면 소스 분석하고 오타부터 수정해보자