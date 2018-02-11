<template>
    <div class="markdown" :class="{'markdown-screen': isFullScreen}">
        <div class="md-tool">
            <ul>
                <li title="header 1" @click="handleText('# ')">
                    <span class="md-tool-icon">H1</span>
                </li>
                <li title="header 2" @click="handleText('## ')">
                    <span class="md-tool-icon">H2</span>
                </li>
                <li title="header 3" @click="handleText('### ')">
                    <span class="md-tool-icon">H3</span>
                </li>
                <li title="header 4" @click="handleText('#### ')">
                    <span class="md-tool-icon">H4</span>
                </li>
                <li title="header 5" @click="handleText('##### ')">
                    <span class="md-tool-icon">H5</span>
                </li>
                <li title="header 6" @click="handleText('###### ')">
                    <span class="md-tool-icon">H6</span>
                </li>
                <li class="md-tool-slide-line">
                    <span>|</span>
                </li>
                <li title="bold" @click="handleText('**', '**')">
                    <svg-icon icon="bold"></svg-icon>
                </li>
                <li title="italic" @click="handleText('*', '*')">
                    <svg-icon icon="italic"></svg-icon>
                </li>
                <li title="strike" @click="handleText('~~', '~~')">
                    <svg-icon icon="strike"></svg-icon>
                </li>
                <li title="ol list" @click="handleText('1. ')">
                    <svg-icon icon="list-ol"></svg-icon>
                </li>
                <li title="ul list" @click="handleText('* ')">
                    <svg-icon icon="list-ul"></svg-icon>
                </li>
                <li title="quote" @click="handleText('> ')">
                    <svg-icon icon="quote-right"></svg-icon>
                </li>
                <li class="md-tool-slide-line">
                    <span>|</span>
                </li>
                <li title="code block" @click="handleText('```\n', '\n```')">
                    <svg-icon icon="code"></svg-icon>
                </li>
                <li title="table" @click="handleTableText">
                    <svg-icon icon="table"></svg-icon>
                </li>
                <li class="md-tool-img">
                    <span title="image" @click="showUploadImg">
                        <svg-icon icon="image"></svg-icon>
                    </span>
                    <div class="img-upload-box" v-show="isUploadImg">
                        <label class="img-upload">
                            <input type="file" accept="image/*" @change="uploadImg"/>
                            <span title="upload">
                                <svg-icon icon="upload-cloud"></svg-icon>
                            </span>
                        </label>
                    </div>
                </li>
                <li title="link" @click="handleText('', '[]()')">
                    <svg-icon icon="link"></svg-icon>
                </li>
                <li title="hr" @click="handleText('', '\n***')">
                    <i class="minus">—</i>
                </li>
            </ul>
            <ul>
                <li title="preview mode" @click="toggleFullPreview">
                    <svg-icon icon="eye"></svg-icon>
                </li>
                <li title="edit mode" @click="toggleFullEdit">
                    <svg-icon icon="edit-quill"></svg-icon>
                </li>
                <li title="full screen mode" @click="toggleFullScreen">
                    <svg-icon icon="screen-full"></svg-icon>
                </li>
            </ul>
        </div>
        <div class="md-content">
            <div class="md-edit" v-show="isShowEdit">
                <textarea
                    class="md-edit-box"
                    v-model="text"
                    ref="text"
                    @input="inputText"
                    @keydown="handleKey"
                    @scroll="onTextScroll"
                    @mouseover="onMouseOver('text')"
                    @mouseout="onMouseOut"
                >
                </textarea>
            </div>
            <div
                class="md-preview markdown-body"
                ref="html"
                v-html="html"
                v-show="isShowPreview"
                @scroll="onHtmlScroll"
                @mouseover="onMouseOver('html')"
                @mouseout="onMouseOut"
            >
            </div>
        </div>
        <transition name="opacity">
            <div class="markdown-mask" v-show="isUploadImg" @click="hideAll"></div>
        </transition>
    </div>
</template>

<script>
    import SvgIcon from './svg-icon.vue'
    import marked from 'marked'
    import highlight from 'highlight.js';

    marked.setOptions({
        breaks: true,
        sanitize: true,
        highlight(code) {
            return highlight.highlightAuto(code).value;
        }
    });

    export default {
        name: 'markdown',
        props: {
            // 默认值
            value: {
                type: String,
                default: '',
            },
            // 上传url
            uploadUrl: {
                type: String,
                default: ''
            },
            // 上传的文件字段名
            uploadFieldName: {
                type: String,
                default: 'img'
            },
            // 上传headers
            uploadHeaders: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                // markdown区域dom
                textDom: '',
                // 预览区域dom
                htmlDom: '',
                // 滚动的dom
                scrollDom: '',
                // markdown文本
                text: this.value,
                // 预览模式
                isShowPreview: true,
                // 编辑模式
                isShowEdit: true,
                // 全屏
                isFullScreen: false,
                // 显示隐藏上传文件按钮
                isUploadImg: false,
                // 上传图片后的url
                imgUrl: ''
            };
        },
        computed: {
            // 预览html内容
            html() {
                return marked(this.text);
            },
        },
        mounted() {
            this.textDom = this.$refs.text;
            this.htmlDom = this.$refs.html;
        },
        methods: {
            // 将输入的值传回父组件
            inputText() {
                this.text = this.textDom.value;
                this.$emit('input', this.text);
                this.$emit('html', this.html);
            },
            // 获取光标的位置
            getCursorPosition() {
                return this.textDom.selectionStart;
            },
            // 获取所选的文本
            getSelectionText() {
                this.textDom.focus();
                return window.getSelection().toString();
            },
            /**
             * 获取光标所在的行文本的起始位置和结束位置索引
             * @param target
             * @param position
             * @returns {{start: number, end: number}}
             */
            getLineByCursor(target = '', position = 0) {
                const startString = target.slice(0, position);
                const endString = target.slice(position);
                let startIndex = startString.lastIndexOf('\n');
                startIndex = startIndex === -1 ? 0 : startIndex + 1;
                let endIndex = endString.indexOf('\n');
                endIndex = endIndex === -1 ? target.length : (startString.length + endIndex);
                return {
                    start: startIndex,
                    end: endIndex,
                };
            },
            /**
             * 从指定位置替换字符串
             * @param target
             * @param position
             * @param originStr
             * @param replaceStr
             * @returns {string}
             */
            replace(target = '', position = 0, originStr = '', replaceStr = '') {
                const startStr = target.slice(0, position);
                const endStr = target.slice(position);
                return startStr + endStr.replace(originStr, replaceStr);
            },
            /**
             * 处理文本
             * @param before
             * @param after
             */
            handleText(before = '', after = '') {
                let originStr = '';
                let position = 0;
                let cursorPosition = 0;
                let selectionText = this.getSelectionText();
                if (selectionText) {
                    originStr = selectionText;
                    position = this.getCursorPosition();
                    cursorPosition = position + before.length;
                } else {
                    let {start, end} = this.getLineByCursor(this.text, this.getCursorPosition());
                    originStr = this.text.slice(start, end);
                    position = start;
                    cursorPosition = end + before.length + after.length;
                }
                let replaceStr = `${before}${originStr}${after}`;
                this.textDom.value = this.replace(this.text, position, originStr, replaceStr);
                this.textDom.selectionStart = cursorPosition;
                this.textDom.selectionEnd = cursorPosition;
                this.inputText();
            },
            // 插入表格
            handleTableText() {
                const table = '|   |   |   |\n|---|---|---|\n|   |   |   |';
                this.handleText('', table);
            },
            // 获取键盘事件的文本
            handleKeyText(before = '', after = '', isExg = false) {
                if (this.getSelectionText()) {
                    let {start} = this.getLineByCursor(this.text, this.textDom.selectionStart);
                    let {end} = this.getLineByCursor(this.text, this.textDom.selectionEnd);
                    let selectionStr = this.text.slice(start, end);
                    let replaceArr = selectionStr.split('\n').map(item => isExg ? item.replace(before, after) : `${before}${item}${after}`);
                    this.textDom.value = this.replace(this.text, start, selectionStr, replaceArr.join('\n'));
                    let cursorPosition = isExg ? start : end + before.length * replaceArr.length + after.length * replaceArr.length;
                    this.textDom.selectionStart = cursorPosition;
                    this.textDom.selectionEnd = cursorPosition;
                    this.inputText();
                    return false;
                }
                let {start, end} = this.getLineByCursor(this.text, this.getCursorPosition());
                let originStr = this.text.slice(start, end);
                let replaceStr = isExg ? originStr.replace(before, after) : `${before}${originStr}${after}`;
                this.textDom.value = this.replace(this.text, start, originStr, replaceStr);
                let cursorPosition = isExg ? start : end + before.length + after.length;
                this.textDom.selectionStart = cursorPosition;
                this.textDom.selectionEnd = cursorPosition;
                this.inputText();
            },
            // 处理键盘事件
            handleKey(e) {
                let selectionText = this.getSelectionText();
                if (e.shiftKey && e.keyCode === 9) {
                    e.preventDefault();
                    return this.handleKeyText(/^\s{0,4}/, '', true);
                }
                if (e.keyCode === 9) {
                    e.preventDefault();
                    return this.handleKeyText('    ');
                }
            },
            // 切换全屏预览
            toggleFullPreview() {
                this.isShowPreview = true;
                this.isShowEdit = !this.isShowEdit;
            },
            // 切换全屏编辑
            toggleFullEdit() {
                this.isShowEdit = true;
                this.isShowPreview = !this.isShowPreview;
            },
            // 全屏切换
            toggleFullScreen() {
                this.isFullScreen = !this.isFullScreen;
            },
            // 编辑区滚动
            onTextScroll() {
                if (this.scrollDom !== 'text') {
                    return false;
                }
                requestAnimationFrame(() => {
                    const textScrollHeight = this.textDom.scrollHeight;
                    const textScrollTop = this.textDom.scrollTop;
                    const htmlScrollHeight = this.htmlDom.scrollHeight;
                    this.htmlDom.scrollTop = (textScrollTop / textScrollHeight) * htmlScrollHeight;
                });
            },
            // 预览区滚动
            onHtmlScroll() {
                if (this.scrollDom !== 'html') {
                    return false;
                }
                requestAnimationFrame(() => {
                    const textScrollHeight = this.textDom.scrollHeight;
                    const htmlScrollHeight = this.htmlDom.scrollHeight;
                    const htmlScrollTop = this.htmlDom.scrollTop;
                    this.textDom.scrollTop = (htmlScrollTop / htmlScrollHeight) * textScrollHeight;
                });
            },
            // 设置滚动区
            onMouseOver(name) {
                this.scrollDom = name;
            },
            // 清空滚动区
            onMouseOut() {
                this.scrollDom = '';
            },
            // 显示上传图片
            showUploadImg() {
                if (!this.uploadUrl) {
                    return this.handleText('', '![]()');
                }
                this.isUploadImg = true;
            },
            // 隐藏上传图片
            hideUploadImg() {
                this.isUploadImg = false;
                this.handleText('', '![]()');
            },
            // 上传图片
            uploadImg(e) {
                let files = [...e.target.files];
                let form = new FormData();
                form.append(this.uploadFieldName, files[0]);
                let headers = Object.prototype.toString.call(this.uploadHeaders) === '[object Object]' ? this.uploadHeaders : {};
                let req = new Request(this.uploadUrl, {
                    method: 'POST',
                    headers: new Headers(headers),
                    body: form
                });
                fetch(req).then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                }).then(({data}) => {
                    if (data) {
                        this.imgUrl = data;
                        this.handleText('', `![](${this.imgUrl})`);
                        this.isUploadImg = false;
                        this.imgUrl = '';
                    } else {
                        this.hideUploadImg();
                    }
                }).catch(err => {
                    this.hideUploadImg();
                });
            },
            // 隐藏所有
            hideAll() {
                if (this.isUploadImg) {
                    this.hideUploadImg();
                }
            }
        },
        components: {
            SvgIcon
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import '../scss/variables';
    @import '../scss/md.scss';

    $height-tools: 40px;

    .markdown{
        position: relative;
        width: 100%;
        height: 400px;
        border: 1px solid $border-color;
        box-sizing: border-box;
        border-radius: 4px;
        overflow: hidden;
        &.markdown-screen{
            position: fixed;
            z-index: 99999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        *{
            margin: 0;
            padding: 0;
        }

        li{
            list-style: none;
        }
        .md-tool{
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: $height-tools;
            padding: 0 8px;
            background-color: #fafbfc;
            border-bottom: 1px solid $border-color;
            line-height: 40px;
            box-sizing: border-box;
            ul{
                display: flex;
            }
            li{
                padding: 0 8px;
                cursor: pointer;
                transition: opacity .2s ease;
                span{
                    color: #24292e;
                    font-weight: bold;
                }
                &.md-tool-slide-line{
                    cursor: default;
                }
                &:hover{
                    opacity: .7;
                }
            }
        }
        .md-tool-img{
            position: relative;
            .img-upload-box{
                position: absolute;
                top: $height-tools;
                left: 50%;
                z-index: 9;
                width: 160px;
                height: 100px;
                padding: 5px;
                margin-left: -80px;
                box-shadow: 0 0 2px #ccc;
                background: #fff;
                box-sizing: border-box;
            }
            .img-upload{
                input[type='file']{
                    position: absolute;
                    z-index: -1;
                    display: none;
                }
                span{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border: 1px dashed $border-color;
                    font-size: 60px;
                    text-align: center;
                    line-height: 90px;
                    box-sizing: border-box;
                }
            }
        }
        .md-content{
            width: 100%;
            height: calc(100% - 41px);
            display: flex;
            .md-edit{
                border-right: 1px solid $border-color;
                background-color: #fafbfc;
                color: #666;
                flex: 1;
            }
            .md-edit-box{
                width: 100%;
                height: 100%;
                resize: none;
                border: none;
                outline: none;
                background-color: transparent;
                padding: 15px;
                box-sizing: border-box;
                line-height: 1.5;
                font-size: 14px;
                word-break: break-all;
            }
            .md-preview{
                flex: 1;
                padding: 15px;
                overflow: auto;
                background-color: #fff;
            }
        }
        .markdown-body{
            box-sizing: border-box;
        }
        .markdown-mask{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.05);
        }
    }
</style>