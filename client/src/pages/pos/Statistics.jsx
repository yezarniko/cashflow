import { DotChartOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import incomeIcon from "@assets/income.png";
import expenseIcon from "@assets/expense.png";
import CorrelationImg from "@assets/stat_cor-2.png";
import { Button, Modal, Select, Skeleton } from "antd";
import { useDatabase } from "@hooks/useDatabase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function getDaysInMonth(monthIndex) {
  const daysInMonth = [
    31, // January
    28, // February (non-leap year)
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31, // December
  ];

  if (monthIndex === 1) {
    const currentYear = new Date().getFullYear();
    if (
      (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
      currentYear % 400 === 0
    ) {
      // Leap year, February has 29 days
      return 29;
    }
  }

  return daysInMonth[monthIndex];
}

function getWeekNumber(date = new Date()) {
  const dayOfWeek = date.getDay(); // getDay() returns 0 for Sunday, 1 for Monday, etc.

  // Adjust to make Monday 1, Tuesday 2, ..., Sunday 7
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

  return adjustedDay;
}

const currentMonthIndex = new Date().getMonth();

const labels = {
  Week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  Month: [...Array(getDaysInMonth(currentMonthIndex))].map((_, idx) => idx + 1),
  Year: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};
const productCategories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Automotive",
  "Toys & Games",
  // "Books",
  // "Health & Wellness",
  // "Jewelry",
  // "Grocery",
  // "Furniture",
  // "Shoes",
  // "Tools & Home Improvement",
  // "Garden & Outdoor",
  // "Pet Supplies",
  // "Office Products",
  // "Baby",
  // "Musical Instruments",
  // "Luggage & Travel",
  // "Watches",
  // "Video Games",
  // "Appliances",
  // "Arts, Crafts & Sewing",
  // "Industrial & Scientific",
  // "Software",
  // "Handmade",
  // "Collectibles & Fine Art",
  // "Camera & Photo",
  // "Cell Phones & Accessories",
  // "Home Improvement",
  // "Home Audio & Theater",
  // "Industrial & Scientific",
  // "Kindle Store",
  // "Magazine Subscriptions",
  // "Major Appliances",
  // "Medical Supplies & Equipment",
  // "Music",
  // "Digital Music",
  // "Music Instruments",
  // "Software",
  // "VHS",
  // "Video",
  // "PC & Video Games",
  // "Apps & Games",
  // "Gift Cards",
  // "Amazon Devices",
  // "Amazon Launchpad",
  // "Amazon Pantry",
  // "Amazon Warehouse",
  // "Appliances",
  // "Apps & Games",
  // "Arts, Crafts & Sewing",
  // "Audible Audiobooks",
  // "Automotive",
  // "Baby",
  // "Beauty & Personal Care",
  // "Books",
  // "CDs & Vinyl",
  // "Cell Phones & Accessories",
  // "Clothing, Shoes & Jewelry",
  // "Collectibles & Fine Art",
  // "Computers",
  // "Courses",
  // "Credit and Payment Cards",
  // "Digital Music",
  // "Electronics",
  // "Gift Cards",
  // "Grocery & Gourmet Food",
  // "Handmade",
  // "Health, Household & Baby Care",
  // "Home & Business Services",
  // "Home & Kitchen",
  // "Industrial & Scientific",
  // "Kindle Store",
  // "Kitchen & Dining",
  // "Luggage & Travel Gear",
  // "Luxury Beauty",
  // "Magazine Subscriptions",
  // "Movies & TV",
  // "Musical Instruments",
  // "Office Products",
  // "Patio, Lawn & Garden",
  // "Pet Supplies",
  // "Prime Pantry",
  // "Prime Video",
  // "Software",
  // "Sports & Outdoors",
  // "Tools & Home Improvement",
  // "Toys & Games",
  // "Vehicles",
  // "Video Games",
  // "Wine",
  // Add more categories as needed
];
const products = [
  "Egg",
  "Milk",
  "Coca Cola",
  "Bread",
  "Butter",
  "Cheese",
  "Apple",
  "Orange",
  "Banana",
  "Cereal",
  "Rice",
  "Pasta",
  "Tomato",
  "Potato",
  "Carrot",
  "Chicken",
  "Beef",
  "Pork",
  "Salmon",
  "Shrimp",
  "Broccoli",
  "Spinach",
  "Lettuce",
  "Yogurt",
  "Ice Cream",
  "Cake",
  "Coffee",
  "Tea",
  "Water",
  "Soap",
  "Shampoo",
  "Toothbrush",
  "Toothpaste",
  "Towel",
  "Socks",
  "Shoes",
  "Hat",
  "Sunglasses",
  "Book",
  "Newspaper",
  "Magazine",
  "Pen",
  "Pencil",
  "Notebook",
  "Backpack",
  "Laptop",
  "Phone",
  "Tablet",
  "Chair",
  "Desk",
  "Sofa",
  "Bed",
  "Blanket",
  "Pillow",
  "Candle",
  "Vase",
  "Plant",
  "Bicycle",
  "Scooter",
  "Car",
  "Truck",
  "Bus",
  "Train",
  "Airplane",
  "Helicopter",
  "Balloons",
  "Kite",
  "Soccer Ball",
  "Basketball",
  "Tennis Racket",
  "Guitar",
  "Violin",
  "Drums",
  "Microphone",
  "Camera",
  "Binoculars",
  "Telescope",
  "Chess Set",
  "Board Game",
  "Frisbee",
  "Swing",
  "Slide",
  "Kite",
  "Fishing Rod",
  "Lawn Mower",
  "Grill",
  "Screwdriver",
  "Hammer",
  "Nail",
  "Paint",
  "Brush",
  "Broom",
  "Vacuum Cleaner",
  "Dish Soap",
  "Trash Bags",
  "Tissues",
  "First Aid Kit",
  "Medicine",
  "Band-Aids",
  "Toilet Paper",
  "Shower Curtain",
];

const correlationChartOptions = {
  scales: {
    x: {
      grid: {
        display: false, // This will hide the x-axis grid lines
      },
    },
    y: {
      grid: {
        display: false, // This will hide the y-axis grid lines
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "correlation of products",
      position: "bottom",
    },
  },
};

function Accountant({ icon, label, amount }) {
  return (
    <div className="statistics__accountant">
      <div className="statistics__accountant__amount">
        <div>{label}</div>
        <div>
          {amount} <span style={{ color: "var(--secondary-color)" }}>ks</span>
        </div>
      </div>
      <div className="statistics__accountant__img">
        <img src={icon} />
      </div>
    </div>
  );
}

function BarChart() {
  const [dataSet1, setDataSet1] = useState([]);
  const [dataSet2, setDataSet2] = useState([]);
  const [labels, setLabels] = useState([]);

  const { productList } = useDatabase();
  const [currentBranch, setCurrentBranch] = useState("main");

  useEffect(() => {
    if (productList) {
      const products = Object.values(productList[currentBranch]).map((p) => {
        if (p.saleLogs) {
          let Logs = p.saleLogs;
          let v = [0];
          if (Logs.length > 0) {
            Logs.sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();
            let counts = {};
            Logs.forEach((log) => {
              let date = `${new Date(log.date).toDateString()}`;
              if (counts[date]) {
                counts[date] += log.counts;
              } else {
                counts[date] = log.counts;
              }
            });
            v = Object.values(counts);
          }
          return [p.productName, v[0], Math.max(...v)];
        } else {
          return [p.productName, 0, 0];
        }
      });
      let a1 = [];
      let a2 = [];
      let labels = [];

      products.forEach((p) => {
        labels.push(p[0]);
        a1.push(p[1]);
        a2.push(p[2]);
      });

      setDataSet1([...a1]);
      setDataSet2([...a2]);
      setLabels([...labels]);
    }
  }, [productList]);

  return (
    <div>
      <Bar
        width={"100%"}
        height={"450px"}
        options={{
          plugins: {
            title: {
              display: true,
              position: "top",
              text: "Peak Product Sales and Current Sales",
            },
            legend: {
              display: false,
            },
          },
          responsive: true,
          // aspectRatio: 4 / 2,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false, // This will hide the x-axis grid lines
              },
              stacked: true,
              ticks: {
                display: true,
              },
            },
            y: {
              grid: {
                display: false, // This will hide the x-axis grid lines
              },
              stacked: false,
            },
          },
        }}
        data={{
          labels: labels,
          datasets: [
            {
              label: "Current Sale",
              data: dataSet1,
              backgroundColor: "rgb(255, 146, 146)",
            },
            {
              label: "Higest Sale",
              data: dataSet2,
              backgroundColor: "rgb(217,217,217)",
            },
          ],
        }}
      />
    </div>
  );
}

function CorrelationItemSelectModal({
  isModalOpen,
  setIsModalOpen,
  setFirstItem,
  setSecondItem,
}) {
  const [selectedValues, setSelectedValues] = useState({
    first: products[0],
    second: products[1],
  });
  const [isDisableButton, setIsDisableButton] = useState(false);

  useEffect(() => {
    if (selectedValues.first == selectedValues.second) {
      setIsDisableButton(true);
    } else {
      setIsDisableButton(false);
    }
  }, [selectedValues]);

  return (
    <Modal
      width="270px"
      open={isModalOpen}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ marginRight: "1em" }}>Correlation 1:</span>
      <Select
        defaultValue={products[0]}
        onChange={(value) => setSelectedValues((v) => ({ ...v, first: value }))}
        style={{ width: 200 }}
        options={[
          {
            label: "Products",
            options: products.map((p) => ({ label: p, value: p })),
          },
          {
            label: "Other Correlation",
            options: [{ label: "weather", value: "weather" }],
          },
        ]}
      />
      <br />
      <span style={{ marginRight: "1em" }}>Correlation 2:</span>
      <Select
        defaultValue={products[1]}
        onChange={(value) =>
          setSelectedValues((v) => ({ ...v, second: value }))
        }
        style={{ width: 200 }}
        options={[
          {
            label: "Products",
            options: products.map((p) => ({ label: p, value: p })),
          },
          {
            label: "Other Correlation",
            options: [{ label: "Weather", value: "Weather" }],
          },
        ]}
      />
      <Button
        disabled={isDisableButton}
        type="primary"
        style={{ display: "block", marginTop: "1em", width: "50%" }}
        onClick={() => {
          setFirstItem(selectedValues.first);
          setSecondItem(selectedValues.second);
          setIsModalOpen(false);
        }}
      >
        Ok
      </Button>
    </Modal>
  );
}

function CorrelationChart({ duration }) {
  const [
    isChooseOpenCorrelationItemModal,
    setIsChooseOpenCorrelationItemModal,
  ] = useState(false);
  const [isOpenCorrelatedImgModal, setIsOpenCorrelatedImgModal] =
    useState(false);

  const [firstItem, setFirstItem] = useState("item1");
  const [secondItem, setSecondItem] = useState("item2");

  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Modal
        open={isOpenCorrelatedImgModal}
        footer={null}
        onCancel={() => setIsOpenCorrelatedImgModal(false)}
      >
        <div
          style={{
            width: "478px",
            aspectRatio: "2/1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <Skeleton.Avatar
              active={true}
              shape="square"
              size={400}
            ></Skeleton.Avatar>
          ) : (
            <img src={CorrelationImg} style={{ width: "100%" }} />
          )}
        </div>
      </Modal>
      <CorrelationItemSelectModal
        isModalOpen={isChooseOpenCorrelationItemModal}
        setIsModalOpen={setIsChooseOpenCorrelationItemModal}
        {...{ setFirstItem, setSecondItem }}
      />
      <div className="statistics__line_charts__correlation">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "2em",
          }}
        >
          <Button
            type="primary"
            size="small"
            shape="round"
            onClick={() => {
              setIsOpenCorrelatedImgModal(true);
              setIsLoading(true);
              const interval = setInterval(() => {
                setIsLoading(false);
              }, 2000);
            }}
          >
            Correlate
          </Button>
          <div
            className="statistics__line_charts__correlation__selector"
            onClick={() => setIsChooseOpenCorrelationItemModal(true)}
          >
            <div>
              <div
                className="statistics__line_charts__correlation__selector__line"
                style={{
                  background: "rgba(246, 108, 7, 0.25)",
                }}
              ></div>
              <div className="statistics__line_charts__correlation__selector__text">
                {firstItem}
              </div>
            </div>
            <div>
              <div
                className="statistics__line_charts__correlation__selector__line"
                style={{
                  background: "rgba(21, 245, 192, 0.5)",
                }}
              ></div>
              <div className="statistics__line_charts__correlation__selector__text">
                {secondItem}
              </div>
            </div>
          </div>
        </div>
        <Line
          options={correlationChartOptions}
          data={{
            labels: labels[duration],
            datasets: [
              {
                id: 1,
                label: "",
                data: [100, 300, 200, 400, 300, 320, 300],
                borderColor: "rgba(246, 108, 7, .25)",
                backgroundColor: "rgba(190, 209, 246, 0.5)",
              },
              {
                id: 2,
                label: "",
                data: [200, 400, 100, 400, 300, 400, 200],
                borderColor: "rgba(21, 245, 192, .25)",
                backgroundColor: "rgba(21, 245, 192, 0.5)",
              },
            ],
          }}
        />
      </div>
    </>
  );
}

function PieChart() {
  const { productList } = useDatabase();
  const [currentBranch, setCurrentBranch] = useState("main");
  const [dataSet, setDataSet] = useState({});
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (productList) {
      const products = Object.values(productList[currentBranch]).map((p) => {
        if (p.saleLogs) {
          let Logs = p.saleLogs;
          let v = [0];
          if (Logs.length > 0) {
            let counts = {};
            Logs.forEach((log) => {
              let date = `${new Date(log.date).toDateString()}`;
              if (counts[date]) {
                counts[date] += log.counts;
              } else {
                counts[date] = log.counts;
              }
            });
            v = Object.values(counts);
          }
          return [p.category, Math.max(...v)];
        } else {
          return [p.category, 0];
        }
      });
      let categories = {};

      products.forEach((p) => {
        if (categories[p[0]]) {
          categories[p[0]] += p[1];
        } else {
          categories[p[0]] = p[1];
        }
      });

      // categories = {
      //   // Electronics: 45,
      //   // Clothing: 50,
      //   // "Home & Kitchen": 23,
      //   // "Sports & Outdoors": 40,
      //   // "Beauty & Personal Care": 22,
      //   // Automotive: 21,
      //   // "Toys & Games": 11,
      //   // Books: 20,
      //   // "Health & Wellness": 30,
      //   // Jewelry: 38,
      //   // Grocery: 2,
      //   // Furniture: 14,
      //   // Shoes: 16,
      //   // "Tools & Home Improvement": 18,
      //   // "Garden & Outdoor": 12,
      //   // "Pet Supplies": 10,
      //   // "Office Products": 2,
      // };

      if (Object.keys(categories).length > 6) {
        const sortedCategories = Object.entries(categories).sort(
          (a, b) => b[1] - a[1]
        );

        // console.log(sortedCategories);

        let showValues = sortedCategories.slice(0, 6);
        let others = sortedCategories.slice(6);
        console.log(others);

        setLabels(showValues.map((s) => s[0]).concat("Others in average"));

        let means_of_others = parseInt(
          others.map((o) => o[1]).reduce((a, b) => a + b, 0) / others.length
        );

        setDataSet(showValues.map((s) => s[1]).concat(means_of_others));
      } else {
        setLabels(Object.keys(categories));

        setDataSet(Object.values(categories));
      }
    }
  }, [productList]);

  return (
    <div className="">
      <Doughnut
        options={{
          plugins: {
            title: {
              display: false,
              position: "bottom",
              text: "Top Product Sales by Categories",
            },
            legend: {
              display: true,
              position: "right",
            },
          },
          responsive: true,
          aspectRatio: 1 / 0.5,
        }}
        data={{
          labels: labels,
          datasets: [
            {
              label: "Total Sale Counts",
              data: dataSet,
              backgroundColor: [
                "#519DE9",
                "#7CC674",
                "#73C5C5",
                "#8481DD",
                "#F6D173",
                "rgb(255, 146, 146)",
                "#D2D2D2",
              ],
              hoverOffset: 4,
              offset: 5,
            },
          ],
        }}
      />
      <div className="text-left ml-36 text-sm mt-6 text-slate-500">
        Top Product Sales by Category
      </div>
    </div>
  );
}

function SaleChart() {
  const [duration, setDuration] = useState("Month");
  const duraionMenu = ["Week", "Month", "Year"];
  const [currentBranch, setCurrentBranch] = useState("main");
  const [values, setValues] = useState([]);
  const [TheDataSet, setTheDataSet] = useState([]);

  const { sales } = useDatabase();

  useEffect(() => {
    if (sales) {
      const data = Object.values(sales[currentBranch]).map((d) =>
        Object.values(d)
          .map((a) => a.totalPrice)
          .reduce((a, b) => a + b, 0)
      );
      const dates = Object.values(sales[currentBranch]).map(
        (d) =>
          [
            ...new Set(
              Object.values(d).map((a) => new Date(a.date).toDateString())
            ),
          ][0]
      );
      const dataSet = {};
      dates.forEach((key, index) => {
        dataSet[key] = data[index];
      });

      const dataset = {};
      const now = new Date();

      // Get current month and year
      const year = now.getFullYear();
      const month = now.getMonth();

      // Loop through all days in the month
      for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
        const date = new Date(year, month, day);

        // Format the date to "Day Mon DD YYYY"
        const formattedDate = date.toDateString();

        let value;

        if (dataSet[formattedDate]) {
          value = dataSet[formattedDate];
        } else {
          value = 0;
        }

        // Add the formatted date and value to the dataset
        dataset[formattedDate] = value;
      }

      let values = Object.keys(dataset)
        .sort((a, b) => new Date(a) - new Date(b))
        .map((date) => dataset[date]);
      setValues(values);
    }
  }, [sales]);

  useEffect(() => {
    if (values) {
      switch (duration) {
        case "Week":
          const index = new Date().getDate() - getWeekNumber();
          setTheDataSet(values.slice(index, new Date().getDate()));
          break;
        case "Month":
          setTheDataSet(values.slice(0, new Date().getDate()));
          break;
        case "Year":
          const array = new Array(12).fill(0);
          array[new Date().getMonth()] =
            values.reduce((a, b) => a + b, 0) / values.length;
          setTheDataSet(array);
          break;
      }
    }
  }, [values, duration]);

  return (
    <>
      <div className="statistics__duration_menu my-6">
        {duraionMenu.map((d) => (
          <div
            key={d}
            className={
              "statistics__duration_menu__item" +
              " " +
              `${
                duration == d ? "statistics__duration_menu__item-current" : ""
              }`
            }
            onClick={() => setDuration(d)}
          >
            {d}
          </div>
        ))}
      </div>
      <Line
        options={{
          scales: {
            x: {
              grid: {
                display: false, // This will hide the x-axis grid lines
              },
            },
            y: {
              grid: {
                display: true, // This will hide the y-axis grid lines
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: `Total Sales in a ${duration.toWellFormed()}`,
              position: "bottom",
            },
          },
        }}
        data={{
          labels: labels[duration],
          datasets: [
            {
              id: 1,
              label: "Sale",
              data: TheDataSet,
              borderColor: "rgba(190, 209, 246)",
              backgroundColor: "rgb(190, 209, 246, 0.5)",
            },
          ],
        }}
      />
    </>
  );
}

function Statistics() {
  const { trainDataSet } = useDatabase();

  return (
    <div className="w-full h-full">
      <div className="flex flex-col">
        <div className="w-full h-[45vh]  border-b-0 flex justify-between items-center">
          <div className="w-[45%] mt-2">
            <SaleChart />
          </div>
          <div className="w-[40%] mt-2">
            <PieChart />
          </div>
        </div>
        <div className="w-full h-[50vh] border-2 border-b-0 mt-4">
          <div className="h-full aspect-video px-10 py-2 border-slate-200">
            <BarChart />
          </div>
        </div>
      </div>
    </div>
    // <div className="statistics">
    //   <div className="statistics__container">
    //     <div>

    //       <div className="statistics__line_charts">
    //         <CorrelationChart duration={duration} />
    //       </div>
    //     </div>
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "flex-end",
    //       }}
    //     >
    //       <div className="statistics__barchart__container">
    //         <BarChart />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Statistics;
