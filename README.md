# axpress-ios

### Requirements to run project

- Node.js (Ultima version estable)

- Cordova e Ionic (npm install -g cordova ionic)

- Bower (npm install -g bower)

- If running on iOS (Xcode and it's requirements)

- If running on Android (Android SDK and ADB)

### Pasos a ejecutar para instalar las dependencias del proyecto y lograr la ejecucion

- Clone the project from git repository

- Run ```npm install && bower install```

- Run ```ionic state reset```

- Run ```ionic platform add ios```

- If previous command runs correctly, now we can run:
    ```ionic run ios``` (to run on device)
    ```ionic emulate ios``` (run on emulator)
    ```ionic build ios``` (build executable)