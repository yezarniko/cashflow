import React, { useEffect, useState } from "react";

import { Radio, message, Popover } from "antd";
import {
  BarcodeOutlined,
  ShoppingCartOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import ScannerIcon from "@assets/scanner.gif";
import SearchIcon from "@assets/search.gif";
import NotificationSound from "@assets/store-scanner-beep-90395.mp3";

function Sale() {
  const [mode, setMode] = useState("Product");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log("render sale!");
  });

  useEffect(() => {
    if (mode === "BarcodeScan") {
      let barcode = "";
      messageApi.open({
        type: "loading",
        content: (
          <Popover
            content={
              <ul style={{ color: "var(--secondary-color)" }}>
                <li>
                  Ensure the barcode scanner is plugged in correctly before use.
                </li>
                <li>
                  Hold the barcode scanner at an appropriate distance to the
                  barcode.
                </li>
                <li>Make sure the barcode is clean and undamaged.</li>
              </ul>
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={ScannerIcon}
                style={{ width: "18px", marginRight: ".4em" }}
              />
              Scanning
            </div>
          </Popover>
        ),
        duration: 0,
        icon: <></>,
      });
      document.onkeyup = (e) => {
        if (e.key === "Enter") {
          messageApi.open({ type: "success", content: barcode, duration: 0.5 });
          playNotificationSound();
          barcode = "";
        } else {
          if (!isNaN(e.key)) {
            barcode += e.key;
            console.log(e.key);
          }
        }
      };
    }
    return () => {
      document.onkeyup = null;
      messageApi.destroy();
    };
  }, [mode]);

  return (
    <div className="sale">
      {contextHolder}
      <div className="sale__container">
        <div className="sale__products">
          <div className="sale__products__headbox">
            <Search />
            <ModeSelector mode={mode} setMode={setMode} />
          </div>
          <div className="sale__products__categories"></div>
          <div className="sale__products__items">
            <div className="sale__products__item"></div>
          </div>
        </div>
        <div className="sale__cashlist"></div>
      </div>
    </div>
  );
}

/**
 * Notification Sound Handler
 *
 * @function
 * @memberof OrderListInput
 * @returns {void}
 */
function playNotificationSound() {
  const audio = new Audio(NotificationSound);
  audio.play();
}

function Search() {
  const [searchResult, setSearchResult] = useState("");

  return (
    <div className="search">
      <div className="searchbox">
        <input
          type="text"
          onChange={(e) => {
            setSearchResult(e.target.value);
          }}
        />
        <span className="searchbox__icon">
          <img src={SearchIcon} />
        </span>
      </div>
      {searchResult ? (
        <div className="search_result">
          <div className="search_result__item">
            {searchResult}
            <span>900 ks</span>
          </div>
          <div className="search_result__item">
            Line Pen<span>800 ks</span>
          </div>
          <div className="search_result__item">
            Garnier face mask<span>1200 ks</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function ModeSelector({ mode, setMode }) {
  return (
    <Radio.Group
      options={[
        {
          label: (
            <>
              <ShoppingCartOutlined />
              {"  "}Manual
            </>
          ),
          value: "Product",
        },
        {
          label: (
            <>
              <BarcodeOutlined />
              {"  "}Barcode Scan
            </>
          ),
          value: "BarcodeScan",
        },
        {
          label: (
            <>
              <ScanOutlined />
              {"  "}Webcam Scan
            </>
          ),
          value: "WebcamScan",
        },
      ]}
      onChange={(e) => {
        setMode(e.target.value);
      }}
      onClick={null}
      value={mode}
      optionType="button"
    />
  );
}

export default Sale;
