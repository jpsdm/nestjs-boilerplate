#!/bin/bash

# Check if the migration name was passed as an argument
if [ -z "$1" ]; then
  echo "Please provide the migration name as an argument."
  exit 1
fi

# Path to the DataSource configuration file (adjust as needed)
DATA_SOURCE_PATH="./src/infra/database/typeorm/data-source.typeorm.ts"

# Path to the migrations directory
MIGRATION_DIR="./src/infra/database/migrations"

# Create the migration using TypeORM CLI with ts-node
npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create "$MIGRATION_DIR/$1"
