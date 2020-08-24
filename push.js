var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BFVTbYg08I31vOXQWDu-wfJXOSy-cMqQtbE6g2mCy-u04IVaYeSD6SoXXnDOQI-RW8TIqtfb4sqfaCjw2R_IuLo",
    "privateKey": "qUY8HWToLInl0b_rlIQj2_b8Cvvj3jhnuafL0tVkajI"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/eFEpPx52tDc:APA91bGzeJjlMV1mOtqMXuPHdoNYOstxDw9x2wC4jjDYg51ksTKYxq2l_Oh8lakQrEKfDOvw0x8kLervR-5nvvdQtb_n-gyScu7cYTiiEyUIWWGGufFOn-x4GQ-VuY7iQhwhGuWTWhQ9",
    "keys": {
        "p256dh": "BJfs7EfLfau/OiZiNcE5YiJIJdOmy9+ewjsPvx0CFDm+uNzAnXLUc48NmeChascNUFmcceySIXm+ACEVIkSpFAE=",
        "auth": "1SEHgOqvvvaC+gIOBeumAg=="
    }
};
var payload = 'Tim favorit Anda akan bertanding malam ini, jangan lupa nonton!';

var options = {
    gcmAPIKey: '852648096783',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);