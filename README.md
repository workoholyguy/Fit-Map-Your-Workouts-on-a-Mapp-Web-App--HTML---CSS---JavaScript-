# Fit Map Your Workouts on a Mapp Web-App (HTML + CSS + JavaScript)
 Web application designed to help users track their running and cycling workouts through an interactive map interface, leveraging geolocation and local storage for a seamless and persistent workout logging experience.

# DEMO: [Fit Map Video Demo](https://website-name.com](https://www.loom.com/share/21a3983dacc646548872a52db8ec0a2a?sid=344b014c-ee86-4bb6-9816-ee9383e9e337 )

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

## STRUCTURE:
* Whole App Forkflow: 
<img width="1439" alt="FitJourney -flowchart." src="./FitJourney -flowchart.png">

### Workflow:

**Page Loads:**
- Get the user's current location coordinates.
- Render the map centered on the current location.
- Load workouts from local storage and render them on the map and in the list.

**User Interactions:**
- **Click on Map:**
  - Render the workout form to input workout details.
  - User submits the new workout form, which adds the workout to the list and places a marker on the map.
  
- **Click on Workout in List:**
  - Move the map to the corresponding workout marker.

- **Submit Workout Form:**
  - Save the new workout details.
  - Update the UI with the new workout in the list and on the map.
  - Store the new workout in local storage.

**Flowchart:**
- Page loads.
- Get current location coordinates.
- Render map on current location.
- Load workouts from local storage (if any).
- User clicks on the map to add a workout.
- Render workout form.
- User submits the workout form.
- Render workout on map and in list.
- Store workout in local storage.
- User can click on workout in list to move map to workout location.

* Object Architecture: 
<img width="1439" alt="Final Architecture" src="./FitJourney-architecture-final.png">

#### Class Structure and Relationships

**Class Workout:**
- **Properties:**
  - `id`: Unique identifier for the workout.
  - `distance`: Distance of the workout.
  - `duration`: Duration of the workout.
  - `coords`: Coordinates where the workout took place.
  - `date`: Date when the workout was logged.
  - `clicks`: Number of times the workout entry was clicked.

- **Methods:**
  - `constructor()`: Initializes a new workout instance with the given properties.
  - `click()`: Handles the click event on the workout entry.
  - `_setDescription()`: Sets a description for the workout.

**Child Class Running (inherits from Workout):**
- **Additional Properties:**
  - `cadence`: Steps per minute.
  - `pace`: Minutes per kilometer.

- **Methods:**
  - `constructor()`: Initializes a new running workout with specific properties.
  - `calcPace()`: Calculates the pace of the running workout.

**Child Class Cycling (inherits from Workout):**
- **Additional Properties:**
  - `elevationGain`: Elevation gain during the workout.
  - `speed`: Speed of the cycling workout.

- **Methods:**
  - `constructor()`: Initializes a new cycling workout with specific properties.
  - `calcSpeed()`: Calculates the speed of the cycling workout.

**Class App:**
- **Properties:**
  - `workouts`: Array to store all workout instances.
  - `map`: The Leaflet map instance.
  - `mapZoomLevel`: The zoom level for the map.

- **Methods:**
  - `constructor()`: Initializes the application and sets up event listeners.
  - `_getPosition()`: Gets the user's current position.
  - `_loadMap(position)`: Loads the map centered on the given position.
  - `_showForm()`: Displays the workout form.
  - `_toggleElevationField()`: Toggles the visibility of the elevation field based on the workout type.
  - `_newWorkout()`: Creates a new workout and adds it to the map and the list.
  - `_renderWorkout(workout)`: Renders the workout entry in the list.
  - `_renderWorkoutMarker(workout)`: Adds a marker for the workout on the map.
  - `_setLocalStorage()`: Saves workouts to local storage.
  - `_getLocalStorage()`: Retrieves workouts from local storage.
  - `_moveToPopup(e)`: Moves the map to the workout marker when the workout entry is clicked.
  - `reset()`: Clears all workouts from the map and local storage.


## Files

* **index.html**: Contains the structure of the web page, including the form for adding workouts and the container for displaying the map.
* **style.css**: Styles the HTML elements to provide a visually appealing interface.
* **script.js**: Implements the core functionality of the application, including event handling, data storage, and map interactions.

## Credits
* The Design and Web-Site Idea Inspired by Jonas Schmedtmann
