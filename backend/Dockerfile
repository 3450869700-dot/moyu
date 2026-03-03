# 使用 Maven 官方镜像作为构建基础
FROM maven:3.8.5-openjdk-17 AS build

# 设置工作目录
WORKDIR /app

# 复制 pom.xml 和所有源代码
COPY pom.xml .
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 使用 OpenJDK 官方镜像作为运行基础
FROM openjdk:17-alpine

# 设置工作目录
WORKDIR /app

# 从构建阶段复制打包好的 jar 文件
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar ./app.jar

# 暴露 8080 端口
EXPOSE 8080

# 启动应用
CMD ["java", "-jar", "app.jar"]