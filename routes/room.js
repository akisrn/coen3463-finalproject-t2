var express = require('express');
var RoomData = require('../models/room-schema');
var DayData = require('../models/day-schema');
var RoomScheduleData = require('../models/room-schedule-schema');
var ObjectId = require('mongoose').Types.ObjectId; 
var router = express.Router();


var newRoom;
var roomToSave;

// SHOW ROOM DATA
router.get('/:roomDataId', function(req, res) 
 {
    if (req.user === undefined)
     {
        res.redirect('/');
     }
    else
     {
        var roomDataId = req.params.roomDataId;
        RoomData.findById(roomDataId, function(err, RoomData)
         {
            if (err)
              { throw err; }
            else
             {  
                DayData.find({'room_number' : roomDataId.toString()}, function(err, DayData)
                 {
                    if (err)
                      { throw err; }
                    else
                     { 
                       res.render('roomData', { DayData : DayData,
                                                RoomData:RoomData,
                                                title: "CpE Room Management System",
                                                user: req.user
                                              });
                       console.log(DayData);
                     }
                          
                 });
             }
                  
         });
     }
 });
 
// SHOW ROOM DAYS
router.get('/:roomDataId/:dayDataId', function(req, res) 
 {
    if (req.user === undefined)
     {
        res.redirect('/');
     }
    else
     {
        var roomDataId = req.params.roomDataId;
        var dayDataId = req.params.dayDataId;

        RoomData.findById(roomDataId, function(err, RoomData)
         {
            if (err)
              { throw err; }
            else
             {  
               DayData.findById(dayDataId, function(err, DayData)
                 {
                    if (err)
                      { throw err; }
                    else
                     {  
                       RoomScheduleData.findOne({'room_schedule.day_of_the_week' : dayDataId.toString()}, function(err, RoomScheduleData)
                         {
                            if (err)
                              { throw err; }
                            else
                             { 
                               if (RoomScheduleData)
                                 {
                                    res.render('roomSchedule', { RoomScheduleData : RoomScheduleData.room_schedule,
                                                                 DayData : DayData,
                                                                 RoomData:RoomData,
                                                                 title: "CpE Room Management System",
                                                                 user: req.user
                                                              });
                                    console.log(RoomScheduleData.room_schedule);
                                 }
                             }
                                  
                         });
                     }
                          
                 });
             }
                  
         });
     }
 });

// ADD NEW ROOM TO DATABASE
router.post('/add', function(req, res)
 {
    newRoom = RoomData({ room_number: req.body.room_number,
                         day_of_the_week: req.body.day_of_the_week
                      });

    roomToSave = newRoom;

    roomToSave.save(function(err)
     {
       if (err)
         {
            console.log(err);
            return res.render('add', {errorLog: err.toString().substring(err.toString().indexOf(":") + 1)});
         }
       else
         {
            console.log('Entry created!');
            res.redirect('/');
         }
     });

 });

// ADD NEW DAY
router.post('/:roomDataId/add', function(req, res) 
 {
    if (req.user === undefined) 
     {
        res.redirect('/');
     }
    else 
     {

        var roomDataId = req.params.roomDataId;
        var dayData = new DayData({ room_number : roomDataId,
                                    day_of_the_week: req.body.day_of_the_week
                                 });
            dayData.save(function(err){
                if(err)
                 {
                    res.end(err);
                 }
                else
                 {
                    var dayID = dayData._id;
                    RoomData.findByIdAndUpdate(
                        roomDataId,
                        { $push: {  day_of_the_week: { $each: [dayID], $position: 0 }}},
                        { safe: true, upsert: true, new: true },
                        function(err, results)
                         {
                            if(err)
                             {
                                res.end(err);
                             }
                            else
                             {
                                  res.redirect('/room/' + roomDataId);
                             }
                         }
                    );
                 }
            });
     }
 });

// ADD NEW SCHEDULE
router.post('/:roomDataId/:dayDataId/addSchedule', function(req, res) 
 {
    if (req.user === undefined) 
     {
        res.redirect('/');
     }
    else 
     {
        var roomDataId = req.params.roomDataId;
        var dayDataId  = req.params.dayDataId;
        var roomScheduleData = new RoomScheduleData({ room_schedule     : [{  day_of_the_week   : dayDataId,  
                                                                              class_start       : req.body.class_start,
                                                                              class_end         : req.body.class_end,
                                                                              class_code        : req.body.class_code,
                                                                              class_subject     : req.body.class_subject,
                                                                              class_professor   : req.body.class_professor
                                                                          }]
                                                   });
            roomScheduleData.save(function(err){
                if(err)
                 {
                    res.end(err);
                 }
                else
                 {
                    console.log(roomScheduleData);
                    var roomScheduleDataID = roomScheduleData._id;
                    DayData.findByIdAndUpdate(
                        dayDataId,
                        { $push: {  room_schedule: { $each: [roomScheduleDataID], $position: 0 }}},
                        { safe: true, upsert: true, new: true },
                        function(err, results)
                         {
                            if(err)
                             {
                                res.end(err);
                             }
                            else
                             {
                                res.redirect('/room/' + roomDataId + '/' + dayDataId );
                             }
                         }
                    );
                 }
            });
     }
 });


module.exports = router;