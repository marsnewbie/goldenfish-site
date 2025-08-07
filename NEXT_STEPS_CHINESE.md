# 🚀 Supabase配置完成指南

你已经成功创建了Supabase项目！现在需要完成几个配置步骤。

## ✅ 第1步：获取API密钥

1. **打开Supabase Dashboard**
   - 访问: https://supabase.com/dashboard/project/cyitrtjkoqxkolvtsydx

2. **获取API密钥**
   - 点击左侧 **Settings** → **API**
   - 复制 **anon public** 密钥（以 `eyJ` 开头的长字符串）

3. **更新配置文件**
   - 打开 `supabase-config.js`
   - 找到第61行 `YOUR_SUPABASE_ANON_KEY`
   - 替换为你复制的密钥

## ✅ 第2步：配置认证设置

1. **配置网站URL**
   - 在Supabase Dashboard中，点击 **Authentication** → **Settings**
   - **Site URL** 设置为: `https://test-ordering-page.vercel.app`

2. **添加重定向URL**
   - 在 **Redirect URLs** 部分，添加以下URL（每行一个）:
   ```
   https://test-ordering-page.vercel.app/
   https://test-ordering-page.vercel.app/checkout.html  
   https://test-ordering-page.vercel.app/modern-checkout.html
   https://test-ordering-page.vercel.app/menu.html
   http://localhost:3000
   ```
   - 点击 **Save** 保存

## ✅ 第3步：运行数据库架构

1. **打开SQL编辑器**
   - 在Supabase Dashboard中，点击左侧 **SQL Editor**

2. **运行架构脚本**
   - 创建一个新查询
   - 复制整个 `supabase-schema.sql` 文件的内容
   - 粘贴到SQL编辑器中
   - 点击绿色的 **Run** 按钮

3. **验证创建成功**
   - 应该显示 "Success. No rows returned"
   - 点击左侧 **Table Editor**，应该看到这些表：
     - `tenants` (租户)
     - `user_profiles` (用户资料)
     - `restaurants` (餐厅)
     - `orders` (订单)
     - 等等

## ✅ 第4步：创建第一个租户

在SQL编辑器中运行以下代码创建Golden Fish租户：

```sql
-- 创建Golden Fish租户
INSERT INTO tenants (name, slug, business_name, email, plan, settings) VALUES 
('Golden Fish Group', 'golden-fish', 'Golden Fish Restaurant Group Ltd', 'admin@goldenfish.co.uk', 'premium', '{}');

-- 获取租户ID（记下这个ID）
SELECT id, name FROM tenants WHERE slug = 'golden-fish';
```

## ✅ 第5步：创建餐厅信息

用上一步得到的租户ID，创建餐厅：

```sql
-- 替换 'TENANT_ID_HERE' 为实际的租户ID
INSERT INTO restaurants (
    tenant_id, 
    name, 
    slug,
    address_line1, 
    city, 
    postal_code,
    phone,
    opening_hours,
    delivery_zones
) VALUES (
    'TENANT_ID_HERE',
    'Golden Fish York',
    'golden-fish-york', 
    '123 Golden Fish Street',
    'York',
    'YO10 3BP',
    '01904 123456',
    '{"monday": "closed", "tuesday": {"open": "17:00", "close": "23:00"}, "wednesday": {"open": "17:00", "close": "23:00"}, "thursday": {"open": "17:00", "close": "23:00"}, "friday": {"open": "17:00", "close": "00:00"}, "saturday": {"open": "17:00", "close": "00:00"}, "sunday": {"open": "17:00", "close": "22:30"}}',
    '[{"postcode": "YO10", "fee": 2.50}, {"postcode": "YO1", "fee": 3.00}]'
);
```

## ✅ 第6步：测试配置

1. **访问现代化认证页面**
   - https://test-ordering-page.vercel.app/modern-checkout.html

2. **测试Magic Link**
   - 选择 "Sign In with Email"
   - 输入你的邮箱
   - 点击 "Send Magic Link"
   - 检查邮箱中的登录链接

## 🚨 如果遇到问题

### 常见错误解决：

**❌ "Failed to initialize Supabase client"**
- 检查 `supabase-config.js` 中的URL和密钥是否正确
- 确保没有拼写错误

**❌ "Database connection failed"** 
- 确保数据库架构已正确运行
- 检查RLS（行级安全）策略是否启用

**❌ "Magic link emails not sending"**
- 检查Supabase Authentication设置
- 确保邮箱地址有效
- 查看垃圾邮件文件夹

**❌ "Redirect URL mismatch"**
- 检查Authentication设置中的重定向URL
- 确保所有URL都已添加并保存

## 🎯 完成后你将获得：

✅ **无密码登录** - 通过邮箱魔法链接  
✅ **生物识别认证** - Face ID/Touch ID登录  
✅ **社交登录** - Google/Apple登录  
✅ **多租户架构** - 支持多个餐厅连锁  
✅ **实时功能** - 订单状态实时更新  
✅ **企业级安全** - 行级安全策略  

## 📞 需要帮助？

如果在配置过程中遇到任何问题，请告诉我具体的错误信息，我会帮你解决！

---

配置完成后，你的餐厅订餐系统将拥有2025年最先进的认证技术！🚀