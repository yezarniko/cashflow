import React, { useState, useEffect } from "react";
import { DatePicker, Dropdown } from "antd";
import BranchSelector from "@comp/BranchSelector";
import SearchIcon from "@assets/search-icon.svg";
import RefreshIcon from "@assets/refresh.png";
import SortIcon from "@assets/sort-az.png";
import { UpSquareOutlined, DownSquareOutlined } from "@ant-design/icons";

function SaleLogs() {
  const [saleLogs, setSaleLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState("");

  const collapseIconStyle = {
    fontSize: "1.5rem",
    fontWeight: "500",
    cursor: "pointer",
  };

  useEffect(() => {
    const SALE_LOGS = [];
    for (let i = 1; i <= 10; i++) {
      const customerID = `#0000000${i}`;
      const amount = Math.floor(Math.random() * 10000) + 1000; // Random amount between 1000 and 11000
      const year = 2023;
      const month = Math.floor(Math.random() * 12); // Random month (0-11)
      const day = Math.floor(Math.random() * 28) + 1; // Random day (1-28)
      const hours = Math.floor(Math.random() * 24); // Random hours (0-23)
      const minutes = Math.floor(Math.random() * 60); // Random minutes (0-59)
      const seconds = Math.floor(Math.random() * 60); // Random seconds (0-59)
      const timestamp = new Date(year, month, day, hours, minutes, seconds);
      const isOrder = Math.random() < 0.5; // Randomly set isOrder to true or false

      SALE_LOGS.push({
        customerID,
        amount,
        timestamp,
        isOrder,
      });
    }
    setSaleLogs(SALE_LOGS);
  }, []);
  return (
    <div className="logs__sale_logs">
      <div className="logs__sale_logs__header">
        <div className="search">
          <img src={SearchIcon} className="search__icon" />
          <input placeholder="Product Name or ID" />
        </div>
        <div className="refresh">
          <img src={RefreshIcon} />
        </div>
        <div className="seperator"></div>
        <BranchSelector />
        <Dropdown.Button
          style={{ width: "auto" }}
          menu={{
            items: [
              {
                label: "2nd menu item",
                key: "2",
              },
              {
                label: "3rd menu item",
                key: "3",
              },
            ],
            onClick: () => {},
          }}
        >
          <div style={{ display: "flex", alignItems: "cneter" }}>
            <img
              src={SortIcon}
              style={{
                width: "17px",
                aspectRatio: "1/1",
                marginRight: ".5em",
              }}
            />
            Sort
          </div>
        </Dropdown.Button>
        <DatePicker />
      </div>
      <div className="logs__sale_logs__table">
        <div className="logs__sale_logs__table__header">
          <div>Customer ID</div>
          <div>Amount</div>
          <div>Time</div>
          <div>Date</div>
          <div>Is Order?</div>
          <div></div>
        </div>
        <div className="logs__sale_logs__table__data">
          {saleLogs.map((log) => (
            <div
              key={log.timestamp}
              className={
                "logs__sale_logs__table__item " +
                (selectedLog === log.customerID
                  ? "logs__sale_logs__table__item-selected"
                  : "")
              }
            >
              <div>{log.customerID}</div>
              <div>{log.amount} ks</div>
              <div>
                {log.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>{log.timestamp.toLocaleDateString()}</div>
              <div>
                <div
                  style={{
                    background: log.isOrder
                      ? "rgba(36, 208, 82, 0.53)"
                      : "rgba(255, 103, 18, 0.69)",
                  }}
                >
                  {log.isOrder ? "True" : "False"}
                </div>
              </div>
              <div
                onClick={() => {
                  setSelectedLog(selectedLog === "" ? log.customerID : "");
                }}
              >
                {selectedLog === log.customerID ? (
                  <UpSquareOutlined style={collapseIconStyle} />
                ) : (
                  <DownSquareOutlined style={collapseIconStyle} />
                )}
              </div>
              {selectedLog === log.customerID && <div></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Logs = () => {
  return (
    <div className="logs">
      <SaleLogs />
    </div>
  );
};

export default Logs;
