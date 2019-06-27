<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    name: 'cartcontrol',
    props: {
      food: {
        type: Object
      }
    },
    created () {
    },
    methods: {
      addCart (event) {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$root.eventHub.$emit('cart-add', event.target);
      },
      decreaseCart () {
        if (!this.food.count && this.food.count < 1) {
          Vue.set(this.food, 'count', 0);
        } else {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0

    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

    .cart-decrease
      display: inline-block
      transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all .4s linear
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(24px, 0px, 0px);
        transform: rotate(180deg)

    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)

    .cart-add
      display: inline-block
</style>
