# 嵌套规则

```scss
.a {
  .b {
    &-c {
    }
  }
}
```

# @mixin 和@include

@mixin 定义可以重用的代码块
@include 引入 mixin

```scss
@mixin border-radius($radius) {
  border-radius: $radius;
}
.box {
  @include border-radius(10px);
}
```

@mixin 可以结合控制语句@if 等 实现响应式和主题色

# @extend

继承另一个选择器的样式

```scss
.a {
  color: red;
}
.b {
  @extend .a;
}
```

# sass 中的控制指令

- @if @else if @else
- @for
- @each
- @while

在 mixin 中使用 if

```scss
@mixin theme-colors($theme) {
  @if $theme == light {
    background-color: #fff;
    color: #000;
  } @else if $theme == dark {
    background-color: #000;
    color: #fff;
  } @else {
    background-color: grey;
    color: #000;
  }
}

.container {
  @include theme-colors(dark);
}
```

# sass 中的函数

```scss
@function em($px, $base: 16px) {
  @return ($px / $base) * 1em;
}
h1 {
  font-size: em(32px);
}
```
