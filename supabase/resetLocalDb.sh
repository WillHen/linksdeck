#!/bin/bash

# filepath: /Users/williamhenshaw/Desktop/projects/linkhub/supabase/resetLocalDb.sh

# Pull the latest database schema
supabase db pull

# Pull the latest schema for the auth schema
supabase db pull --schema auth

# Reset the local database
supabase db reset --local