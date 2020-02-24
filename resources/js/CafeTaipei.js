import React, { Component } from 'react';
import { render } from 'react-dom';

//react-redux
import { createStore } from 'redux';

//引入redux的reducer（同層的reducer.js）
import reducer from './Reducer/RootReducer';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import MaterialIcon, {colorPalette} from 'material-icons-react';

// 儲存 state 'window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()'可以開啟redux的擴展套件
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

import { GoogleMap, LoadScript, MarkerClusterer, Marker, StandaloneSearchBox } from '@react-google-maps/api';

require('./bootstrap');

var ATLANTIC_OCEAN = {
    latitude: 24,
    longitude: 121.6
};

let markerArr = []; 
let items = [];

export class TripSchedule extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showDay: 1,
            schedule: [],
            detail:{
                id:'',
                time:'',
                title: '',
                location:'',
                opentime:'',
                info:'',
                remark:'',
                position: ''
            },
            resultsMap: '',
            mapPosition: {lat: 24, lng: 121.6},
            isGeocodingError: false,
        };
    }

    /*clickSearchBtn = () =>{
        this.call_searchResult();
    }*/

    call_searchResult = (showDay) => {
        this.deleteMarkers();
        console.log(showDay);
        this.setState({
            showDay: showDay
        });

        //fetch('https://spreadsheets.google.com/feeds/list/1-mfrR6RcONMqUDWK1WWHMrYOXk4lQUvC_tC6s3uYDBs/'+ showDay +'/public/values?alt=json', {})
        //fetch('https://spreadsheets.google.com/feeds/list/13e7kfTKQ8hcA1Ds6BjMeOJw0fVyvjL8_Iib_ud3q9Wc/'+ showDay +'/public/values?alt=json', {})
        fetch('https://spreadsheets.google.com/feeds/list/1IXJkupiIGbGFgMUbm8p1yBZVqAKYrpAFKZZ_f_KeMds/1/public/values?alt=json', {})
        .then((response) => {
            return response.json(); 
        }).then((jsonData) => {
            console.log(jsonData);
            let data = jsonData.feed.entry;
            console.log('data = ', data);
            
            for(let i in data) {
                let item = {};
                item.id = parseInt(i) + 1;
                item.time = data[i].gsx$time.$t;
                item.type = data[i].gsx$type.$t;
                item.title = data[i].gsx$title.$t;
                item.tel = data[i].gsx$tel.$t;
                item.location = data[i].gsx$location.$t;
                item.opentime = data[i].gsx$opentime.$t;
                item.info = data[i].gsx$info.$t;
                item.remark = data[i].gsx$remark.$t;
            
                items.push(item);
            }
            
            console.table(items);

            this.setState({
                schedule: items
            });

            this.state.schedule.map((datas, i) => {
                this.geocoder = new google.maps.Geocoder();
                this.geocoder.geocode({ 'address': datas.location }, function handleResults(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        //加入座標位置
                        datas.position = results[0].geometry.location;
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

                        markerArr.push(this.markers);
                        this.state.resultsMap.setCenter(results[0].geometry.location);

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
        for (var i = 0; i < markerArr.length; i++)
            markerArr[i].setMap(null);   
        
        //清空行程array
        items = [];
        this.setState({
            schedule: items
        });
        markerArr = [];   
    };

    getInfo = (e) => {
        console.log(parseInt(e.currentTarget.getAttribute('data-mode')));
        var result = this.state.schedule.map((item, i) => {
            return item.id;
        }).indexOf(parseInt(e.currentTarget.getAttribute('data-mode')));

        this.setState({
            detail:{
                id: this.state.schedule[result].id,
                time: this.state.schedule[result].time,
                title: this.state.schedule[result].title,
                tel: this.state.schedule[result].tel,
                location: this.state.schedule[result].location,
                opentime: this.state.schedule[result].opentime,
                info: this.state.schedule[result].info,
                remark: this.state.schedule[result].remark,
                position: this.state.schedule[result].position
            },
            mapPosition: {lat: this.state.schedule[result].position.lat(), lng: this.state.schedule[result].position.lng()}
        });
        console.log(this.state.schedule[result]);
        this.state.resultsMap.setCenter(this.state.schedule[result].position);
        this.state.resultsMap.setZoom(13);
    }

    render(){
        //key是自己帳戶的 libraries={["places"]}
        //console.log(this.state);
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
                                    <button className="btn btn-sm mr-2 btn-outline-warning" type="button" 
                                        data-mode={1} onClick={(e)=>{this.call_searchResult(e.currentTarget.getAttribute('data-mode'))}}>
                                        <span className="h2">Day 1</span>
                                    </button>
                                    <button className="btn btn-sm ml-2 btn-outline-warning" type="button"
                                        data-mode={2} onClick={(e)=>{this.call_searchResult(e.currentTarget.getAttribute('data-mode'))}}>
                                        <span className="h2">Day 2</span>
                                    </button>
                                    <button className="btn btn-sm ml-2 btn-outline-warning" type="button"
                                        data-mode={3} onClick={(e)=>{this.call_searchResult(e.currentTarget.getAttribute('data-mode'))}}>
                                        <span className="h2">Day 3</span>
                                    </button>
                                    <button className="btn btn-sm ml-2 btn-outline-warning" type="button"
                                        data-mode={4} onClick={(e)=>{this.call_searchResult(e.currentTarget.getAttribute('data-mode'))}}>
                                        <span className="h2">Day 4</span>
                                    </button>
                                </div>
                            </div>
                            {/*<!-- 清單-->*/}
                            <div className="row">
                                <div className="col">
                                    <div className="card mb-3">
                                        <h5 className="card-header text-center">行程</h5>
                                        <div className="list-group list-group-flush">
                                            {this.state.schedule.map((item, i) =>{
                                                if(item.type == 'flight'){
                                                    return (
                                                        <button key={(i + 1)} data-mode={item.id} className="list-group-item list-group-item-action" 
                                                            onClick={(e)=>{this.getInfo(e)}}> <MaterialIcon icon="flight_takeoff" color='#fdfffa'size={20} /> <span> {item.title} </span></button>
                                                    )
                                                }else if(item.type == 'traffic'){
                                                    console.log(item.type);
                                                    <p>交通</p>
                                                }
                                                else{
                                                    return (
                                                        <button key={(i + 1)} data-mode={item.id} className="list-group-item list-group-item-action" 
                                                            onClick={(e)=>{this.getInfo(e)}}> <MaterialIcon icon="where_to_vote" color='#fdfffa'size={20} /> {item.title} </button>
                                                    )
                                                }
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
                                    <h4 className="mb-3">{this.state.detail.title}</h4>
                                    <p className="mb-1">{this.state.detail.tel}</p>
                                    <p className="mb-2">{this.state.detail.opentime}</p>
                                    <p className="mb-3">{this.state.detail.location}</p>
                                    <p className="mb-4">{this.state.detail.remark}</p>
                                    {/* google map部分 */}
                                    <LoadScript id="script-loader" googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                                        { }
                                        <GoogleMap id="searchbox"
                                            onLoad={resultsMap => {
                                                this.setState({
                                                    resultsMap: resultsMap
                                                });
                                                this.call_searchResult(this.state.showDay);
                                            }}
                                            mapContainerStyle={{
                                                height: "600px", 
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
                                            zoom={8}
                                            center={{lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
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

render(<Provider store={store}><TripSchedule /></Provider>, document.getElementById('mapWrapper'));

export default connect(mapStateToProps)(TripSchedule);
