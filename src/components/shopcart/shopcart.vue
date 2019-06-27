<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay" :class="{'highlight':totalPrice>=minPrice}">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" tag="ul" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <li class="ball" v-for="ball in balls" :key="ball.id" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </li>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <Cartcontrol :food="food"></Cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideListMask" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import Cartcontrol from '../cartcontrol/cartcontrol';
  import BScroll from '@better-scroll/core';

  export default {
    components: {Cartcontrol},
    data () {
      return {
        balls: [
          {
            show: false,
            id: 1
          },
          {
            show: false,
            id: 2
          },
          {
            show: false,
            id: 3
          },
          {
            show: false,
            id: 4
          },
          {
            show: false,
            id: 5
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    created () {
      this.$root.eventHub.$on('cart-add', this.drop);
    },
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [{
            price: 10,
            count: 2
          }]
            ;
        }
      },
      deliveryPrice: {
        type: Number
      },
      minPrice: {
        type: Number
      }
    },
    computed: {
      totalPrice () {
        let totalPrice = 0;
        this.selectFoods.forEach((food) => {
          totalPrice += food.price * food.count;
        });
        return totalPrice;
      },
      totalCount () {
        let totalCount = 0;
        this.selectFoods.forEach((food) => {
          totalCount += food.count;
        });
        return totalCount;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `￥还差${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow () {
        if (!this.totalCount) {
          return false;
        }
        let show = !this.fold;
        if (show && this.scroll) {
          this.scroll.refresh();
        }
        return show;
      }
    },
    watch: {
      totalCount () {
        if (!this.totalCount) {
          this.fold = true;
        }
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 46);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0px, ${y}px,0)`;
            el.style.transform = `translate3d(0px, ${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        });
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      _initScroll () {
        this.scroll = new BScroll(this.$refs.listContent, {
          click: true
        });
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
        if (this.fold) {
          return;
        }
        this.$nextTick(() => {
          if (!this.scroll) {
            this._initScroll();
          } else {
            this.scroll.refresh();
          }
        });
      },
      hideListMask () {
        this.fold = true;
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付￥${this.totalPrice}`);
      },
      empty () {
        for (let i = this.selectFoods.length - 1; i >= 0; i--) {
          this.selectFoods[i].count = 0;
          this.selectFoods.pop();
        }
        this.fold = true;
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px

    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgb(255, 255, 255, 0.4)

      .content-left
        flex: 1

        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27

          .logo
            width: 100%
            height: 100%
            border-radius 50%
            text-align: center
            background: #2b343c

            &.highlight
              background: rgb(0, 160, 220)

            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a

              &.highlight
                color: #fff

          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)

        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          padding-right: 12px
          box-sizing: border-box
          line-height: 24px
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          color: #80858a

          &.highlight
            color: #fff

        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 6px
          color: #80858a

      .content-right
        flex: 0 0 105px
        width: 105px

        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700

          &.enough
            background: #00b43c
            color: #fff

          &.not-enough
            background: #2b333b
            color: #80858a

    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200

        &.drop-enter-active
          transition: all .4s cubic-bezier(.5, -0.19, 0.75, 0.19)

        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all .4s linear

    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)

      &.fold-enter-active, &.fold-leave-active
        transition: all .5s

      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)

      .list-header
        height: 40px
        padding: 0 18px
        background: #f3f5f7
        line-height: 40px
        border: 1 solid rgba(7, 17, 27, 0.1)

        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)

        .empty
          float: right
          font-size: 14px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff

        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))

          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)

          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)

          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)

    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s

    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)

  /**/
</style>
