#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Quiz App Database Setup...${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}Error: .env.local file not found!${NC}"
    echo "Please ensure DATABASE_URL and DIRECT_URL are set in .env.local"
    exit 1
fi

echo -e "${GREEN}✓ Found .env.local${NC}"

# Generate Prisma Client
echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma Client generated${NC}"
else
    echo -e "${RED}✗ Failed to generate Prisma Client${NC}"
    exit 1
fi

# Push schema to database
echo -e "${YELLOW}Syncing Prisma schema with database...${NC}"
npx prisma db push
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database schema synchronized${NC}"
else
    echo -e "${RED}✗ Failed to sync database schema${NC}"
    echo "Make sure DATABASE_URL is correct and the database is accessible"
    exit 1
fi

echo -e "${GREEN}✓ Database setup complete!${NC}"
echo -e "${YELLOW}You can now run: npm run dev${NC}"
