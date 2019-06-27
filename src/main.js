// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import goods from 'components/goods/goods.vue';
import seller from 'components/seller/seller.vue';
import ratings from 'components/ratings/ratings.vue';

import './common/stylus/index.styl';

Vue.config.productionTip = false;
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(VueRouter);

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
  {path: '/goods', component: goods},
  {path: '/seller', component: seller},
  {path: '/ratings', component: ratings}
];

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  data: {
    eventHub: new Vue()
  }
});

// router.push('/goods');
