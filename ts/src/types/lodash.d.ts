/// <reference path="lodash.e.d.ts">
// 三斜线指令，可以引用其他声明文件

declare namespace _ {
    function copy(): void;
}

export as namespace _;//将这个命名空间变成全局的，不需要导入就可使用
export = _;//为了支持用户导入：import _ from 'lodash'