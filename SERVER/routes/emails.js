/*
 * File: emails.js
 * Project: epicmail
 * Created Date: Tuesday, March 19th 2019, 4:23:31 pm
 * Author: tbuglc
 * -----
 * Last Modified: Date: Tuesday, March 19th 2019, 4:23:33 pm
 * Modified By: tbuglc
 * -----
 * Copyright (c) 2017 Pesachoice LLC
 * 
 */


import { Router } from 'express';
import Mails from '../controllers/emailControlles'
import { isUserAuthenticated } from '../middlewares/auth';

const routers= Router();

routers.get('/messages', Mails.allmails);
routers.get('/messages/received/:id', Mails.allReceivedMail);
routers.get('/messages/unread/:id', Mails.unreadMail)
routers.get('/messages/sent/:id',Mails.sentMail)
routers.get('/messages/:id',Mails.emailById);
routers.delete('/messages/:id',Mails.deleteEmail);
routers.post('/messages/send', Mails.sendMail);

// send messages new apis

routers.post('/message/new', isUserAuthenticated, Mails.send);


export default routers;