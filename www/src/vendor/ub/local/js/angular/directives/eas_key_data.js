/*
    Directive:         eas-key-data
    Description:     Create a key data section on a page.
    Sample Usage: 
        HTML:
          <div data-eas-key-data data-keydata="my_key_data"></div>
        JS: 
          $scope.my_key_data = [
            [ 
                { label:'Name', data: $scope.record.last_name + ', ' + $scope.record.first_name + $scope.record.middle_name },
                { label:'Process Name', data:$scope.record.creation_process },
                { label:'ETS Key', data: $scope.record.ets_key },
            ],
            [ 
                { label:'Supplied SSN', data: $scope.record.supplied_social_security_num },
                { label:'Origin Date', data: $scope.record.creation_date },
                { label:'Error Message', data: $scope.record.error_code },
            ]
          ];
*/

angular.module('EASKeyData', []).directive('easKeyData', function() {
    return {
        scope: {
            keydata: "="
        },
        template: '<div class="box key-data-detail span12">' + '<table>' + '<tr>' + '  <td data-ng-repeat="column in keydata" class="span6">' + '  <table>' + '    <tr data-ng-repeat="match in column">' + '        <th class="pull-left">{{ match.label }}:</th>' + '        <td>{{match.data }}</td>' + '    </tr>' + '  </table>' + '  </td>' + '</tr>' + '</table>' + '</div>'
    }
});
