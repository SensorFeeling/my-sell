<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery-time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                    :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating, index) in ratings" :key="index" class="rating" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28px" height="28px">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="(item, index) in rating.recommend" :key="index" class="recommend-item">{{item}}</span>
              </div>
            </div>
            <div class="rate-time">{{rating.rateTime | formatDate}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from 'common/js/date';
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  import BScroll from '@better-scroll/core';

  const Axios = require('axios');
  const ALL = 2;

  export default {
    data () {
      return {
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        },
        ratings: [],
        selectFoods: []
      };
    },
    created () {
      Axios.get('/api/ratings').then(res => {
        let data = res.data;
        if (data.errno === 0) {
          this.ratings = data.data;
          this.$nextTick(() => {
            this._initScroll();
          });
        } else {
          window.alert('获取ratings数据时发生错误！');
        }
      });
      this.$root.eventHub.$on('ratingtype.select', this.updateRateType);
      this.$root.eventHub.$on('toggle.content', this.updateOnlyContent);
    },
    beforeDestroy () {
      this.$root.eventHub.$off('ratingtype.select', this.updateRateType);
      this.$root.eventHub.$off('toggle.content', this.updateOnlyContent);
    },
    props: {
      seller: {
        type: Object
      }
    },
    methods: {
      _initScroll () {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        });
      },
      needShow (rateType, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === rateType;
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
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .ratings
    position: absolute
    top: 174px
    bottom: 0px
    width: 100%
    overflow: hidden

    .overview
      display: flex
      padding: 18px 0

      .overview-left
        flex: auto
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px

        .score
          line-height: 28px
          margin-bottom: 6px
          font-size: 24px
          color: rgb(255, 153, 0)

        .title
          line-height: 12px
          margin-bottom: 8px
          font-size: 12px
          color: rgb(7, 17, 27)

        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)

      .overview-right
        flex: auto
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px

        .score-wrapper, .delivery-wrapper
          margin-bottom: 8px
          font-size: 0

          .title, .star, .score, .delivery-time
            line-height: 18px
            display: inline-block
            vertical-align: top

          .title
            font-size: 12px
            color: rgb(7, 17, 27)

          .star
            margin: 0 12px

          .score
            font-size: 12px
            color: rgb(255, 153, 0)

          .delivery-time
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)

    .rating-wrapper
      padding: 0 18px
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      .rating
        display: flex
        padding: 18px 0
        border-before-1px(rgba(7, 17, 27, 0.1))
        &:first-child
          border-before-none()
        .avatar
          flex: 0 0 28px
          width: 28px
          height: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .rate-time
          position: absolute
          right: 0
          top: 18px
          line-height:12px
          font-size:10px
          font-weight:200
          color:rgb(147, 153, 159)
        .content
          position: relative
          flex: 1
          .name
            line-height: 12px
            margin-bottom: 4px
            font-size: 10px
            color: rgb(7, 17, 27)

          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              line-height:12px
              margin-right: 6px
            .delivery-time
              display: inline-block
              vertical-align: top
              line-height:12px
              font-size:10px
              color:rgb(147, 153, 159)

          .text
            line-height: 18px
            margin-bottom: 8px
            font-size: 12px
            color:rgb(7, 17, 27)
          .recommend
            line-height: 16px
            .icon-thumb_up, .recommend-item
              display: inline-block
              margin-bottom: 4px
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .recommend-item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 2px
              background: rgb(255, 255, 255)
              line-height: 16px
              color:rgb(147, 153, 159)


  /**/
</style>
