#!/bin/sh

# Run the deploy commands script
echo "Running deployCommands.js..."
node deployCommands.js

# Then start the bot
echo "Starting the bot..."
npm run start