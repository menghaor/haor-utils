# 基于Vue封装的一套日常开发工具类

在我们日常开发中，每个公司都有自己的工具类，当然封装的方法不同， 有的可能就会放在一个 `utils/index.js`  文件中，  但是这样存在一个问题就是，如果方法过多的话，维护起来很麻烦，后面就想了一下，对模块进行拆分，常见的比如分为： `base、date、file、data、security...` 等模块，每个模块做自己对应的方法，如有新增模块，只需要在 `utils/index` 暴露出去即可， 最后对外界通过`index.js`  导入使用, 这样实现的功能是一样的，而且维护成本低了很多。

### 1. 目录结构

```bash
|-- Utils基本结构
    |-- index.js                             #对外界暴露使用
    |-- install_prototype.js                 #挂载到Vue原型
    |-- README.MD                            #描述文档
    |-- models                               #工具模块
        |-- base.js                          #基本
        |-- data.js                          #数据
        |-- date.js                          #日期
        |-- file.js                          #文件
        |-- security.js                      #安全
        |...
```



### 2. 安装使用

1. 由于各个模块中可能有其他依赖，所以建议先 `npm i crypto-js` 安装依赖；
2. 在 `main.js` 中  `import instalUtils from '@/utils/install_prototype'`；
3. 然后再 `Vue.use(instalUtils)`;
4. 组件中 `import { getType } from '@/utils/index';`  或  `this.$utils.getType()`；



### 3. 注意事项

1. 本工具类 Vue 项目可以拿来直接使用，如果是React或其他项目，需要挂载到原型的话需要更改`install_prototype.js`  这个文件；

2. 为了风格统一，请使用  `import {fn1, fn2, fn3, ...fnx} from '@/utils'`  方式使用；