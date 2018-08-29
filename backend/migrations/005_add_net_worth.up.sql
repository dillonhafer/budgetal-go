create extension if not exists citext with schema public;

create table net_worths (
  id serial primary key,
  user_id integer not null references users,
  year integer not null,
  month integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month),
  constraint month_range check (((month >= 1) and (month <= 12))),
  constraint year_range check (((year >= 1900) and (year <= 2100)))
);

create table assets_liabilities (
  id serial primary key,
  user_id integer not null references users,
  name citext not null,
  is_asset boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table net_worth_items (
  id serial primary key,
  net_worth_id integer not null references net_worths,
  asset_liability_id integer not null references assets_liabilities,
  amount numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (net_worth_id, asset_liability_id)
);