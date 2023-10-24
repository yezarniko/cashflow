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
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import incomeIcon from "@assets/income.png";
import expenseIcon from "@assets/expense.png";
import CorrelationImg from "@assets/stat_cor-2.png";
import { Button, Modal, Select, Skeleton } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
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

const currentMonthIndex = new Date().getMonth();

const labels = {
  Daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  Monthly: [...Array(getDaysInMonth(currentMonthIndex))].map(
    (_, idx) => idx + 1
  ),
  Yearly: [
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
  "Books",
  "Health & Wellness",
  "Jewelry",
  "Grocery",
  "Furniture",
  "Shoes",
  "Tools & Home Improvement",
  "Garden & Outdoor",
  "Pet Supplies",
  "Office Products",
  "Baby",
  "Musical Instruments",
  "Luggage & Travel",
  "Movies & TV",
  "Watches",
  "Video Games",
  "Appliances",
  "Arts, Crafts & Sewing",
  "Industrial & Scientific",
  "Software",
  "Handmade",
  "Collectibles & Fine Art",
  "Camera & Photo",
  "Cell Phones & Accessories",
  "Home Improvement",
  "Home Audio & Theater",
  "Industrial & Scientific",
  "Kindle Store",
  "Magazine Subscriptions",
  "Major Appliances",
  "Medical Supplies & Equipment",
  "Music",
  "Digital Music",
  "Music Instruments",
  "Software",
  "VHS",
  "Video",
  "PC & Video Games",
  "Apps & Games",
  "Gift Cards",
  "Amazon Devices",
  "Amazon Launchpad",
  "Amazon Pantry",
  "Amazon Warehouse",
  "Appliances",
  "Apps & Games",
  "Arts, Crafts & Sewing",
  "Audible Audiobooks",
  "Automotive",
  "Baby",
  "Beauty & Personal Care",
  "Books",
  "CDs & Vinyl",
  "Cell Phones & Accessories",
  "Clothing, Shoes & Jewelry",
  "Collectibles & Fine Art",
  "Computers",
  "Courses",
  "Credit and Payment Cards",
  "Digital Music",
  "Electronics",
  "Gift Cards",
  "Grocery & Gourmet Food",
  "Handmade",
  "Health, Household & Baby Care",
  "Home & Business Services",
  "Home & Kitchen",
  "Industrial & Scientific",
  "Kindle Store",
  "Kitchen & Dining",
  "Luggage & Travel Gear",
  "Luxury Beauty",
  "Magazine Subscriptions",
  "Movies & TV",
  "Musical Instruments",
  "Office Products",
  "Patio, Lawn & Garden",
  "Pet Supplies",
  "Prime Pantry",
  "Prime Video",
  "Software",
  "Sports & Outdoors",
  "Tools & Home Improvement",
  "Toys & Games",
  "Vehicles",
  "Video Games",
  "Wine",
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
  function generateRandomArray(length, max) {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * max) + 1;
      randomArray.push(randomNumber);
    }
    return randomArray;
  }

  function generateTwoRandomArrays(length) {
    const array1 = generateRandomArray(length, 100);
    const array2 = array1.map((value) => Math.floor(Math.random() * value));
    return [array1, array2];
  }

  const [array1, array2] = generateTwoRandomArrays(100);

  return (
    <div style={{ minWidth: "500px" }}>
      <Bar
        options={{
          plugins: {
            title: {
              display: true,
              position: "bottom",
              text: "Product Categories",
            },
            legend: {
              display: false,
            },
          },
          responsive: true,
          aspectRatio: 1 / 0.7,
          scales: {
            x: {
              grid: {
                display: false, // This will hide the x-axis grid lines
              },
              stacked: true,
              ticks: {
                display: false,
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
          labels: productCategories,
          datasets: [
            {
              label: "Current Sale",
              data: array2,
              backgroundColor: "rgb(255, 146, 146)",
            },
            {
              label: "Higest Sale",
              data: array1,
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

function Statistics() {
  const [duration, setDuration] = useState("Daily");
  const duraionMenu = ["Daily", "Monthly", "Yearly"];

  return (
    <div className="statistics">
      <div className="statistics__container">
        <div>
          <div className="statistics__duration_menu">
            {duraionMenu.map((d) => (
              <div
                key={d}
                className={
                  "statistics__duration_menu__item" +
                  " " +
                  `${
                    duration == d
                      ? "statistics__duration_menu__item-current"
                      : ""
                  }`
                }
                onClick={() => setDuration(d)}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="statistics__line_charts">
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
                    text: `Total account in ${duration.toLowerCase()}`,
                    position: "bottom",
                  },
                },
              }}
              data={{
                labels: labels[duration],
                datasets: [
                  {
                    id: 1,
                    label: "",
                    data: [100, 300, 200, 600, 500, 320, 700],
                    borderColor: "rgba(190, 209, 246, .35)",
                    backgroundColor: "rgb(190, 209, 246, 0.5)",
                  },
                ],
              }}
            />
            <CorrelationChart duration={duration} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div className="statistics__accountant__container">
            <Accountant
              label="Total Income"
              amount="1,300,000"
              icon={incomeIcon}
            />
            <Accountant
              label="Expense Income"
              amount="1,300,000"
              icon={expenseIcon}
            />
          </div>
          <div className="statistics__barchart__container">
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
