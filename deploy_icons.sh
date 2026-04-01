#!/bin/zsh

# 1. 进入项目根目录
cd "/Users/segway/Downloads/人生进度管理局"

# 2. 批量复制生成的原始图标到项目图片库 (TabBar)
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/life_active_icon_1775006678688.png" mini-program/images/tab_life_active.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/life_inactive_icon_1775006738025.png" mini-program/images/tab_life.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/time_active_icon_1775006690533.png" mini-program/images/tab_time_active.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/time_inactive_icon_1775006753049.png" mini-program/images/tab_time.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/cycle_active_icon_1775006706770.png" mini-program/images/tab_cycle_active.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/cycle_inactive_icon_1775006765461.png" mini-program/images/tab_cycle.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/about_active_icon_1775006719196.png" mini-program/images/tab_about_active.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/about_inactive_icon_1775006781390.png" mini-program/images/tab_about.png

# 3. 复制功能图标 (Common UI & Mode Toggle)
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/icon_clock_1775006900852.png" mini-program/images/icon_clock.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/icon_calendar_1775006912297.png" mini-program/images/icon_calendar.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/icon_circle_mode_1775007580181.png" mini-program/images/icon_circle.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/icon_grid_mode_1775007595117.png" mini-program/images/icon_grid.png
cp "/Users/segway/.gemini/antigravity/brain/215a92d4-696e-41e5-bef3-5ab8837ce751/cycle_active_icon_1775006706770.png" mini-program/images/icon_rings.png

# 4. 调整尺寸
sips -z 81 81 mini-program/images/tab_*.png
sips -z 64 64 mini-program/images/icon_*.png

echo "✅ 所有图标已部署！请重启微信开发者工具查看首页视觉优化效果。"
