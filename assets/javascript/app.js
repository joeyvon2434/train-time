


//global variables
var trainName = '';
var trainDestination = '';
var firstTrain = '';
var frequency = 0;
var nextTrainMinutes = 0;
var nextTrain = '';


$(document).ready(function () {

    //firebase config
    var config = {
        apiKey: "AIzaSyAhavmKozAOiMtwbhwOrY0xKDVFYJbY27w",
        authDomain: "train-schedule-a8ba3.firebaseapp.com",
        databaseURL: "https://train-schedule-a8ba3.firebaseio.com",
        projectId: "train-schedule-a8ba3",
        storageBucket: "train-schedule-a8ba3.appspot.com",
        messagingSenderId: "402802281993"
    };


    firebase.initializeApp(config);

    var database = firebase.database();


    //click to send information to firebase
    $('#submit-button').on('click', function (event) {
        event.preventDefault();

        //read in new train information from form
        trainName = $('#train-name').val();
        $('#train-name').val('');
        trainDestination = $('#destination').val();
        $('#destination').val('');
        firstTrain = $('#first-train').val();
        $('#first-train').val('');
        frequency = $('#frequency').val();
        $('#frequency').val('');

        database.ref().push({
            name: trainName,
            destination: trainDestination,
            firstTrain: firstTrain,
            frequency: frequency
        });

    });

    //listen to firebase for child added and add a new train

    // get info for new train from firebase
    database.ref().on('child_added', function(snapshot) {

        console.log(snapshot.val().name);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().firstTrain);
        console.log(snapshot.val().frequency);

        trainName = snapshot.val().name;
        trainDestination = snapshot.val().destination;
        firstTrain = snapshot.val().firstTrain;
        frequency = snapshot.val().frequency;

       var minutesFromStart= -1 * moment(firstTrain, 'HH:mm').diff(moment(), 'minutes');
       console.log(minutesFromStart);

       //check if train has started
       if (minutesFromStart < 0) {
           nextTrainMinutes = -1 * minutesFromStart;
           nextTrain = firstTrain;
           console.log('minutes' + nextTrainMinutes);
           console.log('time: ' + nextTrain);
       } else {
           nextTrainMinutes = minutesFromStart % frequency;
           var temp = moment().add(nextTrainMinutes, 'minutes');
           nextTrain = moment(temp, 'x').format('HH:mm');
           console.log('minutes' + nextTrainMinutes);
           console.log('time: ' + nextTrain);
       }

       var newRow = $('<tr>');
       var nameTd = $('<td>');
       nameTd.text(trainName);
       newRow.append(nameTd);
       var destinationTd = $('<td>');
       destinationTd.text(trainDestination);
       newRow.append(destinationTd);
       var frequencyTd = $('<td>');
       frequencyTd.text(frequency);
       newRow.append(frequencyTd);
       var arrivalTd = $('<td>');
       arrivalTd.text(nextTrain);
       newRow.append(arrivalTd)
       var minutesTd = $('<td>');
       minutesTd.text(nextTrainMinutes);
       newRow.append(minutesTd);

       $('#train-display').append(newRow);



    });


}); //end document ready