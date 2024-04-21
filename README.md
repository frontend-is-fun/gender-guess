# Chinese-Gender-Guess

## Description

源代码和想法来自于 [https://github.com/observerss/ngender](https://github.com/observerss/ngender) ，我仅仅是转成了 node 版本而已。

从学习的角度来说，原版可能更适合，毕竟很多人学习统计/概率相关使用的是 Python 居多。

## how to use

```shell
npm i chinese-gender-guess
```

or

```shell
yarn add npm i chinese-gender-guess
```

or

```shell
pnpm install npm i chinese-gender-guess
```

```typescript
import { predictGender } from 'chinese-gender-guess'

// 用法示例
predictGender("李丽")
  .then(result => console.log(result))
  .catch(err => console.error(err));
```
