$(function () {
  // 调用getUserInfo 获取用户基本信息
  getUserInfo();

  var layer = layui.layer;
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm(
      "确定退出登录？",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        // 1. 清空本地存储中的token
        localStorage.removeItem("token");
        // 2. 重写跳转到登录界面
        location.href = "/login.html";

        // layui库自己的关闭窗口代码 不必理会
        layer.close(index);
      }
    );
  });
});

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // 请求头的配置信息
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      // 调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data);
    },
  });
}

function renderAvatar(user) {
  // 1.获取用户的名称
  var name = user.nickname || user.username;
  // 2.设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;" + name);
  // 3. 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片图像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 3.2 渲染文本图像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
