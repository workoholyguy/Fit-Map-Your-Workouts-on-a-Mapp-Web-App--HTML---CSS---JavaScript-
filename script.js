'use strict';

class Workout {
  date = new Date();
  // To create a unique id, here we take the current date, convert it into a string using coersion by adding a string to a date, and then selecting the last 10 digits
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    // this.date = ...

    // this.id = ...
    this.coords = coords; // An array of [latitude, longitude]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    // Calling the func below within the constructor, so that's it's calcualted as soon as the object is created
    this.calcPace();
    this._setDescription();
  }
  // A Mehtod for Calculating the Pace
  calcPace() {
    // min / km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  // Defining a field
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.type = type
    this.calcSpeed();

    this._setDescription();
  }

  calcSpeed() {
    // km / h | duration property is expected i mins
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// Creating a new instance of a a "Running Class"
// Running constructor(coords, distance, duration, cadence)
// const run1 = new Running([39, -12], 5.2, 24, 178);

// // Cycling constructor(coords, distance, duration, elevationGain) {
// const cycling1 = new Cycling([39, -12], 27, 95, 523);

// console.log(run1, cycling1);
// Running {date: Tue May 21 2024 16:31:39 GMT-0400 (Eastern Daylight Time), id: '6323499486', coords: Array(2), distance: 5.2, duration: 24, …}

// Cycling {date: Tue May 21 2024 16:31:39 GMT-0400 (Eastern Daylight Time), id: '6323499486', coords: Array(2), distance: 27, duration: 95, …}

/*******************************************************/
/* APP ARCHITECTURE */
// --- 4 --- OOP ARCHITECTURE -- Refactoring the Code to Accomodate the project Architecture
/*******************************************************/

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const clearWorkouts = document.querySelector('.clear-all-workouts');

class App {
  // Since we want to refactor the code so that everything that has to do with an app is contained within and "App" class, we are RE!-creating these values that used to be global variables as private properties, which will be attached to every instance of an object
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  constructor() {
    // We are calling this nethod below, to trigger the constructor function which will createa an Instance of an "App" object as soon as the page loads
    this._getPosition();

    // Get Data from Local Storage
    this._getLocalStorage();

    /***************** */
    /**EVENT HANDLERS */
    /***************** */
    // ATTACHING EVENT LISTENERS TO A CONSTRUCTOR, BCS CONSRUCTOR IS CALLED AUTOMATICALLY WHEN THE OBJECT IS CREATED
    // --- 3 --- Render Workout Input Form On a map
    // Also since "this" keyword always points to an object that it is attached to, or the object that calls is, in this case, HTMLDom element, we need to fix it so that it points to an App Class Object
    form.addEventListener('submit', this._newWorkout.bind(this));

    // Changing the input Fields, depending on which workout is user trying to input
    inputType.addEventListener('change', this._toggleElevationField.bind(this));

    // An Event listener attached to a workouts container
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    // Button to clearing all of the workouts
    clearWorkouts.addEventListener('click', this.reset.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      // getCurrentPosition(callback on Success -- called w/ a parameter, callback on ERROR)
      //   Also here "getCurrentPosition" calls "this._loadMap" function, bcs of that "this._loadMap" is treated as a regular function call, but we need to be able to access the private property "#map" that was declared within the class "App" and for that we msut be able to use "this" keyword, which we cannot do now, bcs "this._loadMap" is treated as a regular function where "this" keyword is set to undefined ------------>
      //   navigator.geolocation.getCurrentPosition(this._loadMap, function () {

      // ------------> THerefore we are going to bind it manually
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your Location');
        }
      );
    }
  }
  _loadMap(position) {
    console.log(position);
    //   const latitude = position.coords.latitude
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    //   L - is a main function (its a name space)

    console.log(this);
    //   Storing the "map" object into a maps var
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    //   const map = L.map('map').setView([51.505, -0.09], 13);
    // 13 is a zoom level
    //   console.log(map);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //   L.marker([51.5, -0.09])
    //   L.marker(coords)
    //     .addTo(map)
    //     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //     .openPopup();

    // --- 2 --- ADD A MARKER TO THE MAP WHEREEVER THE USER CLICKS, USING THE COORDINATES OF A CLICK
    // When 'Click' event happens this function is called with an "event" var || HANDLING CLICKS ON MAP
    this.#map.on('click', this._showForm.bind(this));

    // Attaching the markers to the mape from the persistant local storage after the map loads
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    //Displaying the Workoutform, when the user clicks anywhere on the map
    form.classList.remove('hidden');
    // Setting the focus / cursor on the 1st field of the form
    inputDistance.focus();
  }
  _toggleElevationField() {
    // Dom Traversal Method, which Selects the closest parent of the element that contains "form__row" class
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    // Simple Helper function to validate the input
    // "(...inputs)" means the function can take an arbitrary number of inputs which are treated as an array called "inputs"
    // every() -- A js Method that loops over the "inputs" array and check whether each number in the array is finite or not. "every()" will return a boolean "True", only if the output of "Number.isFinite(inp)" is true for all the elements in the array
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    // A helper function to confirm that input values are also positive
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    // Get The Data From The Form
    const type = inputType.value;

    // We are using "+ to convert the value of distance into an int, bcs values of a "form" type HTML element is always string
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If Workout is "Running" --> Create a Running Object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if Data is Valid
      // 1) The Data must be int --// If the distance//duration//cadence is not a number, then return immediately
      if (
        // If what we expect to see as an input i.e. the numbers is satisfied, then output of "validInputs(distance, duration, cadence)" is true, and then inverted by "!" into false, which causes to skip the alert
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs must be positive numbers !');
      // Using guard clause i.e. check if the opposite of the desired value is true

      //   Now add a workout
      //   constructor(coords, distance, duration, cadence) {
      workout = new Running([lat, lng], distance, duration, cadence);
      console.log(workout);
    }
    // If Workout is "Cycling" --> Create a Cycling Object
    if (type === 'cycling') {
      // Check if Data is Valid
      const elevation = +inputElevation.value;

      //   Validation for cycling -- we don't check for elevation, bcs it may be negative if we are goign downhill
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert('Inputs must be positive numbers !');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
      console.log(workout);
    }
    // Pushing a new workout session object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Display Marker
    console.log(this.#mapEvent);

    // Render Workout on map as marker
    this._renderWorkoutMarker(workout);
    // Render Workout on List
    this._renderWorkout(workout);

    // Hide The Input form, when the form is submitted
    this._hideform();

    // Set Local Storage to all workouts
    this._setLocalStorage();
  }

  // Render Workout on map as marker
  _renderWorkoutMarker(workout) {
    // const { lat, lng } = this.#mapEvent.latlng; -- Has been taken out to move up, to be used in a workout creation process
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃🏻‍♂️' : '🚴🏻‍♂️'} ${workout.description}`
      )
      .openPopup();
  }

  // Render Workout on List
  _renderWorkout(workout) {
    // Create a DOM Element -- details that are relevant for both types of workout
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃🏻‍♂️' : '🚴🏻‍♂️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;

    // Adding details relevant for a Running Workout only
    if (workout.type == 'running') {
      html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
        `;
    }

    // Adding details relevant for a Cycling Workout only
    if (workout.type == 'cycling') {
      html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
        `;
    }

    // Close the list item tag
    html += `</li>`;

    // Insert the element as a sibling, NOT a child, NOT a parent
    // Insert into the HTML when the new Workout is created
    form.insertAdjacentHTML('afterend', html);
  }

  //   Hide the form on Submit
  _hideform() {
    // + Clear Input Fields
    //   Clear Input Fields after the Workout FOrm is Submitted
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Hiding the form, to create and animation effect where the new workout item list replaces the form
    form.style.display = 'none';
    // Hide the Form
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 100);
  }

  // --- 5 --- Using Event delegation to attached Add the map panning functionality
  _moveToPopup(e) {
    // The function attaches it self to a closest parent that contains "workout" class
    // The main point is that we are able to attach event listener to an element that doesn't yet exist, but we know that it will have a "workout" class

    // Regardles of what corner or edge of the element we clisk, the whole eleemt is selected and stored into "workoutEl", it's important bcs, we wanna be able to access "id" property of each element

    // We can now find the marker on the map to which we need to move the view, bcs we have the id of that marker
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
    // <li class="workout workout--running" data-id="6341071118">

    // don't do anything if theuser is not clicking on any of the workout list itmes
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);

    // "setView" -- leafLet Library Method
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1, // 1 second to pan the camera
      },
    });

    // Using Public Interface
    // workout.click();
  }

  // --- 6 --- Using a local Storage o Implement Data Persistance
  _setLocalStorage() {
    // "localStorage" is an API Provided by the Browser
    // localStorage.setItem('name/key', String value )
    // We are trying to set add the object to a local storage, but the API expects a string, so we will convert the Object into a String using "JSON.stringify()" method
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // ---7--- Retrieving the information from the local storage

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    console.log(data);

    if (!data) return console.log('No Data In Local Storage');
    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  //   API Method -- to clear the local storage all at once -- reload the page to see the result -- type "app.reset()" to use the method
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
// app._getPosition()
