function initMap() {
    var saoPaulo = {lat: -23.533773, lng: -46.625290};
    
    var map = new google.maps.Map(document.getElementById('map'), {center: saoPaulo, zoom: 8});
    
    var marker = new google.maps.Marker({position: saoPaulo, map: map});
}