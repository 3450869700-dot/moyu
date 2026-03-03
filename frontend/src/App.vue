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

    // 尝试查询 information_schema.tables 获取表信息
    const { data, error: fetchError } = await supabase
      .from("information_schema.tables")
      .select("table_name, table_schema")
      .eq("table_schema", "public");

    if (fetchError) {
      console.error("查询表信息失败:", fetchError);

      // 尝试查询常见表
      const tablesToCheck = ["users", "posts", "profiles"];
      const foundTables = [];

      for (const tableName of tablesToCheck) {
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select("*")
          .limit(1);

        if (!tableError && tableData && tableData.length > 0) {
          foundTables.push({
            name: tableName,
            description: `${tableName}表`,
            columns: Object.keys(tableData[0]).map((key) => ({
              name: key,
              dataType: typeof tableData[0][key],
            })),
          });
        }
      }

      tables.value = foundTables;
    } else {
      // 处理查询结果
      const tableDetails = [];
      for (const table of data) {
        // 尝试获取表的列信息
        const { data: columnsData } = await supabase
          .from("information_schema.columns")
          .select("column_name, data_type")
          .eq("table_name", table.table_name)
          .eq("table_schema", table.table_schema);

        tableDetails.push({
          name: table.table_name,
          description: `${table.table_name}表`,
          columns: (columnsData || []).map((col) => ({
            name: col.column_name,
            dataType: col.data_type,
          })),
        });
      }
      tables.value = tableDetails;
    }
  } catch (err) {
    error.value = err.message;
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
