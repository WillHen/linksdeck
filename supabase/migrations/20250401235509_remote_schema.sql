create sequence "public"."cancellation_tokens_id_seq";

drop trigger if exists "link_count_trigger" on "public"."links";

create table "public"."cancellation_tokens" (
    "id" integer not null default nextval('cancellation_tokens_id_seq'::regclass),
    "user_id" uuid not null,
    "token" character varying(255) not null,
    "expiration" timestamp without time zone not null,
    "is_used" boolean default false,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter sequence "public"."cancellation_tokens_id_seq" owned by "public"."cancellation_tokens"."id";

CREATE UNIQUE INDEX cancellation_tokens_pkey ON public.cancellation_tokens USING btree (id);

CREATE UNIQUE INDEX idx_user_token ON public.cancellation_tokens USING btree (user_id, token);

alter table "public"."cancellation_tokens" add constraint "cancellation_tokens_pkey" PRIMARY KEY using index "cancellation_tokens_pkey";

alter table "public"."cancellation_tokens" add constraint "cancellation_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."cancellation_tokens" validate constraint "cancellation_tokens_user_id_fkey";

grant delete on table "public"."cancellation_tokens" to "anon";

grant insert on table "public"."cancellation_tokens" to "anon";

grant references on table "public"."cancellation_tokens" to "anon";

grant select on table "public"."cancellation_tokens" to "anon";

grant trigger on table "public"."cancellation_tokens" to "anon";

grant truncate on table "public"."cancellation_tokens" to "anon";

grant update on table "public"."cancellation_tokens" to "anon";

grant delete on table "public"."cancellation_tokens" to "authenticated";

grant insert on table "public"."cancellation_tokens" to "authenticated";

grant references on table "public"."cancellation_tokens" to "authenticated";

grant select on table "public"."cancellation_tokens" to "authenticated";

grant trigger on table "public"."cancellation_tokens" to "authenticated";

grant truncate on table "public"."cancellation_tokens" to "authenticated";

grant update on table "public"."cancellation_tokens" to "authenticated";

grant delete on table "public"."cancellation_tokens" to "service_role";

grant insert on table "public"."cancellation_tokens" to "service_role";

grant references on table "public"."cancellation_tokens" to "service_role";

grant select on table "public"."cancellation_tokens" to "service_role";

grant trigger on table "public"."cancellation_tokens" to "service_role";

grant truncate on table "public"."cancellation_tokens" to "service_role";

grant update on table "public"."cancellation_tokens" to "service_role";

CREATE TRIGGER update_link_count_trigger AFTER INSERT OR DELETE ON public.links FOR EACH ROW EXECUTE FUNCTION update_link_count();


