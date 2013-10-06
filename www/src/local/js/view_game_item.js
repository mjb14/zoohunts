var viewGameItemModule = angular.module('viewGameItem', []);

viewGameItemsModule.config(['$routeProvider', '$locationProvider', 
    function ($routeProvider, $locationProvider) {
                
        $routeProvider.when('/view-game-item/:poi_id', {
            templateUrl: 'src/local/views/view-game-item.tpl.html',
            controller: 'ViewGameItemController'
        });
        
    }
]);

viewGameItemModule.controller('ViewGameItemController', [
    '$scope', 'Entity', '$q', '$routeParams', '$location',
    function ($scope, Entity, $q, $routeParams, $location) {
 
    var poi_id = $routeParams.poi_id;

    var game_instance = QR.game_instance;
    
    $scope.current_item = QR.findKey(game_instance.pois, {
        "poi_id": poi_id
    });
    
    // loop over the clues, on first unviewed clue, flip the bit
    $scope.showNextClue = function() {
        var keepGoing = true;
        var hasAnotherClue = false;
        var lastViewedCluePoints = 0;
        angular.forEach($scope.current_item.clues, function(v,i) {
            if( keepGoing ) {                
                if( !v.viewed ) {
                    v.viewed = 1;
                    lastViewedCluePoints = v.clue_point_value;
                    keepGoing = false;
                    
                    // if this was last item, flip back to true so falls through on next check
                    if( i === $scope.current_item.clues.length-1) {
                        keepGoing = true;
                    }
                    
                }
            }
        });
        
        // If not keep going, then this item has no more clues
        // flip the bit that this is now complete and post to server
        if( keepGoing ) {
            // mark item as complete
            $scope.current_item.is_completed = 1;
            
            // take the clue point value and map it directly to the item
            $scope.current_item.points = lastViewedCluePoints;
            
            // set the next current item
            var index = game_instance.pois.indexOf($scope.current_item);
            if( index < game_instance.pois.length -1 ) {
                game_instance.pois[index+1].is_current = 1;
                game_instance.pois[index].is_current = 0;
            }

            // if no more POI, game is over
            if( index == game_instance.pois.length -1 ) {
                console.log("game is over!");
                
            }
            
            // TODO: send to server
        }
        
    }
    
    $scope.hasMoreClues = function() {
        
    }
    
    $scope.backToList = function() {
        $location.path('/view-game-items/' + game_instance.game_instance_id);
    }
    
    $scope.scan_result;
    
    $scope.setText = function(text) {
        
        $scope.$apply(function(){
            
            // see if its correct
            if( $scope.current_item.qr_answer_code == text ) {
                $scope.scan_result = 'Success';
            } else {
                $scope.scan_result = 'Incorrect - try getting another clue.';
            }
        });
    }
    
    $scope.checkAnswer = function() {
         try {
            var scanner = cordova.require("cordova/plugin/BarcodeScanner");

            
            scanner.scan( function (result) { 
      
/*
                alert("We got a barcode\n" + 
                "Result: " + result.text + "\n" + 
                "Format: " + result.format + "\n" + 
                "Cancelled: " + result.cancelled);  

               console.log("Scanner result: \n" +
                    "text: " + result.text + "\n" +
                    "format: " + result.format + "\n" +
                    "cancelled: " + result.cancelled + "\n");
  */
  

            $scope.setText(result.text);
             
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */

            }, function (error) { 
                $('#console').html("Scanning failed: " + error); 
            } );
        } catch (ex) {
            $('#console').html(ex.message);
        }
        
        
    }
    

}]);

