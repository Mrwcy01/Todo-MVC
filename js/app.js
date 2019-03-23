(function (Vue) {
	const todos = [
		{id:1, title:'德玛西亚', completed:false},
		{id:2, title:'弗雷尔卓德，永不放弃', completed:true},
		{id:2, title:'一拳一个嘤嘤怪', completed:false}
	]
	const app = new Vue({
		el:'#app',
		data: {
			message:'TodoMVC',
			todos: JSON.parse(window.localStorage.getItem('todos')) || [],
			currentEdit: null, // 当前编辑的任务项
			filterText: 'all' // 默认显示所有，点击筛选按钮改变它
		},
		watch: {
			// key 是你要监视的数据成员
			// value 是一个函数，当被监视的数据的改变的时候，会调用 value 函数
			todos: {
				handler (newVal, oldVal) { // 监视处理函数， handler 是固定的 API 
					window.localStorage.setItem('todos', JSON.stringify(this.todos))
				},
				deep: true  // 深度监视，包括所有的后代成员， deep 是规则，不是乱写的
			}
		},
		methods: {
			// 添加数据
			headleAdd (e) {
				// 1.拿到文本框数据
				const inputVal = e.target.value.trim()
				if (inputVal.length === 0) {
					return
				}
				// 2.添加到 todos 中
				this.todos.push({
					id: Math.random(),
					title: inputVal,
					completed: false
				})
				e.target.value = ''
			},
			// 删除单个数据
			headleDel (index) {
				if(!window.confirm('确认删除吗?')) {
					return
				}
				this.todos.splice(index,1)
			},

			// 判断是否有已完成的数据
			hasCompleted () {

				// some 会遍历数组，每遍历一次就把当前遍历项传递给函数调用一次
				// 函数返回一个布尔值，如果结果为 true，则 some 停止遍历， 返回 true
				// 如果结果为 false，则继续遍历
				// 如果直到遍历结束，都没有匹配为 true 的结果， 则返回false
				
				// this.todos.some(function (item, index) {
				// 	return item.completed === true
				// })

				// return this.todos.some(item => item.completed === true)

				return this.todos.some(item => item.completed)
	
			},

			// 删除所有已完成数据
			handleClearAllDone () {
				if(!window.confirm('确认删除所有已完成数据吗?')) {
					return
				}
				for(let i = 0; i < this.todos.length; i++) {
					const item = this.todos[i]
					if(item.completed === true) {
						this.todos.splice(i,1)
						// 删除之后，后面的元素索引都会往前 +1
						// 而你如果继续让 i++，那么就会有被漏掉的
						i--
					}
				}
			},

			// 获取所有未完成的数量
			getRemaining () {
				// let count = 0
				// this.todos.forEach(item => {
				// 	if (item.completed === false) {
				// 		count ++
				// 	}
				// })
				// return count

				// filter 也会遍历数组
				/**
				 * 它会在内部创建一个新的数组，然后每遍历一次就调用 callback（回调函数）
				 * 如果遍历项满足 item.completed === false 条件，则把满足该条件的元素添加到新数组中，不满足不添加
				 * 所以遍历结束之后，我们就会得到一个新的数组
				 */

				// return this.todos.filter(function (item, index) {
				// 	return item.completed === false
				// 	// return !item.completed		简写
				// }).length

				return this.todos.filter(item => !item.completed).length
			},

			// 切换所有任务项的完成状态
			hanleToggleAll (e) {
				const checked = e.target.checked
				this.todos.forEach(item => {
					item.completed = checked
				})
			},
			everyCompleted () {
				return this.todos.every(item => item.completed)

			},

			// 双击获得编辑状态
			handleGetEditing (item) {
				this.currentEdit = item
			},
			// 取消编辑
			headleCancelEdit () {
				this.currentEdit = null

			},

			// 保存编辑
			headleSavelEdit (item, index, e) {
				const editVal = e.target.value.trim()
				if (editVal.length === 0) { // 删除
					// this.todos.splice(index,1)
					// methods 中不仅仅可以访问 data 中的数据成员，也可以访问 methods 其他成员
					this.headleDel(index)
				}else { // 保存编辑
					item.title = editVal
				}
				
				this.currentEdit = null
				
			},

			// 筛选数据
			filterTodos (app) {
				const { filterText, todos } = this
				// let filterTodos = todos
				// switch (filterText) {
				// 	case 'active':
				// 		filterTodos = todos.filter(item => item.completed === false)
				// 		break
				// 	case 'completed':
				// 		filterTodos = todos.filter(item => item.completed === true)
				// 		break
				// }
				// return filterTodos


				if (filterText === 'all') {
					return todos
				} else if (filterText === 'active') {
					return todos.filter(item => item.completed === false)
				} else if (filterText === 'completed') {
					return todos.filter(item => item.completed === true)
				}
			}
		},
	})

	window.onhashchange = handleHashChange

	function handleHashChange () {
		console.log(window.location.hash);
		switch (window.location.hash) {
			case '#/':
			app.filterText = 'all'
			break
			case '#/active':
			app.filterText = 'active'
			break
			case '#/completed':
			app.filterText = 'completed'
			
		}
		
	}

})(Vue);

