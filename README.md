
# Installation Guide for My Expo Project

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Node.js**  
   - Download and install the latest LTS version from [Node.js Official Website](https://nodejs.org/).

2. **Expo CLI**  
   - Install Expo CLI globally using npm or yarn:  
     ```bash
     npm install -g expo-cli
     ```
     or  
     ```bash
     yarn global add expo-cli
     ```

3. **Git**  
   - Ensure Git is installed for version control. [Download Git](https://git-scm.com/).

4. **Code Editor (Optional)**  
   - Install a code editor like [Visual Studio Code](https://code.visualstudio.com/).

## Installation Steps

1. **Clone the Repository**  
   Open a terminal and clone the repository to your local machine:  
   ```bash
   git clone https://github.com/kritikhedau/HealthFlex
   ```

2. **Navigate to the Project Directory**  
   Move into the project folder:  
   ```bash
   cd your-repo-name
   ```

3. **Install Dependencies**  
   Install all required npm packages by running:  
   ```bash
   npm install
   ```

4. **Start the Development Server**  
   Launch the Expo development server:  
   ```bash
   npx expo start --clear
   ```

   - You’ll see a QR code in the terminal or Expo Developer Tools in your browser.

5. **Run the App on Your Device or Emulator**  
   - **On a physical device**: Install the [Expo Go](https://expo.dev/client) app on your iOS or Android device. Scan the QR code using your camera or the Expo Go app.  
   - **On an emulator/simulator**: Follow these instructions to set up an [Android Emulator](https://developer.android.com/studio/run/emulator) or [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/).

## Notes

- If you encounter issues, make sure all dependencies are up-to-date by running:  
  ```bash
  expo upgrade
  ```
- For troubleshooting, check the [Expo Documentation](https://docs.expo.dev/).
