import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@assets/search-icon.svg";
import RefreshIcon from "@assets/refresh.png";
import SortIcon from "@assets/sort-az.png";
import ProductImg from "@assets/Eggs.jpg";
import ProductThumbnailImage from "@assets/Sale.png";
import AddIcon from "@assets/add.png";
import PlusIcon from "@assets/plus.png";
import FilterIcon from "@assets/filter.png";
import EditIcon from "@assets/edit.png";
import CorrelationsIcon from "@assets/correlations.png";
import DeleteIcon from "@assets/delete.png";
import CategoriesIcon from "@assets/categories.png";
import BrandsIcon from "@assets/brands.png";
import ProductLogIcon from "@assets/income1.png";
import ProductSalesIcon from "@assets/product_sales.png";

import {
  Dropdown,
  Drawer,
  Tabs,
  Radio,
  Popover,
  Space,
  Button,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  message,
  Image,
  ConfigProvider,
} from "antd";
import {
  MoreOutlined,
  FilterOutlined,
  InboxOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useUser } from "@hooks/useUser";
import { useDatabase } from "@hooks/useDatabase";
import { useFireBaseStorage } from "@hooks/useFirebaseStorage";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import BranchSelector from "@comp/BranchSelector";
import clsx from "clsx";
import { ReactBarcode } from "react-jsbarcode";
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
import { Line, Scatter } from "react-chartjs-2";
import { date } from "yup";
import { useBranch } from "@hooks/useBranch";

ChartJS.register(
  CategoryScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LinearScale
);

function MenuItem({ imgLink, text, onClick }) {
  return (
    <div
      className="flex items-center mb-3 cursor-pointer font-bold text-slate-500 text-base"
      onClick={() => onClick()}
    >
      <img src={imgLink} className="w-4 mr-4" /> {text}
    </div>
  );
}

// const GET_PRODUCTS = gql`
//   query getProducts(
//     $userId: String!
//     $token: String!
//     $branchId: String!
//     $branchToken: String!
//   ) {
//     products(
//       userId: $userId
//       token: $token
//       branchId: $branchId
//       branchToken: $branchToken
//     ) {
//       productImg
//       productName
//       productId
//       category
//       brand
//       buyingPrice
//       salePrice
//       domainCounts
//       counts
//       recentModifiedDate
//       productLogs {
//         date
//         counts
//         buyingPrice
//         amount
//       }
//     }
//     categories {
//       name
//     }
//     brands {
//       name
//     }
//   }
// `;

// const DELETE_PRODUCT = gql`
//   mutation DeleteProduct(
//     $userId: String!
//     $accountToken: String!
//     $branchId: String!
//     $branchToken: String!
//     $productId: String!
//   ) {
//     deleteProduct(
//       userId: $userId
//       accountToken: $accountToken
//       branchId: $branchId
//       branchToken: $branchToken
//       productId: $productId
//     ) {
//       productImg
//       productName
//       productId
//       category
//       brand
//       buyingPrice
//       salePrice
//       domainCounts
//       counts
//       recentModifiedDate
//     }
//   }
// `;

// function Products() {
//   const { currentUser } = useUser();

//   // const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
//   //   variables: {
//   //     userId: currentUser.uid,
//   //     token: currentUser.accessToken,
//   //     branchId: "97642144875",
//   //     branchToken: "20746829937",
//   //   },
//   // });

//   const [data, setData] = useState({
//     products: [
//       {
//         productId: 1233190909,
//         productName: "Apple",
//         productImg: "https://wiki.archlinux.org//favicon.ico",
//         category: "Fruits",
//         brand: "Sungsaung",
//         buyingPrice: 240,
//         salePrice: 300,
//         domainCounts: 20,
//         counts: 200,
//         recentModifiedDate: new Date(),
//         productLogs: [],
//       },
//       {
//         productId: 0,
//         productName: "Apple",
//         productImg: "https://wiki.archlinux.org//favicon.ico",
//         category: "Fruits",
//         brand: "",
//         buyingPrice: 240,
//         salePrice: 300,
//         domainCounts: 20,
//         counts: 200,
//         recentModifiedDate: new Date(),
//         productLogs: [],
//       },
//     ],
//   });

// const { productList, loading } = useDatabase();

//   // const [DeleteProduct, { data: d }] = useMutation(DELETE_PRODUCT);

//   function ProductImage({ Ref, editMode, url }) {
//     const [imgLink, setImgLink] = useState(url);
//     const [showChangeButton, setShowChangeButton] = useState(false);
//     const prevImgLink = useRef(null);

//     useEffect(() => {
//       prevImgLink.current = imgLink;
//     }, []);

//     useEffect(() => {
//       setImgLink(url);
//     }, [editMode]);

//     const handleImageChange = (event) => {
//       const file = event.target.files[0];
//       if (file && file.type.startsWith("image/")) {
//         setImgLink(URL.createObjectURL(file));
//       }
//     };

//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//         onMouseEnter={(e) => {
//           setShowChangeButton(true);
//         }}
//         onMouseLeave={(e) => {
//           setShowChangeButton(false);
//         }}
//       >
//         {editMode && showChangeButton ? (
//           <div
//             style={{
//               position: "absolute",
//               zIndex: "1",
//               fontSize: ".8rem",
//               width: "50%",
//               margin: "0 auto",
//             }}
//           >
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               style={{ display: "none" }}
//               id="imageInput"
//             />
//             <label
//               htmlFor="imageInput"
//               style={{
//                 color: "var(--primary-color)",
//                 cursor: "pointer",
//               }}
//             >
//               Change
//               <br />
//               Image
//             </label>
//           </div>
//         ) : (
//           ""
//         )}
//         <img ref={Ref} src={imgLink} />
//       </div>
//     );
//   }

//   function ProductItem({ data, categories, brands }) {
//     const [editMode, setEditMode] = useState(false);
//     const [isOpenAppendModal, openAppendModal] = useState(false);
//     const [isOpenLogModal, openLogModal] = useState(false);
//     const { currentUser } = useUser();

//     const editModeProductNameRef = useRef(null);
//     const editModeProductImageRef = useRef(null);
//     const [editModeSelectCategory, setEditModeSelectCategory] = useState("");
//     const [editModeSelectBrand, setEditModeSelectBrand] = useState("");
//     const editModeSalePriceRef = useRef(null);
//     const editModeBuyingPriceRef = useRef(null);

//     const layout = {
//       labelCol: {
//         span: 8,
//       },
//       wrapperCol: {
//         span: 16,
//       },
//     };

//     const APPEND_PRODUCT = gql`
//       mutation AppendProduct(
//         $userId: String!
//         $accountToken: String!
//         $branchId: String!
//         $branchToken: String!
//         $productId: String!
//         $counts: Int!
//         $salePrice: Int
//         $buyingPrice: Int
//       ) {
//         appendProduct(
//           userId: $userId
//           accountToken: $accountToken
//           branchId: $branchId
//           branchToken: $branchToken

//           productId: $productId
//           counts: $counts
//           salePrice: $salePrice
//           buyingPrice: $buyingPrice
//         ) {
//           productName
//           productId
//           buyingPrice
//           salePrice
//           counts
//           domainCounts
//         }
//       }
//     `;

//     const [_AppendProduct, { loading }] = useMutation(APPEND_PRODUCT);

//     return (
//       <>
//         <Modal
//           width={"400px"}
//           style={{ padding: 0 }}
//           centered
//           open={isOpenAppendModal}
//           footer={null}
//           // closeIcon={null}
//           onCancel={() => openAppendModal(false)}
//         >
//           <div className="append__product">
//             <h3>Append Product</h3>
//             <div className="append__product__product__info">
//               <div className="append__product__product__info__title">
//                 <div className="append__product__product__info__title__item">
//                   Product Name
//                 </div>
//                 <div className="append__product__product__info__title__detail">
//                   {data.productName}
//                 </div>
//               </div>
//               <div className="append__product__product__info__title">
//                 <div className="append__product__product__info__title__item">
//                   Product ID
//                 </div>
//                 <div className="append__product__product__info__title__detail append__product__product__info__title-id">
//                   {data.productId}
//                 </div>
//               </div>
//               <div className="append__product__product__info__title">
//                 <div className="append__product__product__info__title__item">
//                   BranchId
//                 </div>
//                 <div className="append__product__product__info__title__detail append__product__product__info__title-branch">
//                   {97642144875}
//                 </div>
//               </div>
//               <div className="append__product__product__info__title">
//                 <div className="append__product__product__info__title__item">
//                   Modified Date
//                 </div>
//                 <div className="append__product__product__info__title__detail">
//                   {new Date(data.recentModifiedDate).toLocaleDateString()}
//                 </div>
//               </div>
//               <div className="append__product__product__info__title">
//                 <div className="append__product__product__info__title__item">
//                   Recent Domain Counts
//                 </div>
//                 <div className="append__product__product__info__title__detail">
//                   {data.domainCounts}
//                 </div>
//               </div>
//               <div className="append__product__product__info__title">
//                 <div className="append__product__product__info__title__item">
//                   Remain Counts
//                 </div>
//                 <div className="append__product__product__info__title__detail">
//                   {data.counts}
//                 </div>
//               </div>
//             </div>
//             <div className="append__product__line"></div>
//             <div className="append__product__product__retangle">
//               <Form
//                 {...layout}
//                 name="append_message"
//                 onFinish={async (value) => {
//                   if (!loading) {
//                     try {
//                       await _AppendProduct({
//                         variables: {
//                           userId: currentUser.uid,
//                           accountToken: currentUser.accessToken,
//                           branchId: "97642144875",
//                           branchToken: "20746829937",

//                           productId: data.productId,
//                           counts: value.counts,
//                           buyingPrice: parseInt(value.buyingPrice),
//                           salePrice: parseInt(value.salePrice),
//                         },
//                       });
//                       openAppendModal(false);
//                       refetch();
//                       message.success(`${data.productName} appended`);
//                     } catch (error) {
//                       console.log(error.message);
//                     }
//                   }
//                 }}
//                 style={{
//                   maxWidth: 300,
//                   margin: "0 auto",
//                 }}
//               >
//                 <Form.Item name="counts" label="Append">
//                   <InputNumber defaultValue={0} />
//                 </Form.Item>
//                 <Form.Item name="buyingPrice" label="Buying Price">
//                   <Input defaultValue={data.buyingPrice} />
//                 </Form.Item>
//                 <Form.Item name="salingPrice" label="Saling Price">
//                   <Input defaultValue={data.salePrice} />
//                 </Form.Item>

//                 <Form.Item
//                   wrapperCol={{
//                     ...layout.wrapperCol,
//                     offset: 8,
//                   }}
//                 >
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     style={{ marginRight: 20 }}
//                   >
//                     Submit
//                   </Button>

//                   <Button
//                     htmlType="button"
//                     onClick={() => openAppendModal(false)}
//                   >
//                     Cancel
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </div>
//           </div>
//         </Modal>
//         <Modal
//           centered
//           width={"450px"}
//           height={"550px"}
//           open={isOpenLogModal}
//           onCancel={() => openLogModal(false)}
//           footer={null}
//         >
//           <div className="product__log">
//             <h3>Product Logs</h3>
//             <div className="product__log__product__info">
//               <div className="product__log__product__info__title">
//                 <div className="product__log__product__info__title__item">
//                   Product Name
//                 </div>
//                 <div className="product__log__product__info__title__detail">
//                   {data.productName}
//                 </div>
//               </div>
//               <div className="product__log__product__info__title">
//                 <div className="product__log__product__info__title__item">
//                   Product ID
//                 </div>
//                 <div className="product__log__product__info__title__detail append__product__product__info__title-id">
//                   {data.productId}
//                 </div>
//               </div>
//               <div className="product__log__product__info__title">
//                 <div className="product__log__product__info__title__item">
//                   Branch
//                 </div>
//                 <div className="product__log__product__info__title__detail append__product__product__info__title-branch">
//                   {97642144875}
//                 </div>
//               </div>
//               <div className="product__log__product__info__title">
//                 <div className="product__log__product__info__title__item">
//                   Last Modified Date
//                 </div>
//                 <div className="product__log__product__info__title__detail">
//                   {new Date(data.recentModifiedDate).toLocaleDateString()}
//                 </div>
//               </div>
//             </div>
//             <Table
//               pagination={{ pageSize: 4 }}
//               columns={[
//                 {
//                   title: "Date",
//                   dataIndex: "date",
//                   key: "date",
//                   render: (date) => <>{new Date(date).toLocaleDateString()}</>,
//                 },
//                 {
//                   title: "Counts",
//                   dataIndex: "counts",
//                   key: "counts",
//                 },
//                 {
//                   title: "Buying Price",
//                   dataIndex: "buyingPrice",
//                   key: "buyingPrice",
//                 },
//                 {
//                   title: "Amount",
//                   dataIndex: "amount",
//                   key: "amount",
//                 },
//               ]}
//               dataSource={[...data.productLogs.reverse()]}
//             />
//           </div>
//         </Modal>
//         <tr className={editMode ? "products__table__item__edit_mode" : ""}>
//           <td
//             style={{
//               position: "relative",
//             }}
//           >
//             <ProductImage
//               Ref={editModeProductImageRef}
//               editMode={editMode}
//               url={data.productImg}
//             />
//           </td>
//           {editMode ? (
//             <td>
//               <Input
//                 ref={editModeProductNameRef}
//                 defaultValue={data.productName}
//               />
//             </td>
//           ) : (
//             <td>{data.productName}</td>
//           )}
//           <td>{data.productId}</td>
//           {editMode ? (
//             <>
//               <td>
//                 <Select
//                   defaultValue={data.category}
//                   onChange={(e) => {
//                     setEditModeSelectCategory(e.target);
//                   }}
//                 >
//                   {categories?.map((category) => (
//                     <Select.Option value={category.name}>
//                       {category.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </td>
//               <td>
//                 <Select
//                   defaultValue={data.brand}
//                   onChange={(e) => {
//                     setEditModeSelectBrand(e);
//                   }}
//                 >
//                   {brands?.map((brand) => (
//                     <Select.Option value={brand.name}>
//                       {brand.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </td>
//               <td>
//                 <Input
//                   ref={editModeBuyingPriceRef}
//                   defaultValue={data.buyingPrice}
//                 />
//               </td>
//               <td>
//                 <Input
//                   ref={editModeSalePriceRef}
//                   defaultValue={data.salePrice}
//                 />
//               </td>
//             </>
//           ) : (
//             <>
//               <td>{data.category}</td>
//               <td>{data.brand}</td>
//               <td>{data.buyingPrice} ks</td>
//               <td>{data.salePrice} ks</td>
//             </>
//           )}
//           <td>{data.domainCounts}</td>
//           <td>{data.counts}</td>
//           {editMode ? (
//             <>
//               <td>
//                 <Button
//                   type="primary"
//                   onClick={(e) => {
//                     console.log(editModeProductNameRef.current.input.value);
//                     console.log(editModeBuyingPriceRef.current.input.value);
//                     console.log(editModeSalePriceRef.current.input.value);
//                     console.log(editModeProductImageRef.current.src);
//                     console.log(editModeSelectCategory);
//                     console.log(editModeSelectBrand);
//                     // console.log(editModeBrandRef.current.input.value);
//                   }}
//                 >
//                   Save
//                 </Button>
//               </td>
//               <td>
//                 <Button type="default" onClick={() => setEditMode(false)}>
//                   Cancel
//                 </Button>
//               </td>
//             </>
//           ) : (
//             <>
//               <td>{new Date(data.recentModifiedDate).toLocaleDateString()}</td>
//               <td>
//                 <Popover
//                   placement="bottom"
//                   content={
//                     <div className="products__table__item__menu">
//                       <MenuItem
//                         imgLink={PlusIcon}
//                         text="Append"
//                         onClick={async () => {
//                           openAppendModal(true);
//                         }}
//                       />
//                       <MenuItem
//                         imgLink={FilterIcon}
//                         text="Logs"
//                         onClick={() => {
//                           openLogModal(true);
//                         }}
//                       />
//                       <MenuItem
//                         imgLink={EditIcon}
//                         text="Edit"
//                         onClick={() => setEditMode(true)}
//                       />
//                       <MenuItem
//                         imgLink={DeleteIcon}
//                         text={<div style={{ color: "red" }}>Delete</div>}
//                         onClick={async () => {
//                           try {
//                             await DeleteProduct({
//                               variables: {
//                                 userId: currentUser.uid,
//                                 accountToken: currentUser.accessToken,
//                                 branchId: "97642144875",
//                                 branchToken: "20746829937",
//                                 productId: data.productId,
//                               },
//                             });
//                             refetch();
//                           } catch (error) {
//                             console.log(error.message);
//                           }
//                         }}
//                       />
//                     </div>
//                   }
//                 >
//                   <MoreOutlined />
//                 </Popover>
//               </td>
//             </>
//           )}
//         </tr>
//       </>
//     );
//   }

//   if (loading) return <>Loading...</>;

//   return (
//     <>
//       <div className="products">
//         <div className="products__card">
//           <div className="products__header">
//             <div className="search">
//               <img src={SearchIcon} className="search__icon" />
//               <input placeholder="Product Name or ID" />
//             </div>
//             <div className="refresh" onClick={() => refetch()}>
//               <img src={RefreshIcon} />
//             </div>
//             <div className="products__options">
//               <MoreOutlined />
//             </div>
//             <div></div>
//             <div className="products__filter">
//               <Dropdown.Button>
//                 <FilterOutlined />
//                 Filter
//               </Dropdown.Button>
//             </div>
//             <div className="products__sort">
//               <Dropdown.Button>
//                 <div style={{ display: "flex", alignItems: "cneter" }}>
//                   <img
//                     src={SortIcon}
//                     style={{
//                       width: "17px",
//                       aspectRatio: "1/1",
//                       marginRight: ".5em",
//                     }}
//                   />
//                   Sort
//                 </div>
//               </Dropdown.Button>
//             </div>
//             <div className="products__branch"></div>
//           </div>
//           <div className="products__table">
//             <table>
//               <thead>
//                 <tr className="products__table__header">
//                   <th></th>
//                   <th>Product Name</th>
//                   <th>Product Id</th>
//                   <th>Category</th>
//                   <th>Brand</th>
//                   <th>Buying Price</th>
//                   <th>Sale Price</th>
//                   <th>Domain Counts</th>
//                   <th>Counts</th>
//                   <th>Recent Modified Date</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {!loading &&
//                   productList.main.map((product) => (
//                     <ProductItem
//                       key={product.productId}
//                       data={product}
//                       categories={data.categories}
//                       brands={data.brands}
//                     />
//                   ))}
//                 {productList.main.length == 0 && (
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       height: "100%",
//                       color: "var(--second-color)",
//                     }}
//                   >
//                     <InboxOutlined
//                       style={{
//                         fontSize: "4rem",
//                       }}
//                     />
//                     Empty Products
//                   </div>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <Link to={"/addnewproducts"}>
//             <div className="products__add_new_product">
//               <img src={AddIcon} />
//               Add New Product
//             </div>
//           </Link>
//         </div>
//       </div>
//       <div id="triangle-bottomright"></div>
//       <div id="triangle-topright"></div>
//     </>
//   );
// }

function Products() {
  const [products, setProducts] = useState([]);
  const [isCategoriesModalOpen, setIsCategoreisModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const [sortProduct, setSortProduct] = useState("ByDate");
  const [isAccending, setIsAccending] = useState(false);

  const [currentCategoryFilter, setCurrentCategoryFilter] = useState("");
  const [currentBrandFilter, setCurrentBrandFilter] = useState("");

  const { categories, brands } = useDatabase();

  return (
    <div className="products">
      <CategoriesModal
        isModalOpen={isCategoriesModalOpen}
        setModalOpen={setIsCategoreisModalOpen}
      />
      <BrandsModal
        isModalOpen={isBrandModalOpen}
        setModalOpen={setIsBrandModalOpen}
      />
      <div className="products__card">
        <div className="w-full h-1/5 flex flex-col justify-between">
          <div className="flex  justify-between">
            <SearchBox {...{ setProducts }} className="search w-1/5" />
            <AddNewProductButton />
          </div>
          <div className="flex justify-end mb-4 items-center">
            <div className="flex flex-row grow">
              <div className="mr-6">
                <BranchSelector />
              </div>
              <div
                onClick={() => setIsCategoreisModalOpen((state) => !state)}
                className="text-slate-700 px-2 py-1 rounded-lg border-2 mr-2 flex items-center cursor-pointer"
              >
                <div className="w-5 mr-1">
                  <img
                    src={CategoriesIcon}
                    className="w-full h-full object-cover"
                  />
                </div>
                Categories
              </div>
              <div
                onClick={() => setIsBrandModalOpen((state) => !state)}
                className="text-slate-700 px-2 py-1 rounded-lg border-2 mr-2 flex items-center cursor-pointer"
              >
                <div className="w-5 mr-1">
                  <img
                    src={BrandsIcon}
                    className="w-full h-full object-cover"
                  />
                </div>
                Brands
              </div>
            </div>

            <Dropdown.Button
              className="w-auto mr-4"
              menu={{
                items: [
                  {
                    label: "Categories",
                    children: [
                      {
                        label: (
                          <>
                            <Radio.Group
                              onChange={(e) =>
                                setCurrentCategoryFilter(e.target.value)
                              }
                              value={currentCategoryFilter}
                            >
                              <Space direction="vertical">
                                <Radio value={""} key={""}>
                                  <div className="font-sans">All</div>
                                </Radio>
                                {categories?.map((category) => (
                                  <Radio value={category} key={category}>
                                    <div className="font-sans">{category}</div>
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                            <div className="w-full border-1 bg-sky-100 mb-2 mt-3"></div>
                          </>
                        ),
                        key: "3",
                      },
                    ],
                    key: "1",
                    type: "group",
                  },
                  {
                    label: "Brands",
                    children: [
                      {
                        label: (
                          <>
                            <Radio.Group
                              onChange={(e) =>
                                setCurrentBrandFilter(e.target.value)
                              }
                              value={currentBrandFilter}
                            >
                              <Space direction="vertical">
                                <Radio value={""} key={""}>
                                  <div className="font-sans">All</div>
                                </Radio>
                                {brands?.map((brand) => (
                                  <Radio value={brand} key={brand}>
                                    <div className="font-sans">{brand}</div>
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                            <div className="w-full border-1 bg-sky-100 mb-2 mt-3"></div>
                          </>
                        ),
                        key: "4",
                      },
                    ],
                    key: "2",
                    type: "group",
                  },
                ],
                onClick: () => {},
              }}
            >
              <div className="flex items-center text-base font-sans">
                <img src={FilterIcon} className="w-6 aspect-square mr-2" />
                Filter
              </div>
            </Dropdown.Button>
            <Dropdown.Button
              className="w-auto"
              menu={{
                items: [
                  {
                    label: (
                      <>
                        <Radio.Group
                          onChange={(e) => setSortProduct(e.target.value)}
                          value={sortProduct}
                        >
                          <Space direction="vertical">
                            <Radio value={"ByName"}>
                              <div className="font-sans">By Name</div>
                            </Radio>
                            <Radio value={"ByDate"}>
                              <div className="font-sans">By Recently Added</div>
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
              <div className="flex items-center text-base font-sans">
                <img src={SortIcon} className="w-6 aspect-square mr-2" />
                Sort
              </div>
            </Dropdown.Button>
          </div>
        </div>
        <ProductsTable
          {...{
            products,
            setProducts,
            sortProduct,
            isAccending,
            currentCategoryFilter,
            currentBrandFilter,
            setCurrentCategoryFilter,
            setCurrentBrandFilter,
          }}
        />
      </div>
    </div>
  );
}

export function CategoriesModal({ isModalOpen, setModalOpen }) {
  const [categories, setCategories] = useState([]);
  const { categories: c, createCategory } = useDatabase();
  const categoriesBoxRef = useRef(null);
  const [isFirstAttampt, setIsFirstAttampt] = useState(true);

  useEffect(() => {
    if (c) {
      if (c.length !== 0) {
        if (isFirstAttampt) {
          setCategories(c);
          setIsFirstAttampt(false);
        }
      }
    }
  }, [c]);

  useEffect(() => {
    if (isModalOpen) {
      createCategory(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (isModalOpen) {
      categoriesBoxRef.current.scrollTop =
        categoriesBoxRef.current.scrollHeight;
    }
  }, [categories.length]);

  return (
    <Modal
      zIndex={"5001"}
      title={
        <div className="w-full text-lg  text-slate-700 flex items-center justify-center font-sans">
          <div className="w-6 mr-2">
            <img src={CategoriesIcon} className="w-full h-full object-cover" />
          </div>
          Categories
        </div>
      }
      open={isModalOpen}
      onCancel={() => setModalOpen((state) => !state)}
      footer={null}
    >
      <div
        className="h-72 mt-10 overflow-y-scroll scroll-smooth mb-8"
        ref={categoriesBoxRef}
      >
        {categories.length === 0 && (
          <div className="flex items-center justify-center h-full font-sans">
            Create New Category
          </div>
        )}
        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            categoryName={category}
            setCategories={setCategories}
            categoryIndex={index}
          />
        ))}
      </div>
      <div
        onClick={() => {
          setCategories((categories) => [...categories, ""]);
        }}
        className="flex items-center justify-center font-bold text-slate-600 font-sans border-2 p-1 rounded-full border-sky-200/70 hover:bg-sky-200/30 cursor-pointer"
      >
        <img src={AddIcon} className="w-8 mr-2" /> Add New Category
      </div>
    </Modal>
  );
}

function CategoryItem({ categoryName, setCategories, categoryIndex }) {
  const [enableEditMode, setEditMode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (categoryName === "") {
      setEditMode(true);
    }
  }, []);

  useEffect(() => {
    if (categoryName === "") {
      inputRef.current.focus();
    }
  }, [enableEditMode]);

  return (
    <div
      className={clsx(
        "flex justify-between items-center px-4 py-3 border-2  last:border-b-2  hover:bg-sky-200/20 select-none",
        enableEditMode ? "border-sky-300" : "border-sky-300/20",
        !enableEditMode && "border-b-0"
      )}
      onMouseLeave={() => {
        if (inputRef.current.value !== categoryName) {
          // setCategories((categories) => {
          //   let newCategories = [...categories];
          //   newCategories[categoryIndex] = inputRef.current.value;
          //   return [...new Set(newCategories)];
          // });
          // setEditMode(false);
        }
        if (categoryName != "") setEditMode(false);
      }}
    >
      <div className="grow text-slate-900 text-base ">
        <input
          ref={inputRef}
          defaultValue={categoryName}
          type="text"
          className="w-full border-none focus:outline-none font-sans"
          disabled={!enableEditMode}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              setCategories((categories) => {
                let newCategories = [...categories];
                newCategories[categoryIndex] = inputRef.current.value;
                return [...new Set(newCategories)];
              });
              setEditMode(false);
            }
          }}
        />
      </div>
      <div className="mr-2 cursor-pointer">
        <img
          src={EditIcon}
          className="w-5"
          onClick={() => setEditMode((state) => !state)}
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          setCategories((categories) => {
            let newCategories = [...categories];
            newCategories = newCategories.filter(
              (category) => category !== categoryName
            );
            return newCategories;
          });
        }}
      >
        <img src={DeleteIcon} className="w-4" />
      </div>
    </div>
  );
}

export function BrandsModal({ isModalOpen, setModalOpen }) {
  const [brands, setBrands] = useState([]);
  const { brands: b, createBrand } = useDatabase();
  const brandsBoxRef = useRef(null);
  const [isFirstAttampt, setIsFirstAttampt] = useState(true);

  useEffect(() => {
    if (b) {
      if (b.length !== 0) {
        if (isFirstAttampt) {
          setBrands(b);
          setIsFirstAttampt(false);
        }
      }
    }
  }, [b]);

  useEffect(() => {
    if (isModalOpen) {
      createBrand(brands);
    }
  }, [brands]);

  useEffect(() => {
    if (isModalOpen) {
      brandsBoxRef.current.scrollTop = brandsBoxRef.current.scrollHeight;
    }
  }, [brands.length]);

  return (
    <Modal
      zIndex={"5001"}
      title={
        <div className="w-full text-lg  text-slate-700 flex items-center justify-center font-sans">
          <div className="w-6 mr-2">
            <img src={BrandsIcon} className="w-full h-full object-cover" />
          </div>
          Brands
        </div>
      }
      open={isModalOpen}
      onCancel={() => setModalOpen((state) => !state)}
      footer={null}
    >
      <div
        className="h-72 mt-10 overflow-y-scroll scroll-smooth mb-8"
        ref={brandsBoxRef}
      >
        {brands.length === 0 && (
          <div className="flex items-center justify-center h-full font-sans">
            Add New Brand
          </div>
        )}
        {brands.map((brand, index) => (
          <BrandItem
            key={index}
            brandName={brand}
            setBrands={setBrands}
            brandIndex={index}
          />
        ))}
      </div>
      <div
        onClick={() => {
          setBrands((brands) => [...brands, ""]);
        }}
        className="flex text-center items-center justify-center font-bold text-slate-600 font-sans border-2 p-1 rounded-full border-sky-200/70 hover:bg-sky-200/30 cursor-pointer"
      >
        <img src={AddIcon} className="w-8 mr-2" /> Add New Brand
      </div>
    </Modal>
  );
}

function BrandItem({ brandName, setBrands, brandIndex }) {
  const [enableEditMode, setEditMode] = useState(false);
  const inputBrandRef = useRef(null);

  useEffect(() => {
    if (brandName === "") {
      setEditMode(true);
    }
  }, []);

  useEffect(() => {
    if (brandName === "") {
      inputBrandRef.current.focus();
    }
  }, [enableEditMode]);

  return (
    <div
      className={clsx(
        "flex justify-between items-center px-4 py-3 border-2  last:border-b-2  hover:bg-sky-200/20 select-none",
        enableEditMode ? "border-sky-300" : "border-sky-300/20",
        !enableEditMode && "border-b-0"
      )}
      onMouseLeave={() => {
        if (inputBrandRef.current.value !== brandName) {
          // setBrands((brands) => {
          //   let newBrands = [...brands];
          //   newBrands[brandIndex] = inputBrandRef.current.value;
          //   console.log(brandIndex);
          //   console.log(newBrands);
          //   return [...new Set(newBrands)];
          // });
          setEditMode(false);
        }
        if (brandName != "") setEditMode(false);
      }}
    >
      <div className="grow text-slate-900 text-base ">
        <input
          ref={inputBrandRef}
          defaultValue={brandName}
          type="text"
          className="w-full border-none focus:outline-none font-sans"
          disabled={!enableEditMode}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              setBrands((brands) => {
                console.log("run this shit");
                let newBrands = [...brands];
                newBrands[brandIndex] = inputBrandRef.current.value;
                console.log(brandIndex);
                console.log(newBrands);
                return [...new Set(newBrands)];
              });
              setEditMode(false);
            }
          }}
        />
      </div>
      <div className="mr-2 cursor-pointer">
        <img
          src={EditIcon}
          className="w-5"
          onClick={() => setEditMode((state) => !state)}
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          setBrands((brands) => brands.filter((brand) => brand !== brandName));
        }}
      >
        <img src={DeleteIcon} className="w-4" />
      </div>
    </div>
  );
}

export function SearchBox({ setProducts, className }) {
  const [queryProducts, setQueryProducts] = useState([]);

  const { productList } = useDatabase();

  const { currentBranch } = useBranch();

  useEffect(() => {
    if (productList) {
      if (productList[currentBranch]) {
        let Products = Object.values(productList[currentBranch]);
        Products.sort(
          (a, b) =>
            new Date(a.recentModifiedDate) - new Date(b.recentModifiedDate)
        ).reverse();
        setQueryProducts(Products);
      }
    }
  }, [productList]);

  return (
    <div className={className}>
      <img src={SearchIcon} className="search__icon" />
      <input
        placeholder="Product Name or ID"
        onChange={(e) => {
          let Products = queryProducts.filter((product) => {
            let results = product.productName
              .toLocaleLowerCase()
              .includes(e.target.value.toLocaleLowerCase());
            if (!results) {
              results = product.productId
                .toLocaleLowerCase()
                .includes(e.target.value.toLocaleLowerCase());
            }
            return results;
          });
          setProducts(Products);
        }}
      />
    </div>
  );
}

function AddNewProductButton() {
  return (
    <Link to={"/addnewproducts"}>
      <div className="relative">
        <div
          className="border-2 text-center text-sm p-2 flex items-center bg-emerald-500 text-slate-50 font-bold rounded-lg shadow-lg cursor-pointer
              hover:scale-95 scale-100
            "
        >
          <PlusOutlined className="text-xl mr-2" /> Add New Product
        </div>
      </div>
    </Link>
  );
}

function ProductsTable({
  products,
  setProducts,
  sortProduct,
  isAccending,
  currentCategoryFilter,
  currentBrandFilter,
  setCurrentCategoryFilter,
  setCurrentBrandFilter,
}) {
  const { productList, loading, deleteProduct } = useDatabase();
  const { currentBranch } = useBranch();
  const { storage } = useFireBaseStorage();
  const productsRef = useRef(null);
  const [productCorrelations, setProductCorrelations] = useState({
    isDrawerOpen: false,
    productIndex: 0,
  });

  useEffect(() => {
    if (productList) {
      if (productList[currentBranch]) {
        let Products = Object.values(productList[currentBranch]);
        Products.sort(
          (a, b) =>
            new Date(a.recentModifiedDate) - new Date(b.recentModifiedDate)
        ).reverse();
        productsRef.current = Products;
        setProducts(Products);
      }
    }
  }, [productList]);

  useEffect(() => {
    if (products) {
      if (products.length != 0) {
        let Products = [...products];
        if (sortProduct === "ByName") {
          Products.sort((a, b) => {
            if (a.productName < b.productName) {
              return -1;
            }
            if (a.productName > b.productName) {
              return 1;
            }
            return 0;
          });
        } else {
          Products.sort(
            (a, b) =>
              new Date(a.recentModifiedDate) - new Date(b.recentModifiedDate)
          );
        }
        if (!isAccending) {
          Products.reverse();
        }
        setProducts(Products);
      }
    }
  }, [sortProduct, isAccending]);

  useEffect(() => {
    if (currentCategoryFilter !== "") {
      if (productsRef.current) {
        let Products = productsRef.current.filter(
          (product) => product.category == currentCategoryFilter
        );
        setProducts(Products);
      }
    } else {
      setProducts(productsRef.current);
      setCurrentBrandFilter("");
    }
  }, [currentCategoryFilter]);

  useEffect(() => {
    if (currentBrandFilter !== "") {
      if (productsRef.current) {
        let Products = productsRef.current.filter(
          (product) => product.brand == currentBrandFilter
        );
        setProducts(Products);
      }
    } else {
      setProducts(productsRef.current);
      setCurrentCategoryFilter("");
    }
  }, [currentBrandFilter]);

  return (
    <div className="w-full h-5/6">
      <ProductCorrelationsDrawer
        products={products}
        productCorrelations={productCorrelations}
        setProductCorrelations={setProductCorrelations}
      />
      <ProductsTableHeader />
      <div className="overflow-y-scroll h-5/6 bg-slate-50">
        {!loading &&
          products?.map((product, index) => (
            <ProductsTableData
              index={index}
              data={product}
              currentBranch={currentBranch}
              deleteProduct={deleteProduct}
              storage={storage}
              branch={currentBranch}
              key={product.productId}
              setProductCorrelations={setProductCorrelations}
            />
          ))}
      </div>
    </div>
  );
}

function ProductsTableHeader() {
  return (
    <div className="bg-slate-200 flex flex-row items-center text-slate-500 font-semibold py-2 rounded-lg mb-2">
      <div className="w-[25%] pl-10">Product</div>
      <div className="w-[11%] text-center">Product Id</div>
      <div className="w-[8%]  text-center">Category</div>
      <div className="w-[7%]  text-center">Brand</div>
      <div className="w-[10%] text-center">Buying Price</div>
      <div className="w-[10%] text-center">Sale Price</div>
      <div className="w-[10%]  text-center">Initial Stock</div>
      <div className="w-[5%]  text-center">Stocks</div>
      <div className="w-[15%] text-center">Modified Date</div>
      <div className="w-[3%] "></div>
    </div>
  );
}

function AppendModal({ data, open, openModal, branch }) {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const { appendProduct } = useDatabase();

  return (
    <Modal
      width={"400px"}
      style={{ padding: 0 }}
      centered
      open={open}
      footer={null}
      onCancel={() => openModal(false)}
    >
      <div className="append__product">
        <h3 className="font-bold text-lg mt-4">Append Product</h3>
        <div className="append__product__product__info">
          <div className="append__product__product__info__title">
            <div className="append__product__product__info__title__item">
              Product Name
            </div>
            <div className="append__product__product__info__title__detail text-emerald-500">
              {data.productName}
            </div>
          </div>
          <div className="append__product__product__info__title">
            <div className="append__product__product__info__title__item">
              Product ID
            </div>
            <div className="append__product__product__info__title__detail append__product__product__info__title-id">
              {data.productId}
            </div>
          </div>
          <div className="append__product__product__info__title">
            <div className="append__product__product__info__title__item">
              Modified Date
            </div>
            <div className="append__product__product__info__title__detail">
              {new Date(data.recentModifiedDate).toDateString()}
            </div>
          </div>
          <div className="append__product__product__info__title">
            <div className="append__product__product__info__title__item">
              Domain Stocks
            </div>
            <div className="append__product__product__info__title__detail">
              {data.domainCounts}
            </div>
          </div>
          <div className="append__product__product__info__title">
            <div className="append__product__product__info__title__item">
              Stocks
            </div>
            <div className="append__product__product__info__title__detail">
              {data.counts}
            </div>
          </div>
        </div>
        <div className="append__product__line"></div>
        <div className="append__product__product__retangle">
          <Form
            {...layout}
            name="append_message"
            onFinish={async (value) => {
              try {
                let newData = { ...data };
                const date = new Date();
                let counts = parseInt(value.counts)
                  ? parseInt(value.counts)
                  : 0;
                newData.domainCounts = newData.counts + counts;
                newData.counts = newData.domainCounts;
                newData.recentModifiedDate = `${date.toDateString()} ${date.toLocaleTimeString()}`;
                newData.salePrice = value.salePrice
                  ? parseInt(value.salePrice)
                  : newData.salePrice;
                newData.buyingPrice = value.buyingPrice
                  ? parseInt(value.buyingPrice)
                  : newData.buyingPrice;

                let newPurchaseLog = {
                  counts: counts,
                  date: `${date.toDateString()} ${date.toLocaleTimeString()}`,
                  purchasePrice: newData.buyingPrice,
                  salePrice: newData.salePrice,
                };

                if (newData.purchaseLogs) {
                  newData.purchaseLogs = [
                    newPurchaseLog,
                    ...newData.purchaseLogs,
                  ];
                } else {
                  newData.purchaseLogs = [newPurchaseLog];
                }

                console.log(newData);
                appendProduct(counts, newData, branch);

                openModal(false);
                message.success(`${data.productName} appended`);
              } catch (error) {
                console.log(error.message);
              }
            }}
            style={{
              maxWidth: 300,
              margin: "0 auto",
            }}
          >
            <Form.Item name="counts" label="Append">
              <InputNumber defaultValue={0} />
            </Form.Item>
            <Form.Item name="buyingPrice" label="Buying Price">
              <Input defaultValue={data.buyingPrice} />
            </Form.Item>
            <Form.Item name="salePrice" label="Sale Price">
              <Input defaultValue={data.salePrice} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                ...layout.wrapperCol,
                offset: 8,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 20 }}
              >
                Submit
              </Button>

              <Button htmlType="button" onClick={() => openModal(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}

function ProductsTableData({
  index,
  data,
  currentBranch,
  deleteProduct,
  storage,
  branch,
  setProductCorrelations,
}) {
  const [isOpenAppendModal, openAppendModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openProductLogs, setOpenProductLogs] = useState(false);

  function ProductImage() {
    let productImgUrl =
      data.productImg === "" ? ProductThumbnailImage : data.productImg;

    return (
      <div className="w-[10%] mr-5 border-indigo-200">
        {/* border-2 rounded p-2"> */}
        <img src={productImgUrl} className="w-full h-full object-cover" />
      </div>
    );
  }

  function EditProductDrawer({ data, editMode, setEditMode }) {
    const [currentImg, setCurrentImg] = useState(data.productImg);
    const [currentImgFile, setCurrentImgFile] = useState(null);
    const fileRef = useRef(null);

    const { createNewProduct, brands, categories } = useDatabase();

    const nameRef = useRef(null);
    const idRef = useRef(null);
    const barCodeRef = useRef(null);
    const [currentCategory, setCurrentCategory] = useState(data.category);
    const [currentBrand, setCurrentBrand] = useState(data.brand);
    const salePriceRef = useRef(null);
    const buyingPriceRef = useRef(null);

    function handleSaveChanges() {
      let Data = { ...data };
      setEditMode(false);
      Data.productName = nameRef.current.value;
      Data.productId = idRef.current.value;
      Data.category = currentCategory;
      Data.brand = currentBrand;
      Data.salePrice = salePriceRef.current.value
        ? parseInt(salePriceRef.current.value)
        : Data.salePrice;
      Data.buyingPrice = buyingPriceRef.current.value
        ? parseInt(buyingPriceRef.current.value)
        : Data.buyingPrice;
      message.open({
        type: "loading",
        content: "Updating Product...",
        duration: 0,
        key: 0,
      });
      if (currentImgFile) {
        const productImg = data.productImg;
        if (productImg !== "") {
          var imgUrl = decodeURIComponent(productImg);
          imgUrl = URL.parse(imgUrl).pathname.split("/").reverse()[0];

          const desertRef = ref(storage, "images/" + imgUrl);

          // Delete the file
          deleteObject(desertRef)
            .then(() => {
              // File deleted successfully
              console.log("Product Image deleted!");
              const file = currentImgFile;
              const storageRef = ref(storage, `images/${file.name}`);
              console.log("Uploading... Image");
              uploadBytes(storageRef, file).then((snapshot) => {
                console.log("Uploaded Image!");
                message.destroy(0);
                message.success("Uploaded Image!");
                getDownloadURL(storageRef).then((url) => {
                  Data.productImg = url;
                  createNewProduct(Data, branch);
                  message.success("Product has been updated");
                });
              });
            })
            .catch((error) => {
              // Uh-oh, an error occurred!
              console.log("Error occurs in deleting Product Image!");
              const file = currentImgFile;
              const storageRef = ref(storage, `images/${file.name}`);
              console.log("Uploading... Image");
              uploadBytes(storageRef, file).then((snapshot) => {
                console.log("Uploaded Image!");
                message.destroy(0);
                message.success("Uploaded Image!");
                getDownloadURL(storageRef).then((url) => {
                  Data.productImg = url;
                  createNewProduct(Data, branch);
                  message.success("Product has been updated");
                });
              });
            });
        } else {
          const file = currentImgFile;
          const storageRef = ref(storage, `images/${file.name}`);
          console.log("Uploading... Image");
          uploadBytes(storageRef, file).then((snapshot) => {
            console.log("Uploaded Image!");
            message.destroy(0);
            message.success("Uploaded Image!");
            getDownloadURL(storageRef).then((url) => {
              Data.productImg = url;
              createNewProduct(Data, branch);
              message.success("Product has been updated");
            });
          });
        }
      } else {
        createNewProduct(Data, branch);
        message.destroy(0);
        message.success("Product has been updated");
      }
    }

    function handleOnClose() {
      setCurrentImg(data.productImg);
      setEditMode(false);
    }

    return (
      <Drawer
        zIndex={1050}
        title="Edit Products"
        placement="right"
        width={500}
        onClose={handleOnClose}
        open={editMode}
        extra={
          <div>
            <img src={EditIcon} className="w-6" />
          </div>
        }
      >
        <div className="flex flex-col h-full font-sans text-slate-500 font-semibold">
          <div className="p-4 border-2 border-blue-300/20 text-sm bg-slate-100/10 mb-3">
            <div className="mb-3 text-slate-900 text-base">Product Image</div>
            <div className="w-1/5 border-2 border-emerald-300">
              <img
                src={currentImg !== "" ? currentImg : ProductThumbnailImage}
                className="w-full h-full object-cover aspect-square cursor-pointer"
                onClick={() => fileRef.current.click()}
              />
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".png,.jpg,.jpeg"
                multiple={false}
                onChange={(e) => {
                  setCurrentImgFile(e.target.files[0]);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setCurrentImg(reader.result);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }}
              />
            </div>
          </div>

          <div className="p-4 border-2 border-emerald-300/20 text-sm bg-slate-100/10 mb-3">
            <div className="mb-6">
              <div className="mb-2 text-slate-900">Product Name</div>
              <input
                type="text"
                className="shadow-sm rounded-md outline-0 text-slate-500 p-2 border-blue-300/50 border-2 px-5"
                ref={nameRef}
                defaultValue={data.productName}
              />
            </div>
            <div className="mb-6 text-slate-900">
              <div className="mb-4">Product ID</div>
              <div className="">
                <input
                  type="text"
                  className="hidden w-2/5 text-center shadow-sm rounded-md outline-0 text-orange-400/80 p-2 border-blue-300/50 border-2 px-5"
                  ref={idRef}
                  defaultValue={data.productId}
                  disabled={true}
                />
                <ReactBarcode
                  value={data.productId}
                  options={{
                    format: `${data.productId}`.length === 13 ? "EAN13" : "UPC",
                    height: "40",
                    fontSize: 14,
                    margin: 0,
                    // displayValue: false,
                    width: 2,
                    textAlign: "center",
                    textMargin: 1,
                    lineColor: "#827070",
                  }}
                />
              </div>
            </div>
            <div className="mb-6 text-slate-900">
              <div className="mb-2">Category</div>

              <Select
                style={{ width: "60%" }}
                className="shadow-sm rounded-md outline-0 text-slate-500 border-blue-300/50 border-2"
                defaultValue={currentCategory}
                onChange={(value) => setCurrentCategory(value)}
              >
                {categories?.map((category) => (
                  <Select.Option value={category} key={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
              {/* <input
                type="text"
                className="shadow-sm rounded-md outline-0 text-slate-500 p-2 border-blue-300/50 border-2 px-5"
                ref={categoryRef}
                defaultValue={data.category}
              /> */}
            </div>
            <div className="mb-3 text-slate-900">
              <div className="mb-2">Brand</div>
              {/* <input
                type="text"
                className="shadow-sm rounded-md outline-0 text-slate-500 p-2 border-emerald-300/50 border-2 px-5"
                ref={brandRef}
                defaultValue={data.brand}
              /> */}
              <Select
                style={{ width: "60%" }}
                defaultValue={data.brand}
                className="shadow-sm rounded-md outline-0 text-slate-500 border-blue-300/50 border-2"
                onChange={(value) => setCurrentBrand(value)}
              >
                {brands?.map((brand) => (
                  <Select.Option value={brand} key={brand}>
                    {brand}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="p-4 border-2 border-emerald-300/20 text-sm bg-slate-100/10">
            <div className="mb-6 text-slate-900">
              <div className="mb-5 text-base">Prices</div>
              <div className="flex w-full">
                <div className="w-1/2">
                  <div className="mb-2 text-emerald-500">Salling Price</div>
                  <input
                    type="number"
                    className="w-5/6 shadow-sm rounded-md outline-0 text-slate-500 p-2 border-emerald-300/50 border-2 px-5"
                    ref={salePriceRef}
                    defaultValue={data.salePrice}
                  />
                </div>
                <div className="w-1/2 relative">
                  <div className="mb-2 text-sky-600">Purchased Price</div>
                  <input
                    type="number"
                    className="w-5/6 shadow-sm rounded-md outline-0 text-slate-500 p-2 border-emerald-300/50 border-2 px-5"
                    ref={buyingPriceRef}
                    defaultValue={data.buyingPrice}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={handleSaveChanges}
            className="text-center w-full p-4 bg-emerald-500/90 text-slate-50 text-base cursor-pointer"
          >
            Save Changes
          </div>
        </div>
      </Drawer>
    );
  }

  return (
    <>
      <AppendModal
        data={data}
        open={isOpenAppendModal}
        openModal={openAppendModal}
        branch={branch}
      />
      <EditProductDrawer {...{ data, editMode, setEditMode }} />
      <ProductLogsDrawer {...{ data, openProductLogs, setOpenProductLogs }} />
      <div className="flex flex-row items-center py-2 font-semibold text-sm text-slate-400 h-16 border-b-2 border-slate-200">
        <div className="w-[25%] pl-5 flex items-center text-slate-600">
          <ProductImage />
          {data.productName}
        </div>
        <div className="w-[11%] text-center text-slate-400/80">
          {data.productId}
        </div>
        <div className="w-[8%]  text-center">{data.category}</div>
        <div className="w-[7%]  text-center">{data.brand}</div>
        <div className="w-[10%] text-center">{data.buyingPrice}</div>
        <div className="w-[10%] text-center">{data.salePrice}</div>
        <div className="w-[10%]  text-center text-indigo-400">
          {data.domainCounts}
        </div>
        <div
          className={clsx(
            "w-[5%]  text-center",
            data.counts > 10 ? "text-emerald-500" : "text-red-500"
          )}
        >
          {data.counts}
        </div>
        <div className="w-[15%] text-left">{data.recentModifiedDate}</div>
        <div className="w-[3%] ">
          <Popover
            placement="bottom"
            content={
              <div className="">
                <MenuItem
                  imgLink={PlusIcon}
                  text="Append"
                  onClick={async () => {
                    openAppendModal(true);
                  }}
                />
                <MenuItem
                  imgLink={FilterIcon}
                  text="Logs"
                  onClick={() => {
                    setOpenProductLogs(true);
                  }}
                />
                <MenuItem
                  imgLink={EditIcon}
                  text="Edit"
                  onClick={() => {
                    setEditMode(true);
                  }}
                />
                <MenuItem
                  imgLink={CorrelationsIcon}
                  text="Correlations"
                  onClick={() => {
                    setProductCorrelations((state) => ({
                      isDrawerOpen: true,
                      productIndex: index,
                    }));
                  }}
                />
                <MenuItem
                  imgLink={DeleteIcon}
                  text={<div style={{ color: "red" }}>Delete</div>}
                  onClick={() => {
                    const productImg = data.productImg;
                    if (productImg !== "") {
                      var imgUrl = decodeURIComponent(productImg);
                      imgUrl = URL.parse(imgUrl)
                        .pathname.split("/")
                        .reverse()[0];

                      console.log(imgUrl);

                      const desertRef = ref(storage, "images/" + imgUrl);

                      // Delete the file
                      deleteObject(desertRef)
                        .then(() => {
                          // File deleted successfully
                          console.log("Product Image deleted!");
                          deleteProduct(data.productId, currentBranch);
                        })
                        .catch((error) => {
                          // Uh-oh, an error occurred!
                          console.log(
                            "Error occurs in deleting Product Image!"
                          );
                          deleteProduct(data.productId, currentBranch);
                        });
                    } else {
                      deleteProduct(data.productId, currentBranch);
                    }
                  }}
                />
              </div>
            }
          >
            <MoreOutlined
              style={{
                fontSize: "1.8rem",
                cursor: "pointer",
                transform: "rotate(90deg)",
              }}
            />
          </Popover>
        </div>
      </div>
    </>
  );
}

function ProductCorrelationsDrawer({
  products,
  productCorrelations,
  setProductCorrelations,
}) {
  // Linear regression calculation
  function linearRegression(x, y) {
    const n = x.length;
    const x_mean = x.reduce((a, b) => a + b) / n;
    const y_mean = y.reduce((a, b) => a + b) / n;
    const numerator = x.reduce(
      (acc, xi, i) => acc + (xi - x_mean) * (y[i] - y_mean),
      0
    );
    const denominator = x.reduce(
      (acc, xi) => acc + Math.pow(xi - x_mean, 2),
      0
    );
    const slope = numerator / denominator;
    const intercept = y_mean - slope * x_mean;
    return { slope, intercept };
  }

  function pearsonCorrelation(x, y) {
    const length = Math.min(x.length, y.length);

    const x_mean = x.reduce((acc, xi) => acc + xi, 0) / length;
    const y_mean = y.reduce((acc, yi) => acc + yi, 0) / length;

    const numerator = x.reduce(
      (acc, xi, index) => acc + (xi - x_mean) * (y[index] - y_mean),
      0
    );

    const denominator =
      Math.sqrt(x.reduce((acc, xi) => acc + Math.pow(xi - x_mean, 2), 0)) *
      Math.sqrt(y.reduce((acc, yi) => acc + Math.pow(yi - y_mean, 2), 0));

    if (denominator === 0) {
      return 0;
    } else {
      return numerator / denominator;
    }
  }

  // const { slope, intercept } = linearRegression(x, y);

  const [slope, setSlope] = useState(0);
  const [intercept, setIntercept] = useState(0);

  const [yProducts, setYProducts] = useState([]);
  const [xProducts, setXproducts] = useState([]);

  const [productsPopulation, setProductsPopulation] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products) {
      let n = products.map((p) => ({
        name: p.productName,
        saleLogs: p.saleLogs
          ? p.saleLogs
              ?.map((log) => ({
                counts: log.counts,
                date: new Date(log.date).toLocaleDateString(),
              }))
              .reduce(
                (acc, { counts, date }) => (
                  (acc[date] = acc[date] || 0), (acc[date] += counts), acc
                ),
                {}
              )
          : [],
      }));
      let all_sale_dates = [
        ...new Set(
          n.reduce((acc, p) => acc.concat(Object.keys(p.saleLogs)), [])
        ),
      ];
      const population = n.reduce(
        (acc, p) => (
          (acc[p.name] = all_sale_dates.map((date) =>
            p.saleLogs[date] ? p.saleLogs[date] : 0
          )),
          acc
        ),
        {}
      );
      setProductsPopulation(population);
      console.log(population);
      console.log(all_sale_dates);
      console.log(products);

      setXproducts(
        population[products[productCorrelations.productIndex]?.productName]
      );

      setYProducts(
        population[
          products[productCorrelations.productIndex === 0 ? 1 : 0]?.productName
        ]
      );
    }
  }, [products]);

  useEffect(() => {
    if (products && productsPopulation) {
      setYProducts(productsPopulation[products[currentIndex]?.productName]);
      console.log(productsPopulation);
      console.log(
        productsPopulation[
          products[productCorrelations.productIndex]?.productName
        ]
      );
      console.log(productsPopulation[products[currentIndex]?.productName]);
      console.log(products[currentIndex]?.productName);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (xProducts && yProducts && productsPopulation) {
      setXproducts(
        productsPopulation[
          products[productCorrelations.productIndex]?.productName
        ]
      );
      setCurrentIndex(productCorrelations.productIndex === 0 ? 1 : 0);
    }
  }, [productCorrelations]);

  useEffect(() => {
    if (xProducts && yProducts) {
      if (xProducts.length > 0 && yProducts.length > 0) {
        const { slope, intercept } = linearRegression(xProducts, yProducts);
        setSlope(slope);
        setIntercept(intercept);
        console.log();
        console.log(xProducts);
        console.log(yProducts);
      }
    }
  }, [xProducts, yProducts]);

  return (
    <Drawer
      zIndex={1050}
      title={`${
        products && products[productCorrelations.productIndex]?.productName
      }`}
      placement="right"
      width={700}
      open={productCorrelations.isDrawerOpen}
      onClose={() =>
        setProductCorrelations((state) => ({ ...state, isDrawerOpen: false }))
      }
      extra={
        <div>
          <img src={CorrelationsIcon} className="w-6" />
        </div>
      }
    >
      <div className="w-full border-2 h-[40vh] mb-6">
        {xProducts && yProducts && (
          <Scatter
            data={{
              datasets: [
                {
                  label: "Sales",
                  data: xProducts.map((xi, index) => ({
                    x: xi,
                    y: yProducts[index],
                  })),
                  backgroundColor: "rgba(75, 192, 192, 1)",
                },
                {
                  label: `Best Fit Line slope: ${slope}, intercept: ${intercept}`,
                  data: xProducts.map((xi) => ({
                    x: xi,
                    y: slope * xi + intercept,
                  })),
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                  type: "line",
                },
              ],
            }}
          />
        )}
      </div>
      <div className="w-full border-2 h-[45vh] font-sans">
        <div className="w-full flex shadow-md p-2 text-slate-500 font-bold h-[10%]">
          <div className="grow">Product</div>
          <div className="w-[30%]">
            Pearson Correlation <span className="font-mono">(γ)</span>{" "}
          </div>
        </div>
        <div className="w-full overflow-y-scroll h-[90%]">
          {productsPopulation &&
            xProducts &&
            Object.keys(productsPopulation).map(
              (product, index) =>
                product !==
                  products[productCorrelations.productIndex]?.productName && (
                  <div
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={clsx(
                      "flex p-2 text-slate-500 cursor-pointer ",
                      index === currentIndex ? "bg-indigo-100/90" : ""
                    )}
                  >
                    <div className="grow">{product}</div>
                    <div className="w-[25%] text-right">
                      {pearsonCorrelation(
                        xProducts,
                        productsPopulation[product]
                      )}
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    </Drawer>
  );
}

function ProductLogsDrawer({ data, openProductLogs, setOpenProductLogs }) {
  const [mode, setMode] = useState("saleLogs");
  const [Data, setData] = useState(data["saleLogs"]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (data[mode]) {
      let dates = {};

      data[mode].forEach((log) => {
        let d = new Date(log.date).toLocaleDateString();
        if (dates[d]) {
          dates[d].counts += log.counts;
        } else {
          dates[d] = { ...log };
        }
      });
      setData(
        Object.values(dates).sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } else {
      setData(null);
    }
  }, [mode]);

  return (
    <Drawer
      zIndex={1050}
      title="Product Logs"
      placement="right"
      width={700}
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
      <div className="w-full h-full overflow-hidden">
        <div className="border-2 w-ful h-[200px] mb-4">
          {Data && (
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
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: `Product ${
                      mode === "saleLogs" ? "Sales" : "Purchases"
                    }`,
                    position: "left",
                  },
                },
              }}
              data={{
                labels: Data.map(
                  (log) =>
                    months[new Date(log.date).getMonth()] +
                    " " +
                    new Date(log.date).getDate()
                ).slice(0, 11),
                datasets: [
                  {
                    id: 1,
                    label: "Sale",
                    data: Data.map((log) => log.counts).slice(0, 11),
                    borderColor: "rgba(190, 209, 246)",
                    backgroundColor: "rgb(190, 209, 246, 0.5)",
                  },
                ],
              }}
            />
          )}
        </div>
        <div className="flex w-full  border-b-2 pb-4  text-center justify-between items-center font-sans font-bold text-slate-400 cursor-pointer">
          <Radio.Group
            options={[
              {
                label: (
                  <div className="flex items-center justify-center">
                    {/* <ShoppingCartOutlined className="mr-1" /> */}
                    <img src={ProductLogIcon} className="w-7 p-1 mr-2" />
                    Product Sales
                  </div>
                ),
                value: "saleLogs",
              },
              {
                label: (
                  <div className="flex items-center justify-center">
                    {/* <BarcodeOutlined className="mr-1" /> */}
                    <img src={ProductSalesIcon} className="w-7 p-1 mr-1" />
                    Product Purchases
                  </div>
                ),
                value: "purchaseLogs",
              },
            ]}
            onChange={(e) => {
              setMode(e.target.value);
            }}
            onClick={null}
            value={mode}
            optionType="button"
          />
        </div>
        <div className="w-full">
          <div className=" flex items-center justify-between text-center font-sans font-bold text-sm p-2 text-indigo-400  shadow-md">
            <div className="grow  text-left">Date</div>
            <div className="w-1/5">Time</div>
            <div className="w-1/6  text-center">Counts</div>
            <div className="w-1/5  text-right">
              {mode === "purchaseLogs" ? "Purchase Price" : "Sale Price"}
            </div>
            <div className="w-1/5  text-right">Total</div>
          </div>
          <div className="w-full max-h-[500px] overflow-y-scroll">
            {data[mode] &&
              data[mode].map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-right font-sans font-bold text-sm py-4 p-3 text-slate-500 border-b-2"
                >
                  <div className="grow text-left">{`${new Date(
                    log.date
                  ).getDate()}-${new Date(log.date).getMonth() + 1}-${new Date(
                    log.date
                  ).getFullYear()}`}</div>
                  <div className="w-1/5 text-center">
                    {new Date(log.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="w-1/6 text-center">{log.counts}</div>
                  <div className="w-1/5 ">
                    {
                      log[
                        mode === "purchaseLogs" ? "purchasePrice" : "salePrice"
                      ]
                    }{" "}
                    ks
                  </div>
                  <div className="w-1/5 ">
                    {log.counts *
                      log[
                        mode === "purchaseLogs" ? "purchasePrice" : "salePrice"
                      ]}{" "}
                    ks
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default Products;
