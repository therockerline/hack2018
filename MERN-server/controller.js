const PostValidator = require("./validators/Post");
const UserValidator = require("./validators/User");
const PostAction = require("./actions/Post");
const UserAction = require("./actions/User");

module.exports = function(app) {
app.get("/",UserAction.info);
app.post("/api/register",UserValidator.regValidation,UserAction.register);
app.post("/api/login",UserValidator.logValidation,UserAction.login);
app.get("/api/posts",PostAction.showPosts);
app.post("/api/users",UserAction.isLoggedIn);
app.get("/api/account",UserAction.isLoggedIn);
app.put("/api/me/update/psw",UserAction.isLoggedIn,UserValidator.changePassValidation,UserAction.newMyProfilePassword);
app.put("/api/me/update/img",UserAction.isLoggedIn,UserValidator.changeImageValidation,UserAction.newMyProfileImage);
app.post("/api/me/img",UserAction.isLoggedIn,UserAction.getMyProfileImage);
app.post("/api/me/geoloc",UserAction.isLoggedIn,UserAction.getMyGeoloc);
app.get("/api/logout",UserAction.isLoggedIn,UserAction.logout);
app.post("/api/add/post",UserAction.isLoggedIn,PostValidator.postValidation,PostAction.addPost);
app.delete("/api/delete/post",UserAction.isLoggedIn,PostAction.deletePost);
app.put("/api/postupvote/",UserAction.isLoggedIn,PostAction.UpVotePost);
app.put("/api/update/post",UserAction.isLoggedIn,PostAction.updatePost);
app.post("/api/search/users",UserAction.isLoggedIn);
app.post("/api/search/posts",UserAction.isLoggedIn);
app.post("/api/add/post/to/user",UserAction.isLoggedIn);
app.post("/api/search/post/by/user",UserAction.isLoggedIn);
app.post("/api/search/users/by/geoloc",UserAction.isLoggedIn);
app.post("/api/search/geoloc/distance/user/to/user",UserAction.isLoggedIn);
}