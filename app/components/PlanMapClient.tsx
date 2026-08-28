"use client";

import { useEffect } from "react";

import L from "leaflet";

import {
  MapContainer, //地図本体
  Marker, //背景の地図
  Popup, //ピン
  TileLayer, //ピンを押した時の吹き出し
  useMap, //現在表示している地図そのものを操作
} from "react-leaflet";

import type { PlanItem } from "../../types/travel";

type Props = {
  plan: PlanItem[];
};


function FitMapToPlan({
  plan,
}: Props) {

  //現在の地図を取得 
  const map = useMap();

  //プランが変わったら実行   
  useEffect(() => {

    if (plan.length === 0) {
      return;
    }

    // 地図の範囲を作る
    const bounds = L.latLngBounds(
      plan.map((item) => [item.spot.latitude,item.spot.longitude,])
    );

    // 表示範囲を調整
    map.fitBounds(bounds,{
      padding: [40,40],
    });

  },[plan,map]);

  return null;
}


export default function PlanMapClient({plan,}: Props) {
  // シンガポール中心付近
  const singaporeCenter: [number, number] = [1.3521,103.8198,];

  return (
    <div
        className="
            h-[280px]
            w-full
            overflow-hidden
            rounded-lg
            print:h-[240px]
        "
    >

      {/* 地図本体 */}
      <MapContainer
        center={singaporeCenter}
        zoom={12}
        className="h-full w-full"
      >
        {/* 地図の背景画像 */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 調整を実行 */}
        <FitMapToPlan plan={plan} />


        {plan.map((item, index) => {
          const numberIcon = L.divIcon({
            className: "",
            html: `
              <div
                style="
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: #2563eb;
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 700;
                  border: 3px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                "
              >
                ${index + 1}
              </div>
            `,
            iconSize: [32,32],
            iconAnchor: [16,16],
          });


          return (
            // ピンを作っている
            <Marker
              key={item.spot.id}
              position={[
                item.spot.latitude,
                item.spot.longitude,
              ]}
              icon={numberIcon}
            >
              <Popup>
                <div>
                  <p className="font-bold">
                    {index + 1}. {item.spot.name}
                  </p>

                  <p>
                    {item.startTime} - {item.endTime}
                  </p>

                  <p>
                    {item.spot.area}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
}