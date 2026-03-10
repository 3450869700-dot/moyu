<template>
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
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "./supabase";

const tables = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchTables() {
  try {
    loading.value = true;
    error.value = null;

    console.log("开始查询数据库表信息...");

    // 直接查询用户的表 - Story Characters Table
    const tableName = "story_characters";
    console.log(`尝试查询表: ${tableName}`);

    const { data: tableData, error: tableError } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);

    console.log("查询结果:", { tableData, tableError });

    if (tableError) {
      console.error("表查询错误:", tableError);
      if (tableError.message.includes("Invalid API key")) {
        error.value = "API 密钥无效，请检查 Supabase 配置";
        return;
      }
    }

    if (!tableError && tableData && tableData.length > 0) {
      tables.value = [
        {
          name: tableName,
          description: "Story Characters Table",
          columns: Object.keys(tableData[0]).map((key) => ({
            name: key,
            dataType: typeof tableData[0][key],
          })),
        },
      ];
    } else {
      // 显示详细的错误信息
      error.value = `无法查询表: ${tableName}，请检查 Supabase 配置和表权限`;
    }
  } catch (err) {
    error.value = `发生错误: ${err.message}`;
    console.error("发生错误:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  padding: 20px;
}

.hello {
  font-size: 10rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 30px;
}

.btn:hover {
  background-color: #0069d9;
}

.loading,
.error {
  margin-top: 20px;
  font-size: 18px;
}

.error {
  color: red;
}

.tables {
  margin-top: 30px;
  max-width: 800px;
  width: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tables h2 {
  text-align: center;
  margin-bottom: 20px;
}

.tables ul {
  list-style: none;
  padding: 0;
}

.tables li {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.columns {
  margin-top: 10px;
}

.columns ul {
  margin-top: 5px;
}

.columns li {
  background-color: #f9f9f9;
  margin-bottom: 5px;
  padding: 5px 10px;
}
</style>
