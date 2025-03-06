alter table "public"."lists" add column "link_count" integer default 0;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_link_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lists
        SET link_count = link_count + 1
        WHERE id = NEW.list_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lists
        SET link_count = link_count - 1
        WHERE id = OLD.list_id;
    END IF;
    RETURN NULL;
END;
$function$
;

CREATE TRIGGER link_count_trigger AFTER INSERT OR DELETE ON public.links FOR EACH ROW EXECUTE FUNCTION update_link_count();


