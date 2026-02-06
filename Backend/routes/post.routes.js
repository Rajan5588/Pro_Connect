import {Router} from "express"
import { allComments, checkActive, commentPost, createPost, delatePost, deleteComment, getAllPost, getUserProfileAndUserBasedOnUsername, incrementLikes } from "../controllers/postController.js"
import multer from "multer"
const router=Router()

const storage=multer.diskStorage({
     destination:function(req,file,cb){
          cb(null,"uploads/")
     },
     filename:function(req,file,cb){
          cb(null,file.originalname)
     }
})



const upload=multer({storage:storage});

router.route('/').get(checkActive)
router.route('/post').post(upload.single("media"),createPost)
router.route('/posts').get(getAllPost)
router.route('/post_delete').delete(delatePost)
router.route('/comment').post(commentPost)
router.route('/get_comments').get(allComments)
router.route('/delete_comment').delete(deleteComment)
router.route('/like').post(incrementLikes)
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername)

export default router