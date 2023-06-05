## 基于apidoc的Swagger文档

包含了swagger.json的生成，以及界面的展示。

原理：通过添加注解的方式生成swagger.json到public目录，再用一个html页面加载该json文件。

## 使用方法

1、生成swagger.json文件

```
knife4j-swagger-node -i app/controllers -o public/
```

2、接入swagger-ui

```
const swaggerUI = require('knife4j-swagger-node/installUI')

// for koa
swaggerUI.install(app, staticFile);

// for express
swaggerUI.install(app, express.static);

```

swaggerUI暴露了两个属性，staticPath和install。

如果是koa或者express，可以直接调用install

其它的，可以根据自身项目来设置swaggerUI.staticPath为公共目录。


## 定制化

1、可以调用接口来定制生成

对外提供crate和createWithJSON两个方法，其中createWithJSON会生成json文件。

```
const lib = require('knife4j-swagger-node/lib')

const api = lib.crate({
    src: path.join(__dirname, './input')
})

api.swaggerData // json的字符串内容
api.swaggerJSON // json的对象
```

```
lib.createWithJSON({
    src: path.join(__dirname, './input')
})
```

2、定制swaggerUI加载的接口地址

支持通过swagger-resources.json修改


## 注解样例

https://apidocjs.com/#examples

`/schema/demo.js`:
```js
/**
* @api {post} /test_api desc_test_api
* @apiName test_api_name
* @apiGroup search
*
* @apiHeader {String} [taz] desc_taz
*
* @apiParam {Number} [tar] desc_tar
* @apiParam (Body) {Object[]} foo desc_foo
* @apiParam (Body) {String} foo.foz desc_foo.foz
* @apiParam (Query) {String} bar=bar desc_bar
*
* @apiParamExample {json} request_desc
* {{extraExample}}
*
* @apiSuccess {Number} [code=1] desc_override_code
* @apiSuccess {Object} data data_desc
* @apiSuccess {number} data.keyInDoc desc_add_extra_data_key_in_doc
*/
```
