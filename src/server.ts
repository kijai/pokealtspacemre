/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Permissions, WebHost } from '@microsoft/mixed-reality-extension-sdk';
import dotenv from 'dotenv';
import { resolve as resolvePath } from 'path';
import App from './app';

/* eslint-disable no-console */
process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));
/* eslint-enable no-console */

// Read .env if file exists
dotenv.config();

// Start listening for connections, and serve static files
const server = new WebHost({
	baseUrl: 'https://altspacepoke.herokuapp.com',
	port: process.env.PORT,
    baseDir: resolvePath(__dirname, '../public'),
    optionalPermissions: [Permissions.UserInteraction]
});

// Handle new application sessions
server.adapter.onConnection(context => new App(context, server.baseUrl));
