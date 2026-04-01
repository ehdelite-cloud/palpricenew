-- Migration 001: Add phone column to users table
-- Run this ONCE against your PostgreSQL database before deploying code changes
-- Date: 2026-03-31

-- إضافة عمود رقم الهاتف لجدول المستخدمين
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone character varying(20);

-- فهرس للبحث السريع بالهاتف
CREATE UNIQUE INDEX IF NOT EXISTS users_phone_key
  ON public.users (phone)
  WHERE phone IS NOT NULL;
