import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@assets/search-icon.svg";
import RefreshIcon from "@assets/refresh.png";
import SortIcon from "@assets/sort-az.png";
import ProductImg from "@assets/Eggs.jpg";
import AddIcon from "@assets/add.png";
import PlusIcon from "@assets/plus.png";
import FilterIcon from "@assets/filter.png";
import EditIcon from "@assets/edit.png";
import DeleteIcon from "@assets/delete.png";
import {
  Dropdown,
  Popover,
  Button,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  message,
  Table,
} from "antd";
import { MoreOutlined, FilterOutlined, InboxOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useUser } from "@hooks/useUser";

function MenuItem({ imgLink, text, onClick }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: ".9em",
        fontWeight: "600",
        marginBottom: "1em",
        cursor: "pointer",
      }}
      onClick={() => onClick()}
    >
      <img src={imgLink} style={{ width: "16px", marginRight: ".7em" }} />{" "}
      {text}
    </div>
  );
}

const GET_PRODUCTS = gql`
  query getProducts(
    $userId: String!
    $token: String!
    $branchId: String!
    $branchToken: String!
  ) {
    products(
      userId: $userId
      token: $token
      branchId: $branchId
      branchToken: $branchToken
    ) {
      productImg
      productName
      productId
      category
      brand
      buyingPrice
      salePrice
      domainCounts
      counts
      recentModifiedDate
      productLogs {
        date
        counts
        buyingPrice
        amount
      }
    }
    categories {
      name
    }
    brands {
      name
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct(
    $userId: String!
    $accountToken: String!
    $branchId: String!
    $branchToken: String!
    $productId: String!
  ) {
    deleteProduct(
      userId: $userId
      accountToken: $accountToken
      branchId: $branchId
      branchToken: $branchToken
      productId: $productId
    ) {
      productImg
      productName
      productId
      category
      brand
      buyingPrice
      salePrice
      domainCounts
      counts
      recentModifiedDate
    }
  }
`;

function Products() {
  const { currentUser } = useUser();

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      userId: currentUser.uid,
      token: currentUser.accessToken,
      branchId: "97642144875",
      branchToken: "20746829937",
    },
  });

  const [DeleteProduct, { data: d }] = useMutation(DELETE_PRODUCT);

  function ProductImage({ Ref, editMode, url }) {
    const [imgLink, setImgLink] = useState(url);
    const [showChangeButton, setShowChangeButton] = useState(false);
    const prevImgLink = useRef(null);

    useEffect(() => {
      prevImgLink.current = imgLink;
    }, []);

    useEffect(() => {
      setImgLink(url);
    }, [editMode]);

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setImgLink(URL.createObjectURL(file));
      }
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          setShowChangeButton(true);
        }}
        onMouseLeave={(e) => {
          setShowChangeButton(false);
        }}
      >
        {editMode && showChangeButton ? (
          <div
            style={{
              position: "absolute",
              zIndex: "1",
              fontSize: ".8rem",
              width: "50%",
              margin: "0 auto",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="imageInput"
            />
            <label
              htmlFor="imageInput"
              style={{
                color: "var(--primary-color)",
                cursor: "pointer",
              }}
            >
              Change
              <br />
              Image
            </label>
          </div>
        ) : (
          ""
        )}
        <img ref={Ref} src={imgLink} />
      </div>
    );
  }

  function ProductItem({ data, categories, brands }) {
    const [editMode, setEditMode] = useState(false);
    const [isOpenAppendModal, openAppendModal] = useState(false);
    const [isOpenLogModal, openLogModal] = useState(false);
    const { currentUser } = useUser();

    const editModeProductNameRef = useRef(null);
    const editModeProductImageRef = useRef(null);
    const [editModeSelectCategory, setEditModeSelectCategory] = useState("");
    const [editModeSelectBrand, setEditModeSelectBrand] = useState("");
    const editModeSalePriceRef = useRef(null);
    const editModeBuyingPriceRef = useRef(null);

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const APPEND_PRODUCT = gql`
      mutation AppendProduct(
        $userId: String!
        $accountToken: String!
        $branchId: String!
        $branchToken: String!
        $productId: String!
        $counts: Int!
        $salePrice: Int
        $buyingPrice: Int
      ) {
        appendProduct(
          userId: $userId
          accountToken: $accountToken
          branchId: $branchId
          branchToken: $branchToken

          productId: $productId
          counts: $counts
          salePrice: $salePrice
          buyingPrice: $buyingPrice
        ) {
          productName
          productId
          buyingPrice
          salePrice
          counts
          domainCounts
        }
      }
    `;

    const [_AppendProduct, { loading }] = useMutation(APPEND_PRODUCT);

    return (
      <>
        <Modal
          width={"400px"}
          style={{ padding: 0 }}
          centered
          open={isOpenAppendModal}
          footer={null}
          // closeIcon={null}
          onCancel={() => openAppendModal(false)}
        >
          <div className="append__product">
            <h3>Append Product</h3>
            <div className="append__product__product__info">
              <div className="append__product__product__info__title">
                <div className="append__product__product__info__title__item">
                  Product Name
                </div>
                <div className="append__product__product__info__title__detail">
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
                  BranchId
                </div>
                <div className="append__product__product__info__title__detail append__product__product__info__title-branch">
                  {97642144875}
                </div>
              </div>
              <div className="append__product__product__info__title">
                <div className="append__product__product__info__title__item">
                  Modified Date
                </div>
                <div className="append__product__product__info__title__detail">
                  {new Date(data.recentModifiedDate).toLocaleDateString()}
                </div>
              </div>
              <div className="append__product__product__info__title">
                <div className="append__product__product__info__title__item">
                  Recent Domain Counts
                </div>
                <div className="append__product__product__info__title__detail">
                  {data.domainCounts}
                </div>
              </div>
              <div className="append__product__product__info__title">
                <div className="append__product__product__info__title__item">
                  Remain Counts
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
                  if (!loading) {
                    try {
                      await _AppendProduct({
                        variables: {
                          userId: currentUser.uid,
                          accountToken: currentUser.accessToken,
                          branchId: "97642144875",
                          branchToken: "20746829937",

                          productId: data.productId,
                          counts: value.counts,
                          buyingPrice: parseInt(value.buyingPrice),
                          salePrice: parseInt(value.salePrice),
                        },
                      });
                      openAppendModal(false);
                      refetch();
                      message.success(`${data.productName} appended`);
                    } catch (error) {
                      console.log(error.message);
                    }
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
                <Form.Item name="salingPrice" label="Saling Price">
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

                  <Button
                    htmlType="button"
                    onClick={() => openAppendModal(false)}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
        <Modal
          centered
          width={"450px"}
          height={"550px"}
          open={isOpenLogModal}
          onCancel={() => openLogModal(false)}
          footer={null}
        >
          <div className="product__log">
            <h3>Product Logs</h3>
            <div className="product__log__product__info">
              <div className="product__log__product__info__title">
                <div className="product__log__product__info__title__item">
                  Product Name
                </div>
                <div className="product__log__product__info__title__detail">
                  {data.productName}
                </div>
              </div>
              <div className="product__log__product__info__title">
                <div className="product__log__product__info__title__item">
                  Product ID
                </div>
                <div className="product__log__product__info__title__detail append__product__product__info__title-id">
                  {data.productId}
                </div>
              </div>
              <div className="product__log__product__info__title">
                <div className="product__log__product__info__title__item">
                  Branch
                </div>
                <div className="product__log__product__info__title__detail append__product__product__info__title-branch">
                  {97642144875}
                </div>
              </div>
              <div className="product__log__product__info__title">
                <div className="product__log__product__info__title__item">
                  Last Modified Date
                </div>
                <div className="product__log__product__info__title__detail">
                  {new Date(data.recentModifiedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Table
              pagination={{ pageSize: 4 }}
              columns={[
                {
                  title: "Date",
                  dataIndex: "date",
                  key: "date",
                  render: (date) => <>{new Date(date).toLocaleDateString()}</>,
                },
                {
                  title: "Counts",
                  dataIndex: "counts",
                  key: "counts",
                },
                {
                  title: "Buying Price",
                  dataIndex: "buyingPrice",
                  key: "buyingPrice",
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                },
              ]}
              dataSource={[...data.productLogs.reverse()]}
            />
          </div>
        </Modal>
        <tr className={editMode ? "products__table__item__edit_mode" : ""}>
          <td
            style={{
              position: "relative",
            }}
          >
            <ProductImage
              Ref={editModeProductImageRef}
              editMode={editMode}
              url={data.productImg}
            />
          </td>
          {editMode ? (
            <td>
              <Input
                ref={editModeProductNameRef}
                defaultValue={data.productName}
              />
            </td>
          ) : (
            <td>{data.productName}</td>
          )}
          <td>{data.productId}</td>
          {editMode ? (
            <>
              <td>
                <Select
                  defaultValue={data.category}
                  onChange={(e) => {
                    setEditModeSelectCategory(e.target);
                  }}
                >
                  {categories?.map((category) => (
                    <Select.Option value={category.name}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </td>
              <td>
                <Select
                  defaultValue={data.brand}
                  onChange={(e) => {
                    setEditModeSelectBrand(e);
                  }}
                >
                  {brands?.map((brand) => (
                    <Select.Option value={brand.name}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </td>
              <td>
                <Input
                  ref={editModeBuyingPriceRef}
                  defaultValue={data.buyingPrice}
                />
              </td>
              <td>
                <Input
                  ref={editModeSalePriceRef}
                  defaultValue={data.salePrice}
                />
              </td>
            </>
          ) : (
            <>
              <td>{data.category}</td>
              <td>{data.brand}</td>
              <td>{data.buyingPrice} ks</td>
              <td>{data.salePrice} ks</td>
            </>
          )}
          <td>{data.domainCounts}</td>
          <td>{data.counts}</td>
          {editMode ? (
            <>
              <td>
                <Button
                  type="primary"
                  onClick={(e) => {
                    console.log(editModeProductNameRef.current.input.value);
                    console.log(editModeBuyingPriceRef.current.input.value);
                    console.log(editModeSalePriceRef.current.input.value);
                    console.log(editModeProductImageRef.current.src);
                    console.log(editModeSelectCategory);
                    console.log(editModeSelectBrand);
                    // console.log(editModeBrandRef.current.input.value);
                  }}
                >
                  Save
                </Button>
              </td>
              <td>
                <Button type="default" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </td>
            </>
          ) : (
            <>
              <td>{new Date(data.recentModifiedDate).toLocaleDateString()}</td>
              <td>
                <Popover
                  placement="bottom"
                  content={
                    <div className="products__table__item__menu">
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
                          openLogModal(true);
                        }}
                      />
                      <MenuItem
                        imgLink={EditIcon}
                        text="Edit"
                        onClick={() => setEditMode(true)}
                      />
                      <MenuItem
                        imgLink={DeleteIcon}
                        text={<div style={{ color: "red" }}>Delete</div>}
                        onClick={async () => {
                          try {
                            await DeleteProduct({
                              variables: {
                                userId: currentUser.uid,
                                accountToken: currentUser.accessToken,
                                branchId: "97642144875",
                                branchToken: "20746829937",
                                productId: data.productId,
                              },
                            });
                            refetch();
                          } catch (error) {
                            console.log(error.message);
                          }
                        }}
                      />
                    </div>
                  }
                >
                  <MoreOutlined />
                </Popover>
              </td>
            </>
          )}
        </tr>
      </>
    );
  }

  if (loading) return <>Loading...</>;

  return (
    <>
      <div className="products">
        <div className="products__card">
          <div className="products__header">
            <div className="search">
              <img src={SearchIcon} className="search__icon" />
              <input placeholder="Product Name or ID" />
            </div>
            <div className="refresh" onClick={() => refetch()}>
              <img src={RefreshIcon} />
            </div>
            <div className="products__options">
              <MoreOutlined />
            </div>
            <div></div>
            <div className="products__filter">
              <Dropdown.Button>
                <FilterOutlined />
                Filter
              </Dropdown.Button>
            </div>
            <div className="products__sort">
              <Dropdown.Button>
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
            </div>
            <div className="products__branch"></div>
          </div>
          <div className="products__table">
            <table>
              <thead>
                <tr className="products__table__header">
                  <th></th>
                  <th>Product Name</th>
                  <th>Product Id</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Buying Price</th>
                  <th>Sale Price</th>
                  <th>Domain Counts</th>
                  <th>Counts</th>
                  <th>Recent Modified Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  data.products
                    .map((product) => (
                      <ProductItem
                        key={product.productId}
                        data={product}
                        categories={data.categories}
                        brands={data.brands}
                      />
                    ))
                    .reverse()}
                {data.products.length == 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "var(--second-color)",
                    }}
                  >
                    <InboxOutlined
                      style={{
                        fontSize: "4rem",
                      }}
                    />
                    Empty Products
                  </div>
                )}
              </tbody>
            </table>
          </div>

          <Link to={"/addnewproducts"}>
            <div className="products__add_new_product">
              <img src={AddIcon} />
              Add New Product
            </div>
          </Link>
        </div>
      </div>
      <div id="triangle-bottomright"></div>
      <div id="triangle-topright"></div>
    </>
  );
}

export default Products;
