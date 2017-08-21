const request = require('request')
const functions = require('firebase-functions')
const helpers = require('./../helpers')
const moment = require('moment');

const calendarId = functions.config().google.calendarid
const apiKey = functions.config().google.apikey

exports.handler = ((req, res, responseUrl) => {
  const today = moment()
  getAllUpcomingEvents(today, (events) => {
    if (req.body.type == 'tomorrow') {
      let tomorrowEvents = getAllEventsHappeningTomorrow(events, today)
      let messageToSend = createAMessageToSend(tomorrowEvents)
      if (messageToSend.length) {
        let message = "Here are the events for tomorrow!\n\n" + messageToSend
        let obj = {"text": message }
        helpers.sendMessageViaURL(obj, responseUrl)
      }
      res.status(200).send("Tomorrow")
    } else if (req.body.type == 'thisWeek') {
      let thisWeeksEvents = getAllEventsHappeningThisWeek(events, today)
      let messageToSend = createAMessageToSend(thisWeeksEvents)
      if (messageToSend.length) {
        let message = "Here are the events for this week!\n\n" + messageToSend
        let obj = {"text": message }
        helpers.sendMessageViaURL(obj, responseUrl)
      }
      res.status(200).send("This Week")
    } else if (req.body.type == 'thisDayNextWeek') {
      let eventsThisTimeNextWeek = getAllEventsHappeningThisTimeNextWeek(events, today)
      let messageToSend = createAMessageToSend(eventsThisTimeNextWeek)
      if (messageToSend.length) {
        let message = "Here are the events for one week from now! If you cannot attend these events, please let the E-Board members know!\n\n" + messageToSend
        let obj = {"text": message }
        helpers.sendMessageViaURL(obj, responseUrl)
      }
      res.status(200).send("This Time Next Week")
    } else if (req.body.type == 'today') {
      let todaysEvents = getAllEventsHappeningToday(events, today)
      let messageToSend = createAMessageToSend(todaysEvents)
      if (messageToSend.length) {
        let message = "Here are the events for today!\n\n" + messageToSend
        let obj = {"text": message }
        helpers.sendMessageViaURL(obj, responseUrl)
      }
      res.status(200).send("Today")
    } else {
      res.status(404).send("Wrong type specified")
    }
  })
})

const getAllUpcomingEvents = ((today, callback) => {
  const url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events/?key=" + apiKey
  let options = {
    uri: url,
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  }
  request(options, (error, response, body) => {
    if (error){
      callback("Error")
    } else {
      let events = JSON.parse(body)
      let results = filterEventsWithMomentLike(events.items, today, (thisEvent) => {
        return thisEvent.isSameOrAfter(today)
      })
      callback(results.reverse())
    }
  })
})

const filterEventsWithMomentLike = ((events, today, callback) => {
  return events.filter((item) => {
    let result = false
    if (item.start == undefined) {
      result = false
    } else if (item.start.dateTime) {
      let thisEvent = moment(item.start.dateTime)
      result = callback(thisEvent)
    } else if (item.start.date) {
      let thisEvent = moment(item.start.date)
      result = callback(thisEvent)
    } else {
      result = false
    }
    return result
  })
})

const getAllEventsHappeningThisWeek = ((events, today) => {
  return filterEventsWithMomentLike(events, today, (thisEvent) => {
    return thisEvent.week() == today.week()
  })
})

const getAllEventsHappeningToday = ((events, today) => {
  return filterEventsWithMomentLike(events, today, (thisEvent) => {
    return thisEvent.day() == today.day() && thisEvent.week() == today.week()
  })
})

const getAllEventsHappeningTomorrow = ((events, today) => {
  return filterEventsWithMomentLike(events, today, (thisEvent) => {
    return thisEvent.day() == (today.day() + 1) && thisEvent.week() == today.week()
  })
})

const getAllEventsHappeningThisTimeNextWeek = ((events, today) => {
  return filterEventsWithMomentLike(events, today, (thisEvent => {
    console.log("thisEventDay", thisEvent.day())
    console.log("todayDay", today.day())
    console.log("todayWeek", today.week())
    console.log("thisEventWeek", thisEvent.week())
    return thisEvent.day() == today.day() && today.week() + 1 == thisEvent.week() + 1
  }))
})

const createAMessageToSend = (events) => {
  return events.map((event) => {
    return createAMessageFromEachEvent(event)
  })
}

const createAMessageFromEachEvent = (event) => {
  let message = "*" + event.summary + "*\n"
  if (event.start && event.start.date) {
    message = message + " From: " + moment(event.start.date).calendar() + "\n"
  } else if (event.start && event.start.dateTime) {
    message = message + " From: " + moment(event.start.dateTime).calendar() + "\n"
  }
  if (event.end && event.end.date) {
    message = message + "To: " + moment(event.end.date).calendar() + "\n"
  } else if (event.end && event.end.dateTime) {
    message = message + "To: " + moment(event.end.dateTime).calendar()  + "\n"
  }
  message = message + "At: " + event.location + "\n"
  return message + "\n\n"
}