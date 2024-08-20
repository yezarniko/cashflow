import React, { useState, useEffect } from "react";
import { DatePicker, Dropdown, Radio, Space, Drawer } from "antd";
import BranchSelector from "@comp/BranchSelector";
import SearchIcon from "@assets/search-icon.svg";
import RefreshIcon from "@assets/refresh.png";
import SortIcon from "@assets/sort-az.png";
import Icon, { UpSquareOutlined, DownSquareOutlined } from "@ant-design/icons";
import { useDatabase } from "@hooks/useDatabase";
import SaleLogsIcon from "@assets/credit-score (2).png";
import PurchaseLogsIcon from "@assets/checklist.png";
import IncomesIcon from "@assets/wallet.png";
import ExpenseIcon from "@assets/spending-money.png";
import OverviewIcon from "@assets/overview.svg";
import clsx from "clsx";
import FilterIcon from "@assets/filter.png";

import { useBranch } from "@hooks/useBranch";

function SaleLogs() {
  const [saleLogs, setSaleLogs] = useState([]);
  const [initialSaleLogs, setInitialSaleLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState("");

  const { currentBranch } = useBranch();

  const [sortLog, setSortLog] = useState("ByDate");
  const [isAccending, setIsAccending] = useState(false);

  const { sales } = useDatabase();

  const collapseIconStyle = {
    fontSize: "1.5rem",
    fontWeight: "500",
    cursor: "pointer",
  };

  useEffect(() => {
    if (sales) {
      if (sales[currentBranch]) {
        const Sales = Object.values(sales[currentBranch])
          .map((day) => {
            let data = Object.keys(day).map((key) => ({
              ...day[key],
              customerID: key,
            }));
            return data;
          })
          .flat()
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .reverse();
        setSaleLogs(Sales);
        setInitialSaleLogs(Sales);
      }
    }
  }, [sales]);

  useEffect(() => {
    // const SALE_LOGS = [];
    // for (let i = 1; i <= 10; i++) {
    //   const customerID = `#0000000${i}`;
    //   const amount = Math.floor(Math.random() * 10000) + 1000; // Random amount between 1000 and 11000
    //   const year = 2023;
    //   const month = Math.floor(Math.random() * 12); // Random month (0-11)
    //   const day = Math.floor(Math.random() * 28) + 1; // Random day (1-28)
    //   const hours = Math.floor(Math.random() * 24); // Random hours (0-23)
    //   const minutes = Math.floor(Math.random() * 60); // Random minutes (0-59)
    //   const seconds = Math.floor(Math.random() * 60); // Random seconds (0-59)
    //   const timestamp = new Date(year, month, day, hours, minutes, seconds);
    //   const isOrder = Math.random() < 0.5; // Randomly set isOrder to true or false
    //   SALE_LOGS.push({
    //     customerID,
    //     amount,
    //     timestamp,
    //     isOrder,
    //   });
    // }
    // setSaleLogs(SALE_LOGS);
  }, []);

  useEffect(() => {
    if (saleLogs.length != 0) {
      let Logs = [...saleLogs];
      if (sortLog === "ByPrice") {
        Logs.sort((a, b) => a.totalPrice - b.totalPrice);
        if (!isAccending) {
          Logs.reverse();
        }
      } else {
        Logs.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (!isAccending) {
          Logs.reverse();
        }
      }
      setSaleLogs(Logs);
    }
  }, [sortLog, isAccending]);

  return (
    <div className="logs__sale_logs">
      <div className="logs__sale_logs__header">
        <div className="search">
          <h1 className="font-sans font-bold text-slate-400 text-xl">
            Sale Records
          </h1>
        </div>
        <div className="seperator"></div>
        <BranchSelector />
        <Dropdown.Button
          className="w-auto"
          menu={{
            items: [
              {
                label: (
                  <>
                    <Radio.Group
                      onChange={(e) => setSortLog(e.target.value)}
                      value={sortLog}
                    >
                      <Space direction="vertical">
                        <Radio value={"ByPrice"}>
                          <div className="font-sans">By Amount</div>
                        </Radio>
                        <Radio value={"ByDate"}>
                          <div className="font-sans">By Date</div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                    <div className="w-full border-1 bg-sky-100 mb-2 mt-3"></div>
                  </>
                ),
                key: "1",
                type: "group",
              },
              {
                label: (
                  <>
                    <Radio.Group
                      onChange={(e) => setIsAccending(e.target.value)}
                      value={isAccending}
                    >
                      <Space direction="vertical">
                        <Radio value={true}>Accending</Radio>
                        <Radio value={false}>Descending</Radio>
                      </Space>
                    </Radio.Group>
                    <div className="w-full border-1 bg-sky-100 mb-2 mt-3"></div>
                  </>
                ),
                key: "2",
                type: "group",
              },
            ],
            onClick: () => {},
          }}
        >
          <div className="flex items-center text-sm font-sans">
            <img src={SortIcon} className="w-6 aspect-square mr-2" />
            Sort
          </div>
        </Dropdown.Button>
        <DatePicker
          onChange={(date, _) => {
            if (date) {
              // setSaleLogs(
              let newLogs = saleLogs.filter(
                (log) =>
                  new Date(log.date).toDateString() ===
                  new Date(date).toDateString()
              );
              console.log(newLogs);
              setSaleLogs(newLogs);
              // );
            } else {
              setSaleLogs(initialSaleLogs);
            }
          }}
        />
      </div>
      <div className="logs__sale_logs__table">
        <div className="logs__sale_logs__table__header">
          <div>Customer ID</div>
          <div>Amount</div>
          <div>Time</div>
          <div>Date</div>
          <div></div>
        </div>
        <div className="logs__sale_logs__table__data h-[36rem] overflow-y-scroll border-b-2">
          {saleLogs.length <= 0 && (
            <div className="w-full h-96 flex justify-center items-center font-sans ">
              No Logs
            </div>
          )}
          {saleLogs.map((log, index) => (
            <div
              key={log.date}
              className={
                "logs__sale_logs__table__item " +
                (selectedLog === log.customerID
                  ? "logs__sale_logs__table__item-selected"
                  : "")
              }
            >
              <div className="font-mono">#{log.customerID.slice(1)}</div>
              <div>{log.totalPrice} ks</div>
              <div>
                {new Date(log.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div>{`${new Date(log.date).getDate()}-${
                new Date(log.date).getMonth() + 1
              }-${new Date(log.date).getFullYear()}`}</div>
              {/* <div>
                <div
                  style={{
                    background: false
                      ? "rgba(36, 208, 82, 0.53)"
                      : "rgba(255, 103, 18, 0.69)",
                  }}
                >
                  {/* {log.isOrder ? "True" : "False"} */}
              {/* {"False"} */}
              {/* </div> */}
              {/* </div>  */}
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
              {selectedLog === log.customerID && (
                <div className="p-5 m-3 border-sky-100 border-2 mt-4 flex items-end flex-col">
                  {log.products.map((product) => (
                    <div className="flex w-4/5 justify-between items-center bg-slate-100/80 px-5 py-2">
                      <div className="font-mono">{product.id}</div>
                      <div className="grow">
                        {product.name.length > 20
                          ? product.name.slice(0, 20) + "..."
                          : product.name}
                      </div>
                      <div className="text-right">{product.count}</div>
                      <div className="w-1/4 text-right">
                        {product.price * product.count} ks
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SideBar({ currentLog, setCurrentLog }) {
  return (
    <nav className="w-[12%] h-full shadow-xl border-2 border-sky-500/10 flex justify-center items-center">
      <div className="text-sm text-slate-500 text-left">
        <div
          onClick={() => setCurrentLog("Sales")}
          className={clsx(
            "mx-auto mb-3 text-slate-500 p-2 pr-4 rounded-lg font-bold cursor-pointer  font-sans",
            currentLog === "Sales" ? "sidebar__menu__item-selected" : ""
          )}
        >
          <img
            src={SaleLogsIcon}
            className="w-8 aspect-square mr-3 inline-block"
          />
          Sales
        </div>
        <div
          onClick={() => setCurrentLog("Purchases")}
          className={clsx(
            "mx-auto mb-3 text-slate-500 p-2 pr-4 rounded-lg font-bold cursor-pointer  font-sans",
            currentLog === "Purchases" ? "sidebar__menu__item-selected" : ""
          )}
        >
          <img
            src={PurchaseLogsIcon}
            className="w-8 aspect-square mr-3 inline-block"
          />
          Purchases
        </div>
        <div
          onClick={() => setCurrentLog("Incomes")}
          className={clsx(
            "mx-auto mb-3 text-slate-500 p-2 pr-4 rounded-lg font-bold cursor-pointer  font-sans",
            currentLog === "Incomes" ? "sidebar__menu__item-selected" : ""
          )}
        >
          <img
            src={IncomesIcon}
            className="w-8 aspect-square mr-3 inline-block"
          />
          Incomes
        </div>
      </div>
    </nav>
  );
}

function PurchaseLogs() {
  const [selectedLog, setSelectedLog] = useState("");
  const [purchaseLogs, setPurchaseLogs] = useState([]);
  const [initialPurchaseLogs, setInitialPurchaseLogs] = useState([]);
  const { purchases } = useDatabase();
  const { currentBranch } = useBranch();

  const collapseIconStyle = {
    fontSize: "1.5rem",
    fontWeight: "500",
    cursor: "pointer",
  };

  useEffect(() => {
    if (purchases) {
      if (purchases[currentBranch]) {
        let data = Object.keys(purchases[currentBranch]).map((date) => {
          const products = Object.values(
            Object.values(purchases[currentBranch][date])
          );
          const payload = {
            date: date,
            products: products,
            totalPrice: products
              .map((p) => p.price * p.appendCounts)
              .reduce((a, b) => a + b),
          };

          return payload;
        });
        let D = (d) => d.date.split("-").slice(0, 2).reverse().join("-");
        data.sort((a, b) => new Date(D(a)) - new Date(D(b))).reverse();
        console.log(data);
        setPurchaseLogs(data);
        setInitialPurchaseLogs(data);
      }
    }
  }, [purchases]);

  return (
    <div className="logs__sale_logs">
      <div className="logs__sale_logs__header">
        <div className="search">
          <h1 className="font-sans font-bold text-slate-400 text-xl">
            Purchases
          </h1>
        </div>
        <div className="seperator"></div>
        <BranchSelector />
        <DatePicker
          picker="month"
          onChange={(date, _) => {
            if (date) {
              setPurchaseLogs((logs) =>
                logs.filter(
                  (log) =>
                    new Date(
                      log.date.split("-").reverse().slice(0, 2).join("-")
                    ).getMonth() === new Date(date).getMonth()
                )
              );
            } else {
              setPurchaseLogs(initialPurchaseLogs);
            }
          }}
        />
      </div>
      <div className="logs__sale_logs__table">
        <div className="flex justify-between mb-4 bg-[#d9d9d947] px-0 py-2 text-base font-[500] text-[#827070]">
          <div className="text-center w-1/4 ">Date</div>
          <div className="text-center w-1/4 ">Amount</div>
          <div className="text-center w-1/12"></div>
        </div>
        {purchaseLogs.length === 0 && (
          <div className="w-full h-96 flex justify-center items-center font-sans ">
            No Logs
          </div>
        )}

        <div className="logs__sale_logs__table__data h-[36rem] overflow-y-scroll border-b-2">
          {purchaseLogs.length > 0 &&
            purchaseLogs.map((log) => (
              <div
                className={clsx(
                  "flex justify-between mb-4 px-0 py-2 text-base font-[500] text-[#827070] flex-wrap",
                  selectedLog == log.date ? "shadow-innerOne" : ""
                )}
              >
                <div className="text-center w-1/4">{log.date}</div>
                <div className="text-center w-1/4">{log.totalPrice} ks</div>

                <div
                  className="text-center w-1/12"
                  onClick={() => {
                    setSelectedLog(selectedLog === "" ? log.date : "");
                  }}
                >
                  {selectedLog === log.date ? (
                    <UpSquareOutlined style={collapseIconStyle} />
                  ) : (
                    <DownSquareOutlined style={collapseIconStyle} />
                  )}
                </div>
                {selectedLog === log.date && (
                  <div className="w-full p-5 m-3 border-sky-100 border-2 mt-4 flex items-end flex-col">
                    {log.products.map((product) => (
                      <div className="flex w-3/4 justify-between items-center bg-slate-100/80 px-5 py-2">
                        <div className="w-1/4 font-mono">{product.id}</div>
                        <div className="grow">
                          {product.name.length > 20
                            ? product.name.slice(0, 20) + "..."
                            : product.name}
                        </div>
                        <div className="w-1/4 text-right">
                          {product.appendCounts}
                        </div>
                        <div className="w-1/4 text-right">
                          {product.price * product.appendCounts} ks
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ProductLogsDrawer({ data, openProductLogs, setOpenProductLogs }) {
  // { data, openProductLogs, setOpenProductLogs }

  const [mode, setMode] = useState("saleLogs");

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Drawer
      zIndex={1050}
      title="Details"
      placement="right"
      width={1200}
      onClose={() => {
        setOpenProductLogs(false);
      }}
      open={openProductLogs}
      extra={
        <div>
          <img src={FilterIcon} className="w-6" />
        </div>
      }
    >
      <div className="w-full h-full">
        <div className="flex w-full  border-b-2 pb-4  text-center justify-between items-center font-sans font-bold text-slate-400 cursor-pointer"></div>
        <div className="w-full h-[90%] border-2 border-t-0">
          <div className="flex items-center justify-between text-center font-sans font-bold text-sm p-2 text-indigo-400  shadow-md">
            <div className="w-1/6  text-left">ID</div>
            <div className="w-1/6  text-left">Name</div>
            <div className="w-1/6  text-center">Counts</div>
            <div className="w-1/6  text-center">Sale Price</div>
            <div className="w-1/6  text-center">Buying Price</div>
            <div className="w-1/6  text-center">Total</div>
            <div className="w-1/6  text-center">Profits</div>
          </div>
          {!data && (
            <div className="text-center w-full h-full flex items-center justify-center font-bold font-sans text-slate-400">
              No Data
            </div>
          )}

          <div className="w-full h-[100%] overflow-y-scroll border-1">
            {data?.map((p) => (
              <div className="flex items-center justify-between text-right font-sans font-bold text-sm py-4 p-3 text-slate-500  shadow-md">
                <div className="w-1/6 text-left">{p.id}</div>
                <div className="w-1/6 text-left">{p.name}</div>
                <div className="w-1/6 text-center">{p.count}</div>
                <div className="w-1/6 text-center">{p.price} ks</div>
                <div className="w-1/6 text-center">{p.buyingPrice} ks</div>
                <div className="w-1/6 text-center">{p.price * p.count} ks</div>
                <div className="w-1/6 text-center">
                  {(p.price - p.buyingPrice) * p.count} ks
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function Incomes() {
  const [incomes, setIncomes] = useState(null);
  const { currentBranch } = useBranch();
  const [openProductLogs, setOpenProductLogs] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  const { sales } = useDatabase();

  useEffect(() => {
    if (sales) {
      if (sales[currentBranch]) {
        const Sales = Object.values(sales[currentBranch])
          .map((day) => {
            let data = Object.keys(day).map((key) => ({
              ...day[key],
              customerID: key,
            }));
            return data;
          })
          .flat()
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .reverse();
        const Incomes = {};

        Sales.forEach((sale) => {
          let incomes = Incomes[new Date(sale.date).toDateString()];
          let date = new Date(sale.date).toDateString();
          if (incomes) {
            sale.products.forEach((p) => {
              Incomes[date]["products"][p.id] = p;
            });
            Incomes[date]["totalPrice"] += sale.totalPrice;
            Incomes[date]["profits"] += sale.profits;
          } else {
            const products = {};
            sale.products.forEach((p) => {
              products[p.id] = p;
            });
            Incomes[date] = {
              products: products,
              totalPrice: sale.totalPrice,
              profits: sale.profits,
            };
          }
        });

        setIncomes(Incomes);
      }
    }
  }, [sales]);

  return (
    <div className="logs__sale_logs">
      <ProductLogsDrawer
        {...{ data: drawerData, openProductLogs, setOpenProductLogs }}
      />
      <div className="logs__sale_logs__header">
        <div className="search">
          <h1 className="font-sans font-bold text-slate-400 text-xl">
            Incomes
          </h1>
        </div>
        <div className="seperator"></div>
        <BranchSelector />
      </div>
      <div className="logs__sale_logs__table">
        <div className="flex justify-between mb-4 bg-[#d9d9d947] px-0 py-2 text-base font-[500] text-[#827070]">
          <div className="text-center w-1/4 ">Date</div>
          <div className="text-center w-1/4 ">Amount</div>
          <div className="text-center w-1/4 ">Profits</div>
          <div className="text-center w-1/12"></div>
        </div>
        {!incomes && (
          <div className="w-full h-96 flex justify-center items-center font-sans ">
            No Logs
          </div>
        )}

        <div className="logs__sale_logs__table__data h-[36rem] overflow-y-scroll border-b-2">
          {incomes &&
            Object.keys(incomes).map((key) => (
              <div
                className={clsx(
                  "flex justify-between mb-4 px-0 py-2 text-base font-[500] text-[#827070] flex-wrap"
                )}
              >
                <div className="text-center w-1/4">{key}</div>
                <div className="text-center w-1/4">
                  {incomes[key].totalPrice} ks
                </div>
                <div className="text-center w-1/4">
                  {incomes[key].profits} ks
                </div>
                <div
                  className="text-center w-1/12"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDrawerData(Object.values(incomes[key].products));
                    setOpenProductLogs((state) => !state);
                  }}
                >
                  <img src={OverviewIcon} className="w-6 inline-block" />{" "}
                  details
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const Logs = () => {
  const [currentLog, setCurrentLog] = useState("Sales");

  return (
    <div className="logs">
      {currentLog == "Sales" && <SaleLogs />}
      {currentLog == "Purchases" && <PurchaseLogs />}
      {currentLog == "Incomes" && <Incomes />}
      <SideBar {...{ currentLog, setCurrentLog }} />
    </div>
  );
};

export default Logs;
