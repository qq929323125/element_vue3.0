/*
 * @Author: your name
 * @Date: 2020-10-14 13:50:09
 * @LastEditTime: 2021-01-07 10:24:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Ed
 * @FilePath: \vue_3.0_test\src\main.js
 */
import { createApp } from "vue";
import Api from "@/api";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

const setting = require("@/setting");
if (setting.pro_mock && ENV.MODE === "production") {
    require("@/mock/mock");
}

createApp(App)
    .use(Api)
    .use(store)
    .use(router)
    .mount("#app");
