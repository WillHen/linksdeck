#!/bin/bash

# filepath: /Users/williamhenshaw/Desktop/projects/linkhub/supabase/resetAndSeed.sh

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display usage instructions
usage() {
  echo "Usage: $0 [user] [list]"
  echo "  user: Seeds user data"
  echo "  list: Seeds list data (requires 'user' to be seeded first)"
  exit 1
}

# Check if resetLocalDb.sh exists and is executable
if [[ ! -x "./supabase/resetLocalDb.sh" ]]; then
  echo "Error: resetLocalDb.sh not found or not executable."
  exit 1
fi

# Run resetLocalDb.sh
echo "Resetting the local database..."
./supabase/resetLocalDb.sh
echo "Database reset complete."

# Track whether user and list seeding should run
seed_user=false
seed_list=false

# Parse command-line arguments
for arg in "$@"; do
  case $arg in
    user)
      seed_user=true
      ;;
    list)
      seed_list=true
      ;;
    *)
      echo "Error: Invalid argument '$arg'."
      usage
      ;;
  esac
done

# Run seedUser if requested
if $seed_user; then
  if [[ ! -f "./supabase/seedUser.js" ]]; then
    echo "Error: seedUser.js not found or not executable."
    exit 1
  fi
  echo "Seeding user data..."
  node ./supabase/seedUser.js
  echo "User data seeding complete."
fi

# Run seedList if requested (requires seedUser to have run)
if $seed_list; then
  if ! $seed_user; then
    echo "Error: Cannot seed list data without seeding user data first."
    exit 1
  fi
  if [[ ! -f "./supabase/seedList.js" ]]; then
    echo "Error: ./supabase/seedList.js not found or not executable."
    exit 1
  fi
  echo "Seeding list data..."
  node ./supabase/seedList.js
  echo "List data seeding complete."
fi

# If no valid arguments were provided, display usage
if ! $seed_user && ! $seed_list; then
  usage
fi

echo "Reset and seeding process complete."