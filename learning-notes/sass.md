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

# sass 中的函数

```scss
@function em($px, $base: 16px) {
  @return ($px / $base) * 1em;
}
h1 {
  font-size: em(32px);
}
```
