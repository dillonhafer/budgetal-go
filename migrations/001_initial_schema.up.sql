create extension if not exists plpgsql with schema pg_catalog;
create extension if not exists pgcrypto with schema public;

create table users (
  id serial primary key,
  password_hash character varying,
  password_salt character varying,
  admin boolean,
  created_at timestamptz,
  updated_at timestamptz,
  password_reset_token character varying,
  password_reset_sent_at timestamptz,
  email character varying default ''::character varying not null,
  encrypted_password character varying default ''::character varying not null,
  first_name character varying,
  last_name character varying,
  reset_password_token character varying,
  reset_password_sent_at timestamptz,
  avatar_file_name character varying,
  avatar_content_type character varying,
  avatar_file_size integer,
  avatar_updated_at timestamptz
);

create table budgets (
  id serial primary key,
  user_id integer not null references users,
  month integer not null check (month >= 1 and month <= 12),
  year integer not null check (year >= 2013 and year <= 2100),
  monthly_income numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

create table allocation_plans (
  id serial primary key,
  budget_id integer not null references budgets,
  start_date date not null,
  end_date date not null,
  income numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table allocation_plan_budget_items (
  id serial primary key,
  allocation_plan_id integer not null references allocation_plans,
  budget_item_id integer not null,
  amount_budgeted numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table annual_budgets (
  id serial primary key,
  user_id integer not null references users,
  year integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint year_range check (((year >= 2013) and (year <= 2100)))
);

create table annual_budget_items (
  id serial primary key,
  annual_budget_id integer not null references annual_budgets,
  name character varying not null,
  due_date date not null,
  amount numeric(10,2) not null,
  paid boolean default false not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payment_intervals integer default 12 not null
);


create table budget_categories (
  id serial primary key,
  budget_id integer not null references budgets,
  name character varying not null,
  percentage character varying not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table budget_items (
  id serial primary key,
  budget_category_id integer not null references budget_categories,
  name character varying not null,
  amount_budgeted numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  envelope boolean
);

create table budget_item_expenses (
  id serial primary key,
  budget_item_id integer not null references budget_items,
  name character varying not null,
  amount numeric(10,2) not null,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sessions (
  authentication_key uuid default gen_random_uuid() not null primary key,
  authentication_token character varying not null,
  user_id integer not null references users,
  ip character varying not null,
  user_agent character varying not null,
  expired_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index active_sessions_idx on sessions using btree (authentication_key) where (expired_at is null);
create index allocation_plan_bdgt_itms_alc_id_idx on allocation_plan_budget_items using btree (allocation_plan_id);
create index allocation_plan_bdgt_itms_budget_id_idx on allocation_plan_budget_items using btree (budget_item_id);
create index allocation_plans_budget_id_idx on allocation_plans using btree (budget_id);
create index annual_budget_items_budget_id_idx on annual_budget_items using btree (annual_budget_id);
create index annual_budgets_user_id_idx on annual_budgets using btree (user_id);
create index budget_id_idx on budget_categories using btree (budget_id);
create index budget_item_expenses_item_idx on budget_item_expenses using btree (budget_item_id);
create index budget_items_category_idx on budget_items using btree (budget_category_id);
create index budgets_user_id_idx on budgets using btree (user_id);
create index sessions_user_id_idx on sessions using btree (user_id);
create unique index index_annual_budgets_on_user_id_and_year on annual_budgets using btree (user_id, year);
create unique index index_users_on_reset_password_token on users using btree (reset_password_token);
