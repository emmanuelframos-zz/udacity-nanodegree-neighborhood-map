import React, { Component } from 'react';
import './FindPlace.css';
import scriptLoader from 'react-async-script-loader';
import { wikipediaGenericUrl, wikipediaSearchUrl } from './env';
import { placeList } from './places.js';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import fetchJsonp from 'fetch-jsonp';

let markers = [];
let informations = [];

class FindPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: placeList,
      map: {},
      query: '',
      mapLoaded: true,
      data: []
    }
  }

  refreshSearch = (query) => {
    this.setState({ query: query });
  }

  refreshData = (newData) => {
    this.setState({ data: newData });
  }

  componentWillReceiveProps({ isScriptLoadSucceed }) {
    if (isScriptLoadSucceed) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new window.google.maps.LatLng(39.956623, -75.189933),
      });
      this.setState({ map: map });
    } else {
      alert("Cannot load Google Map. Please refresh the page. ");
      this.setState({ mapLoaded: false })
    }
  }

  componentDidUpdate() {
    const { places, query, map } = this.state;

    let placesExhibited = places;

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      placesExhibited = places.filter((place) => match.test(place.name))
    } else {
      placesExhibited = places
    }

    markers.forEach(mark => { mark.setMap(null) });

    markers = [];
    informations = [];

    placesExhibited.map((marker, index) => {
      
      let placeInformation = this.state.data
        .filter((single) => marker.name === single[0][0])
        .map(item2 => {
          return (item2[1] !== '') 
            ? item2[1] 
            : 'No informations found.';
        }
      );

      let placeLink = this.state.data.filter((single) => marker.name === single[0][0]).map(item2 => {
        return (item2[1] !== '') 
          ? item2[2] 
          : wikipediaGenericUrl;
      });

      let content =
        `<div tabIndex="0" class="infoWindow">
          <h4>${marker.name}</h4>
          <p>${placeInformation}</p>
          <a href=${placeLink}>Click Here For More Info</a>        
        </div>`

      let addInfoWindow = new window.google.maps.InfoWindow({
        content: content,
      });
      
      let bounds = new window.google.maps.LatLngBounds();
      
      let addmarker = new window.google.maps.Marker({
        map: map,
        position: marker.coordinates,
        animation: window.google.maps.Animation.DROP,
        name: marker.name
      });
      
      markers.push(addmarker);
      
      informations.push(addInfoWindow);
      
      addmarker.addListener('click', function () {      
        informations.forEach(info => { info.close() });
        addInfoWindow.open(map, addmarker);
       
        if (addmarker.getAnimation() !== null) {
          addmarker.setAnimation(null);
        } else {          
          addmarker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => { addmarker.setAnimation(null); }, 400)
        };
      })

      markers.forEach((m) => bounds.extend(m.position));
      map.fitBounds(bounds);
    });
  }

  componentDidMount() {
    this.state.places.map((place, index) => {
      return fetchJsonp(wikipediaSearchUrl.replace('$place', place.name))
        .then(response => response.json()).then((responseJson) => {
          let newData = [...this.state.data, [responseJson, responseJson[2][0], responseJson[3][0]]];
          this.refreshData(newData);
        }).catch(error => {
          console.error(error);
          alert("Cannot find place on Wikipedia. Please refresh the page.");
        });
    });
  }

  listItem = (item, event) => {
    let selected = markers.filter(
      (currentOne) => currentOne.name === item.name
    );

    window.google.maps.event.trigger(selected[0], 'click');
  }

  handleKeyPress = (target, item, e) => {
    if (item.charCode === 13) {
      this.listItem(target, e);
    }
  }

  render() {

    const { places, query, mapLoaded } = this.state;

    let placesExhibited = {};

    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i');
      placesExhibited = places.filter((place) => match.test(place.name));
    }else {
      placesExhibited = places;
    }

    placesExhibited.sort(sortBy('name'));

    return (
      mapLoaded ? (
        <div>
          <nav className="nav">
            <span tabIndex='0'>FindPl4ce - Places in Brazil</span>
          </nav>
          <div id="container">
            <div id="map-container" tabIndex="-1">
              <div id="map" aria-label="Places in Brazil"></div>
            </div>
            <div className='place-list'>
              <input id="place-filter" 
                className='form-control' 
                type='text'
                placeholder='Filter Place...'
                value={query}
                onChange={(event) => this.refreshSearch(event.target.value)}                
                aria-labelledby="Search a Place"
                tabIndex="1" />
              <ul className="place-item" aria-labelledby="list of places" tabIndex="1">
                {placesExhibited.map((place, index) =>
                  <li key={index} tabIndex={index + 2}
                    area-labelledby={`Informations of ${place.name}`} onKeyPress={this.handleKeyPress.bind(this, place)} onClick={this.listItem.bind(this, place)}>{place.name}</li>)}
              </ul>
            </div>
          </div>
        </div>
      ) : (
          <div>
            <h1>Cannot load Google Map</h1>
          </div>
        )
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyCosAutXVlJSgA9oiXHzm46gxfA_USeCNk&v=3.34`]
)(FindPlace);