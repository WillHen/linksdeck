drop policy "All edit links" on "public"."links";

alter table "public"."links" drop constraint "fk_user";

alter table "public"."lists" drop constraint "lists_user_id_fkey";

alter table "public"."cancellation_tokens" enable row level security;

alter table "public"."links" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."links" validate constraint "fk_user";

alter table "public"."lists" add constraint "lists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."lists" validate constraint "lists_user_id_fkey";

create policy "Insert Cancellation token"
on "public"."cancellation_tokens"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Select token"
on "public"."cancellation_tokens"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "All edit links"
on "public"."links"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



