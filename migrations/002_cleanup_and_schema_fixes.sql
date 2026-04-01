-- Migration 002: Cleanup deprecated table + schema fixes
-- Run this ONCE against your PostgreSQL database
-- Date: 2026-03-31

-- 1. حذف جدول favorites المهجور (بلا user_id - لا قيمة له)
--    الجدول الصحيح هو user_favorites
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP SEQUENCE IF EXISTS public.favorites_id_seq;

-- 2. إضافة ON DELETE SET NULL على products.store_id
--    (منع orphaned products عند حذف متجر)
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_store_id_fkey;

ALTER TABLE public.products
  ADD CONSTRAINT products_store_id_fkey
  FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE SET NULL;

-- 3. إضافة ON DELETE SET NULL على products.category_id
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_category_id_fkey;

ALTER TABLE public.products
  ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

-- 4. تغيير target_price من INTEGER إلى NUMERIC(10,2) في price_alerts
ALTER TABLE public.price_alerts
  ALTER COLUMN target_price TYPE NUMERIC(10,2);

-- 5. إضافة indexes على الـ Foreign Keys الأساسية لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_store_id     ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id  ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_prices_product_id     ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user   ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_viewed_user      ON public.user_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notif_user       ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product  ON public.price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user     ON public.price_alerts(user_id);
