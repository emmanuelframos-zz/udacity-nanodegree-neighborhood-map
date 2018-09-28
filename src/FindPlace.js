import React, { Component } from 'react';
import './FindPlace.css';
import { placeList } from './places.js';
import loadMap from 'react-async-script-loader';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import fetchJsonp from 'fetch-jsonp';

let markers = [];
let infoWindows = [];

class FindPlace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: placeList,
      map: {},
      searchQuery: '',
      mapLoaded: true,
      selectedMarker:'',
      data:[]
    }
  }
  
  updateSearchQuery = (searchQuery) => {
    this.setState({searchQuery: searchQuery})
  }
  
  updateData = (newData) => {
    this.setState({
      data:newData,
    });
  }

  componentWillReceiveProps({isScriptLoadSucceed}){    
    if (isScriptLoadSucceed) {      
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,      
        center: new window.google.maps.LatLng(-23.5489,-46.6388),        
      });
      this.setState({map:map});
    }else {     
      console.log("Error on load Google Map.");
      this.setState({mapLoaded: false})
    }
  }

  componentDidUpdate(){
    const {places, searchQuery, map} = this.state;
    
    let filteredPlaces = places;

    if (searchQuery){
      const match = new RegExp(escapeRegExp(searchQuery), 'i')
      filteredPlaces = places.filter((place)=> match.test(place.name))
    }else{
      filteredPlaces = places;
    }

    markers.forEach(mark => { mark.setMap(null) });

    markers = [];
    infoWindows = [];

    filteredPlaces.map((marker,index)=> {
        let getData = this.state.data.filter((single)=>marker.title === single[0][0]).map(item2=>
          {if (item2.length===0)
               return 'No Contents Have Been Found Try to Search Manual'
           else if (item2[1] !=='')
               return item2[1]
           else
               return 'No Contents Have Been Found Try to Search Manual'
          }
        );
      
        let getLink = this.state.data.filter((single)=>marker.title === single[0][0]).map(item2=>
          {if (item2.length===0)
                return 'https://www.wikipedia.org';
            else if (item2[1] !=='')
                return item2[2];
            else
                return 'https://www.wikipedia.org';          
          }
        );
      
        let content =
          `<div tabIndex="0" class="infoWindow">
              <h4>${marker.title}</h4>
              <p>${getData}</p>
              <a href=${getLink}>Click Here For More Info</a>        
          </div>`
        
        let addInfoWindow = new window.google.maps.InfoWindow({
          content: content,
        });        
        
        let bounds = new window.google.maps.LatLngBounds();
        
        let addmarker = new window.google.maps.Marker({
          map: map,
          position: marker.location,
          animation: window.google.maps.Animation.DROP,
          name : marker.title
        });
                
        markers.push(addmarker);
        
        infoWindows.push(addInfoWindow);
        
        addmarker.addListener('click', function() {            
            infoWindows.forEach(info => { info.close() });
            addInfoWindow.open(map, addmarker);
            
            if (addmarker.getAnimation() !== null) {
              addmarker.setAnimation(null);
            } else {            
              addmarker.setAnimation(window.google.maps.Animation.BOUNCE);
              setTimeout(() => {addmarker.setAnimation(null);}, 400)
            }
        });
                
        markers.forEach((m)=>
          bounds.extend(m.position)
        );
        
        map.fitBounds(bounds);
    });
  }

  componentDidMount(){
    this.state.places.map((place,index)=>{
      return fetchJsonp(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${place.name}&format=json&callback=wikiCallback`)
            .then(response => response.json()).then((responseJson) => {
                let newData = [...this.state.data,[responseJson,responseJson[2][0],responseJson[3][0]]]
                this.updateData(newData)
            }).catch(error =>
                console.error(error)      
            )
      })
  }

  listItem = (item, event) => {
    let selected = markers.filter((currentOne)=> currentOne.title === item.name);
    window.google.maps.event.trigger(selected[0], 'click');
  }
  
  handleKeyPress(target,item,e) {
    if(item.charCode===13)
       this.listItem(target,e);   
 }

 render() {
  const {places, searchQuery, mapLoaded} = this.state;

    let filteredPlaces
  
    if (searchQuery){
      const match = new RegExp(escapeRegExp(searchQuery),'i')
      filteredPlaces = places.filter((place)=> match.test(place.name))
    }else{
      filteredPlaces = places;
    }

    filteredPlaces.sort(sortBy('name'));

    return (
        mapLoaded ? (
          <div>
            <nav className="nav">
              <span id="subject">FindPl4ce</span>
            </nav>
            <div id="container">
              <div id="map-container">
                <div id="map"></div>
              </div>
              <div className='listView'>
                  <input id="textToFilter" className="form-control" type="text" placeholder="Filter Place"
                    value={searchQuery}
                    onChange={(event)=> this.updateSearchQuery(event.target.value)}
                  />
              
                  <ul>    
                      {filteredPlaces.map((getLocation, index)=>
                        <li className="place" 
                            key={index} 
                            tabIndex={index+2} 
                            area-labelledby={`View details for ${getLocation.name}`} 
                            onKeyPress={this.handleKeyPress.bind(this,getLocation)} 
                            onClick={this.listItem.bind(this,getLocation)}>
                            {getLocation.name}
                        </li>)}
                  </ul>
              </div>
            </div>
          </div>
        ) 
        : 
        (
          <div>
            <h1>Cannot load Google Map...</h1>
          </div>
        )
    )
  }
}

export default loadMap(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyCosAutXVlJSgA9oiXHzm46gxfA_USeCNk&v=3.exp`]
)(FindPlace);
