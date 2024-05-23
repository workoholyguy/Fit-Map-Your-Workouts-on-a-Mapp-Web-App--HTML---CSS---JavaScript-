# Fit Map Your Workouts on a Mapp Web-App (HTML + CSS + JavaScript)
 Web application designed to help users track their running and cycling workouts through an interactive map interface, leveraging geolocation and local storage for a seamless and persistent workout logging experience.

# Fit Map

Fit Map is a web application designed to track and map your workout sessions, providing a visual and data-driven approach to monitoring your fitness activities.

## Features

- **Workout Tracking**: Log your running and cycling workouts with distance, duration, and other relevant details.
- **Interactive Map**: Visualize your workouts on an interactive map powered by Leaflet.js.
- **Data Persistence**: Store and retrieve workout data using the browser's local storage.
- **Dynamic Interface**: Automatically update the UI with new workouts and provide quick access to previous sessions.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fit-map.git

2. Navigate to the project directory:
    ```bash
    cd fit-map

3. Open `index.html` in your preferred web browser.

## Usage

1. Logging Workouts:

* Approve the Geolocation Permission:
<img width="1439" alt="Usage 1" src="./Usage 1.png">

 View: 
  * Click anywhere on the map to start logging a new workout using the form that appears on a sidebar.
  * Fill in the form with workout details (type, distance, duration, etc.).
  * --> Click "Enter" to submit the work, which will create a workout Item and a Pin on a map.

<img width="1439" alt="Usage 2" src="./Usage 2.jpeg">

2. Viewing Workouts:

* Logged workouts will appear in the list on the sidebar.
* The page uses Web-Browser Local Storage to implement persistence.
<img width="1439" alt="Usage 3" src="./Usage 3.png">

* Click on any workout in the list to highlight its location on the map, the app will pan the map above the pin to which that workout relates.
<img width="1439" alt="Usage 4" src="./Usage 4.jpeg">

3. Clearing Workouts:

* Use the "Clear All Workouts" button to remove all logged workouts from the list and local storage. (Note You May Click Ctrl/Command+Shift+I to Summon Developer Tools --> Application --> Storage --> Local Storage). Click "Clear All Workouts"
<img width="1439" alt="Usage 5" src="./Usage 5.png">
<img width="1439" alt="Usage 6" src="./Usage 6.jpeg">

## Files

* **index.html**: Contains the structure of the web page, including the form for adding workouts and the container for displaying the map.
* **style.css**: Styles the HTML elements to provide a visually appealing interface.
* **script.js**: Implements the core functionality of the application, including event handling, data storage, and map interactions.

## Credits
* The Design and Web-Site Idea Inspired by Jonas Schmedtmann
