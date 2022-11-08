const router = require('express').Router();
var CategoryController = require('../controllers/categoryController');
const { createCategorySchemaValidation } = require('../middleware/dataValidation');
const { verifyToken, verifyAdmin, verifyTokenAndAutherization, verifySeller } = require('../middleware/verifyToken');
const uuid = require('uuid');
const fileUpload = require('express-fileupload');
const path = require('path');

//get All Categories
router.get('/', verifyToken, CategoryController.getCategories);

//get Category by id with all products
router.get('/:id', verifyToken, CategoryController.getCategoryById);

router.post('/', verifySeller, createCategorySchemaValidation, CategoryController.createCategory);

//delete category
router.delete('/:id', verifyAdmin, CategoryController.deleteCategory);
//update category
router.put('/:id', verifyAdmin, CategoryController.updateCategory);
//get the categories of a store
router.get('/store/:id', verifyToken, CategoryController.getCategoriesForStore);
//get products by category name
router.get('/search/:category/:id', verifyToken, CategoryController.getCategoriesNamesForStore);
module.exports = router;
