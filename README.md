## 简介
这个一个微信AccessToken中控服务器,用于统一管理刷新AccessToken

## 安装

```bash
$ npm install wxatm
```

全局安装
```bash
$ npm install -g wxatm
```

## 配置

```bash
$ cp ./config.json.default config.json #复制一份配置文件
```

```js
{
  "wxAppId": "xxxxxxxxxxxxxxxxxxx",   //微信AppId
  "wxAppSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", //微信AppSecret
  "store":"memory", //储存方式,有效值为memory|redis ,设置为memory时,会将accessToken存储在变量中
  "port": 4730, //HTTP端口
  "https":{
      "enable":true, //是否使用HTTPS
      "port":4740,  //HTTPS端口
      "sslCert": "./sslcert/server.crt",
      "sslKey": "./sslcert/server.key"
    },
  "auth":{
    "enable": false,//是否使用HTTP Base Authorization
    "apps": [  //HTTP Base Authorization的用户名和密码,当auth.enable为false此参数忽略
      {
        "appId": "UNIKEY1",
        "appSecret": "SECRET"
      },
      {
        "appId": "UNIKEY2",
        "appSecret": "SECRET"
      },
      {
        "appId": "UNIKEY3",
        "appSecret": "SECRET"
      }
    ]
  }
}
```

## 使用
直接运行:
```bash
$ node ./index.js
```

全局安装的话可以运行:
```bash
$ wxatm
```

或者选择你喜欢的Node进程管理器来运行,如forever或pm2:
```bash
$ pm2 ./index.js
```

全局安装的话可以运行:
```bash
$ pm2 wxatm
```

程序启动后就可以通过Restful请求来获取AccessToken,如对安全性有要求,建议使用HTTPS + HTTP Base Authorization

可以用curl命令来测试是否成功
```bash
$ curl -X GET -v --user 'UNIKEY:SECRET' http://vm.local:4730/access-token.json #获取accessToken
$ curl -X POST -v --user 'UNIKEY:SECRET' http://vm.local:4730/refresh #手动刷新accessToken
```

## License

  [MIT](LICENSE)

