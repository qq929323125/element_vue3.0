/*
 * @Author: your name
 * @Date: 2020-10-14 13:50:09
 * @LastEditTime: 2021-02-10 12:56:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Ed
 * @FilePath: \vue_3.0_test\src\main.js
 */
import { createApp } from "vue";
import axios from "@/plugins/axios";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import installElementPlus from "@/plugins/element";
import permission from "@/plugins/permission";

import "normalize.css/normalize.css";
import "nprogress/nprogress.css";
import "@/styles/common.scss";

const setting = require("@/setting");
if (setting.pro_mock && VE_ENV.MODE === "production") {
    require("@/mock/mock");
}

createApp(App)
    .use(store)
    .use(router)
    .use(installElementPlus)
    .use(axios, { router, store, opt: "VE_API" })
    .use(permission, { router, store })
    .mount("#app");
