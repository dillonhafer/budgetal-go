begin;

alter table users
  add column push_notification_tokens text[] not null default '{}';

update users
set push_notification_tokens = array[push_notification_token]
where push_notification_token is not null;

alter table users
  drop column push_notification_token;

commit;