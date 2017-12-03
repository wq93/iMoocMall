<template>
  <div>
    <nav-header></nav-header>
    <nav-bread><span>Goods</span></nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)">All</a></dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img :src="'static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                加载中...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import axios from 'axios'
  import NavHeader from '../base/NavHeader.vue'
  import NavBread from '../base/NavBread.vue'
  import NavFooter from '../base/NavFooter.vue'

  export default {
    data() {
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true, // 控制加载动画
      }
    },
    mounted() {
      this._getGoodsList()
    },
    methods: {
      _getGoodsList(flag) {
        let params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
        };
        axios.get('/goods', {params}).then((response) => {
          let res = response.data
          if (res.status === 0) {
            // 加载更多
            if (true) {
              this.goodsList = this.goodsList.concat(res.result.list)

              // 如果没有数据,禁用动画
              if (res.result.count === 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list
            }

          } else {
            this.goodsList = []
          }
        })
      },
      sortGoods() {
        this.page = 1
        this.sortFlag = !this.sortFlag
        this._getGoodsList()
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this._getGoodsList(true);
        }, 500);
      },
    },
    components: {
      NavHeader,
      NavBread,
      NavFooter
    }
  }
</script>
