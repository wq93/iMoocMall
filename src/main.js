import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyLoad from 'vue-lazyload'
// 加载对应的css文件
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'
import {currency} from './util/currency'

Vue.config.productionTip = false;
Vue.filter('currency',currency)
Vue.use(Vuex);
Vue.use(infiniteScroll)
Vue.use(VueLazyLoad, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})
const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    }
  }
});
/* eslint-disable no-new */
new Vue({
  // 监听区域
  el: '#app',
  store,
  router,
  mounted() {
    //this.checkLogin();
    //this.getCartCount();
  },
  methods: {
    checkLogin() {
      axios.get("users/checkLogin").then(res => {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.result);
        } else {
          if (this.$route.path != "/goods") {
            this.$router.push("/goods");
          }
        }
      });
    },
    getCartCount() {
      axios.get("users/getCartCount").then(res => {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateCartCount", res.result);
        }
      });
    }
  },
  template: '<App/>',
  //render: h => h(App),
  components: {App}
});//.$mount('#app')
