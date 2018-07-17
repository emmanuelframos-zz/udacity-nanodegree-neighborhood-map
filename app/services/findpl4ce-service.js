angular.module('findpl4ce').service('FindPl4ceService', function(){
    var self = this;
    var locations = [];

    self.getLocations = function(){
        for (index=0; index<3; index++){
            var location = {};
            location.name = "Place " + index;
            locations[index] = location;
        }

        return locations;
    }
});