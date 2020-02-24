import React, { Component } from 'react';
import { render } from 'react-dom';

//react-redux
import { createStore } from 'redux';

//引入redux的reducer（同層的reducer.js）
import reducer from './Reducer/RootReducer';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

// 儲存 state 'window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()'可以開啟redux的擴展套件
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

import { GoogleMap, LoadScript, MarkerClusterer, Marker, StandaloneSearchBox } from '@react-google-maps/api';

require('./bootstrap');

var ATLANTIC_OCEAN = {
    latitude: 24,
    longitude: 121.644
};

let markerArr = []; 
let shops = [];

export class MapInput extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            //cardcategory : 'gongguan', //guting
            showType: 'gongguan',
            shops: [],
            name: '',
            tel: '',
            addr: '',
            resultsMap: '',
            isGeocodingError: false,
        };
    }

    /*clickSearchBtn = () =>{
        this.call_searchResult();
    }*/

    call_searchResult = (showType) => {
        this.deleteMarkers();
        // api 抓 state 的 showType
        console.log(showType);
        this.setState({
            showType: showType
        });

        fetch(this.state.showType == 'gongguan'? 'https://trello.com/card/5da2c8a3f11397244be7ad22/-.json': 'https://trello.com/card/5da5b564ca7ce5220c35c047/-.json', {})
        .then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            shops = jsonData.checklists;
            this.setState({
                shops: shops
            });
            jsonData.checklists.map((datas, i) => {
                this.geocoder = new google.maps.Geocoder();
                this.geocoder.geocode({ 'address': datas.checkItems[0].name }, function handleResults(results, status) {
        
                    if (status === google.maps.GeocoderStatus.OK) {
                        this.markers = new google.maps.Marker({
                            position: {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            },
                            draggable:false,
                            map: this.state.resultsMap,
                            label: (i + 1).toString()
                        });

                        var infowindow = new google.maps.InfoWindow({
                            content:  datas.name,
                            position: { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() },
                            maxWidth:200,
                            pixelOffset: new google.maps.Size(0, -50)
                        });

                        //infowindow.open(resultsMap, this.markers);

                        this.markers.addListener('click',function(){
                            
                        });
                
                        this.state.resultsMap.setCenter(results[0].geometry.location);
                        markerArr.push(this.markers); 
                
                        return;
                    }
                    
                    this.state.resultsMap.setCenter({
                        lat: ATLANTIC_OCEAN.latitude,
                        lng: ATLANTIC_OCEAN.longitude
                    });

                }.bind(this));
            });
        }).catch((err) => {
            console.log('error:', err);
        });
    }

    deleteMarkers = () => {
        //清空marker array 
        for (var i = 0; i < markerArr.length; i++) {   
            markerArr[i].setMap(null);   
        }
        //清空店家array
        shops = [];
        this.setState({
            shops: shops
        });
        markerArr = [];   
    };

    getShop = (e) => {
        console.log(e.currentTarget.getAttribute('data-mode'));
        var result = this.state.shops.map((shop, i) => {
            return shop.id;
        }).indexOf(e.currentTarget.getAttribute('data-mode'));

        this.setState({
            name: this.state.shops[result].name,
            tel: this.state.shops[result].checkItems[0].name,
            addr: this.state.shops[result].checkItems[1].name
        });
    }

    render(){
        //key是自己帳戶的 libraries={["places"]}
        console.log(this.state);
        return (
            <React.Fragment>
                <div className="container pt-5 pb-5" id="app">
                    <h1 className="h3 text-center"></h1>
                    <hr className="mt-5 mb-5"/>
                    <div className="row">
                        {/*<!-- 店家清單-->*/}
                        <div className="col-md-6">
                            {/*<!-- 選擇站--> active*/}
                            <div className="row mb-4">
                                <div className="col text-center">
                                    <button className="btn btn-lg mr-2 btn-outline-warning" type="button" 
                                        data-mode={'gongguan'} onClick={(e)=>{this.call_searchResult(e.currentTarget.getAttribute('data-mode'))}}>
                                        <span className="h2">公館站</span>
                                    </button>
                                    <button className="btn btn-lg ml-2 btn-outline-warning" type="button"
                                        data-mode={'guting'} onClick={(e)=>{this.call_searchResult(e.currentTarget.getAttribute('data-mode'))}}>
                                        <span className="h2">古亭站</span>
                                    </button>
                                </div>
                            </div>
                            {/*<!-- 清單-->*/}
                            <div className="row">
                                <div className="col">
                                    <div className="card mb-3">
                                        <h5 className="card-header text-center">{} 店家</h5>
                                        <div className="list-group list-group-flush">
                                            {this.state.shops.map(shop =>{
                                                return (
                                                    <button key={shop.id} data-mode={shop.id} className="list-group-item list-group-item-action" onClick={(e)=>{this.getShop(e)}}> {shop.name} </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!-- 詳細資料-->*/}
                        <div className="col-md-6">
                            <div className="card border-light">
                                <h5 className="card-header text-center">詳細資訊</h5>
                                <div className="card-body">
                                    <h4 className="mb-3">{this.state.name}</h4>
                                    <p className="mb-1">{this.state.tel}</p>
                                    <p className="mb-2">{this.state.addr}</p>
                                    {/* google map部分 */}
                                    <LoadScript id="script-loader" googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                                        { }
                                        <GoogleMap id="searchbox"
                                            onLoad={resultsMap => {
                                                this.setState({
                                                    resultsMap: resultsMap
                                                });
                                                this.call_searchResult(this.state.showType);
                                            }}
                                            mapContainerStyle={{
                                                height: "300px", 
                                                width: "500px",
                                            }}
                                            options={{
                                                styles: [
                                                    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                                                    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                                                    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                                                    {
                                                    featureType: 'administrative.locality',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#d59563'}]
                                                    },
                                                    {
                                                    featureType: 'poi',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#d59563'}]
                                                    },
                                                    {
                                                    featureType: 'poi.park',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#263c3f'}]
                                                    },
                                                    {
                                                    featureType: 'poi.park',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#6b9a76'}]
                                                    },
                                                    {
                                                    featureType: 'road',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#38414e'}]
                                                    },
                                                    {
                                                    featureType: 'road',
                                                    elementType: 'geometry.stroke',
                                                    stylers: [{color: '#212a37'}]
                                                    },
                                                    {
                                                    featureType: 'road',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#9ca5b3'}]
                                                    },
                                                    {
                                                    featureType: 'road.highway',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#746855'}]
                                                    },
                                                    {
                                                    featureType: 'road.highway',
                                                    elementType: 'geometry.stroke',
                                                    stylers: [{color: '#1f2835'}]
                                                    },
                                                    {
                                                    featureType: 'road.highway',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#f3d19c'}]
                                                    },
                                                    {
                                                    featureType: 'transit',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#2f3948'}]
                                                    },
                                                    {
                                                    featureType: 'transit.station',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#d59563'}]
                                                    },
                                                    {
                                                    featureType: 'water',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#17263c'}]
                                                    },
                                                    {
                                                    featureType: 'water',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#515c6d'}]
                                                    },
                                                    {
                                                    featureType: 'water',
                                                    elementType: 'labels.text.stroke',
                                                    stylers: [{color: '#17263c'}]
                                                    }
                                                ]
                                            }}
                                            zoom={15}
                                            center={{lat: 24, lng: 121.644}}
                                        >
                                        </GoogleMap>
                                    </LoadScript>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    ...state
});

render(<Provider store={store}><MapInput /></Provider>, document.getElementById('mapWrapper'));

export default connect(mapStateToProps)(MapInput);
//export default MapInput;

