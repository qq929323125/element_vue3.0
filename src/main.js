/*
 * @Author: your name
 * @Date: 2020-10-14 13:50:09
 * @LastEditTime: 2021-04-27 11:10:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Ed
 * @FilePath: \vue3-element-admin\src\main.js
 */
import { createApp } from "vue";
import axios from "@/plugins/axios";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import installElementPlus from "@/plugins/element";
import permission from "@/plugins/permission";
import mock from "@/plugins/mock";
import directives from "@/directives";

import "normalize.css/normalize.css";
import "nprogress/nprogress.css";
import "@/styles/common.scss";
const app = createApp(App);
app.use(mock)
    .use(store)
    .use(router)
    .use(installElementPlus)
    .use(axios, { router, store, opt: "VE_API" })
    .use(permission, { router, store })
    .use(directives, { router, store })
    .mount("#app");
