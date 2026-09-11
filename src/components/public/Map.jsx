import React from 'react'
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";



function MapClickHandler({lat, lng}) {
  useMapEvents({
    click() {
    //   const { lat, lng } = e.latlng;

      // Open Google Maps at the clicked location
      window.open(
        `https://www.google.com/maps?q=${lat},${lng}`,
        // `https://www.google.com/maps/place/7%C2%B024'03.2%22N+3%C2%B055'24.1%22E/@7.4006609,3.9232278,3a,41.1y,46.46h,98.98t/data=!3m7!1e1!3m5!1sA3OZXtL-8sZvNyYzeeFvHA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-8.977890224393903%26panoid%3DA3OZXtL-8sZvNyYzeeFvHA%26yaw%3D46.45968214729635!7i13312!8i6656!4m5!3m4!4b1!8m2!3d7.4008889!4d3.9233611?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D`,
        "_blank"
      );
    },
  });

  return null;
}

export default function Map({className}) {
    // const position = [7.401065, 3.923356];
    // const position = [7.400700, 3.923267];
    const position = [7.400888, 3.923367];

    return (
    <div className={`mb-5 rounded-br-[4%] rounded-bl-[4%] overflow-hidden ${className || ''}`}>
        <MapContainer
            center={position}
            zoom={17}
            style={{height: '450px', width: '100%', borderBottomLeftRadius: '10px', borderTopLeftRadius: '10px'}}
        >
            <TileLayer 
            attribution='&copy; Amos Iyiola Ladipo'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

        <MapClickHandler
        lat={position[0]}
        lng={position[1]}
        />

            <Marker position={position}>
                <Popup>
                    Lagos, Nigeria
                </Popup>
            </Marker>

        </MapContainer>
    </div>
  )
}
