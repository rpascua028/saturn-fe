import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { SearchInput, TagsDisplay } from '../Components';
import { fetchGet } from '../services/services';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, InputNumber, Upload, Modal, Spin, Popconfirm,
    notification, message, Checkbox} from 'antd';
import { SaveOutlined, PlusOutlined, CloseCircleOutlined, QuestionCircleOutlined,
  CloudDownloadOutlined} from '@ant-design/icons';



const { Option } = Select;

const ProductAddUpdate = ({ mode }) => {

  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  
  const [subCategories, setSubCategories] = useState([]);
  const [subHeadings, setSubHeadings] = useState([]);
  const [brands, setBrands] = useState([]);
  const [retailStores, setRetailStores] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [filters, setFilters] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [skinTones, setSkinTones] = useState([]);
  const [skinUndertones, setSkinUndertones] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [availableSubHeadings, setAvailableSubHeadings] = useState([]);
  const [selectedSubHeadings, setSelectedSubHeadings] = useState([]);
// highlighsts
  const [selectedHighlights, setSelectedHighlights] = useState([]);
  const [highlightSearchTerm, setHighlightSearchTerm] = useState('');
  const [isHighlightsModalVisible, setIsHighlightsModalVisible] = useState(false);
  // filter
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);
  // skinconcerns
  const [selectedSkinConcerns, setSelectedSkinConcerns] = useState([]);
  const [skinConcernSearchTerm, setSkinConcernSearchTerm] = useState('');
  const [isSkinConcernsModalVisible, setIsSkinConcernsModalVisible] = useState(false);
  const [importIngredientsList, setImportIngredientsList] = useState([]);
  const [isIngredientsInputModalVisible, setIsIngredientsInputModalVisible] = useState(false);
  const [isIngredientsImportModalVisible, setIsIngredientsImportModalVisible] = useState(false);
  const [ingredientsProcessed, setIngredientsProcessed] = useState(false);

  const [imageFileList, setImageFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [formData, setFormData] = useState(new FormData());

  const navigate = useNavigate();
  const fetchedRef = useRef(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const appEnvironment = process.env.REACT_APP_ENVIRONMENT;

  const [isLoading, setIsLoading] = useState(false); // Spinner control state
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importFormData, setImportFormData] = useState({ source: '', otherInput: '' });
  const [isImportLoading, setIsImportLoading] = useState(false);

  // Reference for the form
  const importFormRef = React.createRef();
  const formHighlightsRef = useRef(null);
  const formFiltersRef = useRef(null);
  const formSkinConcernsRef = useRef(null);
  const formIngredientsInputRef = useRef(null);
  const formIngredientsListRef = useRef(null);

  const [allDataFetched, setAllDataFetched] = useState(false);

  


  const filterOption = (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching initial data");
  
        const endpoints = [
          { url: 'categories', setter: setCategories },
          { url: 'sub-categories', setter: setSubCategories },
          { url: 'sub-headings', setter: setSubHeadings },
          { url: 'brands', setter: setBrands },
          { url: 'retail-stores', setter: setRetailStores },
          { url: 'highlights', setter: setHighlights },
          { url: 'filters', setter: setFilters },
          { url: 'skin-types', setter: setSkinTypes },
          { url: 'skin-concerns', setter: setSkinConcerns },
          { url: 'skin-tones', setter: setSkinTones },
          { url: 'skin-undertones', setter: setSkinUndertones },
          { url: 'ingredients', setter: setIngredients },
          // ... other endpoints
        ];

        const fetchPromises = endpoints.map(async (endpoint) => {
          const data = await fetchGet(endpoint.url);
          if (data) {
            endpoint.setter(data);
          }
        });
  
        await Promise.all(fetchPromises);
  
        setAllDataFetched(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    if (!fetchedRef.current) {
      fetchData();
      fetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (allDataFetched && mode === 'edit' && productId) {
      console.log("Fetching product details");
      const fetchProductDetails = async () => {
        try {

          const productDetails = await fetchGet(`products/${productId}`);
          console.log(productDetails);

 
          const categoryID = productDetails.category.map(cat => cat.id);
          handleCategoryChange(categoryID);
          const subCategoryID = productDetails.sub_category.map(sc => sc.id);
          handleSubCategoryChange(subCategoryID);
          const subHeadingID = productDetails.sub_heading.map(sh => sh.id);
          handleSubHeadingChange(subHeadingID);
          setSelectedHighlights(productDetails.benefits)
          setSelectedFilters(productDetails.preferences)
          setSelectedSkinConcerns(productDetails.skin_concerns)

          form.setFieldsValue({
            name: productDetails.name,
            brand: productDetails.brand.id,
            category: productDetails.category.map(cat => cat.id),
            sub_category: productDetails.sub_category.map(sc => sc.id),
            sub_heading: productDetails.sub_heading.map(sh => sh.id),
            stores: productDetails.stores.map(s => s),

            skin_types: productDetails.skin_types.map(st => st),
            skin_sensitive: productDetails.skin_sensitive ? 'Yes' : 'No',
            skin_concerns: productDetails.skin_concerns.map(sc => sc),
            skin_tone: productDetails.skin_tone.map(st => st),
            skin_undertone: productDetails.skin_undertone.map(su => su),
            is_new: productDetails.is_new ? 'Yes' : 'No',
            is_active: productDetails.is_active ? 'Yes' : 'No',
            rate: productDetails.rate,
            ingredients: productDetails.ingredients.map(ing => ing),
          });

          console.log("instanceEnvironment")
          console.log(appEnvironment)
          if (productDetails.images && productDetails.images.length > 0) {
            const imageUrls = productDetails.images.map(imageData => ({
              uid: imageData.image || '',
              name: (imageData.image ? imageData.image.substring(imageData.image.lastIndexOf('/') + 1) : ''),
              status: 'done',
              url: appEnvironment === 'dev'
              ? (imageData.image || '').replace("/media", "/api/media")
              : imageData.image || ''
            }));
            setImageFileList(imageUrls);
            console.log(imageUrls)
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

      fetchProductDetails();
    }
  }, [allDataFetched, mode, productId]);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleCategoryChange = (selectedCategories) => {
    setSelectedCategories(selectedCategories);
    console.log(selectedCategories);
    console.log("handleCategoryChange Triggered");

    const filteredSubCategories = subCategories.filter((subCategory) =>
      selectedCategories.includes(subCategory.category)
    );

    setAvailableSubCategories(filteredSubCategories);

    const filteredSubCategoryIds = filteredSubCategories.map((subCategory) => subCategory.id);

    const updatedSelectedSubCategories = selectedSubCategories.filter((selectedSubCategory) =>
      filteredSubCategoryIds.includes(selectedSubCategory)
    );

    form.setFieldsValue({
      sub_category: updatedSelectedSubCategories,
    });

    setSelectedSubCategories(updatedSelectedSubCategories);
    handleSubCategoryChange(updatedSelectedSubCategories);
  };

  const handleSubCategoryChange = (selectedSubCategories) => {
    console.log("handleSubCategory Triggered");
    setSelectedSubCategories(selectedSubCategories);

    const filteredSubHeadings = subHeadings.filter((subHeading) =>
      selectedSubCategories.includes(subHeading.sub_category)
    );


    setAvailableSubHeadings(filteredSubHeadings);

    const filteredSubHeadingIds = filteredSubHeadings.map((subHeading) => subHeading.id);

    const updatedSelectedSubHeadings = selectedSubHeadings.filter((selectedSubHeading) =>
      filteredSubHeadingIds.includes(selectedSubHeading)
    );


    form.setFieldsValue({
      sub_heading: updatedSelectedSubHeadings,
    });



    setSelectedSubHeadings(updatedSelectedSubHeadings);
    handleSubHeadingChange(updatedSelectedSubHeadings)
  };

  const handleSubHeadingChange = (selectedSubHeadings) => {
    console.log("handleSubHeadingChange Triggered");
    setSelectedSubHeadings(selectedSubHeadings);
  };

  const handleProductTagChage = async (productTag, value, checked) => {
  
        try {
            const data = await fetchGet(`product-tag-lookup?${productTag}=${value}`);
  
            const productTagDetails = data;
            console.log(productTagDetails[0].benefits)
            console.log(productTag)
            const highlightId = productTagDetails[0].benefits
            const filterId = productTagDetails[0].preferences
            const skinconcernId = productTagDetails[0].skin_concerns

            if (productTag === "benefits") {
              const newSelectedFilters = checked
              ? [...selectedFilters, filterId]
              : selectedFilters.filter(id => id !== filterId);
              setSelectedFilters(newSelectedFilters);


              const newSelectedSkinConcerns = checked
              ? [...selectedSkinConcerns, skinconcernId]
              : selectedSkinConcerns.filter(id => id !== skinconcernId);
          
              setSelectedSkinConcerns(newSelectedSkinConcerns);
              console.log(skinconcernId)
              console.log(newSelectedSkinConcerns)
              console.log(checked)

            } else if (productTag === "preferences") {

              const newSelectedHighlights = checked
              ? [...selectedHighlights, highlightId]
              : selectedHighlights.filter(id => id !== highlightId);
              setSelectedHighlights(newSelectedHighlights);

              const newSelectedSkinConcerns = checked
              ? [...selectedSkinConcerns, skinconcernId]
              : selectedSkinConcerns.filter(id => id !== skinconcernId);
              setSelectedSkinConcerns(newSelectedSkinConcerns);
             
            } else {
              const newSelectedHighlights = checked
              ? [...selectedHighlights, highlightId]
              : selectedHighlights.filter(id => id !== highlightId);
              setSelectedHighlights(newSelectedHighlights);

              const newSelectedFilters = checked
              ? [...selectedFilters, filterId]
              : selectedFilters.filter(id => id !== filterId);
              setSelectedFilters(newSelectedFilters);

            }
            // setSelectedHighlights(productTagDetails[0].benefits)

            // setSelectedSkinConcerns(productTagDetails[0].skin_concerns)

        } catch (error) {
            console.error('Error in handleProductTagChage:', error);
            // Handle the error appropriately
        }
  };  

// HIGHLIGHTS
const filteredHighlights = highlights.filter(highlight =>
    highlight.name.toLowerCase().includes(highlightSearchTerm.toLowerCase())
  );

  const handleHighlightTagToggle = (highlightId, checked) => {
    const newSelectedHighlights = checked
      ? [...selectedHighlights, highlightId]
      : selectedHighlights.filter(id => id !== highlightId);

     setSelectedHighlights(newSelectedHighlights);

     handleProductTagChage("benefits", highlightId, checked)

  };

  const handleHighlightSearch = (e) => {
    setHighlightSearchTerm(e.target.value);
  };


  const showHighlightsModal = () => {
    setIsHighlightsModalVisible(true);
  };

  const handleAddHighlight = async (values) => {
    try {
        const response = await axios.post(`${apiUrl}/admin/highlights`, {
            name: values.highlightName
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authService.getToken()}`,
            }
        });

        const newHighlight = response.data;
        setHighlights(prevHighlights => [...prevHighlights, newHighlight]);
        setSelectedHighlights(prevSelected => [...prevSelected, newHighlight.id]);
        formHighlightsRef.current.resetFields();

        setIsHighlightsModalVisible(false);
        openNotification('success', 'Highlight successfully added.', '');
    } catch (error) {
        console.error('There was an error adding the highlight:', error);
        // Handle errors here, such as displaying an error message
    }
};
  

  // Filter
const filteredFilters = filters.filter(filter =>
    filter.name.toLowerCase().includes(filterSearchTerm.toLowerCase())
  );

  const handleFilterTagToggle = (filterId, checked) => {
    const newSelectedFilters = checked
      ? [...selectedFilters, filterId]
      : selectedFilters.filter(id => id !== filterId);

     setSelectedFilters(newSelectedFilters);

     handleProductTagChage("preferences", filterId, checked)

  };

  const handleFilterSearch = (e) => {
    setFilterSearchTerm(e.target.value);
  };

  const showFiltersModal = () => {
    setIsFiltersModalVisible(true);
  };

  const handleAddFilter = async (values) => {
    try {
        const response = await axios.post(`${apiUrl}/admin/filters`, {
            name: values.filterName
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authService.getToken()}`,
            }
        });

        const newFilter = response.data;
        setFilters(prevFilters => [...prevFilters, newFilter]);
        setSelectedFilters(prevSelected => [...prevSelected, newFilter.id]);
        formFiltersRef.current.resetFields();

        setIsFiltersModalVisible(false);
        openNotification('success', 'Filter successfully added.', '');
    } catch (error) {
        console.error('There was an error adding the filter:', error);
        // Handle errors here, such as displaying an error message
    }
};

// skinconcern
const filteredSkinConcerns = skinConcerns.filter(skinconcern =>
    skinconcern.name.toLowerCase().includes(skinConcernSearchTerm.toLowerCase())
);

const handleSkinConcernTagToggle = (skinconcernId, checked) => {
    const newSelectedSkinConcerns = checked
        ? [...selectedSkinConcerns, skinconcernId]
        : selectedSkinConcerns.filter(id => id !== skinconcernId);

    setSelectedSkinConcerns(newSelectedSkinConcerns);

    handleProductTagChage("skin_concerns", skinconcernId, checked)
};

const handleSkinConcernSearch = (e) => {
    setSkinConcernSearchTerm(e.target.value);
};

const showSkinConcernsModal = () => {
  setIsSkinConcernsModalVisible(true);
};

const showIngredientsInputModal = () => {
  setIsIngredientsInputModalVisible(true);
};

const handleImportIngredientsInputSubmit = (values) => {
  console.log(values);
  const ingredients = values.inputIngredients.split(',').map(ingredient => ingredient.trim());
  setImportIngredientsList(ingredients); // Update the state and trigger a re-render
  setIsIngredientsInputModalVisible(false); // Close the input modal
  setIsIngredientsImportModalVisible(true); // Open the modal for editing ingredients
  formIngredientsInputRef.current.resetFields();
};

useEffect(() => {
  if (importIngredientsList.length > 0) {
    // Dynamically set initial values based on the imported ingredients list
    const initialValues = importIngredientsList.reduce((acc, ingredient, index) => {
      const filteredIngredients = ingredients.filter(ing => 
        ing.name.toLowerCase().includes(ingredient.toLowerCase())
      );

      // Automatically select the first matching ingredient's ID, or "none" if no matches
      const initialValueForId = filteredIngredients.length > 0 ? filteredIngredients[0].id : "none";

      acc[`ingredient_${index}`] = {
        name: ingredient,
        id: initialValueForId, // Set to the first match's ID or "none"
        include: true
      };

      return acc;
    }, {});

    formIngredientsListRef.current?.setFieldsValue(initialValues);
  }
}, [importIngredientsList, ingredients]); // Add ingredients to dependency array if it's stateful or comes from props

// Handler for processing and submitting the ingredients list form
const handleIngredientsListSubmit = async (formValues) => {
  setIsLoading(true); // Start loading
  let ingredientsWithId = [];
  let ingredientsWithoutId = [];

  for (const key in formValues) {
    if (key.startsWith('ingredient_')) {
      const ingredientData = formValues[key];
      if (ingredientData.id !== 'none' && ingredientData.include) {
        ingredientsWithId.push(ingredientData.id);
      } else if (ingredientData.id === 'none' && ingredientData.include) {
        ingredientsWithoutId.push(ingredientData.name);
      }
    }
  }

  try {
    const response = await axios.post(
      `${apiUrl}/admin/ingredients`,
      ingredientsWithoutId,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`,
        }
      }
    );

    const newIngredients = response.data;
    setIngredients(prevIngredients => [...prevIngredients, ...newIngredients]);
    form.setFieldsValue({
      ingredients: [...ingredientsWithId, ...newIngredients.map(ing => ing.id)],
    });

    openNotification('success', 'Ingredients successfully added.', '');
  } catch (error) {
    console.error('There was an error adding the ingredients:', error);
  } finally {
    setIsLoading(false); // Stop loading regardless of the outcome
    setIsIngredientsImportModalVisible(false); // Close the modal after operations
  }
};

useEffect(() => {
  if (ingredientsProcessed) {
    setIsIngredientsImportModalVisible(false);
    setIngredientsProcessed(false); // Reset for the next batch

    // Ensure form and state are reset for the next input
    formIngredientsListRef.current?.resetFields();
    setImportIngredientsList([]); // Clear the list to avoid carrying over previous submissions
  }
}, [ingredientsProcessed]);

// Assuming this function was already correctly fetching your ingredients
const renderSelectOptions = (inputValue) => {
  let options;

  if (inputValue) {
    const searchText = inputValue.toLowerCase();
    const filteredIngredients = ingredients.filter(ing => 
      ing.name.toLowerCase().includes(searchText)
    );
    const isMatchFound = filteredIngredients.length > 0;
    options = isMatchFound ? [
      ...filteredIngredients.map(ing => (
        <Option key={ing.id} value={ing.id}>{ing.name}</Option>
      )),
      <Option key="none" value="none">None</Option>
    ] : [<Option key="none" value="none">None</Option>];
  } 
  return options;
};


// Example function for finding ingredient ID by name
const findIngredientIdByName = (ingredientName) => {
  const match = ingredients.find(ing => ing.name.toLowerCase() === ingredientName.toLowerCase());

  return match ? match.id : "none"; // Return the id if a match is found, otherwise "none"
};




const handleAddSkinConcern = async (values) => {
  try {
      const response = await axios.post(`${apiUrl}/admin/skin-concerns`, {
          name: values.skinConcernName
      }, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authService.getToken()}`,
          }
      });

      const newSkinconcern = response.data;
      setSkinConcerns(prevSkinConcerns=> [...prevSkinConcerns, newSkinconcern]);
      setSelectedSkinConcerns(prevSelected => [...prevSelected, newSkinconcern.id]);
      formSkinConcernsRef.current.resetFields();

      setIsSkinConcernsModalVisible(false);
      openNotification('success', 'Skin Concern successfully added.', '');
  } catch (error) {
      console.error('There was an error adding the skin concern:', error);
      // Handle errors here, such as displaying an error message
  }
};



const handleBrandChange = async (value) => {
  
  if (mode === "add") {
      try {
          const data = await fetchGet(`brands/${value}`);

          const brandDetails = data;
          const benefitsID = brandDetails.benefits_detail.map(b => b.id);
          setSelectedHighlights(benefitsID);
          const preferencesID = brandDetails.preferences_detail.map(p => p.id);
          setSelectedFilters(preferencesID);
      } catch (error) {
          console.error('Error in handleBrandChange:', error);
          // Handle the error appropriately
      }
  }
};


const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };



 
  const handleImageChange = ({ fileList }) => {
    setImageFileList(fileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const beforeUpload = (file) => {
    formData.append('images', file);
    return false;
  };



  // Handler functions for import product modal
const showImportModal = () => {
  setIsImportModalVisible(true);
};

const handleImportModalOk = () => {
  const formValues = importFormRef.current.getFieldsValue();
  const sources = formValues.sources;

  console.log('handleImportModalOk called'); // Debug log

  const hasValidURL = sources && sources.some(source => source.source && validateURL(source.source));
  if (!hasValidURL) {
    message.error('Please add at least one valid URL');
    return;
  }

  console.log('Setting isImportLoading to true'); // Debug log
  setIsImportLoading(true); // Start loading

  // Prepare the data for the API call
  const apiData = new FormData();
  apiData.append('sources', sources.map(source => source.source).join(', '));
  apiData.append('instruction', formValues.otherInput);

  // Make the API call
  axios({
    method: 'post',
    url: `${apiUrl}/admin/generate-product`,
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
      'Content-Type': 'multipart/form-data'
    },
    data: apiData
  })
  .then(response => {
    console.log('API Response:', response);
    openNotification('success', 'Product generated successfully', '');
    setIsImportModalVisible(false);

        //  const categoryID = productDetails.category.map(cat => cat.id);
            handleCategoryChange(response.data.category);
            console.log("esponse.data.category")
            console.log(response.data.category)

        //   const subCategoryID = productDetails.sub_category.map(sc => sc.id);
            handleSubCategoryChange(response.data.sub_category);
            setSelectedHighlights(response.data.highlights)
            setSelectedFilters(response.data.filters)
            setSelectedSkinConcerns(response.data.skin_concerns)

            console.log("sub_heading####")
            console.log(response.data)

          form.setFieldsValue({
            name: response.data.name,
            category: response.data.category,
            brand:response.data.brand,
            sub_category: response.data.sub_category,
            sub_heading: response.data.sub_headings,
            benefits:response.data.highlights,
            preferences: response.data.filters,
            skin_types: response.data.skin_types
          }); 


  })
  .catch(error => {
    console.error('API Error:', error);
    openNotification('error', 'Error generating product', '');
  })
  .finally(() => {
    console.log('Setting isImportLoading to false'); // Debug log
    setIsImportLoading(false); // Stop loading
  });

  importFormRef.current.resetFields();
};



const handleImportModalCancel = () => {
  setIsImportModalVisible(false);
  importFormRef.current.resetFields();
};



const validateURL = (url) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return urlPattern.test(url);
};




  const handleFormSubmit = async (values) => {


    values.benefits = selectedHighlights
    values.preferences = selectedFilters
    values.skin_concerns = selectedSkinConcerns

    console.log(values)
    try {
      console.log('handleFormSubmit called');
      setLoading(true);
      console.log(values);
  
  
      const productUrl = mode === 'edit' ? `${apiUrl}/admin/products/${productId}` : `${apiUrl}/admin/products`;
      const method = mode === 'edit' ? 'put' : 'post';
  
      const productResponse = await axios({
        method: method,
        url: productUrl,
        data: values,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
  
      if (mode === 'add') {
        console.log('Product added successfully:', productResponse.data);
      } else if (mode === 'edit') {
        console.log('Product updated successfully:', productResponse.data);
      }
  
      if (imageFileList.length > 0) {
        const formData = new FormData();
        const localImages = [];
        const remoteFilePath = [];
  
        imageFileList.forEach((file) => {
          if (file.originFileObj) {
            localImages.push(file.originFileObj);
          } else if (file.url) {
            remoteFilePath.push("images/" + file.name);
          }
        });
  
        localImages.forEach((file) => {
          formData.append('images', file);
        });
  
        formData.append('file_paths', JSON.stringify(remoteFilePath));
  
        const uploadResponse = await axios.post(
          `${apiUrl}/admin/products/${productResponse.data.id}/images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (uploadResponse.status === 201) {
          console.log('Images uploaded successfully:', uploadResponse.data);
        } else {
          console.error('Error uploading images:', uploadResponse.data);
        }
      }
  
      setLoading(false);
      openNotification('success', 'Record successfully saved.', '');
      navigate('/dashboard/products');
    } catch (error) {
      setLoading(false);
      console.error('Error saving product:', error);
      openNotification('error', 'System Error.', `API Error: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };
  
  

  const handleCancel = () => {
    // Handle cancel action here
    console.log('Cancelled');
    setPreviewVisible(false);
    navigate('/dashboard/products');
  };
  
    return (
<div className="container mx-auto p-4">
<Spin spinning={loading} size='large'>
  <h1 className="text-2xl font-bold">
    {mode === 'add' ? 'Add New Product' : 'Edit Product'}
  </h1>
  {mode === 'add' && (
    <Button type="primary" icon={<CloudDownloadOutlined />} style={{ marginTop: '10px' }} onClick={showImportModal}>
      Import Product
    </Button>
  )}
  <Form form={form} ref={formRef} onFinish={handleFormSubmit} layout="vertical">
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Product Name is required',
            },
          ]}
        >
          <Input type="text" placeholder="Product Name" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Brand"
          name="brand"
          rules={[
            {
              required: true,
              message: 'Brand is required',
            },
          ]}
        >
          <Select
            showSearch
            filterOption={filterOption}
            placeholder="Select Brand"
            onChange={handleBrandChange}
            disabled={mode === 'view'}
          >
            {brands.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: 'Category is required',
            },
          ]}
        >
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Categories"
            value={selectedCategories}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="Sub Category"
          name="sub_category"
          rules={[
            {
              required: true,
              message: 'Sub-category is required',
            },
          ]}
        >
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Sub Categories"
            value={selectedCategories}
            onChange={handleSubCategoryChange}
          >
            {availableSubCategories.map((subCategory) => (
              <Option key={subCategory.id} value={subCategory.id}>{subCategory.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Sub Heading" name="sub_heading">
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Sub Headings"
            onChange={handleSubHeadingChange}
          >
            {availableSubHeadings.map((subHeading) => (
              <Option key={subHeading.id} value={subHeading.id}>{subHeading.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Retail Store" name="stores">
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Retail Stores"
          >
            {retailStores.map((retailStore) => (
              <Option key={retailStore.id} value={retailStore.id}>{retailStore.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Skin Types" name="skin_types">
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Skin Types"
          >
            {skinTypes.map((skinType) => (
              <Option key={skinType.id} value={skinType.id}>{skinType.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Skin Sensitivity?" name="skin_sensitive">
          <Select
            showSearch
            filterOption={filterOption}
            placeholder="Select Skin Sensitivity"
          >
            <Option key="unknown" value="Unknown">Unknown</Option>
            <Option key="yes" value="Yes">Yes</Option>
            <Option key="no" value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Form.Item name="benefits" style={{ marginBottom: 10 }}>
      <Row gutter={16}>
        <Col span={23}>
          <SearchInput
            label="Highlights"
            placeholder="Search for highlights to add..."
            searchTerm={highlightSearchTerm}
            onSearchChange={handleHighlightSearch}
          />
        </Col>
        <Col span={1}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showHighlightsModal}></Button>
        </Col>
      </Row>
      <TagsDisplay
        tags={filteredHighlights}
        selectedTags={selectedHighlights}
        onTagToggle={handleHighlightTagToggle}
      />
    </Form.Item>

    <Form.Item name="preferences" style={{ marginBottom: 10 }}>
      <Row gutter={16}>
        <Col span={23}>
          <SearchInput
            label="Filters"
            placeholder="Search for filters to add..."
            searchTerm={filterSearchTerm}
            onSearchChange={handleFilterSearch}
          />
        </Col>
        <Col span={1}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showFiltersModal}></Button>
        </Col>
      </Row>
      <TagsDisplay
        tags={filteredFilters}
        selectedTags={selectedFilters}
        onTagToggle={handleFilterTagToggle}
      />
    </Form.Item>

    <Form.Item name="skin_concerns" style={{ marginBottom: 10 }}>
      <Row gutter={16}>
        <Col span={23}>
          <SearchInput
            label="Skin Concerns"
            placeholder="Search for skin concerns to add..."
            searchTerm={skinConcernSearchTerm}
            onSearchChange={handleSkinConcernSearch}
          />
        </Col>
        <Col span={1}>
          <Button type="primary" icon={<PlusOutlined />} onClick={showSkinConcernsModal}></Button>
        </Col>
      </Row>
      <TagsDisplay
        tags={filteredSkinConcerns}
        selectedTags={selectedSkinConcerns}
        onTagToggle={handleSkinConcernTagToggle}
      />
    </Form.Item>

    <Row gutter={16}>
      <Col span={14}>
        <Form.Item label="Skin Tone" name="skin_tone">
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Skin Tone"
          >
            {skinTones.map((skinTone) => (
              <Option key={skinTone.id} value={skinTone.id}>{skinTone.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={10}>
        <Form.Item label="Skin Undertone" name="skin_undertone">
          <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Skin Undertone"
          >
            {skinUndertones.map((skinUndertone) => (
              <Option key={skinUndertone.id} value={skinUndertone.id}>{skinUndertone.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Is New?" name="is_new">
          <Select
            showSearch
            filterOption={filterOption}
            placeholder="Select Is New"
          >
            <Option key="yes" value="Yes">Yes</Option>
            <Option key="no" value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Is Active?" name="is_active">
          <Select
            showSearch
            filterOption={filterOption}
            placeholder="Select Is Active"
          >
            <Option key="yes" value="Yes">Yes</Option>
            <Option key="no" value="No">No</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Rate" name="rate">
          <InputNumber placeholder="0.00" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>



        <Form.Item label="Ingredients" name="ingredients">
        <Select
            mode="multiple"
            showSearch
            filterOption={filterOption}
            placeholder="Select Ingredients"
          >
            {ingredients.map((ingredient) => (
              <Option key={ingredient.id} value={ingredient.id}>{ingredient.name}</Option>
            ))}
          </Select>
        </Form.Item>



    <Form.Item>
      <Button type="primary" icon={<PlusOutlined />} onClick={showIngredientsInputModal}>
            Import Ingredients
          </Button>
      </Form.Item>

  

    <Form.Item label="Images" name="images">
      <Upload
        listType="picture-card"
        fileList={imageFileList}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleImageChange}
      >
        {imageFileList.length >= 4 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handlePreviewCancel}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Form.Item>

    <Form.Item>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Popconfirm
          title="Are you sure you want to cancel the transaction?"
          onConfirm={handleCancel}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button key="cancel" icon={<CloseCircleOutlined />} style={{ marginRight: '8px' }}>
            Cancel
          </Button>
        </Popconfirm>
        <Popconfirm
          title="Save the record?"
          onConfirm={() => {
            console.log("Confirm button clicked"); // Debugging line
            formRef.current.submit();
          }}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'green' }} />}
        >
          <Button type="primary" icon={<SaveOutlined />}>
            {mode === 'add' ? 'Save' : 'Save Changes'}
          </Button>
        </Popconfirm>
      </div>
    </Form.Item>
  </Form>
</Spin>

        
        
            <Modal 
  title="Import Product" 
  visible={isImportModalVisible} 
  onCancel={handleImportModalCancel} 
  footer={[
    <Button key="cancel" onClick={handleImportModalCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" loading={isImportLoading} onClick={() => importFormRef.current.submit()}>
      Import
    </Button>
  ]}
>
  <Spin spinning={isImportLoading} size="large">
    <Form ref={importFormRef} layout="vertical" onFinish={handleImportModalOk}>
      <Form.List name="sources">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Form.Item
                {...restField}
                key={key}
                name={[name, 'source']}
                label="Source URL"
                rules={[
                  { required: true, message: 'URL is required' },
                  { 
                    validator: async (_, value) => {
                      if (value && !validateURL(value)) {
                        return Promise.reject(new Error('Please enter a valid URL'));
                      }
                    }
                  }
                ]}
              >
                <Input
                  placeholder="Enter URL/Link"
                  addonAfter={fields.length > 1 ? <Button type="link" onClick={() => remove(name)}>Remove</Button> : null}
                />
              </Form.Item>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add URL
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item name="otherInput" label="Other Input">
        <Input.TextArea placeholder="Enter other details" />
      </Form.Item>
    </Form>
  </Spin>
</Modal>

<Modal
    title="Add Highlight"
    visible={isHighlightsModalVisible}
    onOk={() => formHighlightsRef.current && formHighlightsRef.current.submit()}
    onCancel={() => {
      setIsHighlightsModalVisible(false);
      formHighlightsRef.current.resetFields();
  }}
>
<Form
    onFinish={handleAddHighlight}
    ref={formHighlightsRef}
    >
        <Form.Item
            name="highlightName"
            rules={[{ required: true, message: 'Please input the highlight name.' }]}
        >
            <Input placeholder="Enter highlight name" />
        </Form.Item>
        {/* Add more Form.Items as needed */}
    </Form>
</Modal>


<Modal
    title="Add Filters"
    visible={isFiltersModalVisible}
    onOk={() => formFiltersRef.current && formFiltersRef.current.submit()}
    onCancel={() => {
      setIsFiltersModalVisible(false);
      formFiltersRef.current.resetFields();
  }}
>
<Form
    onFinish={handleAddFilter}
    ref={formFiltersRef}
    >
        <Form.Item
            name="filterName"
            rules={[{ required: true, message: 'Please input the filter name.' }]}
        >
            <Input placeholder="Enter filter name" />
        </Form.Item>
        {/* Add more Form.Items as needed */}
    </Form>
</Modal>


<Modal
    title="Skin Concerns"
    visible={isSkinConcernsModalVisible}
    onOk={() => formSkinConcernsRef.current && formSkinConcernsRef.current.submit()}
    onCancel={() => {
      setIsSkinConcernsModalVisible(false);
      formSkinConcernsRef.current.resetFields();
  }}
>
<Form
    onFinish={handleAddSkinConcern}
    ref={formSkinConcernsRef}
    >
        <Form.Item
            name="skinConcernName"
            rules={[{ required: true, message: 'Please input the skin concern name.' }]}
        >
            <Input placeholder="Enter skin concern name" />
        </Form.Item>
        {/* Add more Form.Items as needed */}
    </Form>
</Modal>


<Modal
    title="Import Ingredients"
    visible={isIngredientsInputModalVisible}
    onOk={() => formIngredientsInputRef.current && formIngredientsInputRef.current.submit()}
    onCancel={() => {
      setIsIngredientsInputModalVisible(false);
      formIngredientsInputRef.current.resetFields();
  }}
>
<Form
    onFinish={handleImportIngredientsInputSubmit}
    ref={formIngredientsInputRef}
    >
        <Form.Item
            name="inputIngredients"
            rules={[{ required: true, message: 'Please ingredients separated by commas.' }]}
        >
             <Input.TextArea rows={4} placeholder="Enter ingredients separated by commas" />
        </Form.Item>
        {/* Add more Form.Items as needed */}
    </Form>
</Modal>

   <Spin spinning={isLoading} tip="Processing...">
      <Modal
        title="Edit Imported Ingredients"
        visible={isIngredientsImportModalVisible}
        onOk={() => formIngredientsListRef.current.submit()}
        onCancel={() => {
          setIsIngredientsImportModalVisible(false);
          formIngredientsListRef.current.resetFields();
        }}
        width="45%"
      >
        <Form
          key={importIngredientsList.length}
          ref={formIngredientsListRef}
          layout="vertical"
          onFinish={handleIngredientsListSubmit}
        >
          <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            {importIngredientsList.map((ingredient, index) => (
              <Row key={index} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                <Col span={1}>
                  <Form.Item
                    name={[`ingredient_${index}`, 'include']}
                    valuePropName="checked"
                    initialValue={true}
                    noStyle
                  >
                    <Checkbox />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    name={[`ingredient_${index}`, 'name']}
                    initialValue={ingredient}
                    noStyle
                  >
                    <Input placeholder="Ingredient name" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={[`ingredient_${index}`, 'id']}
                    initialValue={findIngredientIdByName(ingredient)}
                    noStyle
                  >
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Select ingredient type"
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                      {renderSelectOptions(ingredient)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </div>
        </Form>
      </Modal>
    </Spin>




            {/* Category Modal */}
        </div>
    );
};

export default ProductAddUpdate;
