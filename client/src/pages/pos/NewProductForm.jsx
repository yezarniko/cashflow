import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Select,
  InputNumber,
  Modal,
  message,
} from "antd";
import WarnigIcon from "@assets/warning.png";
import Successful from "@assets/successful.png";
import { Link } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useUser } from "@hooks/useUser";
import { useFireBaseStorage } from "@hooks/useFirebaseStorage";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import ScannerIcon from "@assets/scanner.gif";

/**
 * The `NewProductForm` function is a React functional component that renders a form for adding a new product. It uses the
 * `useState` hook to manage the visibility of a modal. The form is created using the `Form` component from the Ant Design
 * library, and it includes various form fields such as product name, product image, categories, brand, buying price, sale
 * price, domain count, and branch. The form also includes submit and cancel buttons. When the form is submitted, the
 * `handleOnSubmit` function is called, which logs the form values and sets the visibility of the modal to true. The modal
 * is displayed when the `isShowModal` state is true, and it shows a success message along with the submitted form values.
 
 * 
 * @function
 * @name NewProductForm
 * @returns {React.JSX.Element}
 */
function NewProductForm() {
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const [isShowModal, setIsShowModal] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(false);
  const [scanMode, setScanMode] = useState(false);

  let barcode = "";

  const [form] = Form.useForm();
  const productIdInputRef = useRef();

  const { currentUser } = useUser();
  const { storage } = useFireBaseStorage();

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const Get_DATA = gql`
    query getData($userId: String!, $token: String!) {
      user(userId: $userId, token: $token) {
        branches {
          name
          branchId
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

  const ADD_PRODUCT = gql`
    mutation AddProduct(
      $userId: String!
      $accountToken: String!
      $branchId: String!
      $branchToken: String!
      $productId: String!
      $category: String!
      $brand: String!
      $productName: String!
      $productImg: String
      $buyingPrice: Int!
      $salePrice: Int!
      $domainCounts: Int!
    ) {
      addProduct(
        userId: $userId
        accountToken: $accountToken
        branchId: $branchId
        branchToken: $branchToken
        productId: $productId
        category: $category
        brand: $brand
        productName: $productName
        productImg: $productImg
        buyingPrice: $buyingPrice
        salePrice: $salePrice
        domainCounts: $domainCounts
      ) {
        productId
        productName
        salePrice
      }
    }
  `;

  const { data, loading, error } = useQuery(Get_DATA, {
    variables: {
      userId: currentUser.uid,
      token: currentUser.accessToken,
    },
  });

  const [AddProduct, { data: sdata, loading: sloading, error: serror }] =
    useMutation(ADD_PRODUCT);

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  if (sloading) {
    return <div>Loading...</div>;
  }

  function handleOnCloseModal() {
    form.resetFields();
    setIsShowModal(false);
  }

  function handleOnSubmit(values) {
    setDisableSubmitButton(true);

    if (!file) {
      const Data = { ...values, productImg: "" };
      console.log(Data);
      if (!sloading) {
        try {
          AddProduct({
            variables: {
              userId: currentUser.uid,
              accountToken: currentUser.accessToken,
              branchId: Data.branch,
              branchToken: "20746829937",

              productName: Data.productName,
              productId: Data.productId,
              productImg: Data.productImg,
              category: Data.category,
              brand: Data.brand,
              buyingPrice: Data.buyingPrice,
              salePrice: Data.salePrice,
              domainCounts: Data.domainCounts,
            },
          });
          setIsShowModal(true);
        } catch (error) {
          console.log(error);
        }
      }
      setDisableSubmitButton(false);
      return ;
    }

    const storageRef = ref(storage, `images/${file.name}`);

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded Image!");
      getDownloadURL(storageRef).then((url) => {
        const Data = { ...values, productImg: url };
        console.log(Data);
        if (!sloading) {
          try {
            AddProduct({
              variables: {
                userId: currentUser.uid,
                accountToken: currentUser.accessToken,
                branchId: Data.branch,
                branchToken: "20746829937",

                productName: Data.productName,
                productId: Data.productId,
                productImg: Data.productImg,
                category: Data.category,
                brand: Data.brand,
                buyingPrice: Data.buyingPrice,
                salePrice: Data.salePrice,
                domainCounts: Data.domainCounts,
              },
            });
            setIsShowModal(true);
          } catch (error) {
            console.log(error);
          }
        }
        setDisableSubmitButton(false);
      });
    });
  }

  return (
    <>
      {contextHolder}
      <div className="add_new_product__main_card">
        <h3>Add New Product</h3>
        <div className="add_new_product__main_card__label">
          <img src={WarnigIcon} />{" "}
          <span>
            Please make sure that new product already exists in the store before
            adding it.
          </span>
        </div>

        <div className="add_new_product__secondary_card">
          <Form {...formItemLayout} onFinish={handleOnSubmit} form={form}>
            <Form.Item
              name="productName"
              label="Product Name"
              rules={[
                {
                  required: true,
                  message: "Product name require!",
                },
              ]}
            >
              <Input style={{ width: "60%" }} />
            </Form.Item>
            <Form.Item
              name="productId"
              label="Product Id"
              rules={[
                {
                  required: true,
                  message: "Product id require!",
                },
              ]}
            >
              <Input
                style={{ width: "40%", marginRight: "1em" }}
                disabled={true}
                ref={productIdInputRef}
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-end",
                marginBottom: "2em",
                // background: "black",
              }}
            >
              <Button
                style={{ marginRight: "1em" }}
                type="primary"
                size="small"
                onClick={() => {
                  const countryCode = 883;
                  const manufactureCode = 2439; //CHFW;
                  const randomProductCode = Math.floor(Math.random() * 100000);

                  const checkDigit = generateEANCheckDigit(
                    `${countryCode}${manufactureCode}${randomProductCode}`
                  );

                  form.setFieldValue(
                    "productId",
                    `${countryCode}${manufactureCode}${randomProductCode}${checkDigit}`
                  );
                }}
              >
                Generate
              </Button>
              <Button
                type="primary"
                size="small"
                style={{ background: "var(--secondary-color)", color: "white" }}
                disabled={scanMode}
                onClick={() => {
                  if (scanMode) {
                    setScanMode(false);
                    document.onkeyup = null;
                  } else {
                    setScanMode(true);
                    document.onkeyup = (e) => {
                      if (e.key === "Enter") {
                        console.log(barcode);
                        form.setFieldValue("productId", barcode);
                        setScanMode(false);
                      } else {
                        barcode += e.key;
                      }
                    };
                  }
                }}
              >
                {scanMode ? "Scanning" : "Scan"}
              </Button>
            </div>

            <Form.Item label="Product Image" valuePropName="fileList">
              {/* <Upload
                name="avatar"
                onChange={() => {}}
                action="/upload.do"
                listType="picture-card"
                multiple={false}
              >
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              </Upload> */}
              <UploadImg
                setFile={setFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              ></UploadImg>
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Product category require!",
                },
              ]}
            >
              <Select style={{ width: "60%" }}>
                {data.categories.map((category) => (
                  <Select.Option value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="brand"
              label="Brand"
              rules={[
                {
                  required: true,
                  message: "Product brand require!",
                },
              ]}
            >
              <Select style={{ width: "60%" }}>
                {data.brands.map((brand) => (
                  <Select.Option value={brand.name} key={brand.name}>
                    {brand.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="buyingPrice"
              label="Buying Price"
              rules={[
                {
                  required: true,
                  message: "Product buying price require!",
                },
              ]}
            >
              <InputNumber style={{ width: "35%" }} />
            </Form.Item>
            <Form.Item
              name="salePrice"
              label="Sale Price"
              rules={[
                {
                  required: true,
                  message: "Product sale price require!",
                },
              ]}
            >
              <InputNumber style={{ width: "35%" }} />
            </Form.Item>
            <Form.Item
              name="domainCounts"
              label="Domain count"
              rules={[
                {
                  required: true,
                  message: "Product domain count require!",
                },
              ]}
            >
              <InputNumber style={{ width: "25%" }} />
            </Form.Item>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[
                {
                  required: true,
                  message: "Choose branch require!",
                },
              ]}
            >
              <Select style={{ width: "25%" }}>
                {data &&
                  data.user.branches.map((branch) => (
                    <Select.Option value={branch.branchId}>
                      {branch.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 2,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: "0 1em" }}
                disabled={disableSubmitButton}
              >
                Submit
              </Button>
              <Button
                htmlType="reset"
                className="add_new_product__button"
                type="default"
                style={{
                  marginRight: "1em",
                  background: "rgba(255,0,0,.65)",
                  color: "white",
                }}
                onClick={() => setImagePreview(false)}
              >
                Clear
              </Button>
              <Link to="/products">
                <Button htmlType="reset" className="add_new_product__button">
                  Close
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        open={isShowModal}
        onCancel={handleOnCloseModal}
        className="add_new_product__popup"
        bodyStyle={{
          padding: "1em 2em .5em",
        }}
        footer={null}
      >
        <div className="add_new_product__popup__icon">
          <img src={Successful} />
        </div>
        <p>Successfully Added New Product</p>
        <div className="add_new_product__popup__data">
          <div className="add_new_product__popup__data__item">
            <span>Product ID</span>
            <span className="add_new_product__popup__data__item  add_new_product__popup__data__item-id">
              {form.getFieldValue("productId")}
            </span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Product Name</span>
            <span>{form.getFieldValue("productName")}</span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Category</span>
            <span>{form.getFieldValue("category")}</span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Brand</span>
            <span>{form.getFieldValue("brand")}</span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Buying Price</span>
            <span>{form.getFieldValue("buyingPrice")}</span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Sale Price</span>
            <span>{form.getFieldValue("salePrice")}</span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Domain counts</span>
            <span>{form.getFieldValue("domainCounts")}</span>
          </div>
          <div className="add_new_product__popup__data__item">
            <span>Branch</span>
            <span className="add_new_product__popup__data__item add_new_product__popup__data__item-branch">
              {form.getFieldValue("branch")}
            </span>
          </div>
        </div>
        <div className="add_new_product__popup__buttons">
          <Button
            type="primary"
            onClick={() => setIsShowModal(false)}
            className="add_new_product__popup__button"
          >
            Ok
          </Button>
        </div>
      </Modal>
    </>
  );
}

function UploadImg({ setFile, imagePreview, setImagePreview }) {
  const [borderStyle, setBorderStyle] = useState(
    "2px dashed var(--secondary-color)"
  );
  const inputRef = useRef();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      alert("Please select a valid image file.");
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "#F2F1F1",
          border: borderStyle,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          setBorderStyle("none");
          inputRef.current.click();
        }}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--secondary-color)",
            }}
          >
            <PlusOutlined
              style={{
                fontSize: "2rem",
                color: "var(--secondary-color)",
                display: "block",
                marginBottom: ".3em",
              }}
            />
            <div>Upload</div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateEANCheckDigit(ean12) {
  // Ensure that the input is a 12-digit string
  if (
    typeof ean12 !== "string" ||
    ean12.length !== 12 ||
    !/^\d+$/.test(ean12)
  ) {
    throw new Error("Invalid input. Provide a 12-digit numeric string.");
  }

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(ean12[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit;
}

export default NewProductForm;
