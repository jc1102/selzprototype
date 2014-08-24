app.controller("mainController", ['$scope', '$http','$interval', function ($scope, $http, $interval) {
    $scope.songs = [];

    $scope.init = function () {
        $http.get('songs.json').success(function (data) {
            $scope.songs = data;
            // init the default song
            $scope.selected_song = data [0];
            $scope.total = $scope.selected_song.duration;

            $scope.songs.forEach(function (song) {
                var url = song.imgURL;
                if (url == null) {
                    song.imgURL = 'http://localhost/selzprototype/image/non-img.png';
                }
                song.time = Math.floor(song.duration / 60) + ':' + song.duration % 60;

            });
        }).error(function (error) {

        });
    };

    // Select songs
    $scope.select = function (currObj) {
        $scope.selected_song = currObj;
        $scope.total = currObj.duration;
        $scope.resetPlay();
        $scope.stopPlay();
    }
    // Playing icon
    $scope.playing = function (obj) {
        if (obj == $scope.selected_song){
            return true;
        }
        else {
            return false;
        }
    }


    //Progressing bar
    var stop;
    $scope.current = 0;
    $scope.play = function() {
        $scope.show = function() {
            return true;
        }
        //Don't start a play if we are already playing
        if (angular.isDefined(stop)) return;

        stop = $interval (function() {
            if ($scope.current < $scope.total) {
                $scope.current ++;
            } else {
                $scope.stopPlay();
            }
        }, 1000);
    };

    $scope.stopPlay = function () {
        $scope.show = function() {
            return false;
        }
        if (angular.isDefined (stop)) {
            $interval.cancel (stop);
            stop = undefined;
        }
    };
    $scope.resetPlay = function() {
            $scope.current = 0;
    };
    $scope.$on('$destroy',function() {
        // Make sure that the interval is destroyed too
        $scope.stopPlay();
    });

    $scope.getPercentage = function () {
        return ($scope.current / $scope.total)*100;
    }

}])

// Register the 'myCurrentTime' directive factory method.
    // We inject $interval and dateFilter service since the factory method is DI.
    .directive('myCurrentTime', ['$interval', 'dateFilter',
        function($interval, dateFilter) {
            // return the directive link function. (compile function not needed)
            return function(scope, element, attrs) {
                var format,  // date format
                    stopTime; // so that we can cancel the time updates

                // used to update the UI
                function updateTime() {
                    element.text(dateFilter(new Date(), format));
                }

                stopTime = $interval(updateTime, 1000);

                // listen on DOM destroy (removal) event, and cancel the next UI update
                // to prevent updating time after the DOM element was removed.
                element.on('$destroy', function() {
                    $interval.cancel(stopTime);
                });
            }
        }]);