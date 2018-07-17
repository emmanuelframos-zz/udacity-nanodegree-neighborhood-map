var app = angular.module('findpl4ce', []);

app.controller('FindPl4ceController', function (FindPl4ceService) {
    var vm = this;
    vm.locations = [];

    function init() {
        vm.getLocations();        
    }

    vm.getLocations = function(){
        vm.locations = FindPl4ceService.getLocations();
    }
   
    init();

});