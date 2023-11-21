const { Expo } = require('expo-server-sdk')

const { expoToken } = require('config')

const expo = new Expo({ accessToken: expoToken })

module.exports = async (msg) => {
    return await expo.sendPushNotificationsAsync(msg)
}