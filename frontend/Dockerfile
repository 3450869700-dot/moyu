# 使用 Node.js 官方镜像作为基础
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件
COPY . .

# 构建前端应用
RUN npm run build

# 使用 nginx 作为生产服务器
FROM nginx:alpine

# 复制构建产物到 nginx 静态目录
COPY --from=0 /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]