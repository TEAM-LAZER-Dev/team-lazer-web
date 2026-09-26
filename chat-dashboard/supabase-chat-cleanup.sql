-- TEAM LAZER — Chat: Löschen, Beenden durch Kunden, Upload-Freigabe, Aufräumen
-- (bereits im Supabase SQL-Editor ausgeführt; idempotent)

alter table conversations add column if not exists allow_uploads boolean not null default false;

drop policy if exists agent_delete_conversations on conversations;
create policy agent_delete_conversations on conversations for delete to authenticated using (true);
drop policy if exists agent_delete_messages on messages;
create policy agent_delete_messages on messages for delete to authenticated using (true);

-- Kunde beendet Chat (anon darf conversations nicht direkt updaten)
create or replace function public.close_conversation(p_id uuid) returns void
language sql security definer set search_path=public as $$
  update conversations set status='closed', last_message_at=now() where id=p_id and status<>'closed'
$$;
grant execute on function public.close_conversation(uuid) to anon, authenticated;

-- Verwaiste Chats (>3h ohne Aktivität) automatisch beenden
create or replace function public.cleanup_conversations() returns void
language sql security definer set search_path=public as $$
  update conversations set status='closed'
  where status in ('waiting','active','hold') and coalesce(last_message_at,created_at) < now() - interval '3 hours'
$$;
grant execute on function public.cleanup_conversations() to authenticated;

-- last_message_at bei jeder neuen Nachricht aktualisieren
create or replace function public.touch_conversation() returns trigger
language plpgsql security definer set search_path=public as $$
begin update conversations set last_message_at=now() where id=new.conversation_id; return new; end $$;
drop trigger if exists trg_touch_conversation on messages;
create trigger trg_touch_conversation after insert on messages
for each row execute function public.touch_conversation();
