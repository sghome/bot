"use strict";

const express = require("express");
const app = express();
const df = require("dialogflow-fulfillment");
const { google } = require("googleapis");

const PORT = process.env.PORT || 8000 ;


const calendarId = "3b734ecf70f07c9c80e29c09d28f0ffef6f3fec4cfd82b1a4190dfd9f7c14f30@group.calendar.google.com";
const serviceAccount = {
  type: "service_account",
  project_id: "calendario-364517",
  private_key_id: "8cad4093a0aca1938ff69ae47f6d23bf60264945",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5Pbuqk0Kue9Z6\nF/3M/th6LuqPWTPEDKmVKNWL7vTnD7jhJgwUP14VqDKr09ie/4YEegMIaBniPCgv\nzOWIQa+GSq+GHG3BTgLBQQ1hXSgZK8Zbf/pWO6zzDrTLkUNsim+lhoFFpxbmQOZR\n8e0zdkSmc+T8fV1GLK5mEFx5iPwxatDl8m/j9qvX6MZMHgyF1XXZdfWN8UO47PEw\nlHbprBSEZrX/8JvJCcuLbCTDNyVR5jA1f4HDugebijXNEomz273hUW02Wg583kcO\nAMBHXak1/fXedY2HH1v6/L1kGvioo2ulo7DbJFRlmTaRejF1wSsc0Qr6gNM0EMjj\nrn5SL/rdAgMBAAECggEABza3D7SjZKMa85nqlCiaf+Dtg9PqoahdPvCeUaWRG6HE\n8TOnmxmVTYzwHY6RltjcPGFkq9ejURLxp7GNgL8Pbvs1QajqwfE1R0GuxotiVonv\nXrx+9bZmN6LredVNhbUQavxFctPHya4I/3Ock/lM7BnYTC2KS9jNQ9lAQ1Vefi1v\nQFWgTLze0qPVItpyrZ3grwggjMxdmt/E7obfn4HxP5/TEmwMy2w8ekicoeRJ3/99\nhf1LZ8VzZghuXyc53vfCggTjm3puTbP7EjvrH8u7j/8q1+CyQczgPzUJW6Qv6jDa\n584We28qzG363ZdpsGSxCGy09uObbMYn7dGPW17BAQKBgQDdH39havkT8UtHwiRx\nPR8OmURMvVIWVUe8okPagTr5vs2ekL07jZp6miZucsykwm+VPezCOIWVhKSdRQpT\ngwW+ybaWjmjvIyiI/Rknq4yIRPlwrUcJiTlrkP8Fc/UvC451G0eqK7t7bT+Tjn4Z\nVUefU2/GM7fKMfCdzBl0S22SgQKBgQDWdWWiqAR5m2tp1yLUXnCo7W0iHDYmIFoc\nkc/NRPXEqxwSnJPMndU0XqXl8V3NpqXQd1UWM81DUIpPMtQIbm2QCoq1t+/fsTdH\nLkdnSUueHkQ26i1ZOlpsle427O7p/dWTfO+Mfg9vGmjrsY7IHjrYSt5t7Rhp0QAm\naebfPFzCXQKBgQCcbEC3EG58/g/MBnmzJZLHyAJ56t+b7t4dgghQFWU78Q8SIb/L\n1iM2ob+YGFvOHcHDqJfI2SUenUO6AXIJm8E/swAYR0vSB2QQbEMUPhXe/DQc0mdT\nRqC5CExvdhU3H4y6KP8sUV2CNclov79SenJ9Mg/6/PEB9wwJBK3pB8bOgQKBgC+R\nCmHxckymtERde1QvPj25q6MNLtV2B4aesMCOsxRT/34BTKbtuwRKmfFOf8fFVrHO\nRgkOpFBx5Lt8Qps8IwD31ZxIl+O9os0e7qdyEluXyvmDJ1vLHZNIDfYQx00PB/gW\nletLapDyAqOEVm78hYDD2mH3XJrbyHS8uIB7GvfhAoGBANcWvssmPf3sAF19ckTl\nN12whdEtaooHVk1WEd2Es9kzpt+40QevCqM+yVyWFUC2DfU0jW92SZ/CqLfeEvbB\neSMpNqNkiMhr7/WmCxB0mhj3SXK1LBEb4q4aRGZd44MpZ27Pizm5DpJJ3RWDQxAV\n1KYQk7qkW5qRc/8EyenHntsT\n-----END PRIVATE KEY-----\n",
  client_email: "calendarioluminas@calendario-364517.iam.gserviceaccount.com",
  client_id: "118185329979360645187",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/calendarioluminas%40calendario-364517.iam.gserviceaccount.com",
}; 


// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: "https://www.googleapis.com/auth/calendar",
});

const calendar = google.calendar("v3");
process.env.DEBUG = "dialogflow:*"; // enables lib debugging statements

const timeZone = "America/New_York";
const timeZoneOffset = "-04:00";





app.listen(PORT ,()=>{
console.log(`El servidor esta corriendo en el puerto ${PORT}`);

});

app.post("/webhook", express.json(), (request, response) =>{
  const agent = new df.webhookClient({
    request : request,
    response : response
  });




  function makeAppointment(agent){

    let appointment_type = agent.parameters.AppointmentType;
    let date = agent.parameters.date;
    let time = agent.parameters.time;

    let dateTimeStart = new Date(Date.parse(date.split("T")[0] +
            "T" + time.split("T")[1].split("-")[0] +
            timeZoneOffset));

            let dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));

 const appointmentTimeString = dateTimeStart.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        timeZone: timeZone,
      });







 // Check the availibility of the time, and make an appointment if there is time on the calendar
      return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type)
        .then(res => {
          agent.add(
            `Ok, dejame reviso. ${appointmentTimeString} esta bien!.`
          );
        })


        .catch(err => {
          agent.add(
            `Lo siento, no hay horarios disponibles ${appointmentTimeString}.`
          );
        });
    }

    var intentMap = new Map();
    intentMap.set("ScheduleAppointment", makeAppointment);
    agent.handleRequest(intentMap);
  }
);





function createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        auth: serviceAccountAuth, // List events for time period
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString(),
      },


      (err, calendarResponse) => {
        // Check if there is a event already on the Calendar
        if (err || calendarResponse.data.items.length > 0) {
          reject(
            err ||
              new Error("el vento presenta conflicto con otros eventos")
          );



 } else {
          // Create event for the requested time period
          calendar.events.insert(
            {
              auth: serviceAccountAuth,
              calendarId: calendarId,
              resource: {
                summary: appointment_type + " Appointment",
                description: appointment_type,
                start: { dateTime: dateTimeStart },
                end: { dateTime: dateTimeEnd },
              },
            },
            (err, event) => {
              err ? reject(err) : resolve(event);
            }
          );
        }
      }
    );
  });
}
