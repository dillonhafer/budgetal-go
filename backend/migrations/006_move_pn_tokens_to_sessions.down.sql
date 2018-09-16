begin;

alter table users
  add column push_notification_tokens text[] not null default '{}';

alter table sessions drop column push_notification_token;

commit;
