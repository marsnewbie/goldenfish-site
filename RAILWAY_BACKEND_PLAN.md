# Railway 后端架构设计 - Golden Fish 订单管理系统

## 🏗️ **技术栈选择（行业最佳实践）**

### 后端核心
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js 4.x (轻量高效)
- **语言**: TypeScript (类型安全 + 开发体验)
- **API风格**: RESTful + WebSocket

### 数据存储
- **主数据库**: PostgreSQL 15+ (ACID事务 + JSON支持)
- **缓存层**: Redis 7+ (会话 + 实时数据)
- **文件存储**: Railway内置存储 (订单PDF等)

### 通信和集成
- **邮件服务**: Resend API (已有token)
- **实时通信**: Socket.IO (订单状态更新)
- **API文档**: Swagger/OpenAPI 3.0

## 📊 **数据库设计**

### 核心表结构

```sql
-- 餐厅配置表
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address JSONB,
    opening_hours JSONB,
    delivery_zones JSONB,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 用户表 (支持注册用户和临时用户)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255), -- NULL for guest users
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    addresses JSONB DEFAULT '[]',
    user_type VARCHAR(20) DEFAULT 'guest', -- 'guest', 'registered'
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- 订单主表
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    restaurant_id INTEGER REFERENCES restaurants(id),
    user_id INTEGER REFERENCES users(id),
    
    -- Customer info (duplicated for record keeping)
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Order details
    items JSONB NOT NULL,
    delivery_type VARCHAR(20) NOT NULL, -- 'delivery', 'collection'
    delivery_address JSONB,
    delivery_instructions TEXT,
    special_instructions TEXT,
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Status and timing
    status VARCHAR(20) DEFAULT 'received', -- 'received', 'preparing', 'ready', 'completed', 'cancelled'
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    estimated_time INTEGER, -- minutes
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 订单状态历史
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 菜单配置 (从现有script.js移植)
CREATE TABLE menu_categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    name VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    image_url VARCHAR(255),
    options JSONB DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);
```

## 🛠️ **API 端点设计**

### 订单管理 API
```typescript
// POST /api/orders - 创建订单
interface CreateOrderRequest {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accountType: 'guest' | 'register';
    password?: string;
  };
  items: OrderItem[];
  deliveryType: 'delivery' | 'collection';
  deliveryAddress?: Address;
  specialInstructions?: string;
  paymentMethod: string;
}

interface CreateOrderResponse {
  orderNumber: string;
  orderId: number;
  estimatedTime: number;
  emailSent: boolean;
}

// GET /api/orders/:orderNumber - 查询订单状态
// PUT /api/orders/:id/status - 更新订单状态 (管理员)
// GET /api/orders - 获取订单列表 (管理员)
```

### 邮件服务 API
```typescript
// POST /api/emails/order-confirmation
// POST /api/emails/order-update
// GET /api/emails/templates - 邮件模板管理
```

### 实时通知 WebSocket
```typescript
// 客户端订阅: socket.emit('subscribe_order', orderNumber)
// 服务端推送: socket.emit('order_update', { orderNumber, status, message })
```

## 🔧 **项目结构**

```
golden-fish-backend/
├── src/
│   ├── controllers/        # API控制器
│   │   ├── orderController.ts
│   │   ├── emailController.ts
│   │   └── adminController.ts
│   ├── models/            # 数据模型
│   │   ├── Order.ts
│   │   ├── User.ts
│   │   └── Restaurant.ts
│   ├── services/          # 业务逻辑
│   │   ├── orderService.ts
│   │   ├── emailService.ts
│   │   └── notificationService.ts
│   ├── middleware/        # 中间件
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── cors.ts
│   ├── routes/           # 路由定义
│   │   ├── orders.ts
│   │   ├── admin.ts
│   │   └── public.ts
│   ├── utils/            # 工具函数
│   │   ├── orderNumber.ts
│   │   ├── database.ts
│   │   └── logger.ts
│   ├── config/           # 配置
│   │   ├── database.ts
│   │   └── environment.ts
│   └── app.ts            # 应用入口
├── migrations/           # 数据库迁移
├── tests/               # 测试文件
├── package.json
├── tsconfig.json
└── railway.toml         # Railway配置
```

## 🚀 **部署和配置**

### Railway 环境变量
```env
# 数据库
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://user:pass@host:port

# API Keys
RESEND_API_KEY=re_jTuYL41J_DpqE9iM23spyFRds7R8rua9x
EMAIL_FROM=onlineorder@ringorderai.com

# 应用配置
NODE_ENV=production
PORT=3000
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=https://test-ordering-page.vercel.app

# 订单配置
ORDER_NUMBER_PREFIX=GF
DEFAULT_PREP_TIME_DELIVERY=30
DEFAULT_PREP_TIME_COLLECTION=20
```

### Railway 部署命令
```json
// package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "ts-node-dev src/app.ts",
    "migrate": "node dist/migrations/run.js"
  }
}
```

## 📱 **管理员界面功能**

### 实时订单看板
- 新订单通知 + 声音提醒
- 订单状态更新 (一键操作)
- 预计完成时间调整
- 客户信息和配送地址
- 打印订单功能

### 配置管理
- 营业时间设置
- 菜单价格更新
- 配送区域管理
- 折扣活动配置

### 数据分析
- 每日/每周销售统计
- 热门菜品分析
- 高峰时段统计
- 客户留存分析

## 🔒 **安全和性能**

### 安全措施
- API Rate Limiting (防止刷单)
- Input Validation (防SQL注入)
- CORS 配置 (限制域名访问)
- JWT Token 认证 (管理员)
- 敏感数据加密存储

### 性能优化
- Redis 缓存热点数据
- 数据库连接池
- API响应压缩
- 静态资源CDN
- 数据库索引优化

## 📊 **监控和日志**

### 应用监控
- 错误追踪 (Sentry集成)
- 性能监控 (响应时间)
- 数据库查询优化
- 内存和CPU使用率

### 业务指标
- 订单成功率
- 邮件发送成功率
- 平均订单处理时间
- 客户满意度追踪

## 🔄 **开发流程**

### Phase 1: 核心后端 (1-2天)
1. **数据库设计和迁移**
2. **基础API开发** (创建订单、状态查询)
3. **邮件服务集成** (解决CORS问题)
4. **订单编号系统** (服务器端实现)

### Phase 2: 管理功能 (2-3天)
1. **管理员认证系统**
2. **订单管理界面**
3. **实时通知系统**
4. **配置管理功能**

### Phase 3: 高级功能 (3-5天)
1. **用户账户系统**
2. **支付集成** (Stripe/PayPal)
3. **数据分析功能**
4. **移动端适配**

---

## ✅ **立即开始步骤**

请确认以下信息，我将立即开始开发：

1. **数据库偏好**: PostgreSQL + Redis (推荐) 或 MySQL + Redis?
2. **管理员登录**: 用户名/密码 还是 邮箱/密码?
3. **Railway项目名**: 建议 `goldenfish-backend`
4. **时区设置**: GMT+0 (英国时间) 还是其他?
5. **语言支持**: 英文界面 还是 中英双语?

**一旦确认，我将创建完整的Railway项目，包括数据库迁移、API开发和部署配置！** 🚀