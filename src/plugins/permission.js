/*
 * @Author: your name
 * @Date: 2021-01-13 17:32:55
 * @LastEditTime: 2021-02-10 12:58:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \element_vue3.0\src\plugins\jurisdiction.js
 */

import globalRoutes from "@/router/globalRoutes";
import mainRoutes from "@/router/mainRoutes";
import { isURL } from "@/utils/validate";
import NProgress from "nprogress";

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
// eslint-disable-next-line no-unused-vars
function fnCurrentRouteType(route, globalRoutes = []) {
    let temp = [];
    for (let i = 0; i < globalRoutes.length; i++) {
        if (route.path === globalRoutes[i].path) {
            return "global";
        } else if (
            globalRoutes[i].children &&
            globalRoutes[i].children.length >= 1
        ) {
            temp = temp.concat(globalRoutes[i].children);
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : "main";
}

export default {
    install: (app, { router, store }) => {
        // let router = opt;
        router.beforeEach(async (to, from, next) => {
            const token = store.getters.token;
            if (
                router.options.isAddDynamicMenuRoutes ||
                fnCurrentRouteType(to, globalRoutes) === "global"
            ) {
                //* 1. 已经添加 or 全局路由, 直接访问
                if (to.meta.title) {
                    document.title = to.meta.title;
                }
                NProgress.start();
                next();
            } else {
                // let token = sessionStorage.getItem("token");
                if (!token || !/\S/.test(token)) {
                    next({ name: "Login" });
                } else {
                    const data = await VE_API.user.userMenuList();
                    if (data && data.code === "00") {
                        await fnAddDynamicMenuRoutes(data.list);
                        router.options.isAddDynamicMenuRoutes = true;
                        await store.dispatch("app/set_menu_list", data.list);
                        NProgress.start();
                        next({ ...to, replace: true });
                    } else {
                        next({ name: "Login" });
                    }
                }
            }
        });
        router.afterEach(() => {
            NProgress.done();
        });

        /**
         * 添加动态(菜单)路由
         * @param {*} menuList 菜单列表
         * @param {*} routes 递归创建的动态(菜单)路由
         */
        // eslint-disable-next-line no-unused-vars
        const fnAddDynamicMenuRoutes = async (menuList = [], routes = []) => {
            let temp = [];
            for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].children && menuList[i].children.length >= 1) {
                    temp = temp.concat(menuList[i].children);
                } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
                    // const url = menuList[i].url.replace(/\//g, "_");
                    let route = {
                        path:
                            menuList[i].url.replace(/\//g, "-") +
                            `-${menuList[i].id}`,
                        component: null,
                        name:
                            menuList[i].url.replace(/\//g, "-") +
                            `-${menuList[i].id}`
                        // meta: {
                        //     menuId: menuList[i].menuId,
                        //     title: menuList[i].name,
                        //     isDynamic: true,
                        //     isTab: true,
                        //     iframeUrl: ""
                        // }
                    };
                    // url以http[s]://开头, 通过iframe展示
                    if (isURL(menuList[i].url)) {
                        route["path"] = `i-${menuList[i].id}`;
                        route["name"] = `i-${menuList[i].id}`;
                        route["meta"]["iframeUrl"] = menuList[i].url;
                    } else {
                        const l = "views/layoutpages/" + menuList[i].url;
                        route["component"] = () => import("@/" + l + ".vue");
                    }
                    routes.push(route);
                }
            }
            if (temp.length >= 1) {
                fnAddDynamicMenuRoutes(temp, routes);
            } else {
                mainRoutes.children = mainRoutes.children.concat(routes);
                // mainRoutes.children = routes;
                console.log(
                    "控制台打印--> ~ file: permission.js ~ line 127 ~ fnAddDynamicMenuRoutes ~ mainRoutes.children",
                    mainRoutes.children
                );

                await router.addRoute(mainRoutes);
                await router.addRoute({
                    path: "/:w+",
                    redirect: { name: "404" }
                });
            }
        };
    }
};
