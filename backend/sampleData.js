const projects = [
  {
    id: "1",
    clientId: "101",
    name: "Website Redesign",
    description: "Redesign the company website for a better user experience.",
    status: "In progress",
  },
  {
    id: "2",
    clientId: "102",
    name: "Mobile App Development",
    description: "Develop a new mobile app for iOS and Android platforms.",
    status: "In progress",
  },
  {
    id: "3",
    clientId: "103",
    name: "Marketing Campaign",
    description: "Launch a new marketing campaign for product promotion.",
    status: "In progress",
  },
  {
    id: "4",
    clientId: "104",
    name: "Product Testing",
    description: "Conduct extensive testing of the new product before launch.",
    status: "In progress",
  },
  {
    id: "5",
    clientId: "105",
    name: "Sales Animportalysis",
    description: "Analyze and report on the company's sales data.",
    status: "In progress",
  },
];
const clients = [
  {
    id: "101",
    name: "ABC Corporation",
    email: "abc@example.com",
    phone: "123-456-7890",
  },
  {
    id: "102",
    name: "XYZ Enterprises",
    email: "xyz@example.com",
    phone: "987-654-3210",
  },
  {
    id: "103",
    name: "Smith & Co.",
    email: "smith@example.com",
    phone: "555-123-4567",
  },
  {
    id: "104",
    name: "Tech Innovators Ltd.",
    email: "tech@example.com",
    phone: "777-888-9999",
  },
  {
    id: "105",
    name: "Global Solutions Inc.",
    email: "global@example.com",
    phone: "333-444-5555",
  },
];

const userAuths = [
  {
    userId: 1,
    branches: [
      {
        branchId: 13023,
        branchToken:
          "835cb6c05610b837dfe160d0d5e3868b8046a5ee697e896cbac88da5f6d3d49c",
      },
      {
        branchId: 12043,
        branchToken:
          "839cb6c05610b837df323423d5e3868b8046a5ee697e896cbac88da5f6d3d49c",
      },
    ],
    accountToken:
      "a2fdaf9cd152e8512ee126ecd704c5a23e1ec033a1552851d9a70c5cd538952d",
  },
  {
    userId: 2,
    branches: [
      {
        branchId: 14023,
        branchToken:
          "835cb6c05610b837dfe160d0d5e3868b8046a5ee697e896cbac88da5f6d3d49d",
      },
      {
        branchId: 12044,
        branchToken:
          "839cb6c05610b837df323423d5e3868b8046a5ee697e896cbac88da5f6d3d49d",
      },
    ],
    accountToken:
      "b2fdaf9cd152e8512ee126ecd704c5a23e1ec033a1552851d9a70c5cd538952e",
  },
  {
    userId: 3,
    branches: [
      {
        branchId: 15023,
        branchToken:
          "835cb6c05610b837dfe160d0d5e3868b8046a5ee697e896cbac88da5f6d3d49e",
      },
      {
        branchId: 12045,
        branchToken:
          "839cb6c05610b837df323423d5e3868b8046a5ee697e896cbac88da5f6d3d49f",
      },
    ],
    accountToken:
      "c2fdaf9cd152e8512ee126ecd704c5a23e1ec033a1552851d9a70c5cd538952f",
  },
  {
    userId: 4,
    branches: [
      {
        branchId: 16032,
        branchToken:
          "835cb6c05610b837dfe160d0d5e3868b8046a5ee697e896cbac88da5f6d3d49g",
      },
      {
        branchId: 12046,
        branchToken:
          "839cb6c05610b837df323423d5e3868b8046a5ee697e896cbac88da5f6d3d49h",
      },
    ],
    accountToken:
      "d2fdaf9cd152e8512ee126ecd704c5a23e1ec033a1552851d9a70c5cd538952g",
  },
  {
    userId: 5,
    branches: [
      {
        branchId: 17042,
        branchToken:
          "835cb6c05610b837dfe160d0d5e3868b8046a5ee697e896cbac88da5f6d3d49i",
      },
      {
        branchId: 12047,
        branchToken:
          "839cb6c05610b837df323423d5e3868b8046a5ee697e896cbac88da5f6d3d49j",
      },
    ],
    accountToken:
      "e2fdaf9cd152e8512ee126ecd704c5a23e1ec033a1552851d9a70c5cd538952h",
  },
];

const users = [
  {
    id: 1,
    name: "user1",
    email: "user1@example.com",
    branches: [
      {
        name: "main",
        branchId: 13023,
      },
      {
        name: "shop1",
        branchId: 12043,
      },
    ],
  },
  {
    id: 2,
    name: "user2",
    email: "user2@example.com",
    branches: [
      {
        name: "main",
        branchId: 14023,
      },
      {
        name: "shop2",
        branchId: 12044,
      },
    ],
  },
  {
    id: 3,
    name: "user3",
    email: "user3@example.com",
    branches: [
      {
        name: "main",
        branchId: 15023,
      },
      {
        name: "shop3",
        branchId: 12045,
      },
    ],
  },
  {
    id: 4,
    name: "user4",
    email: "user4@example.com",
    branches: [
      {
        name: "main",
        branchId: 16032,
      },
      {
        name: "shop4",
        branchId: 12046,
      },
    ],
  },
  {
    id: 5,
    name: "user5",
    email: "user5@example.com",
    branches: [
      {
        name: "main",
        branchId: 17042,
      },
      {
        name: "shop5",
        branchId: 12047,
      },
    ],
  },
];

// const POS = [
//   {
//     userId: 1,
//     branches: [
//       {
//         branchName: "main",
//         branchId: 13023,
//         productList: productList,
//       },
//     ],
//   },
// ];

// const productList = {
//   "branchId": 13023,
//   "products" : {
//     productID: 1,
//     price: "",
//     productLogs: [
//       {
//         date: "",
//       },
//     ],
//   },
// };

module.exports = { projects, clients, userAuths, users };
