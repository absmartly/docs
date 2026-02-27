import com.absmartly.android.sdk.ABSmartlyAndroid

val sdk = ABSmartlyAndroid.Builder()
    .endpoint("https://your-company.absmartly.io/v1")
    .apiKey(BuildConfig.ABSMARTLY_API_KEY)
    .application("my-android-app")
    .environment("production")
    .androidContext(applicationContext)
    .build()
