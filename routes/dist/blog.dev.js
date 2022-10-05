"use strict";

var express = require("express");

var authCheck = require("../authCheck"); //checking if the user is already logged in or not


var router = express.Router();

var blogController = require("../controllers/blogController"); //GET//

/* GET users listing. */


router.get("/overview", blogController.get_post_list);
router.get("/:userId", blogController.get_user_post_list);
router.get("/overview/count", blogController.count_posts);
router.get("/:userId/count", blogController.count_posts_user);
router.get('/post/:postId', authCheck.checkAuthenticated, blogController.get_single_post);
router.get('/:userId/auth', blogController.check_current_user); //POST//

router.post('/post', authCheck.checkAuthenticated, blogController.create_new_post);
router.post("/post/:postId/", authCheck.checkAuthenticated, blogController.edit_post); //DELETE//

router["delete"]("/:userId/", authCheck.checkAuthenticated, blogController.delete_post);
module.exports = router;