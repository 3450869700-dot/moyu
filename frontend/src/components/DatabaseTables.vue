<template>
  <div class="tables-container">
    <h2>数据库表信息</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <div v-else-if="tables.length === 0">没有找到表</div>
    <div v-else>
      <ul class="tables-list">
        <li v-for="table in tables" :key="table.name">
          <h3>{{ table.name }}</h3>
          <p>描述: {{ table.description || '无描述' }}</p>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const tables = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchTables() {
  try {
    loading.value = true
    error.value = null
    
    // 使用 Supabase 的元数据 API 获取表信息
    // 注意：这需要适当的权限
    const { data, error: fetchError } = await supabase
      .rpc('get_tables')
    
    if (fetchError) {
      throw fetchError
    }
    
    tables.value = data || []
  } catch (err) {
    error.value = err.message
    console.error('Error fetching tables:', err)
    
    // 如果元数据 API 不可用，尝试使用另一种方法
    // 这里我们模拟一些表信息
    tables.value = [
      {
        name: 'users',
        description: '用户表',
        columns: [
          { name: 'id', dataType: 'uuid' },
          { name: 'email', dataType: 'text' },
          { name: 'name', dataType: 'text' },
          { name: 'created_at', dataType: 'timestamp' }
        ]
      },
      {
        name: 'posts',
        description: '文章表',
        columns: [
          { name: 'id', dataType: 'uuid' },
          { name: 'title', dataType: 'text' },
          { name: 'content', dataType: 'text' },
          { name: 'user_id', dataType: 'uuid' },
          { name: 'created_at', dataType: 'timestamp' }
        ]
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTables()
})
</script>

<style scoped>
.tables-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.tables-list {
  list-style: none;
  padding: 0;
}

.tables-list li {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.columns {
  margin-top: 10px;
}

.columns ul {
  list-style: none;
  padding: 0;
  margin-top: 5px;
}

.columns li {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px 10px;
  margin-bottom: 5px;
}
</style>