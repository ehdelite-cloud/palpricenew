--
-- PostgreSQL database dump
--

\restrict BR5hkrIGmLn0rGvjhJ4plsTGQthOGhFELxaLoJuEzQbnqw5dGFQWEk0wbPYs8C6

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-25 08:56:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 252 (class 1259 OID 16786)
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_notifications (
    id integer NOT NULL,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    related_id integer,
    related_type character varying(50),
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    link text
);


ALTER TABLE public.admin_notifications OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16785)
-- Name: admin_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5351 (class 0 OID 0)
-- Dependencies: 251
-- Name: admin_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_notifications_id_seq OWNED BY public.admin_notifications.id;


--
-- TOC entry 266 (class 1259 OID 16930)
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id integer NOT NULL,
    store_id integer,
    title character varying(200) NOT NULL,
    description text,
    coupon_id integer,
    discount_text character varying(100),
    banner_color character varying(20) DEFAULT '#22c55e'::character varying,
    starts_at timestamp without time zone DEFAULT now(),
    ends_at timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true,
    views_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 16929)
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.campaigns_id_seq OWNER TO postgres;

--
-- TOC entry 5352 (class 0 OID 0)
-- Dependencies: 265
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.campaigns_id_seq OWNED BY public.campaigns.id;


--
-- TOC entry 230 (class 1259 OID 16470)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    parent_id integer,
    name_en character varying(100),
    icon character varying(10),
    level integer DEFAULT 1
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16469)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5353 (class 0 OID 0)
-- Dependencies: 229
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 264 (class 1259 OID 16911)
-- Name: coupon_uses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_uses (
    id integer NOT NULL,
    coupon_id integer,
    user_id integer,
    used_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.coupon_uses OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 16910)
-- Name: coupon_uses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupon_uses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupon_uses_id_seq OWNER TO postgres;

--
-- TOC entry 5354 (class 0 OID 0)
-- Dependencies: 263
-- Name: coupon_uses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupon_uses_id_seq OWNED BY public.coupon_uses.id;


--
-- TOC entry 262 (class 1259 OID 16887)
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    store_id integer,
    code character varying(50) NOT NULL,
    discount_type character varying(10) DEFAULT 'percent'::character varying,
    discount_value numeric(10,2) NOT NULL,
    min_purchase numeric(10,2) DEFAULT 0,
    max_uses integer,
    used_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    expires_at timestamp without time zone,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 16886)
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_id_seq OWNER TO postgres;

--
-- TOC entry 5355 (class 0 OID 0)
-- Dependencies: 261
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- TOC entry 240 (class 1259 OID 16548)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16547)
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- TOC entry 5356 (class 0 OID 0)
-- Dependencies: 239
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- TOC entry 236 (class 1259 OID 16516)
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offers (
    id integer NOT NULL,
    product_id integer,
    store_id integer,
    price numeric(10,2),
    url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16515)
-- Name: offers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offers_id_seq OWNER TO postgres;

--
-- TOC entry 5357 (class 0 OID 0)
-- Dependencies: 235
-- Name: offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offers_id_seq OWNED BY public.offers.id;


--
-- TOC entry 232 (class 1259 OID 16485)
-- Name: price_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_alerts (
    id integer NOT NULL,
    product_id integer,
    email text,
    target_price integer,
    user_id integer,
    is_triggered boolean DEFAULT false,
    triggered_at timestamp without time zone
);


ALTER TABLE public.price_alerts OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16484)
-- Name: price_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.price_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_alerts_id_seq OWNER TO postgres;

--
-- TOC entry 5358 (class 0 OID 0)
-- Dependencies: 231
-- Name: price_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.price_alerts_id_seq OWNED BY public.price_alerts.id;


--
-- TOC entry 228 (class 1259 OID 16449)
-- Name: price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_history (
    id integer NOT NULL,
    product_id integer,
    store_id integer,
    price numeric(10,2),
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.price_history OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16448)
-- Name: price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.price_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_history_id_seq OWNER TO postgres;

--
-- TOC entry 5359 (class 0 OID 0)
-- Dependencies: 227
-- Name: price_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.price_history_id_seq OWNED BY public.price_history.id;


--
-- TOC entry 226 (class 1259 OID 16428)
-- Name: prices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prices (
    id integer NOT NULL,
    product_id integer,
    store_id integer,
    price numeric(10,2) NOT NULL,
    currency character varying(10) DEFAULT 'ILS'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prices OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16427)
-- Name: prices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prices_id_seq OWNER TO postgres;

--
-- TOC entry 5360 (class 0 OID 0)
-- Dependencies: 225
-- Name: prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prices_id_seq OWNED BY public.prices.id;


--
-- TOC entry 268 (class 1259 OID 16966)
-- Name: product_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_groups (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    name_en character varying(200),
    brand character varying(100),
    category_id integer,
    description text,
    image character varying(500),
    views integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.product_groups OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 16965)
-- Name: product_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_groups_id_seq OWNER TO postgres;

--
-- TOC entry 5361 (class 0 OID 0)
-- Dependencies: 267
-- Name: product_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_groups_id_seq OWNED BY public.product_groups.id;


--
-- TOC entry 238 (class 1259 OID 16527)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16526)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- TOC entry 5362 (class 0 OID 0)
-- Dependencies: 237
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 244 (class 1259 OID 16708)
-- Name: product_specs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_specs (
    id integer NOT NULL,
    product_id integer,
    spec_key character varying(100) NOT NULL,
    spec_value text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_specs OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16707)
-- Name: product_specs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_specs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_specs_id_seq OWNER TO postgres;

--
-- TOC entry 5363 (class 0 OID 0)
-- Dependencies: 243
-- Name: product_specs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_specs_id_seq OWNED BY public.product_specs.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(500) NOT NULL,
    brand character varying(255),
    category character varying(255),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_id integer,
    image text,
    views integer DEFAULT 0,
    store_id integer,
    status character varying(20) DEFAULT 'approved'::character varying,
    reject_reason text,
    sku character varying(200),
    variant_group_id integer,
    group_id integer,
    variant_storage character varying(30),
    variant_color character varying(30),
    variant_edition character varying(50),
    variant_size character varying(20),
    variant_label character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5364 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 234 (class 1259 OID 16500)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16499)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5365 (class 0 OID 0)
-- Dependencies: 233
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 258 (class 1259 OID 16842)
-- Name: store_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_notifications (
    id integer NOT NULL,
    store_id integer,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    link text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.store_notifications OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16841)
-- Name: store_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.store_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5366 (class 0 OID 0)
-- Dependencies: 257
-- Name: store_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_notifications_id_seq OWNED BY public.store_notifications.id;


--
-- TOC entry 242 (class 1259 OID 16562)
-- Name: store_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_reviews (
    id integer NOT NULL,
    store_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.store_reviews OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16561)
-- Name: store_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.store_reviews_id_seq OWNER TO postgres;

--
-- TOC entry 5367 (class 0 OID 0)
-- Dependencies: 241
-- Name: store_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_reviews_id_seq OWNED BY public.store_reviews.id;


--
-- TOC entry 222 (class 1259 OID 16402)
-- Name: stores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    city character varying(100),
    address text,
    phone character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(255),
    password text,
    logo text,
    is_active boolean DEFAULT true,
    is_approved boolean DEFAULT true
);


ALTER TABLE public.stores OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stores_id_seq OWNER TO postgres;

--
-- TOC entry 5368 (class 0 OID 0)
-- Dependencies: 221
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- TOC entry 254 (class 1259 OID 16800)
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    store_id integer,
    subject character varying(200) NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying,
    assigned_to integer,
    assigned_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16799)
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_tickets_id_seq OWNER TO postgres;

--
-- TOC entry 5369 (class 0 OID 0)
-- Dependencies: 253
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- TOC entry 256 (class 1259 OID 16822)
-- Name: ticket_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_messages (
    id integer NOT NULL,
    ticket_id integer,
    sender_type character varying(10) NOT NULL,
    sender_id integer NOT NULL,
    sender_name character varying(100),
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ticket_messages OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16821)
-- Name: ticket_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ticket_messages_id_seq OWNER TO postgres;

--
-- TOC entry 5370 (class 0 OID 0)
-- Dependencies: 255
-- Name: ticket_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_messages_id_seq OWNED BY public.ticket_messages.id;


--
-- TOC entry 248 (class 1259 OID 16747)
-- Name: user_comparisons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_comparisons (
    id integer NOT NULL,
    user_id integer,
    product_ids integer[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_comparisons OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16746)
-- Name: user_comparisons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_comparisons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_comparisons_id_seq OWNER TO postgres;

--
-- TOC entry 5371 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_comparisons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_comparisons_id_seq OWNED BY public.user_comparisons.id;


--
-- TOC entry 246 (class 1259 OID 16726)
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_favorites OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16725)
-- Name: user_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorites_id_seq OWNER TO postgres;

--
-- TOC entry 5372 (class 0 OID 0)
-- Dependencies: 245
-- Name: user_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_favorites_id_seq OWNED BY public.user_favorites.id;


--
-- TOC entry 260 (class 1259 OID 16867)
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notifications (
    id integer NOT NULL,
    user_id integer,
    type character varying(50) NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_notifications OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 16866)
-- Name: user_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5373 (class 0 OID 0)
-- Dependencies: 259
-- Name: user_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_notifications_id_seq OWNED BY public.user_notifications.id;


--
-- TOC entry 250 (class 1259 OID 16763)
-- Name: user_viewed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_viewed (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_viewed OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16762)
-- Name: user_viewed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_viewed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_viewed_id_seq OWNER TO postgres;

--
-- TOC entry 5374 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_viewed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_viewed_id_seq OWNED BY public.user_viewed.id;


--
-- TOC entry 224 (class 1259 OID 16414)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    phone character varying(20),
    password text,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    avatar text,
    is_banned boolean DEFAULT false,
    banned_reason text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16413)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5375 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 5015 (class 2604 OID 16789)
-- Name: admin_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_notifications ALTER COLUMN id SET DEFAULT nextval('public.admin_notifications_id_seq'::regclass);


--
-- TOC entry 5039 (class 2604 OID 16933)
-- Name: campaigns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN id SET DEFAULT nextval('public.campaigns_id_seq'::regclass);


--
-- TOC entry 4993 (class 2604 OID 16473)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 5037 (class 2604 OID 16914)
-- Name: coupon_uses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_uses ALTER COLUMN id SET DEFAULT nextval('public.coupon_uses_id_seq'::regclass);


--
-- TOC entry 5031 (class 2604 OID 16890)
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- TOC entry 5003 (class 2604 OID 16551)
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- TOC entry 4999 (class 2604 OID 16519)
-- Name: offers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers ALTER COLUMN id SET DEFAULT nextval('public.offers_id_seq'::regclass);


--
-- TOC entry 4995 (class 2604 OID 16488)
-- Name: price_alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_alerts ALTER COLUMN id SET DEFAULT nextval('public.price_alerts_id_seq'::regclass);


--
-- TOC entry 4991 (class 2604 OID 16452)
-- Name: price_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history ALTER COLUMN id SET DEFAULT nextval('public.price_history_id_seq'::regclass);


--
-- TOC entry 4988 (class 2604 OID 16431)
-- Name: prices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prices ALTER COLUMN id SET DEFAULT nextval('public.prices_id_seq'::regclass);


--
-- TOC entry 5045 (class 2604 OID 16969)
-- Name: product_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_groups ALTER COLUMN id SET DEFAULT nextval('public.product_groups_id_seq'::regclass);


--
-- TOC entry 5001 (class 2604 OID 16530)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 5007 (class 2604 OID 16711)
-- Name: product_specs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs ALTER COLUMN id SET DEFAULT nextval('public.product_specs_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 16393)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4997 (class 2604 OID 16503)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 5025 (class 2604 OID 16845)
-- Name: store_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_notifications ALTER COLUMN id SET DEFAULT nextval('public.store_notifications_id_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 16565)
-- Name: store_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_reviews ALTER COLUMN id SET DEFAULT nextval('public.store_reviews_id_seq'::regclass);


--
-- TOC entry 4980 (class 2604 OID 16405)
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- TOC entry 5018 (class 2604 OID 16803)
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- TOC entry 5022 (class 2604 OID 16825)
-- Name: ticket_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_messages ALTER COLUMN id SET DEFAULT nextval('public.ticket_messages_id_seq'::regclass);


--
-- TOC entry 5011 (class 2604 OID 16750)
-- Name: user_comparisons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_comparisons ALTER COLUMN id SET DEFAULT nextval('public.user_comparisons_id_seq'::regclass);


--
-- TOC entry 5009 (class 2604 OID 16729)
-- Name: user_favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_favorites_id_seq'::regclass);


--
-- TOC entry 5028 (class 2604 OID 16870)
-- Name: user_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications ALTER COLUMN id SET DEFAULT nextval('public.user_notifications_id_seq'::regclass);


--
-- TOC entry 5013 (class 2604 OID 16766)
-- Name: user_viewed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_viewed ALTER COLUMN id SET DEFAULT nextval('public.user_viewed_id_seq'::regclass);


--
-- TOC entry 4984 (class 2604 OID 16417)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5329 (class 0 OID 16786)
-- Dependencies: 252
-- Data for Name: admin_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_notifications (id, type, message, related_id, related_type, is_read, created_at, link) FROM stdin;
27	new_product	منتج جديد بانتظار الموافقة: iPhone 15 Pro	27	product	t	2026-03-17 20:46:59.962417	\N
28	new_product	منتج جديد بانتظار الموافقة: iphone 15 Plus 128GB 50" Black	28	product	f	2026-03-17 22:12:12.796036	\N
29	product_approved	موافقة على المنتج #27	27	product	f	2026-03-17 22:12:32.505611	\N
30	new_product	منتج جديد بانتظار الموافقة: iphon 11 Pro 64GB 27" Red	29	product	f	2026-03-17 22:15:46.070091	\N
1	role_change	تم تغيير صلاحية المستخدم #1 إلى moderator	1	user	t	2026-03-16 10:02:18.266681	\N
31	product_approved	موافقة على المنتج #29	29	product	f	2026-03-17 22:15:54.194448	\N
3	new_product	منتج جديد بانتظار الموافقة: apple	23	product	t	2026-03-16 11:44:12.157322	\N
4	product_approved	موافقة على المنتج #23	23	product	t	2026-03-16 11:45:13.364336	\N
5	product_rejected	رفض المنتج #22: gfgfg	22	product	t	2026-03-16 11:45:52.094007	\N
6	store_suspended	تعليق المتجر #1	1	store	t	2026-03-16 11:50:22.880682	\N
7	store_activated	تفعيل المتجر #1	1	store	t	2026-03-16 11:50:37.267523	\N
8	user_banned	تم حظر المستخدم #1	1	user	t	2026-03-16 11:50:53.424478	\N
9	user_unbanned	رفع حظر المستخدم #1	1	user	t	2026-03-16 11:51:03.181093	\N
10	product_resubmitted	تم إعادة إرسال المنتج "Samsung A51" للمراجعة	22	product	t	2026-03-16 23:20:42.101611	\N
11	store_suspended	تعليق المتجر #1	1	store	t	2026-03-16 23:21:20.808722	\N
12	store_activated	تفعيل المتجر #1	1	store	t	2026-03-16 23:21:34.159586	\N
13	user_banned	تم حظر المستخدم #1	1	user	t	2026-03-16 23:21:56.856832	\N
14	user_unbanned	رفع حظر المستخدم #1	1	user	t	2026-03-16 23:22:04.879153	\N
15	new_product	منتج جديد بانتظار الموافقة: iPhone 16 Pro	24	product	t	2026-03-17 00:25:23.627013	\N
16	product_approved	موافقة على المنتج #24	24	product	t	2026-03-17 00:25:42.361088	\N
17	product_approved	موافقة على المنتج #22	22	product	t	2026-03-17 00:25:45.145886	\N
18	new_product	منتج جديد بانتظار الموافقة: oppo reno 12 pro	25	product	t	2026-03-17 01:33:29.025545	\N
19	product_rejected	رفض المنتج #25: ضع صورة للمنتج	25	product	t	2026-03-17 01:41:10.055057	\N
20	product_resubmitted	تم إعادة إرسال المنتج "oppo reno 12 pro" للمراجعة	25	product	t	2026-03-17 01:41:29.893707	\N
21	product_approved	موافقة على المنتج #25	25	product	t	2026-03-17 01:41:47.494948	\N
32	product_approved	موافقة على المنتج #28	28	product	f	2026-03-17 22:15:55.23353	\N
22	new_ticket	تذكرة جديدة من متجر "متجر التقنية": jjjjjj	1	ticket	t	2026-03-17 02:35:54.540199	/admin/tickets/1
2	new_product	منتج جديد بانتظار الموافقة: Samsung A51	22	product	t	2026-03-16 11:22:05.503124	\N
23	new_ticket	تذكرة جديدة من متجر "الكترو بلس": oooooo	2	ticket	t	2026-03-17 02:37:06.827493	/admin/tickets/2
24	new_ticket	تذكرة جديدة من متجر "متجر التقنية": lkijlnkjnb	3	ticket	t	2026-03-17 11:04:19.135406	/admin/tickets/3
25	new_product	منتج جديد بانتظار الموافقة: iPhone 15 Pro	26	product	t	2026-03-17 13:28:09.727744	\N
26	product_approved	موافقة على المنتج #26	26	product	f	2026-03-17 13:28:35.653809	\N
\.


--
-- TOC entry 5343 (class 0 OID 16930)
-- Dependencies: 266
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, store_id, title, description, coupon_id, discount_text, banner_color, starts_at, ends_at, is_active, views_count, created_at) FROM stdin;
1	1	الام اغلى ما في الكون عشانها زلزلنا الاسعار	\N	\N	خصم 20 % بمناسبة عيد الام	#22c55e	2026-03-17 05:38:28.320952	2026-03-20 03:38:00	t	0	2026-03-17 05:38:28.320952
\.


--
-- TOC entry 5307 (class 0 OID 16470)
-- Dependencies: 230
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, parent_id, name_en, icon, level) FROM stdin;
9	الأجهزة المنزلية	\N	Home Appliances	🏠	1
10	الهواتف المحمولة	\N	Mobile Phones	📱	1
11	لابتوب وأجهزة لوحية	\N	Computers & Tablets	💻	1
12	تلفزيونات وشاشات	\N	TVs & Monitors	🖥️	1
13	أجهزة منزلية صغيرة	\N	Small Appliances	🍳	1
14	الجمال والعناية	\N	Beauty & Personal Care	💄	1
15	ملحقات وإكسسوارات	\N	Accessories	🎧	1
16	ثلاجات	9	Refrigerators	🧊	2
17	فريزرات	9	Freezers	❄️	2
18	غسالات	9	Washing Machines	🫧	2
19	نشافات	9	Dryers	💨	2
20	غسالة ونشافة	9	Washer & Dryer	🔄	2
21	جلايات	9	Dishwashers	🍽️	2
22	أفران	9	Ovens	🔥	2
23	أفران بلت إن	9	Built-in Ovens	🔥	2
24	طباخات	9	Hobs	🍳	2
25	شفاطات	9	Hoods	💨	2
26	مكيفات	9	Air Conditioners	❄️	2
27	دفايات	9	Heaters	🌡️	2
28	سخانات مياه	9	Water Heaters	♨️	2
29	أجهزة الهواتف	10	Mobile Devices	📱	2
30	إكسسوارات الهواتف	10	Mobile Accessories	🔌	2
31	أجهزة لابتوب	11	Laptops	💻	2
32	الأجهزة اللوحية والآيباد	11	Tablets & iPads	📟	2
33	إكسسوارات الكمبيوتر	11	Computer Accessories	⌨️	2
34	تلفزيونات	12	Televisions	📺	2
35	شاشات كمبيوتر	12	Computer Monitors	🖥️	2
36	مكانس كهربائية	13	Vacuum Cleaners	🌀	2
37	ماكينات قهوة	13	Coffee Machines	☕	2
38	خلاطات	13	Blenders	🥤	2
39	محضرات طعام	13	Food Processors	🍴	2
40	توستر وشواية	13	Toasters & Grills	🍞	2
41	مكواة	13	Irons	👔	2
42	غلايات مياه	13	Kettles	🫖	2
43	ميكروويف	13	Microwave	📡	2
44	العناية بالشعر	14	Hair Care	💇	2
45	إزالة الشعر	14	Hair Removal	✨	2
46	العناية بالبشرة	14	Skin Care Devices	🧴	2
47	فرشاة أسنان كهربائية	14	Electric Toothbrush	🪥	2
48	ماكينات حلاقة	14	Shavers	🪒	2
49	سماعات	15	Headphones & Earphones	🎧	2
50	شواحن وبنك طاقة	15	Chargers & Power Banks	🔋	2
51	كيبورد وماوس	15	Keyboard & Mouse	⌨️	2
52	حافظات وأغطية	15	Cases & Covers	🛡️	2
53	كابلات	15	Cables	🔗	2
54	ميكروفونات	15	Microphones	🎤	2
55	ستاند وحوامل	15	Stands & Mounts	📐	2
56	طابعات	15	Printers	🖨️	2
57	راوتر وشبكات	15	Routers & Networking	📡	2
\.


--
-- TOC entry 5341 (class 0 OID 16911)
-- Dependencies: 264
-- Data for Name: coupon_uses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_uses (id, coupon_id, user_id, used_at) FROM stdin;
\.


--
-- TOC entry 5339 (class 0 OID 16887)
-- Dependencies: 262
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, store_id, code, discount_type, discount_value, min_purchase, max_uses, used_count, is_active, expires_at, description, created_at) FROM stdin;
1	1	OWV0UQLU	percent	15.00	5000.00	1	0	t	\N	خصم بمناسبة عيد الام	2026-03-17 05:03:01.639964
\.


--
-- TOC entry 5317 (class 0 OID 16548)
-- Dependencies: 240
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, product_id, created_at) FROM stdin;
\.


--
-- TOC entry 5313 (class 0 OID 16516)
-- Dependencies: 236
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offers (id, product_id, store_id, price, url, created_at) FROM stdin;
1	1	1	4100.00	https://store1.com/product	2026-03-13 02:47:55.391824
2	1	2	4200.00	https://store2.com/product	2026-03-13 02:47:55.391824
3	1	3	4150.00	https://store3.com/product	2026-03-13 02:47:55.391824
\.


--
-- TOC entry 5309 (class 0 OID 16485)
-- Dependencies: 232
-- Data for Name: price_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_alerts (id, product_id, email, target_price, user_id, is_triggered, triggered_at) FROM stdin;
4	36	\N	3000	2	t	2026-03-24 00:05:29.007102
3	29	\N	1350	1	t	2026-03-24 00:12:11.787078
5	29	\N	1200	1	t	2026-03-24 00:23:20.996672
6	29	\N	900	1	t	2026-03-24 00:41:13.548051
\.


--
-- TOC entry 5305 (class 0 OID 16449)
-- Dependencies: 228
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_history (id, product_id, store_id, price, recorded_at) FROM stdin;
31	28	1	3000.00	2026-03-17 22:12:12.800788
32	29	1	2000.00	2026-03-17 22:15:46.073315
33	41	8	2650.00	2026-03-17 22:28:48.83876
34	45	8	999.00	2026-03-17 22:28:49.515772
35	57	8	1890.00	2026-03-17 22:28:55.582668
36	61	8	4790.00	2026-03-17 22:28:56.105265
37	62	8	169.00	2026-03-17 22:28:56.21208
38	63	8	3890.00	2026-03-17 22:28:56.31811
39	64	8	4250.00	2026-03-17 22:28:56.4297
40	65	8	4250.00	2026-03-17 22:28:56.53584
41	67	8	6090.00	2026-03-17 22:28:56.780551
42	68	8	1890.00	2026-03-17 22:28:56.888784
43	72	8	599.00	2026-03-17 22:28:57.586098
44	73	8	6090.00	2026-03-17 22:28:57.705836
45	74	8	1790.00	2026-03-17 22:29:01.661707
46	76	8	1790.00	2026-03-17 22:29:01.91272
47	77	8	2990.00	2026-03-17 22:29:02.026082
48	79	8	2350.00	2026-03-17 22:29:02.271039
49	80	8	1790.00	2026-03-17 22:29:02.390111
50	31	8	2290.00	2026-03-17 22:29:02.774903
51	83	8	269.00	2026-03-17 22:29:02.884707
52	84	8	2850.00	2026-03-17 22:29:02.99205
53	85	8	2290.00	2026-03-17 22:29:03.100315
54	87	8	2890.00	2026-03-17 22:29:03.350201
55	89	8	4250.00	2026-03-17 22:29:03.596271
56	90	8	2450.00	2026-03-17 22:29:03.706216
57	91	8	4250.00	2026-03-17 22:29:03.810468
58	95	8	4390.00	2026-03-17 22:29:08.687493
59	98	8	2390.00	2026-03-17 22:29:09.076318
60	99	8	449.00	2026-03-17 22:29:09.184706
61	100	8	2450.00	2026-03-17 22:29:09.294373
62	102	8	3290.00	2026-03-17 22:29:09.535922
63	104	8	2090.00	2026-03-17 22:29:09.803075
64	108	8	5390.00	2026-03-17 22:29:10.361972
65	109	8	1590.00	2026-03-17 22:29:10.466144
66	111	8	8450.00	2026-03-17 22:29:10.718155
67	112	8	3150.00	2026-03-17 22:29:10.82596
68	113	8	3390.00	2026-03-17 22:29:10.936003
69	114	8	5690.00	2026-03-17 22:29:11.041849
70	115	8	3790.00	2026-03-17 22:29:11.15011
71	116	8	3790.00	2026-03-17 22:29:11.26069
72	117	8	6590.00	2026-03-17 22:29:11.381597
73	118	8	4390.00	2026-03-17 22:29:15.728789
74	120	8	3150.00	2026-03-17 22:29:15.98654
75	121	8	3390.00	2026-03-17 22:29:16.09394
76	101	8	2350.00	2026-03-17 22:29:16.202378
77	123	8	19990.00	2026-03-17 22:29:16.447657
78	124	8	990.00	2026-03-17 22:29:16.558732
79	125	8	7990.00	2026-03-17 22:29:16.665801
80	126	8	5750.00	2026-03-17 22:29:16.773379
81	104	8	919.00	2026-03-17 22:29:16.880555
82	127	8	1250.00	2026-03-17 22:29:16.988568
83	132	8	799.00	2026-03-17 22:29:25.252994
84	133	8	899.00	2026-03-17 22:29:25.375911
85	140	8	2490.00	2026-03-17 22:29:26.316417
86	141	8	549.00	2026-03-17 22:29:26.424661
87	149	8	1850.00	2026-03-17 22:29:27.508687
88	150	8	3190.00	2026-03-17 22:29:27.62211
89	153	8	6190.00	2026-03-17 22:29:31.411228
90	154	8	1190.00	2026-03-17 22:29:31.522023
91	155	8	2490.00	2026-03-17 22:29:31.630587
93	157	8	420.00	2026-03-17 22:29:35.125758
94	158	8	99.00	2026-03-17 22:29:35.237448
95	159	8	45.00	2026-03-17 22:29:35.34626
96	160	8	137.00	2026-03-17 22:29:35.454794
97	161	8	150.00	2026-03-17 22:29:35.57574
98	162	8	80.00	2026-03-17 22:29:35.68143
99	163	8	100.00	2026-03-17 22:29:35.789451
100	164	8	129.00	2026-03-17 22:29:35.904603
101	165	8	99.00	2026-03-17 22:29:36.010315
102	157	8	370.00	2026-03-17 22:29:36.119028
103	166	8	200.00	2026-03-17 22:29:36.228421
104	167	8	200.00	2026-03-17 22:29:36.338479
105	168	8	110.00	2026-03-17 22:29:36.445209
106	169	8	199.00	2026-03-17 22:29:36.555731
108	171	8	269.00	2026-03-17 22:29:36.772947
109	172	8	150.00	2026-03-17 22:29:36.893575
110	173	8	100.00	2026-03-17 22:29:37.004464
111	174	8	350.00	2026-03-17 22:29:37.110683
112	175	8	100.00	2026-03-17 22:29:37.218798
113	176	8	35.00	2026-03-17 22:29:37.328561
116	179	8	149.00	2026-03-17 22:29:41.35785
118	181	8	120.00	2026-03-17 22:29:41.582135
119	182	8	119.00	2026-03-17 22:29:41.689826
120	175	8	100.00	2026-03-17 22:29:41.799895
121	183	8	230.00	2026-03-17 22:29:41.908126
125	187	8	450.00	2026-03-17 22:29:42.341938
126	188	8	119.00	2026-03-17 22:29:42.453156
131	193	8	169.00	2026-03-17 22:29:43.008376
132	194	8	210.00	2026-03-17 22:29:43.1125
133	195	8	699.00	2026-03-17 22:29:43.22545
134	196	8	689.00	2026-03-17 22:29:43.338196
135	197	8	35.00	2026-03-17 22:29:43.455975
136	198	8	765.00	2026-03-17 22:29:43.564047
141	203	8	99.00	2026-03-17 22:29:47.599729
142	210	8	699.00	2026-03-17 22:29:53.306065
143	212	8	11919980.00	2026-03-17 22:29:53.554843
144	218	8	99.00	2026-03-17 22:29:54.360286
145	220	8	99.00	2026-03-17 22:29:54.621455
146	222	8	49954950.00	2026-03-17 22:29:54.877216
147	224	8	299.00	2026-03-17 22:29:55.140039
148	226	8	9912021.00	2026-03-17 22:29:55.39287
149	228	8	1650.00	2026-03-17 22:30:02.310663
150	229	8	89.00	2026-03-17 22:30:02.423393
151	230	8	100.00	2026-03-17 22:30:02.530611
152	231	8	699.00	2026-03-17 22:30:02.639101
153	232	8	100.00	2026-03-17 22:30:02.900382
154	233	8	449.00	2026-03-17 22:30:03.02136
155	234	8	189.00	2026-03-17 22:30:03.133029
156	236	8	2850.00	2026-03-17 22:30:03.359408
157	237	8	269.00	2026-03-17 22:30:03.467893
158	240	8	99.00	2026-03-17 22:30:03.868611
159	241	8	199.00	2026-03-17 22:30:03.981714
160	244	8	1890.00	2026-03-17 22:30:04.360752
161	246	8	1890.00	2026-03-17 22:30:04.629578
162	57	8	1890.00	2026-03-17 22:30:05.015517
163	249	8	39.00	2026-03-17 22:30:05.127907
164	250	8	349.00	2026-03-17 22:30:10.911596
165	251	8	45.00	2026-03-17 22:30:11.019412
166	252	8	90.00	2026-03-17 22:30:11.131188
167	253	8	89.00	2026-03-17 22:30:11.241427
168	68	8	1890.00	2026-03-17 22:30:11.357049
169	255	8	17919920.00	2026-03-17 22:30:11.609127
170	256	8	119.00	2026-03-17 22:30:11.720094
171	257	8	149.00	2026-03-17 22:30:11.83054
172	258	8	519.00	2026-03-17 22:30:11.934881
173	259	8	550.00	2026-03-17 22:30:12.049617
174	260	8	199.00	2026-03-17 22:30:12.155868
175	261	8	180.00	2026-03-17 22:30:12.26652
176	263	8	500.00	2026-03-17 22:30:12.510676
177	264	8	350.00	2026-03-17 22:30:12.618005
178	265	8	60.00	2026-03-17 22:30:12.731488
179	266	8	55.00	2026-03-17 22:30:12.840995
180	267	8	249.00	2026-03-17 22:30:12.949295
181	268	8	22.00	2026-03-17 22:30:13.059452
182	269	8	89.00	2026-03-17 22:30:13.175137
183	270	8	279.00	2026-03-17 22:30:13.289289
184	271	8	999.00	2026-03-17 22:30:13.409439
185	272	8	109.00	2026-03-17 22:30:13.516029
186	273	8	149.00	2026-03-17 22:30:19.196943
187	274	8	67969920.00	2026-03-17 22:30:19.30209
188	275	8	24.00	2026-03-17 22:30:19.411154
189	276	8	24.00	2026-03-17 22:30:19.521334
190	277	8	55.00	2026-03-17 22:30:19.641755
191	41	8	2650.00	2026-03-17 22:33:39.935556
192	45	8	999.00	2026-03-17 22:33:40.710502
193	57	8	1890.00	2026-03-17 22:33:44.573202
194	61	8	4790.00	2026-03-17 22:33:45.094337
195	62	8	169.00	2026-03-17 22:33:45.198564
196	63	8	3890.00	2026-03-17 22:33:45.305191
197	64	8	4250.00	2026-03-17 22:33:45.416707
198	65	8	4250.00	2026-03-17 22:33:45.521732
199	67	8	6090.00	2026-03-17 22:33:45.771106
200	68	8	1890.00	2026-03-17 22:33:45.878427
201	72	8	599.00	2026-03-17 22:33:46.538745
202	73	8	6090.00	2026-03-17 22:33:46.646137
203	74	8	1790.00	2026-03-17 22:33:48.493039
204	76	8	1790.00	2026-03-17 22:33:48.752387
205	77	8	2990.00	2026-03-17 22:33:48.858005
206	79	8	2350.00	2026-03-17 22:33:49.104367
207	80	8	1790.00	2026-03-17 22:33:49.211827
208	31	8	2290.00	2026-03-17 22:33:49.59336
209	83	8	269.00	2026-03-17 22:33:49.703308
210	84	8	2850.00	2026-03-17 22:33:49.81055
211	85	8	2290.00	2026-03-17 22:33:49.921928
212	87	8	2890.00	2026-03-17 22:33:50.163148
213	89	8	4250.00	2026-03-17 22:33:50.411647
214	90	8	2450.00	2026-03-17 22:33:50.520795
215	91	8	4250.00	2026-03-17 22:33:50.626169
216	95	8	4390.00	2026-03-17 22:33:53.140263
217	98	8	2390.00	2026-03-17 22:33:53.53022
218	99	8	449.00	2026-03-17 22:33:53.637242
219	100	8	2450.00	2026-03-17 22:33:53.750427
220	102	8	3290.00	2026-03-17 22:33:54.109734
221	104	8	2090.00	2026-03-17 22:33:54.353879
222	108	8	5390.00	2026-03-17 22:33:54.98428
223	109	8	1590.00	2026-03-17 22:33:55.095432
224	111	8	8450.00	2026-03-17 22:33:55.342155
225	112	8	3150.00	2026-03-17 22:33:55.452047
226	113	8	3390.00	2026-03-17 22:33:55.561869
227	114	8	5690.00	2026-03-17 22:33:55.667917
228	115	8	3790.00	2026-03-17 22:33:55.774378
229	116	8	3790.00	2026-03-17 22:33:55.883541
230	117	8	6590.00	2026-03-17 22:33:55.990592
231	278	8	10290.00	2026-03-17 22:33:56.103802
232	118	8	4390.00	2026-03-17 22:33:57.908866
233	120	8	3150.00	2026-03-17 22:33:58.161157
234	121	8	3390.00	2026-03-17 22:33:58.268466
235	101	8	2350.00	2026-03-17 22:33:58.375756
236	123	8	19990.00	2026-03-17 22:33:58.626843
237	124	8	990.00	2026-03-17 22:33:58.732165
238	125	8	7990.00	2026-03-17 22:33:58.839005
239	126	8	5750.00	2026-03-17 22:33:58.973355
240	104	8	919.00	2026-03-17 22:33:59.090919
241	132	8	799.00	2026-03-17 22:34:04.843839
242	133	8	899.00	2026-03-17 22:34:04.951283
243	140	8	2490.00	2026-03-17 22:34:05.895051
244	141	8	549.00	2026-03-17 22:34:06.008349
245	149	8	1850.00	2026-03-17 22:34:07.084717
246	150	8	3190.00	2026-03-17 22:34:07.194389
247	153	8	6190.00	2026-03-17 22:34:09.362344
248	154	8	1190.00	2026-03-17 22:34:09.466161
249	155	8	2490.00	2026-03-17 22:34:09.575461
251	157	8	420.00	2026-03-17 22:34:13.074781
252	158	8	99.00	2026-03-17 22:34:13.184531
253	159	8	45.00	2026-03-17 22:34:13.290304
254	160	8	137.00	2026-03-17 22:34:13.401791
255	161	8	150.00	2026-03-17 22:34:13.512499
256	162	8	80.00	2026-03-17 22:34:13.618068
257	163	8	100.00	2026-03-17 22:34:13.725838
258	164	8	129.00	2026-03-17 22:34:13.831629
259	165	8	99.00	2026-03-17 22:34:13.942383
260	157	8	370.00	2026-03-17 22:34:14.048406
261	166	8	200.00	2026-03-17 22:34:14.158981
262	167	8	200.00	2026-03-17 22:34:14.264655
263	168	8	110.00	2026-03-17 22:34:14.375064
264	169	8	199.00	2026-03-17 22:34:14.479289
266	171	8	269.00	2026-03-17 22:34:14.696639
267	172	8	150.00	2026-03-17 22:34:14.80733
268	173	8	100.00	2026-03-17 22:34:14.916873
269	174	8	350.00	2026-03-17 22:34:15.027185
270	175	8	100.00	2026-03-17 22:34:15.136976
271	176	8	35.00	2026-03-17 22:34:15.242836
274	179	8	149.00	2026-03-17 22:34:17.351741
276	181	8	120.00	2026-03-17 22:34:17.565417
277	182	8	119.00	2026-03-17 22:34:17.671421
278	175	8	100.00	2026-03-17 22:34:17.778957
279	183	8	230.00	2026-03-17 22:34:17.885919
283	187	8	450.00	2026-03-17 22:34:18.322414
284	188	8	119.00	2026-03-17 22:34:18.427463
289	193	8	169.00	2026-03-17 22:34:18.970443
290	194	8	210.00	2026-03-17 22:34:19.076283
291	195	8	699.00	2026-03-17 22:34:19.184296
292	196	8	689.00	2026-03-17 22:34:19.292091
293	197	8	35.00	2026-03-17 22:34:19.398343
294	198	8	765.00	2026-03-17 22:34:19.507223
299	203	8	99.00	2026-03-17 22:34:21.841932
300	210	8	699.00	2026-03-17 22:34:27.603621
301	212	8	11919980.00	2026-03-17 22:34:27.850228
302	218	8	99.00	2026-03-17 22:34:28.653916
303	220	8	99.00	2026-03-17 22:34:28.904123
304	222	8	49954950.00	2026-03-17 22:34:29.155104
305	224	8	299.00	2026-03-17 22:34:29.523597
306	226	8	9912021.00	2026-03-17 22:34:29.770701
307	228	8	1650.00	2026-03-17 22:34:31.722331
308	229	8	89.00	2026-03-17 22:34:31.830312
309	230	8	100.00	2026-03-17 22:34:31.941596
310	231	8	699.00	2026-03-17 22:34:32.052397
311	232	8	100.00	2026-03-17 22:34:32.299279
312	233	8	449.00	2026-03-17 22:34:32.406382
313	234	8	189.00	2026-03-17 22:34:32.515201
314	236	8	2850.00	2026-03-17 22:34:32.728315
315	237	8	269.00	2026-03-17 22:34:32.838357
316	240	8	99.00	2026-03-17 22:34:33.224245
317	241	8	199.00	2026-03-17 22:34:33.330347
318	244	8	1890.00	2026-03-17 22:34:33.719807
319	246	8	1890.00	2026-03-17 22:34:33.963798
320	57	8	1890.00	2026-03-17 22:34:34.352964
321	249	8	39.00	2026-03-17 22:34:34.458661
322	250	8	349.00	2026-03-17 22:34:36.271916
323	251	8	45.00	2026-03-17 22:34:36.382469
324	252	8	90.00	2026-03-17 22:34:36.490721
325	253	8	89.00	2026-03-17 22:34:36.599784
326	68	8	1890.00	2026-03-17 22:34:36.706419
327	255	8	17919920.00	2026-03-17 22:34:36.95391
328	256	8	119.00	2026-03-17 22:34:37.063243
329	257	8	149.00	2026-03-17 22:34:37.173299
330	258	8	519.00	2026-03-17 22:34:37.280288
331	259	8	550.00	2026-03-17 22:34:37.390456
332	260	8	199.00	2026-03-17 22:34:37.497628
333	261	8	180.00	2026-03-17 22:34:37.608114
334	263	8	500.00	2026-03-17 22:34:37.854152
335	264	8	350.00	2026-03-17 22:34:37.96395
336	265	8	60.00	2026-03-17 22:34:38.0764
337	266	8	55.00	2026-03-17 22:34:38.197138
338	267	8	249.00	2026-03-17 22:34:38.300269
339	268	8	22.00	2026-03-17 22:34:38.409783
340	269	8	89.00	2026-03-17 22:34:38.517371
341	270	8	279.00	2026-03-17 22:34:38.626721
342	271	8	999.00	2026-03-17 22:34:38.733438
343	272	8	109.00	2026-03-17 22:34:38.840612
344	273	8	149.00	2026-03-17 22:34:40.651707
345	274	8	67969920.00	2026-03-17 22:34:40.767704
346	275	8	24.00	2026-03-17 22:34:40.876623
347	276	8	24.00	2026-03-17 22:34:40.983886
348	277	8	55.00	2026-03-17 22:34:41.091359
349	41	8	2650.00	2026-03-17 22:40:18.462215
350	45	8	999.00	2026-03-17 22:40:25.058893
351	57	8	1890.00	2026-03-17 22:40:46.08941
352	61	8	4790.00	2026-03-17 22:40:51.613931
353	62	8	169.00	2026-03-17 22:40:51.722251
354	63	8	3890.00	2026-03-17 22:40:51.829005
355	64	8	4250.00	2026-03-17 22:40:51.940813
356	65	8	4250.00	2026-03-17 22:40:52.048678
357	67	8	6090.00	2026-03-17 22:40:53.748607
358	68	8	1890.00	2026-03-17 22:40:53.857407
359	72	8	599.00	2026-03-17 22:41:00.691911
360	73	8	6090.00	2026-03-17 22:41:00.798075
361	74	8	1790.00	2026-03-17 22:41:02.615683
362	132	8	799.00	2026-03-17 22:41:13.096265
363	133	8	899.00	2026-03-17 22:41:13.205782
364	140	8	2490.00	2026-03-17 22:41:22.571483
365	141	8	549.00	2026-03-17 22:41:22.677144
366	149	8	1850.00	2026-03-17 22:41:33.261826
367	150	8	3190.00	2026-03-17 22:41:33.372704
368	153	8	6190.00	2026-03-17 22:41:38.414994
369	154	8	1190.00	2026-03-17 22:41:38.526022
370	155	8	2490.00	2026-03-17 22:41:38.633184
372	157	8	420.00	2026-03-17 22:41:42.121883
373	158	8	99.00	2026-03-17 22:41:42.228797
374	159	8	45.00	2026-03-17 22:41:42.338684
375	160	8	137.00	2026-03-17 22:41:42.442835
376	161	8	150.00	2026-03-17 22:41:42.552969
377	162	8	80.00	2026-03-17 22:41:42.660018
378	163	8	100.00	2026-03-17 22:41:42.766487
379	164	8	129.00	2026-03-17 22:41:42.875675
380	165	8	99.00	2026-03-17 22:41:42.984109
381	157	8	370.00	2026-03-17 22:41:43.090149
382	166	8	200.00	2026-03-17 22:41:43.201034
383	167	8	200.00	2026-03-17 22:41:43.309745
384	168	8	110.00	2026-03-17 22:41:43.417943
385	169	8	199.00	2026-03-17 22:41:43.528882
387	171	8	269.00	2026-03-17 22:41:43.740979
388	172	8	150.00	2026-03-17 22:41:43.852287
389	173	8	100.00	2026-03-17 22:41:43.957205
390	174	8	350.00	2026-03-17 22:41:44.065303
391	175	8	100.00	2026-03-17 22:41:44.175381
392	176	8	35.00	2026-03-17 22:41:44.279321
395	179	8	149.00	2026-03-17 22:41:49.349488
397	181	8	120.00	2026-03-17 22:41:49.567858
398	182	8	119.00	2026-03-17 22:41:49.673948
399	175	8	100.00	2026-03-17 22:41:49.78548
400	183	8	230.00	2026-03-17 22:41:49.896606
404	187	8	450.00	2026-03-17 22:41:50.328386
405	188	8	119.00	2026-03-17 22:41:50.434225
410	193	8	169.00	2026-03-17 22:41:50.991
411	194	8	210.00	2026-03-17 22:41:51.100939
412	195	8	699.00	2026-03-17 22:41:51.207771
413	196	8	689.00	2026-03-17 22:41:51.315688
414	197	8	35.00	2026-03-17 22:41:51.421432
415	198	8	765.00	2026-03-17 22:41:51.530034
420	203	8	99.00	2026-03-17 22:41:53.827389
421	210	8	699.00	2026-03-17 22:42:08.387079
422	218	8	99.00	2026-03-17 22:42:18.274586
423	220	8	99.00	2026-03-17 22:42:20.070708
424	224	8	299.00	2026-03-17 22:42:25.798915
425	228	8	1650.00	2026-03-17 22:42:33.435122
426	229	8	89.00	2026-03-17 22:42:33.546329
427	230	8	100.00	2026-03-17 22:42:33.653934
428	231	8	699.00	2026-03-17 22:42:33.76257
429	232	8	100.00	2026-03-17 22:42:34.23896
430	233	8	449.00	2026-03-17 22:42:34.34689
431	234	8	189.00	2026-03-17 22:42:34.454489
432	236	8	2850.00	2026-03-17 22:42:36.352745
433	237	8	269.00	2026-03-17 22:42:36.458661
434	240	8	99.00	2026-03-17 22:42:40.428929
435	241	8	199.00	2026-03-17 22:42:40.535869
436	244	8	1890.00	2026-03-17 22:42:44.018173
437	246	8	1890.00	2026-03-17 22:42:45.657777
438	57	8	1890.00	2026-03-17 22:42:49.467557
439	249	8	39.00	2026-03-17 22:42:49.575158
440	250	8	349.00	2026-03-17 22:42:51.437023
441	251	8	45.00	2026-03-17 22:42:51.546602
442	30	8	1365.00	2026-03-17 22:52:09.617029
443	32	8	2930.00	2026-03-17 22:52:09.617029
444	33	8	2512.00	2026-03-17 22:52:09.617029
445	34	8	2252.00	2026-03-17 22:52:09.617029
446	35	8	2878.00	2026-03-17 22:52:09.617029
447	36	8	1992.00	2026-03-17 22:52:09.617029
448	37	8	1977.00	2026-03-17 22:52:09.617029
449	38	8	1463.00	2026-03-17 22:52:09.617029
450	39	8	944.00	2026-03-17 22:52:09.617029
451	40	8	2284.00	2026-03-17 22:52:09.617029
452	42	8	2868.00	2026-03-17 22:52:09.617029
453	43	8	1102.00	2026-03-17 22:52:09.617029
454	44	8	2408.00	2026-03-17 22:52:09.617029
455	46	8	2542.00	2026-03-17 22:52:09.617029
456	47	8	1891.00	2026-03-17 22:52:09.617029
457	48	8	972.00	2026-03-17 22:52:09.617029
458	49	8	739.00	2026-03-17 22:52:09.617029
459	50	8	881.00	2026-03-17 22:52:09.617029
460	51	8	1142.00	2026-03-17 22:52:09.617029
461	52	8	951.00	2026-03-17 22:52:09.617029
462	53	8	720.00	2026-03-17 22:52:09.617029
463	54	8	1766.00	2026-03-17 22:52:09.617029
464	55	8	1434.00	2026-03-17 22:52:09.617029
465	56	8	854.00	2026-03-17 22:52:09.617029
466	58	8	2536.00	2026-03-17 22:52:09.617029
467	59	8	1376.00	2026-03-17 22:52:09.617029
468	60	8	1105.00	2026-03-17 22:52:09.617029
469	66	8	1392.00	2026-03-17 22:52:09.617029
470	69	8	737.00	2026-03-17 22:52:09.617029
471	70	8	1622.00	2026-03-17 22:52:09.617029
472	71	8	2853.00	2026-03-17 22:52:09.617029
473	75	8	450.00	2026-03-17 22:52:09.617029
474	78	8	1653.00	2026-03-17 22:52:09.617029
475	81	8	312.00	2026-03-17 22:52:09.617029
476	82	8	1189.00	2026-03-17 22:52:09.617029
477	86	8	1050.00	2026-03-17 22:52:09.617029
478	88	8	2140.00	2026-03-17 22:52:09.617029
479	92	8	199.00	2026-03-17 22:52:09.617029
480	93	8	1647.00	2026-03-17 22:52:09.617029
481	94	8	2138.00	2026-03-17 22:52:09.617029
482	96	8	2548.00	2026-03-17 22:52:09.617029
483	97	8	522.00	2026-03-17 22:52:09.617029
484	103	8	1676.00	2026-03-17 22:52:09.617029
485	105	8	1570.00	2026-03-17 22:52:09.617029
486	106	8	838.00	2026-03-17 22:52:09.617029
487	107	8	1068.00	2026-03-17 22:52:09.617029
488	110	8	1583.00	2026-03-17 22:52:09.617029
489	119	8	359.00	2026-03-17 22:52:09.617029
490	122	8	1787.00	2026-03-17 22:52:09.617029
491	128	8	2965.00	2026-03-17 22:52:09.617029
492	129	8	2515.00	2026-03-17 22:52:09.617029
493	130	8	2130.00	2026-03-17 22:52:09.617029
494	131	8	2981.00	2026-03-17 22:52:09.617029
495	134	8	1509.00	2026-03-17 22:52:09.617029
496	135	8	2567.00	2026-03-17 22:52:09.617029
497	136	8	318.00	2026-03-17 22:52:09.617029
498	137	8	603.00	2026-03-17 22:52:09.617029
499	138	8	2690.00	2026-03-17 22:52:09.617029
500	139	8	1277.00	2026-03-17 22:52:09.617029
501	142	8	736.00	2026-03-17 22:52:09.617029
502	143	8	98.00	2026-03-17 22:52:09.617029
503	144	8	1745.00	2026-03-17 22:52:09.617029
504	145	8	1783.00	2026-03-17 22:52:09.617029
505	146	8	558.00	2026-03-17 22:52:09.617029
506	147	8	1132.00	2026-03-17 22:52:09.617029
507	148	8	1127.00	2026-03-17 22:52:09.617029
508	151	8	2857.00	2026-03-17 22:52:09.617029
509	152	8	1732.00	2026-03-17 22:52:09.617029
510	204	8	880.00	2026-03-17 22:52:09.617029
511	205	8	1229.00	2026-03-17 22:52:09.617029
512	206	8	2587.00	2026-03-17 22:52:09.617029
513	207	8	185.00	2026-03-17 22:52:09.617029
514	208	8	2674.00	2026-03-17 22:52:09.617029
515	209	8	2444.00	2026-03-17 22:52:09.617029
516	211	8	804.00	2026-03-17 22:52:09.617029
517	213	8	1820.00	2026-03-17 22:52:09.617029
518	214	8	2454.00	2026-03-17 22:52:09.617029
519	215	8	67.00	2026-03-17 22:52:09.617029
520	216	8	375.00	2026-03-17 22:52:09.617029
521	217	8	173.00	2026-03-17 22:52:09.617029
522	219	8	1800.00	2026-03-17 22:52:09.617029
523	221	8	1429.00	2026-03-17 22:52:09.617029
524	223	8	2156.00	2026-03-17 22:52:09.617029
525	225	8	2109.00	2026-03-17 22:52:09.617029
526	227	8	1093.00	2026-03-17 22:52:09.617029
527	235	8	1269.00	2026-03-17 22:52:09.617029
528	238	8	1428.00	2026-03-17 22:52:09.617029
529	239	8	2014.00	2026-03-17 22:52:09.617029
530	242	8	151.00	2026-03-17 22:52:09.617029
531	243	8	2702.00	2026-03-17 22:52:09.617029
532	245	8	1707.00	2026-03-17 22:52:09.617029
533	247	8	2131.00	2026-03-17 22:52:09.617029
534	248	8	268.00	2026-03-17 22:52:09.617029
535	254	8	1165.00	2026-03-17 22:52:09.617029
536	262	8	1781.00	2026-03-17 22:52:09.617029
537	41	8	2650.00	2026-03-18 00:01:29.610769
538	45	8	999.00	2026-03-18 00:01:30.957293
539	57	8	1890.00	2026-03-18 00:01:36.615496
540	61	8	4790.00	2026-03-18 00:01:37.701781
541	62	8	169.00	2026-03-18 00:01:37.807507
542	63	8	3890.00	2026-03-18 00:01:37.918127
543	64	8	4250.00	2026-03-18 00:01:38.023465
544	65	8	4250.00	2026-03-18 00:01:38.135499
545	67	8	6090.00	2026-03-18 00:01:38.596971
546	68	8	1890.00	2026-03-18 00:01:38.702441
547	72	8	599.00	2026-03-18 00:01:40.217198
548	73	8	6090.00	2026-03-18 00:01:40.325216
549	74	8	1790.00	2026-03-18 00:01:42.148323
550	132	8	799.00	2026-03-18 00:01:48.704445
551	133	8	899.00	2026-03-18 00:01:48.816832
552	140	8	2490.00	2026-03-18 00:01:50.950128
553	141	8	549.00	2026-03-18 00:01:51.056162
554	149	8	1850.00	2026-03-18 00:01:53.559771
555	150	8	3190.00	2026-03-18 00:01:53.669769
556	153	8	6190.00	2026-03-18 00:01:56.20322
557	154	8	1190.00	2026-03-18 00:01:56.313562
558	155	8	2490.00	2026-03-18 00:01:56.41957
559	279	8	199.00	2026-03-18 00:01:59.793369
560	157	8	420.00	2026-03-18 00:01:59.902516
561	158	8	99.00	2026-03-18 00:02:00.009655
562	159	8	45.00	2026-03-18 00:02:00.122308
563	160	8	137.00	2026-03-18 00:02:00.225743
564	161	8	150.00	2026-03-18 00:02:00.334578
565	162	8	80.00	2026-03-18 00:02:00.444366
566	163	8	100.00	2026-03-18 00:02:00.552727
567	164	8	129.00	2026-03-18 00:02:00.662784
568	165	8	99.00	2026-03-18 00:02:00.767988
569	157	8	370.00	2026-03-18 00:02:00.877099
570	166	8	200.00	2026-03-18 00:02:00.985939
571	167	8	200.00	2026-03-18 00:02:01.093939
572	168	8	110.00	2026-03-18 00:02:01.20233
573	169	8	199.00	2026-03-18 00:02:01.309356
574	280	8	259.00	2026-03-18 00:02:01.420013
575	171	8	269.00	2026-03-18 00:02:01.525617
576	172	8	150.00	2026-03-18 00:02:01.634346
577	173	8	100.00	2026-03-18 00:02:01.743203
578	174	8	350.00	2026-03-18 00:02:01.852705
579	175	8	100.00	2026-03-18 00:02:01.957742
580	176	8	35.00	2026-03-18 00:02:02.066231
581	281	8	550.00	2026-03-18 00:02:02.178211
582	282	8	370.00	2026-03-18 00:02:02.286761
583	179	8	149.00	2026-03-18 00:02:04.17149
584	283	8	1190.00	2026-03-18 00:02:04.276827
585	181	8	120.00	2026-03-18 00:02:04.383174
586	182	8	119.00	2026-03-18 00:02:04.492593
587	175	8	100.00	2026-03-18 00:02:04.604359
588	183	8	230.00	2026-03-18 00:02:04.7122
589	284	8	550.00	2026-03-18 00:02:04.822771
590	285	8	190.00	2026-03-18 00:02:04.931162
591	286	8	139.00	2026-03-18 00:02:05.036112
592	187	8	450.00	2026-03-18 00:02:05.14469
593	188	8	119.00	2026-03-18 00:02:05.252255
594	287	8	159.00	2026-03-18 00:02:05.361376
595	288	8	259.00	2026-03-18 00:02:05.471868
596	289	8	190.00	2026-03-18 00:02:05.579551
597	290	8	559.00	2026-03-18 00:02:05.684785
598	193	8	169.00	2026-03-18 00:02:05.787793
599	194	8	210.00	2026-03-18 00:02:05.898574
600	195	8	699.00	2026-03-18 00:02:06.004568
601	196	8	689.00	2026-03-18 00:02:06.112145
602	197	8	35.00	2026-03-18 00:02:06.219292
603	198	8	765.00	2026-03-18 00:02:06.330556
604	291	8	190.00	2026-03-18 00:02:06.436231
605	292	8	190.00	2026-03-18 00:02:06.546155
606	293	8	700.00	2026-03-18 00:02:06.653583
607	294	8	99.00	2026-03-18 00:02:08.478983
608	203	8	99.00	2026-03-18 00:02:08.589294
609	210	8	699.00	2026-03-18 00:02:15.257725
610	218	8	99.00	2026-03-18 00:02:17.620097
611	220	8	99.00	2026-03-18 00:02:18.040853
612	224	8	299.00	2026-03-18 00:02:19.122909
613	228	8	1650.00	2026-03-18 00:02:21.955444
614	229	8	89.00	2026-03-18 00:02:22.066386
615	230	8	100.00	2026-03-18 00:02:22.174291
616	231	8	699.00	2026-03-18 00:02:22.281405
617	232	8	100.00	2026-03-18 00:02:22.697252
618	233	8	449.00	2026-03-18 00:02:22.802613
619	234	8	189.00	2026-03-18 00:02:22.913216
620	236	8	2850.00	2026-03-18 00:02:23.329649
621	237	8	269.00	2026-03-18 00:02:23.4376
622	240	8	99.00	2026-03-18 00:02:24.218949
623	241	8	199.00	2026-03-18 00:02:24.328175
624	244	8	1890.00	2026-03-18 00:02:25.100816
625	246	8	1890.00	2026-03-18 00:02:25.519014
626	57	8	1890.00	2026-03-18 00:02:26.292359
627	249	8	39.00	2026-03-18 00:02:26.398068
628	250	8	349.00	2026-03-18 00:02:28.222616
629	251	8	45.00	2026-03-18 00:02:28.326415
630	41	8	2650.00	2026-03-18 00:15:28.980662
631	45	8	999.00	2026-03-18 00:15:30.118991
632	57	8	1890.00	2026-03-18 00:15:35.246487
633	61	8	4790.00	2026-03-18 00:15:36.188855
634	62	8	169.00	2026-03-18 00:15:36.2964
635	63	8	3890.00	2026-03-18 00:15:36.401966
636	64	8	4250.00	2026-03-18 00:15:36.510182
637	65	8	4250.00	2026-03-18 00:15:36.615647
638	67	8	6090.00	2026-03-18 00:15:37.080934
639	68	8	1890.00	2026-03-18 00:15:37.185975
640	72	8	599.00	2026-03-18 00:15:38.415618
641	73	8	6090.00	2026-03-18 00:15:38.524275
642	74	8	1790.00	2026-03-18 00:15:40.57435
643	132	8	799.00	2026-03-18 00:15:47.107058
644	133	8	899.00	2026-03-18 00:15:47.212593
645	140	8	2490.00	2026-03-18 00:15:49.378499
646	141	8	549.00	2026-03-18 00:15:49.485681
647	149	8	1850.00	2026-03-18 00:15:51.940228
648	150	8	3190.00	2026-03-18 00:15:52.04862
649	153	8	6190.00	2026-03-18 00:15:54.566743
650	154	8	1190.00	2026-03-18 00:15:54.675445
651	155	8	2490.00	2026-03-18 00:15:54.781226
652	198	8	765.00	2026-03-18 00:15:58.096987
653	295	8	765.00	2026-03-18 00:15:58.212575
654	296	8	320.00	2026-03-18 00:15:58.322263
655	297	8	1190.00	2026-03-18 00:15:58.429953
656	298	8	5890.00	2026-03-18 00:15:58.537572
657	299	8	380.00	2026-03-18 00:15:58.643158
658	300	8	320.00	2026-03-18 00:15:58.753813
659	301	8	865.00	2026-03-18 00:15:58.863417
660	302	8	865.00	2026-03-18 00:15:58.96743
661	303	8	1290.00	2026-03-18 00:15:59.075295
662	304	8	1290.00	2026-03-18 00:15:59.18347
663	305	8	2790.00	2026-03-18 00:15:59.293511
664	306	8	5490.00	2026-03-18 00:15:59.400829
665	307	8	1850.00	2026-03-18 00:16:03.845674
666	308	8	2490.00	2026-03-18 00:16:03.952141
667	309	8	5690.00	2026-03-18 00:16:04.057456
668	310	8	3790.00	2026-03-18 00:16:04.168855
669	311	8	1990.00	2026-03-18 00:16:04.27749
670	312	8	2790.00	2026-03-18 00:16:04.385154
671	313	8	3190.00	2026-03-18 00:16:07.700881
672	314	8	999.00	2026-03-18 00:16:07.811308
673	315	8	1490.00	2026-03-18 00:16:07.918691
674	316	8	529.00	2026-03-18 00:16:08.031852
675	317	8	999.00	2026-03-18 00:16:08.138417
676	210	8	699.00	2026-03-18 00:16:12.931191
677	218	8	99.00	2026-03-18 00:16:14.781185
678	220	8	99.00	2026-03-18 00:16:15.137097
679	224	8	299.00	2026-03-18 00:16:15.99263
680	228	8	1650.00	2026-03-18 00:16:18.539756
681	229	8	89.00	2026-03-18 00:16:18.651606
682	230	8	100.00	2026-03-18 00:16:18.760436
683	231	8	699.00	2026-03-18 00:16:18.864737
684	232	8	100.00	2026-03-18 00:16:19.287883
685	233	8	449.00	2026-03-18 00:16:19.395274
686	234	8	189.00	2026-03-18 00:16:19.505535
687	236	8	2850.00	2026-03-18 00:16:19.920033
688	237	8	269.00	2026-03-18 00:16:20.029542
689	240	8	99.00	2026-03-18 00:16:20.660297
690	241	8	199.00	2026-03-18 00:16:20.768296
691	244	8	1890.00	2026-03-18 00:16:21.370884
692	246	8	1890.00	2026-03-18 00:16:21.740303
693	57	8	1890.00	2026-03-18 00:16:22.367981
694	249	8	39.00	2026-03-18 00:16:22.473271
695	250	8	349.00	2026-03-18 00:16:24.297572
696	251	8	45.00	2026-03-18 00:16:24.414021
697	61	8	4790.00	2026-03-18 00:16:35.885612
698	64	8	4250.00	2026-03-18 00:16:36.272647
699	65	8	4250.00	2026-03-18 00:16:36.379451
700	72	8	599.00	2026-03-18 00:16:38.692517
701	89	8	4250.00	2026-03-18 00:16:44.107057
702	95	8	4390.00	2026-03-18 00:16:46.259042
703	113	8	3390.00	2026-03-18 00:16:51.724665
704	123	8	19990.00	2026-03-18 00:16:54.770354
705	125	8	7990.00	2026-03-18 00:16:54.876644
706	318	8	8590.00	2026-03-18 00:16:54.988697
707	319	8	8190.00	2026-03-18 00:16:55.096326
708	320	8	6690.00	2026-03-18 00:16:55.200713
709	322	8	17990.00	2026-03-18 00:16:56.899304
710	77	8	2990.00	2026-03-18 00:17:06.900515
711	102	8	3290.00	2026-03-18 00:17:07.010946
712	115	8	3790.00	2026-03-18 00:17:07.117707
713	87	8	2890.00	2026-03-18 00:17:14.604959
714	108	8	5390.00	2026-03-18 00:17:16.131306
715	116	8	3790.00	2026-03-18 00:17:16.237403
716	118	8	4390.00	2026-03-18 00:17:16.345541
717	63	8	3890.00	2026-03-18 00:17:19.903003
718	41	8	2650.00	2026-03-18 00:17:27.363194
719	45	8	999.00	2026-03-18 00:17:29.14054
720	67	8	6090.00	2026-03-18 00:17:32.875711
721	73	8	6090.00	2026-03-18 00:17:32.987152
722	74	8	1790.00	2026-03-18 00:17:33.092406
723	76	8	1790.00	2026-03-18 00:17:33.198352
724	80	8	1790.00	2026-03-18 00:17:33.306899
725	84	8	2850.00	2026-03-18 00:17:33.416939
726	98	8	2390.00	2026-03-18 00:17:35.080872
727	114	8	5690.00	2026-03-18 00:17:35.190689
728	126	8	5750.00	2026-03-18 00:17:37.033635
729	323	8	3850.00	2026-03-18 00:17:37.143079
730	324	8	3850.00	2026-03-18 00:17:37.247252
731	325	8	3790.00	2026-03-18 00:17:37.35811
732	328	8	139.00	2026-03-18 00:17:47.067015
733	330	8	549.00	2026-03-18 00:17:48.795666
734	332	8	299.00	2026-03-18 00:17:50.709292
735	336	8	199.00	2026-03-18 00:17:55.907069
736	342	8	999.00	2026-03-18 00:18:03.847957
737	343	8	449.00	2026-03-18 00:18:03.955707
738	345	8	499.00	2026-03-18 00:18:05.993704
739	350	8	349.00	2026-03-18 00:18:16.991553
740	353	8	299.00	2026-03-18 00:18:20.569905
741	356	8	399.00	2026-03-18 00:18:25.14047
742	360	8	299.00	2026-03-18 00:18:30.306986
743	362	8	1850.00	2026-03-18 00:18:31.973885
744	365	8	1090.00	2026-03-18 00:18:35.656659
745	367	8	499.00	2026-03-18 00:18:37.759165
746	370	8	2550.00	2026-03-18 00:18:41.329153
747	373	8	699.00	2026-03-18 00:18:44.711021
748	374	8	2550.00	2026-03-18 00:18:48.085112
749	376	8	850.00	2026-03-18 00:18:53.181719
750	377	8	650.00	2026-03-18 00:18:53.298204
751	378	8	400.00	2026-03-18 00:18:53.407227
752	379	8	2150.00	2026-03-18 00:18:56.763568
753	380	8	159.00	2026-03-18 00:18:56.877836
754	381	8	1950.00	2026-03-18 00:18:56.98937
755	382	8	329.00	2026-03-18 00:18:57.110501
756	36	1	3499.00	2026-03-23 23:43:07.662587
757	29	1	1800.00	2026-03-23 23:46:40.415112
758	29	1	1500.00	2026-03-23 23:46:56.68217
759	36	1	2800.00	2026-03-23 23:49:05.025556
760	36	1	2800.00	2026-03-23 23:49:38.067661
761	36	1	2800.00	2026-03-23 23:49:54.578225
762	36	1	2800.00	2026-03-23 23:50:23.801643
763	36	1	2800.00	2026-03-23 23:51:45.87279
764	36	1	2800.00	2026-03-23 23:56:39.990866
765	36	2	2700.00	2026-03-23 23:59:19.677418
766	36	2	2600.00	2026-03-24 00:05:29.003317
767	29	1	1300.00	2026-03-24 00:12:11.783114
768	29	1	1100.00	2026-03-24 00:23:20.994072
769	29	1	900.00	2026-03-24 00:41:13.54335
770	36	1	2700.00	2026-03-24 00:52:08.698837
771	36	1	2500.00	2026-03-24 01:28:57.403923
772	29	1	898.00	2026-03-24 13:56:08.79856
773	29	1	1900.00	2026-03-24 13:59:40.469124
\.


--
-- TOC entry 5303 (class 0 OID 16428)
-- Dependencies: 226
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prices (id, product_id, store_id, price, currency, created_at) FROM stdin;
96	91	8	4250.00	ILS	2026-03-17 22:29:03.810129
89	31	8	1090.00	ILS	2026-03-17 22:29:02.773955
72	41	8	2650.00	ILS	2026-03-17 22:28:48.83739
121	127	8	499.00	ILS	2026-03-17 22:29:16.987814
122	132	8	1390.00	ILS	2026-03-17 22:29:25.252368
97	95	8	4790.00	ILS	2026-03-17 22:29:08.686848
73	45	8	999.00	ILS	2026-03-17 22:28:49.515137
123	133	8	1390.00	ILS	2026-03-17 22:29:25.375035
124	140	8	2490.00	ILS	2026-03-17 22:29:26.315853
74	57	8	2650.00	ILS	2026-03-17 22:28:55.582071
98	98	8	1790.00	ILS	2026-03-17 22:29:09.075607
75	61	8	4790.00	ILS	2026-03-17 22:28:56.104574
76	62	8	169.00	ILS	2026-03-17 22:28:56.211517
701	304	8	765.00	ILS	2026-03-18 00:15:59.183122
702	305	8	399.00	ILS	2026-03-18 00:15:59.292847
703	306	8	119.00	ILS	2026-03-18 00:15:59.400186
704	307	8	1850.00	ILS	2026-03-18 00:16:03.845298
705	308	8	1850.00	ILS	2026-03-18 00:16:03.951695
706	309	8	149.00	ILS	2026-03-18 00:16:04.057168
707	310	8	1850.00	ILS	2026-03-18 00:16:04.168438
708	311	8	1850.00	ILS	2026-03-18 00:16:04.277013
709	312	8	1850.00	ILS	2026-03-18 00:16:04.384549
99	99	8	499.00	ILS	2026-03-17 22:29:09.183539
100	100	8	2450.00	ILS	2026-03-17 22:29:09.293469
115	101	8	2350.00	ILS	2026-03-17 22:29:16.200823
101	102	8	2990.00	ILS	2026-03-17 22:29:09.535216
102	104	8	1090.00	ILS	2026-03-17 22:29:09.802311
103	108	8	69.00	ILS	2026-03-17 22:29:10.361337
125	141	8	199.00	ILS	2026-03-17 22:29:26.424299
126	149	8	2499.00	ILS	2026-03-17 22:29:27.507513
104	109	8	2290.00	ILS	2026-03-17 22:29:10.46572
127	150	8	2490.00	ILS	2026-03-17 22:29:27.621458
128	153	8	6190.00	ILS	2026-03-17 22:29:31.410652
129	154	8	3990.00	ILS	2026-03-17 22:29:31.521387
105	111	8	2350.00	ILS	2026-03-17 22:29:10.717538
106	112	8	2290.00	ILS	2026-03-17 22:29:10.825288
107	113	8	4790.00	ILS	2026-03-17 22:29:10.935224
108	114	8	1790.00	ILS	2026-03-17 22:29:11.040972
109	115	8	2990.00	ILS	2026-03-17 22:29:11.149047
110	116	8	3790.00	ILS	2026-03-17 22:29:11.259954
111	117	8	6590.00	ILS	2026-03-17 22:29:11.381081
112	118	8	4390.00	ILS	2026-03-17 22:29:15.728192
70	28	1	3000.00	ILS	2026-03-17 22:12:12.799933
77	63	8	3890.00	ILS	2026-03-17 22:28:56.317703
113	120	8	2290.00	ILS	2026-03-17 22:29:15.985906
130	155	8	2490.00	ILS	2026-03-17 22:29:31.629938
132	157	8	420.00	ILS	2026-03-17 22:29:35.125008
133	158	8	99.00	ILS	2026-03-17 22:29:35.236546
78	64	8	4250.00	ILS	2026-03-17 22:28:56.428952
79	65	8	4250.00	ILS	2026-03-17 22:28:56.535049
80	67	8	6090.00	ILS	2026-03-17 22:28:56.779948
81	68	8	2650.00	ILS	2026-03-17 22:28:56.887993
82	72	8	599.00	ILS	2026-03-17 22:28:57.58548
83	73	8	6090.00	ILS	2026-03-17 22:28:57.705076
84	74	8	1790.00	ILS	2026-03-17 22:29:01.661351
85	76	8	1790.00	ILS	2026-03-17 22:29:01.911843
86	77	8	2990.00	ILS	2026-03-17 22:29:02.025042
87	79	8	2350.00	ILS	2026-03-17 22:29:02.270335
88	80	8	1790.00	ILS	2026-03-17 22:29:02.389336
90	83	8	169.00	ILS	2026-03-17 22:29:02.884156
91	84	8	2650.00	ILS	2026-03-17 22:29:02.991236
114	121	8	3390.00	ILS	2026-03-17 22:29:16.093365
92	85	8	2290.00	ILS	2026-03-17 22:29:03.099679
116	123	8	19990.00	ILS	2026-03-17 22:29:16.447063
117	124	8	990.00	ILS	2026-03-17 22:29:16.558024
93	87	8	129.00	ILS	2026-03-17 22:29:03.349506
118	125	8	7990.00	ILS	2026-03-17 22:29:16.665453
94	89	8	4250.00	ILS	2026-03-17 22:29:03.595625
95	90	8	2450.00	ILS	2026-03-17 22:29:03.705271
119	126	8	5750.00	ILS	2026-03-17 22:29:16.772892
134	159	8	45.00	ILS	2026-03-17 22:29:35.345591
135	160	8	137.00	ILS	2026-03-17 22:29:35.454073
136	161	8	150.00	ILS	2026-03-17 22:29:35.575166
692	295	8	765.00	ILS	2026-03-18 00:15:58.212059
693	296	8	765.00	ILS	2026-03-18 00:15:58.321783
694	297	8	765.00	ILS	2026-03-18 00:15:58.429536
695	298	8	119.00	ILS	2026-03-18 00:15:58.537178
696	299	8	765.00	ILS	2026-03-18 00:15:58.642842
697	300	8	765.00	ILS	2026-03-18 00:15:58.753027
698	301	8	765.00	ILS	2026-03-18 00:15:58.862912
699	302	8	765.00	ILS	2026-03-18 00:15:58.967025
700	303	8	765.00	ILS	2026-03-18 00:15:59.074938
710	313	8	679.00	ILS	2026-03-18 00:16:07.700568
711	314	8	999.00	ILS	2026-03-18 00:16:07.811031
712	315	8	3190.00	ILS	2026-03-18 00:16:07.918396
713	316	8	999.00	ILS	2026-03-18 00:16:08.031542
714	317	8	999.00	ILS	2026-03-18 00:16:08.13762
745	318	8	8590.00	ILS	2026-03-18 00:16:54.988047
746	319	8	7990.00	ILS	2026-03-18 00:16:55.095606
747	320	8	6690.00	ILS	2026-03-18 00:16:55.200396
1069	321	8	4390.00	ILS	2026-03-18 01:31:02.652668
748	322	8	4390.00	ILS	2026-03-18 00:16:56.898962
1099	351	8	449.00	ILS	2026-03-18 01:34:28.041292
1100	352	8	189.00	ILS	2026-03-18 01:34:33.697308
1102	354	8	189.00	ILS	2026-03-18 01:34:44.954554
1103	355	8	499.00	ILS	2026-03-18 01:34:51.308916
1105	357	8	99.00	ILS	2026-03-18 01:35:07.973792
1106	358	8	149.00	ILS	2026-03-18 01:35:14.864374
1107	359	8	189.00	ILS	2026-03-18 01:35:20.507281
1109	361	8	189.00	ILS	2026-03-18 01:35:33.012573
1111	363	8	1890.00	ILS	2026-03-18 01:35:46.844267
1112	364	8	189.00	ILS	2026-03-18 01:35:52.449478
1114	366	8	1890.00	ILS	2026-03-18 01:36:07.837871
1116	368	8	279.00	ILS	2026-03-18 01:36:20.399156
1117	369	8	669.00	ILS	2026-03-18 01:36:27.308139
1119	371	8	1850.00	ILS	2026-03-18 01:36:38.383892
1120	372	8	189.00	ILS	2026-03-18 01:36:44.126354
1123	375	8	329.00	ILS	2026-03-18 01:37:03.764291
71	29	1	1900.00	ILS	2026-03-17 22:15:46.072693
1133	36	2	2600.00	ILS	2026-03-23 23:59:19.676539
189	229	8	89.00	ILS	2026-03-17 22:30:02.422735
190	230	8	100.00	ILS	2026-03-17 22:30:02.529963
191	231	8	699.00	ILS	2026-03-17 22:30:02.638398
197	240	8	89.00	ILS	2026-03-17 22:30:03.867978
481	30	8	2990.00	ILS	2026-03-17 22:52:09.617029
198	241	8	449.00	ILS	2026-03-17 22:30:03.980811
199	244	8	1650.00	ILS	2026-03-17 22:30:04.360206
200	246	8	1650.00	ILS	2026-03-17 22:30:04.628972
202	249	8	39.00	ILS	2026-03-17 22:30:05.127064
203	250	8	99.00	ILS	2026-03-17 22:30:10.911169
204	251	8	45.00	ILS	2026-03-17 22:30:11.018821
205	252	8	90.00	ILS	2026-03-17 22:30:11.130367
482	32	8	1090.00	ILS	2026-03-17 22:52:09.617029
483	33	8	1490.00	ILS	2026-03-17 22:52:09.617029
484	34	8	1090.00	ILS	2026-03-17 22:52:09.617029
485	35	8	2990.00	ILS	2026-03-17 22:52:09.617029
148	172	8	110.00	ILS	2026-03-17 22:29:36.892839
149	173	8	45.00	ILS	2026-03-17 22:29:37.003719
138	163	8	45.00	ILS	2026-03-17 22:29:35.789123
139	164	8	129.00	ILS	2026-03-17 22:29:35.903918
140	165	8	99.00	ILS	2026-03-17 22:29:36.009672
174	197	8	45.00	ILS	2026-03-17 22:29:43.455429
175	198	8	765.00	ILS	2026-03-17 22:29:43.563445
192	232	8	100.00	ILS	2026-03-17 22:30:02.899769
486	36	8	2990.00	ILS	2026-03-17 22:52:09.617029
487	37	8	1090.00	ILS	2026-03-17 22:52:09.617029
488	38	8	4390.00	ILS	2026-03-17 22:52:09.617029
142	166	8	200.00	ILS	2026-03-17 22:29:36.227827
143	167	8	200.00	ILS	2026-03-17 22:29:36.338134
180	203	8	45.00	ILS	2026-03-17 22:29:47.599045
144	168	8	110.00	ILS	2026-03-17 22:29:36.444756
145	169	8	420.00	ILS	2026-03-17 22:29:36.555043
182	212	8	119.00	ILS	2026-03-17 22:29:53.55423
184	220	8	99.00	ILS	2026-03-17 22:29:54.620855
185	222	8	599.00	ILS	2026-03-17 22:29:54.876634
187	226	8	99.00	ILS	2026-03-17 22:29:55.392309
193	233	8	449.00	ILS	2026-03-17 22:30:03.020738
194	234	8	189.00	ILS	2026-03-17 22:30:03.131996
195	236	8	329.00	ILS	2026-03-17 22:30:03.358757
196	237	8	449.00	ILS	2026-03-17 22:30:03.467301
183	218	8	99.00	ILS	2026-03-17 22:29:54.359721
186	224	8	299.00	ILS	2026-03-17 22:29:55.139398
188	228	8	1650.00	ILS	2026-03-17 22:30:02.310074
147	171	8	200.00	ILS	2026-03-17 22:29:36.772272
150	174	8	200.00	ILS	2026-03-17 22:29:37.110165
151	175	8	45.00	ILS	2026-03-17 22:29:37.218193
181	210	8	699.00	ILS	2026-03-17 22:29:53.305495
155	179	8	129.00	ILS	2026-03-17 22:29:41.357576
157	181	8	120.00	ILS	2026-03-17 22:29:41.581753
158	182	8	3290.00	ILS	2026-03-17 22:29:41.689513
206	253	8	89.00	ILS	2026-03-17 22:30:11.240581
208	255	8	179.00	ILS	2026-03-17 22:30:11.608557
209	256	8	119.00	ILS	2026-03-17 22:30:11.719473
210	257	8	149.00	ILS	2026-03-17 22:30:11.829734
211	258	8	449.00	ILS	2026-03-17 22:30:11.934594
212	259	8	550.00	ILS	2026-03-17 22:30:12.048972
213	260	8	199.00	ILS	2026-03-17 22:30:12.155289
214	261	8	180.00	ILS	2026-03-17 22:30:12.265919
215	263	8	500.00	ILS	2026-03-17 22:30:12.510093
216	264	8	500.00	ILS	2026-03-17 22:30:12.617583
217	265	8	60.00	ILS	2026-03-17 22:30:12.730838
218	266	8	55.00	ILS	2026-03-17 22:30:12.840385
219	267	8	449.00	ILS	2026-03-17 22:30:12.94859
220	268	8	22.00	ILS	2026-03-17 22:30:13.058665
221	269	8	89.00	ILS	2026-03-17 22:30:13.174868
223	271	8	1650.00	ILS	2026-03-17 22:30:13.408854
222	270	8	279.00	ILS	2026-03-17 22:30:13.288659
224	272	8	109.00	ILS	2026-03-17 22:30:13.515614
225	273	8	179.00	ILS	2026-03-17 22:30:19.196431
226	274	8	679.00	ILS	2026-03-17 22:30:19.301459
227	275	8	22.00	ILS	2026-03-17 22:30:19.410451
228	276	8	22.00	ILS	2026-03-17 22:30:19.520649
229	277	8	55.00	ILS	2026-03-17 22:30:19.641033
270	278	8	10290.00	ILS	2026-03-17 22:33:56.102984
160	183	8	110.00	ILS	2026-03-17 22:29:41.907808
152	176	8	45.00	ILS	2026-03-17 22:29:37.327955
164	187	8	200.00	ILS	2026-03-17 22:29:42.341669
165	188	8	3290.00	ILS	2026-03-17 22:29:42.452416
170	193	8	129.00	ILS	2026-03-17 22:29:43.007783
171	194	8	420.00	ILS	2026-03-17 22:29:43.112223
172	195	8	699.00	ILS	2026-03-17 22:29:43.224875
173	196	8	689.00	ILS	2026-03-17 22:29:43.337646
489	39	8	4390.00	ILS	2026-03-17 22:52:09.617029
490	40	8	3290.00	ILS	2026-03-17 22:52:09.617029
491	42	8	2990.00	ILS	2026-03-17 22:52:09.617029
492	43	8	499.00	ILS	2026-03-17 22:52:09.617029
493	44	8	1090.00	ILS	2026-03-17 22:52:09.617029
494	46	8	1090.00	ILS	2026-03-17 22:52:09.617029
495	47	8	4390.00	ILS	2026-03-17 22:52:09.617029
496	48	8	2650.00	ILS	2026-03-17 22:52:09.617029
497	49	8	2690.00	ILS	2026-03-17 22:52:09.617029
498	50	8	3190.00	ILS	2026-03-17 22:52:09.617029
499	51	8	1490.00	ILS	2026-03-17 22:52:09.617029
500	52	8	1090.00	ILS	2026-03-17 22:52:09.617029
501	53	8	4390.00	ILS	2026-03-17 22:52:09.617029
502	54	8	3290.00	ILS	2026-03-17 22:52:09.617029
503	55	8	1250.00	ILS	2026-03-17 22:52:09.617029
504	56	8	1250.00	ILS	2026-03-17 22:52:09.617029
505	58	8	119.00	ILS	2026-03-17 22:52:09.617029
506	59	8	4390.00	ILS	2026-03-17 22:52:09.617029
507	60	8	4390.00	ILS	2026-03-17 22:52:09.617029
508	66	8	4390.00	ILS	2026-03-17 22:52:09.617029
509	69	8	7490.00	ILS	2026-03-17 22:52:09.617029
510	70	8	1690.00	ILS	2026-03-17 22:52:09.617029
511	71	8	1690.00	ILS	2026-03-17 22:52:09.617029
512	75	8	5690.00	ILS	2026-03-17 22:52:09.617029
513	78	8	7490.00	ILS	2026-03-17 22:52:09.617029
137	162	8	45.00	ILS	2026-03-17 22:29:35.680197
768	323	8	5750.00	ILS	2026-03-18 00:17:37.142177
769	324	8	5750.00	ILS	2026-03-18 00:17:37.246727
770	325	8	1790.00	ILS	2026-03-18 00:17:37.357219
771	328	8	139.00	ILS	2026-03-18 00:17:47.066557
772	330	8	549.00	ILS	2026-03-18 00:17:48.795241
773	332	8	299.00	ILS	2026-03-18 00:17:50.708814
774	336	8	159.00	ILS	2026-03-18 00:17:55.906679
775	342	8	999.00	ILS	2026-03-18 00:18:03.847664
776	343	8	449.00	ILS	2026-03-18 00:18:03.955436
777	345	8	499.00	ILS	2026-03-18 00:18:05.993431
778	350	8	349.00	ILS	2026-03-18 00:18:16.991221
779	353	8	249.00	ILS	2026-03-18 00:18:20.569559
780	356	8	399.00	ILS	2026-03-18 00:18:25.14004
781	360	8	299.00	ILS	2026-03-18 00:18:30.306641
514	81	8	4390.00	ILS	2026-03-17 22:52:09.617029
515	82	8	1090.00	ILS	2026-03-17 22:52:09.617029
516	86	8	129.00	ILS	2026-03-17 22:52:09.617029
517	88	8	3690.00	ILS	2026-03-17 22:52:09.617029
518	92	8	5690.00	ILS	2026-03-17 22:52:09.617029
519	93	8	2490.00	ILS	2026-03-17 22:52:09.617029
520	94	8	439.00	ILS	2026-03-17 22:52:09.617029
521	96	8	4390.00	ILS	2026-03-17 22:52:09.617029
522	97	8	4390.00	ILS	2026-03-17 22:52:09.617029
523	103	8	1250.00	ILS	2026-03-17 22:52:09.617029
524	105	8	5990.00	ILS	2026-03-17 22:52:09.617029
525	106	8	2290.00	ILS	2026-03-17 22:52:09.617029
526	107	8	359.00	ILS	2026-03-17 22:52:09.617029
527	110	8	5290.00	ILS	2026-03-17 22:52:09.617029
528	119	8	2650.00	ILS	2026-03-17 22:52:09.617029
529	122	8	5490.00	ILS	2026-03-17 22:52:09.617029
530	128	8	2490.00	ILS	2026-03-17 22:52:09.617029
531	129	8	2499.00	ILS	2026-03-17 22:52:09.617029
532	130	8	1390.00	ILS	2026-03-17 22:52:09.617029
533	131	8	1390.00	ILS	2026-03-17 22:52:09.617029
534	134	8	1390.00	ILS	2026-03-17 22:52:09.617029
535	135	8	1390.00	ILS	2026-03-17 22:52:09.617029
536	136	8	1390.00	ILS	2026-03-17 22:52:09.617029
537	137	8	2499.00	ILS	2026-03-17 22:52:09.617029
538	138	8	1390.00	ILS	2026-03-17 22:52:09.617029
539	139	8	2490.00	ILS	2026-03-17 22:52:09.617029
540	142	8	2490.00	ILS	2026-03-17 22:52:09.617029
541	143	8	2499.00	ILS	2026-03-17 22:52:09.617029
542	144	8	1390.00	ILS	2026-03-17 22:52:09.617029
543	145	8	1390.00	ILS	2026-03-17 22:52:09.617029
544	146	8	2499.00	ILS	2026-03-17 22:52:09.617029
545	147	8	1390.00	ILS	2026-03-17 22:52:09.617029
546	148	8	2490.00	ILS	2026-03-17 22:52:09.617029
547	151	8	2490.00	ILS	2026-03-17 22:52:09.617029
548	152	8	2490.00	ILS	2026-03-17 22:52:09.617029
549	204	8	359.00	ILS	2026-03-17 22:52:09.617029
550	205	8	439.00	ILS	2026-03-17 22:52:09.617029
551	206	8	185.00	ILS	2026-03-17 22:52:09.617029
552	207	8	359.00	ILS	2026-03-17 22:52:09.617029
553	208	8	479.00	ILS	2026-03-17 22:52:09.617029
554	209	8	359.00	ILS	2026-03-17 22:52:09.617029
555	211	8	399.00	ILS	2026-03-17 22:52:09.617029
556	213	8	299.00	ILS	2026-03-17 22:52:09.617029
557	214	8	299.00	ILS	2026-03-17 22:52:09.617029
558	215	8	329.00	ILS	2026-03-17 22:52:09.617029
559	216	8	559.00	ILS	2026-03-17 22:52:09.617029
560	217	8	639.00	ILS	2026-03-17 22:52:09.617029
561	219	8	599.00	ILS	2026-03-17 22:52:09.617029
562	221	8	1150.00	ILS	2026-03-17 22:52:09.617029
563	223	8	439.00	ILS	2026-03-17 22:52:09.617029
564	225	8	329.00	ILS	2026-03-17 22:52:09.617029
565	227	8	439.00	ILS	2026-03-17 22:52:09.617029
566	235	8	179.00	ILS	2026-03-17 22:52:09.617029
567	238	8	599.00	ILS	2026-03-17 22:52:09.617029
568	239	8	599.00	ILS	2026-03-17 22:52:09.617029
569	242	8	599.00	ILS	2026-03-17 22:52:09.617029
570	243	8	809.00	ILS	2026-03-17 22:52:09.617029
571	245	8	1250.00	ILS	2026-03-17 22:52:09.617029
572	247	8	299.00	ILS	2026-03-17 22:52:09.617029
573	248	8	329.00	ILS	2026-03-17 22:52:09.617029
574	254	8	299.00	ILS	2026-03-17 22:52:09.617029
575	262	8	329.00	ILS	2026-03-17 22:52:09.617029
598	279	8	199.00	ILS	2026-03-18 00:01:59.79267
613	280	8	259.00	ILS	2026-03-18 00:02:01.419265
620	281	8	550.00	ILS	2026-03-18 00:02:02.177532
621	282	8	370.00	ILS	2026-03-18 00:02:02.285936
623	283	8	1190.00	ILS	2026-03-18 00:02:04.276365
628	284	8	550.00	ILS	2026-03-18 00:02:04.821915
629	285	8	550.00	ILS	2026-03-18 00:02:04.930426
630	286	8	550.00	ILS	2026-03-18 00:02:05.035498
633	287	8	159.00	ILS	2026-03-18 00:02:05.360798
634	288	8	550.00	ILS	2026-03-18 00:02:05.471283
635	289	8	550.00	ILS	2026-03-18 00:02:05.578798
636	290	8	559.00	ILS	2026-03-18 00:02:05.684333
643	291	8	550.00	ILS	2026-03-18 00:02:06.435712
644	292	8	550.00	ILS	2026-03-18 00:02:06.545463
645	293	8	700.00	ILS	2026-03-18 00:02:06.652929
646	294	8	1150.00	ILS	2026-03-18 00:02:08.478531
1074	326	8	479.00	ILS	2026-03-18 01:31:35.363373
1075	327	8	719.00	ILS	2026-03-18 01:31:42.139425
1077	329	8	199.00	ILS	2026-03-18 01:31:54.808858
1079	331	8	249.00	ILS	2026-03-18 01:32:10.933727
1081	333	8	159.00	ILS	2026-03-18 01:32:25.245994
1082	334	8	479.00	ILS	2026-03-18 01:32:32.320993
1083	335	8	149.00	ILS	2026-03-18 01:32:39.21697
1085	337	8	149.00	ILS	2026-03-18 01:32:53.537959
1086	338	8	149.00	ILS	2026-03-18 01:32:59.07966
1087	339	8	265.00	ILS	2026-03-18 01:33:05.812231
1088	340	8	149.00	ILS	2026-03-18 01:33:11.316726
1089	341	8	149.00	ILS	2026-03-18 01:33:16.882514
1092	344	8	619.00	ILS	2026-03-18 01:33:37.860748
1094	346	8	499.00	ILS	2026-03-18 01:33:54.119553
1095	347	8	1850.00	ILS	2026-03-18 01:34:01.267488
1096	348	8	189.00	ILS	2026-03-18 01:34:08.21901
1097	349	8	189.00	ILS	2026-03-18 01:34:14.082536
782	362	8	1850.00	ILS	2026-03-18 00:18:31.973344
783	365	8	1090.00	ILS	2026-03-18 00:18:35.656229
784	367	8	249.00	ILS	2026-03-18 00:18:37.758726
785	370	8	1850.00	ILS	2026-03-18 00:18:41.328879
786	373	8	699.00	ILS	2026-03-18 00:18:44.710711
787	374	8	1850.00	ILS	2026-03-18 00:18:48.084777
788	376	8	850.00	ILS	2026-03-18 00:18:53.18143
789	377	8	850.00	ILS	2026-03-18 00:18:53.297778
790	378	8	850.00	ILS	2026-03-18 00:18:53.406744
791	379	8	129.00	ILS	2026-03-18 00:18:56.763223
792	380	8	159.00	ILS	2026-03-18 00:18:56.877367
793	381	8	129.00	ILS	2026-03-18 00:18:56.988771
794	382	8	329.00	ILS	2026-03-18 00:18:57.109955
1132	36	1	2500.00	ILS	2026-03-23 23:43:07.661279
\.


--
-- TOC entry 5345 (class 0 OID 16966)
-- Dependencies: 268
-- Data for Name: product_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_groups (id, name, name_en, brand, category_id, description, image, views, created_at) FROM stdin;
2	iphon 11	\N	apple	29	\N	\N	28	2026-03-17 22:15:46.060308
7	جليم غاز فرن غاز	\N	جليم	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:48.70247
8	فاير غاز برولاين فرن	\N	فاير	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:48.835762
9	فيرغاز شفاط يعلق على	\N	فيرغاز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:49.235614
10	فاير غاز هايتك فرن	\N	فاير	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:49.37378
11	ماجيك فرن كهربائي بلت	\N	ماجيك	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:49.51346
12	فاير غاز هايتك ميكروويف	\N	فاير	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:49.620842
13	إل جي ثلاجة أربع	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:49.766062
14	إل جي جلاية 9	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:50.049853
15	إل جي نشافة سعة	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:50.186771
16	فيرغاز هايتك شفاط يعلق	\N	فيرغاز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:55.302169
4	فاير غاز هايتك طباخ	\N	فاير	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	3	2026-03-17 22:28:47.256782
5	فاير غاز فرن كهربائي	\N	فاير	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	12	2026-03-17 22:28:47.569053
3	إل جي غسالة سعة	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	3	2026-03-17 22:28:47.101038
1	iphone 15	\N	Apple	29	\N	\N	5	2026-03-17 22:02:13.833828
17	فاير غاز برولاين ميكروويف	\N	فاير	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:55.580331
18	مايديا فريزر 7 جوارير،	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:55.688053
19	إل جي ثلاجة إنستافيو	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:55.961344
21	ترست طباخ كهربائي سيراميك	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:56.209905
23	أف جي ثلاجة بلت	\N	أف	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:56.426633
24	أف جي فرن +	\N	أف	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:56.778493
25	هيتاشي ثلاجة أربع أبواب	\N	هيتاشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:56.99195
26	هوفر نشافة سعة 9	\N	هوفر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:57.137093
27	هوفر نشافة سعة 10	\N	هوفر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:57.290816
28	هومكس ثلاجة مكتب سعة	\N	هومكس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:28:57.583903
29	سامسونج فرن بلت إن	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:01.660332
30	بيكو ثلاجة أربع أبواب	\N	بيكو	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:01.774059
22	سامسونج نشافة سعة 9	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:28:56.316802
31	ساوتر فرن كهربائي بلت	\N	ساوتر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:01.910549
32	سامسونج غسالة سعة 9	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:02.022768
33	أف جي شفاط يعلق	\N	أف	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:02.269014
34	ساوتر طباخ غاز بلت	\N	ساوتر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:03.097883
35	هوفر جلاية 5 برامج،	\N	هوفر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:03.206861
36	هوفر جلاية 10 برامج،	\N	هوفر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:03.348024
37	بيكو ثلاجة بفريزر سفلي	\N	بيكو	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:03.453344
38	أف جي درج تسخين	\N	أف	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:03.702641
39	أف جي فريزر بلت	\N	أف	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:03.809243
40	سوتر فرن كهربائي بلت	\N	سوتر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:04.189865
41	سامسونج جلاية، 9 برامج،	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:04.333903
42	سامسونج ثلاجة سعة 530	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:08.685493
43	إل جي ثلاجة إنستافيو(MoodUp)	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:08.798858
44	إل جي ثلاجة فريزر	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:08.93753
46	سامسونج ثلاجة أربع أبواب	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:09.908999
47	فيرغاز برولاين شفاط يعلق	\N	فيرغاز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:10.065608
49	سامسونج جلاية، 11 برامج،	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:10.360001
50	غرونديغ ثلاجة بلت إن	\N	غرونديغ	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:10.574864
51	سامسونج ثلاجة سعة 470	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:10.933113
52	سامسونج جلاية بلت إن،	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:11.25748
53	سيمنز طباخ الحث المغناطيسي	\N	سيمنز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:11.379447
55	سيمنز جلاية بلت إن،	\N	سيمنز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:15.726971
56	سيمنز طباخ غاز بلت	\N	سيمنز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:16.091535
57	إل جي فريزر 7	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:16.309803
58	سامسونج ثلاجة Family Hub	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:16.445729
59	سامسونج ميكروويف بلت إن	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:16.55612
48	هوفر جلاية 8 برامج،	\N	هوفر	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:10.218223
60	سيمنز ثلاجة أربع أبواب	\N	سيمنز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:16.664306
61	سيمنز فرن كهربائي بلت	\N	سيمنز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:16.771623
62	إل جي تلفزيون QNED،	\N	إل	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:24.559122
63	سامسونج تلفزيون UHD فئة	\N	سامسونج	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:24.711617
65	إل جي تلفزيون OLED	\N	إل	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:26.176388
67	جي تي في تلفزيون	\N	جي	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:26.423392
68	تلفزيون إل جي NanoCell	\N	تلفزيون	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:31.274857
69	سامسونج تلفزيون Neo QLED	\N	سامسونج	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:31.409165
72	جي تي في سماعات	\N	جي	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.01369
73	أنكر باوربانك MagGo سعة	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.122774
66	سامسونج تلفزيون QLED فئة	\N	سامسونج	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	3	2026-03-17 22:29:26.314147
71	فيليبس تلفزيون UHD فئة	\N	فيليبس	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:31.628191
64	تي سي إل تلفزيون	\N	تي	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	4	2026-03-17 22:29:24.847402
74	أنكر شاحن باوربورت III	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.233252
75	أنكر كابل نايلون USB-C	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.343261
76	أبل محول طاقة USB-C	\N	أبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.452072
77	أنكر شاحن USB-C Nano	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.573595
79	آبل كابل (USB-C) 60	\N	آبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:35.901405
80	يوفي متعقب الذكي	\N	يوفي	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:36.008115
81	أنكر بنك طاقة Zolo	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:36.226005
82	أنكر شاحن سيارة USB-C	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:36.443446
83	أنكر باور بانك MagGO	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:36.553063
84	ساوندكور سماعات P40i مع	\N	ساوندكور	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:36.6619
85	أنكر بنك طاقة نانو	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:36.770356
86	أنكر بنك طاقة لاسلكي	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:37.109
87	ساوندكور سماعات أذن لاسلكية	\N	ساوندكور	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:37.434426
88	ساوندكور سماعات ليبرتي 4	\N	ساوندكور	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:37.543106
89	آبل كابل (USB-C) 40	\N	آبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:41.356488
90	أبل سماعات AirPods Pro	\N	أبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:41.475425
91	أنكر حامل مبايل للسيارة	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:41.580909
92	أنكر شاحن 1C B2B	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:41.688685
93	أنكر شاحن سيارة لاسلكي	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:41.90711
94	أنكر بنك طاقة بقدرة	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:42.340869
95	ساوندكور سماعات K20i اللاسلكية	\N	ساوندكور	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:42.559566
98	أنكر باور بانك ‎10000	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:43.11137
99	أنكر شاحن MagGo اللاسلكي	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:43.222973
100	أنكر شاحن ماج جو	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:43.333789
101	أنكر كابل USB-C بقدرة	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:43.45397
96	آبل سماعات ايربودز الجيل	\N	آبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:42.885121
103	ساوندكور سماعة رأس لاسلكية	\N	ساوندكور	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:43.901499
104	جي بي إل سماعة	\N	جي	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:47.480126
105	كاريرا طنجرة ضغط كهربائية	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:52.455749
106	مايديا ميكروويف سعة 31	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:52.601846
107	كاريرا مقلى هوائي 1400	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:52.748401
108	يونيفرسال شواية كهربائية 1700	\N	يونيفرسال	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:53.027123
109	كاريرا عجانة 800 واط،	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:53.304264
110	كاريرا عجانة 1100 واط،	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:53.417505
111	مايديا إبريق كهربائي 2200	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:53.551804
112	كوركماز ماكنة تحضير القهوة	\N	كوركماز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:53.662973
113	بيسيل مكنسة كهربائية بدون	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:53.935888
114	يونيفرسال مقلى هوائي 1800	\N	يونيفرسال	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.076825
115	إل جي ميكروويف سعة	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.218304
116	بيسيل شامبو بتركيبة متعددة	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.358259
117	مايديا ميكروويف مع شواية	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.47546
118	بيسيل شامبو سبوت اند	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.619492
119	إل جي مكنسة كهربائية	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.740754
120	مايديا ميكروويف سعة 24	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:54.989375
121	فيليبس خلاط سعة 1.9	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:55.138026
122	بيسيل مكنسة كهربائية برميل	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:55.246839
123	ترست مكواة بخار سيراميك	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:55.390989
124	مايديا ميكروويف سعة 20	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:29:55.512092
125	بيسيل جهاز تنظيف السجاد	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:02.308696
126	لافازا حبوب قهوة جوستو	\N	لافازا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:02.421012
127	ترست غلاية زجاج سعة	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:02.52837
128	مايديا مكنسة كهربائية برميل	\N	مايديا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:02.636088
129	فيليبس مكواة بخار 2800	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.018112
130	راسل هوبز مكواة بخار	\N	راسل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.129084
131	أوفراغاز فرن توستر مع	\N	أوفراغاز	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.250306
132	بيسيل مكنسة كهربائية للتنظيف	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.357127
133	فيليبس مكواة بخار 2400	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.465695
134	بيسيل مكنسة تنظيف متعدد	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.575071
135	لافازا حبوب قهوة كريما	\N	لافازا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.866642
136	فيليبس مكواة بخار ‎2000	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:03.979137
137	سامسونج مكنسة كهربائية روبوتية	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:04.219855
138	شّارك مكنسة كهربائية لاسلكية	\N	شّارك	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:04.475658
139	فيليبس أقراص إزالة الشحوم	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:05.125008
140	ترست مكواة بخار يدوية	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:10.910322
141	فيليبس سائل إزالة الترسبات	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.017181
142	ترست شامبو سجاد بسعة	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.128251
143	فيليبس فلتر مياه AquaClean،	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.238006
144	فيليبس خفاقة يدوية بقدرة	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.607129
145	ترست عجانة يدوية 250	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.71794
146	ترست عصارة حمضيات كهربائية	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.828029
147	فيليبس مكواة بخار 3000	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:11.933903
148	ترست طنجرة ضغط كهربائية	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.04736
149	فيليبس مكواة بخار، 2000	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.153701
150	ترست جهاز وافل 5	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.263861
151	بيسيل مكنسة كهربائية كروس	\N	بيسيل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.372181
152	ترست مفرمة لحم متعددة	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.507501
153	E-Plug عصارة حمضيات كهربائية	\N	E-Plug	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.72887
154	ترست ميزان مطبخ رقمي	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.838508
155	فيليبس مكواة بخار محمولة	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:12.946678
156	سيجافريدو كبسولات قهوة عدد	\N	سيجافريدو	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:13.056589
157	تراست غلاية، 1.7 لتر،	\N	تراست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:13.174125
158	ترست توستر ضغط 2000	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:13.286385
160	ترست خلاط 600 واط،	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:19.193916
161	ترست مقلى هوائي 1700	\N	ترست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-17 22:30:19.300068
166	اتش بي لاب توب	\N	اتش	31	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:04.167144
20	سامسونج ثلاجة سعة 600	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	2	2026-03-17 22:28:56.10318
164	اتش بي لابتوب Intel	\N	اتش	31	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:03.832082
165	إتش بي لابتوب ألعاب	\N	إتش	31	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:04.056343
168	أبل آيباد Air قياس	\N	أبل	32	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:07.698995
169	بلاكفيو تابلت ميجا 2	\N	بلاكفيو	32	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:07.810166
170	أبل آيباد قياس 10.2	\N	أبل	32	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:07.917606
167	اتش بي لابتوب Core	\N	اتش	31	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-18 00:16:04.275408
162	أبل آيفون 17 برو	\N	أبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	6	2026-03-18 00:15:58.535782
159	تراست غلاية، 1.5 لتر،	\N	تراست	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:30:13.514279
6	إل جي ثلاجة سعة	\N	إل	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	27	2026-03-17 22:28:48.270544
171	بلاكفيو تابلت تاب 60	\N	بلاكفيو	32	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:08.030021
172	سامسونج ثلاجة بابين جانبية	\N	سامسونج	16	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:54.986354
173	سامسونج ثلاجة بلت إن	\N	سامسونج	16	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:16:55.199595
174	فيليبس جهاز تمليس الشعر	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:45.009332
175	كامي مصفف شعر Multi	\N	كامي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:46.816241
176	كاريرا آلة ازالة الشعر	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:47.065003
177	كامي فرشاة شعر حرارية	\N	كامي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:47.172842
178	فيلبس جهاز تمليس الشعر	\N	فيلبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:48.794135
179	فيليبس ماكينة حلاقة ون	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:48.901074
180	كاريرا مموج شعر بدرجة	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:50.707678
181	فيليبس آلة إزالة الشعر	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:50.815033
182	سينسيكا جهاز إزالة الشعر	\N	سينسيكا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:52.603715
183	أورال-بي فرشاة أسنان كهربائية	\N	أورال-بي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:54.485378
184	فيليبس مجفف شعر 2300	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:17:59.062298
185	فيليبس جهاز تمويج الشعر	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:03.846811
186	فيلبس مجفف شعر 2100	\N	فيلبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:03.954614
187	تشي جهاز تصفيف الشعر	\N	تشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:04.059356
188	تشي جهاز تمليس الشعر	\N	تشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:05.992643
189	براون جهاز إزالة الشعر	\N	براون	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:07.912556
190	براون ماكينة حلاقة الشعر	\N	براون	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:09.439484
191	براون ماكينة حلاقة للجسم	\N	براون	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:11.059065
192	تشي مموج شعر بدرجة	\N	تشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:16.990322
193	فيليبس آلة ازالة الشعر	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:17.103449
195	فيليبس ماكينة حلاقة متعددة	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:20.568607
196	تشي فرشاة شعر حرارية	\N	تشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:25.138927
197	كاريرا مجفف شعر 2200	\N	كاريرا	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:25.246427
198	غرونديغ جهاز تمليس الشعر	\N	غرونديغ	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:26.895049
199	ماكينة حلاقة من فيليبس	\N	ماكينة	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:30.30579
202	شّارك مجفف شعر، 3	\N	شّارك	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:35.65506
203	ميدكس كير جهاز تدفق	\N	ميدكس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:37.86691
204	تشي مجفف شعر لافا	\N	تشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:39.531528
205	دريمي مجفف شعر غلوري	\N	دريمي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:44.709953
206	تشي مصفف الشعر لافا	\N	تشي	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:48.195443
207	اتش بي طابعة Smart	\N	اتش	56	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:53.180687
208	اتش بي طابعة ليزر	\N	اتش	56	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:53.296501
209	اتش بي طابعة OfficeJet	\N	اتش	56	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:53.405294
211	إيزو حامل جداري لجهاز	\N	إيزو	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:56.876145
212	سوني وحدة تحكم دوال	\N	سوني	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	0	2026-03-18 00:18:57.108462
201	فيليبس جهاز إزالة الشعر	\N	فيليبس	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	7	2026-03-18 00:18:32.084924
210	سوني بلايستيشن 5 إصدار	\N	سوني	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	2	2026-03-18 00:18:56.762406
70	سامسونج تلفزيون LED فئة	\N	سامسونج	34	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:31.519479
45	سامسونج غسالة سعة 11	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:09.533827
200	دايسون مصفف الشعر إيرراب	\N	دايسون	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-18 00:18:31.972336
163	آبل ايفون 15 سعة	\N	آبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	9	2026-03-18 00:15:59.290903
54	سامسونج غسالة مع نشافة	\N	سامسونج	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:11.486658
78	أنكر كابل USB-C إلى	\N	أنكر	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:35.678857
97	آبل كابل USB-C مغناطيسي	\N	آبل	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-17 22:29:43.006232
102	سامسونج جهاز موبايل جالاكسي	\N	سامسونج	29	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	93	2026-03-17 22:29:43.561599
194	براون ماكينة حلاقة Series	\N	براون	\N	\N	https://sbitany.comdata:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzAgMjcwIiB3aWR0aD0iMjcwIiBoZWlnaHQ9IjI3MCI+CiAgPHJlY3Qgd2lkdGg9IjI3MCIgaGVpZ2h0PSIyNzAiIGZpbGw9IiNGMUYxRjFGMSI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPiA8L3RleHQ+ICAgCjwvc3ZnPg==	1	2026-03-18 00:18:18.811111
\.


--
-- TOC entry 5315 (class 0 OID 16527)
-- Dependencies: 238
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url, created_at) FROM stdin;
9	30	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-460x460.jpg	2026-03-18 00:59:43.543104
10	30	https://sbitany.com/image/cache/catalog/R3-S10XTWE/02_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_FrontOpen-20251029102455-460x460.jpg	2026-03-18 00:59:43.543939
11	30	https://sbitany.com/image/cache/catalog/R3-S10XTWE/03_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Top_Left_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 00:59:43.544313
12	30	https://sbitany.com/image/cache/catalog/R3-S10XTWE/04_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Drum-20251029102455-460x460.jpg	2026-03-18 00:59:43.544601
13	30	https://sbitany.com/image/cache/catalog/R3-S10XTWE/05_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Front_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 00:59:43.545097
14	31	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 00:59:50.694985
15	31	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 00:59:50.695926
16	31	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 00:59:50.696561
17	31	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 00:59:50.697049
18	32	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 00:59:56.511323
19	32	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 00:59:56.511749
20	32	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 00:59:56.512055
21	32	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 00:59:56.512326
22	33	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-460x460.jpg	2026-03-18 01:00:11.532144
23	33	https://sbitany.com/image/cache/catalog/FGH-6952W/FGH-6952W(1)-2023121372946-460x460.jpg	2026-03-18 01:00:11.532852
24	33	https://sbitany.com/image/cache/catalog/107-170-0039-0057-20230803123521-270x270.jpg	2026-03-18 01:00:11.533188
25	34	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:00:17.460931
26	34	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:00:17.461565
27	34	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:00:17.46193
28	34	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:00:17.462241
29	35	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-460x460.jpg	2026-03-18 01:00:23.089319
30	35	https://sbitany.com/image/cache/catalog/R3-S10XTWE/02_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_FrontOpen-20251029102455-460x460.jpg	2026-03-18 01:00:23.089707
31	35	https://sbitany.com/image/cache/catalog/R3-S10XTWE/03_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Top_Left_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 01:00:23.090053
32	35	https://sbitany.com/image/cache/catalog/R3-S10XTWE/04_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Drum-20251029102455-460x460.jpg	2026-03-18 01:00:23.090334
33	35	https://sbitany.com/image/cache/catalog/R3-S10XTWE/05_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Front_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 01:00:23.090585
34	36	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-460x460.jpg	2026-03-18 01:00:28.718816
35	36	https://sbitany.com/image/cache/catalog/R3-S10XTWE/02_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_FrontOpen-20251029102455-460x460.jpg	2026-03-18 01:00:28.71942
36	36	https://sbitany.com/image/cache/catalog/R3-S10XTWE/03_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Top_Left_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 01:00:28.720009
37	36	https://sbitany.com/image/cache/catalog/R3-S10XTWE/04_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Drum-20251029102455-460x460.jpg	2026-03-18 01:00:28.72073
38	36	https://sbitany.com/image/cache/catalog/R3-S10XTWE/05_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Front_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 01:00:28.721591
39	37	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:00:34.494
40	37	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:00:34.494257
41	37	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:00:34.494449
42	37	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:00:34.494662
43	38	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:00:42.089845
44	38	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:42.090214
45	38	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:42.090477
46	38	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:42.090678
47	38	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:42.090867
48	39	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:00:47.866953
49	39	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:47.867473
50	39	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:47.867791
51	39	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:47.868012
52	39	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:00:47.868316
53	40	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:00:58.164336
54	40	https://sbitany.com/image/cache/catalog/107-231-0054-0012-20210316215021-460x460.jpg	2026-03-18 01:00:58.164934
55	40	https://sbitany.com/image/cache/catalog/24975/Detail_1-2022042064936-460x460.jpg	2026-03-18 01:00:58.165191
56	40	https://sbitany.com/image/cache/catalog/24975/Detail_2-2022042063554-460x460.jpg	2026-03-18 01:00:58.165405
57	40	https://sbitany.com/image/cache/catalog/24975/Amb_2-2022042064928-460x460.jpg	2026-03-18 01:00:58.16564
58	41	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-460x460.jpg	2026-03-18 01:01:06.495795
59	41	https://sbitany.com/image/cache/catalog/MB-9877AF/Screenshot2024-01-04120030-2024010495622-460x460.jpg	2026-03-18 01:01:06.496141
60	41	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-270x270.jpg	2026-03-18 01:01:06.496926
61	41	https://sbitany.com/image/cache/catalog/107-071-2667-0004-20240102144531-270x270.jpg	2026-03-18 01:01:06.497126
62	41	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:01:06.497302
63	42	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-460x460.jpg	2026-03-18 01:01:12.216323
64	42	https://sbitany.com/image/cache/catalog/R3-S10XTWE/02_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_FrontOpen-20251029102455-460x460.jpg	2026-03-18 01:01:12.216742
65	42	https://sbitany.com/image/cache/catalog/R3-S10XTWE/03_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Top_Left_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 01:01:12.217091
66	42	https://sbitany.com/image/cache/catalog/R3-S10XTWE/04_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Drum-20251029102455-460x460.jpg	2026-03-18 01:01:12.217485
67	42	https://sbitany.com/image/cache/catalog/R3-S10XTWE/05_Vivace_R700_10kg_Platinum_VCM_F4Y7RYPYP_R3-S10XTWE_YK_Front_Panel_Detail-20251029102455-460x460.jpg	2026-03-18 01:01:12.218028
68	43	https://sbitany.com/image/cache/catalog/107-170-0039-0056-20230803123521-460x460.jpg	2026-03-18 01:01:19.20009
69	43	https://sbitany.com/image/cache/catalog/FG-SH906X/FG-SH906X-2023121275842-460x460.png	2026-03-18 01:01:19.200891
70	43	https://sbitany.com/image/cache/catalog/43882/107-171-0035-0050-20220914111922-270x270.jpg	2026-03-18 01:01:19.201951
71	43	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	2026-03-18 01:01:19.202218
72	44	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:01:25.181863
73	44	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:01:25.182204
74	44	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:01:25.182588
75	44	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:01:25.182814
76	45	https://sbitany.com/image/cache/catalog/107-235-0054-0229-2021031772458-460x460.jpg	2026-03-18 01:01:32.007147
77	45	https://sbitany.com/image/cache/catalog/MG-OBI6080S-20220313141305-460x460.jpg	2026-03-18 01:01:32.007319
78	45	https://sbitany.com/image/cache/catalog/107-170-0039-0057-20230803123521-270x270.jpg	2026-03-18 01:01:32.00749
79	45	https://sbitany.com/image/cache/catalog/107-171-0035-0054-20230315134947-270x270.jpg	2026-03-18 01:01:32.007643
80	46	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:01:37.646582
81	46	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:01:37.646817
82	46	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:01:37.647001
83	46	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:01:37.64717
84	47	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:01:43.349395
85	47	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:01:43.350327
86	47	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:01:43.351018
87	47	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:01:43.351508
88	47	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:01:43.351945
89	48	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-460x460.jpg	2026-03-18 01:01:48.954388
90	48	https://sbitany.com/image/cache/catalog/MB-9877AF/Screenshot2024-01-04120030-2024010495622-460x460.jpg	2026-03-18 01:01:48.955142
91	48	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-270x270.jpg	2026-03-18 01:01:48.95575
92	48	https://sbitany.com/image/cache/catalog/107-071-2667-0004-20240102144531-270x270.jpg	2026-03-18 01:01:48.956234
93	48	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:01:48.95665
94	49	https://sbitany.com/image/cache/catalog/107-230-0015-0015-2024101060644-460x460.jpg	2026-03-18 01:01:55.635527
95	49	https://sbitany.com/image/cache/catalog/107-230-0060-0132-2024061072930-270x270.jpg	2026-03-18 01:01:55.636298
96	50	https://sbitany.com/image/cache/catalog/107-230-0017-0019-20240609125742-460x460.jpg	2026-03-18 01:02:05.875704
97	50	https://sbitany.com/image/cache/catalog/VH2-B9B/71AbxbUvvIL-20251029140723-460x460.jpg	2026-03-18 01:02:05.876467
98	50	https://sbitany.com/image/cache/catalog/VH2-B9B/71XMXujplyL-20251029140723-460x460.jpg	2026-03-18 01:02:05.876731
99	50	https://sbitany.com/image/cache/catalog/VH2-B9B/81aei80Q9yL-20251029140723-460x460.jpg	2026-03-18 01:02:05.877204
100	50	https://sbitany.com/image/cache/catalog/VH2-B9B/81jFgUC-cbL-20251029140723-460x460.jpg	2026-03-18 01:02:05.877559
101	51	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-460x460.jpg	2026-03-18 01:02:11.501037
102	51	https://sbitany.com/image/cache/catalog/FGH-6952W/FGH-6952W(1)-2023121372946-460x460.jpg	2026-03-18 01:02:11.501459
103	51	https://sbitany.com/image/cache/catalog/107-170-0039-0057-20230803123521-270x270.jpg	2026-03-18 01:02:11.501747
104	52	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:02:17.288986
105	52	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:02:17.289217
106	52	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:02:17.289399
107	52	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:02:17.289571
108	53	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:02:22.909243
109	53	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:02:22.909593
110	53	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:02:22.909909
111	53	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:02:22.910225
112	53	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:02:22.910439
113	54	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:02:28.446313
114	54	https://sbitany.com/image/cache/catalog/107-231-0054-0012-20210316215021-460x460.jpg	2026-03-18 01:02:28.446594
115	54	https://sbitany.com/image/cache/catalog/24975/Detail_1-2022042064936-460x460.jpg	2026-03-18 01:02:28.446874
116	54	https://sbitany.com/image/cache/catalog/24975/Detail_2-2022042063554-460x460.jpg	2026-03-18 01:02:28.44715
117	54	https://sbitany.com/image/cache/catalog/24975/Amb_2-2022042064928-460x460.jpg	2026-03-18 01:02:28.447362
118	55	https://sbitany.com/image/cache/catalog/107-171-0039-0021-2021060870600-460x460.jpg	2026-03-18 01:02:35.434145
119	55	https://sbitany.com/image/cache/catalog/FGH-9990HG-20220313134700-460x460.jpg	2026-03-18 01:02:35.434428
120	55	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	2026-03-18 01:02:35.434638
121	55	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	2026-03-18 01:02:35.434985
122	56	https://sbitany.com/image/cache/catalog/107-171-0039-0021-2021060870600-460x460.jpg	2026-03-18 01:02:40.950507
123	56	https://sbitany.com/image/cache/catalog/FGH-9990HG-20220313134700-460x460.jpg	2026-03-18 01:02:40.950782
124	56	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	2026-03-18 01:02:40.950971
125	56	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	2026-03-18 01:02:40.951166
126	57	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-460x460.jpg	2026-03-18 01:02:46.440729
127	57	https://sbitany.com/image/cache/catalog/MB-9877AF/Screenshot2024-01-04120030-2024010495622-460x460.jpg	2026-03-18 01:02:46.441364
128	57	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-270x270.jpg	2026-03-18 01:02:46.441829
129	57	https://sbitany.com/image/cache/catalog/107-071-2667-0004-20240102144531-270x270.jpg	2026-03-18 01:02:46.442256
130	57	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:02:46.442646
131	58	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-460x460.jpg	2026-03-18 01:02:55.16017
132	59	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:03:00.949126
133	59	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:00.949916
134	59	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:00.950642
135	59	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:00.951265
136	59	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:00.951868
137	60	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:03:09.724457
138	60	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:09.724728
139	60	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:09.724925
140	60	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:09.725098
141	60	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:09.725307
142	61	https://sbitany.com/image/cache/catalog/107-634-0060-0005-2025031282133-460x460.jpg	2026-03-18 01:03:16.918724
143	61	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi-2025031282235-460x460.png	2026-03-18 01:03:16.919244
144	61	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(2)-2025031282235-460x460.png	2026-03-18 01:03:16.919456
145	61	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(3)-2025031282235-460x460.png	2026-03-18 01:03:16.919632
146	61	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(4)-2025031282235-460x460.png	2026-03-18 01:03:16.919806
147	62	https://sbitany.com/image/cache/catalog/113-251-2654-0001-20240820125042-460x460.jpg	2026-03-18 01:03:23.960703
148	62	https://sbitany.com/image/cache/catalog/210-02920/download-2024-08-20T154802.952-20240820125200-460x460.png	2026-03-18 01:03:23.961083
149	63	https://sbitany.com/image/cache/catalog/107-634-1378-0001-20251125114055-460x460.jpg	2026-03-18 01:03:30.742279
150	63	https://sbitany.com/image/cache/catalog/DV90DG52A0AB/download-2025-11-27T150808.738-20251127131101-460x460.png	2026-03-18 01:03:30.742662
151	63	https://sbitany.com/image/cache/catalog/DV90DG52A0AB/download-2025-11-27T150812.757-20251127131101-460x460.png	2026-03-18 01:03:30.742991
152	63	https://sbitany.com/image/cache/catalog/DV90DG52A0AB/download-2025-11-27T150816.260-20251127131101-460x460.png	2026-03-18 01:03:30.743285
153	63	https://sbitany.com/image/cache/catalog/107-634-0073-0005-2025080395528-270x270.jpg	2026-03-18 01:03:30.743533
154	64	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-460x460.jpg	2026-03-18 01:03:37.683831
155	64	https://sbitany.com/image/cache/catalog/RF2761BIL-2022080781413-460x460.jpg	2026-03-18 01:03:37.684372
156	64	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:03:37.684825
157	65	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-460x460.jpg	2026-03-18 01:03:43.270173
158	65	https://sbitany.com/image/cache/catalog/RF2761BIL-2022080781413-460x460.jpg	2026-03-18 01:03:43.270492
159	65	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:03:43.270763
160	66	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:03:48.977121
161	66	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:48.977504
162	66	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:48.977804
163	66	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:48.978078
164	66	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:03:48.978336
165	67	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-460x460.jpg	2026-03-18 01:03:55.916857
166	67	https://sbitany.com/image/cache/catalog/FG-4510MW-20231206130830-460x460.jpg	2026-03-18 01:03:55.917098
167	67	https://sbitany.com/image/cache/catalog/FG-4510MW-1-20231206130830-460x460.jpg	2026-03-18 01:03:55.91729
168	67	https://sbitany.com/image/cache/catalog/107-214-2667-0004-20230517101938-460x460.jpg	2026-03-18 01:03:55.91746
169	67	https://sbitany.com/image/cache/catalog/107-214-2575-0001-20230517101938-270x270.jpg	2026-03-18 01:03:55.91762
170	68	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-460x460.jpg	2026-03-18 01:04:01.521171
171	68	https://sbitany.com/image/cache/catalog/MB-9877AF/Screenshot2024-01-04120030-2024010495622-460x460.jpg	2026-03-18 01:04:01.522211
172	68	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-270x270.jpg	2026-03-18 01:04:01.522795
173	68	https://sbitany.com/image/cache/catalog/107-071-2667-0004-20240102144531-270x270.jpg	2026-03-18 01:04:01.523221
174	68	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:04:01.523462
175	69	https://sbitany.com/image/cache/catalog/107-650-0060-0001-2025061572758-460x460.jpg	2026-03-18 01:04:08.656971
176	69	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-d748c-398033-20250529121226-460x460.jpg	2026-03-18 01:04:08.657861
177	69	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-f7594-398033-20250529121226-460x460.jpg	2026-03-18 01:04:08.658312
178	69	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-5dfa9-398033-20250529121226-460x460.jpg	2026-03-18 01:04:08.658723
179	69	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-7e632-398033-20250529121226-460x460.jpg	2026-03-18 01:04:08.659175
180	70	https://sbitany.com/image/cache/catalog/107-201-0017-0007-2026020381944-460x460.jpg	2026-03-18 01:04:18.692919
181	70	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(13)-20260203111636-460x460.png	2026-03-18 01:04:18.69364
182	70	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(14)-20260203111636-460x460.png	2026-03-18 01:04:18.693856
183	70	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(15)-20260203111636-460x460.png	2026-03-18 01:04:18.694158
184	70	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(16)-20260203111636-460x460.png	2026-03-18 01:04:18.694372
185	71	https://sbitany.com/image/cache/catalog/107-201-0017-0007-2026020381944-460x460.jpg	2026-03-18 01:04:24.283364
186	71	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(13)-20260203111636-460x460.png	2026-03-18 01:04:24.283867
187	71	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(14)-20260203111636-460x460.png	2026-03-18 01:04:24.284238
188	71	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(15)-20260203111636-460x460.png	2026-03-18 01:04:24.284589
189	71	https://sbitany.com/image/cache/catalog/HLE%20C9DRGR-80/download(16)-20260203111636-460x460.png	2026-03-18 01:04:24.284856
190	72	https://sbitany.com/image/cache/catalog/107-280-0060-0002-20240815100416-460x460.jpg	2026-03-18 01:04:30.946409
191	73	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-460x460.jpg	2026-03-18 01:04:36.600996
192	73	https://sbitany.com/image/cache/catalog/FG-4510MW-20231206130830-460x460.jpg	2026-03-18 01:04:36.601391
193	73	https://sbitany.com/image/cache/catalog/FG-4510MW-1-20231206130830-460x460.jpg	2026-03-18 01:04:36.601732
194	73	https://sbitany.com/image/cache/catalog/107-214-2667-0004-20230517101938-460x460.jpg	2026-03-18 01:04:36.602194
195	73	https://sbitany.com/image/cache/catalog/107-214-2575-0001-20230517101938-270x270.jpg	2026-03-18 01:04:36.60262
196	74	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-460x460.jpg	2026-03-18 01:04:43.778244
197	74	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(1)-20251028143831-460x460.png	2026-03-18 01:04:43.778578
198	74	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(2)-20251028143831-460x460.png	2026-03-18 01:04:43.778898
199	74	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(3)-20251028143831-460x460.png	2026-03-18 01:04:43.77917
200	74	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(4)-20251028143831-460x460.png	2026-03-18 01:04:43.779394
201	75	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:04:50.839725
202	75	https://sbitany.com/image/cache/catalog/107-127-0060-1617-20260115120937-460x460.jpg	2026-03-18 01:04:50.840058
203	75	https://sbitany.com/image/cache/catalog/GN1508XPP/7299447233_MDM2_LOW_2-2026021890746-460x460.png	2026-03-18 01:04:50.840316
204	75	https://sbitany.com/image/cache/catalog/GN1508XPP/7299447233_MDM2_LOW_3-2026021890746-460x460.png	2026-03-18 01:04:50.840562
205	75	https://sbitany.com/image/cache/catalog/GN1508XPP/7299447233_MDM2_LOW_4-2026021890746-460x460.png	2026-03-18 01:04:50.840836
206	76	https://sbitany.com/image/cache/catalog/107-467-2580-0001-20240820125042-460x460.jpg	2026-03-18 01:04:57.73078
207	76	https://sbitany.com/image/cache/catalog/107-467-0035-0011-2025091582144-270x270.jpg	2026-03-18 01:04:57.731416
208	77	https://sbitany.com/image/cache/catalog/107-634-0073-0006-2025091582144-460x460.jpg	2026-03-18 01:05:04.93031
209	77	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_11_1752579913_35357_XL-2025090194246-460x460.png	2026-03-18 01:05:04.930588
210	77	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_12_1752579915_188566_XL-2025090194246-460x460.png	2026-03-18 01:05:04.930875
211	77	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_13_1752579918_584420_XL-2025090194246-460x460.png	2026-03-18 01:05:04.93126
212	77	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_14_1752579920_919309_XL-2025090194246-460x460.png	2026-03-18 01:05:04.931439
213	78	https://sbitany.com/image/cache/catalog/107-650-0060-0001-2025061572758-460x460.jpg	2026-03-18 01:05:10.517251
214	78	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-d748c-398033-20250529121226-460x460.jpg	2026-03-18 01:05:10.51787
215	78	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-f7594-398033-20250529121226-460x460.jpg	2026-03-18 01:05:10.518464
216	78	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-5dfa9-398033-20250529121226-460x460.jpg	2026-03-18 01:05:10.518994
217	78	https://sbitany.com/image/cache/catalog/R-WB640VRS1-P%20GBK/HITACHI_R_WB640V0PB_GBK_Top_Mount_Refrig-Hitachi-7e632-398033-20250529121226-460x460.jpg	2026-03-18 01:05:10.519519
218	79	https://sbitany.com/image/cache/catalog/107-214-0039-0004-20240415135037-460x460.jpg	2026-03-18 01:05:17.422022
219	79	https://sbitany.com/image/cache/catalog/FG-HB1190B/Picture5-2024041582821-460x460.png	2026-03-18 01:05:17.423391
220	79	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:05:17.424012
221	80	https://sbitany.com/image/cache/catalog/107-467-2580-0001-20240820125042-460x460.jpg	2026-03-18 01:05:26.314971
222	80	https://sbitany.com/image/cache/catalog/107-467-0035-0011-2025091582144-270x270.jpg	2026-03-18 01:05:26.315455
223	81	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:05:32.029078
224	81	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:05:32.029616
225	81	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:05:32.030268
226	81	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:05:32.030734
227	81	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:05:32.031225
228	82	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:05:37.967706
229	82	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:05:37.96797
230	82	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:05:37.968163
231	82	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:05:37.96843
232	83	https://sbitany.com/image/cache/catalog/113-251-2654-0001-20240820125042-460x460.jpg	2026-03-18 01:05:43.61092
233	83	https://sbitany.com/image/cache/catalog/210-02920/download-2024-08-20T154802.952-20240820125200-460x460.png	2026-03-18 01:05:43.611424
234	84	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-460x460.jpg	2026-03-18 01:05:49.15345
235	84	https://sbitany.com/image/cache/catalog/MB-9877AF/Screenshot2024-01-04120030-2024010495622-460x460.jpg	2026-03-18 01:05:49.153815
236	84	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-270x270.jpg	2026-03-18 01:05:49.154011
237	84	https://sbitany.com/image/cache/catalog/107-071-2667-0004-20240102144531-270x270.jpg	2026-03-18 01:05:49.154179
238	84	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:05:49.154338
239	85	https://sbitany.com/image/cache/catalog/107-467-0035-0009-20250326121748-460x460.jpg	2026-03-18 01:05:56.159451
240	86	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-460x460.jpg	2026-03-18 01:06:05.019073
241	87	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-460x460.jpg	2026-03-18 01:06:12.881645
242	88	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:06:20.428561
243	88	https://sbitany.com/image/cache/catalog/107-127-0060-1612-20251027135415-460x460.jpg	2026-03-18 01:06:20.428962
244	88	https://sbitany.com/image/cache/catalog/RCNE592PB/7291647235_MDM2_HIGH_2-20251027143044-460x460.jpg	2026-03-18 01:06:20.429379
245	88	https://sbitany.com/image/cache/catalog/RCNE592PB/7291647235_MDM2_HIGH_3-20251027143007-460x460.jpg	2026-03-18 01:06:20.429826
246	88	https://sbitany.com/image/cache/catalog/RCNE592PB/7291647235_MDM2_LOW_4-20251027142718-460x460.png	2026-03-18 01:06:20.430176
247	89	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-460x460.jpg	2026-03-18 01:06:25.940475
248	89	https://sbitany.com/image/cache/catalog/RF2761BIL-2022080781413-460x460.jpg	2026-03-18 01:06:25.940765
249	89	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:06:25.941031
250	90	https://sbitany.com/image/cache/catalog/107-214-2575-0001-20230517101938-460x460.jpg	2026-03-18 01:06:36.122943
251	90	https://sbitany.com/image/cache/catalog/FG-15WD-2023120785741-460x460.jpg	2026-03-18 01:06:36.123722
252	90	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-460x460.jpg	2026-03-18 01:06:36.124007
253	90	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:06:36.124309
254	90	https://sbitany.com/image/cache/catalog/107-242-2667-0001-2024013065459-270x270.jpg	2026-03-18 01:06:36.124584
255	91	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-460x460.jpg	2026-03-18 01:06:41.830794
256	91	https://sbitany.com/image/cache/catalog/RF2761BIL-2022080781413-460x460.jpg	2026-03-18 01:06:41.831114
257	91	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:06:41.83137
258	92	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:06:47.346295
259	92	https://sbitany.com/image/cache/catalog/107-127-0060-1617-20260115120937-460x460.jpg	2026-03-18 01:06:47.346669
260	92	https://sbitany.com/image/cache/catalog/GN1508XPP/7299447233_MDM2_LOW_2-2026021890746-460x460.png	2026-03-18 01:06:47.346867
261	92	https://sbitany.com/image/cache/catalog/GN1508XPP/7299447233_MDM2_LOW_3-2026021890746-460x460.png	2026-03-18 01:06:47.34705
262	92	https://sbitany.com/image/cache/catalog/GN1508XPP/7299447233_MDM2_LOW_4-2026021890746-460x460.png	2026-03-18 01:06:47.347224
263	93	https://sbitany.com/image/cache/catalog/107-467-2667-0006-20260115120937-460x460.jpg	2026-03-18 01:06:54.233094
264	94	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:07:02.975246
265	94	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-460x460.jpg	2026-03-18 01:07:02.975605
266	94	https://sbitany.com/image/cache/catalog/MD-MWO3192X/MD-MWO3192Xproductphotos-20230116105207-460x460.jpg	2026-03-18 01:07:02.976122
267	94	https://sbitany.com/image/cache/catalog/107-242-1688-0011-2024120574029-270x270.jpg	2026-03-18 01:07:02.976438
268	95	https://sbitany.com/image/cache/catalog/107-634-0060-0005-2025031282133-460x460.jpg	2026-03-18 01:07:08.731084
269	95	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi-2025031282235-460x460.png	2026-03-18 01:07:08.731375
270	95	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(2)-2025031282235-460x460.png	2026-03-18 01:07:08.73158
271	95	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(3)-2025031282235-460x460.png	2026-03-18 01:07:08.731753
272	95	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(4)-2025031282235-460x460.png	2026-03-18 01:07:08.731914
273	96	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:07:14.489443
274	96	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:14.489685
275	96	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:14.489927
276	96	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:14.490203
277	96	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:14.490473
278	97	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:07:20.212702
279	97	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:20.213013
280	97	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:20.213362
281	97	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:20.213653
282	97	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:07:20.213884
283	98	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-460x460.jpg	2026-03-18 01:07:25.741272
284	98	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(1)-20251028143831-460x460.png	2026-03-18 01:07:25.741576
285	98	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(2)-20251028143831-460x460.png	2026-03-18 01:07:25.741775
286	98	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(3)-20251028143831-460x460.png	2026-03-18 01:07:25.741944
287	98	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(4)-20251028143831-460x460.png	2026-03-18 01:07:25.742106
288	99	https://sbitany.com/image/cache/catalog/107-170-0039-0056-20230803123521-460x460.jpg	2026-03-18 01:07:31.533788
289	99	https://sbitany.com/image/cache/catalog/FG-SH906X/FG-SH906X-2023121275842-460x460.png	2026-03-18 01:07:31.534162
290	99	https://sbitany.com/image/cache/catalog/43882/107-171-0035-0050-20220914111922-270x270.jpg	2026-03-18 01:07:31.534518
291	99	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	2026-03-18 01:07:31.534797
292	100	https://sbitany.com/image/cache/catalog/107-214-2575-0001-20230517101938-460x460.jpg	2026-03-18 01:07:40.43854
293	100	https://sbitany.com/image/cache/catalog/FG-15WD-2023120785741-460x460.jpg	2026-03-18 01:07:40.43886
294	100	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-460x460.jpg	2026-03-18 01:07:40.4391
295	100	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:07:40.439332
296	100	https://sbitany.com/image/cache/catalog/107-242-2667-0001-2024013065459-270x270.jpg	2026-03-18 01:07:40.439546
297	101	https://sbitany.com/image/cache/catalog/107-214-0039-0004-20240415135037-460x460.jpg	2026-03-18 01:07:46.304715
298	101	https://sbitany.com/image/cache/catalog/FG-HB1190B/Picture5-2024041582821-460x460.png	2026-03-18 01:07:46.305113
299	101	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:07:46.305356
300	102	https://sbitany.com/image/cache/catalog/107-634-0073-0006-2025091582144-460x460.jpg	2026-03-18 01:07:51.913672
301	102	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_11_1752579913_35357_XL-2025090194246-460x460.png	2026-03-18 01:07:51.913894
302	102	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_12_1752579915_188566_XL-2025090194246-460x460.png	2026-03-18 01:07:51.914066
303	102	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_13_1752579918_584420_XL-2025090194246-460x460.png	2026-03-18 01:07:51.914226
304	102	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_14_1752579920_919309_XL-2025090194246-460x460.png	2026-03-18 01:07:51.91438
305	103	https://sbitany.com/image/cache/catalog/107-171-0039-0021-2021060870600-460x460.jpg	2026-03-18 01:07:57.695236
306	103	https://sbitany.com/image/cache/catalog/FGH-9990HG-20220313134700-460x460.jpg	2026-03-18 01:07:57.695483
307	103	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	2026-03-18 01:07:57.695722
308	103	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	2026-03-18 01:07:57.695908
309	104	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-460x460.jpg	2026-03-18 01:08:03.691396
310	104	https://sbitany.com/image/cache/catalog/FGH-9710S/FGH-9710S-2023121372442-460x460.jpg	2026-03-18 01:08:03.691804
311	104	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:08:03.692113
312	104	https://sbitany.com/image/cache/catalog/FGH-9844WG-2021060763452-270x270.jpg	2026-03-18 01:08:03.692402
313	105	https://sbitany.com/image/cache/catalog/107-634-0060-0004-2025080395528-460x460.jpg	2026-03-18 01:08:10.906681
314	105	https://sbitany.com/image/cache/catalog/RF59C70TESLML/ps-french-door-autofill-water-pi(1)-20251028144239-460x460.png	2026-03-18 01:08:10.907029
315	105	https://sbitany.com/image/cache/catalog/RF59C70TESLML/ps-french-door-autofill-water-pi(2)-20251028144239-460x460.png	2026-03-18 01:08:10.907273
316	105	https://sbitany.com/image/cache/catalog/RF59C70TESLML/ps-french-door-autofill-water-pi(3)-20251028144239-460x460.png	2026-03-18 01:08:10.907632
317	105	https://sbitany.com/image/cache/catalog/RF59C70TESLML/ps-french-door-autofill-water-pi(4)-20251028144239-460x460.png	2026-03-18 01:08:10.907947
318	106	https://sbitany.com/image/cache/catalog/107-071-0039-0005-20220627123600-460x460.jpg	2026-03-18 01:08:17.893901
319	106	https://sbitany.com/image/cache/catalog/MB-H6299I-2022080780919-460x460.jpg	2026-03-18 01:08:17.894336
320	107	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:08:26.17203
321	107	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-460x460.jpg	2026-03-18 01:08:26.172325
322	108	https://sbitany.com/image/cache/catalog/105-251-0034-0014-20231024132718-460x460.jpg	2026-03-18 01:08:35.771198
323	109	https://sbitany.com/image/cache/catalog/107-467-0035-0009-20250326121748-460x460.jpg	2026-03-18 01:08:41.430738
324	110	https://sbitany.com/image/cache/catalog/107-191-0060-0001-2023070261809-460x460.jpg	2026-03-18 01:08:58.079293
325	110	https://sbitany.com/image/cache/catalog/GKNI56930FN/GKNI56930FN-2023121293023-460x460.jpg	2026-03-18 01:08:58.080033
326	110	https://sbitany.com/image/cache/catalog/GKNI56930FN/GKNI56930FN-2000X2000-shelfs-1-2-2023121293012-460x460.png	2026-03-18 01:08:58.080346
327	110	https://sbitany.com/image/cache/catalog/GKNI56930FN/GKNI56930FN-2000X2000-inside-1-2-2023121293012-460x460.png	2026-03-18 01:08:58.080623
328	110	https://sbitany.com/image/cache/catalog/GKNI56930FN/GKNI56930FN-2000X2000-front3-1-2-2023121293012-460x460.png	2026-03-18 01:08:58.080886
329	111	https://sbitany.com/image/cache/catalog/107-214-0039-0004-20240415135037-460x460.jpg	2026-03-18 01:09:03.55181
330	111	https://sbitany.com/image/cache/catalog/FG-HB1190B/Picture5-2024041582821-460x460.png	2026-03-18 01:09:03.552352
331	111	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	2026-03-18 01:09:03.552713
332	112	https://sbitany.com/image/cache/catalog/107-071-0039-0005-20220627123600-460x460.jpg	2026-03-18 01:09:09.074381
333	112	https://sbitany.com/image/cache/catalog/MB-H6299I-2022080780919-460x460.jpg	2026-03-18 01:09:09.07455
334	113	https://sbitany.com/image/cache/catalog/107-634-0060-0005-2025031282133-460x460.jpg	2026-03-18 01:09:14.69346
335	113	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi-2025031282235-460x460.png	2026-03-18 01:09:14.693761
336	113	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(2)-2025031282235-460x460.png	2026-03-18 01:09:14.694185
337	113	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(3)-2025031282235-460x460.png	2026-03-18 01:09:14.694497
338	113	https://sbitany.com/image/cache/catalog/RT58K7004SLPS/ps-rt7000k-top-freezer-with--twi(4)-2025031282235-460x460.png	2026-03-18 01:09:14.694728
339	114	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-460x460.jpg	2026-03-18 01:09:20.195724
340	114	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(1)-20251028143831-460x460.png	2026-03-18 01:09:20.196125
341	114	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(2)-20251028143831-460x460.png	2026-03-18 01:09:20.19637
342	114	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(3)-20251028143831-460x460.png	2026-03-18 01:09:20.196593
343	114	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(4)-20251028143831-460x460.png	2026-03-18 01:09:20.196878
344	115	https://sbitany.com/image/cache/catalog/107-634-0073-0006-2025091582144-460x460.jpg	2026-03-18 01:09:25.703312
345	115	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_11_1752579913_35357_XL-2025090194246-460x460.png	2026-03-18 01:09:25.70358
346	115	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_12_1752579915_188566_XL-2025090194246-460x460.png	2026-03-18 01:09:25.70405
347	115	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_13_1752579918_584420_XL-2025090194246-460x460.png	2026-03-18 01:09:25.704285
348	115	https://sbitany.com/image/cache/catalog/WW90DG6U95LBPS/imgi_14_1752579920_919309_XL-2025090194246-460x460.png	2026-03-18 01:09:25.704507
349	116	https://sbitany.com/image/cache/catalog/107-634-0015-0003-2025080395528-460x460.jpg	2026-03-18 01:09:32.932177
350	116	https://sbitany.com/image/cache/catalog/DW60BG750B00ML/download(74)-2025102971309-460x460.png	2026-03-18 01:09:32.932552
351	116	https://sbitany.com/image/cache/catalog/DW60BG750B00ML/download(75)-2025102971309-460x460.png	2026-03-18 01:09:32.932832
352	116	https://sbitany.com/image/cache/catalog/DW60BG750B00ML/imgi_26_ps-dw7700dw60bg750b00mk-dw60bg750b00ml-546078037-2025102971159-460x460.jpg	2026-03-18 01:09:32.933074
353	116	https://sbitany.com/image/cache/catalog/DW60BG750B00ML/imgi_27_ps-dw7700dw60bg750b00mk-dw60bg750b00ml-546078038-2025102971159-460x460.jpg	2026-03-18 01:09:32.933281
354	117	https://sbitany.com/image/cache/catalog/107-285-0035-0001-2025091582144-460x460.jpg	2026-03-18 01:09:40.16783
355	117	https://sbitany.com/image/cache/catalog/EX875LYV1E/download(32)-2025091684042-460x460.png	2026-03-18 01:09:40.168126
356	117	https://sbitany.com/image/cache/catalog/EX875LYV1E/download(33)-2025091684042-460x460.png	2026-03-18 01:09:40.168335
357	117	https://sbitany.com/image/cache/catalog/EX875LYV1E/download(34)-2025091684042-460x460.png	2026-03-18 01:09:40.168505
358	117	https://sbitany.com/image/cache/catalog/EX875LYV1E/download(35)-2025091684042-460x460.png	2026-03-18 01:09:40.16866
359	118	https://sbitany.com/image/cache/catalog/107-285-0015-0002-20260311120355-460x460.jpg	2026-03-18 01:09:47.370634
360	118	https://sbitany.com/image/cache/catalog/SN63EX04ME/19721543_A02_INB_PGA8_def-2026031583104-460x460.jpg	2026-03-18 01:09:47.370964
361	118	https://sbitany.com/image/cache/catalog/SN63EX04ME/19971577_A02_CD10_PGA6_def-2026031583104-460x460.jpg	2026-03-18 01:09:47.371236
362	118	https://sbitany.com/image/cache/catalog/SN63EX04ME/20637629_UR4261_SPR_DGDG_2FL_2PK-2026031583104-460x460.jpg	2026-03-18 01:09:47.371496
363	118	https://sbitany.com/image/cache/catalog/SN63EX04ME/20641002_LR4262_SPR_DGDG_2LR_16-2026031583104-460x460.jpg	2026-03-18 01:09:47.37174
364	119	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-460x460.jpg	2026-03-18 01:09:53.222379
365	119	https://sbitany.com/image/cache/catalog/MB-9877AF/Screenshot2024-01-04120030-2024010495622-460x460.jpg	2026-03-18 01:09:53.222664
366	119	https://sbitany.com/image/cache/catalog/107-214-2575-0002-20230517101938-270x270.jpg	2026-03-18 01:09:53.222912
367	119	https://sbitany.com/image/cache/catalog/107-071-2667-0004-20240102144531-270x270.jpg	2026-03-18 01:09:53.223148
368	119	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	2026-03-18 01:09:53.223393
369	120	https://sbitany.com/image/cache/catalog/107-071-0039-0005-20220627123600-460x460.jpg	2026-03-18 01:10:01.877363
370	120	https://sbitany.com/image/cache/catalog/MB-H6299I-2022080780919-460x460.jpg	2026-03-18 01:10:01.877517
371	121	https://sbitany.com/image/cache/catalog/107-285-0035-0004-2025091582144-460x460.jpg	2026-03-18 01:10:09.046927
372	121	https://sbitany.com/image/cache/catalog/EP6A6HI10Y/download-2025-09-16T110915.518-2025091681356-460x460.png	2026-03-18 01:10:09.047332
373	121	https://sbitany.com/image/cache/catalog/EP6A6HI10Y/download-2025-09-16T110920.994-2025091681356-460x460.png	2026-03-18 01:10:09.047565
374	121	https://sbitany.com/image/cache/catalog/EP6A6HI10Y/download-2025-09-16T110925.806-2025091681356-460x460.png	2026-03-18 01:10:09.047767
375	121	https://sbitany.com/image/cache/catalog/EP6A6HI10Y/download-2025-09-16T110931.201-2025091681356-460x460.png	2026-03-18 01:10:09.047943
376	122	https://sbitany.com/image/cache/catalog/107-230-0060-0147-20251210122432-460x460.jpg	2026-03-18 01:10:16.927536
377	122	https://sbitany.com/image/cache/catalog/R-2B394BINS/download-2025-12-11T162301.129-20251211142524-460x460.png	2026-03-18 01:10:16.927775
378	122	https://sbitany.com/image/cache/catalog/R-2B394BINS/download-2025-12-11T162304.707-20251211142524-460x460.png	2026-03-18 01:10:16.927956
379	122	https://sbitany.com/image/cache/catalog/R-2B394BINS/download-2025-12-11T162308.220-20251211142524-460x460.png	2026-03-18 01:10:16.928118
380	122	https://sbitany.com/image/cache/catalog/R-2B394BINS/download-2025-12-11T162311.966-20251211142524-460x460.png	2026-03-18 01:10:16.928299
381	123	https://sbitany.com/image/cache/catalog/107-634-0060-0001-2025080395528-460x460.jpg	2026-03-18 01:10:24.106446
382	123	https://sbitany.com/image/cache/catalog/RF71DG9H0EB1ML/imgi_23_ps-t-style-french-door-215inch-family-hub-rf71dg9h0eb1ml-547290289-2025102971957-460x460.jpg	2026-03-18 01:10:24.106741
383	123	https://sbitany.com/image/cache/catalog/RF71DG9H0EB1ML/imgi_24_ps-t-style-french-door-215inch-family-hub-rf71dg9h0eb1ml-547290290-2025102971957-460x460.jpg	2026-03-18 01:10:24.106976
384	123	https://sbitany.com/image/cache/catalog/RF71DG9H0EB1ML/imgi_25_ps-t-style-french-door-215inch-family-hub-rf71dg9h0eb1ml-547290291-2025102971957-460x460.jpg	2026-03-18 01:10:24.107182
385	123	https://sbitany.com/image/cache/catalog/RF71DG9H0EB1ML/imgi_26_ps-t-style-french-door-215inch-family-hub-rf71dg9h0eb1ml-547290292-2025102971957-460x460.jpg	2026-03-18 01:10:24.107386
386	124	https://sbitany.com/image/cache/catalog/107-634-2791-0001-2025061572758-460x460.jpg	2026-03-18 01:10:31.095779
387	124	https://sbitany.com/image/cache/catalog/MS23A7013ABLI/ps-mq7000a-ms23a7013ab-li-546932-20251028143407-460x460.png	2026-03-18 01:10:31.096132
388	124	https://sbitany.com/image/cache/catalog/MS23A7013ABLI/ps-mq7000a-ms23a7013ab-li-546932(1)-20251028143407-460x460.png	2026-03-18 01:10:31.0964
389	124	https://sbitany.com/image/cache/catalog/MS23A7013ABLI/ps-mq7000a-ms23a7013ab-li-546932(2)-20251028143407-460x460.png	2026-03-18 01:10:31.09662
390	124	https://sbitany.com/image/cache/catalog/107-634-2667-0002-20251028125444-270x270.jpg	2026-03-18 01:10:31.096808
391	125	https://sbitany.com/image/cache/catalog/107-285-0060-0001-2025091582144-460x460.jpg	2026-03-18 01:10:38.246429
392	125	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(47)-2025091684507-460x460.png	2026-03-18 01:10:38.247644
393	125	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(48)-2025091684507-460x460.png	2026-03-18 01:10:38.248521
394	125	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(49)-2025091684507-460x460.png	2026-03-18 01:10:38.249202
395	125	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(50)-2025091684507-460x460.png	2026-03-18 01:10:38.249866
396	126	https://sbitany.com/image/cache/catalog/107-285-2667-0005-2025080395528-460x460.jpg	2026-03-18 01:10:45.391101
397	126	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155447.898-20260108135853-460x460.png	2026-03-18 01:10:45.392248
398	126	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155452.208-20260108135853-460x460.png	2026-03-18 01:10:45.39317
399	126	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155456.769-20260108135902-460x460.png	2026-03-18 01:10:45.393953
400	126	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155501.384-20260108135902-460x460.png	2026-03-18 01:10:45.39547
401	127	https://sbitany.com/image/cache/catalog/107-170-0039-0056-20230803123521-460x460.jpg	2026-03-18 01:10:51.084392
402	127	https://sbitany.com/image/cache/catalog/FG-SH906X/FG-SH906X-2023121275842-460x460.png	2026-03-18 01:10:51.084647
403	127	https://sbitany.com/image/cache/catalog/43882/107-171-0035-0050-20220914111922-270x270.jpg	2026-03-18 01:10:51.08483
404	127	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	2026-03-18 01:10:51.084996
405	128	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:10:59.275636
406	128	https://sbitany.com/image/cache/catalog/130-230-0070-0315-20250923125140-460x460.jpg	2026-03-18 01:10:59.276568
407	128	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(82)-20250923132621-460x460.png	2026-03-18 01:10:59.277249
408	128	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(83)-20250923132621-460x460.png	2026-03-18 01:10:59.277996
409	128	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(84)-20250923132621-460x460.png	2026-03-18 01:10:59.279175
410	129	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:06.574498
411	129	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-460x460.jpg	2026-03-18 01:11:06.574835
412	129	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-pe-20251027145229-460x460.png	2026-03-18 01:11:06.5752
413	129	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-si-20251027145229-460x460.png	2026-03-18 01:11:06.575467
414	129	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-un(1)-20251027145214-460x460.png	2026-03-18 01:11:06.575757
415	130	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:16.808324
416	130	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:16.809074
417	131	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:22.433672
418	131	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:22.434505
419	132	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:28.179408
420	132	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:28.180237
421	133	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:33.813471
422	133	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:33.814129
423	134	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:39.361166
424	134	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:39.362443
425	135	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:45.098965
426	135	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:45.099218
427	136	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:50.61372
428	136	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:11:50.614408
429	137	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:11:56.327525
430	137	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-460x460.jpg	2026-03-18 01:11:56.328015
431	137	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-pe-20251027145229-460x460.png	2026-03-18 01:11:56.328441
432	137	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-si-20251027145229-460x460.png	2026-03-18 01:11:56.328868
433	137	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-un(1)-20251027145214-460x460.png	2026-03-18 01:11:56.329244
434	138	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:02.025157
435	138	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:12:02.025433
436	139	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:07.550015
437	139	https://sbitany.com/image/cache/catalog/130-230-0070-0315-20250923125140-460x460.jpg	2026-03-18 01:12:07.550306
438	139	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(82)-20250923132621-460x460.png	2026-03-18 01:12:07.5505
439	139	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(83)-20250923132621-460x460.png	2026-03-18 01:12:07.550721
440	139	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(84)-20250923132621-460x460.png	2026-03-18 01:12:07.550908
441	140	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:17.943445
442	140	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-460x460.jpg	2026-03-18 01:12:17.944159
443	141	https://sbitany.com/image/cache/catalog/137-307-1349-0001-2025112682336-460x460.jpg	2026-03-18 01:12:24.90619
444	142	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:30.574953
445	142	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-460x460.jpg	2026-03-18 01:12:30.575523
446	143	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:36.379718
447	143	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-460x460.jpg	2026-03-18 01:12:36.380254
448	143	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-pe-20251027145229-460x460.png	2026-03-18 01:12:36.380618
449	143	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-si-20251027145229-460x460.png	2026-03-18 01:12:36.380953
450	143	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-un(1)-20251027145214-460x460.png	2026-03-18 01:12:36.381257
451	144	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:42.099133
452	144	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:12:42.099643
453	145	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:47.848215
454	145	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:12:47.848459
455	146	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:53.586195
456	146	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-460x460.jpg	2026-03-18 01:12:53.586532
457	146	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-pe-20251027145229-460x460.png	2026-03-18 01:12:53.586787
458	146	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-si-20251027145229-460x460.png	2026-03-18 01:12:53.587013
459	146	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-un(1)-20251027145214-460x460.png	2026-03-18 01:12:53.587329
460	147	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:12:59.309791
461	147	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-460x460.jpg	2026-03-18 01:12:59.310191
462	148	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:05.045627
463	148	https://sbitany.com/image/cache/catalog/130-230-0070-0315-20250923125140-460x460.jpg	2026-03-18 01:13:05.045867
464	148	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(82)-20250923132621-460x460.png	2026-03-18 01:13:05.046053
465	148	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(83)-20250923132621-460x460.png	2026-03-18 01:13:05.046216
466	148	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(84)-20250923132621-460x460.png	2026-03-18 01:13:05.046371
467	149	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:10.688919
468	149	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-460x460.jpg	2026-03-18 01:13:10.689712
469	149	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-pe-20251027145229-460x460.png	2026-03-18 01:13:10.690257
470	149	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-l-si-20251027145229-460x460.png	2026-03-18 01:13:10.690654
471	149	https://sbitany.com/image/cache/catalog/UE70U8000FUXMI/us-uhd-4k-tv-un70u8000ffxza-un(1)-20251027145214-460x460.png	2026-03-18 01:13:10.690991
472	150	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:19.249919
473	150	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-460x460.jpg	2026-03-18 01:13:19.250193
474	151	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:24.895026
475	151	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-460x460.jpg	2026-03-18 01:13:24.895624
476	152	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:30.694737
477	152	https://sbitany.com/image/cache/catalog/130-230-0070-0315-20250923125140-460x460.jpg	2026-03-18 01:13:30.695575
478	152	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(82)-20250923132621-460x460.png	2026-03-18 01:13:30.696262
479	152	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(83)-20250923132621-460x460.png	2026-03-18 01:13:30.696787
480	152	https://sbitany.com/image/cache/catalog/55QNED70A6A/download(84)-20250923132621-460x460.png	2026-03-18 01:13:30.697258
481	153	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:37.895054
482	153	https://sbitany.com/image/cache/catalog/130-634-0070-0036-2026021974452-460x460.jpg	2026-03-18 01:13:37.895375
483	153	https://sbitany.com/image/cache/catalog/QE75QN70FAUXSQ/download-2026-02-16T164117.631-20260216145409-460x460.png	2026-03-18 01:13:37.895617
484	153	https://sbitany.com/image/cache/catalog/QE75QN70FAUXSQ/download-2026-02-16T164126.120-20260216145409-460x460.png	2026-03-18 01:13:37.895846
485	153	https://sbitany.com/image/cache/catalog/QE75QN70FAUXSQ/download-2026-02-16T164134.116-20260216145409-460x460.png	2026-03-18 01:13:37.896066
486	154	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:45.443794
487	154	https://sbitany.com/image/cache/catalog/130-230-0070-0320-20250923125140-460x460.jpg	2026-03-18 01:13:45.444029
488	154	https://sbitany.com/image/cache/catalog/OLED55CS5VA/download(86)-20250923133556-460x460.png	2026-03-18 01:13:45.444275
489	154	https://sbitany.com/image/cache/catalog/OLED55CS5VA/download(87)-20250923133556-460x460.png	2026-03-18 01:13:45.44451
490	154	https://sbitany.com/image/cache/catalog/OLED55CS5VA/download(88)-20250923133556-460x460.png	2026-03-18 01:13:45.444723
491	155	https://sbitany.com/image/cache/catalog/TVinten-2025050880616-100x100.png	2026-03-18 01:13:52.634575
492	155	https://sbitany.com/image/cache/catalog/130-268-0070-0004-20250923125151-460x460.jpg	2026-03-18 01:13:52.635453
493	155	https://sbitany.com/image/cache/catalog/65PUT712998/download-2025-09-25T132608.622-20250925103106-460x460.png	2026-03-18 01:13:52.63631
494	155	https://sbitany.com/image/cache/catalog/65PUT712998/download-2025-09-25T132615.660-20250925103106-460x460.png	2026-03-18 01:13:52.63682
495	155	https://sbitany.com/image/cache/catalog/65PUT712998/download-2025-09-25T132621.138-20250925103106-460x460.png	2026-03-18 01:13:52.637183
496	157	https://sbitany.com/image/cache/catalog/137-203-1331-0005-20251125114103-460x460.jpg	2026-03-18 01:13:59.784647
497	157	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154052.487-20251127132657-460x460.png	2026-03-18 01:13:59.784963
498	157	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154129.937-20251127132657-460x460.png	2026-03-18 01:13:59.785188
499	157	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154135.290-20251127132657-460x460.png	2026-03-18 01:13:59.785489
500	157	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154139.719-20251127132657-460x460.png	2026-03-18 01:13:59.785826
501	158	https://sbitany.com/image/cache/catalog/137-203-1094-0002-20250820101855-460x460.jpg	2026-03-18 01:14:06.744511
502	159	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:14:13.585681
503	160	https://sbitany.com/image/cache/catalog/137-111-2234-0006-20251210122443-460x460.jpg	2026-03-18 01:14:20.40351
504	161	https://sbitany.com/image/cache/catalog/137-203-1094-0006-2026021974452-460x460.jpg	2026-03-18 01:14:30.830024
505	161	https://sbitany.com/image/cache/catalog/A2692L11/download-2026-02-17T100516.808-2026021780808-460x460.png	2026-03-18 01:14:30.83112
506	161	https://sbitany.com/image/cache/catalog/A2692L11/download-2026-02-17T100520.839-2026021780808-460x460.png	2026-03-18 01:14:30.83148
507	161	https://sbitany.com/image/cache/catalog/A2692L11/download-2026-02-17T100526.015-2026021780808-460x460.png	2026-03-18 01:14:30.831804
508	161	https://sbitany.com/image/cache/catalog/A2692L11/download-2026-02-17T100530.561-2026021780808-460x460.png	2026-03-18 01:14:30.832079
509	162	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:14:36.74129
510	163	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:14:42.521876
511	164	https://sbitany.com/image/cache/catalog/137-111-1086-0006-2025042964353-460x460.jpg	2026-03-18 01:14:49.258387
512	165	https://sbitany.com/image/cache/catalog/137-203-2562-0001-2025051455625-460x460.jpg	2026-03-18 01:14:56.016289
513	166	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-460x460.jpg	2026-03-18 01:15:04.540228
514	166	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100817.460-2026021781030-460x460.png	2026-03-18 01:15:04.540831
515	166	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100823.393-2026021781030-460x460.png	2026-03-18 01:15:04.541336
516	166	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100827.888-2026021781043-460x460.png	2026-03-18 01:15:04.542171
517	166	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100832.772-2026021781043-460x460.png	2026-03-18 01:15:04.542669
518	167	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-460x460.jpg	2026-03-18 01:15:10.323563
519	167	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100817.460-2026021781030-460x460.png	2026-03-18 01:15:10.323898
520	167	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100823.393-2026021781030-460x460.png	2026-03-18 01:15:10.324132
521	167	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100827.888-2026021781043-460x460.png	2026-03-18 01:15:10.324331
522	167	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100832.772-2026021781043-460x460.png	2026-03-18 01:15:10.324521
523	168	https://sbitany.com/image/cache/catalog/137-203-1093-0001-2026021974452-460x460.jpg	2026-03-18 01:15:17.527036
524	168	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095326.987-2026021775527-460x460.png	2026-03-18 01:15:17.52777
525	168	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095332.827-2026021775527-460x460.png	2026-03-18 01:15:17.528319
526	168	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095337.781-2026021775527-460x460.png	2026-03-18 01:15:17.528775
527	168	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095342.797-2026021775527-460x460.png	2026-03-18 01:15:17.529209
528	169	https://sbitany.com/image/cache/catalog/137-203-1331-0005-20251125114103-460x460.jpg	2026-03-18 01:15:23.2521
529	169	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154052.487-20251127132657-460x460.png	2026-03-18 01:15:23.252412
530	169	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154129.937-20251127132657-460x460.png	2026-03-18 01:15:23.252703
531	169	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154135.290-20251127132657-460x460.png	2026-03-18 01:15:23.252942
532	169	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154139.719-20251127132657-460x460.png	2026-03-18 01:15:23.253125
533	171	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-460x460.jpg	2026-03-18 01:15:29.160226
534	171	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100817.460-2026021781030-460x460.png	2026-03-18 01:15:29.160477
535	171	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100823.393-2026021781030-460x460.png	2026-03-18 01:15:29.160663
536	171	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100827.888-2026021781043-460x460.png	2026-03-18 01:15:29.160828
537	171	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100832.772-2026021781043-460x460.png	2026-03-18 01:15:29.160985
538	172	https://sbitany.com/image/cache/catalog/137-203-1093-0001-2026021974452-460x460.jpg	2026-03-18 01:15:37.92411
539	172	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095326.987-2026021775527-460x460.png	2026-03-18 01:15:37.924984
540	172	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095332.827-2026021775527-460x460.png	2026-03-18 01:15:37.925504
541	172	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095337.781-2026021775527-460x460.png	2026-03-18 01:15:37.925974
542	172	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095342.797-2026021775527-460x460.png	2026-03-18 01:15:37.926363
543	173	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:15:43.541758
544	174	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-460x460.jpg	2026-03-18 01:15:49.272473
545	174	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100817.460-2026021781030-460x460.png	2026-03-18 01:15:49.272725
546	174	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100823.393-2026021781030-460x460.png	2026-03-18 01:15:49.272961
547	174	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100827.888-2026021781043-460x460.png	2026-03-18 01:15:49.273211
548	174	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100832.772-2026021781043-460x460.png	2026-03-18 01:15:49.273451
549	175	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:15:54.966632
550	176	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:16:00.454424
551	179	https://sbitany.com/image/cache/catalog/137-111-1086-0006-2025042964353-460x460.jpg	2026-03-18 01:16:05.986954
552	181	https://sbitany.com/image/cache/catalog/137-203-8131-0001-2026021974504-460x460.jpg	2026-03-18 01:16:13.269532
553	181	https://sbitany.com/image/cache/catalog/A9110H11/A9110H11_Rich_image_TD03_US_2313-2026021784519-460x460.jpg	2026-03-18 01:16:13.270063
554	181	https://sbitany.com/image/cache/catalog/A9110H11/A9110H11_Rich_image_TD04_US_31bb-2026021784519-460x460.jpg	2026-03-18 01:16:13.270582
555	181	https://sbitany.com/image/cache/catalog/A9110H11/A9110H11_Rich_image_TD05_US_ba3b-2026021784519-460x460.jpg	2026-03-18 01:16:13.270913
556	181	https://sbitany.com/image/cache/catalog/A9110H11/A9110H11_Rich_image_TD06_US_a3b6-2026021784519-460x460.jpg	2026-03-18 01:16:13.271468
557	182	https://sbitany.com/image/cache/catalog/107-634-0073-0005-2025080395528-460x460.jpg	2026-03-18 01:16:20.579572
558	182	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363(1)-20251028145046-460x460.png	2026-03-18 01:16:20.580007
559	182	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363-20251028145046-460x460.png	2026-03-18 01:16:20.580257
560	182	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363(2)-20251028145046-460x460.png	2026-03-18 01:16:20.580482
561	182	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363(3)-20251028145046-460x460.png	2026-03-18 01:16:20.580786
562	183	https://sbitany.com/image/cache/catalog/137-203-1093-0001-2026021974452-460x460.jpg	2026-03-18 01:16:26.1846
563	183	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095326.987-2026021775527-460x460.png	2026-03-18 01:16:26.185482
564	183	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095332.827-2026021775527-460x460.png	2026-03-18 01:16:26.186262
565	183	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095337.781-2026021775527-460x460.png	2026-03-18 01:16:26.186907
566	183	https://sbitany.com/image/cache/catalog/A2738HA2/download-2026-02-17T095342.797-2026021775527-460x460.png	2026-03-18 01:16:26.187412
567	187	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-460x460.jpg	2026-03-18 01:16:31.79925
568	187	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100817.460-2026021781030-460x460.png	2026-03-18 01:16:31.799799
569	187	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100823.393-2026021781030-460x460.png	2026-03-18 01:16:31.800251
570	187	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100827.888-2026021781043-460x460.png	2026-03-18 01:16:31.800649
571	187	https://sbitany.com/image/cache/catalog/A1680H32/download-2026-02-17T100832.772-2026021781043-460x460.png	2026-03-18 01:16:31.800957
572	188	https://sbitany.com/image/cache/catalog/107-634-0073-0005-2025080395528-460x460.jpg	2026-03-18 01:16:40.630944
573	188	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363(1)-20251028145046-460x460.png	2026-03-18 01:16:40.631622
574	188	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363-20251028145046-460x460.png	2026-03-18 01:16:40.632204
575	188	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363(2)-20251028145046-460x460.png	2026-03-18 01:16:40.63273
576	188	https://sbitany.com/image/cache/catalog/WW11CGC04DABPS/ps-ww5000c-ww11cgc04dabps-544363(3)-20251028145046-460x460.png	2026-03-18 01:16:40.63308
577	193	https://sbitany.com/image/cache/catalog/137-111-1086-0006-2025042964353-460x460.jpg	2026-03-18 01:16:46.322617
578	194	https://sbitany.com/image/cache/catalog/137-203-1331-0005-20251125114103-460x460.jpg	2026-03-18 01:16:52.017256
579	194	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154052.487-20251127132657-460x460.png	2026-03-18 01:16:52.017828
580	194	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154129.937-20251127132657-460x460.png	2026-03-18 01:16:52.018214
581	194	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154135.290-20251127132657-460x460.png	2026-03-18 01:16:52.018534
582	194	https://sbitany.com/image/cache/catalog/A1654H11/download-2025-11-23T154139.719-20251127132657-460x460.png	2026-03-18 01:16:52.018877
583	195	https://sbitany.com/image/cache/catalog/137-203-1699-0002-2025051455625-460x460.jpg	2026-03-18 01:16:58.915219
584	196	https://sbitany.com/image/cache/catalog/137-203-1699-0001-2025051455625-460x460.jpg	2026-03-18 01:17:05.66469
585	197	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:17:11.428891
586	198	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:17:18.672898
587	198	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:17:18.673605
588	198	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:17:18.674184
589	198	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:17:18.674721
590	198	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:17:18.675239
591	203	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-460x460.jpg	2026-03-18 01:17:24.443608
592	204	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:17:30.208681
593	204	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-460x460.jpg	2026-03-18 01:17:30.209222
594	205	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:17:35.812521
595	205	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-460x460.jpg	2026-03-18 01:17:35.813207
596	205	https://sbitany.com/image/cache/catalog/MD-MWO3192X/MD-MWO3192Xproductphotos-20230116105207-460x460.jpg	2026-03-18 01:17:35.813593
597	205	https://sbitany.com/image/cache/catalog/107-242-1688-0011-2024120574029-270x270.jpg	2026-03-18 01:17:35.813952
598	206	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:17:46.097421
599	206	https://sbitany.com/image/cache/catalog/113-018-1717-0008-20231121145135-460x460.jpg	2026-03-18 01:17:46.098191
600	206	https://sbitany.com/image/cache/catalog/CA-AF299BS/KB2299M-01-2025022693112-460x460.jpg	2026-03-18 01:17:46.098425
601	207	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:17:51.762641
602	207	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-460x460.jpg	2026-03-18 01:17:51.763217
603	208	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:17:58.932455
604	208	https://sbitany.com/image/cache/catalog/113-320-0133-0001-20241027123902-460x460.jpg	2026-03-18 01:17:58.932906
605	208	https://sbitany.com/image/cache/catalog/UNI-IN601SS/Artboard1-2025021285143-460x460.jpg	2026-03-18 01:17:58.933165
606	208	https://sbitany.com/image/cache/catalog/UNI-IN601SS/Artboard2-2025021285143-460x460.jpg	2026-03-18 01:17:58.933409
607	208	https://sbitany.com/image/cache/catalog/UNI-IN601SS/Artboard3-2025021285143-460x460.jpg	2026-03-18 01:17:58.93365
608	209	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:18:04.514904
609	209	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-460x460.jpg	2026-03-18 01:18:04.515303
610	210	https://sbitany.com/image/cache/catalog/113-018-0129-0007-20241027104209-460x460.jpg	2026-03-18 01:18:11.559901
611	211	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:18:18.570665
612	211	https://sbitany.com/image/cache/catalog/113-018-0129-0005-2024052291434-460x460.jpg	2026-03-18 01:18:18.571483
613	212	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-460x460.jpg	2026-03-18 01:18:24.257613
614	213	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-460x460.jpg	2026-03-18 01:18:31.670824
615	213	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9883-87-B-2022072654114-460x460.jpg	2026-03-18 01:18:31.67201
616	213	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9884-87-B-2022072654141-460x460.jpg	2026-03-18 01:18:31.672672
617	213	https://sbitany.com/image/cache/catalog/113-227-0125-0007-2020111292055-460x460.jpg	2026-03-18 01:18:31.673125
618	213	https://sbitany.com/image/cache/catalog/113-227-0125-0006-2020111292038-460x460.jpg	2026-03-18 01:18:31.673605
619	214	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-460x460.jpg	2026-03-18 01:18:37.191286
620	214	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9883-87-B-2022072654114-460x460.jpg	2026-03-18 01:18:37.191712
621	214	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9884-87-B-2022072654141-460x460.jpg	2026-03-18 01:18:37.192197
622	214	https://sbitany.com/image/cache/catalog/113-227-0125-0007-2020111292055-460x460.jpg	2026-03-18 01:18:37.192716
623	214	https://sbitany.com/image/cache/catalog/113-227-0125-0006-2020111292038-460x460.jpg	2026-03-18 01:18:37.193258
624	215	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-460x460.jpg	2026-03-18 01:18:44.510117
625	215	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-00-1-20220516104445-460x460.jpg	2026-03-18 01:18:44.510498
626	215	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-01-1-20220516104459-460x460.jpg	2026-03-18 01:18:44.510927
627	215	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-02-1-20220516104513-460x460.jpg	2026-03-18 01:18:44.511185
628	215	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-03-1-20220516104555-460x460.jpg	2026-03-18 01:18:44.511414
629	216	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:18:55.122802
630	216	https://sbitany.com/image/cache/catalog/113-320-1717-0017-2024102473742-460x460.jpg	2026-03-18 01:18:55.123675
631	216	https://sbitany.com/image/cache/catalog/UNI-AF4800X/Artboard1-20221227123341-460x460.jpg	2026-03-18 01:18:55.123933
632	216	https://sbitany.com/image/cache/catalog/UNI-AF4800X/Artboard2-20221227123341-460x460.jpg	2026-03-18 01:18:55.124177
633	216	https://sbitany.com/image/cache/catalog/UNI-AF4800X/Artboard3-20221227123341-460x460.jpg	2026-03-18 01:18:55.124391
634	217	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:19:02.648776
635	217	https://sbitany.com/image/cache/catalog/MH8295DIS/113-230-0064-0007-2025081382503-460x460.jpg	2026-03-18 01:19:02.649201
636	217	https://sbitany.com/image/cache/catalog/MH8295DIS/MH8295DIS2-2025081382230-460x460.png	2026-03-18 01:19:02.649444
637	217	https://sbitany.com/image/cache/catalog/MH8295DIS/MH8295DIS3-2025081382230-460x460.png	2026-03-18 01:19:02.649656
638	217	https://sbitany.com/image/cache/catalog/MH8295DIS/MH8295DIS4-2025081382230-460x460.png	2026-03-18 01:19:02.649864
639	218	https://sbitany.com/image/cache/catalog/113-130-0580-0003-2021100561013-460x460.jpg	2026-03-18 01:19:09.630771
640	219	https://sbitany.com/image/cache/catalog/113-242-0064-0024-2024072272047-460x460.jpg	2026-03-18 01:19:16.603412
641	219	https://sbitany.com/image/cache/catalog/MD-MWO42A5LSBG/cq5dam.web.5000.5000(1)-20240801104849-460x460.jpeg	2026-03-18 01:19:16.603676
642	219	https://sbitany.com/image/cache/catalog/MD-MWO42A5LSBG/cq5dam.web.5000.5000(2)-20240801104849-460x460.jpeg	2026-03-18 01:19:16.603878
643	219	https://sbitany.com/image/cache/catalog/MD-MWO42A5LSBG/cq5dam.web.5000.5000-20240801104849-460x460.jpeg	2026-03-18 01:19:16.604052
644	220	https://sbitany.com/image/cache/catalog/113-130-0580-0005-20221108140845-460x460.jpg	2026-03-18 01:19:23.268819
645	221	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:19:29.063857
646	221	https://sbitany.com/image/cache/catalog/113-230-0025-0026-2026020381944-460x460.jpg	2026-03-18 01:19:29.064153
647	221	https://sbitany.com/image/cache/catalog/A9LSLIM.BCBQDAG/download(20)-20260203112138-460x460.png	2026-03-18 01:19:29.06454
648	221	https://sbitany.com/image/cache/catalog/A9LSLIM.BCBQDAG/download(22)-20260203112138-460x460.png	2026-03-18 01:19:29.064771
649	221	https://sbitany.com/image/cache/catalog/A9LSLIM.BCBQDAG/download(23)-20260203112138-460x460.png	2026-03-18 01:19:29.065006
650	222	https://sbitany.com/image/cache/catalog/113-242-0064-0024-2024072272047-460x460.jpg	2026-03-18 01:19:34.677694
651	222	https://sbitany.com/image/cache/catalog/MD-MWO42A5LSBG/cq5dam.web.5000.5000(1)-20240801104849-460x460.jpeg	2026-03-18 01:19:34.677985
652	222	https://sbitany.com/image/cache/catalog/MD-MWO42A5LSBG/cq5dam.web.5000.5000(2)-20240801104849-460x460.jpeg	2026-03-18 01:19:34.678236
653	222	https://sbitany.com/image/cache/catalog/MD-MWO42A5LSBG/cq5dam.web.5000.5000-20240801104849-460x460.jpeg	2026-03-18 01:19:34.678439
654	223	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:19:40.208157
655	223	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-460x460.jpg	2026-03-18 01:19:40.208722
656	223	https://sbitany.com/image/cache/catalog/MD-MWO3192X/MD-MWO3192Xproductphotos-20230116105207-460x460.jpg	2026-03-18 01:19:40.209184
657	223	https://sbitany.com/image/cache/catalog/107-242-1688-0011-2024120574029-270x270.jpg	2026-03-18 01:19:40.209824
658	224	https://sbitany.com/image/cache/catalog/113-268-0127-0005-20250903130451-460x460.jpg	2026-03-18 01:19:47.714425
659	224	https://sbitany.com/image/cache/catalog/HR204100/download-2025-09-25T164414.686-20250925134905-460x460.png	2026-03-18 01:19:47.714819
660	224	https://sbitany.com/image/cache/catalog/HR204100/download-2025-09-25T164419.696-20250925134905-460x460.png	2026-03-18 01:19:47.71504
661	224	https://sbitany.com/image/cache/catalog/HR204100/download-2025-09-25T164424.384-20250925134905-460x460.png	2026-03-18 01:19:47.715224
662	224	https://sbitany.com/image/cache/catalog/HR204100/download-2025-09-25T164429.456-20250925134905-460x460.png	2026-03-18 01:19:47.715416
663	225	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-460x460.jpg	2026-03-18 01:19:53.529788
664	225	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-00-1-20220516104445-460x460.jpg	2026-03-18 01:19:53.530113
665	225	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-01-1-20220516104459-460x460.jpg	2026-03-18 01:19:53.530402
666	225	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-02-1-20220516104513-460x460.jpg	2026-03-18 01:19:53.53068
667	225	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-03-1-20220516104555-460x460.jpg	2026-03-18 01:19:53.530942
668	226	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:20:04.036107
669	226	https://sbitany.com/image/cache/catalog/113-251-0117-0003-20260311120355-460x460.jpg	2026-03-18 01:20:04.036799
670	227	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:20:09.984049
671	227	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-460x460.jpg	2026-03-18 01:20:09.984498
672	227	https://sbitany.com/image/cache/catalog/MD-MWO3192X/MD-MWO3192Xproductphotos-20230116105207-460x460.jpg	2026-03-18 01:20:09.984757
673	227	https://sbitany.com/image/cache/catalog/107-242-1688-0011-2024120574029-270x270.jpg	2026-03-18 01:20:09.984982
674	228	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-460x460.jpg	2026-03-18 01:20:17.370703
675	228	https://sbitany.com/image/cache/catalog/3878K/51q2XmNHL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:20:17.371138
676	228	https://sbitany.com/image/cache/catalog/3878K/download-2026-02-24T114942.318-2026031584614-460x460.png	2026-03-18 01:20:17.371538
677	228	https://sbitany.com/image/cache/catalog/3878K/61e62ZdYDRL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:20:17.371937
678	228	https://sbitany.com/image/cache/catalog/3878K/61V-TAQNknL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:20:17.3723
679	229	https://sbitany.com/image/cache/catalog/113-313-2239-0001-20251224114859-460x460.jpg	2026-03-18 01:20:24.485186
680	229	https://sbitany.com/image/cache/catalog/Gusto%20Forte/download-2025-12-17T144642.873-20251224121510-460x460.png	2026-03-18 01:20:24.485548
681	230	https://sbitany.com/image/cache/catalog/113-251-0124-0014-20260311120410-460x460.jpg	2026-03-18 01:20:31.365252
682	231	https://sbitany.com/image/cache/catalog/113-242-1884-0007-2024072272047-460x460.jpg	2026-03-18 01:20:38.770842
683	231	https://sbitany.com/image/cache/catalog/VTW21A15T/download-2024-07-16T120559.304-2024071694457-460x460.png	2026-03-18 01:20:38.772007
684	231	https://sbitany.com/image/cache/catalog/VTW21A15T/download-2024-07-16T120612.488-2024071694457-460x460.png	2026-03-18 01:20:38.77284
685	231	https://sbitany.com/image/cache/catalog/VTW21A15T/download-2024-07-16T120618.157-2024071694457-460x460.png	2026-03-18 01:20:38.7736
686	231	https://sbitany.com/image/cache/catalog/VTW21A15T/download-2024-07-16T120624.502-2024071694457-460x460.png	2026-03-18 01:20:38.773999
687	232	https://sbitany.com/image/cache/catalog/113-251-0124-0014-20260311120410-460x460.jpg	2026-03-18 01:20:44.598179
688	233	https://sbitany.com/image/cache/catalog/113-268-0117-0025-2025042964335-460x460.jpg	2026-03-18 01:20:52.447177
689	233	https://sbitany.com/image/cache/catalog/DST7020/vrs_ef83116676a782b549f6cb0d429c-2025042793133-460x460.png	2026-03-18 01:20:52.447758
690	233	https://sbitany.com/image/cache/catalog/DST7020/vrs_dbe2176269b19d63e17a5f086f3d-2025042793133-460x460.png	2026-03-18 01:20:52.448306
691	233	https://sbitany.com/image/cache/catalog/DST7020/vrs_cec24788cc253a6bef1eda43a671-2025042793133-460x460.png	2026-03-18 01:20:52.448668
692	233	https://sbitany.com/image/cache/catalog/DST7020/vrs_1ee7d38cca618223ffac7afe6a02-2025042793133-460x460.png	2026-03-18 01:20:52.448981
693	234	https://sbitany.com/image/cache/catalog/113-282-0117-0003-20260311120410-460x460.jpg	2026-03-18 01:20:59.609249
694	234	https://sbitany.com/image/cache/videos/youtube-99oDy1VPEvY-460x460.jpg	2026-03-18 01:20:59.609665
695	235	https://sbitany.com/image/cache/catalog/113-297-0632-0001-20260311120410-460x460.jpg	2026-03-18 01:21:07.044716
696	235	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(1)-2026031593115-460x460.jpg	2026-03-18 01:21:07.045041
697	235	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(2)-2026031593115-460x460.jpg	2026-03-18 01:21:07.04525
698	235	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(3)-2026031593115-460x460.jpg	2026-03-18 01:21:07.045425
699	235	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(4)-2026031593115-460x460.jpg	2026-03-18 01:21:07.045584
700	236	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-460x460.jpg	2026-03-18 01:21:16.210172
701	236	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-00-1-20220516104445-460x460.jpg	2026-03-18 01:21:16.210423
702	236	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-01-1-20220516104459-460x460.jpg	2026-03-18 01:21:16.210631
703	236	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-02-1-20220516104513-460x460.jpg	2026-03-18 01:21:16.210845
704	236	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-03-1-20220516104555-460x460.jpg	2026-03-18 01:21:16.211031
705	237	https://sbitany.com/image/cache/catalog/113-268-0117-0025-2025042964335-460x460.jpg	2026-03-18 01:21:21.854021
706	237	https://sbitany.com/image/cache/catalog/DST7020/vrs_ef83116676a782b549f6cb0d429c-2025042793133-460x460.png	2026-03-18 01:21:21.854422
707	237	https://sbitany.com/image/cache/catalog/DST7020/vrs_dbe2176269b19d63e17a5f086f3d-2025042793133-460x460.png	2026-03-18 01:21:21.854723
708	237	https://sbitany.com/image/cache/catalog/DST7020/vrs_cec24788cc253a6bef1eda43a671-2025042793133-460x460.png	2026-03-18 01:21:21.855014
709	237	https://sbitany.com/image/cache/catalog/DST7020/vrs_1ee7d38cca618223ffac7afe6a02-2025042793133-460x460.png	2026-03-18 01:21:21.85526
710	238	https://sbitany.com/image/cache/catalog/113-130-0025-0049-20201116110556-460x460.jpg	2026-03-18 01:21:29.198504
711	238	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-02-1-20200830105529-460x460.jpg	2026-03-18 01:21:29.198735
712	238	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-00-1-2020102251605-460x460.jpg	2026-03-18 01:21:29.19891
713	238	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-03-1-20200830105730-460x460.jpg	2026-03-18 01:21:29.199071
714	238	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-05-1-20200830105800-460x460.jpg	2026-03-18 01:21:29.199226
715	239	https://sbitany.com/image/cache/catalog/113-130-0025-0049-20201116110556-460x460.jpg	2026-03-18 01:21:34.927463
716	239	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-02-1-20200830105529-460x460.jpg	2026-03-18 01:21:34.927999
717	239	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-00-1-2020102251605-460x460.jpg	2026-03-18 01:21:34.928402
718	239	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-03-1-20200830105730-460x460.jpg	2026-03-18 01:21:34.928777
719	239	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-05-1-20200830105800-460x460.jpg	2026-03-18 01:21:34.929156
720	240	https://sbitany.com/image/cache/catalog/113-313-2239-0001-20251224114859-460x460.jpg	2026-03-18 01:21:40.654992
721	240	https://sbitany.com/image/cache/catalog/Gusto%20Forte/download-2025-12-17T144642.873-20251224121510-460x460.png	2026-03-18 01:21:40.655405
722	241	https://sbitany.com/image/cache/catalog/113-268-0117-0025-2025042964335-460x460.jpg	2026-03-18 01:21:46.454423
723	241	https://sbitany.com/image/cache/catalog/DST7020/vrs_ef83116676a782b549f6cb0d429c-2025042793133-460x460.png	2026-03-18 01:21:46.455196
724	241	https://sbitany.com/image/cache/catalog/DST7020/vrs_dbe2176269b19d63e17a5f086f3d-2025042793133-460x460.png	2026-03-18 01:21:46.456
725	241	https://sbitany.com/image/cache/catalog/DST7020/vrs_cec24788cc253a6bef1eda43a671-2025042793133-460x460.png	2026-03-18 01:21:46.456602
726	241	https://sbitany.com/image/cache/catalog/DST7020/vrs_1ee7d38cca618223ffac7afe6a02-2025042793133-460x460.png	2026-03-18 01:21:46.45717
727	242	https://sbitany.com/image/cache/catalog/113-130-0025-0049-20201116110556-460x460.jpg	2026-03-18 01:21:52.192351
728	242	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-02-1-20200830105529-460x460.jpg	2026-03-18 01:21:52.192999
729	242	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-00-1-2020102251605-460x460.jpg	2026-03-18 01:21:52.193593
730	242	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-03-1-20200830105730-460x460.jpg	2026-03-18 01:21:52.194115
731	242	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2026E-PowerCleanProfessional21L-05-1-20200830105800-460x460.jpg	2026-03-18 01:21:52.194599
732	243	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:21:59.060298
733	243	https://sbitany.com/image/cache/catalog/113-634-8081-0002-2026011482151-460x460.jpg	2026-03-18 01:21:59.060533
734	244	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-460x460.jpg	2026-03-18 01:22:04.488703
735	244	https://sbitany.com/image/cache/catalog/3878K/51q2XmNHL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:22:04.489184
736	244	https://sbitany.com/image/cache/catalog/3878K/download-2026-02-24T114942.318-2026031584614-460x460.png	2026-03-18 01:22:04.489559
737	244	https://sbitany.com/image/cache/catalog/3878K/61e62ZdYDRL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:22:04.489898
738	244	https://sbitany.com/image/cache/catalog/3878K/61V-TAQNknL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:22:04.490208
739	245	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:22:11.508139
740	245	https://sbitany.com/image/cache/catalog/113-459-0025-0009-20241216132103-460x460.jpg	2026-03-18 01:22:11.508513
741	246	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-460x460.jpg	2026-03-18 01:22:20.802592
742	246	https://sbitany.com/image/cache/catalog/3878K/51q2XmNHL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:22:20.803027
743	246	https://sbitany.com/image/cache/catalog/3878K/download-2026-02-24T114942.318-2026031584614-460x460.png	2026-03-18 01:22:20.803237
744	246	https://sbitany.com/image/cache/catalog/3878K/61e62ZdYDRL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:22:20.803414
745	246	https://sbitany.com/image/cache/catalog/3878K/61V-TAQNknL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:22:20.803581
746	247	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-460x460.jpg	2026-03-18 01:22:26.495298
747	247	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9883-87-B-2022072654114-460x460.jpg	2026-03-18 01:22:26.495951
748	247	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9884-87-B-2022072654141-460x460.jpg	2026-03-18 01:22:26.496496
749	247	https://sbitany.com/image/cache/catalog/113-227-0125-0007-2020111292055-460x460.jpg	2026-03-18 01:22:26.49706
750	247	https://sbitany.com/image/cache/catalog/113-227-0125-0006-2020111292038-460x460.jpg	2026-03-18 01:22:26.497643
751	248	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-460x460.jpg	2026-03-18 01:22:32.31081
752	248	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-00-1-20220516104445-460x460.jpg	2026-03-18 01:22:32.311394
753	248	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-01-1-20220516104459-460x460.jpg	2026-03-18 01:22:32.311756
754	248	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-02-1-20220516104513-460x460.jpg	2026-03-18 01:22:32.312067
755	248	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-03-1-20220516104555-460x460.jpg	2026-03-18 01:22:32.312363
756	249	https://sbitany.com/image/cache/catalog/113-268-8128-0001-20251224114859-460x460.jpg	2026-03-18 01:22:39.383924
757	249	https://sbitany.com/image/cache/catalog/CA670410/download-2025-12-17T142638.519-20251224122441-460x460.png	2026-03-18 01:22:39.384174
758	250	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:22:45.056842
759	250	https://sbitany.com/image/cache/catalog/113-251-0117-0003-20260311120355-460x460.jpg	2026-03-18 01:22:45.057144
760	251	https://sbitany.com/image/cache/catalog/113-268-8129-0001-20251224114859-460x460.jpg	2026-03-18 01:22:51.96802
761	251	https://sbitany.com/image/cache/catalog/CA670010/download-2025-12-17T142806.723-20251224122550-460x460.png	2026-03-18 01:22:51.968595
762	252	https://sbitany.com/image/cache/catalog/113-251-0580-0001-2025112682336-460x460.jpg	2026-03-18 01:22:58.642011
763	253	https://sbitany.com/image/cache/catalog/113-268-0331-0001-20251224114852-460x460.jpg	2026-03-18 01:23:05.521829
764	253	https://sbitany.com/image/cache/catalog/CA690310/download-2025-12-17T142430.094-20251224122111-460x460.png	2026-03-18 01:23:05.522093
765	254	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-460x460.jpg	2026-03-18 01:23:11.171183
766	254	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9883-87-B-2022072654114-460x460.jpg	2026-03-18 01:23:11.17187
767	254	https://sbitany.com/image/cache/catalog/korkmaz-kahvekolik-otomatik-kahve-makinesi-vanilya-a860-12-kahve-makinesi-9884-87-B-2022072654141-460x460.jpg	2026-03-18 01:23:11.172331
768	254	https://sbitany.com/image/cache/catalog/113-227-0125-0007-2020111292055-460x460.jpg	2026-03-18 01:23:11.17272
769	254	https://sbitany.com/image/cache/catalog/113-227-0125-0006-2020111292038-460x460.jpg	2026-03-18 01:23:11.173055
770	255	https://sbitany.com/image/cache/catalog/113-268-0128-0001-2025042964335-460x460.jpg	2026-03-18 01:23:18.264518
771	256	https://sbitany.com/image/cache/catalog/113-251-0128-0002-20240415135050-460x460.jpg	2026-03-18 01:23:28.594337
772	257	https://sbitany.com/image/cache/catalog/113-251-0131-0002-20230323101145-460x460.jpg	2026-03-18 01:23:35.941788
773	258	https://sbitany.com/image/cache/catalog/113-268-0117-0025-2025042964335-460x460.jpg	2026-03-18 01:23:41.612676
774	258	https://sbitany.com/image/cache/catalog/DST7020/vrs_ef83116676a782b549f6cb0d429c-2025042793133-460x460.png	2026-03-18 01:23:41.613399
775	258	https://sbitany.com/image/cache/catalog/DST7020/vrs_dbe2176269b19d63e17a5f086f3d-2025042793133-460x460.png	2026-03-18 01:23:41.614376
776	258	https://sbitany.com/image/cache/catalog/DST7020/vrs_cec24788cc253a6bef1eda43a671-2025042793133-460x460.png	2026-03-18 01:23:41.614839
777	258	https://sbitany.com/image/cache/catalog/DST7020/vrs_1ee7d38cca618223ffac7afe6a02-2025042793133-460x460.png	2026-03-18 01:23:41.615228
778	259	https://sbitany.com/image/cache/catalog/113-251-8123-0001-20251125114055-460x460.jpg	2026-03-18 01:23:48.462544
779	260	https://sbitany.com/image/cache/catalog/113-268-0117-0026-20250326121748-460x460.jpg	2026-03-18 01:23:55.387179
780	261	https://sbitany.com/image/cache/catalog/113-251-0666-0001-2026011482151-460x460.jpg	2026-03-18 01:24:02.416788
781	262	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-460x460.jpg	2026-03-18 01:24:08.050934
782	262	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-00-1-20220516104445-460x460.jpg	2026-03-18 01:24:08.051158
783	262	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-01-1-20220516104459-460x460.jpg	2026-03-18 01:24:08.051337
784	262	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-02-1-20220516104513-460x460.jpg	2026-03-18 01:24:08.051497
785	262	https://sbitany.com/image/cache/catalog/Bissell-Product-Domestic-2155E-EasyVacCompact-03-1-20220516104555-460x460.jpg	2026-03-18 01:24:08.051651
786	263	https://sbitany.com/image/cache/catalog/113-251-0441-0002-2026020381944-460x460.jpg	2026-03-18 01:24:15.050768
787	264	https://sbitany.com/image/cache/catalog/113-251-0441-0002-2026020381944-460x460.jpg	2026-03-18 01:24:20.857664
788	265	https://sbitany.com/image/cache/catalog/113-273-0131-0001-20260311120410-460x460.jpg	2026-03-18 01:24:28.293661
789	266	https://sbitany.com/image/cache/catalog/113-251-1440-0005-2026020381944-460x460.jpg	2026-03-18 01:24:39.281997
790	267	https://sbitany.com/image/cache/catalog/113-268-0117-0025-2025042964335-460x460.jpg	2026-03-18 01:24:45.177494
791	267	https://sbitany.com/image/cache/catalog/DST7020/vrs_ef83116676a782b549f6cb0d429c-2025042793133-460x460.png	2026-03-18 01:24:45.177873
792	267	https://sbitany.com/image/cache/catalog/DST7020/vrs_dbe2176269b19d63e17a5f086f3d-2025042793133-460x460.png	2026-03-18 01:24:45.178167
793	267	https://sbitany.com/image/cache/catalog/DST7020/vrs_cec24788cc253a6bef1eda43a671-2025042793133-460x460.png	2026-03-18 01:24:45.178428
794	267	https://sbitany.com/image/cache/catalog/DST7020/vrs_1ee7d38cca618223ffac7afe6a02-2025042793133-460x460.png	2026-03-18 01:24:45.178701
795	268	https://sbitany.com/image/cache/catalog/448Coffeecapsule-20200901205833-460x460.png	2026-03-18 01:24:52.560205
796	268	https://sbitany.com/image/cache/catalog/350448Coffeecapsule-20200901205907-460x460.png	2026-03-18 01:24:52.560551
797	268	https://sbitany.com/image/cache/catalog/450350448Coffeecapsule-20200901205938-460x460.png	2026-03-18 01:24:52.56082
798	269	https://sbitany.com/image/cache/catalog/113-251-0124-0008-2025091582154-460x460.jpg	2026-03-18 01:24:59.657622
799	271	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-460x460.jpg	2026-03-18 01:25:36.112341
800	271	https://sbitany.com/image/cache/catalog/3878K/51q2XmNHL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:25:36.11303
801	271	https://sbitany.com/image/cache/catalog/3878K/download-2026-02-24T114942.318-2026031584614-460x460.png	2026-03-18 01:25:36.11326
802	271	https://sbitany.com/image/cache/catalog/3878K/61e62ZdYDRL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:25:36.113463
803	271	https://sbitany.com/image/cache/catalog/3878K/61V-TAQNknL._AC_SL1000-2026031584614-460x460.jpg	2026-03-18 01:25:36.113655
804	272	https://sbitany.com/image/cache/catalog/113-251-0124-0009-2025091582154-460x460.jpg	2026-03-18 01:25:42.963128
805	273	https://sbitany.com/image/cache/catalog/113-297-0632-0001-20260311120410-460x460.jpg	2026-03-18 01:25:48.663706
806	273	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(1)-2026031593115-460x460.jpg	2026-03-18 01:25:48.663948
807	273	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(2)-2026031593115-460x460.jpg	2026-03-18 01:25:48.66415
808	273	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(3)-2026031593115-460x460.jpg	2026-03-18 01:25:48.664375
809	273	https://sbitany.com/image/cache/catalog/OF-6004/%D8%AA%D9%88%D8%B3%D8%AA%D8%B1%D8%A7%D9%88%D9%81%D8%B1%D8%A7%D8%AC%D8%A7%D8%B260(4)-2026031593115-460x460.jpg	2026-03-18 01:25:48.664553
810	274	https://sbitany.com/image/cache/catalog/113-251-1717-0003-20240912123042-460x460.jpg	2026-03-18 01:25:55.584159
811	274	https://sbitany.com/image/cache/catalog/210-02330/210-02330x1-2024092265118-460x460.jpg	2026-03-18 01:25:55.584409
812	275	https://sbitany.com/image/cache/catalog/448Coffeecapsule-20200901205833-460x460.png	2026-03-18 01:26:01.218652
813	275	https://sbitany.com/image/cache/catalog/350448Coffeecapsule-20200901205907-460x460.png	2026-03-18 01:26:01.219133
814	275	https://sbitany.com/image/cache/catalog/450350448Coffeecapsule-20200901205938-460x460.png	2026-03-18 01:26:01.219776
815	276	https://sbitany.com/image/cache/catalog/448Coffeecapsule-20200901205833-460x460.png	2026-03-18 01:26:10.252796
816	276	https://sbitany.com/image/cache/catalog/350448Coffeecapsule-20200901205907-460x460.png	2026-03-18 01:26:10.253606
817	276	https://sbitany.com/image/cache/catalog/450350448Coffeecapsule-20200901205938-460x460.png	2026-03-18 01:26:10.254202
818	277	https://sbitany.com/image/cache/catalog/113-251-1440-0005-2026020381944-460x460.jpg	2026-03-18 01:26:15.976449
819	278	https://sbitany.com/image/cache/catalog/107-634-0074-0001-2025091582144-460x460.jpg	2026-03-18 01:26:23.316742
820	278	https://sbitany.com/image/cache/catalog/WD18DB8995BZT2/download(28)-2025090261114-460x460.png	2026-03-18 01:26:23.317666
821	278	https://sbitany.com/image/cache/catalog/WD18DB8995BZT2/download(29)-2025090261114-460x460.png	2026-03-18 01:26:23.318381
822	278	https://sbitany.com/image/cache/catalog/WD18DB8995BZT2/download(30)-2025090261114-460x460.png	2026-03-18 01:26:23.31903
823	278	https://sbitany.com/image/cache/catalog/WD18DB8995BZT2/download(31)-2025090261114-460x460.png	2026-03-18 01:26:23.3196
824	279	https://sbitany.com/image/cache/catalog/137-307-1349-0001-2025112682336-460x460.jpg	2026-03-18 01:26:28.963668
825	280	https://sbitany.com/image/cache/catalog/137-203-1720-0002-2025051455625-460x460.jpg	2026-03-18 01:26:35.774736
826	281	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:26:43.130839
827	281	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:26:43.131138
828	281	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:26:43.131398
829	281	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:26:43.131616
830	281	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:26:43.131823
831	282	https://sbitany.com/image/cache/catalog/137-203-1720-0001-2025051455625-460x460.jpg	2026-03-18 01:26:50.067135
832	283	https://sbitany.com/image/cache/catalog/137-111-8046-0002-20251210122451-460x460.jpg	2026-03-18 01:26:57.30096
833	284	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:03.025102
834	284	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:03.025385
835	284	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:03.025636
836	284	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:03.025866
837	284	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:03.026102
838	285	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:08.702979
839	285	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:08.703196
840	285	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:08.703374
841	285	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:08.703559
842	285	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:08.703725
843	286	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:17.380024
844	286	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:17.380675
845	286	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:17.380973
846	286	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:17.381242
847	286	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:17.381412
848	287	https://sbitany.com/image/cache/catalog/137-203-1720-0003-2025051455625-460x460.jpg	2026-03-18 01:27:24.229858
849	288	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:29.846153
850	288	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:29.846579
851	288	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:29.846938
852	288	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:29.847243
853	288	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:29.847433
854	289	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:35.522774
855	289	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:35.523087
856	289	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:35.523436
857	289	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:35.523667
858	289	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:35.523869
859	290	https://sbitany.com/image/cache/catalog/101-111-0000-0001-2025042964312-460x460.jpg	2026-03-18 01:27:42.165299
860	291	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:48.011934
861	291	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:48.012414
862	291	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:48.012866
863	291	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:48.013468
864	291	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:48.013917
865	292	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-460x460.jpg	2026-03-18 01:27:53.713675
866	292	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD02-2026021785722-460x460.jpg	2026-03-18 01:27:53.713923
867	292	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD03-2026021785722-460x460.jpg	2026-03-18 01:27:53.7141
868	292	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD04-2026021785722-460x460.jpg	2026-03-18 01:27:53.714259
869	292	https://sbitany.com/image/cache/catalog/A3957H21/A3957Z21_DTC_listing_image_TD05-2026021785722-460x460.jpg	2026-03-18 01:27:53.714404
870	293	https://sbitany.com/image/cache/catalog/137-294-1101-0001-2026021974504-460x460.jpg	2026-03-18 01:28:00.981146
871	293	https://sbitany.com/image/cache/catalog/A3062H21/A3062Z21_DTC_listing_image_en_03-2026021784937-460x460.jpg	2026-03-18 01:28:00.981578
872	293	https://sbitany.com/image/cache/catalog/A3062H21/A3062Z21_Listing_Image_Rich_imag(1)-2026021784937-460x460.jpg	2026-03-18 01:28:00.981896
873	293	https://sbitany.com/image/cache/catalog/A3062H21/A3062Z21_Listing_Image_Rich_imag(2)-2026021784937-460x460.jpg	2026-03-18 01:28:00.982109
874	293	https://sbitany.com/image/cache/catalog/A3062H21/A3062Z21_Listing_Image_Rich_imag-2026021784937-460x460.jpg	2026-03-18 01:28:00.982315
875	294	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:28:06.717103
876	294	https://sbitany.com/image/cache/catalog/113-230-0025-0026-2026020381944-460x460.jpg	2026-03-18 01:28:06.717465
877	294	https://sbitany.com/image/cache/catalog/A9LSLIM.BCBQDAG/download(20)-20260203112138-460x460.png	2026-03-18 01:28:06.717783
878	294	https://sbitany.com/image/cache/catalog/A9LSLIM.BCBQDAG/download(22)-20260203112138-460x460.png	2026-03-18 01:28:06.718095
879	294	https://sbitany.com/image/cache/catalog/A9LSLIM.BCBQDAG/download(23)-20260203112138-460x460.png	2026-03-18 01:28:06.718431
880	295	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:12.618945
881	295	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:12.619587
882	295	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:12.620151
883	295	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:12.620643
884	295	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:12.621258
885	296	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:21.845037
886	296	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:21.845531
887	296	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:21.845799
888	296	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:21.846087
889	296	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:21.846339
890	297	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:27.627807
891	297	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:27.628531
892	297	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:27.628933
893	297	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:27.629228
894	297	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:27.629496
895	298	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-460x460.jpg	2026-03-18 01:28:34.225339
896	299	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:39.913351
897	299	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:39.913694
898	299	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:39.914121
899	299	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:39.914393
900	299	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:39.914692
901	300	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:45.568888
902	300	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:45.569239
903	300	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:45.569492
904	300	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:45.569702
905	300	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:45.569945
906	301	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:51.463836
907	301	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:51.464827
908	301	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:51.465501
909	301	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:51.465931
910	301	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:51.466444
911	302	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:28:57.152247
912	302	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:28:57.152585
913	302	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:28:57.152844
914	302	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:28:57.15308
915	302	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:28:57.15331
916	303	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:29:02.882355
917	303	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:29:02.883023
918	303	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:29:02.883503
919	303	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:29:02.883898
920	303	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:29:02.884534
921	304	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-460x460.jpg	2026-03-18 01:29:08.47403
922	304	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155541.991-20260216140132-460x460.png	2026-03-18 01:29:08.474463
923	304	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155547.599-20260216140132-460x460.png	2026-03-18 01:29:08.474882
924	304	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155553.415-20260216140132-460x460.png	2026-03-18 01:29:08.47521
925	304	https://sbitany.com/image/cache/catalog/SM-A175FZKOMEC/download-2026-02-16T155600.803-20260216140132-460x460.png	2026-03-18 01:29:08.475495
926	305	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:29:15.545314
927	305	https://sbitany.com/image/cache/catalog/113-018-0129-0005-2024052291434-460x460.jpg	2026-03-18 01:29:15.545541
928	306	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-460x460.jpg	2026-03-18 01:29:25.366547
929	307	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-460x460.jpg	2026-03-18 01:29:32.159946
930	308	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-460x460.jpg	2026-03-18 01:29:37.693919
931	309	https://sbitany.com/image/cache/catalog/102-000-1068-0001-20250923125115-460x460.jpg	2026-03-18 01:29:44.647012
932	309	https://sbitany.com/image/cache/catalog/2Z8P4AA/download-2025-09-24T091941.123-2025092462354-460x460.png	2026-03-18 01:29:44.647331
933	309	https://sbitany.com/image/cache/catalog/2Z8P4AA/download-2025-09-24T091948.317-2025092462354-460x460.png	2026-03-18 01:29:44.647569
934	310	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-460x460.jpg	2026-03-18 01:29:50.354659
935	311	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-460x460.jpg	2026-03-18 01:29:56.008933
936	312	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-460x460.jpg	2026-03-18 01:30:01.608305
937	313	https://sbitany.com/image/cache/catalog/105-310-0034-0001-2026020381944-460x460.jpg	2026-03-18 01:30:08.839014
938	313	https://sbitany.com/image/cache/catalog/SAIRHLC2.5RC/download(53)-20260203124718-460x460.png	2026-03-18 01:30:08.839243
939	313	https://sbitany.com/image/cache/catalog/SAIRHLC2.5RC/download(54)-20260203124718-460x460.png	2026-03-18 01:30:08.839422
940	313	https://sbitany.com/image/cache/catalog/SAIRHLC2.5RC/download(55)-20260203124718-460x460.png	2026-03-18 01:30:08.839582
941	313	https://sbitany.com/image/cache/catalog/SAIRHLC2.5RC/download(56)-20260203124718-460x460.png	2026-03-18 01:30:08.839732
942	314	https://sbitany.com/image/cache/catalog/102-272-0067-0010-2025071661336-460x460.jpg	2026-03-18 01:30:15.792115
943	315	https://sbitany.com/image/cache/catalog/102-111-0067-0505-20251210122431-460x460.jpg	2026-03-18 01:30:22.611537
944	316	https://sbitany.com/image/cache/catalog/102-272-0067-0010-2025071661336-460x460.jpg	2026-03-18 01:30:31.588576
945	317	https://sbitany.com/image/cache/catalog/102-272-0067-0010-2025071661336-460x460.jpg	2026-03-18 01:30:37.211525
946	318	https://sbitany.com/image/cache/catalog/107-634-0060-0011-20251027135415-460x460.jpg	2026-03-18 01:30:44.236728
947	318	https://sbitany.com/image/cache/catalog/RS70F64KETML/ps-rs90f-basic-rs70f64ketml-5471(1)-20251026134145-460x460.png	2026-03-18 01:30:44.236975
948	318	https://sbitany.com/image/cache/catalog/RS70F64KETML/ps-rs90f-basic-rs70f64ketml-5471(2)-20251026134145-460x460.png	2026-03-18 01:30:44.237161
949	318	https://sbitany.com/image/cache/catalog/RS70F64KETML/ps-rs90f-basic-rs70f64ketml-5471(3)-20251026134145-460x460.png	2026-03-18 01:30:44.237324
950	318	https://sbitany.com/image/cache/catalog/RS70F64KETML/ps-rs90f-basic-rs70f64ketml-5471(4)-20251026134145-460x460.png	2026-03-18 01:30:44.237511
951	319	https://sbitany.com/image/cache/catalog/107-285-0060-0001-2025091582144-460x460.jpg	2026-03-18 01:30:49.831866
952	319	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(47)-2025091684507-460x460.png	2026-03-18 01:30:49.832494
953	319	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(48)-2025091684507-460x460.png	2026-03-18 01:30:49.832859
954	319	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(49)-2025091684507-460x460.png	2026-03-18 01:30:49.83331
955	319	https://sbitany.com/image/cache/catalog/KF96NVPEA/download(50)-2025091684507-460x460.png	2026-03-18 01:30:49.833708
956	320	https://sbitany.com/image/cache/catalog/107-634-0060-0009-2025091582144-460x460.jpg	2026-03-18 01:30:56.957729
957	320	https://sbitany.com/image/cache/catalog/BRR29723EWW/download-2025-09-16T102633.753-2025091673111-460x460.png	2026-03-18 01:30:56.958003
958	320	https://sbitany.com/image/cache/catalog/BRR29723EWW/download-2025-09-16T102639.629-2025091673111-460x460.png	2026-03-18 01:30:56.958239
959	320	https://sbitany.com/image/cache/catalog/BRR29723EWW/download-2025-09-16T102646.417-2025091673111-460x460.png	2026-03-18 01:30:56.958487
960	320	https://sbitany.com/image/cache/catalog/BRR29723EWW/download-2025-09-16T102650.939-2025091673111-460x460.png	2026-03-18 01:30:56.958743
961	321	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:31:02.653805
962	321	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:02.654077
963	321	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:02.654313
964	321	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:02.654586
965	321	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:02.654813
966	322	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-460x460.jpg	2026-03-18 01:31:08.250535
967	322	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_47_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:08.250786
968	322	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_48_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:08.251115
969	322	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_49_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:08.251374
970	322	https://sbitany.com/image/cache/catalog/GR-M777LSU/imgi_50_thum-1600x1062-20251029121023-460x460.jpg	2026-03-18 01:31:08.251593
971	323	https://sbitany.com/image/cache/catalog/107-285-2667-0005-2025080395528-460x460.jpg	2026-03-18 01:31:13.825588
972	323	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155447.898-20260108135853-460x460.png	2026-03-18 01:31:13.825829
973	323	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155452.208-20260108135853-460x460.png	2026-03-18 01:31:13.826011
974	323	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155456.769-20260108135902-460x460.png	2026-03-18 01:31:13.826173
975	323	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155501.384-20260108135902-460x460.png	2026-03-18 01:31:13.82632
976	324	https://sbitany.com/image/cache/catalog/107-285-2667-0005-2025080395528-460x460.jpg	2026-03-18 01:31:19.295742
977	324	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155447.898-20260108135853-460x460.png	2026-03-18 01:31:19.296034
978	324	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155452.208-20260108135853-460x460.png	2026-03-18 01:31:19.29626
979	324	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155456.769-20260108135902-460x460.png	2026-03-18 01:31:19.296497
980	324	https://sbitany.com/image/cache/catalog/HB279GEB7/download-2026-01-08T155501.384-20260108135902-460x460.png	2026-03-18 01:31:19.296676
981	325	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-460x460.jpg	2026-03-18 01:31:24.985814
982	325	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(1)-20251028143831-460x460.png	2026-03-18 01:31:24.986323
983	325	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(2)-20251028143831-460x460.png	2026-03-18 01:31:24.986759
984	325	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(3)-20251028143831-460x460.png	2026-03-18 01:31:24.987158
985	325	https://sbitany.com/image/cache/catalog/NV68A1140BSEF/ps-nv3300a-nv68a1140bs-nv68a1140(4)-20251028143831-460x460.png	2026-03-18 01:31:24.98754
986	326	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:31:35.364844
987	326	https://sbitany.com/image/cache/catalog/104-268-1963-0001-20220331112209-460x460.jpg	2026-03-18 01:31:35.36529
988	326	https://sbitany.com/image/cache/catalog/Screenshotd02747-2022033085103-460x460.png	2026-03-18 01:31:35.365586
989	326	https://sbitany.com/image/cache/catalog/Screenshklkj102713-2022033085027-460x460.png	2026-03-18 01:31:35.365791
990	326	https://sbitany.com/image/cache/catalog/afcba685b23d4dfc9a96ae7d00c4129e-2022081871512-460x460.jpg	2026-03-18 01:31:35.365985
991	327	https://sbitany.com/image/cache/catalog/104-315-1964-0001-2026021974437-460x460.jpg	2026-03-18 01:31:42.140131
992	327	https://sbitany.com/image/cache/catalog/MOMOKO/download(66)-2026021681844-460x460.png	2026-03-18 01:31:42.140437
993	327	https://sbitany.com/image/cache/catalog/MOMOKO/download(67)-2026021681844-460x460.png	2026-03-18 01:31:42.140643
994	327	https://sbitany.com/image/cache/catalog/MOMOKO/download(68)-2026021681844-460x460.png	2026-03-18 01:31:42.14083
995	328	https://sbitany.com/image/cache/catalog/104-018-1959-0002-20230315134927-460x460.jpg	2026-03-18 01:31:49.201485
996	329	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:31:54.809623
997	329	https://sbitany.com/image/cache/catalog/104-315-1960-0001-2026021974437-460x460.jpg	2026-03-18 01:31:54.810092
998	329	https://sbitany.com/image/cache/catalog/SHIZU/download(71)-2026021681747-460x460.png	2026-03-18 01:31:54.810446
999	329	https://sbitany.com/image/cache/catalog/SHIZU/download(72)-2026021681747-460x460.png	2026-03-18 01:31:54.810777
1000	329	https://sbitany.com/image/cache/catalog/SHIZU/download(73)-2026021681747-460x460.png	2026-03-18 01:31:54.811021
1001	330	https://sbitany.com/image/cache/catalog/104-268-1963-0002-20230928120506-460x460.jpg	2026-03-18 01:32:01.709945
1002	331	https://sbitany.com/image/cache/catalog/104-268-1969-0002-20230928120506-460x460.jpg	2026-03-18 01:32:10.935214
1003	331	https://sbitany.com/image/cache/catalog/QP2724/abdf0bf78eae43fc9a80af3200bde3e1-20231116100906-460x460.jpg	2026-03-18 01:32:10.935967
1004	331	https://sbitany.com/image/cache/catalog/QP2724/75609254011c4a859468af5c01087a72-20231116100906-460x460.jpg	2026-03-18 01:32:10.936725
1005	331	https://sbitany.com/image/cache/catalog/QP2724/038b9abc4cfd4da79215ae9200f5cb4c-20231116100906-460x460.jpg	2026-03-18 01:32:10.937319
1006	331	https://sbitany.com/image/cache/catalog/QP2724/15708b0fb3854275ad63ae9200de1bce-20231116100906-460x460.jpg	2026-03-18 01:32:10.937945
1007	332	https://sbitany.com/image/cache/catalog/104-018-2680-0001-20230315134934-460x460.jpg	2026-03-18 01:32:17.872858
1008	333	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:32:25.247289
1009	333	https://sbitany.com/image/cache/catalog/104-268-1959-0006-2023051794709-460x460.jpg	2026-03-18 01:32:25.247954
1010	333	https://sbitany.com/image/cache/catalog/BRE23500/download(12)-2023051874501-460x460.jpg	2026-03-18 01:32:25.24854
1011	333	https://sbitany.com/image/cache/catalog/BRE23500/download(13)-2023051874501-460x460.jpg	2026-03-18 01:32:25.249152
1012	333	https://sbitany.com/image/cache/catalog/BRE23500/download(14)-2023051874501-460x460.jpg	2026-03-18 01:32:25.249706
1013	334	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:32:32.321935
1014	334	https://sbitany.com/image/cache/catalog/104-264-1965-0004-20240214122755-460x460.jpg	2026-03-18 01:32:32.322376
1015	334	https://sbitany.com/image/cache/catalog/IPL030IL01SBT%20Sensilight%20Mini/download-2024-02-13T145351.683-2024021495941-460x460.png	2026-03-18 01:32:32.32276
1016	334	https://sbitany.com/image/cache/catalog/IPL030IL01SBT%20Sensilight%20Mini/download-2024-02-13T145424.733-2024021495941-460x460.png	2026-03-18 01:32:32.323108
1017	334	https://sbitany.com/image/cache/catalog/IPL030IL01SBT%20Sensilight%20Mini/download-2024-02-13T145356.813-2024021495941-460x460.png	2026-03-18 01:32:32.323457
1018	335	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:32:39.217957
1019	335	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-460x460.jpg	2026-03-18 01:32:39.219018
1020	336	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:32:47.928709
1021	336	https://sbitany.com/image/cache/catalog/104-268-1959-0006-2023051794709-460x460.jpg	2026-03-18 01:32:47.929588
1022	336	https://sbitany.com/image/cache/catalog/BRE23500/download(12)-2023051874501-460x460.jpg	2026-03-18 01:32:47.930225
1023	336	https://sbitany.com/image/cache/catalog/BRE23500/download(13)-2023051874501-460x460.jpg	2026-03-18 01:32:47.930853
1024	336	https://sbitany.com/image/cache/catalog/BRE23500/download(14)-2023051874501-460x460.jpg	2026-03-18 01:32:47.931447
1025	337	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:32:53.538795
1026	337	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-460x460.jpg	2026-03-18 01:32:53.539444
1027	338	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:32:59.08031
1028	338	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-460x460.jpg	2026-03-18 01:32:59.080578
1029	339	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:33:05.813447
1030	339	https://sbitany.com/image/cache/catalog/104-268-0137-0001-2024122492601-460x460.jpg	2026-03-18 01:33:05.814075
1031	340	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:33:11.317359
1032	340	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-460x460.jpg	2026-03-18 01:33:11.31763
1033	341	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:33:16.883236
1034	341	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-460x460.jpg	2026-03-18 01:33:16.883757
1035	342	https://sbitany.com/image/cache/catalog/113-268-0138-0004-20250206115459-460x460.jpg	2026-03-18 01:33:24.061014
1036	342	https://sbitany.com/image/cache/catalog/BHB876/download-2025-02-05T143152.746-20250205123756-460x460.png	2026-03-18 01:33:24.061415
1037	342	https://sbitany.com/image/cache/catalog/BHB876/download-2025-02-05T143201.634-20250205123756-460x460.png	2026-03-18 01:33:24.061743
1038	342	https://sbitany.com/image/cache/catalog/BHB876/download-2025-02-05T143207.681-20250205123756-460x460.png	2026-03-18 01:33:24.062029
1039	342	https://sbitany.com/image/cache/catalog/BHB876/download-2025-02-05T143213.578-20250205123756-460x460.png	2026-03-18 01:33:24.06236
1040	343	https://sbitany.com/image/cache/catalog/104-268-1955-0005-20240605122941-460x460.jpg	2026-03-18 01:33:30.972111
1041	343	https://sbitany.com/image/cache/catalog/BHD272/download-2024-06-05T152822.937-20240605123037-460x460.jpg	2026-03-18 01:33:30.97244
1042	343	https://sbitany.com/image/cache/catalog/BHD272/download-2024-06-05T152827.502-20240605123037-460x460.jpg	2026-03-18 01:33:30.972725
1043	343	https://sbitany.com/image/cache/catalog/BHD272/download-2024-06-05T152832.079-20240605123037-460x460.jpg	2026-03-18 01:33:30.972902
1044	343	https://sbitany.com/image/cache/catalog/BHD272/download-2024-06-05T152836.165-20240605123037-460x460.jpg	2026-03-18 01:33:30.973062
1045	344	https://sbitany.com/image/cache/catalog/104-204-1964-0002-20251015102655-460x460.jpg	2026-03-18 01:33:37.861259
1046	344	https://sbitany.com/image/cache/catalog/GF0092EU/6b87db4e-99a5-4290-a875-7911191cd5f4_cropped.jpg_720-20251015130650-460x460.png	2026-03-18 01:33:37.861484
1047	344	https://sbitany.com/image/cache/catalog/GF0092EU/ca51d7ab-fc9c-4217-932b-9a43495ff707_cropped_720-20251015130650-460x460.png	2026-03-18 01:33:37.861655
1048	344	https://sbitany.com/image/cache/catalog/GF0092EU/ddc810f0-5a27-47a6-8907-c004021891a5_cropped_720-20251015130650-460x460.png	2026-03-18 01:33:37.861809
1049	344	https://sbitany.com/image/cache/catalog/GF0092EU/c50f2ac5-de45-46cc-8968-683044ddd2e3.jpg_720-20251015130650-460x460.png	2026-03-18 01:33:37.861956
1050	345	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:33:45.395857
1051	345	https://sbitany.com/image/cache/catalog/104-204-1963-0002-20211117113944-460x460.jpg	2026-03-18 01:33:45.396214
1052	345	https://sbitany.com/image/cache/catalog/chi_stijltang-20211116130236-460x460.png	2026-03-18 01:33:45.39642
1053	345	https://sbitany.com/image/cache/catalog/PI_637074369082441205_zoom-20211116130407-460x460.jpg	2026-03-18 01:33:45.396592
1054	345	https://sbitany.com/image/cache/catalog/PI_637075146072697938_zoom-20211116130446-460x460.jpg	2026-03-18 01:33:45.39675
1055	346	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:33:54.12007
1056	346	https://sbitany.com/image/cache/catalog/104-204-1963-0002-20211117113944-460x460.jpg	2026-03-18 01:33:54.120371
1057	346	https://sbitany.com/image/cache/catalog/chi_stijltang-20211116130236-460x460.png	2026-03-18 01:33:54.120592
1058	346	https://sbitany.com/image/cache/catalog/PI_637074369082441205_zoom-20211116130407-460x460.jpg	2026-03-18 01:33:54.120868
1059	346	https://sbitany.com/image/cache/catalog/PI_637075146072697938_zoom-20211116130446-460x460.jpg	2026-03-18 01:33:54.121106
1060	347	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:34:01.267986
1061	347	https://sbitany.com/image/cache/catalog/104-500-1965-0002-2026011184245-460x460.jpg	2026-03-18 01:34:01.268204
1062	347	https://sbitany.com/image/cache/catalog/IPL%205152/Braun_SilkExpert_Pro5_Premium_aPlusContent_Desktop_1464x600_M5.3_EU_113480832-20251230112616-460x460.jpeg	2026-03-18 01:34:01.268371
1063	347	https://sbitany.com/image/cache/catalog/IPL%205152/PL5152_EURO_C1N1_96929820-20251230112616-460x460.jpeg	2026-03-18 01:34:01.268527
1064	348	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:34:08.219647
1065	348	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:34:08.21996
1066	348	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:34:08.220256
1067	348	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:34:08.220488
1068	349	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:34:14.083229
1069	349	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:34:14.083705
1070	349	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:34:14.084087
1071	349	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:34:14.084342
1072	350	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:34:21.151169
1073	350	https://sbitany.com/image/cache/catalog/104-204-2680-0001-2025012971438-460x460.jpg	2026-03-18 01:34:21.151476
1074	350	https://sbitany.com/image/cache/catalog/GF8343EU/1024x1024-GF8343-CHI-Vibes-Wave-On-Waver-Iron_0000_WEB-20250130143556-460x460.jpg	2026-03-18 01:34:21.151742
1075	350	https://sbitany.com/image/cache/catalog/GF8343EU/1024x1024-GF8343-CHI-Vibes-Wave-On-Waver-Iron_0004_2in1_WEB-20250130143556-460x460.jpg	2026-03-18 01:34:21.151945
1076	350	https://sbitany.com/image/cache/catalog/GF8343EU/1024x1024-GF8343-CHI-Vibes-Wave-On-Waver-Iron_0001_WEB-20250130143556-460x460.jpg	2026-03-18 01:34:21.152115
1077	351	https://sbitany.com/image/cache/catalog/104-268-1959-0002-80-20210117102039-460x460.jpg	2026-03-18 01:34:28.042062
1078	351	https://sbitany.com/image/cache/catalog/jdjdkjv-20210113124512-460x460.PNG	2026-03-18 01:34:28.042328
1079	351	https://sbitany.com/image/cache/catalog/mghnfmghnmn-20210113124612-460x460.PNG	2026-03-18 01:34:28.04256
1080	351	https://sbitany.com/image/cache/catalog/jfjnhnh-20210113124437-460x460.PNG	2026-03-18 01:34:28.042772
1081	352	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:34:33.697867
1082	352	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:34:33.69814
1083	352	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:34:33.698369
1084	352	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:34:33.698579
1085	353	https://sbitany.com/image/cache/catalog/104-268-1969-0002-20230928120506-460x460.jpg	2026-03-18 01:34:39.283739
1086	353	https://sbitany.com/image/cache/catalog/QP2724/abdf0bf78eae43fc9a80af3200bde3e1-20231116100906-460x460.jpg	2026-03-18 01:34:39.28398
1087	353	https://sbitany.com/image/cache/catalog/QP2724/75609254011c4a859468af5c01087a72-20231116100906-460x460.jpg	2026-03-18 01:34:39.284226
1088	353	https://sbitany.com/image/cache/catalog/QP2724/038b9abc4cfd4da79215ae9200f5cb4c-20231116100906-460x460.jpg	2026-03-18 01:34:39.284417
1089	353	https://sbitany.com/image/cache/catalog/QP2724/15708b0fb3854275ad63ae9200de1bce-20231116100906-460x460.jpg	2026-03-18 01:34:39.284587
1090	354	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:34:44.955211
1091	354	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:34:44.955478
1092	354	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:34:44.9557
1093	354	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:34:44.955905
1094	355	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:34:51.309462
1095	355	https://sbitany.com/image/cache/catalog/104-204-1963-0002-20211117113944-460x460.jpg	2026-03-18 01:34:51.309693
1096	355	https://sbitany.com/image/cache/catalog/chi_stijltang-20211116130236-460x460.png	2026-03-18 01:34:51.309868
1097	355	https://sbitany.com/image/cache/catalog/PI_637074369082441205_zoom-20211116130407-460x460.jpg	2026-03-18 01:34:51.310027
1098	355	https://sbitany.com/image/cache/catalog/PI_637075146072697938_zoom-20211116130446-460x460.jpg	2026-03-18 01:34:51.310184
1099	356	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:35:01.254162
1100	356	https://sbitany.com/image/cache/catalog/104-204-1960-0001-2025012971438-460x460.jpg	2026-03-18 01:35:01.254384
1101	356	https://sbitany.com/image/cache/catalog/CA7557EU/1024x1024-CA7557-CHI-4-in-1-Blowout-Brush_0000_Compact_WEB-20250130134009-460x460.jpg	2026-03-18 01:35:01.254561
1102	356	https://sbitany.com/image/cache/catalog/CA7557EU/1024x1024-CA7557-CHI-4-in-1-Blowout-Brush_0002_Bristles_WEB-20250130134009-460x460.jpg	2026-03-18 01:35:01.254727
1103	356	https://sbitany.com/image/cache/catalog/CA7557EU/1024x1024-CA7557-CHI-4-in-1-Blowout-Brush_0003_Ceramic-Compound_WEB-20250130134009-460x460.jpg	2026-03-18 01:35:01.25497
1104	357	https://sbitany.com/image/cache/catalog/104-018-1955-0005-20230315134927-460x460.jpg	2026-03-18 01:35:07.974425
1105	358	https://sbitany.com/image/cache/catalog/104-191-1963-0003-20230202140010-460x460.jpg	2026-03-18 01:35:14.870463
1106	358	https://sbitany.com/image/cache/catalog/HS%207034/image(1)-2023010982014-460x460.png	2026-03-18 01:35:14.870826
1107	358	https://sbitany.com/image/cache/catalog/HS%207034/image-2023010982014-460x460.png	2026-03-18 01:35:14.871019
1108	358	https://sbitany.com/image/cache/catalog/HS%207034/Screenshot2023-01-09100357-2023010982058-460x460.png	2026-03-18 01:35:14.871187
1109	358	https://sbitany.com/image/cache/catalog/HS%207034/Screenshot2023-01-09100315-2023010982058-460x460.png	2026-03-18 01:35:14.871348
1110	359	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:35:20.507959
1111	359	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:35:20.508523
1112	359	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:35:20.508791
1113	359	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:35:20.509095
1114	360	https://sbitany.com/image/cache/catalog/104-268-0141-0001-20241225111152-460x460.jpg	2026-03-18 01:35:27.485914
1115	361	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:35:33.013233
1116	361	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:35:33.013695
1117	361	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:35:33.014006
1118	361	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:35:33.01429
1119	362	https://sbitany.com/image/cache/catalog/104-853-0139-0001-20251027135215-460x460.jpg	2026-03-18 01:35:39.946264
1120	362	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/533896-01-20251026133755-460x460.png	2026-03-18 01:35:39.946539
1121	362	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-2-30mm-Long-BNKBCO-20251026133755-460x460.png	2026-03-18 01:35:39.946762
1122	362	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-4-Dryer-Dry-BNKBCO-20251026133755-460x460.png	2026-03-18 01:35:39.946984
1123	362	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-5-Dryer-Smooth-BNKBCO-20251026133755-460x460.png	2026-03-18 01:35:39.947161
1124	363	https://sbitany.com/image/cache/catalog/104-268-1307-0001-20251015102655-460x460.jpg	2026-03-18 01:35:46.84494
1125	363	https://sbitany.com/image/cache/catalog/SC1997/3184556c0b174be89873af4a00ea0717-20251015122712-460x460.png	2026-03-18 01:35:46.845272
1126	363	https://sbitany.com/image/cache/catalog/SC1997/ef5175bc09964e41aa11af4a009e21f2-20251015122712-460x460.png	2026-03-18 01:35:46.845473
1127	364	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:35:52.45018
1128	364	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:35:52.450575
1129	364	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:35:52.450868
1130	364	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:35:52.451122
1131	365	https://sbitany.com/image/cache/catalog/104-459-0137-0001-2024121691801-460x460.jpg	2026-03-18 01:35:59.245946
1132	366	https://sbitany.com/image/cache/catalog/104-268-1307-0001-20251015102655-460x460.jpg	2026-03-18 01:36:07.839153
1133	366	https://sbitany.com/image/cache/catalog/SC1997/3184556c0b174be89873af4a00ea0717-20251015122712-460x460.png	2026-03-18 01:36:07.839641
1134	366	https://sbitany.com/image/cache/catalog/SC1997/ef5175bc09964e41aa11af4a009e21f2-20251015122712-460x460.png	2026-03-18 01:36:07.84002
1135	367	https://sbitany.com/image/cache/catalog/104-268-1969-0002-20230928120506-460x460.jpg	2026-03-18 01:36:13.371582
1136	367	https://sbitany.com/image/cache/catalog/QP2724/abdf0bf78eae43fc9a80af3200bde3e1-20231116100906-460x460.jpg	2026-03-18 01:36:13.37217
1137	367	https://sbitany.com/image/cache/catalog/QP2724/75609254011c4a859468af5c01087a72-20231116100906-460x460.jpg	2026-03-18 01:36:13.372631
1138	367	https://sbitany.com/image/cache/catalog/QP2724/038b9abc4cfd4da79215ae9200f5cb4c-20231116100906-460x460.jpg	2026-03-18 01:36:13.372988
1139	367	https://sbitany.com/image/cache/catalog/QP2724/15708b0fb3854275ad63ae9200de1bce-20231116100906-460x460.jpg	2026-03-18 01:36:13.373302
1140	368	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:36:20.399798
1141	368	https://sbitany.com/image/cache/catalog/168-289-1443-0001-2025091582215-460x460.jpg	2026-03-18 01:36:20.400478
1142	368	https://sbitany.com/image/cache/catalog/Medics%20Care%20N8/download(58)-20250915123021-460x460.png	2026-03-18 01:36:20.402189
1143	368	https://sbitany.com/image/cache/catalog/Medics%20Care%20N8/download(59)-20250915123021-460x460.png	2026-03-18 01:36:20.402479
1144	368	https://sbitany.com/image/cache/catalog/Medics%20Care%20N8/download(60)-20250915123021-460x460.png	2026-03-18 01:36:20.402751
1145	369	https://sbitany.com/image/cache/catalog/104-204-1955-0001-2025012971438-460x460.jpg	2026-03-18 01:36:27.308703
1146	369	https://sbitany.com/image/cache/catalog/GF8815EU/CHI-LAVA-Pro-Hair-Dryer-top-20250130124619-460x460.jpg	2026-03-18 01:36:27.308967
1147	369	https://sbitany.com/image/cache/catalog/GF8815EU/CHI-LAVA-Pro-Hair-Dryer-angle-20250130124619-460x460.jpg	2026-03-18 01:36:27.309205
1148	369	https://sbitany.com/image/cache/catalog/GF8815EU/CHI-LAVA-New-Dryer-digital-20250130124619-460x460.jpg	2026-03-18 01:36:27.309435
1149	369	https://sbitany.com/image/cache/catalog/GF8815EU/CHI-LAVA-New-Dryer-Smoothing-Nozzle-20250130124619-460x460.jpg	2026-03-18 01:36:27.309653
1150	370	https://sbitany.com/image/cache/catalog/104-853-0139-0001-20251027135215-460x460.jpg	2026-03-18 01:36:32.860265
1151	370	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/533896-01-20251026133755-460x460.png	2026-03-18 01:36:32.860878
1152	370	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-2-30mm-Long-BNKBCO-20251026133755-460x460.png	2026-03-18 01:36:32.861327
1153	370	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-4-Dryer-Dry-BNKBCO-20251026133755-460x460.png	2026-03-18 01:36:32.861704
1154	370	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-5-Dryer-Smooth-BNKBCO-20251026133755-460x460.png	2026-03-18 01:36:32.862047
1155	371	https://sbitany.com/image/cache/catalog/Label/Artboard27-2026031195422-100x100.png	2026-03-18 01:36:38.384678
1156	371	https://sbitany.com/image/cache/catalog/104-500-1965-0002-2026011184245-460x460.jpg	2026-03-18 01:36:38.385103
1157	371	https://sbitany.com/image/cache/catalog/IPL%205152/Braun_SilkExpert_Pro5_Premium_aPlusContent_Desktop_1464x600_M5.3_EU_113480832-20251230112616-460x460.jpeg	2026-03-18 01:36:38.385781
1158	371	https://sbitany.com/image/cache/catalog/IPL%205152/PL5152_EURO_C1N1_96929820-20251230112616-460x460.jpeg	2026-03-18 01:36:38.38616
1159	372	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-460x460.jpg	2026-03-18 01:36:44.126859
1160	372	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3_Grey_EU_SecondaryImage05_110189656-20251230105049-460x460.png	2026-03-18 01:36:44.127071
1161	372	https://sbitany.com/image/cache/catalog/BT3560/Braun_BT3560_Out_of_pack_option_3_108506822-20251230105049-460x460.png	2026-03-18 01:36:44.127246
1162	372	https://sbitany.com/image/cache/catalog/BT3560/Styler40lengths7500435244961_BT3560_MN_C1N1_107829388-20251230105440-460x460.png	2026-03-18 01:36:44.127414
1163	373	https://sbitany.com/image/cache/catalog/104-102-1955-0002-2024010283350-460x460.jpg	2026-03-18 01:36:51.233165
1164	373	https://sbitany.com/image/cache/catalog/Glory%20RS/download(40)-2024010284231-460x460.jpg	2026-03-18 01:36:51.233599
1165	373	https://sbitany.com/image/cache/catalog/Glory%20RS/download(41)-2024010284231-460x460.jpg	2026-03-18 01:36:51.233997
1166	373	https://sbitany.com/image/cache/catalog/Glory%20RS/download(42)-2024010284231-460x460.jpg	2026-03-18 01:36:51.234441
1167	373	https://sbitany.com/image/cache/catalog/Glory%20RS/download(43)-2024010284231-460x460.jpg	2026-03-18 01:36:51.234776
1168	374	https://sbitany.com/image/cache/catalog/104-853-0139-0001-20251027135215-460x460.jpg	2026-03-18 01:36:56.713022
1169	374	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/533896-01-20251026133755-460x460.png	2026-03-18 01:36:56.713759
1170	374	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-2-30mm-Long-BNKBCO-20251026133755-460x460.png	2026-03-18 01:36:56.714403
1171	374	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-4-Dryer-Dry-BNKBCO-20251026133755-460x460.png	2026-03-18 01:36:56.714918
1172	374	https://sbitany.com/image/cache/catalog/Long%20Airwrap%20Lite%20HS05%20560704-01/Gallery-5-Dryer-Smooth-BNKBCO-20251026133755-460x460.png	2026-03-18 01:36:56.715393
1173	375	https://sbitany.com/image/cache/catalog/104-204-1964-0001-2025012971438-460x460.jpg	2026-03-18 01:37:03.765276
1174	375	https://sbitany.com/image/cache/catalog/GF8301EU/1024x1024-GF8301-Lava-Interchangeable-Wand_0007_Thermal-Glove_WEB-20250130141740-460x460.jpg	2026-03-18 01:37:03.765713
1175	375	https://sbitany.com/image/cache/catalog/GF8301EU/1024x1024-GF8301-Lava-Interchangeable-Wand_0006_Lava-Minerals_WEB-20250130141740-460x460.jpg	2026-03-18 01:37:03.766125
1176	375	https://sbitany.com/image/cache/catalog/GF8301EU/1024x1024-GF8301-Lava-Interchangeable-Wand_0005_Durable-Barrels_WEB-20250130141740-460x460.jpg	2026-03-18 01:37:03.766485
1177	375	https://sbitany.com/image/cache/catalog/GF8301EU/1024x1024-GF8301-Lava-Interchangeable-Wand_0004_WEB-20250130141740-460x460.jpg	2026-03-18 01:37:03.766842
1178	376	https://sbitany.com/image/cache/catalog/111-914-0207-0002-20250820101827-460x460.jpg	2026-03-18 01:37:13.770216
1179	377	https://sbitany.com/image/cache/catalog/111-914-0207-0002-20250820101827-460x460.jpg	2026-03-18 01:37:19.319889
1180	378	https://sbitany.com/image/cache/catalog/111-914-0207-0002-20250820101827-460x460.jpg	2026-03-18 01:37:24.913724
1181	379	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-460x460.jpg	2026-03-18 01:37:32.567329
1182	380	https://sbitany.com/image/cache/catalog/103-171-8122-0001-2026021974437-460x460.jpg	2026-03-18 01:37:39.298935
1183	380	https://sbitany.com/image/cache/catalog/PS5W/download(61)-2026021674442-460x460.png	2026-03-18 01:37:39.300154
1184	380	https://sbitany.com/image/cache/catalog/PS5W/download(63)-2026021674442-460x460.png	2026-03-18 01:37:39.301413
1185	380	https://sbitany.com/image/cache/catalog/PS5W/download(64)-2026021674442-460x460.png	2026-03-18 01:37:39.302208
1186	381	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-460x460.jpg	2026-03-18 01:37:46.733347
1187	382	https://sbitany.com/image/cache/catalog/103-305-0279-0031-20240205105654-460x460.jpg	2026-03-18 01:37:53.451964
\.


--
-- TOC entry 5321 (class 0 OID 16708)
-- Dependencies: 244
-- Data for Name: product_specs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_specs (id, product_id, spec_key, spec_value, created_at) FROM stdin;
71	40	Color	Stainless Steel	2026-03-18 01:00:58.156951
72	40	Gas Hob	Yes	2026-03-18 01:00:58.157773
73	40	Gas Oven	Yes	2026-03-18 01:00:58.158149
74	40	Electric Oven	No	2026-03-18 01:00:58.158469
75	40	Timer	Yes	2026-03-18 01:00:58.158719
76	40	Number Of Burners	4	2026-03-18 01:00:58.158943
77	40	Cast Iron Pan Support	Yes	2026-03-18 01:00:58.159214
78	40	Enameled Pan Support	No	2026-03-18 01:00:58.159475
79	40	Triple Burner	Yes	2026-03-18 01:00:58.159795
80	40	Flame Failure Safety Device (Hob)	Yes	2026-03-18 01:00:58.160069
81	40	Cavity (Liters)	65	2026-03-18 01:00:58.160295
82	40	Rotisserie	Yes	2026-03-18 01:00:58.160539
83	40	Number of Glass Doors	2	2026-03-18 01:00:58.160721
84	40	Removable Inner Glass Door	Yes	2026-03-18 01:00:58.160927
85	40	Number Of Side Tracks	No	2026-03-18 01:00:58.161172
86	40	Number Of Trays	1	2026-03-18 01:00:58.161379
87	40	Flame Failure Safety Device (Oven)	Yes	2026-03-18 01:00:58.161566
88	40	Closed Door Grilling	Yes	2026-03-18 01:00:58.161846
89	40	Convection Oven	No	2026-03-18 01:00:58.162015
90	40	Digital Thermostat	No	2026-03-18 01:00:58.162193
91	40	Analog Thermostat	Yes	2026-03-18 01:00:58.162348
92	40	Storage Compartment	Yes	2026-03-18 01:00:58.162506
93	40	Country Of Origin	Italy	2026-03-18 01:00:58.162721
94	40	Weight (Kg)	42	2026-03-18 01:00:58.162967
95	40	Warranty (Device) Years	1	2026-03-18 01:00:58.163182
96	40	Product Width (Cm)	60	2026-03-18 01:00:58.163339
97	40	Product Depth (Cm)	60	2026-03-18 01:00:58.163534
98	40	Product Height (Cm)	85	2026-03-18 01:00:58.163754
99	45	Color	Stainless Steel	2026-03-18 01:01:32.002915
100	45	Capacity (Liters)	65	2026-03-18 01:01:32.003195
101	45	Functions/Programs	8	2026-03-18 01:01:32.00347
102	45	Power (Watts)	2600	2026-03-18 01:01:32.003761
103	45	Digital Touch Control	No	2026-03-18 01:01:32.00398
104	45	Digital control	No	2026-03-18 01:01:32.004154
105	45	Mechanical control	Yes	2026-03-18 01:01:32.004343
106	45	Convection Oven	No	2026-03-18 01:01:32.004521
107	45	Telescopic Shelves	No	2026-03-18 01:01:32.004701
108	45	Self Clean Function	No	2026-03-18 01:01:32.004873
109	45	Pyrolytic Cleaning	No	2026-03-18 01:01:32.005033
110	45	Catalytic Liners/Cleaning	No	2026-03-18 01:01:32.005186
111	45	Number Of Trays	1	2026-03-18 01:01:32.005334
112	45	Number Of Grids	1	2026-03-18 01:01:32.005482
113	45	Number of Glass Doors	2	2026-03-18 01:01:32.005632
114	45	Country Of Origin	Turkey	2026-03-18 01:01:32.005774
115	45	Energy Grade	A	2026-03-18 01:01:32.005915
116	45	Weight (Kg)	39	2026-03-18 01:01:32.006065
117	45	Warranty (Device) Years	1	2026-03-18 01:01:32.006334
118	45	Product Width (Cm)	59.5	2026-03-18 01:01:32.006561
119	45	Product Depth (Cm)	56.5	2026-03-18 01:01:32.006748
120	45	Product Height (Cm)	59.5	2026-03-18 01:01:32.006956
121	54	Color	Stainless Steel	2026-03-18 01:02:28.438786
122	54	Gas Hob	Yes	2026-03-18 01:02:28.43958
123	54	Gas Oven	Yes	2026-03-18 01:02:28.440104
124	54	Electric Oven	No	2026-03-18 01:02:28.440506
125	54	Timer	Yes	2026-03-18 01:02:28.440894
126	54	Number Of Burners	4	2026-03-18 01:02:28.441279
127	54	Cast Iron Pan Support	Yes	2026-03-18 01:02:28.441677
128	54	Enameled Pan Support	No	2026-03-18 01:02:28.441979
129	54	Triple Burner	Yes	2026-03-18 01:02:28.442251
130	54	Flame Failure Safety Device (Hob)	Yes	2026-03-18 01:02:28.442512
131	54	Cavity (Liters)	65	2026-03-18 01:02:28.442768
132	54	Rotisserie	Yes	2026-03-18 01:02:28.443025
133	54	Number of Glass Doors	2	2026-03-18 01:02:28.443248
134	54	Removable Inner Glass Door	Yes	2026-03-18 01:02:28.443423
135	54	Number Of Side Tracks	No	2026-03-18 01:02:28.443605
136	54	Number Of Trays	1	2026-03-18 01:02:28.443788
137	54	Flame Failure Safety Device (Oven)	Yes	2026-03-18 01:02:28.444039
138	54	Closed Door Grilling	Yes	2026-03-18 01:02:28.444386
139	54	Convection Oven	No	2026-03-18 01:02:28.444601
140	54	Digital Thermostat	No	2026-03-18 01:02:28.44478
141	54	Analog Thermostat	Yes	2026-03-18 01:02:28.444952
142	54	Storage Compartment	Yes	2026-03-18 01:02:28.445116
143	54	Country Of Origin	Italy	2026-03-18 01:02:28.445379
144	54	Weight (Kg)	42	2026-03-18 01:02:28.445561
145	54	Warranty (Device) Years	1	2026-03-18 01:02:28.445718
146	54	Product Width (Cm)	60	2026-03-18 01:02:28.445868
147	54	Product Depth (Cm)	60	2026-03-18 01:02:28.446021
148	54	Product Height (Cm)	85	2026-03-18 01:02:28.446168
149	55	Size ( Cm )	90	2026-03-18 01:02:35.426458
150	55	Material	Stainless Steel / Glass	2026-03-18 01:02:35.42699
151	55	Type Of Hood	Wall Mount	2026-03-18 01:02:35.427455
152	55	Control	Touch Control	2026-03-18 01:02:35.427903
153	55	Charcoal Filter	Yes	2026-03-18 01:02:35.428364
154	55	Number Of Charcoal Filters	2	2026-03-18 01:02:35.428827
155	55	Removable Charcoal Filter	Yes	2026-03-18 01:02:35.42935
156	55	Dishwasher Safe Aluminum Filter	Yes	2026-03-18 01:02:35.429956
157	55	Number Of Motors	1	2026-03-18 01:02:35.430821
158	55	Suction (M³/H)	750	2026-03-18 01:02:35.431299
159	55	Number Of Fan Speeds	3	2026-03-18 01:02:35.431667
160	55	Noise Level (Db)	-	2026-03-18 01:02:35.432013
161	55	Light Type	LED Light	2026-03-18 01:02:35.432319
162	55	Country Of Origin	China	2026-03-18 01:02:35.432603
163	55	Weight (Kg)	14.7	2026-03-18 01:02:35.432903
164	55	Warranty (Device) Years	1	2026-03-18 01:02:35.433181
165	55	Product Depth (Cm)	50	2026-03-18 01:02:35.433394
166	55	Product Width (Cm)	90	2026-03-18 01:02:35.433599
167	55	Product Height (Cm)	42.2-80.2	2026-03-18 01:02:35.433812
168	56	Size ( Cm )	90	2026-03-18 01:02:40.942709
169	56	Material	Stainless Steel / Glass	2026-03-18 01:02:40.943255
170	56	Type Of Hood	Wall Mount	2026-03-18 01:02:40.943709
171	56	Control	Touch Control	2026-03-18 01:02:40.944127
172	56	Charcoal Filter	Yes	2026-03-18 01:02:40.944576
173	56	Number Of Charcoal Filters	2	2026-03-18 01:02:40.944947
174	56	Removable Charcoal Filter	Yes	2026-03-18 01:02:40.945405
175	56	Dishwasher Safe Aluminum Filter	Yes	2026-03-18 01:02:40.946035
176	56	Number Of Motors	1	2026-03-18 01:02:40.946445
177	56	Suction (M³/H)	750	2026-03-18 01:02:40.946867
178	56	Number Of Fan Speeds	3	2026-03-18 01:02:40.947437
179	56	Noise Level (Db)	-	2026-03-18 01:02:40.947863
180	56	Light Type	LED Light	2026-03-18 01:02:40.948284
181	56	Country Of Origin	China	2026-03-18 01:02:40.948692
182	56	Weight (Kg)	14.7	2026-03-18 01:02:40.949021
183	56	Warranty (Device) Years	1	2026-03-18 01:02:40.949322
184	56	Product Depth (Cm)	50	2026-03-18 01:02:40.949586
185	56	Product Width (Cm)	90	2026-03-18 01:02:40.949836
186	56	Product Height (Cm)	42.2-80.2	2026-03-18 01:02:40.950155
187	103	Size ( Cm )	90	2026-03-18 01:07:57.690799
188	103	Material	Stainless Steel / Glass	2026-03-18 01:07:57.691189
189	103	Type Of Hood	Wall Mount	2026-03-18 01:07:57.691635
190	103	Control	Touch Control	2026-03-18 01:07:57.691854
191	103	Charcoal Filter	Yes	2026-03-18 01:07:57.692061
192	103	Number Of Charcoal Filters	2	2026-03-18 01:07:57.692262
193	103	Removable Charcoal Filter	Yes	2026-03-18 01:07:57.69246
194	103	Dishwasher Safe Aluminum Filter	Yes	2026-03-18 01:07:57.692693
195	103	Number Of Motors	1	2026-03-18 01:07:57.692909
196	103	Suction (M³/H)	750	2026-03-18 01:07:57.693196
197	103	Number Of Fan Speeds	3	2026-03-18 01:07:57.6934
198	103	Noise Level (Db)	-	2026-03-18 01:07:57.693599
199	103	Light Type	LED Light	2026-03-18 01:07:57.693813
200	103	Country Of Origin	China	2026-03-18 01:07:57.694003
201	103	Weight (Kg)	14.7	2026-03-18 01:07:57.69419
202	103	Warranty (Device) Years	1	2026-03-18 01:07:57.69436
203	103	Product Depth (Cm)	50	2026-03-18 01:07:57.69453
204	103	Product Width (Cm)	90	2026-03-18 01:07:57.694722
205	103	Product Height (Cm)	42.2-80.2	2026-03-18 01:07:57.694968
206	106	Size ( Cm )	90	2026-03-18 01:08:17.888029
207	106	Material	Stainless Steel/Glass	2026-03-18 01:08:17.888391
208	106	Type Of Hood	Island Hood	2026-03-18 01:08:17.888646
209	106	Control	Electronic Buttons	2026-03-18 01:08:17.888881
210	106	Charcoal Filter	Yes	2026-03-18 01:08:17.889221
211	106	Number Of Charcoal Filters	2	2026-03-18 01:08:17.889536
212	106	Removable Charcoal Filter	Yes	2026-03-18 01:08:17.889862
213	106	Dishwasher Safe Aluminum Filter	Yes	2026-03-18 01:08:17.89014
214	106	Number Of Motors	1	2026-03-18 01:08:17.890446
215	106	Suction (M³/H)	1000	2026-03-18 01:08:17.890738
216	106	Number Of Fan Speeds	3	2026-03-18 01:08:17.891015
217	106	Noise Level (Db)	-	2026-03-18 01:08:17.891267
218	106	Light Type	LED	2026-03-18 01:08:17.891529
219	106	Country Of Origin	China	2026-03-18 01:08:17.891795
220	106	Weight (Kg)	-	2026-03-18 01:08:17.892049
221	106	Warranty (Device) Years	1	2026-03-18 01:08:17.892342
222	106	Product Depth (Cm)	-	2026-03-18 01:08:17.892616
223	106	Product Width (Cm)	90	2026-03-18 01:08:17.892923
224	106	Product Height (Cm)	105~125	2026-03-18 01:08:17.893227
225	106	Installation Width (Cm)	-	2026-03-18 01:08:17.893477
226	106	Installation Depth (Cm)	-	2026-03-18 01:08:17.893696
227	112	Size ( Cm )	90	2026-03-18 01:09:09.07003
228	112	Material	Stainless Steel/Glass	2026-03-18 01:09:09.070525
229	112	Type Of Hood	Island Hood	2026-03-18 01:09:09.070768
230	112	Control	Electronic Buttons	2026-03-18 01:09:09.070974
231	112	Charcoal Filter	Yes	2026-03-18 01:09:09.071173
232	112	Number Of Charcoal Filters	2	2026-03-18 01:09:09.071374
233	112	Removable Charcoal Filter	Yes	2026-03-18 01:09:09.071561
234	112	Dishwasher Safe Aluminum Filter	Yes	2026-03-18 01:09:09.071725
235	112	Number Of Motors	1	2026-03-18 01:09:09.071873
236	112	Suction (M³/H)	1000	2026-03-18 01:09:09.072023
237	112	Number Of Fan Speeds	3	2026-03-18 01:09:09.072167
238	112	Noise Level (Db)	-	2026-03-18 01:09:09.072349
239	112	Light Type	LED	2026-03-18 01:09:09.072581
240	112	Country Of Origin	China	2026-03-18 01:09:09.072817
241	112	Weight (Kg)	-	2026-03-18 01:09:09.073064
242	112	Warranty (Device) Years	1	2026-03-18 01:09:09.073323
243	112	Product Depth (Cm)	-	2026-03-18 01:09:09.073507
244	112	Product Width (Cm)	90	2026-03-18 01:09:09.073672
245	112	Product Height (Cm)	105~125	2026-03-18 01:09:09.073895
246	112	Installation Width (Cm)	-	2026-03-18 01:09:09.074077
247	112	Installation Depth (Cm)	-	2026-03-18 01:09:09.074232
248	120	Size ( Cm )	90	2026-03-18 01:10:01.873221
249	120	Material	Stainless Steel/Glass	2026-03-18 01:10:01.873537
250	120	Type Of Hood	Island Hood	2026-03-18 01:10:01.873867
251	120	Control	Electronic Buttons	2026-03-18 01:10:01.874178
252	120	Charcoal Filter	Yes	2026-03-18 01:10:01.874423
253	120	Number Of Charcoal Filters	2	2026-03-18 01:10:01.87473
254	120	Removable Charcoal Filter	Yes	2026-03-18 01:10:01.874971
255	120	Dishwasher Safe Aluminum Filter	Yes	2026-03-18 01:10:01.875178
256	120	Number Of Motors	1	2026-03-18 01:10:01.875357
257	120	Suction (M³/H)	1000	2026-03-18 01:10:01.875529
258	120	Number Of Fan Speeds	3	2026-03-18 01:10:01.875707
259	120	Noise Level (Db)	-	2026-03-18 01:10:01.875876
260	120	Light Type	LED	2026-03-18 01:10:01.876031
261	120	Country Of Origin	China	2026-03-18 01:10:01.876181
262	120	Weight (Kg)	-	2026-03-18 01:10:01.876342
263	120	Warranty (Device) Years	1	2026-03-18 01:10:01.876504
264	120	Product Depth (Cm)	-	2026-03-18 01:10:01.87665
265	120	Product Width (Cm)	90	2026-03-18 01:10:01.876793
266	120	Product Height (Cm)	105~125	2026-03-18 01:10:01.876935
267	120	Installation Width (Cm)	-	2026-03-18 01:10:01.877076
268	120	Installation Depth (Cm)	-	2026-03-18 01:10:01.877218
269	30	النوع	غسالة ملابس	2026-03-18 01:41:57.868695
270	30	العلامة التجارية	LG	2026-03-18 01:41:57.869566
271	30	سعة الغسيل	10 كغم	2026-03-18 01:41:57.869999
272	30	عدد البرامج	14	2026-03-18 01:41:57.870391
273	30	نوع المحرك	محرك إنفرتر دفع مباشر	2026-03-18 01:41:57.870713
274	30	النوع الإضافي	غسالة أمامية	2026-03-18 01:41:57.871016
275	31	النوع	طباخ غاز بلت إن	2026-03-18 01:42:00.859089
276	31	العلامة التجارية	فاير غاز	2026-03-18 01:42:00.859619
277	31	الموديل	هايتك	2026-03-18 01:42:00.859913
278	31	العرض	90 سم	2026-03-18 01:42:00.860196
279	31	عدد المواقد	5	2026-03-18 01:42:00.860435
280	31	المادة	ستانلس ستيل	2026-03-18 01:42:00.860628
281	31	نوع الوقود	غاز	2026-03-18 01:42:00.860809
282	32	النوع	طباخ غاز بلت إن	2026-03-18 01:42:04.365883
283	32	العلامة التجارية	فاير غاز	2026-03-18 01:42:04.366542
284	32	الموديل	هايتك	2026-03-18 01:42:04.36696
285	32	العرض	60 سم	2026-03-18 01:42:04.367238
286	32	عدد المواقد	4	2026-03-18 01:42:04.367494
287	32	المادة	ستانلس ستيل	2026-03-18 01:42:04.367749
288	32	نوع الإشعال	إشعال كهربائي	2026-03-18 01:42:04.368014
289	32	نوع التحكم	تحكم يدوي	2026-03-18 01:42:04.368309
290	33	نوع المنتج	فرن كهربائي بلت إن	2026-03-18 01:42:07.077506
291	33	العلامة التجارية	فاير غاز	2026-03-18 01:42:07.078096
292	33	العرض	60 سم	2026-03-18 01:42:07.078554
293	33	السعة	67 لتر	2026-03-18 01:42:07.078943
294	33	عدد البرامج	9	2026-03-18 01:42:07.079302
295	33	السعر	3200	2026-03-18 01:42:07.079675
296	34	النوع	طباخ غاز بلت إن	2026-03-18 01:42:10.134811
297	34	العلامة التجارية	فاير غاز	2026-03-18 01:42:10.135528
298	34	الموديل	هايتك	2026-03-18 01:42:10.136055
299	34	العرض	70 سم	2026-03-18 01:42:10.136589
300	34	عدد المواقد	5	2026-03-18 01:42:10.136956
301	34	المادة	ستانلس ستيل	2026-03-18 01:42:10.1373
302	34	نوع الإشعال	كهربائي	2026-03-18 01:42:10.137614
303	35	نوع المنتج	غسالة ملابس	2026-03-18 01:42:12.91125
304	35	العلامة التجارية	إل جي	2026-03-18 01:42:12.912375
305	35	سعة الغسيل	11 كغم	2026-03-18 01:42:12.912682
306	35	عدد البرامج	14	2026-03-18 01:42:12.912899
307	35	نوع المحرك	إنفرتر دفع مباشر	2026-03-18 01:42:12.913118
308	35	الحمل	أمامي	2026-03-18 01:42:12.913353
309	36	نوع_المنتج	غسالة ملابس	2026-03-18 01:42:16.024654
310	36	الماركة	إل جي	2026-03-18 01:42:16.025155
311	36	سعة_الغسيل	9 كغم	2026-03-18 01:42:16.025458
312	36	عدد_البرامج	14 برنامج	2026-03-18 01:42:16.025682
313	36	نوع_المحرك	محرك انفرتر دفع مباشر	2026-03-18 01:42:16.025907
314	36	تقنية_البال	نعم	2026-03-18 01:42:16.026103
315	37	النوع	طباخ غاز بلت إن	2026-03-18 01:42:19.190564
316	37	العلامة التجارية	فاير غاز	2026-03-18 01:42:19.191557
317	37	الموديل	هايتك	2026-03-18 01:42:19.192176
318	37	العرض	70 سم	2026-03-18 01:42:19.192642
319	37	عدد المواقد	5	2026-03-18 01:42:19.193053
320	37	نوع السطح	زجاج أسود	2026-03-18 01:42:19.193441
321	37	نوع الإشعال	كهربائي	2026-03-18 01:42:19.193898
322	37	نوع التثبيت	بلت إن	2026-03-18 01:42:19.194264
323	38	النوع	ثلاجة	2026-03-18 01:42:22.441645
324	38	العلامة التجارية	إل جي	2026-03-18 01:42:22.442443
325	38	السعة	515 لتر	2026-03-18 01:42:22.443168
326	38	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:42:22.443842
327	38	اللون	فضي	2026-03-18 01:42:22.444485
328	39	النوع	ثلاجة	2026-03-18 01:42:25.420606
329	39	العلامة التجارية	إل جي	2026-03-18 01:42:25.42145
330	39	السعة	515 لتر	2026-03-18 01:42:25.422017
331	39	نوع المحرك	إنفرتر موفر للكهرباء	2026-03-18 01:42:25.422491
332	39	الباب	زجاج أسود	2026-03-18 01:42:25.423056
333	39	عدد الأبواب	غير محدد في المنتج	2026-03-18 01:42:25.42348
334	41	النوع	فرن كهربائي بلت إن	2026-03-18 01:42:28.341217
335	41	الماركة	فاير غاز برولاين	2026-03-18 01:42:28.341884
336	41	العرض	60 سم	2026-03-18 01:42:28.342375
337	41	السعة	72 لتر	2026-03-18 01:42:28.342798
338	41	الضغط	14 بار	2026-03-18 01:42:28.343294
339	41	نوع التثبيت	بلت إن مدمج	2026-03-18 01:42:28.343766
340	42	النوع	غسالة ملابس	2026-03-18 01:42:32.209302
341	42	الماركة	إل جي	2026-03-18 01:42:32.209901
342	42	سعة الغسيل	11 كغم	2026-03-18 01:42:32.210297
343	42	عدد البرامج	14 برنامج	2026-03-18 01:42:32.210639
344	42	نوع المحرك	محرك انفرتر دفع مباشر	2026-03-18 01:42:32.2113
345	42	سرعة الدوران	غير محددة	2026-03-18 01:42:32.21164
346	42	اللون	غير محدد	2026-03-18 01:42:32.211935
347	43	نوع المنتج	شفاط مطبخ	2026-03-18 01:42:35.782097
348	43	طريقة التثبيت	معلق على الحائط	2026-03-18 01:42:35.782603
349	43	العرض	90 سم	2026-03-18 01:42:35.783007
350	43	قوة الشفط	400 م³/الساعة	2026-03-18 01:42:35.783317
351	43	نوع التصريف	غير محدد	2026-03-18 01:42:35.78358
352	43	عدد السرعات	غير محدد	2026-03-18 01:42:35.783818
353	43	نوع الفلتر	غير محدد	2026-03-18 01:42:35.784055
354	43	الإضاءة	غير محدد	2026-03-18 01:42:35.784294
355	43	الضوضاء	غير محدد	2026-03-18 01:42:35.78457
356	44	النوع	فرن كهربائي بلت إن	2026-03-18 01:42:38.625031
357	44	العلامة التجارية	فاير غاز	2026-03-18 01:42:38.626292
358	44	النموذج	هايتك	2026-03-18 01:42:38.627096
359	44	العرض	60 سم	2026-03-18 01:42:38.62772
360	44	السعة	67 لتر	2026-03-18 01:42:38.628137
361	44	عدد البرامج	9	2026-03-18 01:42:38.628483
362	44	نوع التركيب	مدمج	2026-03-18 01:42:38.628794
363	46	النوع	ميكروويف بلت إن	2026-03-18 01:42:42.038421
364	46	العلامة التجارية	فاير غاز	2026-03-18 01:42:42.039015
365	46	السعة	25 لتر	2026-03-18 01:42:42.03999
366	46	الطاقة	1200 واط	2026-03-18 01:42:42.040493
367	46	الميزات	2 في 1	2026-03-18 01:42:42.04194
368	46	عدد المستويات	8	2026-03-18 01:42:42.042467
369	47	النوع	ثلاجة	2026-03-18 01:42:44.746676
370	47	عدد الأبواب	4	2026-03-18 01:42:44.747771
371	47	السعة	530 لتر	2026-03-18 01:42:44.748612
372	47	نوع المحرك	انفرتر	2026-03-18 01:42:44.749165
373	47	كفاءة الطاقة	موفرة للكهرباء	2026-03-18 01:42:44.749861
374	47	العلامة التجارية	إل جي	2026-03-18 01:42:44.75042
375	48	النوع	فرن كهربائي بلت إن	2026-03-18 01:42:47.775765
376	48	العلامة التجارية	فاير غاز	2026-03-18 01:42:47.776252
377	48	الموديل	برولاين	2026-03-18 01:42:47.776593
378	48	العرض	60 سم	2026-03-18 01:42:47.776891
379	48	السعة	72 لتر	2026-03-18 01:42:47.777142
380	48	الضغط	13 بار	2026-03-18 01:42:47.777359
381	48	نوع التثبيت	بلت إن مدمج	2026-03-18 01:42:47.777556
382	49	نوع المنتج	غسالة أطباق	2026-03-18 01:42:50.63926
383	49	العلامة التجارية	إل جي	2026-03-18 01:42:50.639867
384	49	عدد البرامج	9	2026-03-18 01:42:50.640307
385	49	السعة	14 طقم	2026-03-18 01:42:50.640703
386	49	نوع المحرك	إنفرتر دفع مباشر	2026-03-18 01:42:50.640955
387	49	ميزة التوفير	موفرة للطاقة	2026-03-18 01:42:50.641194
388	50	نوع الجهاز	نشافة ملابس	2026-03-18 01:42:53.558464
389	50	العلامة التجارية	إل جي	2026-03-18 01:42:53.559554
390	50	السعة	9 كغم	2026-03-18 01:42:53.560132
391	50	نظام التجفيف	مضخة حرارية	2026-03-18 01:42:53.560563
392	50	كفاءة الطاقة	موفرة للكهرباء	2026-03-18 01:42:53.561062
393	50	عدد البرامج	14	2026-03-18 01:42:53.561471
394	51	النوع	فرن كهربائي بلت إن	2026-03-18 01:42:57.603546
395	51	العلامة التجارية	فاير غاز	2026-03-18 01:42:57.60393
396	51	العرض	60 سم	2026-03-18 01:42:57.604142
397	51	السعة	69 لتر	2026-03-18 01:42:57.604406
398	51	عدد البرامج	8	2026-03-18 01:42:57.604672
399	51	السعر	2600	2026-03-18 01:42:57.605025
400	52	النوع	طباخ غاز بلت إن	2026-03-18 01:43:03.854719
401	52	العلامة التجارية	فاير غاز	2026-03-18 01:43:03.867533
402	52	الموديل	هايتك	2026-03-18 01:43:03.867846
403	52	العرض	90 سم	2026-03-18 01:43:03.868088
404	52	عدد المواقد	6	2026-03-18 01:43:03.868413
405	52	المادة	ستانلس ستيل	2026-03-18 01:43:03.868677
406	52	نوع الإشعال	كهربائي	2026-03-18 01:43:03.868896
407	53	النوع	ثلاجة	2026-03-18 01:43:08.128065
408	53	عدد_الأبواب	4	2026-03-18 01:43:08.128948
409	53	السعة_لتر	474	2026-03-18 01:43:08.129472
410	53	نوع_المحرك	انفرتر موفر للكهرباء	2026-03-18 01:43:08.129868
411	53	نوع_التبريد	تبريد مباشر أو تبريد بالهواء البارد	2026-03-18 01:43:08.130263
412	53	كفاءة_الطاقة	A أو A+	2026-03-18 01:43:08.130609
413	53	الضاغط	انفرتر	2026-03-18 01:43:08.131138
414	57	النوع	ميكروويف بلت إن	2026-03-18 01:43:11.495418
415	57	العلامة التجارية	فاير غاز	2026-03-18 01:43:11.495905
416	57	الموديل	برولاين	2026-03-18 01:43:11.496237
417	57	السعة	34 لتر	2026-03-18 01:43:11.496522
418	57	الطاقة	1100 واط	2026-03-18 01:43:11.49682
419	57	الميزة	2 في 1	2026-03-18 01:43:11.497168
420	57	عدد البرامج	غير محدد	2026-03-18 01:43:11.497407
421	57	المقاس	غير محدد	2026-03-18 01:43:11.497626
422	57	نوع التثبيت	بلت إن	2026-03-18 01:43:11.497822
423	58	نوع_المنتج	فريزر	2026-03-18 01:43:15.119943
424	58	العلامة_التجارية	مايديا	2026-03-18 01:43:15.120679
425	58	السعة	240 لتر	2026-03-18 01:43:15.121162
426	58	عدد_الأدراج	7	2026-03-18 01:43:15.121581
427	58	نوع_التبريد	هوائي	2026-03-18 01:43:15.122
428	58	المادة	ستانلس ستيل	2026-03-18 01:43:15.1224
429	58	اللون	فضي	2026-03-18 01:43:15.122785
430	59	النوع	ثلاجة	2026-03-18 01:43:17.719388
431	59	الماركة	إل جي	2026-03-18 01:43:17.720044
432	59	السعة	423 لتر	2026-03-18 01:43:17.720412
433	59	نوع المحرك	إنفرتر موفر للكهرباء	2026-03-18 01:43:17.720709
434	59	اللون	فضي	2026-03-18 01:43:17.72101
435	60	النوع	ثلاجة	2026-03-18 01:43:20.662245
436	60	الماركة	إل جي	2026-03-18 01:43:20.663218
437	60	الموديل	إنستافيو	2026-03-18 01:43:20.663886
438	60	السعة	349 لتر	2026-03-18 01:43:20.664493
439	60	نوع الفريزر	فريزر سفلي	2026-03-18 01:43:20.665141
440	60	نوع المحرك	انفرتر	2026-03-18 01:43:20.665664
441	60	نوع التبريد	تبريد مباشر	2026-03-18 01:43:20.666228
442	61	نوع_المنتج	ثلاجة	2026-03-18 01:43:26.250106
443	61	الماركة	سامسونج	2026-03-18 01:43:26.251004
444	61	السعة	600 لتر	2026-03-18 01:43:26.251705
445	61	نوع_المحرك	انفرتر موفر للكهرباء	2026-03-18 01:43:26.252324
446	61	المادة	ستانلس ستيل	2026-03-18 01:43:26.25276
447	61	نوع_التبريد	تبريد مباشر أو تبريد توزيع هواء	2026-03-18 01:43:26.253195
448	61	عدد_الأبواب	غير محدد	2026-03-18 01:43:26.253517
449	62	نوع المنتج	طباخ كهربائي	2026-03-18 01:43:29.653502
450	62	عدد اللوحات	1	2026-03-18 01:43:29.654203
451	62	نوع السطح	سيراميك	2026-03-18 01:43:29.654684
452	62	المادة	ستانلس ستيل / زجاج	2026-03-18 01:43:29.655035
453	62	نوع التحكم	غير محدد	2026-03-18 01:43:29.655343
454	62	الطاقة	غير محددة	2026-03-18 01:43:29.655629
455	62	الحجم	غير محدد	2026-03-18 01:43:29.655908
456	62	المميزات الإضافية	غير محددة	2026-03-18 01:43:29.656172
457	63	نوع المنتج	نشافة ملابس	2026-03-18 01:43:32.431726
458	63	السعة	9 كغم	2026-03-18 01:43:32.432653
459	63	نظام التجفيف	مضخة حرارية	2026-03-18 01:43:32.433335
460	63	كفاءة الطاقة	موفرة للكهرباء	2026-03-18 01:43:32.433884
461	63	عدد البرامج	14	2026-03-18 01:43:32.43436
462	64	النوع	ثلاجة بلت إن	2026-03-18 01:43:35.342973
463	64	السعة	247 لتر	2026-03-18 01:43:35.343681
464	64	موضع الفريزر	سفلي	2026-03-18 01:43:35.344141
465	64	اتجاه فتح الباب	من اليسار	2026-03-18 01:43:35.344814
466	64	العلامة التجارية	أف جي	2026-03-18 01:43:35.345365
467	65	النوع	ثلاجة بلت إن	2026-03-18 01:43:38.339637
468	65	السعة	247 لتر	2026-03-18 01:43:38.339961
469	65	موقع الفريزر	سفلي	2026-03-18 01:43:38.340157
470	65	فتح الباب	من اليمين	2026-03-18 01:43:38.340347
471	65	العلامة التجارية	AEG	2026-03-18 01:43:38.340523
472	66	النوع	ثلاجة	2026-03-18 01:43:41.219003
473	66	الماركة	إل جي	2026-03-18 01:43:41.219991
474	66	السعة	493 لتر	2026-03-18 01:43:41.22076
475	66	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:43:41.221319
476	66	نوع الباب	زجاج أسود	2026-03-18 01:43:41.221802
477	66	عدد الأبواب	غير محدد في المنتج	2026-03-18 01:43:41.222181
478	67	نوع المنتج	فرن + ميكروويف مدمج (Combi)	2026-03-18 01:43:44.042599
479	67	العرض	45 سم	2026-03-18 01:43:44.043732
480	67	السعة	34 لتر	2026-03-18 01:43:44.044182
481	67	عدد البرامج	9	2026-03-18 01:43:44.044522
482	67	التثبيت	بلت إن (مدمج)	2026-03-18 01:43:44.044839
483	67	الماركة	أف جي (AEG)	2026-03-18 01:43:44.045143
484	68	النوع	ميكروويف بلت إن	2026-03-18 01:43:46.705374
485	68	السعة	34 لتر	2026-03-18 01:43:46.706208
486	68	الطاقة	1100 واط	2026-03-18 01:43:46.70668
487	68	الميزة الإضافية	2 في 1	2026-03-18 01:43:46.707152
488	68	الماركة	فاير غاز برولاين	2026-03-18 01:43:46.707737
489	69	النوع	ثلاجة	2026-03-18 01:43:49.460733
490	69	العلامة التجارية	هيتاشي	2026-03-18 01:43:49.461771
491	69	عدد الأبواب	4	2026-03-18 01:43:49.462646
492	69	السعة	569 لتر	2026-03-18 01:43:49.463283
493	69	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:43:49.46414
494	69	نوع التبريد	تبريد مباشر	2026-03-18 01:43:49.464843
495	70	نوع المنتج	نشافة ملابس	2026-03-18 01:43:52.799203
496	70	السعة	9 كغم	2026-03-18 01:43:52.799574
497	70	نظام التجفيف	مكثف داخلي	2026-03-18 01:43:52.799787
498	70	اللون	فضي	2026-03-18 01:43:52.800093
499	70	الماركة	Hoover	2026-03-18 01:43:52.800419
500	71	نوع الجهاز	نشافة ملابس	2026-03-18 01:43:55.763138
501	71	السعة	10 كغم	2026-03-18 01:43:55.763606
502	71	نظام التجفيف	مكثف داخلي	2026-03-18 01:43:55.763933
503	71	عدد البرامج	9	2026-03-18 01:43:55.764169
504	71	اللون	فضي	2026-03-18 01:43:55.764386
505	71	العلامة التجارية	Hoover	2026-03-18 01:43:55.764607
506	72	نوع_المنتج	ثلاجة مكتب	2026-03-18 01:43:58.429312
507	72	السعة	50 لتر	2026-03-18 01:43:58.429732
508	72	اللون	أسود	2026-03-18 01:43:58.430054
509	72	نوع_الواجهة	شفافة	2026-03-18 01:43:58.430328
510	72	نوع_التبريد	كهربائي	2026-03-18 01:43:58.430596
511	72	عدد_الأبواب	1	2026-03-18 01:43:58.430832
512	73	نوع المنتج	فرن + ميكروويف مدمج (Combi)	2026-03-18 01:44:01.485833
513	73	العرض	45 سم	2026-03-18 01:44:01.486384
514	73	السعة	34 لتر	2026-03-18 01:44:01.486661
515	73	عدد عناصر التسخين	9 برن	2026-03-18 01:44:01.486902
516	73	التثبيت	بلت إن (مدمج)	2026-03-18 01:44:01.487179
517	73	الماركة	أف جي (AEG)	2026-03-18 01:44:01.487396
518	74	النوع	فرن بلت إن	2026-03-18 01:44:05.981477
519	74	العلامة التجارية	سامسونج	2026-03-18 01:44:05.98287
520	74	العرض	60 سم	2026-03-18 01:44:05.983302
521	74	السعة	64 لتر	2026-03-18 01:44:05.98389
522	74	عدد البرامج	6	2026-03-18 01:44:05.984281
523	74	المادة	ستانلس ستيل	2026-03-18 01:44:05.984601
524	74	نوع التثبيت	بلت إن مدمج	2026-03-18 01:44:05.984854
525	75	النوع	ثلاجة	2026-03-18 01:44:12.005143
526	75	عدد الأبواب	4	2026-03-18 01:44:12.005569
527	75	السعة	580 لتر	2026-03-18 01:44:12.005839
528	75	نوع المحرك	انفيرتر موفر للكهرباء	2026-03-18 01:44:12.00614
529	75	نوع التبريد	تبريد مباشر أو No Frost	2026-03-18 01:44:12.006591
530	75	الطاقة	A أو A+	2026-03-18 01:44:12.006942
531	76	نوع_المنتج	فرن كهربائي بلت إن	2026-03-18 01:44:18.978378
532	76	العرض	60 سم	2026-03-18 01:44:18.980007
533	76	السعة	69 لتر	2026-03-18 01:44:18.980354
534	76	عدد_البرامج	10	2026-03-18 01:44:18.980654
535	76	المادة	ستانلس ستيل	2026-03-18 01:44:18.980914
536	76	نوع_التثبيت	بلت إن مدمج	2026-03-18 01:44:18.981157
537	77	العلامة التجارية	سامسونج	2026-03-18 01:44:21.806808
538	77	نوع المنتج	غسالة ملابس	2026-03-18 01:44:21.807634
539	77	سعة الغسيل	9 كغم	2026-03-18 01:44:21.808189
540	77	عدد البرامج	24 برنامج	2026-03-18 01:44:21.80864
541	77	نوع المحرك	محرك رقمي انفرتر	2026-03-18 01:44:21.809062
542	77	اللون	أسود	2026-03-18 01:44:21.809628
543	78	النوع	ثلاجة	2026-03-18 01:44:24.595894
544	78	العلامة التجارية	هيتاشي	2026-03-18 01:44:24.596648
545	78	عدد الأبواب	4	2026-03-18 01:44:24.597186
546	78	السعة	569 لتر	2026-03-18 01:44:24.597848
547	78	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:44:24.598438
548	78	نوع التبريد	تبريد مباشر	2026-03-18 01:44:24.598789
549	79	نوع المنتج	شفاط مطبخ	2026-03-18 01:44:28.089782
550	79	طريقة التركيب	معلق على الحائط	2026-03-18 01:44:28.090629
551	79	العرض	80 سم	2026-03-18 01:44:28.09138
552	79	قوة الشفط	736 م³/ساعة	2026-03-18 01:44:28.092292
553	79	نوع التصريف	غير محدد	2026-03-18 01:44:28.092907
554	79	عدد مستويات السرعة	غير محدد	2026-03-18 01:44:28.093391
555	79	نوع المرشح	غير محدد	2026-03-18 01:44:28.093829
556	79	الإضاءة	غير محدد	2026-03-18 01:44:28.094239
557	79	المادة	غير محدد	2026-03-18 01:44:28.094603
558	79	اللون	غير محدد	2026-03-18 01:44:28.094979
559	80	النوع	فرن كهربائي بلت إن	2026-03-18 01:44:30.759562
560	80	العرض	60 سم	2026-03-18 01:44:30.760583
561	80	السعة	69 لتر	2026-03-18 01:44:30.761266
562	80	عدد البرامج	10	2026-03-18 01:44:30.762044
563	80	اللون	أسود	2026-03-18 01:44:30.763066
564	80	نوع التركيب	بلت إن	2026-03-18 01:44:30.763779
565	81	النوع	ثلاجة	2026-03-18 01:44:34.397898
566	81	العلامة التجارية	إل جي	2026-03-18 01:44:34.398424
567	81	عدد الأبواب	4	2026-03-18 01:44:34.398911
568	81	السعة	665 لتر	2026-03-18 01:44:34.39936
569	81	نوع المحرك	انفرتر	2026-03-18 01:44:34.399656
570	81	كفاءة الطاقة	موفرة للكهرباء	2026-03-18 01:44:34.399957
571	81	نوع التبريد	تبريد مباشر أو No Frost	2026-03-18 01:44:34.400414
572	82	نوع_المنتج	طباخ غاز مدمج (بلت إن)	2026-03-18 01:44:37.896018
573	82	العلامة_التجارية	فاير غاز	2026-03-18 01:44:37.896491
574	82	الموديل	هايتك	2026-03-18 01:44:37.896764
575	82	العرض	90 سم	2026-03-18 01:44:37.897005
576	82	عدد_المواقد	5	2026-03-18 01:44:37.897234
577	82	نوع_الشعلات	غاز	2026-03-18 01:44:37.897444
578	82	اللون	زجاج أسود	2026-03-18 01:44:37.897651
579	82	نوع_التثبيت	مدمج في الأثاث	2026-03-18 01:44:37.897878
580	83	نوع المنتج	طباخ كهربائي	2026-03-18 01:44:41.050933
581	83	عدد الشعلات	مزدوج	2026-03-18 01:44:41.05159
582	83	مادة سطح الطبخ	سيراميك	2026-03-18 01:44:41.05203
583	83	المواد الخارجية	ستانلس ستيل / زجاج أسود	2026-03-18 01:44:41.052428
584	83	العلامة التجارية	Trust	2026-03-18 01:44:41.052814
585	84	نوع المنتج	فرن + ميكروويف مدمج (Combi)	2026-03-18 01:44:44.421917
586	84	العلامة التجارية	Fire Gas Proline	2026-03-18 01:44:44.422963
587	84	العرض	45 سم	2026-03-18 01:44:44.423765
588	84	السعة	50 لتر	2026-03-18 01:44:44.424496
589	84	نوع التثبيت	بلت إن (مدمج)	2026-03-18 01:44:44.425181
590	84	الوظائف	فرن + ميكروويف	2026-03-18 01:44:44.425813
591	84	مصدر الطاقة	غاز (فرن) / كهربائي (ميكروويف)	2026-03-18 01:44:44.426485
592	85	نوع المنتج	طباخ غاز بلت إن	2026-03-18 01:44:50.385093
593	85	العلامة التجارية	ساوتر	2026-03-18 01:44:50.385851
594	85	العرض	90 سم	2026-03-18 01:44:50.386304
595	85	عدد المواقد	5	2026-03-18 01:44:50.386828
596	85	نوع الوقود	غاز	2026-03-18 01:44:50.387378
597	85	المادة	ستانلس ستيل	2026-03-18 01:44:50.387829
598	85	نوع التثبيت	بلت إن مدمج	2026-03-18 01:44:50.388411
599	86	نوع المنتج	غسالة صحون	2026-03-18 01:44:53.072475
600	86	عدد البرامج	5	2026-03-18 01:44:53.073502
601	86	السعة	13 طقم	2026-03-18 01:44:53.074121
602	86	عدد الرفوف	2	2026-03-18 01:44:53.07476
603	86	اللون	أسود	2026-03-18 01:44:53.075413
604	86	الماركة	Hoover	2026-03-18 01:44:53.076014
605	87	نوع_المنتج	جلاية صحون	2026-03-18 01:44:56.381932
606	87	عدد_البرامج	10	2026-03-18 01:44:56.382709
607	87	السعة	16 طقم	2026-03-18 01:44:56.383268
608	87	عدد_الرفوف	3	2026-03-18 01:44:56.383985
609	87	المادة	ستانلس ستيل	2026-03-18 01:44:56.384637
610	87	الماركة	Hoover	2026-03-18 01:44:56.385219
611	88	نوع المنتج	ثلاجة	2026-03-18 01:44:59.280753
612	88	السعة	590 لتر	2026-03-18 01:44:59.281878
613	88	نوع الفريزر	فريزر سفلي	2026-03-18 01:44:59.282831
614	88	نوع المحرك	إنفرتر موفر للكهرباء	2026-03-18 01:44:59.283966
615	88	نوع التبريد	تبريد مباشر	2026-03-18 01:44:59.285318
616	88	عدد الأبواب	بابين	2026-03-18 01:44:59.287115
617	89	النوع	ثلاجة بلت إن	2026-03-18 01:45:02.108954
618	89	السعة	303 لتر	2026-03-18 01:45:02.109403
619	89	نوع الفريزر	بدون فريزر	2026-03-18 01:45:02.10969
620	89	اتجاه الباب	قابل للعكس	2026-03-18 01:45:02.109938
621	89	العلامة التجارية	أف جي	2026-03-18 01:45:02.110185
622	90	نوع المنتج	درج تسخين	2026-03-18 01:45:05.222478
623	90	العمق	15 سم	2026-03-18 01:45:05.222875
624	90	المادة	ستانلس ستيل	2026-03-18 01:45:05.223147
625	90	الاستخدام	تسخين وحفظ الطعام	2026-03-18 01:45:05.223398
626	90	نوع التركيب	مدمج في المطبخ	2026-03-18 01:45:05.223725
627	91	نوع المنتج	فريزر بلت إن	2026-03-18 01:45:08.129315
628	91	العلامة التجارية	إف جي	2026-03-18 01:45:08.130499
629	91	السعة	197 لتر	2026-03-18 01:45:08.131314
630	91	عدد الأدراج	8 جوارير	2026-03-18 01:45:08.131872
631	91	نظام التبريد	هوائي	2026-03-18 01:45:08.132345
632	91	نوع التثبيت	بلت إن مدمج	2026-03-18 01:45:08.132759
633	92	النوع	ثلاجة	2026-03-18 01:45:11.051066
634	92	عدد_الأبواب	4	2026-03-18 01:45:11.051995
635	92	السعة	580 لتر	2026-03-18 01:45:11.052823
636	92	نوع_المحرك	انفيرتر موفر للكهرباء	2026-03-18 01:45:11.053477
637	92	نوع_التبريد	تبريد مباشر أو بدون فروست	2026-03-18 01:45:11.05402
638	92	كفاءة_الطاقة	عالية	2026-03-18 01:45:11.054565
639	93	النوع	فرن كهربائي بلت إن	2026-03-18 01:45:13.791436
640	93	العرض	60 سم	2026-03-18 01:45:13.792214
641	93	السعة	77 لتر	2026-03-18 01:45:13.79269
642	93	عدد البرامج	12	2026-03-18 01:45:13.793089
643	93	المادة	ستانلس ستيل	2026-03-18 01:45:13.793488
644	93	التثبيت	بلت إن مدمج	2026-03-18 01:45:13.793759
645	94	النوع	جلاية أطباق	2026-03-18 01:45:16.596435
646	94	العلامة التجارية	سامسونج	2026-03-18 01:45:16.597985
647	94	عدد البرامج	9	2026-03-18 01:45:16.599016
648	94	السعة	13 طقم	2026-03-18 01:45:16.59988
649	94	نوع المحرك	انفرتر	2026-03-18 01:45:16.600639
650	94	عدد الرفوف	2	2026-03-18 01:45:16.601169
651	95	النوع	ثلاجة	2026-03-18 01:45:22.29236
652	95	الماركة	سامسونج	2026-03-18 01:45:22.292895
653	95	السعة	530 لتر	2026-03-18 01:45:22.293228
654	95	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:45:22.29347
655	95	اللون	أسود	2026-03-18 01:45:22.293674
656	96	النوع	ثلاجة	2026-03-18 01:45:25.784236
657	96	العلامة التجارية	إل جي	2026-03-18 01:45:25.784686
658	96	الموديل	MoodUp	2026-03-18 01:45:25.78493
659	96	عدد الأبواب	4	2026-03-18 01:45:25.785133
660	96	السعة	617 لتر	2026-03-18 01:45:25.785309
661	96	نوع المحرك	إنفرت	2026-03-18 01:45:25.78547
662	96	نوع التبريد	تبريد مباشر	2026-03-18 01:45:25.785633
663	96	كفاءة الطاقة	A++	2026-03-18 01:45:25.78579
664	97	نوع المنتج	ثلاجة فريزر سفلي	2026-03-18 01:45:28.881571
665	97	السعة الكلية	344 لتر	2026-03-18 01:45:28.882631
666	97	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:45:28.883464
667	97	نوع التبريد	تبريد مباشر	2026-03-18 01:45:28.884073
668	97	عدد الأبواب	بابان	2026-03-18 01:45:28.884583
669	97	كفاءة الطاقة	موفرة للكهرباء	2026-03-18 01:45:28.885019
670	98	النوع	فرن بلت إن	2026-03-18 01:45:31.469732
671	98	العرض	60 سم	2026-03-18 01:45:31.470191
672	98	السعة	76 لتر	2026-03-18 01:45:31.470487
673	98	عدد البرامج	12	2026-03-18 01:45:31.470704
674	98	اللون	أسود	2026-03-18 01:45:31.470895
675	98	الماركة	سامسونج	2026-03-18 01:45:31.471072
676	99	نوع_المنتج	شفاط مطبخ	2026-03-18 01:45:35.351437
677	99	طريقة_التركيب	معلق على الحائط	2026-03-18 01:45:35.352138
678	99	العرض	60 سم	2026-03-18 01:45:35.353485
679	99	قوة_الشفط	250 م³/الساعة	2026-03-18 01:45:35.354026
680	99	نوع_التهوية	غير محدد	2026-03-18 01:45:35.354542
681	100	نوع المنتج	درج تسخين	2026-03-18 01:45:38.556263
682	100	العمق	15 سم	2026-03-18 01:45:38.557154
683	100	لون الزجاج	أسود	2026-03-18 01:45:38.557805
684	100	الماركة	FGH	2026-03-18 01:45:38.558323
685	100	الوظيفة الأساسية	تسخين وحفظ الطعام	2026-03-18 01:45:38.558789
686	100	المادة	زجاج وفولاذ مقاوم للصدأ	2026-03-18 01:45:38.55929
687	101	نوع المنتج	شفاط مطبخ	2026-03-18 01:45:42.027437
688	101	طريقة التثبيت	تعليق على الحائط	2026-03-18 01:45:42.028212
689	101	العرض	80 سم	2026-03-18 01:45:42.028774
690	101	قوة الشفط	736 م³/الساعة	2026-03-18 01:45:42.029178
691	101	نوع المحرك	غير محدد	2026-03-18 01:45:42.029512
692	101	عدد السرعات	غير محدد	2026-03-18 01:45:42.02982
693	101	نوع الفلتر	غير محدد	2026-03-18 01:45:42.03015
694	101	الإضاءة	غير محدد	2026-03-18 01:45:42.030436
695	101	اللون	غير محدد	2026-03-18 01:45:42.030699
696	102	النوع	غسالة ملابس	2026-03-18 01:45:45.173479
697	102	الماركة	سامسونج	2026-03-18 01:45:45.173981
698	102	سعة الغسيل	11 كغم	2026-03-18 01:45:45.174315
699	102	عدد البرامج	14 برنامج	2026-03-18 01:45:45.174572
700	102	نوع المحرك	موتور إنفرتر	2026-03-18 01:45:45.174972
701	102	خاصية المحرك	عديم الاحتكاك	2026-03-18 01:45:45.175348
702	104	النوع	طباخ غاز بلت إن	2026-03-18 01:45:48.167136
703	104	العلامة التجارية	فاير غاز	2026-03-18 01:45:48.167591
704	104	الموديل	هايتك	2026-03-18 01:45:48.167919
705	104	العرض	60 سم	2026-03-18 01:45:48.168411
706	104	عدد المواقد	4	2026-03-18 01:45:48.168803
707	104	نوع الوقود	غاز	2026-03-18 01:45:48.16908
708	104	اللون	أسود	2026-03-18 01:45:48.169317
709	104	نوع الزجاج	زجاج أسود	2026-03-18 01:45:48.169866
710	105	الماركة	سامسونج	2026-03-18 01:45:51.075767
711	105	نوع المنتج	ثلاجة	2026-03-18 01:45:51.076223
712	105	عدد الأبواب	4	2026-03-18 01:45:51.076595
713	105	السعة	664 لتر	2026-03-18 01:45:51.076917
714	105	نوع المحرك	إنفرتر موفر للكهرباء	2026-03-18 01:45:51.077185
715	105	نوع التبريد	تبريد مباشر	2026-03-18 01:45:51.07751
716	107	نوع_المنتج	جلاية صحون	2026-03-18 01:45:53.835859
717	107	عدد_البرامج	8	2026-03-18 01:45:53.836416
718	107	السعة	15 طقم	2026-03-18 01:45:53.836818
719	107	عدد_الرفوف	2	2026-03-18 01:45:53.837201
720	107	اللون	رمادي	2026-03-18 01:45:53.837756
721	107	العلامة_التجارية	Hoover	2026-03-18 01:45:53.838155
722	108	النوع	جلاية أطباق	2026-03-18 01:45:56.563574
723	108	الماركة	سامسونج	2026-03-18 01:45:56.564643
724	108	عدد البرامج	11	2026-03-18 01:45:56.565531
725	108	السعة	14 طقم	2026-03-18 01:45:56.566326
726	108	نوع المحرك	انفرتر	2026-03-18 01:45:56.56706
727	108	عدد الرفوف	3	2026-03-18 01:45:56.567774
728	109	النوع	طباخ غاز بلت إن	2026-03-18 01:46:00.214327
729	109	العرض	75 سم	2026-03-18 01:46:00.214758
730	109	عدد المواقد	5	2026-03-18 01:46:00.215025
731	109	المادة	ستانلس ستيل	2026-03-18 01:46:00.215291
732	109	نوع الوقود	غاز	2026-03-18 01:46:00.215508
733	109	نوع التركيب	بلت إن	2026-03-18 01:46:00.215688
734	110	العلامة التجارية	غرونديغ	2026-03-18 01:46:03.171546
735	110	نوع المنتج	ثلاجة بلت إن	2026-03-18 01:46:03.172048
736	110	السعة	405 لتر	2026-03-18 01:46:03.172611
737	110	نوع الفريزر	فريزر سفلي	2026-03-18 01:46:03.172938
738	110	نوع المحرك	محرك انفرتر	2026-03-18 01:46:03.173256
739	110	نوع التبريد	تبريد مباشر	2026-03-18 01:46:03.173521
740	111	نوع المنتج	شفاط سقف (جزيرة)	2026-03-18 01:46:06.262888
741	111	العلامة التجارية	أف جي	2026-03-18 01:46:06.2636
742	111	العرض	120 سم	2026-03-18 01:46:06.264084
743	111	قوة الشفط	600 م³/الساعة	2026-03-18 01:46:06.264689
744	111	نوع التثبيت	معلق بالسقف	2026-03-18 01:46:06.265378
745	111	نوع التصريف	جزيرة مركزية	2026-03-18 01:46:06.26591
746	113	النوع	ثلاجة	2026-03-18 01:46:09.69979
747	113	الماركة	سامسونج	2026-03-18 01:46:09.70036
748	113	السعة	470 لتر	2026-03-18 01:46:09.700771
749	113	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:46:09.701066
750	113	مادة الخارج	ستانلس ستيل	2026-03-18 01:46:09.701311
751	113	نوع التبريد	تبريد مباشر أو ساشو (غير محدد)	2026-03-18 01:46:09.701535
752	113	عدد الأبواب	غير محدد	2026-03-18 01:46:09.701754
753	114	النوع	فرن بلت إن	2026-03-18 01:46:12.432563
754	114	العلامة التجارية	سامسونج	2026-03-18 01:46:12.433663
755	114	السعة	76 لتر	2026-03-18 01:46:12.434349
756	114	عدد البرامج	12	2026-03-18 01:46:12.434931
757	114	المميزات الخاصة	Dual Cook	2026-03-18 01:46:12.435411
758	114	اللون	أسود	2026-03-18 01:46:12.43581
759	115	النوع	غسالة ملابس	2026-03-18 01:46:16.069114
760	115	الماركة	سامسونج	2026-03-18 01:46:16.069578
761	115	سعة الغسيل	11 كغم	2026-03-18 01:46:16.069864
762	115	عدد البرامج	14	2026-03-18 01:46:16.070091
763	115	نوع المحرك	موتور ديجيتال إنفرتر	2026-03-18 01:46:16.070314
764	115	اللون	أسود	2026-03-18 01:46:16.070506
765	116	العلامة التجارية	سامسونج	2026-03-18 01:46:18.828409
766	116	نوع المنتج	جلاية أطباق بلت إن	2026-03-18 01:46:18.829312
767	116	عدد البرامج	9	2026-03-18 01:46:18.829893
768	116	السعة	14 طقم	2026-03-18 01:46:18.830428
769	116	عدد الرفوف	3	2026-03-18 01:46:18.830874
770	116	اللون	أبيض	2026-03-18 01:46:18.831269
771	117	العلامة التجارية	سيمنز	2026-03-18 01:46:23.187229
772	117	نوع الطباخ	حث مغناطيسي (Induction)	2026-03-18 01:46:23.187771
773	117	نوع التثبيت	بلت إن (مدمج)	2026-03-18 01:46:23.188144
774	117	عرض سطح الطهي	80 سم	2026-03-18 01:46:23.188463
775	117	عدد مواقد الطهي	4	2026-03-18 01:46:23.188865
776	117	نوع عناصر التسخين	ملفات حث مغناطيسية	2026-03-18 01:46:23.189173
777	117	التحكم	لمسي	2026-03-18 01:46:23.189475
778	117	وظائف السلامة	قفل أطفال، إيقاف آلي	2026-03-18 01:46:23.189734
779	117	مؤشر الحرارة المتبقية	نعم	2026-03-18 01:46:23.189986
780	118	النوع	جلاية أطباق بلت إن	2026-03-18 01:46:29.202987
781	118	العلامة التجارية	سيمنز	2026-03-18 01:46:29.20365
782	118	عدد البرامج	6	2026-03-18 01:46:29.204291
783	118	السعة	14 طقم	2026-03-18 01:46:29.204843
784	118	عدد الرفوف	3	2026-03-18 01:46:29.205219
785	118	التثبيت	بلت إن مدمجة	2026-03-18 01:46:29.205506
786	119	النوع	فرن كهربائي بلت إن	2026-03-18 01:46:32.204001
787	119	العلامة التجارية	فاير غاز	2026-03-18 01:46:32.204598
788	119	الموديل	برولاين	2026-03-18 01:46:32.204945
789	119	العرض	60 سم	2026-03-18 01:46:32.205236
790	119	السعة	72 لتر	2026-03-18 01:46:32.205513
791	119	الضغط	13 بار	2026-03-18 01:46:32.205772
792	119	التثبيت	بلت إن مدمج	2026-03-18 01:46:32.205999
793	121	العلامة التجارية	سيمنز	2026-03-18 01:46:35.091245
794	121	نوع المنتج	طباخ غاز مدمج	2026-03-18 01:46:35.092308
795	121	العرض	60 سم	2026-03-18 01:46:35.093014
796	121	عدد المواقد	4	2026-03-18 01:46:35.093628
797	121	نوع الوقود	غاز	2026-03-18 01:46:35.09415
798	121	اللون	أسود	2026-03-18 01:46:35.094791
799	121	نوع التثبيت	مدمج	2026-03-18 01:46:35.095243
800	122	النوع	فريزر	2026-03-18 01:46:38.111495
801	122	العلامة التجارية	إل جي	2026-03-18 01:46:38.112486
802	122	السعة	355 لتر	2026-03-18 01:46:38.113171
803	122	عدد الأبواب	7 أبواب	2026-03-18 01:46:38.113974
804	122	نظام التبريد	هوائي	2026-03-18 01:46:38.114507
805	122	نوع المحرك	إنفرتر	2026-03-18 01:46:38.117057
806	122	كفاءة الطاقة	غير محددة	2026-03-18 01:46:38.117891
807	123	العلامة التجارية	سامسونج	2026-03-18 01:46:40.893318
808	123	النوع	ثلاجة	2026-03-18 01:46:40.894356
809	123	السعة	842 لتر	2026-03-18 01:46:40.89505
810	123	عدد الأبواب	4 أبواب	2026-03-18 01:46:40.895604
811	123	نوع المحرك	محرك انفرت	2026-03-18 01:46:40.896101
812	123	الميزات	Family Hub	2026-03-18 01:46:40.896584
813	124	نوع المنتج	ميكروويف بلت إن	2026-03-18 01:46:44.331155
814	124	السعة	23 لتر	2026-03-18 01:46:44.332027
815	124	اللون	أسود	2026-03-18 01:46:44.33263
816	124	الطاقة	غير محدد	2026-03-18 01:46:44.333101
817	124	عدد البرامج	غير محدد	2026-03-18 01:46:44.333548
818	124	المقاس	غير محدد	2026-03-18 01:46:44.333962
819	125	النوع	ثلاجة	2026-03-18 01:46:47.812147
820	125	عدد_الأبواب	4	2026-03-18 01:46:47.813278
821	125	السعة_لتر	605	2026-03-18 01:46:47.814358
822	125	نوع_المحرك	انفيرتر	2026-03-18 01:46:47.815105
823	125	كفاءة_الطاقة	موفر للكهرباء	2026-03-18 01:46:47.815729
824	126	نوع_المنتج	فرن كهربائي بلت إن	2026-03-18 01:46:50.73737
825	126	العلامة_التجارية	سيمنز	2026-03-18 01:46:50.73784
826	126	العرض	60 سم	2026-03-18 01:46:50.738208
827	126	السعة	71 لتر	2026-03-18 01:46:50.738582
828	126	لون_الزجاج	أسود	2026-03-18 01:46:50.738922
829	126	نوع_التثبيت	بلت إن مدمج	2026-03-18 01:46:50.739203
830	127	نوع المنتج	شفاط مطبخ	2026-03-18 01:46:54.062325
831	127	طريقة التثبيت	معلق على الحائط	2026-03-18 01:46:54.062698
832	127	العرض	60 سم	2026-03-18 01:46:54.062958
833	127	قوة الشفط	750 م³/ساعة	2026-03-18 01:46:54.063181
834	127	نوع المحرك	غير محدد	2026-03-18 01:46:54.063389
835	127	عدد السرعات	غير محدد	2026-03-18 01:46:54.063585
836	127	نوع المرشحات	غير محدد	2026-03-18 01:46:54.063779
837	127	الإضاءة	غير محدد	2026-03-18 01:46:54.06397
838	127	اللون	غير محدد	2026-03-18 01:46:54.064166
839	127	مستوى الضوضاء	غير محدد	2026-03-18 01:46:54.064357
840	128	العلامة التجارية	LG	2026-03-18 01:46:58.093735
841	128	نوع التلفزيون	QNED	2026-03-18 01:46:58.094098
842	128	الفئة	QNED70	2026-03-18 01:46:58.094357
843	128	حجم الشاشة	55 بوصة	2026-03-18 01:46:58.09461
844	128	الدقة	4K UHD	2026-03-18 01:46:58.094861
845	128	نوع اللوحة	QNED (Quantum Dot NanoCell)	2026-03-18 01:46:58.095288
846	128	نظام التشغيل	webOS	2026-03-18 01:46:58.095536
847	128	الاتصال	WiFi, Bluetooth, HDMI, USB	2026-03-18 01:46:58.095782
848	128	معالج الصورة	AI ThinQ	2026-03-18 01:46:58.096174
849	128	تقنية HDR	HDR10 Pro	2026-03-18 01:46:58.09649
850	128	معدل التحديث	120Hz	2026-03-18 01:46:58.09675
851	128	الذكاء الاصطناعي	نعم	2026-03-18 01:46:58.097032
852	129	المقاس	70 بوصة	2026-03-18 01:47:01.252202
853	129	الدقة	4K UHD	2026-03-18 01:47:01.25334
854	129	نوع اللوحة	LED	2026-03-18 01:47:01.254294
855	129	نظام التشغيل	Tizen	2026-03-18 01:47:01.255214
856	129	الاتصال	WiFi، Bluetooth، HDMI، USB	2026-03-18 01:47:01.256054
857	129	معدل التحديث	60Hz	2026-03-18 01:47:01.257152
858	129	نسبة العرض	16:9	2026-03-18 01:47:01.257985
859	129	HDR	نعم	2026-03-18 01:47:01.258771
860	129	المنفذ الصوتي	20W	2026-03-18 01:47:01.259401
861	130	النوع	تلفزيون LED	2026-03-18 01:47:04.351198
862	130	الماركة	TCL	2026-03-18 01:47:04.351905
863	130	الفئة	V6C	2026-03-18 01:47:04.352382
864	130	حجم الشاشة	55 بوصة	2026-03-18 01:47:04.352945
865	130	الدقة	4K UHD	2026-03-18 01:47:04.353462
866	130	نوع اللوحة	LED	2026-03-18 01:47:04.354073
867	130	نظام التشغيل	Google TV	2026-03-18 01:47:04.354511
868	131	العلامة التجارية	TCL	2026-03-18 01:47:07.491135
869	131	نوع المنتج	تلفزيون	2026-03-18 01:47:07.491588
870	131	تقنية اللوحة	QLED	2026-03-18 01:47:07.491798
871	131	الفئة	P7K	2026-03-18 01:47:07.49197
872	131	حجم الشاشة	65 بوصة	2026-03-18 01:47:07.493093
873	131	الدقة	4K UHD	2026-03-18 01:47:07.493561
874	131	نظام التشغيل	Google TV أو TCL OS	2026-03-18 01:47:07.49378
875	131	ميزات ذكية	تلفزيون ذكي	2026-03-18 01:47:07.493951
876	132	نوع_المنتج	تلفزيون LED	2026-03-18 01:47:10.896498
877	132	العلامة_التجارية	TCL	2026-03-18 01:47:10.897215
878	132	الفئة	S5K	2026-03-18 01:47:10.897635
879	132	حجم_الشاشة	40 بوصة	2026-03-18 01:47:10.897994
880	132	الدقة	FHD (1920x1080)	2026-03-18 01:47:10.898309
881	132	نوع_اللوحة	LED	2026-03-18 01:47:10.898609
882	132	ذكي	نعم	2026-03-18 01:47:10.898948
883	132	نظام_التشغيل	غير محدد في اسم المنتج	2026-03-18 01:47:10.899273
884	132	الاتصال	WiFi, HDMI, USB	2026-03-18 01:47:10.899539
885	133	النوع	تلفزيون LED ذكي	2026-03-18 01:47:14.023445
886	133	الماركة	TCL	2026-03-18 01:47:14.024525
887	133	الفئة	S5K	2026-03-18 01:47:14.025583
888	133	حجم الشاشة	43 بوصة	2026-03-18 01:47:14.026231
889	133	الدقة	Full HD (1920x1080)	2026-03-18 01:47:14.026724
890	133	نوع اللوحة	LED	2026-03-18 01:47:14.027187
891	133	نظام التشغيل	Android TV	2026-03-18 01:47:14.027716
892	133	الاتصال	WiFi، HDMI، USB	2026-03-18 01:47:14.028056
893	133	المدخلات	HDMI، USB، AUX	2026-03-18 01:47:14.028233
894	133	دقة الصوت	استريو	2026-03-18 01:47:14.028393
895	134	العلامة التجارية	TCL	2026-03-18 01:47:17.583505
896	134	نوع التلفزيون	QLED	2026-03-18 01:47:17.584625
897	134	الفئة	P7K	2026-03-18 01:47:17.585312
898	134	حجم الشاشة	55 بوصة	2026-03-18 01:47:17.585821
899	134	الدقة	4K UHD	2026-03-18 01:47:17.586221
900	134	نوع اللوحة	QLED	2026-03-18 01:47:17.586805
901	134	ذكي	نعم	2026-03-18 01:47:17.588021
902	134	نظام التشغيل	Google TV أو Roku (حسب النسخة)	2026-03-18 01:47:17.588385
903	134	الاتصال	WiFi, HDMI, USB	2026-03-18 01:47:17.588832
904	134	معدل التحديث	60Hz	2026-03-18 01:47:17.589105
905	135	المقاس	50 بوصة	2026-03-18 01:47:20.977736
906	135	الدقة	4K UHD	2026-03-18 01:47:20.97823
907	135	نوع اللوحة	QLED	2026-03-18 01:47:20.978602
908	135	الفئة	P7K	2026-03-18 01:47:20.978907
909	135	نظام التشغيل	Google TV أو Android TV	2026-03-18 01:47:20.979206
910	135	الاتصال	WiFi، HDMI، USB	2026-03-18 01:47:20.979475
911	135	المميزات	ذكي	2026-03-18 01:47:20.979736
912	136	المقاس	85 بوصة	2026-03-18 01:47:24.068903
913	136	الدقة	4K UHD	2026-03-18 01:47:24.069824
914	136	نوع اللوحة	QLED	2026-03-18 01:47:24.070449
915	136	الفئة	P7K	2026-03-18 01:47:24.07096
916	136	نوع الجهاز	تلفزيون ذكي	2026-03-18 01:47:24.071487
917	136	نظام التشغيل	Google TV أو Android TV	2026-03-18 01:47:24.072139
918	137	المقاس	65 بوصة	2026-03-18 01:47:28.261439
919	137	الدقة	4K UHD	2026-03-18 01:47:28.261838
920	137	نوع اللوحة	VA	2026-03-18 01:47:28.262079
921	137	نظام التشغيل	Tizen	2026-03-18 01:47:28.262259
922	137	الاتصال	Wi-Fi 5, Bluetooth 5.2, HDMI 2.1	2026-03-18 01:47:28.262425
923	137	معدل التحديث	60Hz	2026-03-18 01:47:28.262586
924	137	تقنية تحسين الصورة	Crystal UHD	2026-03-18 01:47:28.262746
925	137	المدخلات	HDMI × 2, USB	2026-03-18 01:47:28.262902
926	137	الصوت	20W Stereo	2026-03-18 01:47:28.263052
927	137	الأبعاد	145.2 × 83.8 × 3.1 سم	2026-03-18 01:47:28.263253
928	137	الوزن	20.6 كغ	2026-03-18 01:47:28.263485
929	138	العلامة التجارية	TCL	2026-03-18 01:47:31.318989
930	138	نوع المنتج	تلفزيون ذكي	2026-03-18 01:47:31.3198
931	138	تقنية اللوحة	QLED	2026-03-18 01:47:31.320295
932	138	الفئة	P7K	2026-03-18 01:47:31.320656
933	138	حجم الشاشة	75 بوصة	2026-03-18 01:47:31.320989
934	138	دقة الشاشة	4K UHD	2026-03-18 01:47:31.321314
935	138	نظام التشغيل	غير مكتمل في المنتج المذكور	2026-03-18 01:47:31.321598
936	139	العلامة التجارية	LG	2026-03-18 01:47:37.755147
937	139	نوع المنتج	تلفزيون	2026-03-18 01:47:37.755857
938	139	نوع اللوحة	OLED evo	2026-03-18 01:47:37.756393
939	139	الفئة	CS5	2026-03-18 01:47:37.756841
940	139	حجم الشاشة	55 بوصة	2026-03-18 01:47:37.757185
941	139	الدقة	4K UHD	2026-03-18 01:47:37.757483
942	139	دعم HDR	نعم	2026-03-18 01:47:37.757859
943	139	نظام التشغيل	webOS	2026-03-18 01:47:37.758149
944	139	الاتصال	Wi-Fi، Bluetooth، HDMI	2026-03-18 01:47:37.758412
945	140	العلامة التجارية	Samsung	2026-03-18 01:47:40.736242
946	140	نوع المنتج	تلفزيون ذكي	2026-03-18 01:47:40.737573
947	140	تقنية اللوحة	QLED	2026-03-18 01:47:40.73857
948	140	الفئة	Q6	2026-03-18 01:47:40.739271
949	140	حجم الشاشة	55 بوصة	2026-03-18 01:47:40.739949
950	140	الدقة	4K UHD	2026-03-18 01:47:40.740646
951	140	معدل التحديث	60Hz	2026-03-18 01:47:40.741114
952	140	نظام التشغيل	Tizen	2026-03-18 01:47:40.741463
953	140	الاتصال	WiFi، Bluetooth، HDMI، USB	2026-03-18 01:47:40.74178
954	141	المقاس	32 بوصة	2026-03-18 01:47:43.650481
955	141	نوع اللوحة	LED	2026-03-18 01:47:43.651109
956	141	دقة الشاشة	HD	2026-03-18 01:47:43.651513
957	141	نظام التشغيل	Smart TV	2026-03-18 01:47:43.65181
958	141	الجهد الكهربائي	5V	2026-03-18 01:47:43.652105
959	142	العلامة التجارية	Samsung	2026-03-18 01:47:47.312027
960	142	نوع المنتج	تلفزيون ذكي	2026-03-18 01:47:47.31252
961	142	التكنولوجيا	QLED	2026-03-18 01:47:47.31274
962	142	الفئة	Q6	2026-03-18 01:47:47.312923
963	142	حجم الشاشة	75 بوصة	2026-03-18 01:47:47.313098
964	142	الدقة	4K UHD	2026-03-18 01:47:47.313262
965	142	نسبة التحديث	60Hz	2026-03-18 01:47:47.313424
966	142	نظام التشغيل	Tizen	2026-03-18 01:47:47.313573
967	142	الاتصال	WiFi, Bluetooth, HDMI, USB	2026-03-18 01:47:47.313717
968	142	معدل التباين الديناميكي	HDR10+	2026-03-18 01:47:47.31439
969	142	المعالج	Quantum Processor	2026-03-18 01:47:47.31478
970	142	السطوع	تقريباً 500-600 nits	2026-03-18 01:47:47.315075
971	143	الحجم	85 بوصة	2026-03-18 01:47:50.551892
972	143	الدقة	4K UHD	2026-03-18 01:47:50.553248
973	143	نوع اللوحة	Crystal UHD	2026-03-18 01:47:50.554487
974	143	نظام التشغيل	Tizen	2026-03-18 01:47:50.555579
975	143	الاتصال	WiFi، Bluetooth، HDMI، USB	2026-03-18 01:47:50.556487
976	143	معدل التحديث	60Hz	2026-03-18 01:47:50.557258
977	143	HDR	نعم	2026-03-18 01:47:50.558012
978	143	الصوت	20W	2026-03-18 01:47:50.558765
979	143	الأبعاد تقريباً	1897 × 1099 × 65 ملم	2026-03-18 01:47:50.559923
980	144	النوع	تلفزيون ذكي	2026-03-18 01:47:56.002386
981	144	الماركة	TCL	2026-03-18 01:47:56.002693
982	144	الحجم	75 بوصة	2026-03-18 01:47:56.00289
983	144	الدقة	4K UHD	2026-03-18 01:47:56.003077
984	144	نوع اللوحة	QLED	2026-03-18 01:47:56.003243
985	144	الفئة	P8K	2026-03-18 01:47:56.003406
986	144	نظام التشغيل	Google TV	2026-03-18 01:47:56.003678
987	144	الاتصال	WiFi، HDMI، USB	2026-03-18 01:47:56.003884
988	145	العلامة التجارية	TCL	2026-03-18 01:48:00.502301
989	145	نوع المنتج	تلفزيون ذكي	2026-03-18 01:48:00.503163
990	145	تقنية اللوحة	QLED	2026-03-18 01:48:00.503787
991	145	حجم الشاشة	85 بوصة	2026-03-18 01:48:00.504292
992	145	الدقة	4K UHD	2026-03-18 01:48:00.504948
993	145	معدل التحديث	60Hz	2026-03-18 01:48:00.505605
994	145	نظام التشغيل	Google TV	2026-03-18 01:48:00.505962
995	145	الاتصال	WiFi، Bluetooth، HDMI، USB	2026-03-18 01:48:00.506347
996	146	المقاس	58 بوصة	2026-03-18 01:48:03.802661
997	146	الدقة	4K UHD	2026-03-18 01:48:03.80333
998	146	نوع اللوحة	Crystal UHD	2026-03-18 01:48:03.804098
999	146	نظام التشغيل	Tizen	2026-03-18 01:48:03.804555
1000	146	الاتصال	WiFi، Bluetooth، HDMI، USB	2026-03-18 01:48:03.805137
1001	146	معدل التحديث	60Hz	2026-03-18 01:48:03.805481
1002	146	تقنية التلوين	Dynamic Crystal Color	2026-03-18 01:48:03.805796
1003	146	المعالج	Crystal 4K	2026-03-18 01:48:03.806098
1004	146	الإضاءة الخلفية	LED	2026-03-18 01:48:03.806403
1005	147	الماركة	TCL	2026-03-18 01:48:07.323332
1006	147	النوع	تلفزيون ذكي	2026-03-18 01:48:07.323654
1007	147	تقنية اللوحة	QLED	2026-03-18 01:48:07.323972
1008	147	الفئة	P8K	2026-03-18 01:48:07.324474
1009	147	حجم الشاشة	98 بوصة	2026-03-18 01:48:07.324799
1010	147	الدقة	4K UHD	2026-03-18 01:48:07.325035
1011	147	نسبة التباين الديناميكي	HDR	2026-03-18 01:48:07.325231
1012	147	نظام التشغيل	Android TV	2026-03-18 01:48:07.325438
1013	147	الاتصال	Wi-Fi، Bluetooth	2026-03-18 01:48:07.325646
1014	147	المنافذ	HDMI، USB، AUX	2026-03-18 01:48:07.325845
1015	147	معدل التحديث	60Hz	2026-03-18 01:48:07.326025
1016	148	العلامة_التجارية	LG	2026-03-18 01:48:10.704549
1017	148	نوع_المنتج	تلفزيون OLED	2026-03-18 01:48:10.704963
1018	148	السلسلة	evo C5	2026-03-18 01:48:10.705215
1019	148	حجم_الشاشة_بوصة	77	2026-03-18 01:48:10.7054
1020	148	دقة_العرض	4K UHD	2026-03-18 01:48:10.705583
1021	148	نوع_اللوحة	OLED evo	2026-03-18 01:48:10.705736
1022	148	نظام_التشغيل	webOS	2026-03-18 01:48:10.70589
1023	148	الاتصال_اللاسلكي	Wi-Fi، Bluetooth	2026-03-18 01:48:10.706046
1024	148	المنافذ	HDMI 2.1، USB، Ethernet	2026-03-18 01:48:10.706267
1025	149	المقاس	50 بوصة	2026-03-18 01:48:13.827958
1026	149	الدقة	4K UHD	2026-03-18 01:48:13.828346
1027	149	نوع اللوحة	Crystal UHD	2026-03-18 01:48:13.828584
1028	149	نظام التشغيل	Tizen	2026-03-18 01:48:13.828798
1029	149	الاتصال	WiFi, Bluetooth, HDMI, USB	2026-03-18 01:48:13.829056
1030	149	معدل التحديث	60Hz	2026-03-18 01:48:13.829275
1031	149	تقنية الصورة	Motion Xcelerator	2026-03-18 01:48:13.829478
1032	149	المدخلات	3x HDMI, 1x USB	2026-03-18 01:48:13.829694
1033	150	الماركة	سامسونج	2026-03-18 01:48:16.667915
1034	150	النوع	تلفزيون QLED	2026-03-18 01:48:16.668319
1035	150	الفئة	Q6	2026-03-18 01:48:16.668628
1036	150	حجم الشاشة	65 بوصة	2026-03-18 01:48:16.668819
1037	150	الدقة	4K UHD	2026-03-18 01:48:16.66899
1038	150	نوع اللوحة	QLED	2026-03-18 01:48:16.669149
1039	150	نظام التشغيل	Tizen	2026-03-18 01:48:16.669314
1040	150	الاتصال	Wi-Fi، Bluetooth	2026-03-18 01:48:16.669531
1041	150	المدخلات	HDMI، USB	2026-03-18 01:48:16.669707
1042	151	العلامة التجارية	Samsung	2026-03-18 01:48:20.246316
1043	151	نوع المنتج	تلفزيون ذكي	2026-03-18 01:48:20.246834
1044	151	تقنية اللوحة	QLED	2026-03-18 01:48:20.24713
1045	151	الفئة	Q6	2026-03-18 01:48:20.247394
1046	151	حجم الشاشة	85 بوصة	2026-03-18 01:48:20.247633
1047	151	الدقة	4K UHD	2026-03-18 01:48:20.247861
1048	151	معدل التحديث	60Hz	2026-03-18 01:48:20.248084
1049	151	نظام التشغيل	Tizen	2026-03-18 01:48:20.248318
1050	151	الاتصال	Wi-Fi، Bluetooth، HDMI، USB	2026-03-18 01:48:20.248554
1051	151	HDR	نعم	2026-03-18 01:48:20.248788
1052	151	معدل النوع	120Hz Motion Xcelerator	2026-03-18 01:48:20.249131
1053	152	نوع المنتج	تلفزيون ذكي	2026-03-18 01:48:23.483754
1054	152	العلامة التجارية	إل جي	2026-03-18 01:48:23.484165
1055	152	السلسلة	NanoCell	2026-03-18 01:48:23.484386
1056	152	الفئة	NANO80	2026-03-18 01:48:23.484598
1057	152	حجم الشاشة	86 بوصة	2026-03-18 01:48:23.484783
1058	152	الدقة	4K UHD	2026-03-18 01:48:23.484953
1059	152	نوع اللوحة	NanoCell	2026-03-18 01:48:23.485117
1060	152	نظام التشغيل	WebOS	2026-03-18 01:48:23.485293
1061	152	الاتصال	WiFi، HDMI، USB	2026-03-18 01:48:23.485529
1062	153	النوع	تلفزيون ذكي	2026-03-18 01:48:27.217075
1063	153	الماركة	سامسونج	2026-03-18 01:48:27.217471
1064	153	السلسلة	Neo QLED	2026-03-18 01:48:27.217711
1065	153	الفئة	QN7	2026-03-18 01:48:27.218134
1066	153	حجم الشاشة	75 بوصة	2026-03-18 01:48:27.218413
1067	153	الدقة	4K UHD	2026-03-18 01:48:27.218677
1068	153	نوع اللوحة	Neo QLED	2026-03-18 01:48:27.218892
1069	153	نظام التشغيل	Tizen	2026-03-18 01:48:27.219206
1070	153	الاتصال	WiFi، Ethernet، HDMI، USB	2026-03-18 01:48:27.219539
1071	153	معدل التحديث	120Hz	2026-03-18 01:48:27.219907
1072	153	HDR	HDR10+، HLG	2026-03-18 01:48:27.220536
1073	153	تقنية التحسين	Quantum Processor 4K	2026-03-18 01:48:27.220848
1074	154	المقاس	43 بوصة	2026-03-18 01:48:30.202259
1075	154	الدقة	Full HD (1920 × 1080)	2026-03-18 01:48:30.203182
1076	154	نوع اللوحة	LED	2026-03-18 01:48:30.203808
1077	154	نظام التشغيل	Tizen	2026-03-18 01:48:30.204289
1078	154	الاتصال	WiFi, HDMI, USB	2026-03-18 01:48:30.204709
1079	154	الفئة	F6000	2026-03-18 01:48:30.205091
1080	154	الميزات الذكية	نعم	2026-03-18 01:48:30.205451
1081	155	نوع المنتج	تلفزيون ذكي	2026-03-18 01:48:33.330951
1082	155	العلامة التجارية	فيليبس	2026-03-18 01:48:33.331266
1083	155	الفئة	7100	2026-03-18 01:48:33.331468
1084	155	حجم الشاشة	65 بوصة	2026-03-18 01:48:33.331672
1085	155	الدقة	4K UHD	2026-03-18 01:48:33.331828
1086	155	نوع اللوحة	LED	2026-03-18 01:48:33.331979
1087	155	نظام التشغيل	Android TV أو Saphi	2026-03-18 01:48:33.332125
1088	155	الاتصال	WiFi، Bluetooth، HDMI، USB	2026-03-18 01:48:33.332273
1089	157	نوع المنتج	بنك طاقة محمول	2026-03-18 01:48:36.872384
1090	157	السعة	10000 مللي أمبير	2026-03-18 01:48:36.873415
1091	157	اللون	أسود	2026-03-18 01:48:36.874105
1092	157	التقنية	MagGo (المغناطيسية)	2026-03-18 01:48:36.874579
1093	157	عدد منافذ الإخراج	متعدد	2026-03-18 01:48:36.874971
1094	157	الشحن السريع	نعم	2026-03-18 01:48:36.875345
1095	157	المتوافقية	أجهزة iOS و Android	2026-03-18 01:48:36.875819
1096	157	مقاوم للماء	معيار IP22	2026-03-18 01:48:36.876165
1097	158	العلامة التجارية	Anker	2026-03-18 01:48:41.689698
1098	158	اسم المنتج	PowerPort III	2026-03-18 01:48:41.690601
1099	158	الطاقة	20 واط	2026-03-18 01:48:41.691389
1100	158	عدد المنافذ	1	2026-03-18 01:48:41.691859
1101	158	نوع المنفذ	USB-C	2026-03-18 01:48:41.692296
1102	158	اللون	أبيض	2026-03-18 01:48:41.692677
1103	158	التوافقية	هواتف ذكية، أجهزة لوحية	2026-03-18 01:48:41.693008
1104	158	تقنية الشحن السريع	نعم (Power Delivery)	2026-03-18 01:48:41.693313
1105	159	نوع_الكابل	USB-C إلى USB-C	2026-03-18 01:48:44.933676
1106	159	المادة	نايلون	2026-03-18 01:48:44.934272
1107	159	الطول	1.8 متر	2026-03-18 01:48:44.934616
1108	159	معدل_نقل_البيانات	480 Mbps	2026-03-18 01:48:44.934975
1109	159	قوة_التيار	5A	2026-03-18 01:48:44.935367
1110	159	قوة_الطاقة	100W	2026-03-18 01:48:44.935932
1111	159	التوافقية	جميع أجهزة USB-C	2026-03-18 01:48:44.936275
1112	159	درجة_المتانة	عالية	2026-03-18 01:48:44.936549
1113	160	نوع المنتج	محول طاقة	2026-03-18 01:48:52.234135
1114	160	العلامة التجارية	Apple	2026-03-18 01:48:52.234511
1115	160	قدرة الإخراج	20 واط	2026-03-18 01:48:52.234778
1116	160	نوع الموصل	USB-C	2026-03-18 01:48:52.235004
1117	160	الجهد الكهربائي	100-240 فولت	2026-03-18 01:48:52.235213
1118	160	التوافقية	أجهزة Apple متعددة (iPhone، iPad، MacBook)	2026-03-18 01:48:52.23541
1119	160	الحماية	حماية من الإفراط الحراري والتيار	2026-03-18 01:48:52.23561
1120	160	الوزن	~38 جرام	2026-03-18 01:48:52.235809
1121	160	الأبعاد	صغيرة محمولة	2026-03-18 01:48:52.236395
1122	161	نوع المنتج	شاحن USB-C	2026-03-18 01:48:55.924999
1123	161	العلامة التجارية	أنكر	2026-03-18 01:48:55.925492
1124	161	الطراز	Nano	2026-03-18 01:48:55.925811
1125	161	قدرة الشحن	45 واط	2026-03-18 01:48:55.926035
1126	161	عدد المنافذ	1	2026-03-18 01:48:55.926249
1127	161	نوع المنفذ	USB-C	2026-03-18 01:48:55.926473
1128	161	اللون	أسود	2026-03-18 01:48:55.926663
1129	161	الحجم	صغير (Nano)	2026-03-18 01:48:55.926869
1130	161	التوافقية	متوافق مع معظم الأجهزة ذات منفذ USB-C	2026-03-18 01:48:55.927036
1131	162	نوع_المنتج	كابل USB-C إلى HDMI	2026-03-18 01:48:59.449283
1132	162	الماركة	أنكر	2026-03-18 01:48:59.449941
1133	162	الطول	1.8 متر	2026-03-18 01:48:59.450429
1134	162	اللون	أسود	2026-03-18 01:48:59.450886
1135	162	معايير_الاتصال	USB Type-C إلى HDMI	2026-03-18 01:48:59.451287
1136	162	الدقة_المدعومة	4K@60Hz	2026-03-18 01:48:59.451707
1137	162	نوع_الموصل_الأول	USB Type-C	2026-03-18 01:48:59.45204
1138	162	نوع_الموصل_الثاني	HDMI	2026-03-18 01:48:59.452324
1139	162	القدرة_على_نقل_الفيديو	نعم	2026-03-18 01:48:59.452571
1140	163	نوع المنتج	كابل نقل البيانات والشحن	2026-03-18 01:49:03.255845
1141	163	معيار الاتصال	USB-C إلى USB-C	2026-03-18 01:49:03.256278
1142	163	الطول	1.2 متر	2026-03-18 01:49:03.256839
1143	163	اللون	أسود	2026-03-18 01:49:03.257198
1144	163	الماركة	Anker	2026-03-18 01:49:03.257438
1145	163	معدل نقل البيانات	480 Mbps	2026-03-18 01:49:03.257629
1146	163	قوة التيار المدعومة	3 أمبير	2026-03-18 01:49:03.257808
1147	163	قوة الطاقة المدعومة	60 واط	2026-03-18 01:49:03.257982
1148	163	المواد	PVC معزول	2026-03-18 01:49:03.258155
1149	163	الحماية	معايير السلامة الدولية	2026-03-18 01:49:03.258318
1150	164	نوع الكابل	USB-C	2026-03-18 01:49:06.881968
1151	164	قوة التحويل	60 واط	2026-03-18 01:49:06.882501
1152	164	الطول	1 متر	2026-03-18 01:49:06.882951
1153	164	اللون	أبيض	2026-03-18 01:49:06.883347
1154	164	التوافقية	أجهزة Apple وأجهزة USB-C	2026-03-18 01:49:06.88371
1155	164	معيار الشحن السريع	USB Power Delivery (USB PD)	2026-03-18 01:49:06.883992
1156	165	نوع المنتج	متعقب ذكي	2026-03-18 01:49:10.68186
1157	165	تقنية الاتصال	بلوتوث	2026-03-18 01:49:10.682348
1158	165	نظام التتبع	GPS	2026-03-18 01:49:10.682632
1159	165	نطاق الاتصال	حتى 30 متر	2026-03-18 01:49:10.682879
1160	165	البطارية	قابلة للشحن	2026-03-18 01:49:10.683117
1161	165	مقاوم للماء	IP67	2026-03-18 01:49:10.683357
1162	165	الأبعاد	صغير الحجم	2026-03-18 01:49:10.683585
1163	165	المميزات	تحديد الموقع الفوري، تنبيهات صوتية، تطبيق جوال متوافق	2026-03-18 01:49:10.683796
1164	165	اللون	متعدد الخيارات	2026-03-18 01:49:10.684066
1165	166	النوع	بنك طاقة	2026-03-18 01:49:14.148026
1166	166	الماركة	أنكر	2026-03-18 01:49:14.148369
1167	166	الموديل	Zolo	2026-03-18 01:49:14.148598
1168	166	السعة	غير محددة	2026-03-18 01:49:14.148817
1169	166	قوة الإخراج	35 واط	2026-03-18 01:49:14.149033
1170	166	عدد منافذ USB-C	2	2026-03-18 01:49:14.149243
1171	166	كابلات مدمجة	نعم	2026-03-18 01:49:14.149499
1172	166	نوع الكابلات المدمجة	USB-C	2026-03-18 01:49:14.149693
1173	166	خاصية الشحن السريع	نعم	2026-03-18 01:49:14.149882
1174	167	النوع	بنك طاقة	2026-03-18 01:49:17.231697
1175	167	العلامة التجارية	أنكر	2026-03-18 01:49:17.232042
1176	167	الموديل	Zolo	2026-03-18 01:49:17.232248
1177	167	القدرة الاسمية	35 واط	2026-03-18 01:49:17.232426
1178	167	عدد منافذ USB-C	2	2026-03-18 01:49:17.232685
1179	167	نوع الكابلات	USB-C مدمجة	2026-03-18 01:49:17.23285
1180	167	السعة	10000 mAh تقريباً	2026-03-18 01:49:17.232999
1181	168	النوع	شاحن سيارة	2026-03-18 01:49:22.539862
1182	168	المنفذ	USB-C	2026-03-18 01:49:22.540695
1183	168	القدرة	75 واط	2026-03-18 01:49:22.541265
1184	168	الكابل	مدمج قابل للسحب	2026-03-18 01:49:22.541728
1185	168	عدد المنافذ	1	2026-03-18 01:49:22.542109
1186	168	التوافقية	أجهزة USB-C	2026-03-18 01:49:22.5426
1187	168	الحماية	حماية من الجهد الزائد والحرارة	2026-03-18 01:49:22.543024
1188	169	النوع	Power Bank	2026-03-18 01:49:25.877151
1189	169	السعة	5000 mAh	2026-03-18 01:49:25.877599
1190	169	قوة الإخراج	7.5 W	2026-03-18 01:49:25.877855
1191	169	اللون	أسود	2026-03-18 01:49:25.878066
1192	169	التوافقية	تقنية MagGO (المغناطيسية)	2026-03-18 01:49:25.878262
1193	169	عدد المنافذ	1 (تقريباً)	2026-03-18 01:49:25.878446
1194	169	نوع الاتصال	سلكي (USB)	2026-03-18 01:49:25.878637
1195	169	الميزات	شحن مغناطيسي	2026-03-18 01:49:25.878847
1196	171	نوع المنتج	بنك طاقة محمول	2026-03-18 01:49:29.303879
1197	171	السعة	غير محددة في الاسم	2026-03-18 01:49:29.304997
1198	171	قوة الإخراج	30 واط	2026-03-18 01:49:29.30579
1199	171	الكابل	مدمج	2026-03-18 01:49:29.306452
1200	171	نوع الاتصال	سلكي مدمج	2026-03-18 01:49:29.307142
1201	171	عدد المنافذ	غير محددة في الاسم	2026-03-18 01:49:29.307762
1202	171	حجم النانو	صغير الحجم	2026-03-18 01:49:29.308276
1203	172	نوع المنتج	شاحن سيارة	2026-03-18 01:49:32.068503
1204	172	عدد المنافذ	3	2026-03-18 01:49:32.06937
1205	172	نوع الاتصال	USB-C	2026-03-18 01:49:32.070011
1206	172	الملحقات	مجموعة كابلات	2026-03-18 01:49:32.070532
1207	172	التوافقية	أجهزة USB-C	2026-03-18 01:49:32.071224
1208	173	نوع_المنتج	كابل USB-C إلى USB-C	2026-03-18 01:49:35.153868
1209	173	الطاقة_المدعومة	240 واط	2026-03-18 01:49:35.155429
1210	173	اللون	أسود	2026-03-18 01:49:35.156419
1211	173	الماركة	أنكر	2026-03-18 01:49:35.157555
1212	173	المعيار	USB 3.1 أو أعلى	2026-03-18 01:49:35.158127
1213	173	النوع_والاستخدام	شحن سريع ونقل بيانات	2026-03-18 01:49:35.158902
1214	174	النوع	بنك طاقة لاسلكي	2026-03-18 01:49:39.461062
1215	174	العلامة التجارية	أنكر	2026-03-18 01:49:39.461506
1216	174	الطراز	MagGo	2026-03-18 01:49:39.461782
1217	174	السعة	10000 مللي أمبير	2026-03-18 01:49:39.461998
1218	174	اللون	أسود	2026-03-18 01:49:39.462178
1219	174	تقنية الشحن	شحن لاسلكي مغناطيسي	2026-03-18 01:49:39.462358
1220	174	عدد منافذ الإخراج	منفذ واحد لاسلكي + منفذ USB-C سلكي	2026-03-18 01:49:39.462538
1221	174	قوة الشحن اللاسلكي	15 واط	2026-03-18 01:49:39.462726
1222	174	قوة الشحن السلكي	30 واط	2026-03-18 01:49:39.462877
1223	174	المواد	بلاستيك عالي الجودة	2026-03-18 01:49:39.463023
1224	174	الوزن	تقريباً 235 غرام	2026-03-18 01:49:39.463164
1225	174	الأبعاد	تقريباً 6.5 × 6.5 × 1.5 سم	2026-03-18 01:49:39.463304
1226	174	مؤشر البطارية	شاشة LED رقمية	2026-03-18 01:49:39.463448
1227	175	نوع الكابل	USB-C إلى Lightning	2026-03-18 01:49:43.46067
1228	175	الطول	1.8 متر	2026-03-18 01:49:43.461039
1229	175	اللون	أسود	2026-03-18 01:49:43.462128
1230	175	العلامة التجارية	Anker	2026-03-18 01:49:43.462591
1231	175	معدل نقل البيانات	480 Mbps	2026-03-18 01:49:43.46288
1232	175	الطاقة المدعومة	up to 60W	2026-03-18 01:49:43.463112
1233	175	التوافقية	أجهزة Apple بمنفذ Lightning	2026-03-18 01:49:43.463323
1234	175	المواد	نايلون محبوك معزز	2026-03-18 01:49:43.463527
1235	175	الضمان	18 شهر	2026-03-18 01:49:43.46374
1236	176	نوع المنتج	كابل USB-C إلى USB-C	2026-03-18 01:49:47.326734
1237	176	الطول	1 متر	2026-03-18 01:49:47.327471
1238	176	المادة	نايلون	2026-03-18 01:49:47.328041
1239	176	الماركة	Anker	2026-03-18 01:49:47.328522
1240	176	معايير التوافق	USB 3.1 / USB 2.0	2026-03-18 01:49:47.328978
1241	176	سرعة نقل البيانات	480 Mbps	2026-03-18 01:49:47.329412
1242	176	دعم الشحن السريع	نعم	2026-03-18 01:49:47.329836
1243	176	الحد الأقصى للتيار	3A	2026-03-18 01:49:47.330281
1244	176	المقاومة	مضفور نايلون قوي	2026-03-18 01:49:47.330738
1245	179	نوع الكابل	USB-C	2026-03-18 01:49:50.319824
1246	179	الطول	2 متر	2026-03-18 01:49:50.320184
1247	179	قوة الشحن	40 واط	2026-03-18 01:49:50.320389
1248	179	اللون	أبيض	2026-03-18 01:49:50.320568
1249	179	التوافقية	أجهزة Apple وأجهزة USB-C	2026-03-18 01:49:50.320743
1250	179	معيار الكابل	USB-C to USB-C	2026-03-18 01:49:50.320912
1251	181	نوع المنتج	حامل هاتف للسيارة	2026-03-18 01:49:53.899402
1252	181	العلامة التجارية	Anker	2026-03-18 01:49:53.900376
1253	181	نوع القاعدة	معدنية	2026-03-18 01:49:53.901105
1254	181	اللون	أسود	2026-03-18 01:49:53.901791
1255	181	طريقة التثبيت	تثبيت على لوحة التحكم أو زجاج السيارة	2026-03-18 01:49:53.90233
1256	181	توافقية الأجهزة	متوافق مع معظم الهواتف الذكية	2026-03-18 01:49:53.902768
1257	181	المادة	معدن + بلاستيك عالي الجودة	2026-03-18 01:49:53.903119
1258	181	الدوران	360 درجة	2026-03-18 01:49:53.903474
1259	182	الماركة	Anker	2026-03-18 01:49:57.673681
1260	182	الموديل	1C B2B	2026-03-18 01:49:57.675019
1261	182	النوع	شاحن سريع	2026-03-18 01:49:57.675859
1262	182	قوة الإخراج	30 واط	2026-03-18 01:49:57.676628
1263	182	عدد المنافذ	1	2026-03-18 01:49:57.677147
1264	182	نوع المنفذ	USB-C	2026-03-18 01:49:57.677526
1265	182	اللون	أبيض	2026-03-18 01:49:57.677866
1266	182	التوافقية	أجهزة تدعم USB-C	2026-03-18 01:49:57.678173
1267	183	نوع المنتج	شاحن سيارة لاسلكي	2026-03-18 01:50:01.075735
1268	183	العلامة التجارية	أنكر	2026-03-18 01:50:01.076169
1269	183	نوع الشحن	لاسلكي	2026-03-18 01:50:01.076468
1270	183	الحامل	معدني	2026-03-18 01:50:01.07668
1271	183	اللون	أسود	2026-03-18 01:50:01.076851
1272	183	التوافقية	هواتف ذكية بتقنية Qi	2026-03-18 01:50:01.077012
1273	183	طريقة التثبيت	تهوية السيارة	2026-03-18 01:50:01.077166
1274	183	الحماية	حماية من الإفراط في الشحن	2026-03-18 01:50:01.07732
1275	187	نوع المنتج	بنك طاقة	2026-03-18 01:50:07.007604
1276	187	الطاقة الإجمالية	165 واط	2026-03-18 01:50:07.00822
1277	187	الكابل المدمج	USB-C قابل للسحب	2026-03-18 01:50:07.008524
1278	187	نوع الاتصال	USB-C	2026-03-18 01:50:07.008778
1279	187	قابلية الحمل	محمول	2026-03-18 01:50:07.008952
1280	188	العلامة_التجارية	Anker	2026-03-18 01:50:10.784643
1281	188	النموذج	1C B2B	2026-03-18 01:50:10.785182
1282	188	النوع	شاحن سريع	2026-03-18 01:50:10.785442
1283	188	القوة	30 واط	2026-03-18 01:50:10.785702
1284	188	اللون	أسود	2026-03-18 01:50:10.785985
1285	188	عدد_المنافذ	1	2026-03-18 01:50:10.78626
1286	188	نوع_المنفذ	USB-C	2026-03-18 01:50:10.786474
1287	188	التوافقية	هواتف ذكية وأجهزة محمولة	2026-03-18 01:50:10.786643
1288	188	الجهد_الكهربائي	100-240V	2026-03-18 01:50:10.786799
1289	188	درجة_الحرارة_التشغيل	0-40°C	2026-03-18 01:50:10.786957
1290	193	نوع المنتج	كابل شحن مغناطيسي	2026-03-18 01:50:14.562787
1291	193	التوافقية	ساعة آبل	2026-03-18 01:50:14.563338
1292	193	نوع الموصل	USB-C	2026-03-18 01:50:14.563766
1293	193	الطول	1 متر	2026-03-18 01:50:14.564122
1294	193	الميزة الرئيسية	شحن سريع	2026-03-18 01:50:14.564419
1295	193	التوصيل	مغناطيسي	2026-03-18 01:50:14.56468
1296	193	نوع التيار	تيار مباشر (DC)	2026-03-18 01:50:14.564971
1297	194	نوع المنتج	Power Bank	2026-03-18 01:50:18.028888
1298	194	السعة	10000 مللي أمبير	2026-03-18 01:50:18.029373
1299	194	اللون	أسود	2026-03-18 01:50:18.029593
1300	194	العلامة التجارية	Anker	2026-03-18 01:50:18.029777
1301	194	عدد منافذ الإخراج	عادة منفذين USB-A	2026-03-18 01:50:18.029945
1302	194	نوع الاتصال	سلكي (USB)	2026-03-18 01:50:18.030147
1303	194	الوزن التقريبي	حوالي 195 جرام	2026-03-18 01:50:18.030315
1304	194	الأبعاد التقريبية	حوالي 145 × 71 × 20 ملم	2026-03-18 01:50:18.03048
1305	195	نوع الشاحن	شاحن لاسلكي	2026-03-18 01:50:22.399099
1306	195	التقنية	MagSafe (MagGo)	2026-03-18 01:50:22.399496
1307	195	الشكل	مكعب	2026-03-18 01:50:22.399752
1308	195	قوة الإخراج	15W	2026-03-18 01:50:22.400018
1309	195	التوافقية	أجهزة iPhone و Android متوافقة مع MagSafe	2026-03-18 01:50:22.400228
1310	195	نوع الاتصال	لاسلكي بالحث المغناطيسي	2026-03-18 01:50:22.400545
1311	195	المدخل	USB-C	2026-03-18 01:50:22.400766
1312	195	المواد	ABS مع مغناطيس قوي	2026-03-18 01:50:22.400961
1313	195	الأبعاد	صغيرة ومحمولة	2026-03-18 01:50:22.401168
1314	195	الألوان المتاحة	أسود، أبيض، وألوان أخرى	2026-03-18 01:50:22.401354
1315	196	نوع المنتج	شاحن لاسلكي	2026-03-18 01:50:27.015866
1316	196	العلامة التجارية	Anker	2026-03-18 01:50:27.016426
1317	196	الموديل	Mag Go	2026-03-18 01:50:27.01675
1318	196	شكل الشاحن	لوحة	2026-03-18 01:50:27.017033
1319	196	تقنية الشحن	شحن لاسلكي مغناطيسي	2026-03-18 01:50:27.017302
1320	196	قوة الإخراج	15W	2026-03-18 01:50:27.017534
1321	196	التوافقية	iPhone و الأجهزة المدعومة للشحن اللاسلكي	2026-03-18 01:50:27.017751
1322	196	نوع الاتصال	لاسلكي	2026-03-18 01:50:27.017966
1323	196	المواد	بلاستيك بجودة عالية	2026-03-18 01:50:27.01818
1324	196	الأبعاد	مضغوطة	2026-03-18 01:50:27.018398
1325	196	الوزن	خفيف الوزن	2026-03-18 01:50:27.018618
1326	196	الملحقات	كابل USB-C	2026-03-18 01:50:27.018836
1327	196	مقاوم للماء	لا	2026-03-18 01:50:27.019039
1328	196	مؤشر LED	نعم	2026-03-18 01:50:27.019187
1329	196	الضمان	ضمان محدود	2026-03-18 01:50:27.019334
1330	196	اللون	أسود	2026-03-18 01:50:27.01953
1331	197	نوع_المنتج	كابل USB-C	2026-03-18 01:50:31.399372
1332	197	القدرة_الكهربائية	240W	2026-03-18 01:50:31.400239
1333	197	الميزة_الرئيسية	شحن سريع	2026-03-18 01:50:31.400834
1334	197	الماركة	Anker	2026-03-18 01:50:31.401296
1335	197	معيار_الاتصال	USB-C	2026-03-18 01:50:31.401715
1336	197	الاستخدام	نقل البيانات والشحن	2026-03-18 01:50:31.402086
1337	198	الماركة	سامسونج	2026-03-18 01:50:34.914543
1338	198	الموديل	Galaxy A17	2026-03-18 01:50:34.915241
1339	198	اللون	أسود	2026-03-18 01:50:34.915689
1340	198	سعة التخزين	256 جيجابايت	2026-03-18 01:50:34.916087
1341	198	المعالج	MediaTek Dimensity 5100	2026-03-18 01:50:34.91646
1342	198	الرام	8 جيجابايت	2026-03-18 01:50:34.916832
1343	198	نظام التشغيل	Android	2026-03-18 01:50:34.917167
1344	198	الشاشة	6.5 بوصة	2026-03-18 01:50:34.917494
1345	198	دقة الشاشة	90Hz	2026-03-18 01:50:34.917798
1346	198	الكاميرا الخلفية	50 ميجابكسل	2026-03-18 01:50:34.918081
1347	198	الكاميرا الأمامية	13 ميجابكسل	2026-03-18 01:50:34.918471
1348	198	البطارية	5000 ميلي أمبير	2026-03-18 01:50:34.918764
1349	203	نوع الاتصال	USB-C إلى Lightning	2026-03-18 01:50:38.553241
1350	203	الطول	0.9 متر	2026-03-18 01:50:38.554055
1351	203	التوافقية	أجهزة Apple بمنفذ Lightning	2026-03-18 01:50:38.554698
1352	203	معدل نقل البيانات	480 Mbps	2026-03-18 01:50:38.555224
1353	203	الطاقة المدعومة	تصل إلى 20W	2026-03-18 01:50:38.555683
1354	203	المواد	كابل معزول مقوى	2026-03-18 01:50:38.556125
1355	203	الضمان	سنة واحدة	2026-03-18 01:50:38.556646
1356	204	النوع	طنجرة ضغط كهربائية	2026-03-18 01:50:41.143972
1357	204	الماركة	كاريرا	2026-03-18 01:50:41.145482
1358	204	السعة	8 لتر	2026-03-18 01:50:41.146393
1359	204	الطاقة	1200 واط	2026-03-18 01:50:41.147152
1360	204	اللون	معدن	2026-03-18 01:50:41.147738
1361	205	النوع	ميكروويف	2026-03-18 01:50:44.738303
1362	205	العلامة التجارية	مايديا	2026-03-18 01:50:44.739051
1363	205	السعة	31 لتر	2026-03-18 01:50:44.739535
1364	205	الطاقة	1000 واط	2026-03-18 01:50:44.739942
1365	205	عدد البرامج	6	2026-03-18 01:50:44.740276
1366	205	المادة	ستانلس ستيل	2026-03-18 01:50:44.740597
1367	206	نوع المنتج	مقلى هوائية	2026-03-18 01:50:47.415392
1368	206	الطاقة	1400 واط	2026-03-18 01:50:47.416048
1369	206	السعة	4 لتر	2026-03-18 01:50:47.416468
1370	206	الألوان	أسود / وردي ذهبي	2026-03-18 01:50:47.416843
1371	206	العلامة التجارية	Carrera	2026-03-18 01:50:47.417203
1372	207	النوع	طنجرة ضغط كهربائية	2026-03-18 01:50:50.817367
1373	207	العلامة التجارية	كاريرا	2026-03-18 01:50:50.818251
1374	207	السعة	10 لتر	2026-03-18 01:50:50.818876
1375	207	الطاقة	1400 واط	2026-03-18 01:50:50.819619
1376	207	اللون	معدني	2026-03-18 01:50:50.820182
1377	208	النوع	شواية كهربائية	2026-03-18 01:50:53.737378
1378	208	الطاقة	1700 واط	2026-03-18 01:50:53.738514
1379	208	السعة	8 لتر	2026-03-18 01:50:53.739454
1380	208	المادة	ستانلس ستيل	2026-03-18 01:50:53.740484
1381	208	نوع التسخين	هواء ساخن	2026-03-18 01:50:53.741282
1382	208	نطاق درجة الحرارة	80-200 درجة مئوية	2026-03-18 01:50:53.74191
1383	209	الماركة	كاريرا	2026-03-18 01:50:56.380618
1384	209	نوع المنتج	طنجرة ضغط كهربائية	2026-03-18 01:50:56.381363
1385	209	السعة	12 لتر	2026-03-18 01:50:56.381921
1386	209	القدرة	1600 واط	2026-03-18 01:50:56.382425
1387	209	اللون	معدني	2026-03-18 01:50:56.382954
1388	210	نوع المنتج	عجانة كهربائية	2026-03-18 01:50:59.054973
1389	210	القوة	800 واط	2026-03-18 01:50:59.05601
1390	210	سعة الوعاء	6 لتر	2026-03-18 01:50:59.056744
1391	210	الألوان	رمادي، وردي ذهبي	2026-03-18 01:50:59.057433
1392	210	العلامة التجارية	كاريرا	2026-03-18 01:50:59.057959
1393	211	نوع المنتج	عجانة كهربائية	2026-03-18 01:51:02.579141
1394	211	العلامة التجارية	كاريرا	2026-03-18 01:51:02.579553
1395	211	القوة الكهربائية	1100 واط	2026-03-18 01:51:02.579758
1396	211	سعة الوعاء	5.6 لتر	2026-03-18 01:51:02.579925
1397	211	الألوان	رمادي، وردي ذهبي	2026-03-18 01:51:02.58009
1398	212	العلامة التجارية	مايديا	2026-03-18 01:51:05.542095
1399	212	نوع المنتج	إبريق كهربائي	2026-03-18 01:51:05.542666
1400	212	الطاقة	2200 واط	2026-03-18 01:51:05.543017
1401	212	السعة	1.7 لتر	2026-03-18 01:51:05.543333
1402	212	المادة	ستانلس ستيل	2026-03-18 01:51:05.5436
1403	212	نوع التسخين	عنصر تسخين مخفي	2026-03-18 01:51:05.54392
1404	213	النوع	ماكينة تحضير قهوة	2026-03-18 01:51:08.204882
1405	213	القوة	400 واط	2026-03-18 01:51:08.205595
1406	213	عدد الفناجين	4	2026-03-18 01:51:08.206093
1407	213	العلامة التجارية	كوركماز	2026-03-18 01:51:08.206611
1408	213	نوع الفلتر	فان	2026-03-18 01:51:08.207019
1409	214	النوع	ماكينة تحضير القهوة	2026-03-18 01:51:10.820145
1410	214	الطاقة	400 واط	2026-03-18 01:51:10.820797
1411	214	عدد الفناجين	4	2026-03-18 01:51:10.821219
1412	214	اللون	رماد	2026-03-18 01:51:10.821595
1413	214	العلامة التجارية	كوركماز	2026-03-18 01:51:10.82194
1414	215	نوع المنتج	مكنسة كهربائية	2026-03-18 01:51:18.02897
1415	215	نظام الجمع	بدون كيس	2026-03-18 01:51:18.029814
1416	215	قوة المحرك	1500 واط	2026-03-18 01:51:18.030316
1417	215	الألوان	أزرق/أسود	2026-03-18 01:51:18.030724
1418	215	نوع المحرك	محرك رقمي	2026-03-18 01:51:18.03115
1419	215	نوع الاستخدام	تنظيف منزلي عام	2026-03-18 01:51:18.031508
1420	215	سعة خزان الغبار	غير محدد	2026-03-18 01:51:18.031824
1421	215	مستويات الترشيح	غير محدد	2026-03-18 01:51:18.032586
1422	216	النوع	مقلى هوائية	2026-03-18 01:51:21.106652
1423	216	الطاقة	1800 واط	2026-03-18 01:51:21.107454
1424	216	السعة	30 لتر	2026-03-18 01:51:21.108
1425	216	المادة	ستانلس ستيل	2026-03-18 01:51:21.108433
1426	216	نوع التسخين	هواء ساخن	2026-03-18 01:51:21.108839
1427	216	درجة الحرارة القصوى	200 درجة مئوية تقريباً	2026-03-18 01:51:21.109205
1428	216	استخدام	طهي وقلي صحي	2026-03-18 01:51:21.109675
1429	217	النوع	ميكروويف	2026-03-18 01:51:23.654915
1430	217	العلامة التجارية	إل جي	2026-03-18 01:51:23.655654
1431	217	السعة	42 لتر	2026-03-18 01:51:23.656151
1432	217	الطاقة	1200 واط	2026-03-18 01:51:23.656546
1433	217	اللون	أسود	2026-03-18 01:51:23.656886
1434	218	نوع المنتج	شامبو تنظيف الأسطح	2026-03-18 01:51:26.605662
1435	218	الحجم	1 لتر	2026-03-18 01:51:26.606363
1436	218	اللون	أزرق	2026-03-18 01:51:26.606979
1437	218	الاستخدام	متعدد الاستخدام للأسطح	2026-03-18 01:51:26.607507
1438	218	العلامة التجارية	Bissell	2026-03-18 01:51:26.607902
1439	219	النوع	ميكروويف مع شواية	2026-03-18 01:51:29.16389
1440	219	السعة	42 لتر	2026-03-18 01:51:29.164892
1441	219	الطاقة	1100 واط	2026-03-18 01:51:29.165547
1442	219	اللون	فضي	2026-03-18 01:51:29.166319
1443	219	الماركة	مايديا	2026-03-18 01:51:29.166957
1444	220	نوع المنتج	جهاز تنظيف السجاد وإزالة البقع	2026-03-18 01:51:33.283707
1445	220	الماركة	Bissell	2026-03-18 01:51:33.284739
1446	220	الموديل	Spot and Stain	2026-03-18 01:51:33.285307
1447	220	الاستخدام	تنظيف البقع والانسكابات من السجاد والمفروشات	2026-03-18 01:51:33.285907
1448	220	نوع التقنية	شفط مائي (Wet Vac)	2026-03-18 01:51:33.286421
1449	220	الوظيفة الأساسية	إزالة البقع والبقايا من السجاد	2026-03-18 01:51:33.286893
1450	220	نطاق الاستخدام	السجاد والأثاث والمفروشات	2026-03-18 01:51:33.287351
1451	221	النوع	مكنسة كهربائية عامودية	2026-03-18 01:51:36.604368
1452	221	الاتصال	لاسلكية	2026-03-18 01:51:36.604715
1453	221	القوة	150 واط	2026-03-18 01:51:36.60491
1454	221	نوع المحرك	محرك هوائي	2026-03-18 01:51:36.605082
1455	221	اللون	أسود	2026-03-18 01:51:36.605327
1456	222	العلامة التجارية	مايديا	2026-03-18 01:51:39.340401
1457	222	نوع الجهاز	ميكروويف مع شواية	2026-03-18 01:51:39.342088
1458	222	السعة	29 لتر	2026-03-18 01:51:39.342953
1459	222	الطاقة	900 واط	2026-03-18 01:51:39.343831
1460	222	اللون	أسود	2026-03-18 01:51:39.344515
1461	223	النوع	ميكروويف	2026-03-18 01:51:41.84392
1462	223	الماركة	مايديا	2026-03-18 01:51:41.845458
1463	223	السعة	24 لتر	2026-03-18 01:51:41.846318
1464	223	الطاقة	900 واط	2026-03-18 01:51:41.84729
1465	223	عدد البرامج	6	2026-03-18 01:51:41.847999
1466	223	اللون	أسود	2026-03-18 01:51:41.848525
1467	224	العلامة التجارية	فيليبس	2026-03-18 01:51:44.48323
1468	224	نوع المنتج	خلاط كهربائي	2026-03-18 01:51:44.483827
1469	224	السعة	1.9 لتر	2026-03-18 01:51:44.484151
1470	224	الطاقة	450 واط	2026-03-18 01:51:44.484435
1471	224	اللون	أبيض	2026-03-18 01:51:44.484695
1472	225	النوع	مكنسة كهربائية برميل	2026-03-18 01:51:47.854855
1473	225	الطاقة	1500 واط	2026-03-18 01:51:47.855528
1474	225	نوع التنظيف	رطب وجاف	2026-03-18 01:51:47.855962
1475	225	السعة	غير محددة في الاسم	2026-03-18 01:51:47.856317
1476	225	المحرك	كهربائي	2026-03-18 01:51:47.856642
1477	225	الماركة	بيسيل	2026-03-18 01:51:47.856962
1478	226	النوع	مكواة بخار	2026-03-18 01:51:51.216312
1479	226	الطاقة	2400 واط	2026-03-18 01:51:51.216846
1480	226	مادة لوحة الكي	سيراميك	2026-03-18 01:51:51.217098
1481	226	الألوان	أسود وذهبي	2026-03-18 01:51:51.217308
1482	226	نوع البخار	بخار مستمر	2026-03-18 01:51:51.2175
1483	226	وجود خزان مياه	نعم	2026-03-18 01:51:51.217678
1484	226	التحكم في درجة الحرارة	نعم	2026-03-18 01:51:51.21797
1485	227	النوع	ميكروويف	2026-03-18 01:51:53.71769
1486	227	السعة	20 لتر	2026-03-18 01:51:53.718656
1487	227	الطاقة	700 واط	2026-03-18 01:51:53.719275
1488	227	اللون	أسود	2026-03-18 01:51:53.71987
1489	227	الماركة	مايديا	2026-03-18 01:51:53.720393
1490	228	نوع المنتج	جهاز تنظيف السجاد	2026-03-18 01:51:57.923665
1491	228	الماركة	بيسيل	2026-03-18 01:51:57.925748
1492	228	الموديل	PowerClean 2X	2026-03-18 01:51:57.926448
1493	228	الألوان	أسود وأزرق	2026-03-18 01:51:57.927048
1494	228	نوع التنظيف	ثنائي التمرير	2026-03-18 01:51:57.927605
1495	228	الطاقة	12 أمبير تقريباً	2026-03-18 01:51:57.928049
1496	228	خزان المياه	ثنائي (نظيفة وملوثة)	2026-03-18 01:51:57.928535
1497	228	نوع الفرشاة	فرشاة دوارة	2026-03-18 01:51:57.928855
1498	228	الوزن	حوالي 17 كغ	2026-03-18 01:51:57.929293
1499	228	سلك التغذية	حوالي 7.6 متر	2026-03-18 01:51:57.929829
1500	228	ملحقات	فرشاة يدوية، أنبوب امتصاص	2026-03-18 01:51:57.930391
1501	229	النوع	حبوب قهوة محمصة	2026-03-18 01:52:01.5541
1502	229	الماركة	لافازا	2026-03-18 01:52:01.554686
1503	229	الصنف	جوستو فورتي	2026-03-18 01:52:01.555086
1504	229	الوزن	1 كغم	2026-03-18 01:52:01.555464
1505	229	درجة التحميص	قوي (Forte)	2026-03-18 01:52:01.555771
1506	229	حالة المنتج	حبوب كاملة	2026-03-18 01:52:01.556054
1507	229	الاستخدام	آلات القهوة اسبريسو	2026-03-18 01:52:01.556354
1508	229	النكهة الأساسية	قوية وغنية	2026-03-18 01:52:01.556643
1509	230	النوع	غلاية كهربائية	2026-03-18 01:52:05.054469
1510	230	المادة	زجاج	2026-03-18 01:52:05.055053
1511	230	السعة	1.7 لتر	2026-03-18 01:52:05.055416
1512	230	اللون	أسود	2026-03-18 01:52:05.055717
1513	230	العلامة التجارية	Trust	2026-03-18 01:52:05.055976
1514	231	النوع	مكنسة كهربائية برميل	2026-03-18 01:52:08.175608
1515	231	الطاقة	1600 واط	2026-03-18 01:52:08.176235
1516	231	نوع التنظيف	رطب وجاف	2026-03-18 01:52:08.176632
1517	231	الماركة	مايديا	2026-03-18 01:52:08.176956
1518	231	السعة	غير محددة	2026-03-18 01:52:08.177228
1519	231	نوع المحرك	غير محدد	2026-03-18 01:52:08.177487
1520	231	الملحقات	غير محددة	2026-03-18 01:52:08.177711
1521	231	الوزن	غير محدد	2026-03-18 01:52:08.177918
1522	232	النوع	غلاية زجاج كهربائية	2026-03-18 01:52:13.393577
1523	232	الماركة	Trust	2026-03-18 01:52:13.394789
1524	232	السعة	1.7 لتر	2026-03-18 01:52:13.395449
1525	232	اللون	زيتي	2026-03-18 01:52:13.395992
1526	232	المادة	زجاج	2026-03-18 01:52:13.396374
1527	232	الجهد	220-240V	2026-03-18 01:52:13.396711
1528	232	الطاقة	2200W تقريباً	2026-03-18 01:52:13.396993
1529	232	ميزات	مؤشر مستوى المياه، مفصل دوار 360 درجة، حماية من التشغيل بدون ماء	2026-03-18 01:52:13.397259
1530	233	النوع	مكواة بخار	2026-03-18 01:52:16.82887
1531	233	الماركة	فيليبس	2026-03-18 01:52:16.829343
1532	233	السلسلة	7000	2026-03-18 01:52:16.829678
1533	233	الطاقة	2800 واط	2026-03-18 01:52:16.829954
1534	233	اللون	أزرق	2026-03-18 01:52:16.830228
1535	233	نوع البخار	بخار مستمر	2026-03-18 01:52:16.830606
1536	233	درجة حرارة قابلة للتعديل	نعم	2026-03-18 01:52:16.830975
1537	233	خزان المياه	نعم	2026-03-18 01:52:16.831253
1538	233	مقاومة للكالسيوم	نعم	2026-03-18 01:52:16.83149
1539	233	قفل الأمان	نعم	2026-03-18 01:52:16.831732
1540	233	سلك كهربائي	نعم	2026-03-18 01:52:16.831949
1541	234	النوع	مكواة بخار	2026-03-18 01:52:20.282539
1542	234	القوة	2600 واط	2026-03-18 01:52:20.283121
1543	234	اللون	أسود	2026-03-18 01:52:20.28353
1544	234	نوع الاستخدام	مكواة ملابس بخار	2026-03-18 01:52:20.283852
1545	234	الماركة	راسل هوبز	2026-03-18 01:52:20.284133
1546	235	نوع المنتج	فرن توستر مع قلاية هوائية	2026-03-18 01:52:26.032994
1547	235	السعة	60 لتر	2026-03-18 01:52:26.03368
1548	235	اللون	أسود	2026-03-18 01:52:26.034156
1549	235	الماركة	Overfagaz	2026-03-18 01:52:26.034537
1550	236	نوع المنتج	مكنسة كهربائية للتنظيف العميق	2026-03-18 01:52:30.27552
1551	236	الماركة	Bissell	2026-03-18 01:52:30.276299
1552	236	التقنية	Hydrosteam	2026-03-18 01:52:30.276865
1553	236	الاستخدام	تنظيف السجاد والأرضيات	2026-03-18 01:52:30.277233
1554	236	نوع التنظيف	تنظيف عميق بالماء الساخن والبخار	2026-03-18 01:52:30.27761
1555	236	مصدر الطاقة	كهربائي سلكي	2026-03-18 01:52:30.277991
1556	236	نوع المحرك	محرك كهربائي قوي	2026-03-18 01:52:30.278309
1557	236	الوظائف	شفط وتنظيف بالماء الدافئ	2026-03-18 01:52:30.278604
1558	236	الملحقات	فرشاة تنظيف، خزان الماء	2026-03-18 01:52:30.278942
1559	236	سهولة الاستخدام	محمولة وخفيفة الوزن نسبياً	2026-03-18 01:52:30.279214
1560	237	النوع	مكواة بخار	2026-03-18 01:52:33.53435
1561	237	العلامة التجارية	فيليبس	2026-03-18 01:52:33.535145
1562	237	الطاقة	2400 واط	2026-03-18 01:52:33.535687
1563	237	قوة اندفاع البخار	180 جرام	2026-03-18 01:52:33.53615
1564	237	اللون	أخضر	2026-03-18 01:52:33.536781
1565	238	نوع المنتج	مكنسة كهربائية سلكية	2026-03-18 01:52:36.541326
1566	238	الاستخدام	تنظيف متعدد الأسطح	2026-03-18 01:52:36.542372
1567	238	الطاقة	360 واط	2026-03-18 01:52:36.543043
1568	238	نوع الاتصال	سلكي	2026-03-18 01:52:36.543709
1569	238	الموديل	EdgeFind	2026-03-18 01:52:36.544124
1570	238	اللون	أزرق	2026-03-18 01:52:36.544609
1571	238	الماركة	Bissell	2026-03-18 01:52:36.545052
1572	239	النوع	مكنسة كهربائية لاسلكية	2026-03-18 01:52:40.183616
1573	239	الاستخدام	تنظيف متعدد الأسطح	2026-03-18 01:52:40.184391
1574	239	الموديل	OmniForce Edge	2026-03-18 01:52:40.184969
1575	239	نوع التغذية	بطارية قابلة للشحن	2026-03-18 01:52:40.185476
1576	239	اللون	أسود	2026-03-18 01:52:40.185909
1577	239	التكنولوجيا	كهربائية متقدمة	2026-03-18 01:52:40.186698
1578	239	نوع المحرك	محرك رقمي	2026-03-18 01:52:40.187087
1579	239	الميزات	تنظيف متعدد الأسطح، تصميم خفيف الوزن	2026-03-18 01:52:40.18744
1580	240	نوع المنتج	حبوب قهوة	2026-03-18 01:52:43.980996
1581	240	الماركة	لافازا	2026-03-18 01:52:43.981574
1582	240	النكهة	كريما وأروما	2026-03-18 01:52:43.98197
1583	240	الوزن	1 كغم	2026-03-18 01:52:43.982291
1584	240	شكل القهوة	حبوب (بدون طحن)	2026-03-18 01:52:43.982657
1585	240	درجة التحميص	متوسطة إلى داكنة	2026-03-18 01:52:43.982936
1586	240	الأصل	إيطالية	2026-03-18 01:52:43.983205
1587	241	نوع المنتج	مكواة بخار	2026-03-18 01:52:47.200786
1588	241	القوة الكهربائية	2000 واط	2026-03-18 01:52:47.202092
1589	241	اللون	أبيض	2026-03-18 01:52:47.202964
1590	241	العلامة التجارية	فيليبس	2026-03-18 01:52:47.203679
1591	241	نوع السخان	سيراميك	2026-03-18 01:52:47.205115
1592	241	درجات الحرارة	متعددة	2026-03-18 01:52:47.206054
1593	241	خزان البخار	متكامل	2026-03-18 01:52:47.206668
1594	241	نظام التوزيع	بخار موزع	2026-03-18 01:52:47.207206
1595	242	نوع المنتج	مكنسة كهربائية لاسلكية	2026-03-18 01:52:50.978158
1596	242	الاستخدام	تنظيف متعدد الأسطح	2026-03-18 01:52:50.978648
1597	242	نوع التغذية	بطارية قابلة للشحن	2026-03-18 01:52:50.979007
1598	242	اللون	أسود وأزرق	2026-03-18 01:52:50.979206
1599	242	نظام الترشيح	نظام HEPA	2026-03-18 01:52:50.979373
1600	242	الوزن	خفيف الوزن	2026-03-18 01:52:50.97953
1601	242	سعة الحاوية	غير محدد	2026-03-18 01:52:50.979677
1602	242	قوة الشفط	غير محدد	2026-03-18 01:52:50.979822
1603	242	وقت التشغيل	غير محدد	2026-03-18 01:52:50.979967
1604	242	الملحقات	رؤوس تنظيف متعددة	2026-03-18 01:52:50.980106
1605	243	نوع المنتج	مكنسة كهربائية روبوتية	2026-03-18 01:52:55.524131
1606	243	العلامة التجارية	سامسونج	2026-03-18 01:52:55.524846
1607	243	اللون	أسود	2026-03-18 01:52:55.525371
1608	243	نظام التنظيف	روبوتي ذاتي التشغيل	2026-03-18 01:52:55.525668
1609	243	نوع المحرك	محرك كهربائي	2026-03-18 01:52:55.525933
1610	243	الاتصال	ذكي - Wi-Fi	2026-03-18 01:52:55.526214
1611	243	نظام الملاحة	استشعار ذكي	2026-03-18 01:52:55.526598
1612	243	سعة الغبار	غير محدد	2026-03-18 01:52:55.52688
1613	243	وقت التشغيل	غير محدد	2026-03-18 01:52:55.527107
1614	243	وقت الشحن	غير محدد	2026-03-18 01:52:55.527335
1615	243	مستشعرات	حساسات ذكية	2026-03-18 01:52:55.527549
1616	244	النوع	جهاز تنظيف السجاد	2026-03-18 01:52:58.25602
1617	244	العلامة التجارية	بيسيل	2026-03-18 01:52:58.256499
1618	244	الطاقة	800 واط	2026-03-18 01:52:58.256771
1619	244	التقنية	الرش الفوري	2026-03-18 01:52:58.256988
1620	244	الألوان	أسود وأزرق	2026-03-18 01:52:58.257183
1621	245	النوع	مكنسة كهربائية لاسلكية	2026-03-18 01:53:02.501875
1622	245	الماركة	شارك	2026-03-18 01:53:02.503068
1623	245	الموديل	DETECT PRO	2026-03-18 01:53:02.503907
1624	245	اللون	أبيض	2026-03-18 01:53:02.504531
1625	245	نوع الاتصال	لاسلكي	2026-03-18 01:53:02.505068
1626	245	نوع البطارية	ليثيوم أيون	2026-03-18 01:53:02.505694
1627	245	تكنولوجيا الكشف	DETECT (كشف الأتربة)	2026-03-18 01:53:02.506126
1628	245	الاستخدام	أرضيات وسجاد وأثاث	2026-03-18 01:53:02.50655
1629	245	خاصية إزالة الأتربة	دورة تفريغ ذاتية	2026-03-18 01:53:02.506934
1630	246	النوع	جهاز تنظيف السجاد والمفروشات	2026-03-18 01:53:05.553345
1631	246	الماركة	بيسيل	2026-03-18 01:53:05.554557
1632	246	الموديل	سبوت كلين	2026-03-18 01:53:05.555374
1633	246	القوة	750 واط	2026-03-18 01:53:05.555946
1634	246	الاستخدام	تنظيف البقع والسجاد والمفروشات	2026-03-18 01:53:05.55646
1635	246	نوع المحرك	محرك كهربائي	2026-03-18 01:53:05.556962
1636	246	نظام التنظيف	رش وشفط	2026-03-18 01:53:05.557408
1637	247	نوع المنتج	ماكينة تحضير القهوة	2026-03-18 01:53:09.142436
1638	247	القوة	400 واط	2026-03-18 01:53:09.142986
1639	247	السعة	4 فناجين	2026-03-18 01:53:09.143366
1640	247	اللون	ذهب	2026-03-18 01:53:09.143701
1641	247	نوع التسخين	لوحة تسخين	2026-03-18 01:53:09.144016
1642	247	مادة الجسم	بلاستيك وستانلس ستيل	2026-03-18 01:53:09.144411
1643	248	نوع المنتج	مكنسة كهربائية	2026-03-18 01:53:12.092969
1644	248	نظام التجميع	بدون كيس	2026-03-18 01:53:12.093721
1645	248	الطاقة الكلية	2000 واط	2026-03-18 01:53:12.094195
1646	248	قوة الشفط	273 واط	2026-03-18 01:53:12.094584
1647	248	نوع المحرك	كهربائي	2026-03-18 01:53:12.094934
1648	249	نوع المنتج	أقراص إزالة الشحوم	2026-03-18 01:53:15.477972
1649	249	الماركة	فيليبس	2026-03-18 01:53:15.47868
1650	249	الاستخدام	تنظيف وإزالة الشحوم من الأجهزة الإلكترونية	2026-03-18 01:53:15.479208
1651	249	الصيغة	أقراص	2026-03-18 01:53:15.479635
1652	249	المكونات الرئيسية	محلول منظف متخصص	2026-03-18 01:53:15.48005
1653	249	الآمان	آمن على الأجهزة الحساسة	2026-03-18 01:53:15.480414
1654	250	نوع المنتج	مكواة بخار يدوية	2026-03-18 01:53:18.300757
1655	250	الطاقة	1800 واط	2026-03-18 01:53:18.302163
1656	250	اللون	أسود	2026-03-18 01:53:18.303036
1657	250	الماركة	ترست	2026-03-18 01:53:18.303986
1658	250	نوع الاستخدام	كي الملابس بالبخار	2026-03-18 01:53:18.305325
1659	251	نوع المنتج	سائل إزالة الترسبات	2026-03-18 01:53:22.185568
1660	251	الماركة	فيليبس	2026-03-18 01:53:22.187234
1661	251	الاستخدام	إزالة الترسبات من الأجهزة الكهربائية	2026-03-18 01:53:22.188166
1662	251	التطبيق	غلايات، ماكينات قهوة، موزعات المياه	2026-03-18 01:53:22.18875
1663	251	الحجم النموذجي	500 مل	2026-03-18 01:53:22.189364
1664	251	التركيبة	حمضية فعالة	2026-03-18 01:53:22.189994
1665	251	الآمان	آمن على المعادن والمواد البلاستيكية	2026-03-18 01:53:22.190498
1666	251	المنشأ	أوروبي	2026-03-18 01:53:22.190983
1667	252	نوع المنتج	شامبو سجاد	2026-03-18 01:53:25.008979
1668	252	السعة	4 لتر	2026-03-18 01:53:25.009494
1669	252	العلامة التجارية	ترست	2026-03-18 01:53:25.009874
1670	252	نوع الاستخدام	تنظيف السجاد والموكيت	2026-03-18 01:53:25.010283
1671	252	الشكل	سائل مركز	2026-03-18 01:53:25.010627
1672	253	نوع المنتج	فلتر مياه	2026-03-18 01:53:28.72853
1673	253	الماركة	فيليبس	2026-03-18 01:53:28.729356
1674	253	الموديل	AquaClean	2026-03-18 01:53:28.730066
1675	253	اللون	أبيض	2026-03-18 01:53:28.730592
1676	253	نوع الفلتر	فلتر كربوني	2026-03-18 01:53:28.7311
1677	253	سعة الفلتر	1000 لتر تقريباً	2026-03-18 01:53:28.731481
1678	253	مدة الاستخدام	4 أسابيع تقريباً	2026-03-18 01:53:28.731913
1679	253	المادة	بلاستيك آمن غذائياً	2026-03-18 01:53:28.732378
1680	253	التثبيت	مدمج بالإبريق	2026-03-18 01:53:28.732742
1681	253	السعة الكلية للإبريق	1.0 لتر	2026-03-18 01:53:28.733207
1682	254	نوع المنتج	ماكينة تحضير القهوة	2026-03-18 01:53:31.751093
1683	254	الطاقة	400 واط	2026-03-18 01:53:31.752303
1684	254	عدد الفناجين	4	2026-03-18 01:53:31.752763
1685	254	الماركة	كوركماز	2026-03-18 01:53:31.753142
1686	254	الموديل	أسو	2026-03-18 01:53:31.753473
1687	255	نوع المنتج	خفاقة يدوية	2026-03-18 01:53:37.611216
1688	255	الطاقة	450 واط	2026-03-18 01:53:37.61208
1689	255	اللون	أبيض	2026-03-18 01:53:37.612537
1690	255	العلامة التجارية	فيليبس	2026-03-18 01:53:37.612929
1691	256	نوع المنتج	عجانة يدوية	2026-03-18 01:53:40.662675
1692	256	العلامة التجارية	ترست	2026-03-18 01:53:40.663277
1693	256	الطاقة	250 وط	2026-03-18 01:53:40.663635
1694	256	اللون	أسود	2026-03-18 01:53:40.663954
1695	256	نوع الاستخدام	خلط وعجن يدوي	2026-03-18 01:53:40.664235
1696	256	نوع المحرك	كهربائي	2026-03-18 01:53:40.664512
1697	257	نوع المنتج	عصارة حمضيات كهربائية	2026-03-18 01:53:44.332915
1698	257	الماركة	ترست	2026-03-18 01:53:44.333345
1699	257	الموديل	Twin	2026-03-18 01:53:44.3336
1700	257	الطاقة	90 واط	2026-03-18 01:53:44.333819
1701	257	اللون	أحمر	2026-03-18 01:53:44.334026
1702	257	نوع العصر	حمضيات	2026-03-18 01:53:44.334217
1703	257	عدد المخاريط	2	2026-03-18 01:53:44.334402
1704	258	النوع	مكواة بخار	2026-03-18 01:53:47.759928
1705	258	الماركة	فيليبس	2026-03-18 01:53:47.760678
1706	258	الطاقة	3000 واط	2026-03-18 01:53:47.761351
1707	258	دفعة البخار	240 غرام	2026-03-18 01:53:47.762134
1708	258	اللون	أزرق فاتح	2026-03-18 01:53:47.762715
1709	259	النوع	طنجرة ضغط كهربائية	2026-03-18 01:53:51.422747
1710	259	الماركة	ترست	2026-03-18 01:53:51.423559
1711	259	الموديل	Duo Chef	2026-03-18 01:53:51.424114
1712	259	السعة	6 لتر	2026-03-18 01:53:51.424556
1713	259	القدرة	1500 واط	2026-03-18 01:53:51.424965
1714	259	مصدر الطاقة	كهربائي	2026-03-18 01:53:51.425584
1715	259	وجود مؤقت	نعم	2026-03-18 01:53:51.426172
1716	259	وجود صمام أمان	نعم	2026-03-18 01:53:51.426652
1717	259	مادة الجسم	معدن/استيل	2026-03-18 01:53:51.42704
1718	259	وجود غطاء زجاجي	غير محدد	2026-03-18 01:53:51.427388
1719	260	النوع	مكواة بخار	2026-03-18 01:53:57.204331
1720	260	العلامة التجارية	فيليبس	2026-03-18 01:53:57.205407
1721	260	الطاقة	2000 واط	2026-03-18 01:53:57.206322
1722	260	اللون	أبيض	2026-03-18 01:53:57.20698
1723	260	نوع الاستخدام	كي الملابس	2026-03-18 01:53:57.20741
1724	260	مصدر البخار	بخار	2026-03-18 01:53:57.207768
1725	260	نوع لوح الكي	سيراميك أو ستيل	2026-03-18 01:53:57.208165
1726	261	النوع	جهاز وافل متعدد الاستخدامات	2026-03-18 01:54:00.094635
1727	261	الوظائف	5 في 1	2026-03-18 01:54:00.095408
1728	261	الطاقة	800 واط	2026-03-18 01:54:00.096017
1729	261	اللون	أسود	2026-03-18 01:54:00.096488
1730	261	نوع الجهاز	جهاز طهي كهربائي	2026-03-18 01:54:00.096931
1731	262	النوع	مكنسة كهربائية بخار	2026-03-18 01:54:03.159339
1732	262	الطاقة	1100 واط	2026-03-18 01:54:03.160281
1733	262	الوظيفة الأساسية	تنظيف متعدد الأسطح	2026-03-18 01:54:03.161129
1734	262	التكنولوجيا	نظام البخار المتقاطع	2026-03-18 01:54:03.161912
1735	262	العلامة التجارية	بيسيل	2026-03-18 01:54:03.162655
1736	262	الموديل	CrossWave	2026-03-18 01:54:03.163379
1737	263	النوع	مفرمة لحم	2026-03-18 01:54:05.99129
1738	263	الماركة	Trust	2026-03-18 01:54:05.992017
1739	263	الموديل	Elite	2026-03-18 01:54:05.992721
1740	263	الطاقة	800 واط	2026-03-18 01:54:05.993657
1741	263	اللون	أسود	2026-03-18 01:54:05.995927
1742	263	الاستخدام	متعددة الاستخدام	2026-03-18 01:54:05.996929
1743	264	النوع	مفرمة لحم	2026-03-18 01:54:09.551709
1744	264	العلامة التجارية	ترست	2026-03-18 01:54:09.552798
1745	264	القدرة	600 واط	2026-03-18 01:54:09.553217
1746	264	الاستخدام	متعددة الاستخدام	2026-03-18 01:54:09.553762
1747	264	الألوان	أسود وفضي	2026-03-18 01:54:09.554326
1748	264	الملحقات	شفرات معادن، صواني معادن	2026-03-18 01:54:09.554794
1749	264	المادة	معادن وبلاستيك	2026-03-18 01:54:09.555172
1750	265	نوع_المنتج	عصارة حمضيات كهربائية	2026-03-18 01:54:12.229563
1751	265	السعة	750 مل	2026-03-18 01:54:12.229993
1752	265	اللون	أسود	2026-03-18 01:54:12.230249
1753	265	العلامة_التجارية	E-Plug	2026-03-18 01:54:12.23045
1754	266	النوع	ميزان مطبخ رقمي	2026-03-18 01:54:15.48588
1755	266	الماركة	ترست	2026-03-18 01:54:15.486254
1756	266	السعة القصوى	10 كغ	2026-03-18 01:54:15.486459
1757	266	المادة	زجاج	2026-03-18 01:54:15.486632
1758	266	العرض	رقمي	2026-03-18 01:54:15.486862
1759	266	اللون	أبيض	2026-03-18 01:54:15.487134
1760	266	دقة القياس	1 غ	2026-03-18 01:54:15.487376
1761	266	وحدات القياس	غرام، كيلوغرام، أونصة، باوند	2026-03-18 01:54:15.487684
1762	267	العلامة التجارية	فيليبس	2026-03-18 01:54:18.655764
1763	267	نوع المنتج	مكواة بخار محمولة باليد	2026-03-18 01:54:18.656265
1764	267	الطاقة	1000 واط	2026-03-18 01:54:18.656635
1765	267	دفعة البخار	20 جرام	2026-03-18 01:54:18.656941
1766	267	نوع الاستخدام	العناية بالملابس	2026-03-18 01:54:18.657183
1767	267	التصميم	محمولة باليد	2026-03-18 01:54:18.657402
1768	268	نوع_المنتج	كبسولات قهوة	2026-03-18 01:54:24.527808
1769	268	العلامة_التجارية	سيجافريدو	2026-03-18 01:54:24.528466
1770	268	نوع_القهوة	إسبريسو	2026-03-18 01:54:24.528894
1771	268	عدد_الكبسولات	10	2026-03-18 01:54:24.529259
1772	268	وزن_الكبسولة	6 غرام	2026-03-18 01:54:24.529605
1773	268	الوزن_الإجمالي	60 غرام	2026-03-18 01:54:24.529936
1774	268	التوافقية	آلات قهوة نسبريسو	2026-03-18 01:54:24.530228
1775	269	النوع	غلاية كهربائية	2026-03-18 01:54:27.024436
1776	269	السعة	1.7 لتر	2026-03-18 01:54:27.024828
1777	269	اللون	أسود	2026-03-18 01:54:27.025069
1778	269	الماركة	Trust	2026-03-18 01:54:27.025351
1779	270	النوع	توستر ضغط	2026-03-18 01:54:29.823096
1780	270	الماركة	Trust	2026-03-18 01:54:29.823927
1781	270	الطاقة	2000 واط	2026-03-18 01:54:29.824369
1782	270	لون السطح	أسود زجاجي	2026-03-18 01:54:29.824778
1783	270	الاستخدام	تحميص الخبز	2026-03-18 01:54:29.825209
1784	271	نوع الجهاز	جهاز تنظيف السجاد والمفروشات	2026-03-18 01:54:32.979762
1785	271	الماركة	بيسيل	2026-03-18 01:54:32.980152
1786	271	الموديل	سبوت كلين	2026-03-18 01:54:32.98043
1787	271	الطاقة	330 واط	2026-03-18 01:54:32.980696
1788	271	نوع التوصيل	سلكي	2026-03-18 01:54:32.980952
1789	271	الاستخدام	تنظيف البقع والسجاد والمفروشات	2026-03-18 01:54:32.981203
1790	271	نوع المحرك	كهربائي	2026-03-18 01:54:32.981614
1791	272	النوع	غلاية كهربائية	2026-03-18 01:54:36.979588
1792	272	السعة	1.5 لتر	2026-03-18 01:54:36.979985
1793	272	اللون	أسود	2026-03-18 01:54:36.980233
1794	272	العلامة التجارية	Trust	2026-03-18 01:54:36.980436
1795	272	مادة الجسم	بلاستيك وستانلس ستيل	2026-03-18 01:54:36.980628
1796	272	الطاقة	2200 واط تقريباً	2026-03-18 01:54:36.980812
1797	272	الجهد	220-240 فولت	2026-03-18 01:54:36.981008
1798	272	ميزات	مفتاح تشغيل/إيقاف، حماية من الغليان الجاف، قاعدة دوارة	2026-03-18 01:54:36.981258
1799	273	النوع	خلاط كهربائي	2026-03-18 01:54:39.518052
1800	273	القوة	600 واط	2026-03-18 01:54:39.518716
1801	273	السعة	1.5 لتر	2026-03-18 01:54:39.519178
1802	273	اللون	أسود	2026-03-18 01:54:39.519553
1803	273	الماركة	Trust	2026-03-18 01:54:39.519999
1804	274	العلامة_التجارية	ترست	2026-03-18 01:54:42.169334
1805	274	نوع_المنتج	مقلى هوائية	2026-03-18 01:54:42.170023
1806	274	الطاقة	1700 واط	2026-03-18 01:54:42.170526
1807	274	السعة	11 لتر	2026-03-18 01:54:42.170858
1808	274	اللون	أسود	2026-03-18 01:54:42.172985
1809	275	النوع	كبسولات قهوة	2026-03-18 01:54:48.665218
1810	275	العلامة التجارية	Segafredo	2026-03-18 01:54:48.665806
1811	275	عدد الكبسولات	10	2026-03-18 01:54:48.666262
1812	275	وزن الكبسولة الواحدة	6 غرام	2026-03-18 01:54:48.666599
1813	275	الوزن الإجمالي	60 غرام	2026-03-18 01:54:48.666918
1814	275	المصدر	كوستاريكا	2026-03-18 01:54:48.667232
1815	275	نوع التحميص	Le Origin	2026-03-18 01:54:48.667517
1816	275	التوافقية	آلات قهوة Nespresso	2026-03-18 01:54:48.667977
1817	276	نوع المنتج	كبسولات قهوة	2026-03-18 01:54:52.105905
1818	276	العلامة التجارية	Segafredo	2026-03-18 01:54:52.106702
1819	276	النكهة	Le Origin Peru	2026-03-18 01:54:52.107368
1820	276	عدد الكبسولات	10	2026-03-18 01:54:52.107869
1821	276	وزن الكبسولة الواحدة	6 غرام	2026-03-18 01:54:52.108373
1822	276	الوزن الإجمالي	60 غرام	2026-03-18 01:54:52.108784
1823	276	التوافقية	آلات قهوة Nespresso	2026-03-18 01:54:52.109099
1824	276	نوع التحميص	تحميص متوسط	2026-03-18 01:54:52.10937
1825	276	المنشأ	بيرو	2026-03-18 01:54:52.109634
1826	277	النوع	ميزان مطبخ رقمي	2026-03-18 01:54:55.216987
1827	277	المادة	زجاجي	2026-03-18 01:54:55.217424
1828	277	الوزن الأقصى	10 كغ	2026-03-18 01:54:55.217714
1829	277	اللون	أخضر	2026-03-18 01:54:55.217938
1830	277	العلامة التجارية	Trust	2026-03-18 01:54:55.218156
1831	277	نوع العرض	رقمي	2026-03-18 01:54:55.218368
1832	277	وحدات القياس	كغ، غ، أونصة، رطل	2026-03-18 01:54:55.218612
1833	278	نوع_المنتج	غسالة مع نشافة	2026-03-18 01:54:58.25465
1834	278	العلامة_التجارية	Samsung	2026-03-18 01:54:58.255101
1835	278	السلسلة	Bespoke AI	2026-03-18 01:54:58.255423
1836	278	سعة_الغسيل	18 كغم	2026-03-18 01:54:58.255692
1837	278	سعة_التجفيف	11 كغم	2026-03-18 01:54:58.255892
1838	278	نوع_المحرك	محرك ذكي بتقنية AI	2026-03-18 01:54:58.25609
1839	278	الوظيفة	غسيل وتجفيف مدمج	2026-03-18 01:54:58.256347
1840	279	نوع_المنتج	سماعات أذن لاسلكية	2026-03-18 01:55:01.847495
1841	279	الموديل	J-TWS	2026-03-18 01:55:01.847874
1842	279	نوع_الاتصال	بلوتوث	2026-03-18 01:55:01.84812
1843	279	اللون	أبيض	2026-03-18 01:55:01.848338
1844	279	التصميم	True Wireless (منفصلة تماماً)	2026-03-18 01:55:01.848523
1845	279	نوع_البطارية	بطارية قابلة للشحن	2026-03-18 01:55:01.848695
1846	279	مقاوم_للماء	IPX4 (مقاوم للعرق والرطوبة)	2026-03-18 01:55:01.848863
1847	279	التوافقية	iOS و Android	2026-03-18 01:55:01.849014
1848	280	نوع_الاتصال	Bluetooth 5.3	2026-03-18 01:55:05.731237
1849	280	إلغاء_الضوضاء	نعم (ANC)	2026-03-18 01:55:05.731986
1850	280	مدة_البطارية	10 ساعات	2026-03-18 01:55:05.73252
1851	280	مدة_البطارية_مع_العلبة	48 ساعة	2026-03-18 01:55:05.732969
1852	280	مقاوم_للماء	IPX4	2026-03-18 01:55:05.733378
1853	280	نوع_السماعات	سماعات أذن صغيرة لاسلكية	2026-03-18 01:55:05.733761
1854	280	خاصية_التأخير_المنخفض	نعم	2026-03-18 01:55:05.734138
1855	280	خاصية_الاتصال_المتعدد	نعم	2026-03-18 01:55:05.734498
1856	280	نوع_السائق	مشغلات ديناميكية	2026-03-18 01:55:05.734824
1857	281	نوع_الاتصال	Bluetooth 5.2	2026-03-18 01:55:10.398388
1858	281	إلغاء_الضوضاء	نعم (ANC)	2026-03-18 01:55:10.398817
1859	281	مدة_البطارية	8 ساعات (الأذينة) + 32 ساعة (مع العلبة)	2026-03-18 01:55:10.399053
1860	281	مقاوم_للماء	IPX4	2026-03-18 01:55:10.399251
1861	281	الوزن	4.2 غرام لكل أذينة	2026-03-18 01:55:10.399418
1862	281	نطاق_التردد	20Hz - 20kHz	2026-03-18 01:55:10.399577
1863	281	نوع_السماعة	داخل الأذن	2026-03-18 01:55:10.399729
1864	281	المادة	مزيج من البلاستيك والمعادن	2026-03-18 01:55:10.399875
1865	281	الشحن	USB-C	2026-03-18 01:55:10.400028
1866	281	وقت_الشحن	حوالي ساعة واحدة	2026-03-18 01:55:10.400173
1867	281	وقت_الاقتران	أقل من 10 ثوان	2026-03-18 01:55:10.400314
1868	281	التحكم	لمسي	2026-03-18 01:55:10.400459
1869	282	نوع_الاتصال	Bluetooth 5.3	2026-03-18 01:55:15.432305
1870	282	إلغاء_الضوضاء	Active Noise Cancellation (ANC)	2026-03-18 01:55:15.433072
1871	282	مدة_البطارية	10 ساعات (مع ANC)	2026-03-18 01:55:15.433679
1872	282	مدة_البطارية_بدون_ANC	13 ساعات	2026-03-18 01:55:15.434252
1873	282	الشحن_السريع	10 دقائق تشغيل من 5 دقائق شحن	2026-03-18 01:55:15.434696
1874	282	وقت_الشحن_الكامل	حوالي ساعة واحدة	2026-03-18 01:55:15.435187
1875	282	مقاوم_للماء	IP54	2026-03-18 01:55:15.435531
1876	282	جودة_الصوت	LDAC وAAAC	2026-03-18 01:55:15.435779
1877	282	المايكروفون	مايكروفون ثنائي للمكالمات	2026-03-18 01:55:15.43611
1878	282	الوزن	حوالي 4.3 غرام لكل سماعة	2026-03-18 01:55:15.436397
1879	282	نوع_السماعة	في الأذن (In-Ear)	2026-03-18 01:55:15.436683
1880	282	الترددات	20Hz - 20kHz	2026-03-18 01:55:15.436906
1881	282	المدى_اللاسلكي	10 متر	2026-03-18 01:55:15.437126
1882	282	ملفات_الضوضاء	6 أوضاع ANC	2026-03-18 01:55:15.437321
1883	283	المنتج	Apple AirPods Pro الجيل الثالث	2026-03-18 01:55:19.877171
1884	283	اللون	أبيض	2026-03-18 01:55:19.877645
1885	283	نوع الاتصال	Bluetooth 5.3	2026-03-18 01:55:19.877948
1886	283	إلغاء الضوضاء	نشط (Active Noise Cancellation)	2026-03-18 01:55:19.878222
1887	283	مدة البطارية	6 ساعات (مع الشحن المستمر حتى 30 ساعة)	2026-03-18 01:55:19.878479
1888	283	مقاوم للماء	IP54	2026-03-18 01:55:19.878726
1889	283	الشحن اللاسلكي	نعم	2026-03-18 01:55:19.878944
1890	283	المساعد الصوتي	Siri	2026-03-18 01:55:19.879157
1891	283	الصوت المحيطي	نعم (Adaptive Audio)	2026-03-18 01:55:19.879367
1892	283	الشفافية	نعم (Transparency Mode)	2026-03-18 01:55:19.879537
1893	283	التوافقية	أجهزة Apple	2026-03-18 01:55:19.879719
1894	283	الوزن	4.3 جرام لكل سماعة	2026-03-18 01:55:19.879886
1895	284	نوع_الاتصال	Bluetooth لاسلكي	2026-03-18 01:55:24.420109
1896	284	إلغاء_الضوضاء	نعم (ANC)	2026-03-18 01:55:24.420808
1897	284	مدة_البطارية	8 ساعات	2026-03-18 01:55:24.421356
1898	284	مدة_البطارية_مع_الحالة	32 ساعة	2026-03-18 01:55:24.42185
1899	284	مقاوم_للماء	IP55	2026-03-18 01:55:24.42252
1900	284	نوع_السماعات	سماعات أذن داخل الأذن	2026-03-18 01:55:24.423177
1901	284	الترددات	20Hz - 20kHz	2026-03-18 01:55:24.423676
1902	284	وقت_الشحن	حوالي ساعة	2026-03-18 01:55:24.424098
1903	284	وزن_السماعة	5.4g لكل سماعة	2026-03-18 01:55:24.42448
1904	284	نطاق_الاتصال	حوالي 10 متر	2026-03-18 01:55:24.424862
1905	284	تقنية_الصوت	LDAC، AAC، SBC	2026-03-18 01:55:24.425185
1906	285	نوع_الاتصال	لاسلكي (Bluetooth 5.3)	2026-03-18 01:55:30.211737
1907	285	إلغاء_الضوضاء	نعم (Active Noise Cancellation)	2026-03-18 01:55:30.21245
1908	285	مدة_البطارية	10 ساعات (مع ANC)	2026-03-18 01:55:30.212968
1909	285	مدة_البطارية_بدون_ANC	13 ساعة	2026-03-18 01:55:30.214073
1910	285	مدة_الشحن	2 ساعة	2026-03-18 01:55:30.214653
1911	285	مقاوم_للماء	IPX5	2026-03-18 01:55:30.21505
1912	285	وقت_التشغيل_الإجمالي_مع_الحافظة	48 ساعة	2026-03-18 01:55:30.21543
1913	285	عمق_إلغاء_الضوضاء	حتى 98%	2026-03-18 01:55:30.215738
1914	285	وقت_الاستجابة	منخفض (للألعاب)	2026-03-18 01:55:30.215985
1915	285	نطاق_التردد	20Hz - 20kHz	2026-03-18 01:55:30.216229
1916	285	حجم_مكبر_الصوت	11 ملم	2026-03-18 01:55:30.216473
1917	285	الوزن	حوالي 4.3 جرام لكل سماعة	2026-03-18 01:55:30.216696
1918	285	اللون	أزرق	2026-03-18 01:55:30.217069
1919	285	التوافقية	iOS و Android	2026-03-18 01:55:30.21731
1920	285	الميزات_الإضافية	وضع الشفافية، التحكم باللمس، مساعد صوتي	2026-03-18 01:55:30.217525
1921	286	نوع_الاتصال	لاسلكي (Bluetooth)	2026-03-18 01:55:33.905351
1922	286	إلغاء_الضوضاء	نعم (ANC)	2026-03-18 01:55:33.906339
1923	286	مدة_البطارية	10 ساعات	2026-03-18 01:55:33.907029
1924	286	مدة_البطارية_مع_العلبة	50 ساعة	2026-03-18 01:55:33.907598
1925	286	المقاومة_للماء	IPX5	2026-03-18 01:55:33.908117
1926	286	السماعات_في_العلبة	سماعات أذن	2026-03-18 01:55:33.908581
1927	286	اللون	أسود	2026-03-18 01:55:33.909
1928	286	الميزات_الإضافية	تقنية LDAC، تطبيق Soundcore	2026-03-18 01:55:33.909408
1929	287	نوع_الاتصال	Bluetooth 5.3	2026-03-18 01:55:38.231027
1930	287	إلغاء_الضوضاء	Active Noise Cancellation (ANC)	2026-03-18 01:55:38.232186
1931	287	مدة_البطارية	48 ساعة (مع الحالة)	2026-03-18 01:55:38.232748
1932	287	مدة_البطارية_للسماعة_الواحدة	8 ساعات	2026-03-18 01:55:38.233482
1933	287	مقاوم_للماء	IP45	2026-03-18 01:55:38.234028
1934	287	نوع_السماعة	in-ear	2026-03-18 01:55:38.23439
1935	287	الشحن_السريع	نعم	2026-03-18 01:55:38.234818
1936	287	التحكم_باللمس	نعم	2026-03-18 01:55:38.235153
1937	287	المساعد_الصوتي	نعم	2026-03-18 01:55:38.235621
1938	287	وزن_السماعة	4.2 غرام	2026-03-18 01:55:38.235982
1939	287	نطاق_التردد	20Hz - 20kHz	2026-03-18 01:55:38.236368
1940	287	نوع_السائق	مخصص 10.8mm	2026-03-18 01:55:38.236706
1941	288	نوع_الاتصال	Bluetooth لاسلكي	2026-03-18 01:55:42.287054
1942	288	إلغاء_الضوضاء	نعم (ANC)	2026-03-18 01:55:42.287749
1943	288	مدة_البطارية	10 ساعات	2026-03-18 01:55:42.288647
1944	288	مدة_البطارية_مع_العلبة	50 ساعة	2026-03-18 01:55:42.289085
1945	288	مقاوم_للماء	IPX4	2026-03-18 01:55:42.289474
1946	288	الوزن	4.3 غرام للسماعة الواحدة	2026-03-18 01:55:42.289939
1947	288	نطاق_التردد	20Hz - 20kHz	2026-03-18 01:55:42.290357
1948	288	وقت_الشحن	1.5 ساعة	2026-03-18 01:55:42.290763
1949	288	اللون	أبيض	2026-03-18 01:55:42.291602
1950	288	المميزات_الإضافية	وضع LDAC، تقنية الاتصال المتعدد، التحكم باللمس	2026-03-18 01:55:42.29318
1951	289	نوع_الاتصال	لاسلكي Bluetooth	2026-03-18 01:55:46.573868
1952	289	إلغاء_الضوضاء	نعم (Active Noise Cancellation)	2026-03-18 01:55:46.574687
1953	289	مدة_البطارية	حتى 10 ساعات	2026-03-18 01:55:46.575222
1954	289	مدة_البطارية_مع_العلبة	حتى 50 ساعة	2026-03-18 01:55:46.575666
1955	289	مقاوم_للماء	IP54	2026-03-18 01:55:46.576078
1956	289	الألوان_المتاحة	أبيض	2026-03-18 01:55:46.576468
1957	289	نوع_السماعات	سماعات أذن حقيقية لاسلكية	2026-03-18 01:55:46.576833
1958	289	وقت_الشحن	حوالي ساعة واحدة	2026-03-18 01:55:46.577187
1959	289	نطاق_الاتصال	حتى 10 متر	2026-03-18 01:55:46.577527
1960	290	نوع_الاتصال	Bluetooth 5.3	2026-03-18 01:55:50.76069
1961	290	إلغاء_الضوضاء	نشط (ANC)	2026-03-18 01:55:50.761326
1962	290	مدة_البطارية	6 ساعات (السماعات) + 30 ساعة (مع الحافظة)	2026-03-18 01:55:50.761829
1963	290	مقاوم_للماء	IP54	2026-03-18 01:55:50.762169
1964	290	الشحن	شحن لاسلكي (MagSafe)	2026-03-18 01:55:50.762484
1965	290	المعالج	H2	2026-03-18 01:55:50.762777
1966	290	الحجم	مدمجة	2026-03-18 01:55:50.763057
1967	290	الميزات_الإضافية	كشف الشفاه، وضع المحادثة، الصوت المكاني	2026-03-18 01:55:50.763344
1968	291	نوع_الاتصال	لاسلكي (Bluetooth 5.3)	2026-03-18 01:55:55.61887
1969	291	إلغاء_الضوضاء	نعم (Active Noise Cancellation)	2026-03-18 01:55:55.619723
1970	291	مدة_البطارية	10 ساعات (مع ANC)	2026-03-18 01:55:55.620496
1971	291	مدة_البطارية_بدون_ANC	13 ساعة	2026-03-18 01:55:55.621044
1972	291	مدة_البطارية_الحقيبة	50 ساعة إجمالي	2026-03-18 01:55:55.621503
1973	291	مقاوم_للماء	IPX4	2026-03-18 01:55:55.621886
1974	291	نوع_السماعات	سماعات أذن داخلية	2026-03-18 01:55:55.622228
1975	291	سعة_البطارية	48 mAh (السماعة)	2026-03-18 01:55:55.622545
1976	291	سعة_حقيبة_الشحن	520 mAh	2026-03-18 01:55:55.62283
1977	291	الوزن	4.3 جرام (السماعة الواحدة)	2026-03-18 01:55:55.623221
1978	291	التوصيل_السريع	نعم	2026-03-18 01:55:55.623574
1979	291	التطبيق	Soundcore App	2026-03-18 01:55:55.623866
1980	291	الألوان_المتاحة	أسود	2026-03-18 01:55:55.624119
1981	291	اللون	أسود	2026-03-18 01:55:55.624368
1982	292	نوع_المنتج	سماعات أذن لاسلكية	2026-03-18 01:55:59.871262
1983	292	الموديل	R50i NC	2026-03-18 01:55:59.872359
1984	292	نوع_الاتصال	Bluetooth	2026-03-18 01:55:59.873212
1985	292	إلغاء_الضوضاء	نعم	2026-03-18 01:55:59.873867
1986	292	مدة_البطارية	10 ساعات (مع الشحن)	2026-03-18 01:55:59.874394
1987	292	مدة_البطارية_مع_العلبة	50 ساعة	2026-03-18 01:55:59.874801
1988	292	مقاوم_للماء	IP67	2026-03-18 01:55:59.875213
1989	292	المادة	سيليكون	2026-03-18 01:55:59.875599
1990	292	اللون	زهري	2026-03-18 01:55:59.87596
1991	292	الوزن	4.1 جرام لكل سماعة	2026-03-18 01:55:59.876313
1992	292	نطاق_التردد	20Hz - 20kHz	2026-03-18 01:55:59.876641
1993	292	وقت_الشحن	2 ساعة	2026-03-18 01:55:59.876983
1994	292	الميزات_الإضافية	التحكم باللمس، شحن سريع، مايك مدمج	2026-03-18 01:55:59.877298
1995	293	نوع الاتصال	لاسلكي (Bluetooth 5.3)	2026-03-18 01:56:04.865542
1996	293	إلغاء الضوضاء	نعم (ANC متقدم)	2026-03-18 01:56:04.866498
1997	293	مدة البطارية	10 ساعات (مع إلغاء الضوضاء)	2026-03-18 01:56:04.867134
1998	293	مدة البطارية الإجمالية مع العلبة	48 ساعة	2026-03-18 01:56:04.86765
1999	293	مقاوم للماء	IP55	2026-03-18 01:56:04.86811
2000	293	الدرايفر	10.7 ملم	2026-03-18 01:56:04.868549
2001	293	جودة الصوت	LDAC	2026-03-18 01:56:04.868927
2002	293	وقت الشحن	2 ساعة	2026-03-18 01:56:04.869286
2003	293	نطاق الاتصال	10 أمتار	2026-03-18 01:56:04.86961
2004	293	الوزن	4.3 جرام لكل سماعة	2026-03-18 01:56:04.869976
2005	293	الألوان المتاحة	أسود، ذهبي	2026-03-18 01:56:04.870294
2006	293	المساعد الصوتي	مدعوم	2026-03-18 01:56:04.870596
2007	293	وضع الشفافية	نعم	2026-03-18 01:56:04.870822
2008	294	العلامة التجارية	JBL	2026-03-18 01:56:07.92819
2009	294	نوع الاتصال	سلكي	2026-03-18 01:56:07.929459
2010	294	نوع السماعة	سماعة أذن	2026-03-18 01:56:07.930033
2011	294	خاصية الصوت	جهير نقي	2026-03-18 01:56:07.930495
2012	294	اللون	أبيض	2026-03-18 01:56:07.930858
2013	294	إلغاء الضوضاء	غير محدد	2026-03-18 01:56:07.931351
2014	294	مقاوم للماء	غير محدد	2026-03-18 01:56:07.931748
2015	295	الماركة	Samsung	2026-03-18 01:56:17.051048
2016	295	الموديل	Galaxy A17	2026-03-18 01:56:17.051978
2017	295	اللون	رمادي	2026-03-18 01:56:17.052575
2018	295	التخزين	256 GB	2026-03-18 01:56:17.053118
2019	295	المعالج	MediaTek Helio G99	2026-03-18 01:56:17.053563
2020	295	الرام	8 GB	2026-03-18 01:56:17.053968
2021	295	نظام التشغيل	Android 14	2026-03-18 01:56:17.054355
2022	295	الكاميرا الخلفية	50 MP + 5 MP	2026-03-18 01:56:17.054751
2023	295	الكاميرا الأمامية	13 MP	2026-03-18 01:56:17.055134
2024	295	حجم الشاشة	6.5 بوصة	2026-03-18 01:56:17.055517
2025	295	دقة الشاشة	1080 x 2340 بكسل	2026-03-18 01:56:17.055842
2026	295	نوع الشاشة	IPS LCD	2026-03-18 01:56:17.056159
2027	295	البطارية	5000 mAh	2026-03-18 01:56:17.056409
2028	295	الشحن السريع	25W	2026-03-18 01:56:17.056656
2029	295	الاتصال	5G, 4G LTE, WiFi 6, Bluetooth 5.3, NFC	2026-03-18 01:56:17.056879
2030	296	الماركة	سامسونج	2026-03-18 01:56:21.238072
2031	296	الموديل	Galaxy A07	2026-03-18 01:56:21.239069
2032	296	نوع المنتج	هاتف ذكي	2026-03-18 01:56:21.239919
2033	296	اللون	أسود	2026-03-18 01:56:21.240569
2034	296	سعة التخزين	64 GB	2026-03-18 01:56:21.241117
2035	296	المعالج	MediaTek Helio P35	2026-03-18 01:56:21.241581
2036	296	الذاكرة العشوائية	4 GB	2026-03-18 01:56:21.242018
2037	296	نظام التشغيل	Android 11	2026-03-18 01:56:21.242444
2038	296	حجم الشاشة	6.5 بوصة	2026-03-18 01:56:21.242856
2039	296	دقة الشاشة	720 x 1600 بكسل	2026-03-18 01:56:21.243243
2040	296	الكاميرا الخلفية	13 ميجابكسل	2026-03-18 01:56:21.243601
2041	296	الكاميرا الأمامية	8 ميجابكسل	2026-03-18 01:56:21.243959
2042	296	البطارية	5000 mAh	2026-03-18 01:56:21.2445
2043	296	الاتصالية	4G LTE, WiFi, Bluetooth, NFC	2026-03-18 01:56:21.244859
2044	297	الماركة	Samsung	2026-03-18 01:56:24.720628
2045	297	الموديل	Galaxy A56 5G	2026-03-18 01:56:24.721781
2046	297	التخزين	128GB	2026-03-18 01:56:24.722572
2047	297	اللون	رمادي	2026-03-18 01:56:24.723213
2048	297	نوع الجهاز	هاتف ذكي	2026-03-18 01:56:24.7238
2049	297	نظام التشغيل	Android	2026-03-18 01:56:24.724316
2050	297	المعالج	Exynos 1480	2026-03-18 01:56:24.724796
2051	297	الرام	6GB	2026-03-18 01:56:24.725229
2052	297	الكاميرا الخلفية	50MP	2026-03-18 01:56:24.725682
2053	297	الكاميرا الأمامية	12MP	2026-03-18 01:56:24.726099
2054	297	البطارية	5000mAh	2026-03-18 01:56:24.726485
2055	297	الشاشة	6.5 بوصة	2026-03-18 01:56:24.726851
2056	297	الاتصال	5G	2026-03-18 01:56:24.727202
2057	299	الماركة	سامسونج	2026-03-18 01:56:34.471793
2058	299	الموديل	Galaxy A07	2026-03-18 01:56:34.472505
2059	299	نوع الجهاز	هاتف ذكي	2026-03-18 01:56:34.473095
2060	299	اللون	أخضر	2026-03-18 01:56:34.473608
2061	299	المعالج	MediaTek Helio G25	2026-03-18 01:56:34.474064
2062	299	ذاكرة الوصول العشوائي (RAM)	4 GB	2026-03-18 01:56:34.474488
2063	299	التخزين الداخلي	128 GB	2026-03-18 01:56:34.474843
2064	299	نظام التشغيل	Android 11	2026-03-18 01:56:34.475171
2065	299	حجم الشاشة	6.5 بوصة	2026-03-18 01:56:34.475494
2066	299	دقة الشاشة	720 x 1600 بكسل	2026-03-18 01:56:34.475795
2067	299	الكاميرا الخلفية	13 ميجابكسل + 2 ميجابكسل + 2 ميجابكسل	2026-03-18 01:56:34.476115
2068	299	الكاميرا الأمامية	8 ميجابكسل	2026-03-18 01:56:34.476419
2069	299	السعة البطارية	5000 mAh	2026-03-18 01:56:34.476712
2070	299	الشحن السريع	10W	2026-03-18 01:56:34.477008
2071	299	المنفذ	USB Type-C	2026-03-18 01:56:34.477542
2072	299	مقاومة الماء	لا توجد	2026-03-18 01:56:34.477891
2073	300	الموديل	Galaxy A07	2026-03-18 01:56:38.652845
2074	300	الشركة المصنعة	Samsung	2026-03-18 01:56:38.653668
2075	300	نظام التشغيل	Android 11	2026-03-18 01:56:38.654284
2076	300	المعالج	MediaTek Helio G25	2026-03-18 01:56:38.654731
2077	300	الرام	3GB	2026-03-18 01:56:38.655116
2078	300	التخزين	64GB	2026-03-18 01:56:38.655495
2079	300	سعة البطارية	5000mAh	2026-03-18 01:56:38.655872
2080	300	الكاميرا الخلفية	13MP	2026-03-18 01:56:38.65626
2081	300	الكاميرا الأمامية	8MP	2026-03-18 01:56:38.65661
2082	300	حجم الشاشة	6.5 بوصة	2026-03-18 01:56:38.656987
2083	300	دقة الشاشة	720 × 1600 بيكسل	2026-03-18 01:56:38.657524
2084	300	نوع الشاشة	IPS LCD	2026-03-18 01:56:38.657883
2085	300	اللون	أخضر	2026-03-18 01:56:38.658213
2086	300	نوع الاتصال	4G LTE, Wi-Fi, Bluetooth 5.0	2026-03-18 01:56:38.658669
2087	301	الماركة	Samsung	2026-03-18 01:56:42.135256
2088	301	الموديل	Galaxy A36 5G	2026-03-18 01:56:42.136039
2089	301	نوع الجهاز	هاتف ذكي	2026-03-18 01:56:42.136563
2090	301	اللون	أبيض	2026-03-18 01:56:42.137006
2091	301	التخزين الداخلي	128 جيجابايت	2026-03-18 01:56:42.137451
2092	301	الاتصالية	5G	2026-03-18 01:56:42.137857
2093	301	نظام التشغيل	Android	2026-03-18 01:56:42.13822
2094	302	الماركة	Samsung	2026-03-18 01:56:45.881958
2095	302	الموديل	Galaxy A36 5G	2026-03-18 01:56:45.882844
2096	302	التخزين_الداخلي	128 GB	2026-03-18 01:56:45.883436
2097	302	اللون	أسود	2026-03-18 01:56:45.884972
2098	302	المعالج	MediaTek Dimensity 7050	2026-03-18 01:56:45.885362
2099	302	الذاكرة_العشوائية	6 GB	2026-03-18 01:56:45.885752
2100	302	نظام_التشغيل	Android 14	2026-03-18 01:56:45.886122
2101	302	الكاميرا_الخلفية	50 MP + 8 MP + 2 MP	2026-03-18 01:56:45.886428
2102	302	الكاميرا_الأمامية	13 MP	2026-03-18 01:56:45.886668
2103	302	البطارية	5000 mAh	2026-03-18 01:56:45.886921
2104	302	الشاشة	6.6 انش AMOLED	2026-03-18 01:56:45.887163
2105	302	الاتصال	5G / 4G / WiFi 6	2026-03-18 01:56:45.887416
2106	303	العلامة التجارية	Samsung	2026-03-18 01:56:49.759783
2107	303	الموديل	Galaxy A56 5G	2026-03-18 01:56:49.760731
2108	303	نوع الجهاز	هاتف ذكي	2026-03-18 01:56:49.761413
2109	303	السعة التخزينية	256 GB	2026-03-18 01:56:49.7619
2110	303	اللون	رمادي	2026-03-18 01:56:49.762324
2111	303	الاتصالية	5G	2026-03-18 01:56:49.762708
2112	303	نظام التشغيل	Android	2026-03-18 01:56:49.763072
2113	303	المعالج	Exynos 1380	2026-03-18 01:56:49.763433
2114	303	الذاكرة العشوائية	8 GB	2026-03-18 01:56:49.763761
2115	303	الشاشة	6.5 بوصة AMOLED	2026-03-18 01:56:49.764044
2116	303	دقة الشاشة	FHD+	2026-03-18 01:56:49.764494
2117	303	الكاميرا الخلفية	50 MP	2026-03-18 01:56:49.76494
2118	303	الكاميرا الأمامية	12 MP	2026-03-18 01:56:49.765278
2119	303	البطارية	5000 mAh	2026-03-18 01:56:49.76558
2120	304	الماركة	Samsung	2026-03-18 01:56:53.073547
2121	304	الموديل	Galaxy A56 5G	2026-03-18 01:56:53.07479
2122	304	التخزين	256GB	2026-03-18 01:56:53.075574
2123	304	اللون	زيتي	2026-03-18 01:56:53.076047
2124	304	نظام_التشغيل	Android	2026-03-18 01:56:53.076452
2125	304	المعالج	Exynos 1380	2026-03-18 01:56:53.076787
2126	304	الرام	8GB	2026-03-18 01:56:53.077135
2127	304	الكاميرا_الخلفية	50MP	2026-03-18 01:56:53.077554
2128	304	الكاميرا_الأمامية	12MP	2026-03-18 01:56:53.078118
2129	304	البطارية	5000mAh	2026-03-18 01:56:53.078575
2130	304	الشاشة	6.5 بوصة	2026-03-18 01:56:53.078954
2131	304	معدل_التحديث	120Hz	2026-03-18 01:56:53.079325
2132	304	الاتصال	5G	2026-03-18 01:56:53.079645
2133	305	الجهاز	آبل آيفون 15	2026-03-18 01:56:58.154373
2134	305	المعالج	Apple A17 Pro	2026-03-18 01:56:58.155321
2135	305	الذاكرة العشوائية	6 GB	2026-03-18 01:56:58.155993
2136	305	التخزين	128 GB	2026-03-18 01:56:58.156824
2137	305	الكاميرا الخلفية	48 MP + 12 MP	2026-03-18 01:56:58.157515
2138	305	الكاميرا الأمامية	12 MP	2026-03-18 01:56:58.158065
2139	305	البطارية	3349 mAh	2026-03-18 01:56:58.158541
2140	305	نظام التشغيل	iOS 17	2026-03-18 01:56:58.15898
2141	305	حجم الشاشة	6.1 بوصة	2026-03-18 01:56:58.159295
2142	305	دقة الشاشة	2556 x 1179 بكسل	2026-03-18 01:56:58.159571
2143	305	نوع الشاشة	Super Retina XDR	2026-03-18 01:56:58.15984
2144	305	معدل التحديث	120 Hz	2026-03-18 01:56:58.16017
2145	305	اللون	أزرق	2026-03-18 01:56:58.160448
2146	305	المقاومة	IP69 (مقاوم للماء والغبار)	2026-03-18 01:56:58.160668
2147	306	النموذج	آيفون 17 برو	2026-03-18 01:57:01.641139
2148	306	السعة	256 جيجابايت	2026-03-18 01:57:01.641804
2149	306	اللون	فضي	2026-03-18 01:57:01.642281
2150	306	المعالج	A19 Pro	2026-03-18 01:57:01.642791
2151	306	الرام	8 جيجابايت	2026-03-18 01:57:01.643223
2152	306	نظام التشغيل	iOS 18	2026-03-18 01:57:01.643654
2153	306	الشاشة	6.12 بوصة Super Retina XDR	2026-03-18 01:57:01.644044
2154	306	الكاميرا الخلفية	48 ميجابكسل	2026-03-18 01:57:01.644403
2155	306	الكاميرا الأمامية	12 ميجابكسل	2026-03-18 01:57:01.645538
2156	306	البطارية	3582 ميلي أمبير	2026-03-18 01:57:01.646674
2157	306	المقاومة	IP69	2026-03-18 01:57:01.647208
2158	307	العلامة التجارية	HP	2026-03-18 01:57:05.183315
2159	307	نوع الجهاز	لابتوب	2026-03-18 01:57:05.184454
2160	307	المعالج	Intel Core 5	2026-03-18 01:57:05.185057
2161	307	الذاكرة العشوائية	8GB DDR5	2026-03-18 01:57:05.185702
2162	307	التخزين	512GB SSD	2026-03-18 01:57:05.186173
2163	307	الشاشة	غير محددة	2026-03-18 01:57:05.18654
2164	307	كرت الشاشة	غير محدد	2026-03-18 01:57:05.186863
2165	307	نظام التشغيل	غير محدد	2026-03-18 01:57:05.187177
2166	308	العلامة التجارية	HP	2026-03-18 01:57:08.13817
2167	308	نوع المنتج	لابتوب	2026-03-18 01:57:08.13895
2168	308	المعالج	Intel Core 7	2026-03-18 01:57:08.139893
2169	308	الذاكرة العشوائية	16GB DDR5	2026-03-18 01:57:08.140426
2170	308	التخزين	512GB SSD	2026-03-18 01:57:08.140898
2171	308	الشاشة	غير مكتملة في الوصف	2026-03-18 01:57:08.141275
2172	309	النوع	لابتوب ألعاب	2026-03-18 01:57:11.07754
2173	309	الماركة	HP	2026-03-18 01:57:11.078584
2174	309	السلسلة	Victus	2026-03-18 01:57:11.079328
2175	309	المعالج	Intel Core i7	2026-03-18 01:57:11.07988
2176	309	الرام	16 GB	2026-03-18 01:57:11.080304
2177	309	التخزين	1 TB	2026-03-18 01:57:11.080706
2178	309	نوع التخزين	SSD (محتمل)	2026-03-18 01:57:11.081079
2179	310	نوع_المنتج	لابتوب	2026-03-18 01:57:14.14111
2180	310	الماركة	HP	2026-03-18 01:57:14.141966
2181	310	حجم_الشاشة	16 بوصة	2026-03-18 01:57:14.142516
2182	310	المعالج	Intel Ultra 7 255U	2026-03-18 01:57:14.142854
2183	310	الرام	16 GB	2026-03-18 01:57:14.143166
2184	310	التخزين	512 GB SSD	2026-03-18 01:57:14.143452
2185	310	نظام_التشغيل	Windows 11	2026-03-18 01:57:14.143718
2186	311	العلامة التجارية	HP	2026-03-18 01:57:17.100433
2187	311	نوع الجهاز	لابتوب	2026-03-18 01:57:17.100835
2188	311	المعالج	Intel Core i5	2026-03-18 01:57:17.101075
2189	311	الذاكرة العشوائية	8GB	2026-03-18 01:57:17.101343
2190	311	التخزين	512GB SSD	2026-03-18 01:57:17.101603
2191	311	حجم الشاشة	15.6 إنش	2026-03-18 01:57:17.101841
2192	311	نظام التشغيل	Windows	2026-03-18 01:57:17.102036
2193	312	العلامة التجارية	HP	2026-03-18 01:57:20.42283
2194	312	نوع المنتج	لابتوب	2026-03-18 01:57:20.423305
2195	312	المعالج	Intel Core i7	2026-03-18 01:57:20.423646
2196	312	الذاكرة العشوائية	16GB	2026-03-18 01:57:20.423929
2197	312	التخزين	512GB SSD	2026-03-18 01:57:20.4242
2198	312	حجم الشاشة	15.6 إنش	2026-03-18 01:57:20.424458
2199	312	نظام التشغيل	Windows	2026-03-18 01:57:20.424704
2200	313	المنتج	iPad Air 11 إنش	2026-03-18 01:57:23.209373
2201	313	حجم الشاشة	11 إنش	2026-03-18 01:57:23.209889
2202	313	المعالج	Apple M3	2026-03-18 01:57:23.210446
2203	313	التخزين	256GB	2026-03-18 01:57:23.210994
2204	313	الاتصال	Wi-Fi	2026-03-18 01:57:23.211315
2205	313	نظام التشغيل	iPadOS	2026-03-18 01:57:23.211579
2206	313	نوع الشاشة	Liquid Retina	2026-03-18 01:57:23.211836
2207	314	العلامة التجارية	Blackview	2026-03-18 01:57:26.415508
2208	314	الموديل	Tablet Mega 2	2026-03-18 01:57:26.416227
2209	314	نوع الجهاز	تابلت	2026-03-18 01:57:26.416626
2210	314	السعة التخزينية	256 GB	2026-03-18 01:57:26.416959
2211	314	اللون	رمادي	2026-03-18 01:57:26.417239
2212	315	النوع	iPad	2026-03-18 01:57:32.162135
2213	315	حجم_الشاشة	10.2 إنش	2026-03-18 01:57:32.163594
2214	315	المعالج	A16	2026-03-18 01:57:32.164402
2215	315	التخزين	128GB	2026-03-18 01:57:32.164947
2216	315	الاتصال	Wi-Fi	2026-03-18 01:57:32.165597
2217	315	نظام_التشغيل	iPadOS	2026-03-18 01:57:32.166091
2218	316	النوع	تابلت	2026-03-18 01:57:34.966367
2219	316	الماركة	بلاكفيو	2026-03-18 01:57:34.966829
2220	316	الموديل	تاب 60	2026-03-18 01:57:34.967112
2221	316	الاتصال	واي فاي	2026-03-18 01:57:34.967356
2222	316	سعة التخزين	128 جيجابايت	2026-03-18 01:57:34.967584
2223	316	اللون	رمادي	2026-03-18 01:57:34.967845
2224	317	العلامة التجارية	Blackview	2026-03-18 01:57:37.808365
2225	317	اسم المنتج	Tablet Mega 2	2026-03-18 01:57:37.808705
2226	317	السعة التخزينية	256 GB	2026-03-18 01:57:37.808934
2227	317	اللون	أخضر	2026-03-18 01:57:37.809116
2228	317	نوع الجهاز	تابلت	2026-03-18 01:57:37.809279
2229	318	النوع	ثلاجة	2026-03-18 01:57:40.880197
2230	318	عدد الأبواب	2	2026-03-18 01:57:40.88098
2231	318	نوع الأبواب	جانبية	2026-03-18 01:57:40.881519
2232	318	السعة	635 لتر	2026-03-18 01:57:40.881979
2233	318	نوع المحرك	انفرتر موفر للطاقة	2026-03-18 01:57:40.882394
2234	318	نوع التبريد	تبريد مباشر أو تبريد متعدد التجاويف	2026-03-18 01:57:40.882774
2235	319	النوع	ثلاجة أربع أبواب	2026-03-18 01:57:43.683174
2236	319	السعة	601 لتر	2026-03-18 01:57:43.684014
2237	319	المادة	ستانلس ستيل	2026-03-18 01:57:43.68465
2238	319	اللون	أسود	2026-03-18 01:57:43.685473
2239	319	عدد الأبواب	4	2026-03-18 01:57:43.686364
2240	319	الماركة	سيمنز	2026-03-18 01:57:43.687124
2241	320	النوع	ثلاجة بلت إن	2026-03-18 01:57:46.360718
2242	320	السعة_الكلية	288 لتر	2026-03-18 01:57:46.361761
2243	320	موقع_الفريزر	سفلي	2026-03-18 01:57:46.362907
2244	320	اللون	أبيض	2026-03-18 01:57:46.363934
2245	320	نوع_التبريد	مباشر	2026-03-18 01:57:46.364835
2246	320	عدد_الأبواب	2	2026-03-18 01:57:46.365379
2247	321	النوع	ثلاجة	2026-03-18 01:57:50.084662
2248	321	الماركة	إل جي	2026-03-18 01:57:50.085409
2249	321	السعة	656 لتر	2026-03-18 01:57:50.086111
2250	321	نوع المحرك	انفرتر موفر للكهرباء	2026-03-18 01:57:50.086733
2251	321	اللون	فضي	2026-03-18 01:57:50.087335
2252	321	عدد الأبواب	غير محدد	2026-03-18 01:57:50.087978
2253	321	نوع التبريد	غير محدد	2026-03-18 01:57:50.088592
2254	321	كفاءة الطاقة	غير محدد	2026-03-18 01:57:50.089265
2255	322	النوع	ثلاجة	2026-03-18 01:57:53.093047
2256	322	الماركة	إل جي	2026-03-18 01:57:53.093447
2257	322	الموديل	إنستافيو	2026-03-18 01:57:53.093722
2258	322	عدد الأبواب	4	2026-03-18 01:57:53.093939
2259	322	السعة	847 لتر	2026-03-18 01:57:53.094146
2260	322	نوع المحرك	إنفرتر	2026-03-18 01:57:53.094333
2261	322	نوع التبريد	تبريد مباشر	2026-03-18 01:57:53.094499
2262	323	النوع	فرن كهربائي بلت إن	2026-03-18 01:57:56.63667
2263	323	العرض	60 سم	2026-03-18 01:57:56.637133
2264	323	الماركة	سيمنز	2026-03-18 01:57:56.637466
2265	323	لون الزجاج	أسود	2026-03-18 01:57:56.637747
2266	323	المادة	ستانلس ستيل	2026-03-18 01:57:56.638016
2267	323	نوع التثبيت	بلت إن (مدمج)	2026-03-18 01:57:56.638282
2268	323	السعة	غير محددة	2026-03-18 01:57:56.638559
2269	323	الطاقة	غير محددة	2026-03-18 01:57:56.638806
2270	323	عدد البرامج	غير محددة	2026-03-18 01:57:56.639052
2271	324	نوع_المنتج	فرن كهربائي بلت إن	2026-03-18 01:57:59.56786
2272	324	العرض	60 سم	2026-03-18 01:57:59.568229
2273	324	نوع_التثبيت	بلت إن (مدمج)	2026-03-18 01:57:59.568473
2274	324	لون_الزجاج	أسود	2026-03-18 01:57:59.56879
2275	324	العلامة_التجارية	سيمنز	2026-03-18 01:57:59.569091
2276	325	النوع	فرن بلت إن	2026-03-18 01:58:02.606612
2277	325	العلامة التجارية	Samsung	2026-03-18 01:58:02.607405
2278	325	السعة	76 لتر	2026-03-18 01:58:02.608104
2279	325	اللون	أسود	2026-03-18 01:58:02.608522
2280	325	نظام الطهي	Dual Cook	2026-03-18 01:58:02.609022
2281	325	نوع التحكم	إلكتروني	2026-03-18 01:58:02.609362
2282	325	المقاومة الكهربائية	نعم	2026-03-18 01:58:02.609736
2283	326	نوع المنتج	جهاز تمليس الشعر	2026-03-18 01:58:05.474606
2284	326	الماركة	فيليبس	2026-03-18 01:58:05.475794
2285	326	التقنية	ThermoShield	2026-03-18 01:58:05.476703
2286	326	نوع الاستخدام	تمليس وفرد الشعر	2026-03-18 01:58:05.477469
2287	326	ملاحظة	البيانات غير مكتملة في اسم المنتج	2026-03-18 01:58:05.478326
2288	327	نوع الجهاز	مصفف شعر	2026-03-18 01:58:08.818132
2289	327	الماركة	كامي	2026-03-18 01:58:08.818975
2290	327	الموديل	Multi Pro	2026-03-18 01:58:08.819554
2291	327	الطاقة	1400 واط	2026-03-18 01:58:08.820072
2292	327	اللون	بيج	2026-03-18 01:58:08.820511
2293	327	نوع الاستخدام	تجفيف وتصفيف الشعر	2026-03-18 01:58:08.820891
2294	327	درجات الحرارة	قابلة للتحكم	2026-03-18 01:58:08.821253
2295	327	سرعات النفخ	متعددة	2026-03-18 01:58:08.822417
2296	328	نوع المنتج	آلة إزالة شعر لاسلكية	2026-03-18 01:58:11.891416
2297	328	وقت الاستخدام المستمر	45 دقيقة	2026-03-18 01:58:11.892194
2298	328	نوع الاتصال	لاسلكي	2026-03-18 01:58:11.892692
2299	328	الماركة	كاريرا	2026-03-18 01:58:11.893114
2300	329	نوع المنتج	فرشاة شعر حرارية	2026-03-18 01:58:15.843324
2301	329	العلامة التجارية	كامي	2026-03-18 01:58:15.84373
2302	329	الموديل	Elegance	2026-03-18 01:58:15.843949
2303	329	الطاقة	1000 واط	2026-03-18 01:58:15.844126
2304	329	اللون	بيج	2026-03-18 01:58:15.844334
2305	329	نوع الاستخدام	تمليس وتجفيف الشعر	2026-03-18 01:58:15.844557
2306	329	الملحقات	رؤوس تبديل (متوقع)	2026-03-18 01:58:15.844743
2307	329	التحكم بدرجة الحرارة	متغير (متوقع)	2026-03-18 01:58:15.844919
2308	330	النوع	جهاز تمليس الشعر	2026-03-18 01:58:22.494968
2309	330	الماركة	فيلبس	2026-03-18 01:58:22.496768
2310	330	الحد الأقصى لدرجة الحرارة	230°C	2026-03-18 01:58:22.49769
2311	330	اللون	أسود	2026-03-18 01:58:22.498317
2312	330	نوع الاستخدام	تمليس الشعر	2026-03-18 01:58:22.498812
2313	330	التحكم	درجة حرارة قابلة للتعديل	2026-03-18 01:58:22.499226
2314	331	نوع الجهاز	ماكينة حلاقة كهربائية	2026-03-18 01:58:27.491528
2315	331	الموديل	OneBlade	2026-03-18 01:58:27.493297
2316	331	القابلية	قابلة لإعادة الشحن	2026-03-18 01:58:27.494594
2317	331	نوع البطارية	ليثيوم أيون	2026-03-18 01:58:27.495958
2318	331	مدة التشغيل	45 دقيقة تقريباً	2026-03-18 01:58:27.496814
2319	331	وقت الشحن	8 ساعات تقريباً	2026-03-18 01:58:27.497585
2320	331	نوع الشفرة	شفرة مزدوجة الوجه	2026-03-18 01:58:27.498799
2321	331	سرعة الاهتزازات	200 اهتزازة في الثانية	2026-03-18 01:58:27.499915
2322	331	مقاوم للماء	نعم IP54	2026-03-18 01:58:27.500523
2323	331	الملحقات	رؤوس استبدالية، شاحن، حقيبة	2026-03-18 01:58:27.501139
2324	331	الاستخدام	حلاقة وتشذيب اللحية والشعر	2026-03-18 01:58:27.501725
2325	331	مصدر الطاقة	شاحن كهربائي USB	2026-03-18 01:58:27.502403
2326	331	اللون	أسود/رمادي معدني	2026-03-18 01:58:27.502982
2327	332	نوع المنتج	مموج شعر	2026-03-18 01:58:30.30205
2328	332	درجة الحرارة القصوى	210 درجة مئوية	2026-03-18 01:58:30.302517
2329	332	الألوان	رمادي/ذهبي	2026-03-18 01:58:30.302893
2330	332	نوع الاستخدام	تمويج وتصفيف الشعر	2026-03-18 01:58:30.303264
2331	333	نوع الجهاز	آلة إزالة الشعر السلكية	2026-03-18 01:58:34.156734
2332	333	الجهد الكهربائي	15 فولت	2026-03-18 01:58:34.157091
2333	333	عدد إعدادات السرعة	2	2026-03-18 01:58:34.157283
2334	333	سعة الخزان	1 مل	2026-03-18 01:58:34.157453
2335	333	الاستخدام	إزالة الشعر	2026-03-18 01:58:34.157624
2336	333	نوع التشغيل	سلكي	2026-03-18 01:58:34.157781
2337	334	نوع الجهاز	جهاز إزالة الشعر	2026-03-18 01:58:38.091317
2338	334	التقنية	IPL (الضوء النبضي المكثف)	2026-03-18 01:58:38.104786
2339	334	الماركة	سينسيكا	2026-03-18 01:58:38.106194
2340	334	الموديل	Sensilight Mini	2026-03-18 01:58:38.107247
2341	334	الحجم	صغير (Mini)	2026-03-18 01:58:38.108247
2342	334	مناطق الاستخدام	الوجه والجسم	2026-03-18 01:58:38.109281
2343	334	نوع الاستخدام	منزلي	2026-03-18 01:58:38.110086
2344	335	نوع المنتج	فرشاة أسنان كهربائية	2026-03-18 01:58:45.968616
2345	335	العلامة التجارية	أورال-بي	2026-03-18 01:58:45.96908
2346	335	الموديل	Vitality Pro	2026-03-18 01:58:45.969379
2347	335	اللون	أسود	2026-03-18 01:58:45.969854
2348	335	نوع التقنية	اهتزاز ثنائي الاتجاه	2026-03-18 01:58:45.970365
2349	335	عدد الاهتزازات	7600 اهتزازة/دقيقة	2026-03-18 01:58:45.970739
2350	335	مستويات التنظيف	2	2026-03-18 01:58:45.971017
2351	335	نوع البطارية	قابلة للشحن (Li-ion)	2026-03-18 01:58:45.971282
2352	335	وقت الشحن	16-24 ساعة	2026-03-18 01:58:45.971463
2353	335	مدة الاستخدام	7 أيام (بشحنة واحدة)	2026-03-18 01:58:45.971724
2354	335	مقاوم للماء	IPX7	2026-03-18 01:58:45.97189
2355	335	الملحقات	رأس فرشاة قياسي واحد	2026-03-18 01:58:45.972068
2356	335	مؤشر البطارية	نعم	2026-03-18 01:58:45.972214
2357	335	مؤقت	30 ثانية	2026-03-18 01:58:45.97236
2358	336	نوع المنتج	آلة إزالة الشعر	2026-03-18 01:58:48.61788
2359	336	الطاقة	15 فولت	2026-03-18 01:58:48.61833
2360	336	عدد إعدادات السرعة	2	2026-03-18 01:58:48.618625
2361	336	اللون	أبيض	2026-03-18 01:58:48.618901
2362	336	نوع الاستخدام	إزالة الشعر	2026-03-18 01:58:48.619226
2363	337	النوع	فرشاة أسنان كهربائية	2026-03-18 01:58:52.764234
2364	337	الماركة	أورال-بي	2026-03-18 01:58:52.764904
2365	337	الموديل	Vitality Frozen	2026-03-18 01:58:52.765417
2366	337	اللون	أزرق	2026-03-18 01:58:52.765816
2367	337	نوع الحركة	اهتزازية	2026-03-18 01:58:52.766167
2368	337	عدد الاهتزازات	7600 اهتزازة/دقيقة	2026-03-18 01:58:52.766525
2369	337	مصدر الطاقة	بطارية قابلة للشحن	2026-03-18 01:58:52.766851
2370	337	وقت الشحن	16 ساعة	2026-03-18 01:58:52.767146
2371	337	مدة البطارية	أسبوع تقريباً	2026-03-18 01:58:52.767631
2372	337	رؤوس الفرشاة	قابلة للاستبدال	2026-03-18 01:58:52.768115
2373	337	مقاوم للماء	نعم	2026-03-18 01:58:52.768436
2374	337	درجة مقاومة الماء	IPX7	2026-03-18 01:58:52.768686
2375	337	الملحقات	رأس فرشاة واحد + شاحن	2026-03-18 01:58:52.768948
2376	338	نوع المنتج	فرشاة أسنان كهربائية	2026-03-18 01:58:58.146903
2377	338	العلامة التجارية	أورال-بي	2026-03-18 01:58:58.14774
2378	338	الموديل	Vitality Spiderman	2026-03-18 01:58:58.148062
2379	338	اللون	أزرق	2026-03-18 01:58:58.148376
2380	338	نوع الحركة	اهتزازية	2026-03-18 01:58:58.148646
2381	338	عدد الاهتزازات	7600 اهتزازة في الدقيقة	2026-03-18 01:58:58.14893
2382	338	مستويات التنظيف	2	2026-03-18 01:58:58.149263
2383	338	عمر المستخدم	من 3 سنوات فما فوق	2026-03-18 01:58:58.149535
2384	338	نوع البطارية	AA	2026-03-18 01:58:58.149716
2385	338	مقاوم للماء	نعم	2026-03-18 01:58:58.149891
2386	338	الملحقات المرفقة	رأس فرشاة استبدالي واحد	2026-03-18 01:58:58.150155
2387	338	مدة عمل البطارية	حوالي 7 أيام من الاستخدام اليومي	2026-03-18 01:58:58.150397
2388	339	نوع المنتج	مجفف شعر	2026-03-18 01:59:00.862329
2389	339	القوة الكهربائية	2300 واط	2026-03-18 01:59:00.862752
2390	339	التقنية	ThermoShield	2026-03-18 01:59:00.86301
2391	339	عدد الإعدادات	3	2026-03-18 01:59:00.863266
2392	339	العلامة التجارية	فيليبس	2026-03-18 01:59:00.863555
2393	340	النوع	فرشاة أسنان كهربائية	2026-03-18 01:59:07.890884
2394	340	العلامة التجارية	أورال-بي	2026-03-18 01:59:07.891444
2395	340	الموديل	iO Series 5	2026-03-18 01:59:07.891689
2396	340	اللون	أسود	2026-03-18 01:59:07.891867
2397	340	تقنية التنظيف	تقنية iO المغناطيسية	2026-03-18 01:59:07.892026
2398	340	عدد الذبذبات	40000 ذبذبة/دقيقة	2026-03-18 01:59:07.892177
2399	340	أنماط التنظيف	5 أنماط	2026-03-18 01:59:07.892428
2400	340	مستشعر الضغط	نعم	2026-03-18 01:59:07.892671
2401	340	شاشة العرض	شاشة ذكية	2026-03-18 01:59:07.892865
2402	340	البطارية	قابلة للشحن	2026-03-18 01:59:07.893027
2403	340	مدة البطارية	حتى 14 يوم	2026-03-18 01:59:07.893208
2404	340	وقت الشحن	3 ساعات	2026-03-18 01:59:07.893495
2405	340	رؤوس القابلة للاستبدال	متضمنة	2026-03-18 01:59:07.893769
2406	340	مقاوم للماء	نعم IPX7	2026-03-18 01:59:07.894016
2407	340	الملحقات	حامل شحن، رأس فرشاة احتياطي	2026-03-18 01:59:07.894243
2408	340	الاتصال الذكي	تطبيق أورال-بي	2026-03-18 01:59:07.894483
2409	340	منطقة التنظيف	16 منطقة في الفم	2026-03-18 01:59:07.894679
2410	341	النوع	فرشاة أسنان كهربائية	2026-03-18 01:59:12.285032
2411	341	الموديل	iO Series 2	2026-03-18 01:59:12.285562
2412	341	الماركة	Oral-B	2026-03-18 01:59:12.285804
2413	341	اللون	أسود	2026-03-18 01:59:12.286022
2414	341	تقنية التنظيف	تقنية iO مغناطيسية	2026-03-18 01:59:12.286234
2415	341	عدد الذبذبات	43000 ذبذبة في الدقيقة	2026-03-18 01:59:12.286625
2416	341	أوضاع التنظيف	6 أوضاع	2026-03-18 01:59:12.286948
2417	341	مدة البطارية	تصل إلى 14 يوم	2026-03-18 01:59:12.287168
2418	341	وقت الشحن	3 ساعات	2026-03-18 01:59:12.287377
2419	341	مقاوم للماء	IPX7	2026-03-18 01:59:12.28757
2420	341	الملحقات	رؤوس بديلة، حامل شحن	2026-03-18 01:59:12.287764
2421	341	نوع البطارية	بطارية قابلة للشحن	2026-03-18 01:59:12.287952
2422	341	الاستشعار	مستشعر الضغط	2026-03-18 01:59:12.288138
2423	342	النوع	جهاز تمويج الشعر التلقائي	2026-03-18 01:59:15.455374
2424	342	العلامة التجارية	فيليبس	2026-03-18 01:59:15.456174
2425	342	درجة الحرارة القصوى	210 درجة مئوية	2026-03-18 01:59:15.457119
2426	342	نوع الاستخدام	تمويج وتجعيد الشعر	2026-03-18 01:59:15.457752
2427	342	التحكم	آلي	2026-03-18 01:59:15.458232
2428	342	الملحقات	ملحقات تمويج قابلة للتبديل	2026-03-18 01:59:15.458646
2429	343	نوع المنتج	مجفف شعر	2026-03-18 01:59:18.22207
2430	343	الطاقة	2100 واط	2026-03-18 01:59:18.222448
2431	343	التقنية	Ionic	2026-03-18 01:59:18.222713
2432	343	عدد إعدادات السرعة	2	2026-03-18 01:59:18.222969
2433	343	نوع الاستخدام	تجفيف وتصفيف الشعر	2026-03-18 01:59:18.223185
2434	344	نوع المنتج	جهاز تصفيف شعر	2026-03-18 01:59:21.166265
2435	344	الماركة	تشي	2026-03-18 01:59:21.167068
2436	344	الموديل	AirGlam	2026-03-18 01:59:21.167659
2437	344	الطاقة	1300 واط	2026-03-18 01:59:21.168183
2438	344	الألوان	أبيض وذهبي	2026-03-18 01:59:21.168682
2439	344	نوع الاستخدام	تصفيف وتجفيف الشعر	2026-03-18 01:59:21.169162
2440	345	نوع_المنتج	جهاز تمليس الشعر	2026-03-18 01:59:23.920532
2441	345	الماركة	تشي	2026-03-18 01:59:23.920991
2442	345	الحد_الأقصى_لدرجة_الحرارة	220°C	2026-03-18 01:59:23.9213
2443	345	اللون	أسود	2026-03-18 01:59:23.921489
2444	345	نوع_الاستخدام	تمليس وفرد الشعر	2026-03-18 01:59:23.921795
2445	346	نوع_الجهاز	جهاز تمليس شعر	2026-03-18 01:59:27.761624
2446	346	العلامة_التجارية	تشي	2026-03-18 01:59:27.761966
2447	346	درجة_الحرارة_القصوى	232°C	2026-03-18 01:59:27.762205
2448	346	اللون	أسود	2026-03-18 01:59:27.762425
2449	346	نوع_الاستخدام	تمليس وفرد الشعر	2026-03-18 01:59:27.762624
2450	347	النوع	جهاز إزالة الشعر بتقنية IPL	2026-03-18 01:59:31.759816
2451	347	الماركة	براون	2026-03-18 01:59:31.760139
2452	347	الموديل	5152	2026-03-18 01:59:31.760384
2453	347	عدد الومضات	400,000	2026-03-18 01:59:31.760692
2454	347	التقنية	IPL (Intense Pulsed Light)	2026-03-18 01:59:31.760884
2455	347	مستويات الطاقة	متعددة	2026-03-18 01:59:31.761048
2456	347	مناطق الاستخدام	الوجه والجسم والخط الدقيق	2026-03-18 01:59:31.761202
2457	347	الجهد	100-240 فولت	2026-03-18 01:59:31.761357
2458	347	وقت الشحن	1.5 ساعة	2026-03-18 01:59:31.761505
2459	347	مدة الاستخدام بعد الشحن	حتى 400,000 ومضة	2026-03-18 01:59:31.761654
2460	347	نوع الاتصال	سلكي	2026-03-18 01:59:31.761795
2461	348	النوع	ماكينة حلاقة شعر	2026-03-18 01:59:37.413797
2462	348	الماركة	براون	2026-03-18 01:59:37.414401
2463	348	السلسلة	Series 3 Styler	2026-03-18 01:59:37.414875
2464	348	اللون	أسود	2026-03-18 01:59:37.415187
2465	348	نوع الاستخدام	حلاقة الشعر والتصفيف	2026-03-18 01:59:37.415586
2466	348	نوع القص	شفرات متحركة	2026-03-18 01:59:37.415898
2467	348	الطاقة	تعمل بالكهرباء	2026-03-18 01:59:37.416163
2468	348	عدد درجات التعديل	20 درجة	2026-03-18 01:59:37.416591
2469	348	الملحقات	رؤوس قص قابلة للتبديل، مشط توجيه	2026-03-18 01:59:37.416952
2470	349	نوع المنتج	ماكينة حلاقة للجسم	2026-03-18 01:59:40.862886
2471	349	العلامة التجارية	براون	2026-03-18 01:59:40.863807
2472	349	اللون	رمادي	2026-03-18 01:59:40.864327
2473	349	نوع الاستخدام	حلاقة الجسم	2026-03-18 01:59:40.86478
2474	349	نوع الشفرات	شفرات قابلة للغسل	2026-03-18 01:59:40.865143
2475	349	مقاوم للماء	نعم	2026-03-18 01:59:40.865475
2476	349	قابل للشحن	نعم	2026-03-18 01:59:40.865795
2477	349	الملحقات	رؤوس استبدال متعددة	2026-03-18 01:59:40.866117
2478	350	نوع المنتج	مموج شعر	2026-03-18 01:59:44.283889
2479	350	درجة الحرارة القصوى	210°C	2026-03-18 01:59:44.284404
2480	350	اللون	أزرق	2026-03-18 01:59:44.284785
2481	350	نوع الاستخدام	تصفيف وتموج الشعر	2026-03-18 01:59:44.285116
2482	351	نوع الجهاز	آلة إزالة الشعر	2026-03-18 01:59:47.467104
2483	351	نوع الاستخدام	رطب وجاف	2026-03-18 01:59:47.467422
2484	351	نوع الاتصال	لاسلكي	2026-03-18 01:59:47.467626
2485	351	نوع البطارية	قابلة للشحن	2026-03-18 01:59:47.467817
2486	351	مقاوم للماء	نعم	2026-03-18 01:59:47.467984
2487	351	الماركة	فيليبس	2026-03-18 01:59:47.46814
2488	351	التكنولوجيا	تقنية الأظافر الذهبية	2026-03-18 01:59:47.468299
2489	352	النوع	ماكينة حلاقة كهربائية	2026-03-18 01:59:51.073266
2490	352	الماركة	براون	2026-03-18 01:59:51.07364
2491	352	السلسلة	Series 3	2026-03-18 01:59:51.073959
2492	352	الألوان	أزرق وأسود	2026-03-18 01:59:51.074184
2493	352	نوع الرؤوس	رؤوس دوارة ثلاثية	2026-03-18 01:59:51.074467
2494	352	نوع التغذية	قابل لإعادة الشحن	2026-03-18 01:59:51.074707
2495	352	مقاوم للماء	نعم	2026-03-18 01:59:51.075025
2496	352	الاستخدام	الوجه والجسم	2026-03-18 01:59:51.075279
2497	352	الملحقات	رؤوس استبدالية، شاحن، فرشاة تنظيف	2026-03-18 01:59:51.075539
2498	353	نوع الجهاز	ماكينة حلاقة متعددة الاستخدام	2026-03-18 01:59:54.396829
2499	353	عدد الوظائف	6 في 1	2026-03-18 01:59:54.397251
2500	353	اللون	أسود	2026-03-18 01:59:54.397526
2501	353	الماركة	فيليبس	2026-03-18 01:59:54.397733
2502	353	نوع الاستخدام	حلاقة، تشذيب، عناية شخصية	2026-03-18 01:59:54.397966
2503	353	نوع الاتصال	سلكي	2026-03-18 01:59:54.398168
2504	353	ملحقات	رؤوس حلاقة متعددة	2026-03-18 01:59:54.398334
2505	354	النوع	ماكينة حلاقة كهربائية	2026-03-18 01:59:59.276937
2506	354	الماركة	براون	2026-03-18 01:59:59.277555
2507	354	السلسلة	Series 6	2026-03-18 01:59:59.278127
2508	354	الألوان	أزرق وأسود	2026-03-18 01:59:59.278589
2509	354	نوع الحلاقة	حلاقة رطبة وجافة	2026-03-18 01:59:59.279096
2510	354	نظام الحلاقة	نظام SyncroSonic	2026-03-18 01:59:59.279558
2511	354	عدد رؤوس الحلاقة	3	2026-03-18 01:59:59.279816
2512	354	سرعة الاهتزاز	10000 ذبذبة/دقيقة	2026-03-18 01:59:59.280084
2513	354	مستويات الضبط	5 مستويات	2026-03-18 01:59:59.280337
2514	354	عمر البطارية	حتى 50 دقيقة	2026-03-18 01:59:59.280579
2515	354	وقت الشحن	1 ساعة	2026-03-18 01:59:59.280834
2516	354	مقاوم للماء	نعم IPX7	2026-03-18 01:59:59.281036
2517	354	الملحقات	رأس حلاقة إضافية، علبة سفر، فرشاة التنظيف	2026-03-18 01:59:59.281223
2518	354	الضمان	سنة واحدة	2026-03-18 01:59:59.281404
2519	355	النوع	جهاز تمليس الشعر	2026-03-18 02:00:05.358121
2520	355	العلامة التجارية	تشي	2026-03-18 02:00:05.358914
2521	355	درجة الحرارة القصوى	220°C	2026-03-18 02:00:05.35943
2522	355	اللون	أسود	2026-03-18 02:00:05.359844
2523	355	نوع الاستخدام	تمليس وفرد الشعر	2026-03-18 02:00:05.360176
2524	356	النوع	فرشاة شعر حرارية	2026-03-18 02:00:08.851677
2525	356	الوظائف	4 في 1 متعددة الوظائف	2026-03-18 02:00:08.852038
2526	356	اللون	أسود	2026-03-18 02:00:08.852231
2527	356	نطاق درجات الحرارة	قابل للتحكم	2026-03-18 02:00:08.852394
2528	356	الملحقات	رؤوس متعددة	2026-03-18 02:00:08.852551
2529	356	نوع الاستخدام	فرد وتجعيد وتجفيف وتصفيف	2026-03-18 02:00:08.852701
2530	357	النوع	مجفف شعر	2026-03-18 02:00:12.148955
2531	357	الطاقة	2200 واط	2026-03-18 02:00:12.149456
2532	357	التقنية	Ionic	2026-03-18 02:00:12.149818
2533	357	عدد إعدادات السرعة	3	2026-03-18 02:00:12.150066
2534	357	العلامة التجارية	Carrera	2026-03-18 02:00:12.150328
2535	358	الماركة	Grundig	2026-03-18 02:00:15.215441
2536	358	نوع المنتج	جهاز تمليس الشعر	2026-03-18 02:00:15.215848
2537	358	التقنية	Ion	2026-03-18 02:00:15.216071
2538	358	درجة الحرارة الدنيا	160°C	2026-03-18 02:00:15.216263
2539	358	درجة الحرارة العليا	220°C	2026-03-18 02:00:15.216504
2540	358	نوع الاستخدام	تمليس وفرد الشعر	2026-03-18 02:00:15.216664
2541	359	الماركة	براون	2026-03-18 02:00:20.061213
2542	359	النوع	ماكينة حلاقة كهربائية	2026-03-18 02:00:20.061638
2543	359	السلسلة	Series 5	2026-03-18 02:00:20.061885
2544	359	الألوان	أزرق وأسود	2026-03-18 02:00:20.062078
2545	359	نوع الرؤوس	رؤوس دوارة	2026-03-18 02:00:20.06225
2546	359	نظام الحلاقة	نظام SyncroSonic	2026-03-18 02:00:20.06241
2547	359	درجات السرعة	متعددة	2026-03-18 02:00:20.062559
2548	359	مقاوم للماء	نعم	2026-03-18 02:00:20.062707
2549	359	قابل للغسل	نعم	2026-03-18 02:00:20.062854
2550	359	نوع البطارية	قابل للشحن	2026-03-18 02:00:20.063
2551	359	وقت الشحن	تقريباً 1 ساعة	2026-03-18 02:00:20.06314
2552	359	مدة الاستخدام	تقريباً 45 دقيقة	2026-03-18 02:00:20.063277
2553	359	الملحقات	رأس تشذيب، حامل شحن	2026-03-18 02:00:20.063435
2554	360	النوع	ماكينة حلاقة لاسلكية	2026-03-18 02:00:23.482781
2555	360	الاستخدام	رطب وجاف	2026-03-18 02:00:23.483138
2556	360	مدة التشغيل	40 دقيقة	2026-03-18 02:00:23.483417
2557	360	نوع التغذية	بطارية قابلة للشحن	2026-03-18 02:00:23.4836
2558	360	العلامة التجارية	فيليبس	2026-03-18 02:00:23.483761
2559	360	نظام القطع	شفرات مدمجة	2026-03-18 02:00:23.483978
2560	360	المزايا	استخدام جاف وجاف مع الرطوبة	2026-03-18 02:00:23.484187
2561	361	نوع المنتج	ماكينة حلاقة شعر	2026-03-18 02:00:27.520608
2562	361	الماركة	براون	2026-03-18 02:00:27.52095
2563	361	الموديل	Series 7 Styler	2026-03-18 02:00:27.521433
2564	361	اللون	أسود وأزرق	2026-03-18 02:00:27.521638
2565	361	نوع التغذية	قابل لإعادة الشحن	2026-03-18 02:00:27.521816
2566	361	نوع الاستخدام	قص الشعر والتصفيف	2026-03-18 02:00:27.521982
2567	361	عدد درجات الطول	متعدد	2026-03-18 02:00:27.522211
2568	361	نوع الشفرات	شفرات دقيقة	2026-03-18 02:00:27.52244
2569	361	مقاوم للماء	نعم	2026-03-18 02:00:27.522623
2570	361	الملحقات	أمشاط مختلفة الأطوال	2026-03-18 02:00:27.522852
2571	362	النوع	مصفف شعر بتقنية التجفيف والتصفيف	2026-03-18 02:00:32.990948
2572	362	الموديل	HS05	2026-03-18 02:00:32.991281
2573	362	العلامة التجارية	Dyson	2026-03-18 02:00:32.99149
2574	362	الاسم	Airwrap Styler Light	2026-03-18 02:00:32.991737
2575	362	المناسب لـ	الشعر الطويل والشعر المتعدد الأنواع	2026-03-18 02:00:32.991901
2576	362	الطاقة	1200 واط	2026-03-18 02:00:32.99206
2577	362	سرعات الهواء	3 مستويات	2026-03-18 02:00:32.992221
2578	362	الملحقات	أسطوانات بأقطار مختلفة وفرشاة تجفيف وفرشاة تصفيف	2026-03-18 02:00:32.992374
2579	362	نوع التكنولوجيا	تحكم ذكي بدرجة الحرارة	2026-03-18 02:00:32.992533
2580	362	الوزن	750 غرام تقريباً	2026-03-18 02:00:32.992678
2581	362	طول السلك	2.6 متر	2026-03-18 02:00:32.992821
2582	362	وقت التسخين	أقل من دقيقة	2026-03-18 02:00:32.992967
2583	362	الضمان	سنتان	2026-03-18 02:00:32.993108
2584	363	نوع الجهاز	جهاز إزالة الشعر بتقنية IPL	2026-03-18 02:00:36.853335
2585	363	التقنية	IPL (Intense Pulsed Light)	2026-03-18 02:00:36.853718
2586	363	عدد الومضات	250,000	2026-03-18 02:00:36.853908
2587	363	اللون	أبيض	2026-03-18 02:00:36.854076
2588	363	نطاق درجات الحرارة	قابل للتعديل	2026-03-18 02:00:36.854238
2589	363	المناطق المناسبة	الوجه والجسم والمنطقة الحساسة	2026-03-18 02:00:36.854393
2590	363	نوع البشرة المناسبة	البشرة الفاتحة إلى المتوسطة	2026-03-18 02:00:36.854585
2591	363	الطاقة	تعمل بالكهرباء	2026-03-18 02:00:36.854958
2592	363	ملحقات	رؤوس استبدال متعددة	2026-03-18 02:00:36.855233
2593	364	النوع	ماكينة حلاقة شعر	2026-03-18 02:00:40.74222
2594	364	الماركة	براون	2026-03-18 02:00:40.742638
2595	364	السلسلة	Series 5 Styler	2026-03-18 02:00:40.742845
2596	364	الألوان	أسود ورمادي	2026-03-18 02:00:40.743013
2597	364	نوع الاستخدام	حلاقة وتصفيف الشعر	2026-03-18 02:00:40.74317
2598	364	نوع التغذية	بطارية قابلة للشحن	2026-03-18 02:00:40.74332
2599	364	مستويات التقطيع	متعددة	2026-03-18 02:00:40.743463
2600	364	ملحقات	رؤوس حلاقة قابلة للتبديل	2026-03-18 02:00:40.743617
2601	364	مقاوم للماء	نعم	2026-03-18 02:00:40.743767
2602	365	النوع	مجفف شعر	2026-03-18 02:00:43.480837
2603	365	العلامة التجارية	شارك	2026-03-18 02:00:43.481243
2604	365	عدد إعدادات السرعة	3	2026-03-18 02:00:43.481571
2605	365	اللون	كريمي	2026-03-18 02:00:43.48181
2606	365	نوع الاستخدام	تجفيف الشعر	2026-03-18 02:00:43.482115
2607	366	نوع الجهاز	جهاز إزالة الشعر	2026-03-18 02:00:47.965307
2608	366	التقنية	IPL (Intense Pulsed Light)	2026-03-18 02:00:47.965771
2609	366	عدد الومضات	450,000	2026-03-18 02:00:47.966344
2610	366	الماركة	فيليبس	2026-03-18 02:00:47.966849
2611	366	نوع الاستخدام	إزالة الشعر منزلية	2026-03-18 02:00:47.96711
2612	366	المناطق المستهدفة	الوجه والجسم والمناطق الحساسة	2026-03-18 02:00:47.967324
2613	366	مستويات الشدة	5 مستويات	2026-03-18 02:00:47.967521
2614	366	نوع الاتصال	سلكي	2026-03-18 02:00:47.967799
2615	366	الجهد الكهربائي	100-240 فولت	2026-03-18 02:00:47.96805
2616	366	الضمان	سنتان	2026-03-18 02:00:47.968315
2617	367	عدد الوظائف	11 في 1	2026-03-18 02:00:51.669361
2618	367	الاستخدام	الوجه والشعر	2026-03-18 02:00:51.671001
2619	367	نوع الجهاز	ماكينة حلاقة متعددة الاستخدامات	2026-03-18 02:00:51.671994
2620	367	الماركة	فيليبس	2026-03-18 02:00:51.672883
2621	367	نوع الاتصال	سلكي أو لاسلكي	2026-03-18 02:00:51.67363
2622	367	المحرك	مجال مغناطيسي دوار	2026-03-18 02:00:51.674338
2623	367	قابلية الغسل	مقاوم للرطوبة	2026-03-18 02:00:51.674898
2624	367	الملحقات	رؤوس استبدال متعددة	2026-03-18 02:00:51.675269
2625	368	نوع المنتج	جهاز تدفق ماء للأسنان (Water Flosser)	2026-03-18 02:00:56.308072
2626	368	السعة	280 مل	2026-03-18 02:00:56.308847
2627	368	اللون	أبيض	2026-03-18 02:00:56.309307
2628	368	نوع الاستخدام	تنظيف الأسنان واللثة	2026-03-18 02:00:56.309688
2629	368	نوع التشغيل	كهربائي	2026-03-18 02:00:56.310065
2630	368	الملحقات	رؤوس تنظيف قابلة للاستبدال	2026-03-18 02:00:56.310493
2631	369	نوع المنتج	مجفف شعر	2026-03-18 02:00:59.275914
2632	369	الماركة	تشي	2026-03-18 02:00:59.277572
2633	369	الموديل	لافا برو	2026-03-18 02:00:59.278732
2634	369	عدد إعدادات السرعة	3	2026-03-18 02:00:59.279417
2635	369	اللون	أسود	2026-03-18 02:00:59.279867
2636	369	نوع الاستخدام	تجفيف الشعر	2026-03-18 02:00:59.280448
2637	370	النوع	مصفف شعر كهربائي	2026-03-18 02:01:03.249748
2638	370	الموديل	HS08	2026-03-18 02:01:03.25015
2639	370	الماركة	Dyson	2026-03-18 02:01:03.250366
2640	370	الاستخدام	تصفيف الشعر الكيرلي والملفوف	2026-03-18 02:01:03.250632
2641	370	الطاقة	1300 وات	2026-03-18 02:01:03.2508
2642	370	التكنولوجيا	تقنية Airwrap	2026-03-18 02:01:03.250957
2643	370	المميزات	حماية من الحرارة الزائدة، تصفيف بدون حرارة عالية	2026-03-18 02:01:03.251159
2644	370	درجات الحرارة	متعددة قابلة للتحكم	2026-03-18 02:01:03.251305
2645	370	الملحقات	رؤوس تصفيف متعددة	2026-03-18 02:01:03.251603
2646	370	نوع الاتصال	سلك كهربائي	2026-03-18 02:01:03.251965
2647	371	النوع	جهاز إزالة الشعر بتقنية IPL	2026-03-18 02:01:07.636524
2648	371	الماركة	براون	2026-03-18 02:01:07.637749
2649	371	الموديل	5052	2026-03-18 02:01:07.639531
2650	371	التقنية	IPL ذكي	2026-03-18 02:01:07.641017
2651	371	عدد مستويات الطاقة	10	2026-03-18 02:01:07.641891
2652	371	عدد الومضات	400000	2026-03-18 02:01:07.642521
2653	371	مساحة رأس المعالجة	6 سم²	2026-03-18 02:01:07.643071
2654	371	الاستخدام	للجسم والوجه	2026-03-18 02:01:07.643526
2655	371	الملحقات	رأس دقيق للوجه، رأس قياسي	2026-03-18 02:01:07.644182
2656	371	مقاوم للماء	نعم	2026-03-18 02:01:07.644711
2657	371	الطاقة	تشغيل سلكي	2026-03-18 02:01:07.645121
2658	371	مدة الجلسة	20 دقيقة	2026-03-18 02:01:07.645552
2659	371	الحساسات	مستشعر ذكي للبشرة	2026-03-18 02:01:07.64587
2660	372	النوع	ماكينة حلاقة كهربائية	2026-03-18 02:01:12.366876
2661	372	الماركة	براون	2026-03-18 02:01:12.367288
2662	372	السلسلة	Series 9	2026-03-18 02:01:12.367653
2663	372	اللون	أسود	2026-03-18 02:01:12.367929
2664	372	نوع الحلاقة	حلاقة رطبة وجافة	2026-03-18 02:01:12.368165
2665	372	عدد رؤوس الحلاقة	5	2026-03-18 02:01:12.368378
2666	372	نوع المحرك	محرك خطي ذكي	2026-03-18 02:01:12.368579
2667	372	سرعة الاهتزاز	10000 اهتزازة في الدقيقة	2026-03-18 02:01:12.368778
2668	372	مستويات الحلاقة	قابلة للتعديل	2026-03-18 02:01:12.36898
2669	372	نطاق الجهد	100-240V	2026-03-18 02:01:12.369171
2670	372	وقت الشحن	60 دقيقة	2026-03-18 02:01:12.369375
2671	372	وقت التشغيل	50 دقيقة	2026-03-18 02:01:12.369601
2672	372	مقاوم للماء	IP67	2026-03-18 02:01:12.369814
2673	372	الملحقات	حقيبة سفر، منظف دوري	2026-03-18 02:01:12.370017
2674	372	الضمان	3 سنوات	2026-03-18 02:01:12.370221
2675	373	نوع المنتج	مجفف شعر	2026-03-18 02:01:14.940843
2676	373	السرعة	110,000 دورة في الدقيقة	2026-03-18 02:01:14.941212
2677	373	التقنية	Ionic	2026-03-18 02:01:14.941407
2678	373	الماركة	Dreamy	2026-03-18 02:01:14.941585
2679	374	النوع	مصفف شعر ذكي	2026-03-18 02:01:18.833426
2680	374	الموديل	HS08	2026-03-18 02:01:18.834353
2681	374	الطاقة	1300 واط	2026-03-18 02:01:18.834996
2682	374	أنواع الشعر المدعومة	شعر أملس,شعر مموج	2026-03-18 02:01:18.835694
2683	374	تقنية التجفيف	تقنية الهواء الذكي	2026-03-18 02:01:18.836263
2684	374	إعدادات درجة الحرارة	متعددة	2026-03-18 02:01:18.836735
2685	374	وظائف إضافية	تصفيف تلقائي,استشعار ذكي للحرارة	2026-03-18 02:01:18.837195
2686	374	الملحقات	رؤوس تصفيف متعددة	2026-03-18 02:01:18.837538
2687	374	الاتصال	بلوتوث	2026-03-18 02:01:18.837825
2688	375	نوع المنتج	مصفف شعر	2026-03-18 02:01:25.364648
2689	375	العلامة التجارية	CHI	2026-03-18 02:01:25.365367
2690	375	المادة	سيراميك لافا	2026-03-18 02:01:25.366079
2691	375	أقصى درجة حرارة	210℃	2026-03-18 02:01:25.366943
2692	375	اللون	أسود	2026-03-18 02:01:25.36856
2693	375	الاستخدام	تصفيف وفرد الشعر	2026-03-18 02:01:25.369198
2694	376	نوع الجهاز	طابعة متعددة الوظائف	2026-03-18 02:01:31.476219
2695	376	الموديل	Smart Tank 580	2026-03-18 02:01:31.476928
2696	376	نظام الحبر	خزان حبر	2026-03-18 02:01:31.477485
2697	376	الاتصال	لاسلكي (WiFi)	2026-03-18 02:01:31.477903
2698	376	الوظائف	طباعة، نسخ، مسح ضوئي	2026-03-18 02:01:31.478291
2699	376	دقة الطباعة	4800 × 1200 DPI	2026-03-18 02:01:31.478676
2700	376	سرعة الطباعة	12 صفحة/دقيقة (أبيض وأسود)	2026-03-18 02:01:31.47904
2701	376	سرعة الطباعة الملون	5 صفحات/دقيقة	2026-03-18 02:01:31.479387
2702	376	سعة خزان الحبر	170 مل (أسود)، 70 مل (ملون)	2026-03-18 02:01:31.479814
2703	376	عدد الألوان	4 ألوان	2026-03-18 02:01:31.480166
2704	376	حجم الورق الأقصى	A4	2026-03-18 02:01:31.480489
2705	376	نوع الاتصال الإضافي	USB، WiFi Direct	2026-03-18 02:01:31.48077
2706	376	الطباعة من الهاتف	نعم (ePrint، AirPrint)	2026-03-18 02:01:31.48098
2707	376	سعة درج الورق	100 ورقة	2026-03-18 02:01:31.481189
2708	376	الماسح الضوئي المسطح	نعم	2026-03-18 02:01:31.481393
2709	376	اللون	أسود وأبيض (رمادي فاتح)	2026-03-18 02:01:31.481587
2710	376	الطاقة	حوالي 15 واط	2026-03-18 02:01:31.481773
2711	376	الأبعاد التقريبية	470 × 370 × 190 ملم	2026-03-18 02:01:31.481956
2712	377	النوع	طابعة ليزر متعددة الوظائف	2026-03-18 02:01:35.95303
2713	377	الماركة	HP	2026-03-18 02:01:35.953493
2714	377	الموديل	LaserJet MFP M141w	2026-03-18 02:01:35.953768
2715	377	نوع الطباعة	أحادية اللون (Black & White)	2026-03-18 02:01:35.953968
2716	377	الوظائف	طباعة، نسخ، مسح ضوئي	2026-03-18 02:01:35.954168
2717	377	سرعة الطباعة	25 صفحة/دقيقة	2026-03-18 02:01:35.954387
2718	377	دقة الطباعة	600 × 600 DPI	2026-03-18 02:01:35.954632
2719	377	حجم الورقة	A4	2026-03-18 02:01:35.954801
2720	377	السعة الورقية	150 ورقة	2026-03-18 02:01:35.954955
2721	377	الاتصال	Wi-Fi، USB	2026-03-18 02:01:35.955103
2722	377	الطاقة	250 واط	2026-03-18 02:01:35.955243
2723	377	الوزن	حوالي 18 كجم	2026-03-18 02:01:35.955397
2724	377	الأبعاد	حوالي 428 × 390 × 394 ملم	2026-03-18 02:01:35.955539
2725	378	نوع الجهاز	طابعة متعددة الوظائف	2026-03-18 02:01:40.679442
2726	378	الموديل	OfficeJet Pro 8133	2026-03-18 02:01:40.680446
2727	378	الاتصال	لاسلكي (Wi-Fi)	2026-03-18 02:01:40.681242
2728	378	الوظائف	طباعة، نسخ، مسح ضوئي	2026-03-18 02:01:40.681961
2729	378	تقنية الطباعة	حبر نفاث	2026-03-18 02:01:40.682635
2730	378	دقة الطباعة	4800 × 1200 dpi	2026-03-18 02:01:40.68331
2731	378	سرعة الطباعة	25 صفحة/دقيقة	2026-03-18 02:01:40.683885
2732	378	حجم الورق الأقصى	A4	2026-03-18 02:01:40.684273
2733	378	السعة	250 ورقة	2026-03-18 02:01:40.6847
2734	378	الاتصالات الإضافية	USB، شبكة Ethernet	2026-03-18 02:01:40.685071
2735	378	الطباعة المزدوجة	نعم	2026-03-18 02:01:40.685443
2736	378	المسح الضوئي	نعم	2026-03-18 02:01:40.685767
2737	378	النسخ	نعم	2026-03-18 02:01:40.686038
2738	379	الجهاز	PlayStation 5	2026-03-18 02:01:45.260294
2739	379	الشركة المصنعة	Sony	2026-03-18 02:01:45.260789
2740	379	الإصدار	Standard	2026-03-18 02:01:45.261151
2741	379	السعة التخزينية	1 تيرابايت	2026-03-18 02:01:45.261467
2742	379	نوع الهارد	SSD	2026-03-18 02:01:45.261778
2743	379	المعالج	AMD Ryzen Zen 2 8-Core	2026-03-18 02:01:45.262068
2744	379	الذاكرة العشوائية	16 جيجابايت GDDR6	2026-03-18 02:01:45.262332
2745	379	كرت الرسوميات	AMD RDNA 2 10.28 TFLOPS	2026-03-18 02:01:45.262646
2746	379	دقة الرسوميات	4K (حتى 120fps)	2026-03-18 02:01:45.262892
2747	379	معدل الإطارات الأقصى	120 fps	2026-03-18 02:01:45.263192
2748	379	المخرجات	HDMI 2.1, USB Type-C	2026-03-18 02:01:45.263432
2749	379	نظام التشغيل	PlayStation OS	2026-03-18 02:01:45.263774
2750	379	المراجح	E Chasis	2026-03-18 02:01:45.264041
2751	380	نوع المنتج	حامل جداري	2026-03-18 02:01:48.321043
2752	380	التوافق	جهاز بلايستيشن 5	2026-03-18 02:01:48.322119
2753	380	طريقة التثبيت	جداري	2026-03-18 02:01:48.322935
2754	380	اللون	أبيض	2026-03-18 02:01:48.323516
2755	380	المادة	بلاستيك/معدن	2026-03-18 02:01:48.323994
2756	380	نمط التثبيت	ثابت	2026-03-18 02:01:48.324625
2757	381	الجهاز	PlayStation 5	2026-03-18 02:01:53.248898
2758	381	الإصدار	Digital Edition	2026-03-18 02:01:53.249315
2759	381	السعة_التخزينية	825GB	2026-03-18 02:01:53.249589
2760	381	نوع_التخزين	SSD	2026-03-18 02:01:53.249829
2761	381	المعالج	AMD Ryzen Zen 2 8-core	2026-03-18 02:01:53.250062
2762	381	سرعة_المعالج	3.5 GHz	2026-03-18 02:01:53.250298
2763	381	الذاكرة_العشوائية	16GB GDDR6	2026-03-18 02:01:53.250557
2764	381	كرت_الرسوميات	AMD RDNA 2 10.28 TFLOPS	2026-03-18 02:01:53.250768
2765	381	الدقة_الرسومية	4K / 120fps	2026-03-18 02:01:53.250981
2766	381	معدل_التحديث	120fps	2026-03-18 02:01:53.251199
2767	381	نوع_الشاشة	HDR	2026-03-18 02:01:53.251416
2768	381	وسائط_التخزين	بدون مشغل أقراص (Digital فقط)	2026-03-18 02:01:53.251628
2769	381	الاتصال	Wi-Fi 6E، Bluetooth 5.1، Ethernet	2026-03-18 02:01:53.25184
2770	381	المنافذ	USB Type-C، HDMI 2.1	2026-03-18 02:01:53.252047
2771	381	نظام_التشغيل	PlayStation OS	2026-03-18 02:01:53.252269
2772	381	هيكل_الجهاز	E Chassis	2026-03-18 02:01:53.252494
2773	381	اللون	أبيض وأسود	2026-03-18 02:01:53.252716
2774	382	المنتج	وحدة تحكم DualSense	2026-03-18 02:01:57.667362
2775	382	الجهاز المتوافق	PlayStation 5	2026-03-18 02:01:57.668482
2776	382	اللون	أبيض	2026-03-18 02:01:57.669144
2777	382	نوع الاتصال	لاسلكي (2.4 GHz)	2026-03-18 02:01:57.669752
2778	382	المميزات	تقنية Haptic Feedback,محفزات تكيفية,ميكروفون مدمج,مكبر صوت مدمج,لوحة لمس,جيروسكوب وتسارع,بطارية قابلة للشحن	2026-03-18 02:01:57.670406
2779	382	مدة البطارية	4-6 ساعات	2026-03-18 02:01:57.670787
2780	382	وقت الشحن	حوالي 3 ساعات	2026-03-18 02:01:57.671234
2781	382	الوزن	280 جرام تقريباً	2026-03-18 02:01:57.671594
2782	382	التوافقية	PlayStation 5	2026-03-18 02:01:57.671884
\.


--
-- TOC entry 5297 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, brand, category, description, created_at, category_id, image, views, store_id, status, reject_reason, sku, variant_group_id, group_id, variant_storage, variant_color, variant_edition, variant_size, variant_label) FROM stdin;
36	إل جي غسالة سعة 9 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.	إل	\N	\N	2026-03-17 22:28:47.990311	18	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-270x270.jpg	0	8	approved	\N	\N	\N	3	\N	\N	\N	\N	إل جي غسالة سعة 9 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.
48	فاير غاز برولاين فرن كهربائي بلت إن 60 سم، سعة 72 لتر، 13 برنامج، 2900 واط، ستانلس ستيل / زجاج أسود.	فاير	\N	\N	2026-03-17 22:28:49.914361	22	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-270x270.jpg	0	8	approved	\N	\N	\N	8	\N	\N	\N	\N	فاير غاز برولاين فرن كهربائي بلت إن 60 سم، سعة 72 لتر، 13 برنامج، 2900 واط، ستانلس ستيل / زجاج أسود.
56	فيرغاز هايتك شفاط يعلق على الحائط 90 سم، قوة الشفط 750 م³/بالساعة، زجاج أبيض.	فيرغاز	\N	\N	2026-03-17 22:28:55.443776	25	https://sbitany.com/image/cache/catalog/107-171-0039-0021-2021060870600-270x270.jpg	0	8	approved	\N	\N	\N	16	\N	\N	\N	\N	فيرغاز هايتك شفاط يعلق على الحائط 90 سم، قوة الشفط 750 م³/بالساعة، زجاج أبيض.
68	فاير غاز برولاين ميكروويف بلت إن 34 لتر، 1100 واط، 2 في 1، 10 برامج، لون أسود.	فاير	\N	\N	2026-03-17 22:28:56.886713	22	https://sbitany.com/image/cache/catalog/107-071-2665-0003-2023052380129-270x270.jpg	0	8	approved	\N	\N	\N	17	\N	\N	\N	\N	فاير غاز برولاين ميكروويف بلت إن 34 لتر، 1100 واط، 2 في 1، 10 برامج، لون أسود.
77	سامسونج غسالة سعة 9 كغم، 24 برنامج، ماتور دجتل انفرتر، أسود.	سامسونج	\N	\N	2026-03-17 22:29:02.023647	18	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	32	\N	\N	\N	\N	سامسونج غسالة سعة 9 كغم، 24 برنامج، ماتور دجتل انفرتر، أسود.
91	أف جي فريزر بلت إن 8 جوارير سعة 197 لتر، نظام تبريد هوائي، لون أبيض.	أف	\N	\N	2026-03-17 22:29:03.809668	16	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-270x270.jpg	0	8	approved	\N	\N	\N	39	\N	\N	\N	\N	أف جي فريزر بلت إن 8 جوارير سعة 197 لتر، نظام تبريد هوائي، لون أبيض.
276	سيجافريدو كبسولات قهوة عدد 10*6 غرام (Le Origin Peru).	سيجافريدو	\N	\N	2026-03-17 22:30:19.519462	37	https://sbitany.com/image/cache/catalog/448Coffeecapsule-20200901205833-270x270.png	0	8	approved	\N	\N	\N	156	\N	\N	\N	\N	سيجافريدو كبسولات قهوة عدد 10*6 غرام (Le Origin Peru).
99	فيرغاز شفاط يعلق على الحائط 60 سم، قوة الشفط 250 م³/بالساعة، ستانلس ستيل.	فيرغاز	\N	\N	2026-03-17 22:29:09.181983	25	https://sbitany.com/image/cache/catalog/107-170-0039-0056-20230803123521-270x270.jpg	0	8	approved	\N	\N	\N	9	\N	\N	\N	\N	فيرغاز شفاط يعلق على الحائط 60 سم، قوة الشفط 250 م³/بالساعة، ستانلس ستيل.
105	سامسونج ثلاجة أربع أبواب سعة 664 لتر، ماتور انفرتر موفر للكهرباء، فضي.	سامسونج	\N	\N	2026-03-17 22:29:09.910809	16	https://sbitany.com/image/cache/catalog/107-634-0060-0004-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	46	\N	\N	\N	\N	سامسونج ثلاجة أربع أبواب سعة 664 لتر، ماتور انفرتر موفر للكهرباء، فضي.
106	فيرغاز برولاين شفاط يعلق بالسقف (جزيرة) 60 سم، قوة الشفط 1000 م³/بالساعة، ستانلس ستيل / زجاج.	فيرغاز	\N	\N	2026-03-17 22:29:10.066107	25	https://sbitany.com/image/cache/catalog/107-071-0039-0005-20220627123600-270x270.jpg	0	8	approved	\N	\N	\N	47	\N	\N	\N	\N	فيرغاز برولاين شفاط يعلق بالسقف (جزيرة) 60 سم، قوة الشفط 1000 م³/بالساعة، ستانلس ستيل / زجاج.
30	إل جي غسالة سعة 10 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.	إل	\N	\N	2026-03-17 22:28:47.10164	18	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-270x270.jpg	2	8	approved	\N	\N	\N	3	\N	\N	\N	\N	إل جي غسالة سعة 10 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.
219	مايديا ميكروويف مع شواية سعة 42 لتر، 1100 واط، فضي.	مايديا	\N	\N	2026-03-17 22:29:54.475811	40	https://sbitany.com/image/cache/catalog/113-242-0064-0024-2024072272047-270x270.jpg	0	8	approved	\N	\N	\N	117	\N	\N	\N	\N	مايديا ميكروويف مع شواية سعة 42 لتر، 1100 واط، فضي.
222	مايديا ميكروويف مع شواية سعة 29 لتر، 900 واط، أسود.	مايديا	\N	\N	2026-03-17 22:29:54.875709	40	https://sbitany.com/image/cache/catalog/113-242-0064-0024-2024072272047-270x270.jpg	0	8	approved	\N	\N	\N	117	\N	\N	\N	\N	مايديا ميكروويف مع شواية سعة 29 لتر، 900 واط، أسود.
282	ساوندكور سماعات ليبرتي 4 NC اللاسلكية	ساوندكور	\N	\N	2026-03-18 00:02:02.284248	29	https://sbitany.com/image/cache/catalog/105-242-0061-0210-2025060272319-270x270.jpg	0	8	approved	\N	\N	\N	88	\N	\N	\N	\N	ساوندكور سماعات ليبرتي 4 NC اللاسلكية
284	ساوندكور سماعات أذن لاسلكية Liberty 5 بخاصية إلغاء الضجيج لون أسود	ساوندكور	\N	\N	2026-03-18 00:02:04.82016	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية Liberty 5 بخاصية إلغاء الضجيج لون أسود
285	ساوندكور سماعات أذن لاسلكية R50i NC أزرق	ساوندكور	\N	\N	2026-03-18 00:02:04.929058	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية R50i NC أزرق
288	ساوندكور سماعات أذن لاسلكية P40i أبيض	ساوندكور	\N	\N	2026-03-18 00:02:05.470172	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية P40i أبيض
289	ساوندكور سماعات أذن لاسلكية R50i NC أبيض	ساوندكور	\N	\N	2026-03-18 00:02:05.577477	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية R50i NC أبيض
374	دايسون مصفف الشعر إيرراب (HS08) للشعر الأملس والمموج 1300 واط، فيروزي.	دايسون	\N	\N	2026-03-18 00:18:48.084203	44	https://sbitany.com/image/cache/catalog/104-853-0139-0001-20251027135215-270x270.jpg	0	8	approved	\N	\N	\N	200	\N	\N	\N	\N	دايسون مصفف الشعر إيرراب (HS08) للشعر الأملس والمموج 1300 واط، فيروزي.
279	جي تي في سماعات لاسلكية J-TWS، لون أبيض.	جي	\N	\N	2026-03-18 00:01:59.779727	29	https://sbitany.com/image/cache/catalog/137-307-1349-0001-2025112682336-270x270.jpg	0	8	approved	\N	\N	\N	72	\N	\N	\N	\N	جي تي في سماعات لاسلكية J-TWS، لون أبيض.
280	ساوندكور سماعات P40i مع إلغاء الضوضاء	ساوندكور	\N	\N	2026-03-18 00:02:01.418156	29	https://sbitany.com/image/cache/catalog/137-203-1720-0002-2025051455625-270x270.jpg	0	8	approved	\N	\N	\N	84	\N	\N	\N	\N	ساوندكور سماعات P40i مع إلغاء الضوضاء
287	ساوندكور سماعات K20i اللاسلكية	ساوندكور	\N	\N	2026-03-18 00:02:05.359688	29	https://sbitany.com/image/cache/catalog/137-203-1720-0003-2025051455625-270x270.jpg	0	8	approved	\N	\N	\N	95	\N	\N	\N	\N	ساوندكور سماعات K20i اللاسلكية
366	فيليبس جهاز إزالة الشعر بتقنية IPL باستخدام الومضات 450,000 ومضة، مع تقنية SenseIQ، استخدام سلكي، لون أبيض.	فيليبس	\N	\N	2026-03-18 00:18:35.761793	44	https://sbitany.com/image/cache/catalog/104-268-1307-0001-20251015102655-270x270.jpg	3	8	approved	\N	\N	\N	201	\N	\N	\N	\N	فيليبس جهاز إزالة الشعر بتقنية IPL باستخدام الومضات 450,000 ومضة، مع تقنية SenseIQ، استخدام سلكي، لون أبيض.
28	iphone 15	Apple	\N	\N	2026-03-17 22:12:12.794649	\N	/uploads/1773778332807.png	5	1	approved	\N	\N	\N	1	128GB	Black	Plus	50"	iphone 15 Plus 128GB 50" Black
29	iphon 11	apple	\N	\N	2026-03-17 22:15:46.069185	29	/uploads/1773778546075.png	28	1	approved	\N	\N	\N	2	64GB	Red	Pro	27"	iphon 11 Pro 64GB 27" Red
61	سامسونج ثلاجة سعة 600 لتر، ماتور انفرتر موفر للكهرباء، ستانلس ستيل.	سامسونج	\N	\N	2026-03-17 22:28:56.103749	16	https://sbitany.com/image/cache/catalog/113-297-0632-0001-20260311120410-270x270.jpg	2	8	approved	\N	\N	\N	20	\N	\N	\N	\N	سامسونج ثلاجة سعة 600 لتر، ماتور انفرتر موفر للكهرباء، ستانلس ستيل.
116	سامسونج جلاية بلت إن، 9 برامج، سعة 14 طقم، 3 رفوف، أبيض.	سامسونج	\N	\N	2026-03-17 22:29:11.25863	21	https://sbitany.com/image/cache/catalog/107-634-0015-0003-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	52	\N	\N	\N	\N	سامسونج جلاية بلت إن، 9 برامج، سعة 14 طقم، 3 رفوف، أبيض.
69	هيتاشي ثلاجة أربع أبواب سعة 569 لتر، ماتور انفرتر موفر للكهرباء، زجاج أسود.	هيتاشي	\N	\N	2026-03-17 22:28:56.992696	16	https://sbitany.com/image/cache/catalog/107-650-0060-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	25	\N	\N	\N	\N	هيتاشي ثلاجة أربع أبواب سعة 569 لتر، ماتور انفرتر موفر للكهرباء، زجاج أسود.
72	هومكس ثلاجة مكتب سعة 50 لتر، أسود / واجهة شفافة.	هومكس	\N	\N	2026-03-17 22:28:57.584554	16	https://sbitany.com/image/cache/catalog/107-280-0060-0002-20240815100416-270x270.jpg	0	8	approved	\N	\N	\N	28	\N	\N	\N	\N	هومكس ثلاجة مكتب سعة 50 لتر، أسود / واجهة شفافة.
75	بيكو ثلاجة أربع أبواب سعة 580 لتر، ماتور انفيرتر موفر للكهرباء، ستانلس ستيل.	بيكو	\N	\N	2026-03-17 22:29:01.77453	16	https://sbitany.com/image/cache/catalog/107-127-0060-1617-20260115120937-270x270.jpg	0	8	approved	\N	\N	\N	30	\N	\N	\N	\N	بيكو ثلاجة أربع أبواب سعة 580 لتر، ماتور انفيرتر موفر للكهرباء، ستانلس ستيل.
78	هيتاشي ثلاجة أربع أبواب سعة 569 لتر، ماتور انفرتر موفر للكهرباء، زجاج فضي.	هيتاشي	\N	\N	2026-03-17 22:29:02.131441	16	https://sbitany.com/image/cache/catalog/107-650-0060-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	25	\N	\N	\N	\N	هيتاشي ثلاجة أربع أبواب سعة 569 لتر، ماتور انفرتر موفر للكهرباء، زجاج فضي.
81	إل جي ثلاجة أربع أبواب سعة 665 لتر، ماتور انفرتر موفر للكهرباء، ستانلس أسود.	إل	\N	\N	2026-03-17 22:29:02.497393	16	https://sbitany.com/image/cache/catalog/107-230-0060-0140-20250520123741-270x270.jpg	0	8	approved	\N	\N	\N	13	\N	\N	\N	\N	إل جي ثلاجة أربع أبواب سعة 665 لتر، ماتور انفرتر موفر للكهرباء، ستانلس أسود.
88	بيكو ثلاجة بفريزر سفلي سعة 590 لتر، ماتور انفرتر موفر للكهرباء، بيانو أسود	بيكو	\N	\N	2026-03-17 22:29:03.45403	16	https://sbitany.com/image/cache/catalog/107-127-0060-1612-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	37	\N	\N	\N	\N	بيكو ثلاجة بفريزر سفلي سعة 590 لتر، ماتور انفرتر موفر للكهرباء، بيانو أسود
89	أف جي ثلاجة بلت إن بدون فريزر سعة 303 لتر، اتجاه الباب قابل للتعديل، لون أبيض.	أف	\N	\N	2026-03-17 22:29:03.594595	16	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-270x270.jpg	0	8	approved	\N	\N	\N	23	\N	\N	\N	\N	أف جي ثلاجة بلت إن بدون فريزر سعة 303 لتر، اتجاه الباب قابل للتعديل، لون أبيض.
92	بيكو ثلاجة أربع أبواب سعة 580 لتر، ماتور انفيرتر موفر للكهرباء، زجاج أسود.	بيكو	\N	\N	2026-03-17 22:29:04.057501	16	https://sbitany.com/image/cache/catalog/107-127-0060-1617-20260115120937-270x270.jpg	0	8	approved	\N	\N	\N	30	\N	\N	\N	\N	بيكو ثلاجة أربع أبواب سعة 580 لتر، ماتور انفيرتر موفر للكهرباء، زجاج أسود.
95	سامسونج ثلاجة سعة 530 لتر، ماتور انفرتر موفر للكهرباء، أسود.	سامسونج	\N	\N	2026-03-17 22:29:08.686079	16	https://sbitany.com/image/cache/catalog/107-634-0060-0006-2025031282133-270x270.jpg	0	8	approved	\N	\N	\N	42	\N	\N	\N	\N	سامسونج ثلاجة سعة 530 لتر، ماتور انفرتر موفر للكهرباء، أسود.
96	إل جي ثلاجة إنستافيو(MoodUp) أربع أبواب 617 لتر، ماتور انفرتر، تحكم بألوان الأبواب عبر التطبيق.	إل	\N	\N	2026-03-17 22:29:08.799525	16	https://sbitany.com/image/cache/catalog/107-230-0060-0142-2025091582144-270x270.jpg	0	8	approved	\N	\N	\N	43	\N	\N	\N	\N	إل جي ثلاجة إنستافيو(MoodUp) أربع أبواب 617 لتر، ماتور انفرتر، تحكم بألوان الأبواب عبر التطبيق.
97	إل جي ثلاجة فريزر سفلي سعة 344 لتر، ماتور انفرتر موفر للكهرباء، أسود.	إل	\N	\N	2026-03-17 22:29:08.938074	16	https://sbitany.com/image/cache/catalog/107-230-0060-0147-20251210122432-270x270.jpg	0	8	approved	\N	\N	\N	44	\N	\N	\N	\N	إل جي ثلاجة فريزر سفلي سعة 344 لتر، ماتور انفرتر موفر للكهرباء، أسود.
212	مايديا إبريق كهربائي 2200 واط، سعة 1.7 لتر، ستانلس ستيل.	مايديا	\N	\N	2026-03-17 22:29:53.55241	13	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-270x270.jpg	0	8	approved	\N	\N	\N	111	\N	\N	\N	\N	مايديا إبريق كهربائي 2200 واط، سعة 1.7 لتر، ستانلس ستيل.
216	يونيفرسال مقلى هوائي 1800 واط، سعة 30 لتر، ستانلس ستيل.	يونيفرسال	\N	\N	2026-03-17 22:29:54.07738	13	https://sbitany.com/image/cache/catalog/113-320-1717-0017-2024102473742-270x270.jpg	0	8	approved	\N	\N	\N	114	\N	\N	\N	\N	يونيفرسال مقلى هوائي 1800 واط، سعة 30 لتر، ستانلس ستيل.
235	أوفراغاز فرن توستر مع قلاية هوائية سعة 60 لتر لون أسود	أوفراغاز	\N	\N	2026-03-17 22:30:03.252597	40	https://sbitany.com/image/cache/catalog/113-297-0632-0001-20260311120410-270x270.jpg	0	8	approved	\N	\N	\N	131	\N	\N	\N	\N	أوفراغاز فرن توستر مع قلاية هوائية سعة 60 لتر لون أسود
251	فيليبس سائل إزالة الترسبات	فيليبس	\N	\N	2026-03-17 22:30:11.017915	13	https://sbitany.com/image/cache/catalog/113-268-8129-0001-20251224114859-270x270.jpg	0	8	approved	\N	\N	\N	141	\N	\N	\N	\N	فيليبس سائل إزالة الترسبات
255	فيليبس خفاقة يدوية بقدرة 450 واط، أبيض.	فيليبس	\N	\N	2026-03-17 22:30:11.60779	13	https://sbitany.com/image/cache/catalog/113-268-0128-0001-2025042964335-270x270.jpg	0	8	approved	\N	\N	\N	144	\N	\N	\N	\N	فيليبس خفاقة يدوية بقدرة 450 واط، أبيض.
259	ترست طنجرة ضغط كهربائية Duo Chef سعة 6 لتر بقدرة 1500 واط، رمادي-أسود.	ترست	\N	\N	2026-03-17 22:30:12.048079	13	https://sbitany.com/image/cache/catalog/113-251-8123-0001-20251125114055-270x270.jpg	0	8	approved	\N	\N	\N	148	\N	\N	\N	\N	ترست طنجرة ضغط كهربائية Duo Chef سعة 6 لتر بقدرة 1500 واط، رمادي-أسود.
274	ترست مقلى هوائي 1700 واط، سعة 11 لتر، لون اسود.	ترست	\N	\N	2026-03-17 22:30:19.300603	13	https://sbitany.com/image/cache/catalog/153-283-0019-0012-20250128132020-270x270.jpg	0	8	approved	\N	\N	\N	161	\N	\N	\N	\N	ترست مقلى هوائي 1700 واط، سعة 11 لتر، لون اسود.
35	إل جي غسالة سعة 11 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.	إل	\N	\N	2026-03-17 22:28:47.853838	18	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-270x270.jpg	1	8	approved	\N	\N	\N	3	\N	\N	\N	\N	إل جي غسالة سعة 11 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.
66	إل جي ثلاجة سعة 493 لتر، ماتور انفرتر موفر للكهرباء، زجاج أسود.	إل	\N	\N	2026-03-17 22:28:56.640105	16	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-270x270.jpg	3	8	approved	\N	\N	\N	6	\N	\N	\N	\N	إل جي ثلاجة سعة 493 لتر، ماتور انفرتر موفر للكهرباء، زجاج أسود.
278	سامسونج غسالة مع نشافة (Bespoke AI) غسيل 18 كغم / 11 كغم تجفيف، 22 برنامج، ماتور دجتل انفرتر/ انفرتر مضخة حرارية، فضي داكن.	سامسونج	\N	\N	2026-03-17 22:33:56.101851	19	https://sbitany.com/image/cache/catalog/107-634-0074-0001-2025091582144-270x270.jpg	1	8	approved	\N	\N	\N	54	\N	\N	\N	\N	سامسونج غسالة مع نشافة (Bespoke AI) غسيل 18 كغم / 11 كغم تجفيف، 22 برنامج، ماتور دجتل انفرتر/ انفرتر مضخة حرارية، فضي داكن.
59	إل جي ثلاجة سعة 423 لتر، ماتور انفرتر موفر للكهرباء، لون فضي.	إل	\N	\N	2026-03-17 22:28:55.82607	16	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-270x270.jpg	6	8	approved	\N	\N	\N	6	\N	\N	\N	\N	إل جي ثلاجة سعة 423 لتر، ماتور انفرتر موفر للكهرباء، لون فضي.
42	إل جي غسالة سعة 11 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، أسود.	إل	\N	\N	2026-03-17 22:28:48.948522	18	https://sbitany.com/image/cache/catalog/107-230-0073-0103-20241202120718-270x270.jpg	0	8	approved	\N	\N	\N	3	\N	\N	\N	\N	إل جي غسالة سعة 11 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، أسود.
49	إل جي جلاية 9 برامج، سعة 14 طقم، ماتور انفرتر دفع مباشر موفر للكهرباء، 3 رفوف، أسود غير لامع.	إل	\N	\N	2026-03-17 22:28:50.050443	21	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	14	\N	\N	\N	\N	إل جي جلاية 9 برامج، سعة 14 طقم، ماتور انفرتر دفع مباشر موفر للكهرباء، 3 رفوف، أسود غير لامع.
71	هوفر نشافة سعة 10 كغم، نظام مكثف داخلي، 9 برنامج، فضي.	هوفر	\N	\N	2026-03-17 22:28:57.291411	19	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-270x270.jpg	0	8	approved	\N	\N	\N	27	\N	\N	\N	\N	هوفر نشافة سعة 10 كغم، نظام مكثف داخلي، 9 برنامج، فضي.
86	هوفر جلاية 5 برامج، سعة 13 طقم، 2 رفوف، أسود	هوفر	\N	\N	2026-03-17 22:29:03.207752	21	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-270x270.jpg	0	8	approved	\N	\N	\N	35	\N	\N	\N	\N	هوفر جلاية 5 برامج، سعة 13 طقم، 2 رفوف، أسود
87	هوفر جلاية 10 برامج، سعة 16 طقم، 3 رفوف، ستانلس ستيل.	هوفر	\N	\N	2026-03-17 22:29:03.348585	21	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-270x270.jpg	0	8	approved	\N	\N	\N	36	\N	\N	\N	\N	هوفر جلاية 10 برامج، سعة 16 طقم، 3 رفوف، ستانلس ستيل.
94	سامسونج جلاية، 9 برامج، سعة 13 طقم، ماتور انفرتر ، 2 رفوف، ستانلس ستيل	سامسونج	\N	\N	2026-03-17 22:29:04.334444	21	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	41	\N	\N	\N	\N	سامسونج جلاية، 9 برامج، سعة 13 طقم، ماتور انفرتر ، 2 رفوف، ستانلس ستيل
108	سامسونج جلاية، 11 برامج، سعة 14 طقم، ماتور انفرتر ، 3 رفوف، أسود غير لامع	سامسونج	\N	\N	2026-03-17 22:29:10.360563	21	https://sbitany.com/image/cache/catalog/105-251-0034-0014-20231024132718-270x270.jpg	0	8	approved	\N	\N	\N	49	\N	\N	\N	\N	سامسونج جلاية، 11 برامج، سعة 14 طقم، ماتور انفرتر ، 3 رفوف، أسود غير لامع
110	غرونديغ ثلاجة بلت إن فريزر سفلي سعة 405 لتر، ماتور انفرتر موفر للكهرباء، لون أبيض.	غرونديغ	\N	\N	2026-03-17 22:29:10.575475	16	https://sbitany.com/image/cache/catalog/107-191-0060-0001-2023070261809-270x270.jpg	0	8	approved	\N	\N	\N	50	\N	\N	\N	\N	غرونديغ ثلاجة بلت إن فريزر سفلي سعة 405 لتر، ماتور انفرتر موفر للكهرباء، لون أبيض.
113	سامسونج ثلاجة سعة 470 لتر، ماتور انفرتر موفر للكهرباء، ستانلس ستيل.	سامسونج	\N	\N	2026-03-17 22:29:10.934215	16	https://sbitany.com/image/cache/catalog/107-230-0060-0139-20250520123741-270x270.jpg	0	8	approved	\N	\N	\N	51	\N	\N	\N	\N	سامسونج ثلاجة سعة 470 لتر، ماتور انفرتر موفر للكهرباء، ستانلس ستيل.
115	سامسونج غسالة سعة 11 كغم، 14 برنامج، ماتور دجتل انفرتر، أسود.	سامسونج	\N	\N	2026-03-17 22:29:11.147602	18	https://sbitany.com/image/cache/catalog/105-251-0034-0014-20231024132718-270x270.jpg	0	8	approved	\N	\N	\N	45	\N	\N	\N	\N	سامسونج غسالة سعة 11 كغم، 14 برنامج، ماتور دجتل انفرتر، أسود.
118	سيمنز جلاية بلت إن، 6 برامج، سعة 14 طقم، 3 رفوف.	سيمنز	\N	\N	2026-03-17 22:29:15.72744	21	https://sbitany.com/image/cache/catalog/107-285-0015-0002-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	55	\N	\N	\N	\N	سيمنز جلاية بلت إن، 6 برامج، سعة 14 طقم، 3 رفوف.
122	إل جي فريزر 7 جوارير سعة 355 لتر، نظام تبريد هوائي، ماتور انفرتر موفر للكهرباء، لون فضي.	إل	\N	\N	2026-03-17 22:29:16.310911	16	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-270x270.jpg	0	8	approved	\N	\N	\N	57	\N	\N	\N	\N	إل جي فريزر 7 جوارير سعة 355 لتر، نظام تبريد هوائي، ماتور انفرتر موفر للكهرباء، لون فضي.
123	سامسونج ثلاجة Family Hub أربع أبواب سعة 842 لتر، ماتور انفرتر موفر للكهرباء، اسود.	سامسونج	\N	\N	2026-03-17 22:29:16.446285	16	https://sbitany.com/image/cache/catalog/107-634-0060-0001-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	58	\N	\N	\N	\N	سامسونج ثلاجة Family Hub أربع أبواب سعة 842 لتر، ماتور انفرتر موفر للكهرباء، اسود.
54	جليم غاز فرن غاز 5 مواقد، قياس 80*60 سم، سعة 109 لتر، ستانلس ستيل.	جليم	\N	\N	2026-03-17 22:28:55.158893	22	https://sbitany.com/image/cache/catalog/107-231-0054-0012-20210316215021-270x270.jpg	0	8	approved	\N	\N	\N	7	\N	\N	\N	\N	جليم غاز فرن غاز 5 مواقد، قياس 80*60 سم، سعة 109 لتر، ستانلس ستيل.
302	سامسونج جهاز موبايل جالاكسي A36 5G، سعة 128 جيجابايت، أسود	سامسونج	\N	\N	2026-03-18 00:15:58.966301	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	2	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A36 5G، سعة 128 جيجابايت، أسود
31	فاير غاز هايتك طباخ غاز بلت إن 90 سم، 5 مواقد، ستانلس ستيل.	فاير	\N	\N	2026-03-17 22:28:47.257407	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	0	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 90 سم، 5 مواقد، ستانلس ستيل.
33	فاير غاز فرن كهربائي بلت إن 60 سم، سعة 67 لتر، 9 برامج، 3200 واط، ستانلس ستيل.	فاير	\N	\N	2026-03-17 22:28:47.569712	22	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	6	8	approved	\N	\N	\N	5	\N	\N	\N	\N	فاير غاز فرن كهربائي بلت إن 60 سم، سعة 67 لتر، 9 برامج، 3200 واط، ستانلس ستيل.
51	فاير غاز فرن كهربائي بلت إن 60 سم، سعة 69 لتر، 8 برامج، 2600 واط، زجاج أسود.	فاير	\N	\N	2026-03-17 22:28:50.324874	22	https://sbitany.com/image/cache/catalog/107-170-2667-0009-2023080762037-270x270.jpg	6	8	approved	\N	\N	\N	5	\N	\N	\N	\N	فاير غاز فرن كهربائي بلت إن 60 سم، سعة 69 لتر، 8 برامج، 2600 واط، زجاج أسود.
40	جليم غاز فرن غاز 4 مواقد، قياس 60*60 سم، سعة 65 لتر، ستانلس ستيل.	جليم	\N	\N	2026-03-17 22:28:48.703167	22	https://sbitany.com/image/cache/catalog/107-231-0054-0012-20210316215021-270x270.jpg	0	8	approved	\N	\N	\N	7	\N	\N	\N	\N	جليم غاز فرن غاز 4 مواقد، قياس 60*60 سم، سعة 65 لتر، ستانلس ستيل.
41	فاير غاز برولاين فرن كهربائي بلت إن 60 سم، سعة 72 لتر، 14 برنامج، 2900 واط، زجاج أسود.	فاير	\N	\N	2026-03-17 22:28:48.83634	22	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-270x270.jpg	0	8	approved	\N	\N	\N	8	\N	\N	\N	\N	فاير غاز برولاين فرن كهربائي بلت إن 60 سم، سعة 72 لتر، 14 برنامج، 2900 واط، زجاج أسود.
44	فاير غاز هايتك فرن كهربائي بلت إن 60 سم، سعة 67 لتر، 9 برامج، 3200 واط، زجاج أسود.	فاير	\N	\N	2026-03-17 22:28:49.374316	22	https://sbitany.com/image/cache/catalog/107-171-2667-0001-20230907134946-270x270.jpg	0	8	approved	\N	\N	\N	10	\N	\N	\N	\N	فاير غاز هايتك فرن كهربائي بلت إن 60 سم، سعة 67 لتر، 9 برامج، 3200 واط، زجاج أسود.
45	ماجيك فرن كهربائي بلت إن 60 سم، سعة 65 لتر، 8 برامج، 2600 واط، ستانلس ستيل.	ماجيك	\N	\N	2026-03-17 22:28:49.514056	22	https://sbitany.com/image/cache/catalog/107-235-0054-0229-2021031772458-270x270.jpg	0	8	approved	\N	\N	\N	11	\N	\N	\N	\N	ماجيك فرن كهربائي بلت إن 60 سم، سعة 65 لتر، 8 برامج، 2600 واط، ستانلس ستيل.
46	فاير غاز هايتك ميكروويف بلت إن 25 لتر، 1200 واط، 2 في 1، 8 برامج، لون أبيض.	فاير	\N	\N	2026-03-17 22:28:49.621278	22	https://sbitany.com/image/cache/catalog/113-171-0064-0005-2022061555235-270x270.jpg	0	8	approved	\N	\N	\N	12	\N	\N	\N	\N	فاير غاز هايتك ميكروويف بلت إن 25 لتر، 1200 واط، 2 في 1، 8 برامج، لون أبيض.
53	إل جي ثلاجة أربع أبواب سعة 474 لتر، ماتور انفرتر موفر للكهرباء، فضي.	إل	\N	\N	2026-03-17 22:28:54.887329	16	https://sbitany.com/image/cache/catalog/107-230-0060-0140-20250520123741-270x270.jpg	0	8	approved	\N	\N	\N	13	\N	\N	\N	\N	إل جي ثلاجة أربع أبواب سعة 474 لتر، ماتور انفرتر موفر للكهرباء، فضي.
57	فاير غاز برولاين ميكروويف بلت إن 34 لتر، 1100 واط، 2 في 1، 10 برامج، ستانلس ستيل / أسود.	فاير	\N	\N	2026-03-17 22:28:55.581294	22	https://sbitany.com/image/cache/catalog/107-071-2665-0003-2023052380129-270x270.jpg	0	8	approved	\N	\N	\N	17	\N	\N	\N	\N	فاير غاز برولاين ميكروويف بلت إن 34 لتر، 1100 واط، 2 في 1، 10 برامج، ستانلس ستيل / أسود.
67	أف جي فرن + ميكروويف (Combi) بلت إن 45 سم، سعة 34 لتر، 9 برنامج، ستانلس ستيل.	أف	\N	\N	2026-03-17 22:28:56.779067	22	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	0	8	approved	\N	\N	\N	24	\N	\N	\N	\N	أف جي فرن + ميكروويف (Combi) بلت إن 45 سم، سعة 34 لتر، 9 برنامج، ستانلس ستيل.
73	أف جي فرن + ميكروويف (Combi) بلت إن 45 سم، سعة 34 لتر، 9 برنامج، زجاج اسود.	أف	\N	\N	2026-03-17 22:28:57.703969	22	https://sbitany.com/image/cache/catalog/107-214-2667-0003-20230517101938-270x270.jpg	0	8	approved	\N	\N	\N	24	\N	\N	\N	\N	أف جي فرن + ميكروويف (Combi) بلت إن 45 سم، سعة 34 لتر، 9 برنامج، زجاج اسود.
76	ساوتر فرن كهربائي بلت إن 60 سم، سعة 69 لتر، 10 برنامج، ستانلس ستيل.	ساوتر	\N	\N	2026-03-17 22:29:01.911106	22	https://sbitany.com/image/cache/catalog/107-467-2580-0001-20240820125042-270x270.jpg	0	8	approved	\N	\N	\N	31	\N	\N	\N	\N	ساوتر فرن كهربائي بلت إن 60 سم، سعة 69 لتر، 10 برنامج، ستانلس ستيل.
80	ساوتر فرن كهربائي بلت إن 60 سم، 69 لتر، 10 برامج، أسود	ساوتر	\N	\N	2026-03-17 22:29:02.388242	22	https://sbitany.com/image/cache/catalog/107-467-2580-0001-20240820125042-270x270.jpg	0	8	approved	\N	\N	\N	31	\N	\N	\N	\N	ساوتر فرن كهربائي بلت إن 60 سم، 69 لتر، 10 برامج، أسود
124	سامسونج ميكروويف بلت إن سعة 23 لتر، أسود	سامسونج	\N	\N	2026-03-17 22:29:16.556956	22	https://sbitany.com/image/cache/catalog/107-634-2791-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	59	\N	\N	\N	\N	سامسونج ميكروويف بلت إن سعة 23 لتر، أسود
126	سيمنز فرن كهربائي بلت إن 60 سم، 71 لتر، زجاج أسود	سيمنز	\N	\N	2026-03-17 22:29:16.772173	22	https://sbitany.com/image/cache/catalog/107-285-2667-0005-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	61	\N	\N	\N	\N	سيمنز فرن كهربائي بلت إن 60 سم، 71 لتر، زجاج أسود
205	مايديا ميكروويف سعة 31 لتر، 1000 واط، 6 برامج، ستانلس ستيل.	مايديا	\N	\N	2026-03-17 22:29:52.602415	22	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	106	\N	\N	\N	\N	مايديا ميكروويف سعة 31 لتر، 1000 واط، 6 برامج، ستانلس ستيل.
79	أف جي شفاط يعلق على الحائط 80 سم، قوة الشفط 736 م³/بالساعة، أبيض.	أف	\N	\N	2026-03-17 22:29:02.269554	25	https://sbitany.com/image/cache/catalog/107-214-0039-0004-20240415135037-270x270.jpg	0	8	approved	\N	\N	\N	33	\N	\N	\N	\N	أف جي شفاط يعلق على الحائط 80 سم، قوة الشفط 736 م³/بالساعة، أبيض.
32	فاير غاز هايتك طباخ غاز بلت إن 60 سم، 4 مواقد، ستانلس ستيل.	فاير	\N	\N	2026-03-17 22:28:47.40817	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	0	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 60 سم، 4 مواقد، ستانلس ستيل.
102	سامسونج غسالة سعة 11 كغم، 14 برنامج، ماتور انفرتر عديم الاحتكاك موفر للكهرباء، أسود.	سامسونج	\N	\N	2026-03-17 22:29:09.534362	18	https://sbitany.com/image/cache/catalog/105-251-0034-0014-20231024132718-270x270.jpg	1	8	approved	\N	\N	\N	45	\N	\N	\N	\N	سامسونج غسالة سعة 11 كغم، 14 برنامج، ماتور انفرتر عديم الاحتكاك موفر للكهرباء، أسود.
34	فاير غاز هايتك طباخ غاز بلت إن 70 سم، 5 مواقد، ستانلس ستيل.	فاير	\N	\N	2026-03-17 22:28:47.716033	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	1	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 70 سم، 5 مواقد، ستانلس ستيل.
52	فاير غاز هايتك طباخ غاز بلت إن 90 سم، 6 مواقد، ستانلس ستيل.	فاير	\N	\N	2026-03-17 22:28:54.73616	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	1	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 90 سم، 6 مواقد، ستانلس ستيل.
43	فيرغاز شفاط يعلق على الحائط 90 سم، قوة الشفط 400 م³/بالساعة، ستانلس ستيل.	فيرغاز	\N	\N	2026-03-17 22:28:49.236248	25	https://sbitany.com/image/cache/catalog/107-170-0039-0056-20230803123521-270x270.jpg	0	8	approved	\N	\N	\N	9	\N	\N	\N	\N	فيرغاز شفاط يعلق على الحائط 90 سم، قوة الشفط 400 م³/بالساعة، ستانلس ستيل.
55	فيرغاز هايتك شفاط يعلق على الحائط  60 سم، قوة الشفط 750 م³/بالساعة، زجاج أبيض.	فيرغاز	\N	\N	2026-03-17 22:28:55.302764	25	https://sbitany.com/image/cache/catalog/107-171-0039-0021-2021060870600-270x270.jpg	0	8	approved	\N	\N	\N	16	\N	\N	\N	\N	فيرغاز هايتك شفاط يعلق على الحائط  60 سم، قوة الشفط 750 م³/بالساعة، زجاج أبيض.
62	ترست طباخ كهربائي سيراميك أحادي اللوحة ، ستانلس ستيل / زجاج أسود.	ترست	\N	\N	2026-03-17 22:28:56.210585	24	https://sbitany.com/image/cache/catalog/113-251-2654-0001-20240820125042-270x270.jpg	0	8	approved	\N	\N	\N	21	\N	\N	\N	\N	ترست طباخ كهربائي سيراميك أحادي اللوحة ، ستانلس ستيل / زجاج أسود.
64	أف جي ثلاجة بلت إن فريزر سفلي سعة 247 لتر، فتح الباب من اليسار، لون أبيض.	أف	\N	\N	2026-03-17 22:28:56.427727	16	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-270x270.jpg	0	8	approved	\N	\N	\N	23	\N	\N	\N	\N	أف جي ثلاجة بلت إن فريزر سفلي سعة 247 لتر، فتح الباب من اليسار، لون أبيض.
82	فاير غاز هايتك طباخ غاز بلت إن 90 سم، 5 مواقد، زجاج أسود.	فاير	\N	\N	2026-03-17 22:29:02.635418	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	0	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 90 سم، 5 مواقد، زجاج أسود.
83	ترست طباخ كهربائي سيراميك مزدوج، ستانلس ستيل / زجاج أسود.	ترست	\N	\N	2026-03-17 22:29:02.883013	24	https://sbitany.com/image/cache/catalog/113-251-2654-0001-20240820125042-270x270.jpg	0	8	approved	\N	\N	\N	21	\N	\N	\N	\N	ترست طباخ كهربائي سيراميك مزدوج، ستانلس ستيل / زجاج أسود.
101	أف جي شفاط يعلق على الحائط 80 سم، قوة الشفط 736 م³/بالساعة، أسود.	أف	\N	\N	2026-03-17 22:29:09.401335	25	https://sbitany.com/image/cache/catalog/107-214-0039-0004-20240415135037-270x270.jpg	0	8	approved	\N	\N	\N	33	\N	\N	\N	\N	أف جي شفاط يعلق على الحائط 80 سم، قوة الشفط 736 م³/بالساعة، أسود.
103	فيرغاز هايتك شفاط يعلق على الحائط 90 سم، قوة الشفط 621 م³/بالساعة، أسود.	فيرغاز	\N	\N	2026-03-17 22:29:09.649128	25	https://sbitany.com/image/cache/catalog/107-171-0039-0021-2021060870600-270x270.jpg	0	8	approved	\N	\N	\N	16	\N	\N	\N	\N	فيرغاز هايتك شفاط يعلق على الحائط 90 سم، قوة الشفط 621 م³/بالساعة، أسود.
109	ساوتر طباخ غاز بلت إن 75 سم، 5 مواقد، ستانلس ستيل	ساوتر	\N	\N	2026-03-17 22:29:10.465025	24	https://sbitany.com/image/cache/catalog/107-467-0035-0009-20250326121748-270x270.jpg	0	8	approved	\N	\N	\N	34	\N	\N	\N	\N	ساوتر طباخ غاز بلت إن 75 سم، 5 مواقد، ستانلس ستيل
111	أف جي شفاط يعلق بالسقف (جزيرة) 120 سم، قوة الشفط 600 م³/بالساعة، أسود.	أف	\N	\N	2026-03-17 22:29:10.716611	25	https://sbitany.com/image/cache/catalog/107-214-0039-0004-20240415135037-270x270.jpg	0	8	approved	\N	\N	\N	33	\N	\N	\N	\N	أف جي شفاط يعلق بالسقف (جزيرة) 120 سم، قوة الشفط 600 م³/بالساعة، أسود.
112	فيرغاز برولاين شفاط يعلق بالسقف (جزيرة) 90 سم، قوة الشفط 738 م³/بالساعة، أسود.	فيرغاز	\N	\N	2026-03-17 22:29:10.824215	25	https://sbitany.com/image/cache/catalog/107-071-0039-0005-20220627123600-270x270.jpg	0	8	approved	\N	\N	\N	47	\N	\N	\N	\N	فيرغاز برولاين شفاط يعلق بالسقف (جزيرة) 90 سم، قوة الشفط 738 م³/بالساعة، أسود.
117	سيمنز طباخ الحث المغناطيسي (Induction) بلت إن 80 سم، 4 مواقد تسخين، زجاج أسود.	سيمنز	\N	\N	2026-03-17 22:29:11.380146	24	https://sbitany.com/image/cache/catalog/107-285-0035-0001-2025091582144-270x270.jpg	0	8	approved	\N	\N	\N	53	\N	\N	\N	\N	سيمنز طباخ الحث المغناطيسي (Induction) بلت إن 80 سم، 4 مواقد تسخين، زجاج أسود.
127	فيرغاز شفاط يعلق على الحائط 60 سم، قوة الشفط 750 م³/بالساعة، زجاج أسود.	فيرغاز	\N	\N	2026-03-17 22:29:16.986521	25	https://sbitany.com/image/cache/catalog/107-170-0039-0056-20230803123521-270x270.jpg	0	8	approved	\N	\N	\N	9	\N	\N	\N	\N	فيرغاز شفاط يعلق على الحائط 60 سم، قوة الشفط 750 م³/بالساعة، زجاج أسود.
140	سامسونج تلفزيون QLED فئة Q6 حجم 55 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:26.31501	34	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-270x270.jpg	1	8	approved	\N	\N	\N	66	\N	\N	\N	\N	سامسونج تلفزيون QLED فئة Q6 حجم 55 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
150	سامسونج تلفزيون QLED فئة Q6 حجم 65 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:27.620521	34	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-270x270.jpg	1	8	approved	\N	\N	\N	66	\N	\N	\N	\N	سامسونج تلفزيون QLED فئة Q6 حجم 65 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
151	سامسونج تلفزيون QLED فئة Q6 حجم 85 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:27.725657	34	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-270x270.jpg	1	8	approved	\N	\N	\N	66	\N	\N	\N	\N	سامسونج تلفزيون QLED فئة Q6 حجم 85 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
144	تي سي إل تلفزيون QLED فئة P8K حجم 75 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:26.802724	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	1	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P8K حجم 75 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
132	تي سي إل تلفزيون LED فئة S5K حجم 40 بوصة FHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:25.251285	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	1	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون LED فئة S5K حجم 40 بوصة FHD ذكي بنظام تشغيل جوجل تي في.
133	تي سي إل تلفزيون LED فئة S5K حجم 43 بوصة FHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:25.372669	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	1	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون LED فئة S5K حجم 43 بوصة FHD ذكي بنظام تشغيل جوجل تي في.
131	تي سي إل تلفزيون QLED فئة P7K حجم 65 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:24.993048	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P7K حجم 65 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
135	تي سي إل تلفزيون QLED فئة P7K حجم 50 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:25.618173	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P7K حجم 50 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
136	تي سي إل تلفزيون QLED فئة P7K حجم 85 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:25.760746	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P7K حجم 85 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
137	سامسونج تلفزيون UHD فئة U8000F حجم 65 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:25.900576	34	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	63	\N	\N	\N	\N	سامسونج تلفزيون UHD فئة U8000F حجم 65 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
138	تي سي إل تلفزيون QLED فئة P7K حجم 75 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:26.039843	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P7K حجم 75 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
142	سامسونج تلفزيون QLED فئة Q6 حجم 75 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:26.53043	34	https://sbitany.com/image/cache/catalog/130-634-0070-0032-2026011482151-270x270.jpg	0	8	approved	\N	\N	\N	66	\N	\N	\N	\N	سامسونج تلفزيون QLED فئة Q6 حجم 75 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
143	سامسونج تلفزيون UHD فئة U8000F حجم 85 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:26.668317	34	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	63	\N	\N	\N	\N	سامسونج تلفزيون UHD فئة U8000F حجم 85 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
146	سامسونج تلفزيون UHD فئة U8000F حجم 58 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:27.086236	34	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	63	\N	\N	\N	\N	سامسونج تلفزيون UHD فئة U8000F حجم 58 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
147	تي سي إل تلفزيون QLED فئة P8K حجم 98 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:27.235195	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P8K حجم 98 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
148	إل جي تلفزيون OLED evo، فئة C5، حجم 77 بوصة بدقة 4K UHD، ذكي بنظام تشغيل WebOS.	إل	\N	\N	2026-03-17 22:29:27.371692	34	https://sbitany.com/image/cache/catalog/130-230-0070-0320-20250923125140-270x270.jpg	0	8	approved	\N	\N	\N	65	\N	\N	\N	\N	إل جي تلفزيون OLED evo، فئة C5، حجم 77 بوصة بدقة 4K UHD، ذكي بنظام تشغيل WebOS.
152	تلفزيون إل جي NanoCell فئة NANO80 حجم 86 بوصة بدقة 4K UHD ذكي بنظام تشغيل WebOS.	تلفزيون	\N	\N	2026-03-17 22:29:31.275536	34	https://sbitany.com/image/cache/catalog/130-230-0070-0314-20250820101855-270x270.jpg	0	8	approved	\N	\N	\N	68	\N	\N	\N	\N	تلفزيون إل جي NanoCell فئة NANO80 حجم 86 بوصة بدقة 4K UHD ذكي بنظام تشغيل WebOS.
153	سامسونج تلفزيون Neo QLED فئة QN7 حجم 75 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:31.409882	34	https://sbitany.com/image/cache/catalog/130-634-0070-0036-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	69	\N	\N	\N	\N	سامسونج تلفزيون Neo QLED فئة QN7 حجم 75 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
90	أف جي درج تسخين 15 سم، ستانلس ستيل	أف	\N	\N	2026-03-17 22:29:03.703915	13	https://sbitany.com/image/cache/catalog/107-214-2575-0001-20230517101938-270x270.jpg	0	8	approved	\N	\N	\N	38	\N	\N	\N	\N	أف جي درج تسخين 15 سم، ستانلس ستيل
306	أبل آيفون 17 برو سعة 256 جيجابايت لون فضي	أبل	\N	\N	2026-03-18 00:15:59.399355	29	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-270x270.jpg	3	8	approved	\N	\N	\N	162	\N	\N	\N	\N	أبل آيفون 17 برو سعة 256 جيجابايت لون فضي
362	دايسون مصفف الشعر إيرراب لايت (HS05) للشعر الطويل والمتعدد الأنماط 1300 واط، نيكل/نحاسي	دايسون	\N	\N	2026-03-18 00:18:31.972791	44	https://sbitany.com/image/cache/catalog/104-853-0139-0001-20251027135215-270x270.jpg	1	8	approved	\N	\N	\N	200	\N	\N	\N	\N	دايسون مصفف الشعر إيرراب لايت (HS05) للشعر الطويل والمتعدد الأنماط 1300 واط، نيكل/نحاسي
307	اتش بي لابتوب Intel Core 5 ذاكرة 8GB DDR5 سعة 512GB SSD شاشة 15.6 بوصة لون أسود	اتش	\N	\N	2026-03-18 00:16:03.844768	31	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-270x270.jpg	0	8	approved	\N	\N	\N	164	\N	\N	\N	\N	اتش بي لابتوب Intel Core 5 ذاكرة 8GB DDR5 سعة 512GB SSD شاشة 15.6 بوصة لون أسود
308	اتش بي لابتوب Intel Core 7 ذاكرة 16GB DDR5 سعة 512GB SSD شاشة 15.6 بوصة لون أسود	اتش	\N	\N	2026-03-18 00:16:03.947604	31	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-270x270.jpg	0	8	approved	\N	\N	\N	164	\N	\N	\N	\N	اتش بي لابتوب Intel Core 7 ذاكرة 16GB DDR5 سعة 512GB SSD شاشة 15.6 بوصة لون أسود
310	اتش بي لاب توب 16 بوصة، Ultra 7 255U، رام 16 جيجابايت، 512 جيجابايت SSD، ProBook 4 G1i، ألومنيوم فضي بيك	اتش	\N	\N	2026-03-18 00:16:04.167757	31	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-270x270.jpg	0	8	approved	\N	\N	\N	166	\N	\N	\N	\N	اتش بي لاب توب 16 بوصة، Ultra 7 255U، رام 16 جيجابايت، 512 جيجابايت SSD، ProBook 4 G1i، ألومنيوم فضي بيك
323	سيمنز فرن كهربائي بلت إن 60 سم زجاج أسود ستانلس ستيل	سيمنز	\N	\N	2026-03-18 00:17:37.141357	22	https://sbitany.com/image/cache/catalog/107-285-2667-0005-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	61	\N	\N	\N	\N	سيمنز فرن كهربائي بلت إن 60 سم زجاج أسود ستانلس ستيل
119	فاير غاز برولاين فرن كهربائي بلت إن 60 سم، سعة 72 لتر، 13 برنامج، 2900 واط، ستانلس أسود / زجاج أسود.	فاير	\N	\N	2026-03-17 22:29:15.843244	22	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-270x270.jpg	0	8	approved	\N	\N	\N	8	\N	\N	\N	\N	فاير غاز برولاين فرن كهربائي بلت إن 60 سم، سعة 72 لتر، 13 برنامج، 2900 واط، ستانلس أسود / زجاج أسود.
120	فيرغاز برولاين شفاط يعلق بالسقف (جزيرة) 50 سم، قوة الشفط 765 م³/بالساعة، أسود.	فيرغاز	\N	\N	2026-03-17 22:29:15.984992	25	https://sbitany.com/image/cache/catalog/107-071-0039-0005-20220627123600-270x270.jpg	0	8	approved	\N	\N	\N	47	\N	\N	\N	\N	فيرغاز برولاين شفاط يعلق بالسقف (جزيرة) 50 سم، قوة الشفط 765 م³/بالساعة، أسود.
157	أنكر باوربانك MagGo سعة 10000 ملّي أمبير، أسود.	أنكر	\N	\N	2026-03-17 22:29:35.123689	50	https://sbitany.com/image/cache/catalog/137-203-1331-0005-20251125114103-270x270.jpg	0	8	approved	\N	\N	\N	73	\N	\N	\N	\N	أنكر باوربانك MagGo سعة 10000 ملّي أمبير، أسود.
159	أنكر كابل نايلون USB-C إلى USB-C (1.8 متر)	أنكر	\N	\N	2026-03-17 22:29:35.344431	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	0	8	approved	\N	\N	\N	75	\N	\N	\N	\N	أنكر كابل نايلون USB-C إلى USB-C (1.8 متر)
161	أنكر شاحن USB-C Nano بقدرة 45 واط لون أسود	أنكر	\N	\N	2026-03-17 22:29:35.574309	50	https://sbitany.com/image/cache/catalog/137-203-1094-0006-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	77	\N	\N	\N	\N	أنكر شاحن USB-C Nano بقدرة 45 واط لون أسود
163	أنكر كابل USB-C إلى USB-C بطول 1.2 متر لون أسود	أنكر	\N	\N	2026-03-17 22:29:35.788564	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	0	8	approved	\N	\N	\N	78	\N	\N	\N	\N	أنكر كابل USB-C إلى USB-C بطول 1.2 متر لون أسود
164	آبل كابل (USB-C) 60 واط 1 متر، أبيض	آبل	\N	\N	2026-03-17 22:29:35.902513	50	https://sbitany.com/image/cache/catalog/113-320-0133-0001-20241027123902-270x270.jpg	0	8	approved	\N	\N	\N	79	\N	\N	\N	\N	آبل كابل (USB-C) 60 واط 1 متر، أبيض
167	أنكر بنك طاقة Zolo بقدرة 35 واط مع كابلين USB-C مدمجين سعة 10000 مللي أمبير لون أسود	أنكر	\N	\N	2026-03-17 22:29:36.337062	50	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	81	\N	\N	\N	\N	أنكر بنك طاقة Zolo بقدرة 35 واط مع كابلين USB-C مدمجين سعة 10000 مللي أمبير لون أسود
168	أنكر شاحن سيارة USB-C مع كابل مدمج قابل للسحب بقدرة 75 واط لون رمادي	أنكر	\N	\N	2026-03-17 22:29:36.444057	50	https://sbitany.com/image/cache/catalog/137-203-1093-0001-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	82	\N	\N	\N	\N	أنكر شاحن سيارة USB-C مع كابل مدمج قابل للسحب بقدرة 75 واط لون رمادي
324	سيمنز فرن كهربائي بلت إن 60 سم زجاج أسود	سيمنز	\N	\N	2026-03-18 00:17:37.245997	22	https://sbitany.com/image/cache/catalog/107-285-2667-0005-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	61	\N	\N	\N	\N	سيمنز فرن كهربائي بلت إن 60 سم زجاج أسود
171	أنكر بنك طاقة نانو 30 واط مع كابل مدمج	أنكر	\N	\N	2026-03-17 22:29:36.771285	50	https://sbitany.com/image/cache/catalog/137-203-1331-0002-2025051455625-270x270.jpg	0	8	approved	\N	\N	\N	85	\N	\N	\N	\N	أنكر بنك طاقة نانو 30 واط مع كابل مدمج
325	سامسونج فرن بلت إن Dual Cook سعة 76 لتر، أسود	سامسونج	\N	\N	2026-03-18 00:17:37.35603	22	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	29	\N	\N	\N	\N	سامسونج فرن بلت إن Dual Cook سعة 76 لتر، أسود
327	كامي مصفف شعر Multi Pro بقدرة 1400 واط لون بيج	كامي	\N	\N	2026-03-18 00:17:46.817195	44	https://sbitany.com/image/cache/catalog/104-315-1964-0001-2026021974437-270x270.jpg	0	8	approved	\N	\N	\N	175	\N	\N	\N	\N	كامي مصفف شعر Multi Pro بقدرة 1400 واط لون بيج
329	كامي فرشاة شعر حرارية Elegance بقدرة 1000 واط لون بيج	كامي	\N	\N	2026-03-18 00:17:47.173558	44	https://sbitany.com/image/cache/catalog/104-315-1960-0001-2026021974437-270x270.jpg	0	8	approved	\N	\N	\N	177	\N	\N	\N	\N	كامي فرشاة شعر حرارية Elegance بقدرة 1000 واط لون بيج
100	أف جي درج تسخين 15 سم، زجاج أسود.	أف	\N	\N	2026-03-17 22:29:09.2922	13	https://sbitany.com/image/cache/catalog/107-214-2575-0001-20230517101938-270x270.jpg	0	8	approved	\N	\N	\N	38	\N	\N	\N	\N	أف جي درج تسخين 15 سم، زجاج أسود.
175	أنكر كابل USB-C إلى Lightning بطول 1.8 متر لون أسود	أنكر	\N	\N	2026-03-17 22:29:37.217096	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	0	8	approved	\N	\N	\N	78	\N	\N	\N	\N	أنكر كابل USB-C إلى Lightning بطول 1.8 متر لون أسود
203	أنكر كابل USB-C إلى لايتنينغ (0.9م)	أنكر	\N	\N	2026-03-17 22:29:47.598048	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	1	8	approved	\N	\N	\N	78	\N	\N	\N	\N	أنكر كابل USB-C إلى لايتنينغ (0.9م)
193	آبل كابل USB-C مغناطيسي سريع الشحن لساعة آبل بطول 1 متر	آبل	\N	\N	2026-03-17 22:29:43.006947	50	https://sbitany.com/image/cache/catalog/151-111-2895-0001-2025042964353-270x270.jpg	1	8	approved	\N	\N	\N	97	\N	\N	\N	\N	آبل كابل USB-C مغناطيسي سريع الشحن لساعة آبل بطول 1 متر
39	إل جي ثلاجة سعة 515 لتر، ماتور انفرتر موفر للكهرباء، زجاج أسود.	إل	\N	\N	2026-03-17 22:28:48.421865	16	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-270x270.jpg	1	8	approved	\N	\N	\N	6	\N	\N	\N	\N	إل جي ثلاجة سعة 515 لتر، ماتور انفرتر موفر للكهرباء، زجاج أسود.
125	سيمنز ثلاجة أربع أبواب سعة 605 لتر، ماتور انفيرتر موفر للكهرباء، ستانلس ستيل.	سيمنز	\N	\N	2026-03-17 22:29:16.664874	16	https://sbitany.com/image/cache/catalog/107-285-0060-0001-2025091582144-270x270.jpg	0	8	approved	\N	\N	\N	60	\N	\N	\N	\N	سيمنز ثلاجة أربع أبواب سعة 605 لتر، ماتور انفيرتر موفر للكهرباء، ستانلس ستيل.
128	إل جي تلفزيون QNED، فئة QNED70، حجم 55 بوصة بدقة 4K UHD، ذكي بنظام تشغيل WebOS.	إل	\N	\N	2026-03-17 22:29:24.559727	34	https://sbitany.com/image/cache/catalog/130-230-0070-0315-20250923125140-270x270.jpg	0	8	approved	\N	\N	\N	62	\N	\N	\N	\N	إل جي تلفزيون QNED، فئة QNED70، حجم 55 بوصة بدقة 4K UHD، ذكي بنظام تشغيل WebOS.
176	أنكر كابل نايلون USB-C إلى USB-C (1 متر)	أنكر	\N	\N	2026-03-17 22:29:37.326806	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	0	8	approved	\N	\N	\N	75	\N	\N	\N	\N	أنكر كابل نايلون USB-C إلى USB-C (1 متر)
179	آبل كابل (USB-C) 40 واط 2 متر، أبيض	آبل	\N	\N	2026-03-17 22:29:41.357069	50	https://sbitany.com/image/cache/catalog/40S5K/130-751-0070-0094-2025081482116-270x270.jpg	0	8	approved	\N	\N	\N	89	\N	\N	\N	\N	آبل كابل (USB-C) 40 واط 2 متر، أبيض
182	أنكر شاحن 1C B2B 30 واط أبيض	أنكر	\N	\N	2026-03-17 22:29:41.689097	50	https://sbitany.com/image/cache/catalog/107-634-0073-0005-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	92	\N	\N	\N	\N	أنكر شاحن 1C B2B 30 واط أبيض
183	أنكر شاحن سيارة لاسلكي مع حامل معدني لون أسود	أنكر	\N	\N	2026-03-17 22:29:41.907437	50	https://sbitany.com/image/cache/catalog/137-203-1093-0003-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	93	\N	\N	\N	\N	أنكر شاحن سيارة لاسلكي مع حامل معدني لون أسود
188	أنكر شاحن 1C B2B 30 واط أسود	أنكر	\N	\N	2026-03-17 22:29:42.451287	50	https://sbitany.com/image/cache/catalog/107-634-0073-0005-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	92	\N	\N	\N	\N	أنكر شاحن 1C B2B 30 واط أسود
195	أنكر شاحن MagGo اللاسلكي المكعب	أنكر	\N	\N	2026-03-17 22:29:43.223871	50	https://sbitany.com/image/cache/catalog/137-203-1699-0002-2025051455625-270x270.jpg	0	8	approved	\N	\N	\N	99	\N	\N	\N	\N	أنكر شاحن MagGo اللاسلكي المكعب
196	أنكر شاحن ماج جو اللاسلكي (لوحة)	أنكر	\N	\N	2026-03-17 22:29:43.334776	50	https://sbitany.com/image/cache/catalog/137-203-1699-0001-2025051455625-270x270.jpg	0	8	approved	\N	\N	\N	100	\N	\N	\N	\N	أنكر شاحن ماج جو اللاسلكي (لوحة)
197	أنكر كابل USB-C بقدرة 240 واط للشحن السريع	أنكر	\N	\N	2026-03-17 22:29:43.454619	50	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	101	\N	\N	\N	\N	أنكر كابل USB-C بقدرة 240 واط للشحن السريع
221	إل جي مكنسة كهربائية عامودية لاسلكية بقوة 150 واط هوائي لون أسود وأبيض	إل	\N	\N	2026-03-17 22:29:54.741431	36	https://sbitany.com/image/cache/catalog/113-230-0025-0026-2026020381944-270x270.jpg	0	8	approved	\N	\N	\N	119	\N	\N	\N	\N	إل جي مكنسة كهربائية عامودية لاسلكية بقوة 150 واط هوائي لون أسود وأبيض
225	بيسيل مكنسة كهربائية برميل 1500 واط للتنظيف الرطب والجاف، لون أخضر.	بيسيل	\N	\N	2026-03-17 22:29:55.247473	36	https://sbitany.com/image/cache/catalog/113-130-0025-0049-20201116110556-270x270.jpg	0	8	approved	\N	\N	\N	122	\N	\N	\N	\N	بيسيل مكنسة كهربائية برميل 1500 واط للتنظيف الرطب والجاف، لون أخضر.
236	بيسيل مكنسة كهربائية للتنظيف العميق للسجاد، تقنية الهيدروستيم 1249 واط، أسود وذهبي وردي.	بيسيل	\N	\N	2026-03-17 22:30:03.357763	36	https://sbitany.com/image/cache/catalog/113-130-0025-0049-20201116110556-270x270.jpg	0	8	approved	\N	\N	\N	132	\N	\N	\N	\N	بيسيل مكنسة كهربائية للتنظيف العميق للسجاد، تقنية الهيدروستيم 1249 واط، أسود وذهبي وردي.
238	بيسيل مكنسة تنظيف متعدد الأسطح EdgeFind سلكية 360 واط، أزرق وأسود	بيسيل	\N	\N	2026-03-17 22:30:03.575419	36	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-270x270.jpg	0	8	approved	\N	\N	\N	134	\N	\N	\N	\N	بيسيل مكنسة تنظيف متعدد الأسطح EdgeFind سلكية 360 واط، أزرق وأسود
239	بيسيل مكنسة تنظيف متعدد الأسطح OmniForce Edge لاسلكية، أسود وأزرق	بيسيل	\N	\N	2026-03-17 22:30:03.719021	36	https://sbitany.com/image/cache/catalog/113-130-2553-0010-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	134	\N	\N	\N	\N	بيسيل مكنسة تنظيف متعدد الأسطح OmniForce Edge لاسلكية، أسود وأزرق
242	بيسيل مكنسة تنظيف متعدد الأسطح OmniFind لاسلكية، أسود وأزرق	بيسيل	\N	\N	2026-03-17 22:30:04.084968	36	https://sbitany.com/image/cache/catalog/113-130-2553-0010-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	134	\N	\N	\N	\N	بيسيل مكنسة تنظيف متعدد الأسطح OmniFind لاسلكية، أسود وأزرق
262	بيسيل مكنسة كهربائية كروس ويف بخار 1100 واط، منظف متعدد الأسطح، اسود / ذهبي وردي.	بيسيل	\N	\N	2026-03-17 22:30:12.37317	36	https://sbitany.com/image/cache/catalog/113-130-2553-0006-20231024132718-270x270.jpg	0	8	approved	\N	\N	\N	151	\N	\N	\N	\N	بيسيل مكنسة كهربائية كروس ويف بخار 1100 واط، منظف متعدد الأسطح، اسود / ذهبي وردي.
275	سيجافريدو كبسولات قهوة عدد 10* 6 غرام (Le Origin Costa rica).	سيجافريدو	\N	\N	2026-03-17 22:30:19.409153	37	https://sbitany.com/image/cache/catalog/448Coffeecapsule-20200901205833-270x270.png	0	8	approved	\N	\N	\N	156	\N	\N	\N	\N	سيجافريدو كبسولات قهوة عدد 10* 6 غرام (Le Origin Costa rica).
154	سامسونج تلفزيون LED فئة F6000 حجم 43 بوصة Full HD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:31.520322	34	https://sbitany.com/image/cache/catalog/130-230-0070-0320-20250923125140-270x270.jpg	1	8	approved	\N	\N	\N	70	\N	\N	\N	\N	سامسونج تلفزيون LED فئة F6000 حجم 43 بوصة Full HD ذكي بنظام تشغيل Tizen.
155	فيليبس تلفزيون UHD فئة 7100 حجم 65 بوصة 4K UHD ذكي بنظام تشغيل اندرويد تي في.	فيليبس	\N	\N	2026-03-17 22:29:31.628997	34	https://sbitany.com/image/cache/catalog/130-268-0070-0004-20250923125151-270x270.jpg	1	8	approved	\N	\N	\N	71	\N	\N	\N	\N	فيليبس تلفزيون UHD فئة 7100 حجم 65 بوصة 4K UHD ذكي بنظام تشغيل اندرويد تي في.
104	فاير غاز هايتك طباخ غاز بلت إن 60 سم، 4 مواقد، زجاج أسود.	فاير	\N	\N	2026-03-17 22:29:09.801255	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	1	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 60 سم، 4 مواقد، زجاج أسود.
129	سامسونج تلفزيون UHD فئة U8000F حجم 70 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:24.712385	34	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	63	\N	\N	\N	\N	سامسونج تلفزيون UHD فئة U8000F حجم 70 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
134	تي سي إل تلفزيون QLED فئة P7K حجم 55 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:25.480429	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P7K حجم 55 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
139	إل جي تلفزيون OLED evo، فئة CS5، حجم 55 بوصة بدقة 4K UHD، ذكي بنظام تشغيل WebOS.	إل	\N	\N	2026-03-17 22:29:26.177148	34	https://sbitany.com/image/cache/catalog/130-230-0070-0320-20250923125140-270x270.jpg	0	8	approved	\N	\N	\N	65	\N	\N	\N	\N	إل جي تلفزيون OLED evo، فئة CS5، حجم 55 بوصة بدقة 4K UHD، ذكي بنظام تشغيل WebOS.
145	تي سي إل تلفزيون QLED فئة P8K حجم 85 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:26.942064	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	0	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون QLED فئة P8K حجم 85 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
149	سامسونج تلفزيون UHD فئة U8000F حجم 50 بوصة 4K UHD ذكي بنظام تشغيل Tizen.	سامسونج	\N	\N	2026-03-17 22:29:27.506063	34	https://sbitany.com/image/cache/catalog/130-634-0070-0028-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	63	\N	\N	\N	\N	سامسونج تلفزيون UHD فئة U8000F حجم 50 بوصة 4K UHD ذكي بنظام تشغيل Tizen.
162	أنكر كابل USB-C إلى HDMI بطول 1.8 متر لون أسود	أنكر	\N	\N	2026-03-17 22:29:35.679472	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	0	8	approved	\N	\N	\N	78	\N	\N	\N	\N	أنكر كابل USB-C إلى HDMI بطول 1.8 متر لون أسود
166	أنكر بنك طاقة Zolo بقدرة 35 واط مع كابلين USB-C مدمجين سعة 10000 مللي أمبير لون أزرق	أنكر	\N	\N	2026-03-17 22:29:36.226832	50	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	81	\N	\N	\N	\N	أنكر بنك طاقة Zolo بقدرة 35 واط مع كابلين USB-C مدمجين سعة 10000 مللي أمبير لون أزرق
226	ترست مكواة بخار سيراميك 2400 واط لون أسود وذهبي	ترست	\N	\N	2026-03-17 22:29:55.391534	41	https://sbitany.com/image/cache/catalog/113-251-0117-0003-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	123	\N	\N	\N	\N	ترست مكواة بخار سيراميك 2400 واط لون أسود وذهبي
229	لافازا حبوب قهوة جوستو فورتي 1 كغم	لافازا	\N	\N	2026-03-17 22:30:02.421708	37	https://sbitany.com/image/cache/catalog/113-313-2239-0001-20251224114859-270x270.jpg	0	8	approved	\N	\N	\N	126	\N	\N	\N	\N	لافازا حبوب قهوة جوستو فورتي 1 كغم
233	فيليبس مكواة بخار 2800 واط سلسلة 7000، أزرق	فيليبس	\N	\N	2026-03-17 22:30:03.019439	41	https://sbitany.com/image/cache/catalog/113-268-0117-0025-2025042964335-270x270.jpg	0	8	approved	\N	\N	\N	129	\N	\N	\N	\N	فيليبس مكواة بخار 2800 واط سلسلة 7000، أزرق
234	راسل هوبز مكواة بخار بقدرة 2600 واط لون أسود	راسل	\N	\N	2026-03-17 22:30:03.130553	41	https://sbitany.com/image/cache/catalog/113-282-0117-0003-20260311120410-270x270.jpg	0	8	approved	\N	\N	\N	130	\N	\N	\N	\N	راسل هوبز مكواة بخار بقدرة 2600 واط لون أسود
237	فيليبس مكواة بخار 2400 واط، قوة اندفاع البخار 180 جرام، أخضر.	فيليبس	\N	\N	2026-03-17 22:30:03.466409	41	https://sbitany.com/image/cache/catalog/113-268-0117-0020-20240605132023-270x270.jpg	0	8	approved	\N	\N	\N	133	\N	\N	\N	\N	فيليبس مكواة بخار 2400 واط، قوة اندفاع البخار 180 جرام، أخضر.
241	فيليبس مكواة بخار ‎2000 واط أبيض	فيليبس	\N	\N	2026-03-17 22:30:03.979815	41	https://sbitany.com/image/cache/catalog/113-268-0117-0034-20250923125906-270x270.jpg	0	8	approved	\N	\N	\N	136	\N	\N	\N	\N	فيليبس مكواة بخار ‎2000 واط أبيض
250	ترست مكواة بخار يدوية بقدرة 1800 واط أسود	ترست	\N	\N	2026-03-17 22:30:10.910755	41	https://sbitany.com/image/cache/catalog/113-251-0118-0002-2025080395528-270x270.jpg	0	8	approved	\N	\N	\N	140	\N	\N	\N	\N	ترست مكواة بخار يدوية بقدرة 1800 واط أسود
254	كوركماز ماكنة تحضير القهوة 400 واط ، تحضير حتى 4 فناجين، أسود/ فضي.	كوركماز	\N	\N	2026-03-17 22:30:11.467726	37	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-270x270.jpg	0	8	approved	\N	\N	\N	112	\N	\N	\N	\N	كوركماز ماكنة تحضير القهوة 400 واط ، تحضير حتى 4 فناجين، أسود/ فضي.
258	فيليبس مكواة بخار 3000 واط، دفعة بخارية 240 جرام، ازرق فاتح.	فيليبس	\N	\N	2026-03-17 22:30:11.934192	41	https://sbitany.com/image/cache/catalog/113-268-0117-0022-20240605132023-270x270.jpg	0	8	approved	\N	\N	\N	147	\N	\N	\N	\N	فيليبس مكواة بخار 3000 واط، دفعة بخارية 240 جرام، ازرق فاتح.
260	فيليبس مكواة بخار، 2000 واط، أبيض	فيليبس	\N	\N	2026-03-17 22:30:12.1544	41	https://sbitany.com/image/cache/catalog/113-268-0117-0026-20250326121748-270x270.jpg	0	8	approved	\N	\N	\N	149	\N	\N	\N	\N	فيليبس مكواة بخار، 2000 واط، أبيض
172	أنكر شاحن سيارة USB-C ثلاثي المنافذ مع مجموعة كابلات بقدرة 167.5 واط لون رمادي	أنكر	\N	\N	2026-03-17 22:29:36.891685	50	https://sbitany.com/image/cache/catalog/137-203-1093-0001-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	82	\N	\N	\N	\N	أنكر شاحن سيارة USB-C ثلاثي المنافذ مع مجموعة كابلات بقدرة 167.5 واط لون رمادي
339	فيليبس مجفف شعر 2300 واط مع تقنية ThermoShield ، 3 اعدادات للحرارة و اعدادان السرعة، لون ازرق معدني .	فيليبس	\N	\N	2026-03-18 00:17:59.062755	44	https://sbitany.com/image/cache/catalog/104-268-0137-0001-2024122492601-270x270.jpg	0	8	approved	\N	\N	\N	184	\N	\N	\N	\N	فيليبس مجفف شعر 2300 واط مع تقنية ThermoShield ، 3 اعدادات للحرارة و اعدادان السرعة، لون ازرق معدني .
187	أنكر بنك طاقة بقدرة 165 واط مع كابل USB-C مدمج وقابل للسحب سعة 25000 مللي أمبير لون أسود	أنكر	\N	\N	2026-03-17 22:29:42.341268	50	https://sbitany.com/image/cache/catalog/137-203-1331-0008-2026021974452-270x270.jpg	0	8	approved	\N	\N	\N	94	\N	\N	\N	\N	أنكر بنك طاقة بقدرة 165 واط مع كابل USB-C مدمج وقابل للسحب سعة 25000 مللي أمبير لون أسود
342	فيليبس جهاز تمويج الشعر التلقائي، درجة حرارة 210 درجة مئوية، أسود.	فيليبس	\N	\N	2026-03-18 00:18:03.847201	44	https://sbitany.com/image/cache/catalog/113-268-0138-0004-20250206115459-270x270.jpg	0	8	approved	\N	\N	\N	185	\N	\N	\N	\N	فيليبس جهاز تمويج الشعر التلقائي، درجة حرارة 210 درجة مئوية، أسود.
343	فيلبس مجفف شعر 2100 واط مع تقنية (Ionic)، 2 إعدادات للسرعة، لون أسود.	فيلبس	\N	\N	2026-03-18 00:18:03.955041	44	https://sbitany.com/image/cache/catalog/153-283-1012-0003-2025012291619-270x270.jpg	0	8	approved	\N	\N	\N	186	\N	\N	\N	\N	فيلبس مجفف شعر 2100 واط مع تقنية (Ionic)، 2 إعدادات للسرعة، لون أسود.
290	آبل سماعات ايربودز الجيل الرابع	آبل	\N	\N	2026-03-18 00:02:05.683643	29	https://sbitany.com/image/cache/catalog/101-111-0000-0001-2025042964312-270x270.jpg	1	8	approved	\N	\N	\N	96	\N	\N	\N	\N	آبل سماعات ايربودز الجيل الرابع
291	ساوندكور سماعات أذن لاسلكية R50i NC أسود	ساوندكور	\N	\N	2026-03-18 00:02:06.43501	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية R50i NC أسود
292	ساوندكور سماعات أذن لاسلكية R50i NC زهري	ساوندكور	\N	\N	2026-03-18 00:02:06.544224	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية R50i NC زهري
293	ساوندكور سماعة رأس لاسلكية Space One Pro بخاصية إلغاء الضجيج حتى 40 ساعة لون أبيض	ساوندكور	\N	\N	2026-03-18 00:02:06.651787	29	https://sbitany.com/image/cache/catalog/137-294-1101-0001-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	103	\N	\N	\N	\N	ساوندكور سماعة رأس لاسلكية Space One Pro بخاصية إلغاء الضجيج حتى 40 ساعة لون أبيض
294	جي بي إل سماعة اذن سلكية صوت جهير نقي، أبيض	جي	\N	\N	2026-03-18 00:02:08.477925	29	https://sbitany.com/image/cache/catalog/137-294-1101-0001-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	104	\N	\N	\N	\N	جي بي إل سماعة اذن سلكية صوت جهير نقي، أبيض
333	فيليبس آلة إزالة الشعر السلكية 15 فولت إعدادان للسرعة + 1 ملحق، أبيض/وردي	فيليبس	\N	\N	2026-03-18 00:17:50.815403	44	https://sbitany.com/image/cache/catalog/104-268-1959-0006-2023051794709-270x270.jpg	0	8	approved	\N	\N	\N	181	\N	\N	\N	\N	فيليبس آلة إزالة الشعر السلكية 15 فولت إعدادان للسرعة + 1 ملحق، أبيض/وردي
334	سينسيكا جهاز إزالة الشعر Sensilight Mini بتقنية IPL باستخدام الومضات، استخدام سلكي، أبيض/ذهبي وردي.	سينسيكا	\N	\N	2026-03-18 00:17:52.604208	44	https://sbitany.com/image/cache/catalog/104-264-1965-0004-20240214122755-270x270.jpg	0	8	approved	\N	\N	\N	182	\N	\N	\N	\N	سينسيكا جهاز إزالة الشعر Sensilight Mini بتقنية IPL باستخدام الومضات، استخدام سلكي، أبيض/ذهبي وردي.
336	فيليبس آلة إزالة الشعر السلكية 15 فولت إعدادان للسرعة، أبيض/أخضر	فيليبس	\N	\N	2026-03-18 00:17:55.905969	44	https://sbitany.com/image/cache/catalog/104-268-1959-0006-2023051794709-270x270.jpg	0	8	approved	\N	\N	\N	181	\N	\N	\N	\N	فيليبس آلة إزالة الشعر السلكية 15 فولت إعدادان للسرعة، أبيض/أخضر
213	كوركماز ماكنة تحضير القهوة 400 واط ، تحضير حتى 4 فناجين، فانيلا/ فضي.	كوركماز	\N	\N	2026-03-17 22:29:53.663661	37	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-270x270.jpg	0	8	approved	\N	\N	\N	112	\N	\N	\N	\N	كوركماز ماكنة تحضير القهوة 400 واط ، تحضير حتى 4 فناجين، فانيلا/ فضي.
214	كوركماز ماكنة تحضير القهوة 400 واط، تحضير حتى 4 فناجين، رمادي/ فضي.	كوركماز	\N	\N	2026-03-17 22:29:53.803363	37	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-270x270.jpg	0	8	approved	\N	\N	\N	112	\N	\N	\N	\N	كوركماز ماكنة تحضير القهوة 400 واط، تحضير حتى 4 فناجين، رمادي/ فضي.
215	بيسيل مكنسة كهربائية بدون كيس 1500 واط، لون أزرق/أسود.	بيسيل	\N	\N	2026-03-17 22:29:53.936356	36	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-270x270.jpg	0	8	approved	\N	\N	\N	113	\N	\N	\N	\N	بيسيل مكنسة كهربائية بدون كيس 1500 واط، لون أزرق/أسود.
231	مايديا مكنسة كهربائية برميل 1600 واط للتنظيف الرطب والجاف، فضي.	مايديا	\N	\N	2026-03-17 22:30:02.637075	36	https://sbitany.com/image/cache/catalog/113-242-1884-0007-2024072272047-270x270.jpg	0	8	approved	\N	\N	\N	128	\N	\N	\N	\N	مايديا مكنسة كهربائية برميل 1600 واط للتنظيف الرطب والجاف، فضي.
240	لافازا حبوب قهوة كريما وأروما 1 كغم	لافازا	\N	\N	2026-03-17 22:30:03.867144	37	https://sbitany.com/image/cache/catalog/113-313-2239-0002-20260111100851-270x270.jpg	0	8	approved	\N	\N	\N	135	\N	\N	\N	\N	لافازا حبوب قهوة كريما وأروما 1 كغم
247	كوركماز ماكنة تحضير القهوة 400 واط ، تحضير حتى 4 فناجين، ذهبي وردي/ فضي.	كوركماز	\N	\N	2026-03-17 22:30:04.736221	37	https://sbitany.com/image/cache/catalog/113-227-1976-0012-20220727102201-270x270.jpg	0	8	approved	\N	\N	\N	112	\N	\N	\N	\N	كوركماز ماكنة تحضير القهوة 400 واط ، تحضير حتى 4 فناجين، ذهبي وردي/ فضي.
248	بيسيل مكنسة كهربائية بدون كيس 2000 واط، بقوة شفط 273 واط، لون أسود/أحمر.	بيسيل	\N	\N	2026-03-17 22:30:04.876099	36	https://sbitany.com/image/cache/catalog/113-130-1884-0001-20201116111245-270x270.jpg	0	8	approved	\N	\N	\N	113	\N	\N	\N	\N	بيسيل مكنسة كهربائية بدون كيس 2000 واط، بقوة شفط 273 واط، لون أسود/أحمر.
257	ترست عصارة حمضيات كهربائية Twin بقدرة 90 واط لون أحمر	ترست	\N	\N	2026-03-17 22:30:11.828767	13	https://sbitany.com/image/cache/catalog/113-251-0131-0002-20230323101145-270x270.jpg	0	8	approved	\N	\N	\N	146	\N	\N	\N	\N	ترست عصارة حمضيات كهربائية Twin بقدرة 90 واط لون أحمر
295	سامسونج جهاز موبايل جالاكسي A17 سعة 256 جيجابايت، رمادي	سامسونج	\N	\N	2026-03-18 00:15:58.211292	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	8	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A17 سعة 256 جيجابايت، رمادي
296	سامسونج جهاز موبايل جالاكسي A07 سعة 64 جيجابايت، أسود	سامسونج	\N	\N	2026-03-18 00:15:58.321034	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	20	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A07 سعة 64 جيجابايت، أسود
301	سامسونج جهاز موبايل جالاكسي A36 5G، سعة 128 جيجابايت، أبيض	سامسونج	\N	\N	2026-03-18 00:15:58.861977	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	4	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A36 5G، سعة 128 جيجابايت، أبيض
305	آبل ايفون 15 سعة 128 جيجابايت أزرق	آبل	\N	\N	2026-03-18 00:15:59.291765	29	https://sbitany.com/image/cache/catalog/113-018-0129-0005-2024052291434-270x270.jpg	9	8	approved	\N	\N	\N	163	\N	\N	\N	\N	آبل ايفون 15 سعة 128 جيجابايت أزرق
311	اتش بي لابتوب Core i5 ذاكرة 8GB سعة 512GB شاشة 15.6 إنش Windows 11، فضي	اتش	\N	\N	2026-03-18 00:16:04.276257	31	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-270x270.jpg	1	8	approved	\N	\N	\N	167	\N	\N	\N	\N	اتش بي لابتوب Core i5 ذاكرة 8GB سعة 512GB شاشة 15.6 إنش Windows 11، فضي
312	اتش بي لابتوب Core i7 ذاكرة 16GB سعة 512GB شاشة 15.6 إنش Windows 11، فضي	اتش	\N	\N	2026-03-18 00:16:04.383582	31	https://sbitany.com/image/cache/catalog/102-914-0470-0007-2026022261926-270x270.jpg	0	8	approved	\N	\N	\N	167	\N	\N	\N	\N	اتش بي لابتوب Core i7 ذاكرة 16GB سعة 512GB شاشة 15.6 إنش Windows 11، فضي
313	أبل آيباد Air قياس 11 إنش بمعالج M3 سعة 256GB يدعم Wi-Fi لون رمادي فضائي	أبل	\N	\N	2026-03-18 00:16:07.699898	32	https://sbitany.com/image/cache/catalog/105-310-0034-0001-2026020381944-270x270.jpg	0	8	approved	\N	\N	\N	168	\N	\N	\N	\N	أبل آيباد Air قياس 11 إنش بمعالج M3 سعة 256GB يدعم Wi-Fi لون رمادي فضائي
314	بلاكفيو تابلت ميجا 2 سعة 256 جيجا رمادي	بلاكفيو	\N	\N	2026-03-18 00:16:07.810596	32	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	169	\N	\N	\N	\N	بلاكفيو تابلت ميجا 2 سعة 256 جيجا رمادي
315	أبل آيباد قياس 10.2 إنش بمعالج A16 سعة 128GB يدعم Wi-Fi لون فضي	أبل	\N	\N	2026-03-18 00:16:07.918008	32	https://sbitany.com/image/cache/catalog/102-111-0067-0507-20251210122431-270x270.jpg	0	8	approved	\N	\N	\N	170	\N	\N	\N	\N	أبل آيباد قياس 10.2 إنش بمعالج A16 سعة 128GB يدعم Wi-Fi لون فضي
316	بلاكفيو تابلت تاب 60 واي فاي سعة 128 جيجا رمادي	بلاكفيو	\N	\N	2026-03-18 00:16:08.031004	32	https://sbitany.com/image/cache/catalog/113-320-0133-0001-20241027123902-270x270.jpg	0	8	approved	\N	\N	\N	171	\N	\N	\N	\N	بلاكفيو تابلت تاب 60 واي فاي سعة 128 جيجا رمادي
317	بلاكفيو تابلت ميجا 2 سعة 256 جيجا أخضر	بلاكفيو	\N	\N	2026-03-18 00:16:08.136252	32	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	169	\N	\N	\N	\N	بلاكفيو تابلت ميجا 2 سعة 256 جيجا أخضر
344	تشي جهاز تصفيف الشعر AirGlam ‎1300 واط أبيض وذهبي	تشي	\N	\N	2026-03-18 00:18:04.05976	44	https://sbitany.com/image/cache/catalog/104-204-1964-0002-20251015102655-270x270.jpg	0	8	approved	\N	\N	\N	187	\N	\N	\N	\N	تشي جهاز تصفيف الشعر AirGlam ‎1300 واط أبيض وذهبي
345	تشي جهاز تمليس الشعر درجة حرارة 220 درجة مئوية، لون أسود.	تشي	\N	\N	2026-03-18 00:18:05.993062	44	https://sbitany.com/image/cache/catalog/104-204-1963-0002-20211117113944-270x270.jpg	0	8	approved	\N	\N	\N	188	\N	\N	\N	\N	تشي جهاز تمليس الشعر درجة حرارة 220 درجة مئوية، لون أسود.
346	تشي جهاز تمليس الشعر درجة حرارة 232° درجة مئوية، لون أسود.	تشي	\N	\N	2026-03-18 00:18:06.099456	44	https://sbitany.com/image/cache/catalog/104-204-1963-0002-20211117113944-270x270.jpg	0	8	approved	\N	\N	\N	188	\N	\N	\N	\N	تشي جهاز تمليس الشعر درجة حرارة 232° درجة مئوية، لون أسود.
347	براون جهاز إزالة الشعر بتقنية IPL موديل (5152) – 400,000 ومضة، أبيض وذهبي	براون	\N	\N	2026-03-18 00:18:07.91287	44	https://sbitany.com/image/cache/catalog/104-500-1965-0002-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	189	\N	\N	\N	\N	براون جهاز إزالة الشعر بتقنية IPL موديل (5152) – 400,000 ومضة، أبيض وذهبي
160	أبل محول طاقة USB-C بقدرة 20 واط	أبل	\N	\N	2026-03-17 22:29:35.453016	29	https://sbitany.com/image/cache/catalog/137-111-2234-0006-20251210122443-270x270.jpg	0	8	approved	\N	\N	\N	76	\N	\N	\N	\N	أبل محول طاقة USB-C بقدرة 20 واط
318	سامسونج ثلاجة بابين جانبية سعة 635 لتر، ماتور انفرتر موفر للكهرباء، لون معدني غير لامع	سامسونج	\N	\N	2026-03-18 00:16:54.987088	16	https://sbitany.com/image/cache/catalog/107-634-0060-0011-20251027135415-270x270.jpg	0	8	approved	\N	\N	\N	172	\N	\N	\N	\N	سامسونج ثلاجة بابين جانبية سعة 635 لتر، ماتور انفرتر موفر للكهرباء، لون معدني غير لامع
319	سيمنز ثلاجة أربع أبواب سعة 601 لتر ستانلس ستيل أسود	سيمنز	\N	\N	2026-03-18 00:16:55.094538	16	https://sbitany.com/image/cache/catalog/107-285-0060-0001-2025091582144-270x270.jpg	0	8	approved	\N	\N	\N	60	\N	\N	\N	\N	سيمنز ثلاجة أربع أبواب سعة 601 لتر ستانلس ستيل أسود
320	سامسونج ثلاجة بلت إن فريزر سفلي سعة 288 لتر، لون أبيض.	سامسونج	\N	\N	2026-03-18 00:16:55.199982	16	https://sbitany.com/image/cache/catalog/107-634-0060-0009-2025091582144-270x270.jpg	0	8	approved	\N	\N	\N	173	\N	\N	\N	\N	سامسونج ثلاجة بلت إن فريزر سفلي سعة 288 لتر، لون أبيض.
322	إل جي ثلاجة إنستافيو أربع أبواب سعة 847 لتر، ماتور انفرتر موفر للكهرباء، ستانلس اسود.	إل	\N	\N	2026-03-18 00:16:56.898483	16	https://sbitany.com/image/cache/catalog/107-230-0060-0147-20251210122432-270x270.jpg	0	8	approved	\N	\N	\N	19	\N	\N	\N	\N	إل جي ثلاجة إنستافيو أربع أبواب سعة 847 لتر، ماتور انفرتر موفر للكهرباء، ستانلس اسود.
321	إل جي ثلاجة سعة 656 لتر، ماتور انفرتر موفر للكهرباء، لون فضي.	إل	\N	\N	2026-03-18 00:16:55.30918	16	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-270x270.jpg	12	8	approved	\N	\N	\N	6	\N	\N	\N	\N	إل جي ثلاجة سعة 656 لتر، ماتور انفرتر موفر للكهرباء، لون فضي.
165	يوفي متعقب الذكي	يوفي	\N	\N	2026-03-17 22:29:36.008862	29	https://sbitany.com/image/cache/catalog/137-203-2562-0001-2025051455625-270x270.jpg	0	8	approved	\N	\N	\N	80	\N	\N	\N	\N	يوفي متعقب الذكي
169	أنكر باور بانك MagGO 5000 مللي أمبير 7.5 واط أسود	أنكر	\N	\N	2026-03-17 22:29:36.553933	29	https://sbitany.com/image/cache/catalog/137-203-1331-0005-20251125114103-270x270.jpg	0	8	approved	\N	\N	\N	83	\N	\N	\N	\N	أنكر باور بانك MagGO 5000 مللي أمبير 7.5 واط أسود
358	غرونديغ جهاز تمليس الشعر بتقنية (Ion)، درجة حرارة 160-220 درجة مئوية، أسود/فضي.	غرونديغ	\N	\N	2026-03-18 00:18:26.895467	44	https://sbitany.com/image/cache/catalog/104-191-1963-0003-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	198	\N	\N	\N	\N	غرونديغ جهاز تمليس الشعر بتقنية (Ion)، درجة حرارة 160-220 درجة مئوية، أسود/فضي.
361	براون ماكينة حلاقة الشعر Series 7 Styler لون أسود وأزرق	براون	\N	\N	2026-03-18 00:18:30.416698	44	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	190	\N	\N	\N	\N	براون ماكينة حلاقة الشعر Series 7 Styler لون أسود وأزرق
379	سوني بلايستيشن 5 إصدار Standard سعة 1 تيرابايت  E Chasis، أبيض.	سوني	\N	\N	2026-03-18 00:18:56.762763	13	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-270x270.jpg	1	8	approved	\N	\N	\N	210	\N	\N	\N	\N	سوني بلايستيشن 5 إصدار Standard سعة 1 تيرابايت  E Chasis، أبيض.
348	براون ماكينة حلاقة الشعر Series 3 Styler لون أسود	براون	\N	\N	2026-03-18 00:18:09.440136	44	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	190	\N	\N	\N	\N	براون ماكينة حلاقة الشعر Series 3 Styler لون أسود
349	براون ماكينة حلاقة للجسم لون رمادي	براون	\N	\N	2026-03-18 00:18:11.059442	48	https://sbitany.com/image/cache/catalog/104-500-1957-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	191	\N	\N	\N	\N	براون ماكينة حلاقة للجسم لون رمادي
352	براون ماكينة حلاقة Series 3 لون أزرق وأسود	براون	\N	\N	2026-03-18 00:18:18.811441	48	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	194	\N	\N	\N	\N	براون ماكينة حلاقة Series 3 لون أزرق وأسود
353	فيليبس ماكينة حلاقة متعددة الاستخدام 6 في 1، لون اسود.	فيليبس	\N	\N	2026-03-18 00:18:20.569019	48	https://sbitany.com/image/cache/catalog/113-268-1535-0002-2020112483209-270x270.jpg	0	8	approved	\N	\N	\N	195	\N	\N	\N	\N	فيليبس ماكينة حلاقة متعددة الاستخدام 6 في 1، لون اسود.
355	تشي جهاز تمليس الشعر درجة حرارة 220 درجة مئوية، أسود.	تشي	\N	\N	2026-03-18 00:18:22.553514	44	https://sbitany.com/image/cache/catalog/104-204-1963-0002-20211117113944-270x270.jpg	0	8	approved	\N	\N	\N	188	\N	\N	\N	\N	تشي جهاز تمليس الشعر درجة حرارة 220 درجة مئوية، أسود.
356	تشي فرشاة شعر حرارية  4 في 1 متعددة الوظائف، أسود.	تشي	\N	\N	2026-03-18 00:18:25.13944	44	https://sbitany.com/image/cache/catalog/104-204-1960-0001-2025012971438-270x270.jpg	0	8	approved	\N	\N	\N	196	\N	\N	\N	\N	تشي فرشاة شعر حرارية  4 في 1 متعددة الوظائف، أسود.
364	براون ماكينة حلاقة الشعر Series 5 Styler لون أسود ورمادي	براون	\N	\N	2026-03-18 00:18:33.799189	44	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	190	\N	\N	\N	\N	براون ماكينة حلاقة الشعر Series 5 Styler لون أسود ورمادي
365	شّارك مجفف شعر، 3 إعدادات للسرعة، كريمي.	شّارك	\N	\N	2026-03-18 00:18:35.655644	44	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	202	\N	\N	\N	\N	شّارك مجفف شعر، 3 إعدادات للسرعة، كريمي.
367	فيليبس ماكينة حلاقة متعددة الاستخدامات 11 في 1 للوجه والشعر والجسم، لون رمادي.	فيليبس	\N	\N	2026-03-18 00:18:37.757988	44	https://sbitany.com/image/cache/catalog/113-268-1535-0002-2020112483209-270x270.jpg	0	8	approved	\N	\N	\N	195	\N	\N	\N	\N	فيليبس ماكينة حلاقة متعددة الاستخدامات 11 في 1 للوجه والشعر والجسم، لون رمادي.
369	تشي مجفف شعر لافا برو، 3 إعدادات للسرعة، أسود.	تشي	\N	\N	2026-03-18 00:18:39.531929	44	https://sbitany.com/image/cache/catalog/104-204-1955-0001-2025012971438-270x270.jpg	0	8	approved	\N	\N	\N	204	\N	\N	\N	\N	تشي مجفف شعر لافا برو، 3 إعدادات للسرعة، أسود.
370	دايسون مصفف الشعر إيرراب (HS08) للشعر الكيرلي والملفوف 1300 واط، فيروزي.	دايسون	\N	\N	2026-03-18 00:18:41.328359	44	https://sbitany.com/image/cache/catalog/104-853-0139-0001-20251027135215-270x270.jpg	0	8	approved	\N	\N	\N	200	\N	\N	\N	\N	دايسون مصفف الشعر إيرراب (HS08) للشعر الكيرلي والملفوف 1300 واط، فيروزي.
373	دريمي مجفف شعر غلوري 110,000 دورة في الدقيق، تقنية (Ionic)، زهري.	دريمي	\N	\N	2026-03-18 00:18:44.710303	44	https://sbitany.com/image/cache/catalog/104-102-1955-0002-2024010283350-270x270.jpg	0	8	approved	\N	\N	\N	205	\N	\N	\N	\N	دريمي مجفف شعر غلوري 110,000 دورة في الدقيق، تقنية (Ionic)، زهري.
375	تشي مصفف الشعر لافا سيراميك درجة حرارة تصل إلى 210℃، أسود	تشي	\N	\N	2026-03-18 00:18:48.195781	44	https://sbitany.com/image/cache/catalog/104-204-1964-0001-2025012971438-270x270.jpg	0	8	approved	\N	\N	\N	206	\N	\N	\N	\N	تشي مصفف الشعر لافا سيراميك درجة حرارة تصل إلى 210℃، أسود
381	سوني بلايستيشن 5 إصدار Digital سعة 825 جيجابايت  E Chasis، أبيض.	سوني	\N	\N	2026-03-18 00:18:56.987855	13	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-270x270.jpg	1	8	approved	\N	\N	\N	210	\N	\N	\N	\N	سوني بلايستيشن 5 إصدار Digital سعة 825 جيجابايت  E Chasis، أبيض.
380	إيزو حامل جداري لجهاز بلايستيشن 5 لون أبيض	إيزو	\N	\N	2026-03-18 00:18:56.876655	13	https://sbitany.com/image/cache/catalog/103-171-8122-0001-2026021974437-270x270.jpg	0	8	approved	\N	\N	\N	211	\N	\N	\N	\N	إيزو حامل جداري لجهاز بلايستيشن 5 لون أبيض
281	ساوندكور سماعات أذن لاسلكية Liberty 5 بخاصية إلغاء الضجيج لون أبيض	ساوندكور	\N	\N	2026-03-18 00:02:02.176196	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية Liberty 5 بخاصية إلغاء الضجيج لون أبيض
181	أنكر حامل مبايل للسيارة مع قاعدة معدنية لون أسود.	أنكر	\N	\N	2026-03-17 22:29:41.581276	29	https://sbitany.com/image/cache/catalog/137-203-8131-0001-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	91	\N	\N	\N	\N	أنكر حامل مبايل للسيارة مع قاعدة معدنية لون أسود.
283	أبل سماعات AirPods Pro الجيل الثالث لون أبيض	أبل	\N	\N	2026-03-18 00:02:04.275476	29	https://sbitany.com/image/cache/catalog/137-111-8046-0002-20251210122451-270x270.jpg	0	8	approved	\N	\N	\N	90	\N	\N	\N	\N	أبل سماعات AirPods Pro الجيل الثالث لون أبيض
286	ساوندكور سماعات أذن لاسلكية R50i أسود	ساوندكور	\N	\N	2026-03-18 00:02:05.034584	29	https://sbitany.com/image/cache/catalog/137-294-1720-0003-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	87	\N	\N	\N	\N	ساوندكور سماعات أذن لاسلكية R50i أسود
309	إتش بي لابتوب ألعاب فكتوس Core i7، رام 16 جيجابايت، سعة 1 تيرابايت SSD، كرت RTX 8 جيجابايت، شاشة 15.6 بوصة 144 هرتز، ميكا فضي.	إتش	\N	\N	2026-03-18 00:16:04.056766	31	https://sbitany.com/image/cache/catalog/102-914-0470-0004-2025111672114-270x270.jpg	0	8	approved	\N	\N	\N	165	\N	\N	\N	\N	إتش بي لابتوب ألعاب فكتوس Core i7، رام 16 جيجابايت، سعة 1 تيرابايت SSD، كرت RTX 8 جيجابايت، شاشة 15.6 بوصة 144 هرتز، ميكا فضي.
328	كاريرا آلة ازالة الشعر اللاسلكية، وقت الاستخدام يصل إلى 45 دقيقة، أبيض/ ذهبي وردي.	كاريرا	\N	\N	2026-03-18 00:17:47.065812	44	https://sbitany.com/image/cache/catalog/104-018-1959-0002-20230315134927-270x270.jpg	0	8	approved	\N	\N	\N	176	\N	\N	\N	\N	كاريرا آلة ازالة الشعر اللاسلكية، وقت الاستخدام يصل إلى 45 دقيقة، أبيض/ ذهبي وردي.
330	فيلبس جهاز تمليس الشعر درجة حرارة 230 درجة مئوية، لون أسود.	فيلبس	\N	\N	2026-03-18 00:17:48.794622	44	https://sbitany.com/image/cache/catalog/104-268-1963-0002-20230928120506-270x270.jpg	0	8	approved	\N	\N	\N	178	\N	\N	\N	\N	فيلبس جهاز تمليس الشعر درجة حرارة 230 درجة مئوية، لون أسود.
331	فيليبس ماكينة حلاقة ون بلايد قابلة لاعادة الشحن، للاستخدام الرطب والجاف مشط 5 في 1 قابل للتعديل، لون أخضر لومي/رمادي.	فيليبس	\N	\N	2026-03-18 00:17:48.901455	48	https://sbitany.com/image/cache/catalog/104-268-1969-0002-20230928120506-270x270.jpg	0	8	approved	\N	\N	\N	179	\N	\N	\N	\N	فيليبس ماكينة حلاقة ون بلايد قابلة لاعادة الشحن، للاستخدام الرطب والجاف مشط 5 في 1 قابل للتعديل، لون أخضر لومي/رمادي.
332	كاريرا مموج شعر بدرجة حرارة 210 درجة مئوية، لون رمادي/ذهبي وردي.	كاريرا	\N	\N	2026-03-18 00:17:50.708229	44	https://sbitany.com/image/cache/catalog/104-018-2680-0001-20230315134934-270x270.jpg	0	8	approved	\N	\N	\N	180	\N	\N	\N	\N	كاريرا مموج شعر بدرجة حرارة 210 درجة مئوية، لون رمادي/ذهبي وردي.
354	براون ماكينة حلاقة Series 6 لون أزرق وأسود	براون	\N	\N	2026-03-18 00:18:20.677288	48	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	194	\N	\N	\N	\N	براون ماكينة حلاقة Series 6 لون أزرق وأسود
357	كاريرا مجفف شعر 2200 واط مع تقنية (Ionic)، 3 إعدادات للسرعة، لون رمادي/ذهبي وردي.	كاريرا	\N	\N	2026-03-18 00:18:25.246984	44	https://sbitany.com/image/cache/catalog/104-018-1955-0005-20230315134927-270x270.jpg	0	8	approved	\N	\N	\N	197	\N	\N	\N	\N	كاريرا مجفف شعر 2200 واط مع تقنية (Ionic)، 3 إعدادات للسرعة، لون رمادي/ذهبي وردي.
303	سامسونج جهاز موبايل جالاكسي A56 5G، سعة 256 جيجابايت، رمادي	سامسونج	\N	\N	2026-03-18 00:15:59.074303	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	5	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A56 5G، سعة 256 جيجابايت، رمادي
300	سامسونج جهاز موبايل جالاكسي A07 سعة 64 جيجابايت، أخضر	سامسونج	\N	\N	2026-03-18 00:15:58.751868	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	3	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A07 سعة 64 جيجابايت، أخضر
299	سامسونج جهاز موبايل جالاكسي A07 سعة 128 جيجابايت، أخضر	سامسونج	\N	\N	2026-03-18 00:15:58.642288	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	13	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A07 سعة 128 جيجابايت، أخضر
297	سامسونج جهاز موبايل جالاكسي A56 5G، سعة 128 جيجابايت، رمادي	سامسونج	\N	\N	2026-03-18 00:15:58.428918	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	8	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A56 5G، سعة 128 جيجابايت، رمادي
304	سامسونج جهاز موبايل جالاكسي A56 5G، سعة 256 جيجابايت، زيتي	سامسونج	\N	\N	2026-03-18 00:15:59.18246	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	9	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A56 5G، سعة 256 جيجابايت، زيتي
298	أبل آيفون 17 برو ماكس سعة 256 جيجابايت لون فضي	أبل	\N	\N	2026-03-18 00:15:58.536606	29	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-270x270.jpg	3	8	approved	\N	\N	\N	162	\N	\N	\N	\N	أبل آيفون 17 برو ماكس سعة 256 جيجابايت لون فضي
194	أنكر باور بانك ‎10000 مللي أمبير أسود	أنكر	\N	\N	2026-03-17 22:29:43.111829	29	https://sbitany.com/image/cache/catalog/137-203-1331-0007-20251015102655-270x270.jpg	0	8	approved	\N	\N	\N	98	\N	\N	\N	\N	أنكر باور بانك ‎10000 مللي أمبير أسود
204	كاريرا طنجرة ضغط كهربائية سعة 8 لتر بقدرة 1200 واط، لون معدني رمادي.	كاريرا	\N	\N	2026-03-17 22:29:52.455998	13	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-270x270.jpg	0	8	approved	\N	\N	\N	105	\N	\N	\N	\N	كاريرا طنجرة ضغط كهربائية سعة 8 لتر بقدرة 1200 واط، لون معدني رمادي.
206	كاريرا مقلى هوائي 1400 واط، سعة 4 لتر، أسود / وردي ذهبي.	كاريرا	\N	\N	2026-03-17 22:29:52.748908	13	https://sbitany.com/image/cache/catalog/113-018-1717-0008-20231121145135-270x270.jpg	0	8	approved	\N	\N	\N	107	\N	\N	\N	\N	كاريرا مقلى هوائي 1400 واط، سعة 4 لتر، أسود / وردي ذهبي.
207	كاريرا طنجرة ضغط كهربائية سعة 10 لتر بقدرة 1400 واط، لون معدني رمادي.	كاريرا	\N	\N	2026-03-17 22:29:52.885509	13	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-270x270.jpg	0	8	approved	\N	\N	\N	105	\N	\N	\N	\N	كاريرا طنجرة ضغط كهربائية سعة 10 لتر بقدرة 1400 واط، لون معدني رمادي.
208	يونيفرسال شواية كهربائية 1700 واط 8 لتر، ستانلس ستيل.	يونيفرسال	\N	\N	2026-03-17 22:29:53.027638	40	https://sbitany.com/image/cache/catalog/113-320-0133-0001-20241027123902-270x270.jpg	0	8	approved	\N	\N	\N	108	\N	\N	\N	\N	يونيفرسال شواية كهربائية 1700 واط 8 لتر، ستانلس ستيل.
209	كاريرا طنجرة ضغط كهربائية سعة 12 لتر بقدرة 1600 واط، لون معدني رمادي.	كاريرا	\N	\N	2026-03-17 22:29:53.168009	13	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-270x270.jpg	0	8	approved	\N	\N	\N	105	\N	\N	\N	\N	كاريرا طنجرة ضغط كهربائية سعة 12 لتر بقدرة 1600 واط، لون معدني رمادي.
210	كاريرا عجانة 800 واط، وعاء سعته 6 لتر، رمادي/ وردي ذهبي.	كاريرا	\N	\N	2026-03-17 22:29:53.304758	39	https://sbitany.com/image/cache/catalog/113-018-0129-0007-20241027104209-270x270.jpg	0	8	approved	\N	\N	\N	109	\N	\N	\N	\N	كاريرا عجانة 800 واط، وعاء سعته 6 لتر، رمادي/ وردي ذهبي.
211	كاريرا عجانة 1100 واط، وعاء سعته 5.6 لتر، رمادي/ وردي ذهبي.	كاريرا	\N	\N	2026-03-17 22:29:53.418413	39	https://sbitany.com/image/cache/catalog/113-018-0129-0005-2024052291434-270x270.jpg	0	8	approved	\N	\N	\N	110	\N	\N	\N	\N	كاريرا عجانة 1100 واط، وعاء سعته 5.6 لتر، رمادي/ وردي ذهبي.
218	بيسيل شامبو بتركيبة متعددة الاستخدام للأسطح حجم 1 لتر لون أبيض.	بيسيل	\N	\N	2026-03-17 22:29:54.358915	36	https://sbitany.com/image/cache/catalog/113-130-0580-0003-2021100561013-270x270.jpg	0	8	approved	\N	\N	\N	116	\N	\N	\N	\N	بيسيل شامبو بتركيبة متعددة الاستخدام للأسطح حجم 1 لتر لون أبيض.
220	بيسيل شامبو سبوت اند ستاين لتنظيف السجاد وازالة البقع والانتعاش برائحة عطرة.	بيسيل	\N	\N	2026-03-17 22:29:54.620058	36	https://sbitany.com/image/cache/catalog/113-130-0580-0005-20221108140845-270x270.jpg	0	8	approved	\N	\N	\N	118	\N	\N	\N	\N	بيسيل شامبو سبوت اند ستاين لتنظيف السجاد وازالة البقع والانتعاش برائحة عطرة.
228	بيسيل جهاز تنظيف السجاد PowerClean 2X، أسود وأزرق	بيسيل	\N	\N	2026-03-17 22:30:02.309303	36	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	125	\N	\N	\N	\N	بيسيل جهاز تنظيف السجاد PowerClean 2X، أسود وأزرق
376	اتش بي طابعة Smart Tank 580 متعددة الوظائف لاسلكية بحبر خزان – رمادي بازلتي	اتش	\N	\N	2026-03-18 00:18:53.181048	56	https://sbitany.com/image/cache/catalog/105-341-0061-0009-2025060272319-270x270.jpg	0	8	approved	\N	\N	\N	207	\N	\N	\N	\N	اتش بي طابعة Smart Tank 580 متعددة الوظائف لاسلكية بحبر خزان – رمادي بازلتي
377	اتش بي طابعة ليزر LaserJet MFP M141w متعددة الوظائف أحادية اللون لاسلكية – أبيض	اتش	\N	\N	2026-03-18 00:18:53.297114	56	https://sbitany.com/image/cache/catalog/111-914-2818-0001-20250820101827-270x270.jpg	0	8	approved	\N	\N	\N	208	\N	\N	\N	\N	اتش بي طابعة ليزر LaserJet MFP M141w متعددة الوظائف أحادية اللون لاسلكية – أبيض
378	اتش بي طابعة OfficeJet Pro 8133 متعددة الوظائف لاسلكية مع شاشة لمس - رمادي خرساني	اتش	\N	\N	2026-03-18 00:18:53.405953	56	https://sbitany.com/image/cache/catalog/111-914-0207-0001-20250820101827-270x270.jpg	0	8	approved	\N	\N	\N	209	\N	\N	\N	\N	اتش بي طابعة OfficeJet Pro 8133 متعددة الوظائف لاسلكية مع شاشة لمس - رمادي خرساني
382	سوني وحدة تحكم دوال سينس بلاي ستيشن 5، أبيض	سوني	\N	\N	2026-03-18 00:18:57.10926	13	https://sbitany.com/image/cache/catalog/103-305-0279-0031-20240205105654-270x270.jpg	0	8	approved	\N	\N	\N	212	\N	\N	\N	\N	سوني وحدة تحكم دوال سينس بلاي ستيشن 5، أبيض
244	بيسيل جهاز تنظيف السجاد تقنية الرش الفوري 800 واط، أسود وأزرق	بيسيل	\N	\N	2026-03-17 22:30:04.359322	36	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	125	\N	\N	\N	\N	بيسيل جهاز تنظيف السجاد تقنية الرش الفوري 800 واط، أسود وأزرق
246	بيسيل جهاز تنظيف السجاد والمفروشات سبوت كلين 750 واط، بقوة البخار، أسود/ذهبي وردي.	بيسيل	\N	\N	2026-03-17 22:30:04.627996	36	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	125	\N	\N	\N	\N	بيسيل جهاز تنظيف السجاد والمفروشات سبوت كلين 750 واط، بقوة البخار، أسود/ذهبي وردي.
249	فيليبس أقراص إزالة الشحوم	فيليبس	\N	\N	2026-03-17 22:30:05.125944	13	https://sbitany.com/image/cache/catalog/113-268-8128-0001-20251224114859-270x270.jpg	0	8	approved	\N	\N	\N	139	\N	\N	\N	\N	فيليبس أقراص إزالة الشحوم
252	ترست شامبو سجاد بسعة 4 لتر.	ترست	\N	\N	2026-03-17 22:30:11.129109	36	https://sbitany.com/image/cache/catalog/113-251-0580-0001-2025112682336-270x270.jpg	0	8	approved	\N	\N	\N	142	\N	\N	\N	\N	ترست شامبو سجاد بسعة 4 لتر.
326	فيليبس جهاز تمليس الشعر بتقنية ThermoShield، درجة حرارة تصل إلى 230 درجة مئوية، لون بترولي.	فيليبس	\N	\N	2026-03-18 00:17:45.009733	44	https://sbitany.com/image/cache/catalog/104-268-1963-0001-20220331112209-270x270.jpg	0	8	approved	\N	\N	\N	174	\N	\N	\N	\N	فيليبس جهاز تمليس الشعر بتقنية ThermoShield، درجة حرارة تصل إلى 230 درجة مئوية، لون بترولي.
253	فيليبس فلتر مياه AquaClean، أبيض	فيليبس	\N	\N	2026-03-17 22:30:11.239062	13	https://sbitany.com/image/cache/catalog/113-268-0331-0001-20251224114852-270x270.jpg	0	8	approved	\N	\N	\N	143	\N	\N	\N	\N	فيليبس فلتر مياه AquaClean، أبيض
256	ترست عجانة يدوية 250 وط أسود	ترست	\N	\N	2026-03-17 22:30:11.718572	39	https://sbitany.com/image/cache/catalog/113-251-0128-0002-20240415135050-270x270.jpg	0	8	approved	\N	\N	\N	145	\N	\N	\N	\N	ترست عجانة يدوية 250 وط أسود
261	ترست جهاز وافل 5 في 1 بقدرة 800 واط لون أسود	ترست	\N	\N	2026-03-17 22:30:12.264907	40	https://sbitany.com/image/cache/catalog/105-251-0034-0001-20250916130401-270x270.jpg	0	8	approved	\N	\N	\N	150	\N	\N	\N	\N	ترست جهاز وافل 5 في 1 بقدرة 800 واط لون أسود
263	ترست مفرمة لحم متعددة الاستخدام Elite بقدرة 800 واط لون أسود	ترست	\N	\N	2026-03-17 22:30:12.508715	39	https://sbitany.com/image/cache/catalog/113-251-0441-0002-2026020381944-270x270.jpg	0	8	approved	\N	\N	\N	152	\N	\N	\N	\N	ترست مفرمة لحم متعددة الاستخدام Elite بقدرة 800 واط لون أسود
264	ترست مفرمة لحم متعددة الاستخدام بقدرة 600 واط لون أسود وفضي	ترست	\N	\N	2026-03-17 22:30:12.616928	39	https://sbitany.com/image/cache/catalog/113-251-0441-0002-2026020381944-270x270.jpg	0	8	approved	\N	\N	\N	152	\N	\N	\N	\N	ترست مفرمة لحم متعددة الاستخدام بقدرة 600 واط لون أسود وفضي
265	E-Plug عصارة حمضيات كهربائية سعة 750 مل لون أسود	E-Plug	\N	\N	2026-03-17 22:30:12.72953	13	https://sbitany.com/image/cache/catalog/113-273-0131-0001-20260311120410-270x270.jpg	0	8	approved	\N	\N	\N	153	\N	\N	\N	\N	E-Plug عصارة حمضيات كهربائية سعة 750 مل لون أسود
266	ترست ميزان مطبخ رقمي زجاجي حتى 10 كغ لون أبيض	ترست	\N	\N	2026-03-17 22:30:12.83925	13	https://sbitany.com/image/cache/catalog/113-251-1440-0005-2026020381944-270x270.jpg	0	8	approved	\N	\N	\N	154	\N	\N	\N	\N	ترست ميزان مطبخ رقمي زجاجي حتى 10 كغ لون أبيض
270	ترست توستر ضغط 2000 واط، بسطح زجاجي اسود	ترست	\N	\N	2026-03-17 22:30:13.287644	40	https://sbitany.com/image/cache/catalog/113-251-0123-0009-20240912123042-270x270.jpg	0	8	approved	\N	\N	\N	158	\N	\N	\N	\N	ترست توستر ضغط 2000 واط، بسطح زجاجي اسود
271	بيسيل جهاز تنظيف السجاد والمفروشات سبوت كلين 330 واط، سلكي، متعدد الاستخدامات، لون أسود/أحمر.	بيسيل	\N	\N	2026-03-17 22:30:13.407703	36	https://sbitany.com/image/cache/catalog/113-130-0115-0020-20260311120355-270x270.jpg	0	8	approved	\N	\N	\N	125	\N	\N	\N	\N	بيسيل جهاز تنظيف السجاد والمفروشات سبوت كلين 330 واط، سلكي، متعدد الاستخدامات، لون أسود/أحمر.
350	تشي مموج شعر بدرجة حرارة 210 درجة مئوية، ازرق.	تشي	\N	\N	2026-03-18 00:18:16.990789	44	https://sbitany.com/image/cache/catalog/104-204-2680-0001-2025012971438-270x270.jpg	0	8	approved	\N	\N	\N	192	\N	\N	\N	\N	تشي مموج شعر بدرجة حرارة 210 درجة مئوية، ازرق.
351	فيليبس آلة ازالة الشعر اللاسلكية للاستخدام الرطب والجاف، وقت الاستخدام يصل إلى 40 دقيقة، +3 ملحقات لون أبيض	فيليبس	\N	\N	2026-03-18 00:18:17.103801	44	https://sbitany.com/image/cache/catalog/104-268-1959-0002-80-20210117102039-270x270.jpg	0	8	approved	\N	\N	\N	193	\N	\N	\N	\N	فيليبس آلة ازالة الشعر اللاسلكية للاستخدام الرطب والجاف، وقت الاستخدام يصل إلى 40 دقيقة، +3 ملحقات لون أبيض
277	ترست ميزان مطبخ رقمي زجاجي حتى 10 كغ لون أخضر	ترست	\N	\N	2026-03-17 22:30:19.640077	13	https://sbitany.com/image/cache/catalog/113-251-1440-0005-2026020381944-270x270.jpg	0	8	approved	\N	\N	\N	154	\N	\N	\N	\N	ترست ميزان مطبخ رقمي زجاجي حتى 10 كغ لون أخضر
47	إل جي ثلاجة أربع أبواب سعة 530 لتر، ماتور انفرتر موفر للكهرباء، فضي.	إل	\N	\N	2026-03-17 22:28:49.766733	16	https://sbitany.com/image/cache/catalog/107-230-0060-0140-20250520123741-270x270.jpg	0	8	approved	\N	\N	\N	13	\N	\N	\N	\N	إل جي ثلاجة أربع أبواب سعة 530 لتر، ماتور انفرتر موفر للكهرباء، فضي.
58	مايديا فريزر 7 جوارير، سعة 240 لتر، نظام تبريد هوائي، ستانلس ستيل.	مايديا	\N	\N	2026-03-17 22:28:55.689309	16	https://sbitany.com/image/cache/catalog/113-242-0124-0024-20201112104254-270x270.jpg	0	8	approved	\N	\N	\N	18	\N	\N	\N	\N	مايديا فريزر 7 جوارير، سعة 240 لتر، نظام تبريد هوائي، ستانلس ستيل.
38	إل جي ثلاجة سعة 515 لتر، ماتور انفرتر موفر للكهرباء، لون فضي.	إل	\N	\N	2026-03-17 22:28:48.271115	16	https://sbitany.com/image/cache/catalog/107-230-0060-0128-20240415135037-270x270.jpg	5	8	approved	\N	\N	\N	6	\N	\N	\N	\N	إل جي ثلاجة سعة 515 لتر، ماتور انفرتر موفر للكهرباء، لون فضي.
363	فيليبس جهاز إزالة الشعر بتقنية IPL ‎250,000 ومضة أبيض	فيليبس	\N	\N	2026-03-18 00:18:32.085742	44	https://sbitany.com/image/cache/catalog/104-268-1307-0001-20251015102655-270x270.jpg	4	8	approved	\N	\N	\N	201	\N	\N	\N	\N	فيليبس جهاز إزالة الشعر بتقنية IPL ‎250,000 ومضة أبيض
60	إل جي ثلاجة إنستافيو فريزر سفلي سعة 349 لتر، ماتور انفرتر موفر للكهرباء، ستانلس أسود.	إل	\N	\N	2026-03-17 22:28:55.961887	16	https://sbitany.com/image/cache/catalog/107-230-0060-0147-20251210122432-270x270.jpg	0	8	approved	\N	\N	\N	19	\N	\N	\N	\N	إل جي ثلاجة إنستافيو فريزر سفلي سعة 349 لتر، ماتور انفرتر موفر للكهرباء، ستانلس أسود.
65	أف جي ثلاجة بلت إن فريزر سفلي سعة 247 لتر، فتح الباب من اليمين، لون أبيض.	أف	\N	\N	2026-03-17 22:28:56.533677	16	https://sbitany.com/image/cache/catalog/107-214-0060-0003-2022033051328-270x270.jpg	0	8	approved	\N	\N	\N	23	\N	\N	\N	\N	أف جي ثلاجة بلت إن فريزر سفلي سعة 247 لتر، فتح الباب من اليمين، لون أبيض.
371	براون جهاز إزالة الشعر بتقنية IPL الذكي موديل (5052) – 400,000 ومضة، أبيض وذهبي	براون	\N	\N	2026-03-18 00:18:41.439801	44	https://sbitany.com/image/cache/catalog/104-500-1965-0002-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	189	\N	\N	\N	\N	براون جهاز إزالة الشعر بتقنية IPL الذكي موديل (5052) – 400,000 ومضة، أبيض وذهبي
360	ماكينة حلاقة من فيليبس لاسلكية للاستخدام الرطب والجاف 40 دقيقة من الحلاقة و 8 ساعات شحن لون ازرق و اسود	ماكينة	\N	\N	2026-03-18 00:18:30.306206	48	https://sbitany.com/image/cache/catalog/104-268-0141-0001-20241225111152-270x270.jpg	0	8	approved	\N	\N	\N	199	\N	\N	\N	\N	ماكينة حلاقة من فيليبس لاسلكية للاستخدام الرطب والجاف 40 دقيقة من الحلاقة و 8 ساعات شحن لون ازرق و اسود
372	براون ماكينة حلاقة Series 9 لون أسود	براون	\N	\N	2026-03-18 00:18:43.154044	48	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	0	8	approved	\N	\N	\N	194	\N	\N	\N	\N	براون ماكينة حلاقة Series 9 لون أسود
359	براون ماكينة حلاقة Series 5 لون أزرق وأسود	براون	\N	\N	2026-03-18 00:18:28.765142	48	https://sbitany.com/image/cache/catalog/104-500-1961-0001-2026011184245-270x270.jpg	1	8	approved	\N	\N	\N	194	\N	\N	\N	\N	براون ماكينة حلاقة Series 5 لون أزرق وأسود
368	ميدكس كير جهاز تدفق ماء للأسنان، 280 مل، أبيض	ميدكس	\N	\N	2026-03-18 00:18:37.867395	13	https://sbitany.com/image/cache/catalog/151-290-8109-0001-2025091582215-270x270.jpg	0	8	approved	\N	\N	\N	203	\N	\N	\N	\N	ميدكس كير جهاز تدفق ماء للأسنان، 280 مل، أبيض
335	أورال-بي فرشاة أسنان كهربائية Vitality Pro لون أسود	أورال-بي	\N	\N	2026-03-18 00:17:54.485783	13	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-270x270.jpg	0	8	approved	\N	\N	\N	183	\N	\N	\N	\N	أورال-بي فرشاة أسنان كهربائية Vitality Pro لون أسود
337	أورال-بي فرشاة أسنان كهربائية Vitality Frozen لون أزرق	أورال-بي	\N	\N	2026-03-18 00:17:56.01732	13	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-270x270.jpg	0	8	approved	\N	\N	\N	183	\N	\N	\N	\N	أورال-بي فرشاة أسنان كهربائية Vitality Frozen لون أزرق
338	أورال-بي فرشاة أسنان كهربائية Vitality Spiderman لون أزرق	أورال-بي	\N	\N	2026-03-18 00:17:57.603798	13	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-270x270.jpg	0	8	approved	\N	\N	\N	183	\N	\N	\N	\N	أورال-بي فرشاة أسنان كهربائية Vitality Spiderman لون أزرق
340	أورال-بي فرشاة أسنان كهربائية iO Series 5 لون أسود	أورال-بي	\N	\N	2026-03-18 00:18:00.59619	13	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-270x270.jpg	0	8	approved	\N	\N	\N	183	\N	\N	\N	\N	أورال-بي فرشاة أسنان كهربائية iO Series 5 لون أسود
341	أورال-بي فرشاة أسنان كهربائية iO Series 2 لون أسود	أورال-بي	\N	\N	2026-03-18 00:18:02.173212	13	https://sbitany.com/image/cache/catalog/104-844-1974-0001-2026011185440-270x270.jpg	0	8	approved	\N	\N	\N	183	\N	\N	\N	\N	أورال-بي فرشاة أسنان كهربائية iO Series 2 لون أسود
50	إل جي نشافة سعة 9 كغم، نظام مضخة حرارية موفر للكهرباء، 14 برنامج، أسود.	إل	\N	\N	2026-03-17 22:28:50.187331	19	https://sbitany.com/image/cache/catalog/107-230-0017-0019-20240609125742-270x270.jpg	0	8	approved	\N	\N	\N	15	\N	\N	\N	\N	إل جي نشافة سعة 9 كغم، نظام مضخة حرارية موفر للكهرباء، 14 برنامج، أسود.
70	هوفر نشافة سعة 9 كغم، نظام مكثف داخلي، فضي.	هوفر	\N	\N	2026-03-17 22:28:57.13766	19	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	0	8	approved	\N	\N	\N	26	\N	\N	\N	\N	هوفر نشافة سعة 9 كغم، نظام مكثف داخلي، فضي.
63	سامسونج نشافة سعة 9 كغم، نظام مضخة حرارية موفر للكهرباء، 14 برنامج، أسود.	سامسونج	\N	\N	2026-03-17 22:28:56.317189	19	https://sbitany.com/image/cache/catalog/113-242-0064-0020-20230202140010-270x270.jpg	1	8	approved	\N	\N	\N	22	\N	\N	\N	\N	سامسونج نشافة سعة 9 كغم، نظام مضخة حرارية موفر للكهرباء، 14 برنامج، أسود.
107	هوفر جلاية 8 برامج، سعة 15 طقم، 2 رفوف، رمادي.	هوفر	\N	\N	2026-03-17 22:29:10.218797	21	https://sbitany.com/image/cache/catalog/113-018-1468-0002-20251125114055-270x270.jpg	1	8	approved	\N	\N	\N	48	\N	\N	\N	\N	هوفر جلاية 8 برامج، سعة 15 طقم، 2 رفوف، رمادي.
74	سامسونج فرن بلت إن 60 سم سعة 64 لتر، 6 برامج، ستانلس ستيل	سامسونج	\N	\N	2026-03-17 22:29:01.660768	22	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	29	\N	\N	\N	\N	سامسونج فرن بلت إن 60 سم سعة 64 لتر، 6 برامج، ستانلس ستيل
84	فاير غاز برولاين فرن + ميكروويف (Combi) بلت إن 45 سم، سعة 50 لتر، 13 برنامج، أسود.	فاير	\N	\N	2026-03-17 22:29:02.989701	22	https://sbitany.com/image/cache/catalog/107-071-2667-0005-20240102114453-270x270.jpg	0	8	approved	\N	\N	\N	8	\N	\N	\N	\N	فاير غاز برولاين فرن + ميكروويف (Combi) بلت إن 45 سم، سعة 50 لتر، 13 برنامج، أسود.
93	سوتر فرن كهربائي بلت إن 60 سم، سعة 77 لتر، 12 برنامج، ستانلس ستيل.	سوتر	\N	\N	2026-03-17 22:29:04.19042	22	https://sbitany.com/image/cache/catalog/107-467-2667-0006-20260115120937-270x270.jpg	0	8	approved	\N	\N	\N	40	\N	\N	\N	\N	سوتر فرن كهربائي بلت إن 60 سم، سعة 77 لتر، 12 برنامج، ستانلس ستيل.
98	سامسونج فرن بلت إن 60 سم سعة 76 لتر، 12 برنامج، أسود	سامسونج	\N	\N	2026-03-17 22:29:09.074575	22	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	29	\N	\N	\N	\N	سامسونج فرن بلت إن 60 سم سعة 76 لتر، 12 برنامج، أسود
114	سامسونج فرن بلت إن Dual Cook سعة 76 لتر، 12 برنامج، أسود	سامسونج	\N	\N	2026-03-17 22:29:11.039858	22	https://sbitany.com/image/cache/catalog/107-634-2667-0001-2025061572758-270x270.jpg	0	8	approved	\N	\N	\N	29	\N	\N	\N	\N	سامسونج فرن بلت إن Dual Cook سعة 76 لتر، 12 برنامج، أسود
217	إل جي ميكروويف سعة 42 لتر، 1200 واط، أسود	إل	\N	\N	2026-03-17 22:29:54.218935	22	https://sbitany.com/image/cache/catalog/MH8295DIS/113-230-0064-0007-2025081382503-270x270.jpg	0	8	approved	\N	\N	\N	115	\N	\N	\N	\N	إل جي ميكروويف سعة 42 لتر، 1200 واط، أسود
37	فاير غاز هايتك طباخ غاز بلت إن 70 سم، 5 مواقد، زجاج أسود.	فاير	\N	\N	2026-03-17 22:28:48.128103	24	https://sbitany.com/image/cache/catalog/107-171-0035-0066-2023080762037-270x270.jpg	0	8	approved	\N	\N	\N	4	\N	\N	\N	\N	فاير غاز هايتك طباخ غاز بلت إن 70 سم، 5 مواقد، زجاج أسود.
223	مايديا ميكروويف سعة 24 لتر، 900 واط، 6 برامج، لون أسود.	مايديا	\N	\N	2026-03-17 22:29:54.991078	22	https://sbitany.com/image/cache/catalog/105-242-0061-0210-2025060272319-270x270.jpg	0	8	approved	\N	\N	\N	120	\N	\N	\N	\N	مايديا ميكروويف سعة 24 لتر، 900 واط، 6 برامج، لون أسود.
227	مايديا ميكروويف سعة 20 لتر، 700 واط، أسود.	مايديا	\N	\N	2026-03-17 22:29:55.51286	22	https://sbitany.com/image/cache/catalog/105-251-0034-0007-20231024132718-270x270.jpg	0	8	approved	\N	\N	\N	124	\N	\N	\N	\N	مايديا ميكروويف سعة 20 لتر، 700 واط، أسود.
85	ساوتر طباخ غاز بلت إن 90 سم، 5 مواقد، ستانلس ستيل	ساوتر	\N	\N	2026-03-17 22:29:03.098769	24	https://sbitany.com/image/cache/catalog/107-467-0035-0009-20250326121748-270x270.jpg	0	8	approved	\N	\N	\N	34	\N	\N	\N	\N	ساوتر طباخ غاز بلت إن 90 سم، 5 مواقد، ستانلس ستيل
121	سيمنز طباخ غاز بلت إن 60 سم، 4 مواقد، أسود	سيمنز	\N	\N	2026-03-17 22:29:16.092464	24	https://sbitany.com/image/cache/catalog/107-285-0035-0004-2025091582144-270x270.jpg	0	8	approved	\N	\N	\N	56	\N	\N	\N	\N	سيمنز طباخ غاز بلت إن 60 سم، 4 مواقد، أسود
130	تي سي إل تلفزيون LED فئة V6C حجم 55 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.	تي	\N	\N	2026-03-17 22:29:24.848149	34	https://sbitany.com/image/cache/catalog/130-751-0070-0103-2025080395658-270x270.jpg	1	8	approved	\N	\N	\N	64	\N	\N	\N	\N	تي سي إل تلفزيون LED فئة V6C حجم 55 بوصة 4K UHD ذكي بنظام تشغيل جوجل تي في.
141	جي تي في تلفزيون LED HD فئة 5V حجم 32 بوصة HD ذكي بنظام تشغيل VIDAA U7.	جي	\N	\N	2026-03-17 22:29:26.423838	34	https://sbitany.com/image/cache/catalog/130-307-0070-0004-20251125114055-270x270.jpg	0	8	approved	\N	\N	\N	67	\N	\N	\N	\N	جي تي في تلفزيون LED HD فئة 5V حجم 32 بوصة HD ذكي بنظام تشغيل VIDAA U7.
158	أنكر شاحن باوربورت III 20 واط أبيض	أنكر	\N	\N	2026-03-17 22:29:35.235036	50	https://sbitany.com/image/cache/catalog/137-203-1094-0002-20250820101855-270x270.jpg	0	8	approved	\N	\N	\N	74	\N	\N	\N	\N	أنكر شاحن باوربورت III 20 واط أبيض
173	أنكر كابل USB-C إلى USB-C بقدرة 240 واط لون أسود	أنكر	\N	\N	2026-03-17 22:29:37.002106	50	https://sbitany.com/image/cache/catalog/137-203-1086-0002-2025051455614-270x270.jpg	0	8	approved	\N	\N	\N	78	\N	\N	\N	\N	أنكر كابل USB-C إلى USB-C بقدرة 240 واط لون أسود
174	أنكر بنك طاقة لاسلكي MagGo سعة 10000 مللي أمبير لون أسود	أنكر	\N	\N	2026-03-17 22:29:37.109572	50	https://sbitany.com/image/cache/catalog/137-203-1331-0011-2026021974504-270x270.jpg	0	8	approved	\N	\N	\N	86	\N	\N	\N	\N	أنكر بنك طاقة لاسلكي MagGo سعة 10000 مللي أمبير لون أسود
243	سامسونج مكنسة كهربائية روبوتية لون أسود	سامسونج	\N	\N	2026-03-17 22:30:04.221198	36	https://sbitany.com/image/cache/catalog/113-634-8081-0002-2026011482151-270x270.jpg	0	8	approved	\N	\N	\N	137	\N	\N	\N	\N	سامسونج مكنسة كهربائية روبوتية لون أسود
245	شّارك مكنسة كهربائية لاسلكية DETECT PRO، أبيض.	شّارك	\N	\N	2026-03-17 22:30:04.47693	36	https://sbitany.com/image/cache/catalog/113-459-0025-0009-20241216132103-270x270.jpg	0	8	approved	\N	\N	\N	138	\N	\N	\N	\N	شّارك مكنسة كهربائية لاسلكية DETECT PRO، أبيض.
268	سيجافريدو كبسولات قهوة عدد 10*6 غرام إسبريسو.	سيجافريدو	\N	\N	2026-03-17 22:30:13.057514	37	https://sbitany.com/image/cache/catalog/448Coffeecapsule-20200901205833-270x270.png	0	8	approved	\N	\N	\N	156	\N	\N	\N	\N	سيجافريدو كبسولات قهوة عدد 10*6 غرام إسبريسو.
272	تراست غلاية، 1.5 لتر، أسود	تراست	\N	\N	2026-03-17 22:30:13.514908	42	https://sbitany.com/image/cache/catalog/113-251-0124-0009-2025091582154-270x270.jpg	1	8	approved	\N	\N	\N	159	\N	\N	\N	\N	تراست غلاية، 1.5 لتر، أسود
198	سامسونج جهاز موبايل جالاكسي A17 سعة 256 جيجابايت، أسود	سامسونج	\N	\N	2026-03-17 22:29:43.562578	29	https://sbitany.com/image/cache/catalog/109-634-0049-0447-2026022261926-270x270.jpg	21	8	approved	\N	\N	\N	102	\N	\N	\N	\N	سامسونج جهاز موبايل جالاكسي A17 سعة 256 جيجابايت، أسود
224	فيليبس خلاط سعة 1.9 لتر، 450 واط، أبيض	فيليبس	\N	\N	2026-03-17 22:29:55.138639	38	https://sbitany.com/image/cache/catalog/113-268-0127-0005-20250903130451-270x270.jpg	0	8	approved	\N	\N	\N	121	\N	\N	\N	\N	فيليبس خلاط سعة 1.9 لتر، 450 واط، أبيض
230	ترست غلاية زجاج سعة 1.7 لتر لون أسود	ترست	\N	\N	2026-03-17 22:30:02.529082	42	https://sbitany.com/image/cache/catalog/113-251-0124-0014-20260311120410-270x270.jpg	0	8	approved	\N	\N	\N	127	\N	\N	\N	\N	ترست غلاية زجاج سعة 1.7 لتر لون أسود
232	ترست غلاية زجاج سعة 1.7 لتر لون زيتي	ترست	\N	\N	2026-03-17 22:30:02.898854	42	https://sbitany.com/image/cache/catalog/113-251-0124-0014-20260311120410-270x270.jpg	0	8	approved	\N	\N	\N	127	\N	\N	\N	\N	ترست غلاية زجاج سعة 1.7 لتر لون زيتي
267	فيليبس مكواة بخار محمولة باليد 1000 واط، دفعة بخارية 20 جرام، لون أخضر.	فيليبس	\N	\N	2026-03-17 22:30:12.947484	41	https://sbitany.com/image/cache/catalog/113-268-0117-0023-20240605132023-270x270.jpg	0	8	approved	\N	\N	\N	155	\N	\N	\N	\N	فيليبس مكواة بخار محمولة باليد 1000 واط، دفعة بخارية 20 جرام، لون أخضر.
269	تراست غلاية، 1.7 لتر، أسود	تراست	\N	\N	2026-03-17 22:30:13.174457	42	https://sbitany.com/image/cache/catalog/113-251-0124-0008-2025091582154-270x270.jpg	0	8	approved	\N	\N	\N	157	\N	\N	\N	\N	تراست غلاية، 1.7 لتر، أسود
273	ترست خلاط 600 واط، سعة 1.5 لتر، أسود.	ترست	\N	\N	2026-03-17 22:30:19.194514	38	https://sbitany.com/image/cache/catalog/113-297-0632-0001-20260311120410-270x270.jpg	0	8	approved	\N	\N	\N	160	\N	\N	\N	\N	ترست خلاط 600 واط، سعة 1.5 لتر، أسود.
\.


--
-- TOC entry 5311 (class 0 OID 16500)
-- Dependencies: 234
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, product_id, rating, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5335 (class 0 OID 16842)
-- Dependencies: 258
-- Data for Name: store_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_notifications (id, store_id, type, message, link, is_read, created_at) FROM stdin;
2	2	ticket_reply	رد جديد من fikry على تذكرتك: "oooooo"	/store/dashboard/tickets/2	f	2026-03-17 02:38:05.985485
3	2	ticket_status	تم تغيير حالة تذكرتك "oooooo" إلى: مغلقة	/store/dashboard/tickets/2	f	2026-03-17 02:38:41.562969
4	1	ticket_reply	رد جديد من admin على تذكرتك: "jjjjjj"	/store/dashboard/tickets/1	t	2026-03-17 02:45:54.58268
5	1	ticket_status	تم تغيير حالة تذكرتك "jjjjjj" إلى: مغلقة	/store/dashboard/tickets/1	t	2026-03-17 03:06:17.222988
1	1	ticket_reply	رد جديد من fikry على تذكرتك: "jjjjjj"	/store/dashboard/tickets/1	t	2026-03-17 02:36:08.764417
7	1	ticket_status	تم تغيير حالة تذكرتك "lkijlnkjnb" إلى: مغلقة	/store/dashboard/tickets/3	t	2026-03-17 11:04:40.693703
6	1	ticket_status	تم تغيير حالة تذكرتك "lkijlnkjnb" إلى: قيد المتابعة	/store/dashboard/tickets/3	t	2026-03-17 11:04:39.941713
\.


--
-- TOC entry 5319 (class 0 OID 16562)
-- Dependencies: 242
-- Data for Name: store_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_reviews (id, store_id, rating, comment, created_at) FROM stdin;
1	1	5	خدمة ممتازة وأسعار تنافسية	2026-03-15 13:59:16.716874
2	1	4	التوصيل سريع والمنتجات أصلية	2026-03-15 13:59:16.716874
3	2	4	متجر موثوق، عندهم تشكيلة واسعة	2026-03-15 13:59:16.716874
4	3	5	أفضل أسعار في المنطقة	2026-03-15 13:59:16.716874
5	4	3	جيد لكن التوصيل يأخذ وقتاً	2026-03-15 13:59:16.716874
6	5	4	منتجات أصلية وضمان حقيقي	2026-03-15 13:59:16.716874
\.


--
-- TOC entry 5299 (class 0 OID 16402)
-- Dependencies: 222
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stores (id, name, city, address, phone, created_at, email, password, logo, is_active, is_approved) FROM stdin;
6	fikry	رام الله	\N	\N	2026-03-15 14:05:10.249942	admin@palprice.ps	$2b$10$XGq/VDh9MqcWbadtGNqUmOlHf0hX45mDcEg0HVOAgvKohnwLnx7u2	\N	t	t
1	متجر التقنية	رام الله	\N	\N	2026-03-15 13:59:16.716874	tech@palprice.ps	$2b$10$EqO2XFI5QNkuS8kVZQatjet9ex1b6.qamIVhnDCdvVhxI0HGwrx62	/uploads/1773584712801.jpg	t	t
8	سبيتاني	فلسطين	\N	\N	2026-03-17 22:28:44.808371	\N	\N	\N	t	t
3	سمارت شوب	الخليل	\N	\N	2026-03-15 13:59:16.716874	smart@palprice.ps	$2b$10$EqO2XFI5QNkuS8kVZQatjet9ex1b6.qamIVhnDCdvVhxI0HGwrx62	\N	t	t
4	ديجيتال زون	جنين	\N	\N	2026-03-15 13:59:16.716874	digital@palprice.ps	$2b$10$EqO2XFI5QNkuS8kVZQatjet9ex1b6.qamIVhnDCdvVhxI0HGwrx62	\N	t	t
5	تك وورلد	طولكرم	\N	\N	2026-03-15 13:59:16.716874	world@palprice.ps	$2b$10$EqO2XFI5QNkuS8kVZQatjet9ex1b6.qamIVhnDCdvVhxI0HGwrx62	\N	t	t
2	الكترو بلس	نابلس	\N	\N	2026-03-15 13:59:16.716874	electro@palprice.ps	$2b$10$EqO2XFI5QNkuS8kVZQatjet9ex1b6.qamIVhnDCdvVhxI0HGwrx62	/uploads/1773595740651.jpg	t	t
\.


--
-- TOC entry 5331 (class 0 OID 16800)
-- Dependencies: 254
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, store_id, subject, status, assigned_to, assigned_at, created_at, updated_at) FROM stdin;
2	2	oooooo	closed	1	2026-03-17 02:38:05.985109	2026-03-17 02:37:06.826375	2026-03-17 02:38:41.552516
1	1	jjjjjj	closed	3	2026-03-17 02:45:54.582152	2026-03-17 02:35:54.537606	2026-03-17 03:06:17.212632
3	1	lkijlnkjnb	closed	\N	\N	2026-03-17 11:04:19.133251	2026-03-17 11:04:40.692521
\.


--
-- TOC entry 5333 (class 0 OID 16822)
-- Dependencies: 256
-- Data for Name: ticket_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ticket_messages (id, ticket_id, sender_type, sender_id, sender_name, message, is_read, created_at) FROM stdin;
4	2	admin	1	fikry	hhhhhhhh	t	2026-03-17 02:38:05.984445
1	1	store	1	متجر التقنية	bhbjhbjhbh	t	2026-03-17 02:35:54.539068
3	2	store	2	الكترو بلس	[[[[[	t	2026-03-17 02:37:06.827115
2	1	admin	1	fikry	vjvgvgvhgvh	t	2026-03-17 02:36:08.763471
5	1	admin	3	admin	اتلاتالاتا	t	2026-03-17 02:45:54.571802
6	3	store	1	متجر التقنية	nkjhbkb	t	2026-03-17 11:04:19.134535
\.


--
-- TOC entry 5325 (class 0 OID 16747)
-- Dependencies: 248
-- Data for Name: user_comparisons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_comparisons (id, user_id, product_ids, created_at) FROM stdin;
1	1	{8,7}	2026-03-16 09:24:21.762033
2	1	{8,7}	2026-03-16 09:24:51.716981
3	1	{8,7}	2026-03-16 09:25:08.817248
4	1	{8,7}	2026-03-16 09:25:49.703535
5	1	{8,7}	2026-03-16 09:25:55.707035
6	1	{8,7}	2026-03-16 09:26:53.980131
7	1	{8,7}	2026-03-16 09:26:58.491254
8	1	{11,7}	2026-03-16 09:33:42.436636
9	1	{8,7}	2026-03-16 09:33:48.834728
10	1	{13,14}	2026-03-16 11:33:43.174557
11	1	{6,1}	2026-03-17 03:25:39.594123
12	1	{8,7}	2026-03-17 14:30:07.978842
13	1	{14,23,13}	2026-03-17 14:33:01.934696
14	1	{24,21,26,25,22}	2026-03-17 14:36:19.590535
15	1	{24,21,1,25,22}	2026-03-17 22:13:05.378131
\.


--
-- TOC entry 5323 (class 0 OID 16726)
-- Dependencies: 246
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_favorites (id, user_id, product_id, created_at) FROM stdin;
6	1	303	2026-03-23 20:54:27.520567
7	1	299	2026-03-24 15:49:32.758358
\.


--
-- TOC entry 5337 (class 0 OID 16867)
-- Dependencies: 260
-- Data for Name: user_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notifications (id, user_id, type, title, message, link, is_read, created_at) FROM stdin;
2	2	campaign	🎉 حملة جديدة من متجر التقنية!	الام اغلى ما في الكون عشانها زلزلنا الاسعار — خصم 20 % بمناسبة عيد الام	/campaigns	f	2026-03-17 05:38:28.334802
3	3	campaign	🎉 حملة جديدة من متجر التقنية!	الام اغلى ما في الكون عشانها زلزلنا الاسعار — خصم 20 % بمناسبة عيد الام	/campaigns	f	2026-03-17 05:38:28.335563
5	2	price_alert	انخفض سعر إل جي غسالة سعة 9 كغم، 14 برنامج، ماتور انفرتر دفع مباشر بالذكاء الاصطناعي، فضي.!	وصل السعر إلى 2600.00 ₪ — أقل من هدفك 3000 ₪	/product/36	f	2026-03-24 00:05:29.005856
6	1	price_alert	انخفض سعر iphon 11!	وصل السعر إلى 1300.00 ₪ — أقل من هدفك 1350 ₪	/product/29	t	2026-03-24 00:12:11.786431
1	1	price_drop	انخفض سعر Samsung A51!	وصل سعر "Samsung A51" إلى 1200.00 ₪ — أقل من هدفك 1200 ₪	/product/22	t	2026-03-17 04:39:39.255414
4	1	campaign	🎉 حملة جديدة من متجر التقنية!	الام اغلى ما في الكون عشانها زلزلنا الاسعار — خصم 20 % بمناسبة عيد الام	/campaigns	t	2026-03-17 05:38:28.336048
7	1	price_alert	انخفض سعر iphon 11!	وصل السعر إلى 1100.00 ₪ — أقل من هدفك 1200 ₪	/product/29	t	2026-03-24 00:23:20.996212
8	1	price_alert	انخفض سعر iphon 11!	وصل السعر إلى 900.00 ₪ — أقل من هدفك 900 ₪	/product/29	t	2026-03-24 00:41:13.547397
\.


--
-- TOC entry 5327 (class 0 OID 16763)
-- Dependencies: 250
-- Data for Name: user_viewed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_viewed (id, user_id, product_id, viewed_at) FROM stdin;
76	1	28	2026-03-17 23:55:50.735398
169	1	297	2026-03-18 09:27:26.002787
172	1	59	2026-03-23 20:58:35.409118
174	1	290	2026-03-23 20:58:54.543684
179	1	303	2026-03-23 23:32:30.676615
91	1	302	2026-03-18 00:35:00.689723
98	1	300	2026-03-18 00:35:06.722257
107	1	306	2026-03-18 00:35:57.034764
108	1	298	2026-03-18 00:35:57.818517
113	1	301	2026-03-18 00:37:16.84663
201	1	305	2026-03-24 01:43:46.27665
206	1	29	2026-03-24 10:59:29.032395
207	1	133	2026-03-24 11:00:23.352016
210	1	299	2026-03-24 16:06:46.847776
127	1	296	2026-03-18 00:47:49.840625
129	1	198	2026-03-18 00:47:50.98939
63	1	61	2026-03-17 23:28:54.301712
139	1	154	2026-03-18 00:48:46.772665
140	1	140	2026-03-18 00:48:55.399268
141	1	150	2026-03-18 00:49:02.260582
142	1	151	2026-03-18 00:49:03.391878
74	1	33	2026-03-17 23:30:00.263227
75	1	51	2026-03-17 23:30:00.712523
143	1	311	2026-03-18 00:49:09.535987
144	1	102	2026-03-18 01:04:20.350547
145	1	362	2026-03-18 01:29:55.862569
146	1	304	2026-03-18 01:39:03.896781
147	1	295	2026-03-18 01:39:22.786036
150	1	379	2026-03-18 01:39:32.353257
151	1	381	2026-03-18 01:39:36.862267
152	1	278	2026-03-18 01:44:09.134191
153	1	63	2026-03-18 01:44:41.713494
154	1	30	2026-03-18 01:46:57.82901
155	1	35	2026-03-18 01:47:11.924001
156	1	155	2026-03-18 01:47:54.192355
157	1	144	2026-03-18 01:47:58.977872
158	1	130	2026-03-18 01:48:19.926418
159	1	132	2026-03-18 01:48:27.635287
160	1	272	2026-03-18 01:49:07.659539
161	1	203	2026-03-18 01:50:14.702611
162	1	193	2026-03-18 01:50:28.82251
163	1	107	2026-03-18 02:05:33.728438
164	1	39	2026-03-18 02:07:22.86957
165	1	38	2026-03-18 02:07:42.879221
167	1	66	2026-03-18 02:07:45.35348
168	1	321	2026-03-18 02:07:46.291663
\.


--
-- TOC entry 5301 (class 0 OID 16414)
-- Dependencies: 224
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at, avatar, is_banned, banned_reason) FROM stdin;
2	test	test@test.com	$2b$10$fSU6hHHb3t/6zunS1FOQqO3Utz6NKwNjh9jNTXtc6YxeorhNl4NUa	user	2026-03-15 23:31:10.530803	\N	f	\N
3	admin	admin@palprice.ps	$2b$10$Qtt4w7ZZHQx6dKs4hF99e.cnhMNAPsBi8yeauu8KUW0H3lG3y73eW	admin	2026-03-16 09:57:14.209773	\N	f	\N
1	fikry	fikry@palprice.com	$2b$10$4NXaCCX2q3nQr9GbzZDyAe6PK6J.7iXPEMNI0mJKTqdPfbOul1nne	moderator	2026-03-15 23:05:05.909899	/uploads/1773608725721.jpg	f	\N
\.


--
-- TOC entry 5376 (class 0 OID 0)
-- Dependencies: 251
-- Name: admin_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_notifications_id_seq', 32, true);


--
-- TOC entry 5377 (class 0 OID 0)
-- Dependencies: 265
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 1, true);


--
-- TOC entry 5378 (class 0 OID 0)
-- Dependencies: 229
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 57, true);


--
-- TOC entry 5379 (class 0 OID 0)
-- Dependencies: 263
-- Name: coupon_uses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupon_uses_id_seq', 1, false);


--
-- TOC entry 5380 (class 0 OID 0)
-- Dependencies: 261
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, true);


--
-- TOC entry 5381 (class 0 OID 0)
-- Dependencies: 239
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 3, true);


--
-- TOC entry 5382 (class 0 OID 0)
-- Dependencies: 235
-- Name: offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offers_id_seq', 3, true);


--
-- TOC entry 5383 (class 0 OID 0)
-- Dependencies: 231
-- Name: price_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.price_alerts_id_seq', 6, true);


--
-- TOC entry 5384 (class 0 OID 0)
-- Dependencies: 227
-- Name: price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.price_history_id_seq', 773, true);


--
-- TOC entry 5385 (class 0 OID 0)
-- Dependencies: 225
-- Name: prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prices_id_seq', 1133, true);


--
-- TOC entry 5386 (class 0 OID 0)
-- Dependencies: 267
-- Name: product_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_groups_id_seq', 212, true);


--
-- TOC entry 5387 (class 0 OID 0)
-- Dependencies: 237
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 1187, true);


--
-- TOC entry 5388 (class 0 OID 0)
-- Dependencies: 243
-- Name: product_specs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_specs_id_seq', 2782, true);


--
-- TOC entry 5389 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 382, true);


--
-- TOC entry 5390 (class 0 OID 0)
-- Dependencies: 233
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 9, true);


--
-- TOC entry 5391 (class 0 OID 0)
-- Dependencies: 257
-- Name: store_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.store_notifications_id_seq', 7, true);


--
-- TOC entry 5392 (class 0 OID 0)
-- Dependencies: 241
-- Name: store_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.store_reviews_id_seq', 6, true);


--
-- TOC entry 5393 (class 0 OID 0)
-- Dependencies: 221
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stores_id_seq', 8, true);


--
-- TOC entry 5394 (class 0 OID 0)
-- Dependencies: 253
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 3, true);


--
-- TOC entry 5395 (class 0 OID 0)
-- Dependencies: 255
-- Name: ticket_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_messages_id_seq', 6, true);


--
-- TOC entry 5396 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_comparisons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_comparisons_id_seq', 15, true);


--
-- TOC entry 5397 (class 0 OID 0)
-- Dependencies: 245
-- Name: user_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_favorites_id_seq', 7, true);


--
-- TOC entry 5398 (class 0 OID 0)
-- Dependencies: 259
-- Name: user_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_notifications_id_seq', 8, true);


--
-- TOC entry 5399 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_viewed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_viewed_id_seq', 210, true);


--
-- TOC entry 5400 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 5099 (class 2606 OID 16798)
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5115 (class 2606 OID 16945)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- TOC entry 5073 (class 2606 OID 16477)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5113 (class 2606 OID 16918)
-- Name: coupon_uses coupon_uses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_uses
    ADD CONSTRAINT coupon_uses_pkey PRIMARY KEY (id);


--
-- TOC entry 5109 (class 2606 OID 16904)
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- TOC entry 5111 (class 2606 OID 16902)
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- TOC entry 5085 (class 2606 OID 16555)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 5081 (class 2606 OID 16525)
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- TOC entry 5077 (class 2606 OID 16493)
-- Name: price_alerts price_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_alerts
    ADD CONSTRAINT price_alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 5071 (class 2606 OID 16456)
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5066 (class 2606 OID 16437)
-- Name: prices prices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prices
    ADD CONSTRAINT prices_pkey PRIMARY KEY (id);


--
-- TOC entry 5068 (class 2606 OID 16991)
-- Name: prices prices_product_store_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prices
    ADD CONSTRAINT prices_product_store_unique UNIQUE (product_id, store_id);


--
-- TOC entry 5117 (class 2606 OID 16977)
-- Name: product_groups product_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_groups
    ADD CONSTRAINT product_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5083 (class 2606 OID 16536)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 5089 (class 2606 OID 16719)
-- Name: product_specs product_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_pkey PRIMARY KEY (id);


--
-- TOC entry 5052 (class 2606 OID 16400)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 5054 (class 2606 OID 16964)
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- TOC entry 5079 (class 2606 OID 16509)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5105 (class 2606 OID 16854)
-- Name: store_notifications store_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_notifications
    ADD CONSTRAINT store_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5087 (class 2606 OID 16571)
-- Name: store_reviews store_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_reviews
    ADD CONSTRAINT store_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5056 (class 2606 OID 16468)
-- Name: stores stores_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_email_key UNIQUE (email);


--
-- TOC entry 5058 (class 2606 OID 16412)
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 16810)
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- TOC entry 5103 (class 2606 OID 16835)
-- Name: ticket_messages ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 5095 (class 2606 OID 16756)
-- Name: user_comparisons user_comparisons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_comparisons
    ADD CONSTRAINT user_comparisons_pkey PRIMARY KEY (id);


--
-- TOC entry 5091 (class 2606 OID 16733)
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 5093 (class 2606 OID 16735)
-- Name: user_favorites user_favorites_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 5107 (class 2606 OID 16880)
-- Name: user_notifications user_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5097 (class 2606 OID 16770)
-- Name: user_viewed user_viewed_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_viewed
    ADD CONSTRAINT user_viewed_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 16426)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5062 (class 2606 OID 16424)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5074 (class 1259 OID 17072)
-- Name: idx_price_alerts_product_triggered_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_price_alerts_product_triggered_user ON public.price_alerts USING btree (product_id, is_triggered, user_id);


--
-- TOC entry 5075 (class 1259 OID 17070)
-- Name: idx_price_alerts_user_triggered; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_price_alerts_user_triggered ON public.price_alerts USING btree (user_id, is_triggered);


--
-- TOC entry 5069 (class 1259 OID 17071)
-- Name: idx_price_history_product_recorded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_price_history_product_recorded_at ON public.price_history USING btree (product_id, recorded_at);


--
-- TOC entry 5063 (class 1259 OID 17067)
-- Name: idx_prices_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prices_product_id ON public.prices USING btree (product_id);


--
-- TOC entry 5064 (class 1259 OID 17066)
-- Name: idx_prices_product_store; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prices_product_store ON public.prices USING btree (product_id, store_id);


--
-- TOC entry 5048 (class 1259 OID 17069)
-- Name: idx_products_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_group_id ON public.products USING btree (group_id);


--
-- TOC entry 5049 (class 1259 OID 17065)
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_name ON public.products USING btree (name);


--
-- TOC entry 5050 (class 1259 OID 17068)
-- Name: idx_products_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_status ON public.products USING btree (status);


--
-- TOC entry 5146 (class 2606 OID 16951)
-- Name: campaigns campaigns_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE SET NULL;


--
-- TOC entry 5147 (class 2606 OID 16946)
-- Name: campaigns campaigns_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5125 (class 2606 OID 16957)
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 5144 (class 2606 OID 16919)
-- Name: coupon_uses coupon_uses_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_uses
    ADD CONSTRAINT coupon_uses_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE CASCADE;


--
-- TOC entry 5145 (class 2606 OID 16924)
-- Name: coupon_uses coupon_uses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_uses
    ADD CONSTRAINT coupon_uses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5143 (class 2606 OID 16905)
-- Name: coupons coupons_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5130 (class 2606 OID 16556)
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5126 (class 2606 OID 16494)
-- Name: price_alerts price_alerts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_alerts
    ADD CONSTRAINT price_alerts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5127 (class 2606 OID 16861)
-- Name: price_alerts price_alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_alerts
    ADD CONSTRAINT price_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5123 (class 2606 OID 16457)
-- Name: price_history price_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5124 (class 2606 OID 16462)
-- Name: price_history price_history_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5121 (class 2606 OID 16438)
-- Name: prices prices_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prices
    ADD CONSTRAINT prices_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5122 (class 2606 OID 16443)
-- Name: prices prices_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prices
    ADD CONSTRAINT prices_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5148 (class 2606 OID 16978)
-- Name: product_groups product_groups_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_groups
    ADD CONSTRAINT product_groups_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 5129 (class 2606 OID 16537)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5132 (class 2606 OID 16720)
-- Name: product_specs product_specs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5118 (class 2606 OID 16478)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 5119 (class 2606 OID 16983)
-- Name: products products_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.product_groups(id) ON DELETE SET NULL;


--
-- TOC entry 5120 (class 2606 OID 16542)
-- Name: products products_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- TOC entry 5128 (class 2606 OID 16510)
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5141 (class 2606 OID 16855)
-- Name: store_notifications store_notifications_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_notifications
    ADD CONSTRAINT store_notifications_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5131 (class 2606 OID 16572)
-- Name: store_reviews store_reviews_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_reviews
    ADD CONSTRAINT store_reviews_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5138 (class 2606 OID 16816)
-- Name: support_tickets support_tickets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- TOC entry 5139 (class 2606 OID 16811)
-- Name: support_tickets support_tickets_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- TOC entry 5140 (class 2606 OID 16836)
-- Name: ticket_messages ticket_messages_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;


--
-- TOC entry 5135 (class 2606 OID 16757)
-- Name: user_comparisons user_comparisons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_comparisons
    ADD CONSTRAINT user_comparisons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5133 (class 2606 OID 16741)
-- Name: user_favorites user_favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5134 (class 2606 OID 16736)
-- Name: user_favorites user_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5142 (class 2606 OID 16881)
-- Name: user_notifications user_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5136 (class 2606 OID 16776)
-- Name: user_viewed user_viewed_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_viewed
    ADD CONSTRAINT user_viewed_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5137 (class 2606 OID 16771)
-- Name: user_viewed user_viewed_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_viewed
    ADD CONSTRAINT user_viewed_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-03-25 08:56:43

--
-- PostgreSQL database dump complete
--

\unrestrict BR5hkrIGmLn0rGvjhJ4plsTGQthOGhFELxaLoJuEzQbnqw5dGFQWEk0wbPYs8C6

