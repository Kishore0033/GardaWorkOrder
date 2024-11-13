"use strict"

import express, { json } from 'express';
import settingRoutes from './routes/settings.routes.js'
import filesRoutes from './routes/files.routes.js'
import crmRoutes from './routes/crm.routes.js'

const app = express();
app.use(json());

app.use('/api/settings/', settingRoutes);
app.use('/api/logo/', filesRoutes);
app.use('/api/crm/', crmRoutes)

app.all("/", (req,res) => {
	res.status(200).send("I am Live and Ready.");
});

export default app;
