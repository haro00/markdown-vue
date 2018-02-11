### Install

```
$ npm i -D markdown-vue
// or
$ yarn add -D markdown-vue
```

### Use

webpack 添加svg-sprite-loader, npm包已经安装

```
module: {
    rules: [
        // ...others
        
        // svg loader
        // 其余匹配.svg文件的loader需要添加 `exclude: [path.join(process.cwd() + '/node_modules/markdown-vue')],`
        {
            test: /\.svg$/,
            loader: 'svg-sprite-loader',
            include: [path.join(process.cwd() + '/node_modules/markdown-vue')],
            options: {
                symbolId: 'icon-[name]'
            }
        },
    ]
}
```

```
import Vue from 'vue'
import Markdown from 'markdown-vue'

Vue.use(Markdown);
```

```
<template>
    <div>
        <markdown v-model="value"></markdown>
    </div>
</template>

<script>
    // 可自行引入不同风格的代码高亮样式, 也可以直接在style标签中引入
    import 'highlight.js/styles/tomorrow.css';
    
    export default {
        name: 'moduleName',
        data(){
            return {
                value: ''
            }
        }
    }
</script>
```

### Props

| 名称 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| value | markdown编辑区的值 | string | '' |
| uploadUrl | 上传url | string | '' |
| uploadFieldName | 上传的文件字段名 | string | 'img' |
| uploadHeaders | 上传的headers | object | {} |

* props的value属性可以与input事件合并为v-model指令

### Events

| 名称 | 说明 | 回调参数 |
|---|---|---|
| input | markdown编辑区输入触发 | markdown编辑区文本 |
| html | markdown编辑区输入触发 | markdown预览区html, 不包含css样式 |

* input事件可以与props的value属性合并为v-model指令

### Example

```
git clone git@github.com:haro00/markdown-vue.git

cd markdown-vue

npm install

# serve with hot reload at localhost:3000
npm run dev
```

### LICENSE

[MIT](https://github.com/haro00/markdown-vue/blob/master/LICENSE)