/*
 * File: emailControlles.js
 * Project: epicmail
 * Created Date: Tuesday, March 19th 2019, 4:33:10 pm
 * Author: tbuglc
 * -----
 * Last Modified: Date: Tuesday, March 19th 2019, 5:31:54 pm
 * Modified By: tbuglc
 * -----
 * Copyright (c) 2017 Pesachoice LLC
 * 
 */


import allmails from '../models/Mails';
import { userList } from '../models/users'
import filtered from '../helper/filter';
import validator from '../helper/validation'
import Validator from '../helper/validation';
import UserService from '../models/User';
import MessageService from '../models/Message';
import UserMessageService from '../models/UserMessage';

export default class Emails{
    static allmails(req,res){
        res.status(200).send({
            status: 200,
            data:allmails    
        });
    }

    static sendMail(req, res) {
        // validate the request
        // const { error } = validator.validateEmail(req.body);

        // if(error){
        //     return res.status(400).send({
        //       status: 400,
        //       message: error.details[0].message
        //     })
        // }
        // check whether receiver, if not, return error
        const isReceiverValid = userList.some( user => req.body.receiverId === user.id );

        if(!isReceiverValid) {
            return res.status(400).send({
                status: 400,
                message: "Unknown receiver"
              })
        }
        // send message. 
        const newMail = {
            id: allmails.length,
            senderId: req.body.senderId,
            receiverId: req.body.receiverId,
            subject: req.body.subject,
            message: req.body.message,
            createOn: new Date().toLocaleDateString(),
            parentMessageId: req.body.parentMessageId
        };

        allmails.push(newMail);

        return res.status(201).send({
            status: 201,
            message:"Email sent successfully",
            data: newMail
        })
    }

    static allReceivedMail(req,res){
        const allReceivedMails=filtered.filteredArray(allmails,"status","received");
        const user = allusers.find(item=>item.id===parseInt(req.params.id));
        if(!user) return res.status(404).send({
            status: 404,
            message:'User with the given id does not exist'
        })

        const receivedMailsbyUser= filtered.filteredArray(allReceivedMails,"receiverId",user.id)
        res.status(200).send({
            status: 200,
            message:'All received mails are fetched successfully',
            data:receivedMailsbyUser    
        });

    }
    static unreadMail(req,res){
        const allUnreadMails=filtered.filteredArray(allmails,"status","unread");
        const user = allusers.find(item=>item.id===parseInt(req.params.id));
        if(!user) return res.status(404).send({
            status: 404,
            message:'User with the given id does not exist'
        })
        const unreadMailsbyUser= filtered.filteredArray(allUnreadMails,"receiverId",user.id)

        res.status(200).send({
            status: 200,
            message:'All unread mails are fetched successfully',
            data: unreadMailsbyUser
        });
    }

    static sentMail(req,res){
   
        const allSentmails=filtered.filteredArray(allmails,"status","sent");
        const user = allusers.find(item=>item.id===parseInt(req.params.id));
        if(!user) return res.status(404).send({
            status: 404,
            message:'User with the given id does not exist'
        })
        const sentMailByUser= filtered.filteredArray(allSentmails,"senderId",user.id)

        res.status(200).send({
            status: 200,
            data:sentMailByUser
        });
    }
    static emailById(req,res){

        const email=allmails.find(item=>item.id===parseInt(req.params.id));
        if(!email) return res.status(404).send({
            status: 404,
            message:'Email with the given id does not exist'
        })

        res.status(200).send({
            status:200,
            data: email
        })
    }

    static deleteEmail(req,res){
        const email= allmails.find(item=>item.id=== parseInt(req.params.id));
        if(!email) return res.status(404).send({
            status: 404,
            message:'Email with the given id does not exist'
        })

        const index=allmails.indexOf(email);
        allmails.splice(index,1);


        res.status(200).send({
            status: 200,
            data: email.message,
            message:'The email was deleted'
        })

    }
    
    static async send(req, res) {
        try {
            // validate the request
            const isInvalid = Validator.sendMessage(req.body);
            if(isInvalid) {
                throw Object.assign({}, isInvalid);
            };
            // fetch reciver details
            const receiver = await UserService.readOne(`username = $1`, [req.body.recipientUsername]);
            if(receiver && !receiver.id) {
                throw "Unknown Recipient";
            }
            // save message 
            const newMessage = {
                parentMessageId: null,
                subject: req.body.subject,
                message: req.body.message
            }
            const message = await MessageService.create(newMessage);

            // label this message as sent for the sender into user message
            const sent = {
                userId: req.user.id,
                status: 'sent',
                messageId: message.id
            }
            await UserMessageService.create(sent);

            // label this message as received for the receiver into user message
            const received = {
                userId: receiver.id,
                status: 'received',
                messageId: message.id
            }
            await UserMessageService.create(received);
            //success res
            return res.status(200).send({
                status: 200,
                data: [message]
            });
        } catch (error) {
            return res.status(400).send({
                status: 400,
                message: error
            });
        }
    }
}

