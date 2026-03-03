import { supabase } from '../supabase.js'

async function fetchTables() {
  console.log('正在查询数据库表信息...')
  
  try {
    // 方法1: 尝试使用 PostgREST API 查询表信息
    // 注意：这需要适当的权限
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public')
    
    if (error) {
      console.error('查询表信息失败:', error)
      
      // 方法2: 尝试查询可能存在的常见表
      console.log('尝试查询常见表...')
      
      // 尝试查询 users 表
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1)
      
      if (!usersError) {
        console.log('找到 users 表')
        if (usersData && usersData.length > 0) {
          console.log('users 表结构:', Object.keys(usersData[0]))
        }
      }
      
      // 尝试查询 posts 表
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .limit(1)
      
      if (!postsError) {
        console.log('找到 posts 表')
        if (postsData && postsData.length > 0) {
          console.log('posts 表结构:', Object.keys(postsData[0]))
        }
      }
      
    } else {
      console.log('数据库表信息:')
      data.forEach(table => {
        console.log(`- ${table.table_name} (${table.table_schema})`)
      })
    }
    
  } catch (err) {
    console.error('发生错误:', err)
  }
}

fetchTables()
