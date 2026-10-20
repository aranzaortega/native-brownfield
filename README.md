# Native Brownfield Android App (Host Application)

This is a **Native Android (Kotlin)** host application built to integrate and run Expo & React Native modules via **Expo Brownfield Architecture**.

It serves as the native host container designed to connect with **[home-recipes-mobile](https://github.com/aranzaortega/home-recipes-mobile)** (a React Native Expo recipe app).

---

## 🔗 How `native-brownfield` Connects to `home-recipes-mobile`

| Repository | Purpose | Technology |
| :--- | :--- | :--- |
| **`native-brownfield`** *(this repo)* | Host Native Android Application | Kotlin, Android SDK, Gradle, `ReactActivityDelegateWrapper` |
| **[`home-recipes-mobile`](https://github.com/aranzaortega/home-recipes-mobile)** | React Native Expo Module / Screens | React Native, Expo (SDK 52), FlashList |

### Connection Architecture
1. **Host Integration**:
   - `native-brownfield` initializes the Expo runtime at app startup via `MainApplication.kt` using `ReactNativeHostWrapper` and `ApplicationLifecycleDispatcher`.
   - Native screens (built in Kotlin/Java) can embed or push Expo React Native views (such as the Recipe Feed from `home-recipes-mobile`) using `MyReactActivity.kt` or `ReactFragment`.

2. **Bi-Directional Communication Bridge**:
   - **Native ➔ Expo/React Native**: Native Android sends messages or data (e.g. user session, selected recipe IDs) using `CommunicationModule.sendEvent("NativeToExpoEvent", data)`.
   - **Expo/React Native ➔ Native**: React Native screens invoke native actions or send form data using `NativeCommunication.sendMessageToNative(data)`.

---

## 🏗️ Project Architecture & Key Files

```
native-brownfield/
├── App.js                                           # React Native Expo view with communication handlers
├── index.js                                         # React Native entry point
├── package.json & app.json                          # Expo (SDK 52) & React Native dependencies
├── settings.gradle                                  # Expo autolinking & Gradle settings plugin
├── README.md                                        # Documentation
└── app/
    ├── build.gradle                                 # Android app dependencies & React plugin
    └── src/main/
        ├── AndroidManifest.xml                      # Activity & Permission declarations
        └── java/com/example/nativebrownfield/
            ├── MainApplication.kt                   # Native Application class wrapping Expo runtime
            ├── MainActivity.kt                      # Pure Native Android screen with messaging UI
            ├── MyReactActivity.kt                   # ReactActivity delegate with ReactActivityDelegateWrapper
            ├── CommunicationModule.kt               # Native Module bridge for bi-directional events
            └── CommunicationPackage.kt              # ReactPackage registering CommunicationModule
```

---

## 🚀 How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Metro Bundler**:
   ```bash
   npx expo start
   ```

3. **Build & Launch Native Android App**:
   Open in Android Studio and click **Run**, or execute:
   ```bash
   ./gradlew assembleDebug
   ```

---

## 💬 Communication Code Snippets

### Sending from Native Android to Expo JS:
```kotlin
CommunicationModule.sendEvent("NativeToExpoEvent", "Recipe selected: #102")
```

```javascript
// In React Native (App.js or home-recipes-mobile component)
const eventEmitter = new NativeEventEmitter(NativeModules.NativeCommunication);
eventEmitter.addListener('NativeToExpoEvent', (event) => {
  console.log("Received from Android Native:", event.message);
});
```

### Sending from Expo JS to Native Android:
```javascript
// In React Native
NativeModules.NativeCommunication.sendMessageToNative("User saved a new recipe!");
```

```kotlin
// In Native Android (MainActivity.kt)
CommunicationModule.onMessageReceivedListener = { message ->
    runOnUiThread {
        statusTextView.text = message
    }
}
```
