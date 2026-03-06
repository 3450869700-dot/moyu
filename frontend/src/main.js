// 使用CDN方式的全局变量
const { createApp } = Vue

// 简单的App组件
const App = {
  template: `
    <div class="container">
      <div class="hello">你好</div>
      <button @click="fetchTables" class="btn">查询数据库表信息</button>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">错误: {{ error }}</div>
      <div v-else-if="tables.length > 0" class="tables">
        <h2>数据库表信息</h2>
        <ul>
          <li v-for="table in tables" :key="table.name">
            <h3>{{ table.name }}</h3>
            <p>描述: {{ table.description || "无描述" }}</p>
            <div class="columns">
              <h4>列:</h4>
              <ul>
                <li v-for="column in table.columns" :key="column.name">
                  {{ column.name }} ({{ column.dataType }})
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  data() {
    return {
      tables: [],
      loading: false,
      error: null,
      supabase: null
    }
  },
  mounted() {
    // 初始化Supabase
    const supabaseUrl = 'https://oiewadumjixvrqbghczl.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZXdhZHVtaml4dnJxYmdoY3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzY2OTUsImV4cCI6MjA4ODAxMjY5NX0.C-BGaqSDYCalCv7R3KCvFmuLPJS8R_D7s90wblap8Wc'
    this.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey)
  },
  methods: {
    async fetchTables() {
      try {
        this.loading = true
        this.error = null

        console.log('开始查询数据库表信息...')

        // 直接查询用户的表 - Story Characters Table
        const tableName = "story_characters"
        console.log(`尝试查询表: ${tableName}`)

        const { data: tableData, error: tableError } = await this.supabase
          .from(tableName)
          .select("*")
          .limit(1)

        console.log("查询结果:", { tableData, tableError })

        if (tableError) {
          console.error("表查询错误:", tableError)
          if (tableError.message.includes("Invalid API key")) {
            this.error = "API 密钥无效，请检查 Supabase 配置"
            return
          }
        }

        if (!tableError && tableData && tableData.length > 0) {
          this.tables = [
            {
              name: tableName,
              description: "Story Characters Table",
              columns: Object.keys(tableData[0]).map((key) => ({
                name: key,
                dataType: typeof tableData[0][key],
              })),
            },
          ]
        } else {
          // 显示详细的错误信息
          this.error = `无法查询表: ${tableName}，请检查 Supabase 配置和表权限`
        }
      } catch (err) {
        this.error = `发生错误: ${err.message}`
        console.error("发生错误:", err)
      } finally {
        this.loading = false
      }
    }
  }
}

// 挂载应用
createApp(App).mount('#app')