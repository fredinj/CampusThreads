const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const teacher = require("../middleware/teacher.middleware");

const {
  categoryRequest,
  approveCategoryRequest,
  rejectCategoryRequest,
  viewCategoryRequests,
  deleteCategory,
  viewCategories,
  viewPendingCategoryRequests,
  viewOneCategory
} = require("../controllers/category.controller");


// Create a new category request
router.post("/request", [auth, teacher], categoryRequest); // add back teacher middleware

// Approve a category request
router.put("/:id/approve", [auth, admin], approveCategoryRequest); // add admin middleware

// Reject a category request
router.put("/:id/reject", [auth, admin], rejectCategoryRequest); // add admin middleware

// view all requests
router.get("/request", [auth, admin], viewCategoryRequests); // add admin middleware

router.get("/request/pending", [auth, admin], viewPendingCategoryRequests);

// view one
router.get("/:id", auth, viewOneCategory)

// view all categories
router.get("/", [auth], viewCategories);

//delete a category
router.delete("/:id", [auth, admin], deleteCategory); // add admin middleware

//get posts from a category
// router.get("/:categoryId/posts", getPostsByCategory)

//add category update routes and logic

module.exports = router;
