# ===== 1단계: React 빌드 =====
FROM node:20-alpine AS build
WORKDIR /app

# package.json 먼저 복사 (캐시 최적화: 의존성 안 바뀌면 재설치 안 함)
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드 -> /app/build 생성 (CRA 기준)
COPY . .
RUN npm run build

# ===== 2단계: Nginx로 서빙 =====
FROM nginx:1.27-alpine

# nginx.conf.template을 templates 폴더로 복사.
# nginx 이미지는 컨테이너 시작 시 /etc/nginx/templates/*.template 을
# 환경변수(${PUBLIC_HOST} 등)로 치환해 /etc/nginx/conf.d/default.conf 를 생성함.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# 빌드 결과물을 nginx 웹 루트로 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]