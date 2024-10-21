import 'dotenv/config';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { REST, Routes } from 'discord.js';
import { fetchGuilds } from '#api/guilds.js';

export const deployCommands = () => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const commandFolderPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(commandFolderPath);

    const commandsPromise = Promise.all(
    commandFolders.map(async (folder) => {
        const commandPath = path.join(commandFolderPath, folder);
        const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));

        const folderCommands = await Promise.all(
        commandFiles.map(async (file) => {
            const commandFilePath = "file://" + path.join(commandPath, file).replace(/\\/g, '/')

            const command = await import(commandFilePath);
            if ('data' in command && 'execute' in command) {
            return command.data.toJSON();
            } else {
            console.log(`[WARNING] Command at ${commandFilePath} is missing a required "data" or "execute" property.`);
            return null;
            }
        })
        );

        return folderCommands.filter((command) => command !== null);
    })
    );

    (async () => {
    try {
        const commands = (await commandsPromise).flat(); // Flatten the array of arrays into a single array
        
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const rest = new REST().setToken(process.env.TOKEN);

        const guilds = (await fetchGuilds()).map(({ guild }) => guild)
        
        const deployPromise = guilds.map(async (guild) => {
        try {
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.APPLICATION_ID, guild), 
                { body: commands }
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands to ${guild}.`);
        } catch (err) {
            console.log(`[ERROR] Failed to reload commands for guild ${guild}: ${err.message}.`)
        }
        })

        await Promise.all(deployPromise)
        console.log("Successfully reloaded application (/) commands for all guilds.")

    } catch (err) {
        console.log(`[ERROR] ${err}`);
    }
    })();
}

deployCommands()