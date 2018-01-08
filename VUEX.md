## VUEX
### State
 - State是唯一的数据源
 - 单一状态树
 - this.$store 就是vuex对象

### Getters
- 通过Getters可以派生出一些新的状态

### Mutations
- 更改Vuex的store中的状态的唯一方法是提交mutation

### Actions
- action 提交的是mutation,而不是直接变更状态
- Action 可以包含任意异步操作

### Modules
面对复杂的应用程序,当管理的状态比较多的时候,我们需要将VUEX的store对象分割成模块(modules)
