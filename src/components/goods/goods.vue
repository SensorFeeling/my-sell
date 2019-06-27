<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current': currentIndex===index}"
              @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index"
              class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food)" v-for="(food, foodIndex) in item.foods" :key="foodIndex" class="food-item border-1px">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span>月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="new-price">￥{{food.price}}</span><span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"
                :select-foods="selectFoods"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const Axios = require('axios');

  export default {
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    created () {
      Axios.get('/api/goods').then(res => {
        let data = res.data;
        if (data.errno === 0) {
          this.goods = data.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        this.$root.eventHub.$emit('selectFoods', this.foods);
        return foods;
      }
    },
    methods: {
      _initScroll () {
        console.log(food.data());
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu (index, event) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let item = foodList[index];
        console.log(`1: ${item}`);
        console.log(`2: ${this.foodsScroll}`);
        this.foodsScroll.scrollToElement(item, 300);
      },
      selectFood (item) {
        this.selectedFood = item;
        this.$refs.food.show();
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden

    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7

      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px

        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff

          .text
            font-weight: 700
            border-none()

        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 4px
          background-size: 12px
          background-repeat: no-repeat

          &.decrease
            bg-image('decrease_3')

          &.discount
            bg-image('discount_3')

          &.guarantee
            bg-image('guarantee_3')

          &.invoice
            bg-image('invoice_3')

          &.special
            bg-image('special_3')

        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px

    .foods-wrapper
      flex: 1

      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153 159)
        background: #f3f5f7

      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        border-before-none()

        &.last-child
          border-none()
          margin-bottom: 0

        .icon
          flex: 0 0 57px
          margin-right: 10px

        .content
          flex: 1

          .name
            margin: 2px 0 8px 0
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)

          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)

          .desc
            line-height: 12px
            margin-bottom: 8px

          .extra
            .count
              margin-right: 12px

          .price
            font-weight: 700
            line-height: 24px

          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

          .new-price
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)

          .old-price
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
            font-weight: 24px


  /**/
</style>
