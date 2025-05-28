package com.connectxreactnativesdk

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ConnectXReactNativeSdkModule.NAME)
class ConnectXReactNativeSdkModule(private val reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext){

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun getNetworkType(promise: Promise) {
      try {
          val connectivityManager =
    reactContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

          val network = connectivityManager.activeNetwork
          val capabilities = connectivityManager.getNetworkCapabilities(network)

          val type = when {
              capabilities == null -> "none"
              capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "wifi"
              capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "cellular"
              else -> "unknown"
          }

          promise.resolve(type)
      } catch (e: Exception) {
          promise.reject("NETWORK_ERROR", e.message)
      }
  }

  companion object {
    const val NAME = "ConnectXReactNativeSdk"
  }
}
