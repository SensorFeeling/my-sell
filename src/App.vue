<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';
  import {urlParse} from './common/js/util';

  const Axios = require('axios');
  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let obj = urlParse();
            return obj['id'];
          })()
        }
      };
    },
    created () {
      Axios.get('/api/seller').then(res => {
        // handle success
        let data = res.data;
        if (data.errno === 0) {
          this.seller = Object.assign({}, this.seller, data.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin"
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    //border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))

    .tab-item /*
          flex: flex-grow、flex-shrink、flex-basis 的简写
          flex-grow: 放大比例,默认不放大，在自动撑开时需要
          flex-shrink: 缩放，是否在空间不足时缩放
          flex-basis: 主轴上默认空间，和最小宽度一个意思
        */
      flex: 1
      /* 文本的水平对齐方式 */
      text-align: center

      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)

        &.active
          color: rgb(240, 20, 20)
</style>
