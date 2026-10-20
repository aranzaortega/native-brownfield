package com.example.nativebrownfield

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class CommunicationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    init {
        instance = this
    }

    override fun getName(): String = "NativeCommunication"

    @ReactMethod
    fun sendMessageToNative(message: String) {
        onMessageReceivedListener?.invoke(message)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for NativeEventEmitter in React Native
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter in React Native
    }

    fun sendEventToJS(eventName: String, message: String) {
        val params = Arguments.createMap().apply {
            putString("message", message)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
        }
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    companion object {
        private var instance: CommunicationModule? = null
        var onMessageReceivedListener: ((String) -> Unit)? = null

        fun sendEvent(eventName: String, message: String) {
            instance?.sendEventToJS(eventName, message)
        }
    }
}
