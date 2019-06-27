<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image"/>
        </div>
        <div class="content">
          <div class="title">{{food.name}}</div>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click="addFirst($event)" v-show="!food.count || food.count ===0">加入购物车</div>
          </transition>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info || '暂无'}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="(rating, index) in food.ratings" v-show="needShow(rating.rateType, rating.text)"
                  class="rating-item" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0,'icon-thumb_down': rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
      <div class="back">
        <i class="icon-arrow_lift" @click="back"></i>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from 'common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';

  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;

  export default {
    name: 'food',
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    props: {
      food: {
        type: Object
      }
    },
    created () {
      this.$root.eventHub.$on('ratingtype.select', this.updateRateType);
      this.$root.eventHub.$on('toggle.content', this.updateOnlyContent);
    },
    beforeDestroy () {
      this.$root.eventHub.$off('ratingtype.select', this.updateRateType);
      this.$root.eventHub.$off('toggle.content', this.updateOnlyContent);
    },
    filters: {
      formatDate (rateTime) {
        let date = new Date(rateTime);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    methods: {
      show () {
        this.showFlag = true;
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      _initScroll () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      addFirst (event) {
        this.$root.eventHub.$emit('cart-add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      back () {
        this.showFlag = false;
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      },
      updateRateType (selectType) {
        this.selectType = selectType;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      updateOnlyContent (onlyContent) {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
  ;
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff

    &.move-enter-active, &.move-leave-active
      transition: all .2s ease-in-out

    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)

    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%

      img
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%

    .back
      position: fixed
      left: 0
      top: 10px

      .icon-arrow_lift
        display: inline-block
        padding: 10px
        font-size: 20px
        color: #eee

    .content
      position: relative
      padding: 18px

      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)

      .detail
        margin-bottom: 18px
        line-height: 10px
        font-size: 0

        .sell-count
          padding-right: 12px

        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)


      .price
        font-weight: 700
        line-height: 24px

        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)

        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)

      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px

      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        background: rgb(0, 160, 220)
        font-size: 10px
        color: rgb(255, 255, 255)
        opacity: 1

        &.fade-enter-active, &.fade-leave-active
          transition: all .2s

        &.fade-enter, &.fade-leave-to
          opacity: 0


    .info
      padding: 18px

      .title
        margin-bottom: 6px
        line-heignt: 14px
        font-size: 14px
        color: rgb(7, 17, 27)

      .text
        padding: 0 8px
        line-height: 24px
        font-size: 12px
        color: rgb(77, 85, 93)

    .rating
      padding-top: 18px

      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)

      .rating-wrapper
        padding: 0 18px
        border-top: 1px solid rgba(7, 17, 27, 0.1)

        .rating-item
          position: relative
          padding: 16px 0 8px
          border-before-1px(rgba(7, 17, 27, 0.1))

          &:first-child
            border-before-none()

          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0

            .name
              display: inline-block
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)

            .avatar
              margin-left: 6px
              border-radius: 50%

          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)

          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)

            .icon-thumb_up, .icon-thumb_down
              display: inline-block
              vertical-align: middle
              line-height: 16px
              margin-right: 4px
              font-size: 12px

            .icon-thumb_down
              color: rgb(147, 153, 159)

            .icon-thumb_up
              color: rgb(0, 160, 220)


        .no-rating
          padding: 16px
          font-size: 12px
          color: rgb(147, 153, 159)
  /**/
</style>
