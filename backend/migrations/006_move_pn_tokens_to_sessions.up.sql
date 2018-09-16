begin;

alter table sessions add column push_notification_token text;
alter table users drop column push_notification_tokens;

commit;
