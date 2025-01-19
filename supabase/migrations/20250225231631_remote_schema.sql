SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS "pgsodium";
COMMENT ON SCHEMA "public" IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$;
ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";
SET default_tablespace = '';
SET default_table_access_method = "heap";
CREATE TABLE IF NOT EXISTS "public"."links" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "list_id" "uuid",
    "url" "text",
    "title" "text",
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL
);
ALTER TABLE "public"."links" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."lists" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" "text",
    "description" "text",
    "public" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"()
);
ALTER TABLE "public"."lists" OWNER TO "postgres";
CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text",
    "email" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);
ALTER TABLE "public"."user_profiles" OWNER TO "postgres";
ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");
ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id");
ALTER TABLE ONLY "public"."links"
    ADD CONSTRAINT "links_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id");
ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id");
CREATE POLICY "All edit links" ON "public"."links" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));
CREATE POLICY "Allow delete for link owners" ON "public"."links" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Allow delete for user profiles by owner" ON "public"."user_profiles" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));
CREATE POLICY "Allow delete on lists" ON "public"."lists" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Allow insert for user profiles by authenticated users" ON "public"."user_profiles" FOR INSERT TO "authenticated" WITH CHECK (true);
CREATE POLICY "Allow logged-in users to insert" ON "public"."lists" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));
CREATE POLICY "Allow public select" ON "public"."lists" FOR SELECT USING (true);
CREATE POLICY "Allow public select on links" ON "public"."links" FOR SELECT USING (true);
CREATE POLICY "Allow select for authenticated users based on list_id" ON "public"."links" FOR SELECT USING (("auth"."uid"() IS NOT NULL));
CREATE POLICY "Allow select for user profiles by owner" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));
CREATE POLICY "Allow update for authenticated users based on list_id" ON "public"."links" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));
CREATE POLICY "Allow update for user profiles by owner" ON "public"."user_profiles" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK (true);
CREATE POLICY "Allow update on own lists" ON "public"."lists" FOR UPDATE USING (("auth"."uid"() = "user_id"));
ALTER TABLE "public"."links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."lists" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";
GRANT ALL ON TABLE "public"."links" TO "anon";
GRANT ALL ON TABLE "public"."links" TO "authenticated";
GRANT ALL ON TABLE "public"."links" TO "service_role";
GRANT ALL ON TABLE "public"."lists" TO "anon";
GRANT ALL ON TABLE "public"."lists" TO "authenticated";
GRANT ALL ON TABLE "public"."lists" TO "service_role";
GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
RESET ALL;
