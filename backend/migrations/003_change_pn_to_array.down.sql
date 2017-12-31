begin;

alter table users
  add column push_notification_token text;

update users
set push_notification_token = push_notification_tokens[1];

alter table users
  drop column push_notification_tokens;

commit;