/* eslint-disable no-unused-vars */
module.exports = /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/ if (installedModules[moduleId]) {
            /******/ return installedModules[moduleId].exports;
            /******/
        } // Create a new module (and put it into the cache)
        /******/ /******/ var module = (installedModules[moduleId] = {
            /******/ i: moduleId,
            /******/ l: false,
            /******/ exports: {},
            /******/
        }); // Execute the module function
        /******/
        /******/ /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__); // Flag the module as loaded
        /******/
        /******/ /******/ module.l = true; // Return the exports of the module
        /******/
        /******/ /******/ return module.exports;
        /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
        /******/ if (!__webpack_require__.o(exports, name)) {
            /******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
            /******/
        }
        /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
        /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
            /******/
        }
        /******/ Object.defineProperty(exports, "__esModule", { value: true });
        /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(value, mode) {
        /******/ if (mode & 1) value = __webpack_require__(value);
        /******/ if (mode & 8) return value;
        /******/ if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        /******/ var ns = Object.create(null);
        /******/ __webpack_require__.r(ns);
        /******/ Object.defineProperty(ns, "default", { enumerable: true, value: value });
        /******/ if (mode & 2 && typeof value != "string")
            for (var key in value)
                __webpack_require__.d(
                    ns,
                    key,
                    function(key) {
                        return value[key];
                    }.bind(null, key)
                );
        /******/ return ns;
        /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
        /******/ var getter =
            module && module.__esModule
                ? /******/ function getDefault() {
                      return module["default"];
                  }
                : /******/ function getModuleExports() {
                      return module;
                  };
        /******/ __webpack_require__.d(getter, "a", getter);
        /******/ return getter;
        /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = "fb15"));
    /******/
})(
    /************************************************************************/
    /******/ {
        /***/ "0205": /***/ function(module, exports) {
            module.exports = require("vue2-leaflet");

            /***/
        },

        /***/ "1628": /***/ function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Vue2LeafletHeatmap_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                "91bf"
            );
            /* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Vue2LeafletHeatmap_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Vue2LeafletHeatmap_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__
            );
            /* unused harmony reexport * */
            /* unused harmony default export */ var _unused_webpack_default_export =
                _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Vue2LeafletHeatmap_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a;

            /***/
        },

        /***/ "860c": /***/ function(module, exports) {
            module.exports = require("leaflet");

            /***/
        },

        /***/ "91bf": /***/ function(module, exports, __webpack_require__) {
            // extracted by mini-css-extract-plugin
            /***/
        },

        /***/ d036: /***/ function(module, exports) {
            module.exports = require("core-js/modules/es.number.constructor");

            /***/
        },

        /***/ d70f: /***/ function(module, exports) {
            module.exports = require("leaflet.heat");

            /***/
        },

        /***/ fb15: /***/ function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);

            // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
            // This file is imported into lib/wc client bundles.

            if (typeof window !== "undefined") {
                var i;
                if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
                    __webpack_require__.p = i[1]; // eslint-disable-line
                }
            }

            // Indicate to webpack that this file can be concatenated
            /* harmony default export */ var setPublicPath = null;

            // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"35bf65ce-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./Vue2LeafletHeatmap.vue?vue&type=template&id=059343b0&
            var render = function() {
                var _vm = this;
                var _h = _vm.$createElement;
                var _c = _vm._self._c || _h;
                return _c("div", { staticStyle: { display: "none" } }, [_vm.ready ? _vm._t("default") : _vm._e()], 2);
            };
            var staticRenderFns = [];

            // CONCATENATED MODULE: ./Vue2LeafletHeatmap.vue?vue&type=template&id=059343b0&

            // EXTERNAL MODULE: external "core-js/modules/es6.number.constructor"
            var es6_number_constructor_ = __webpack_require__("d036");

            // EXTERNAL MODULE: external "leaflet"
            var external_leaflet_ = __webpack_require__("860c");
            var external_leaflet_default = /*#__PURE__*/ __webpack_require__.n(external_leaflet_);

            // EXTERNAL MODULE: external "leaflet.heat"
            var external_leaflet_heat_ = __webpack_require__("d70f");

            // EXTERNAL MODULE: external "vue2-leaflet"
            var external_vue2_leaflet_ = __webpack_require__("0205");

            // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./Vue2LeafletHeatmap.vue?vue&type=script&lang=js&

            //
            //
            //
            //
            //
            //

            var props = {
                latLng: {
                    type: Array,
                    default: function _default() {
                        return [];
                    },
                    custom: false,
                },
                minOpacity: {
                    type: Number,
                    custom: true,
                    default: 0.05,
                },
                maxZoom: {
                    type: Number,
                    custom: true,
                    default: 18,
                },
                radius: {
                    type: Number,
                    custom: true,
                    default: 25,
                },
                blur: {
                    type: Number,
                    custom: true,
                    default: 15,
                },
                max: {
                    type: Number,
                    custom: true,
                    default: 1.0,
                },
                visible: {
                    type: Boolean,
                    custom: true,
                    default: true,
                },
            };
            /* harmony default export */ var lib_vue_loader_options_Vue2LeafletHeatmapvue_type_script_lang_js_ = {
                name: "LHeatmap",
                props: props,
                data: function data() {
                    return {
                        ready: false,
                    };
                },
                mounted: function mounted() {
                    var options = {};

                    if (this.minOpacity) {
                        options.minOpacity = this.minOpacity;
                    }

                    if (this.maxZoom) {
                        options.maxZoom = this.maxZoom;
                    }

                    if (this.radius) {
                        options.radius = this.radius;
                    }

                    if (this.blur) {
                        options.blur = this.blur;
                    }

                    if (this.max) {
                        options.max = this.max;
                    }

                    this.mapObject = external_leaflet_default.a.heatLayer(this.latLng, options);
                    external_leaflet_default.a.DomEvent.on(this.mapObject, this.$listeners);
                    Object(external_vue2_leaflet_["propsBinder"])(this, this.mapObject, props);
                    this.ready = true;
                    this.parentContainer = Object(external_vue2_leaflet_["findRealParent"])(this.$parent);
                    this.parentContainer.addLayer(this, !this.visible);
                },
                beforeDestroy: function beforeDestroy() {
                    this.parentContainer.removeLayer(this);
                },
                methods: {
                    setMinOpacity: function setMinOpacity(newVal) {
                        this.mapObject.setOptions({
                            minOpacity: newVal,
                        });
                    },
                    setMaxZoom: function setMaxZoom(newVal) {
                        this.mapObject.setOptions({
                            maxZoom: newVal,
                        });
                    },
                    setRadius: function setRadius(newVal) {
                        this.mapObject.setOptions({
                            radius: newVal,
                        });
                    },
                    setBlur: function setBlur(newVal) {
                        this.mapObject.setOptions({
                            blur: newVal,
                        });
                    },
                    setMax: function setMax(newVal) {
                        this.mapObject.setOptions({
                            max: newVal,
                        });
                    },
                    setVisible: function setVisible(newVal, oldVal) {
                        if (newVal === oldVal) return;

                        if (newVal) {
                            this.parentContainer.addLayer(this);
                        } else {
                            this.parentContainer.removeLayer(this);
                        }
                    },
                    addLatLng: function addLatLng(value) {
                        this.mapObject.addLatLng(value);
                    },
                },
            };
            // CONCATENATED MODULE: ./Vue2LeafletHeatmap.vue?vue&type=script&lang=js&
            /* harmony default export */ var Vue2LeafletHeatmapvue_type_script_lang_js_ = lib_vue_loader_options_Vue2LeafletHeatmapvue_type_script_lang_js_;
            // EXTERNAL MODULE: ./Vue2LeafletHeatmap.vue?vue&type=style&index=0&lang=css&
            var Vue2LeafletHeatmapvue_type_style_index_0_lang_css_ = __webpack_require__("1628");

            // CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
            /* globals __VUE_SSR_CONTEXT__ */

            // IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
            // This module is a runtime utility for cleaner component module output and will
            // be included in the final webpack user bundle.

            function normalizeComponent(
                scriptExports,
                render,
                staticRenderFns,
                functionalTemplate,
                injectStyles,
                scopeId,
                moduleIdentifier /* server only */,
                shadowMode /* vue-cli only */
            ) {
                // Vue.extend constructor export interop
                var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;

                // render functions
                if (render) {
                    options.render = render;
                    options.staticRenderFns = staticRenderFns;
                    options._compiled = true;
                }

                // functional template
                if (functionalTemplate) {
                    options.functional = true;
                }

                // scopedId
                if (scopeId) {
                    options._scopeId = "data-v-" + scopeId;
                }

                var hook;
                if (moduleIdentifier) {
                    // server build
                    hook = function(context) {
                        // 2.3 injection
                        context =
                            context || // cached call
                            (this.$vnode && this.$vnode.ssrContext) || // stateful
                            (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                        // 2.2 with runInNewContext: true
                        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
                            context = __VUE_SSR_CONTEXT__;
                        }
                        // inject component styles
                        if (injectStyles) {
                            injectStyles.call(this, context);
                        }
                        // register component module identifier for async chunk inferrence
                        if (context && context._registeredComponents) {
                            context._registeredComponents.add(moduleIdentifier);
                        }
                    };
                    // used by ssr in case component is cached and beforeCreate
                    // never gets called
                    options._ssrRegister = hook;
                } else if (injectStyles) {
                    hook = shadowMode
                        ? function() {
                              injectStyles.call(this, this.$root.$options.shadowRoot);
                          }
                        : injectStyles;
                }

                if (hook) {
                    if (options.functional) {
                        // for template-only hot-reload because in that case the render fn doesn't
                        // go through the normalizer
                        options._injectStyles = hook;
                        // register for functioal component in vue file
                        var originalRender = options.render;
                        options.render = function renderWithStyleInjection(h, context) {
                            hook.call(context);
                            return originalRender(h, context);
                        };
                    } else {
                        // inject component registration as beforeCreate hook
                        var existing = options.beforeCreate;
                        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
                    }
                }

                return {
                    exports: scriptExports,
                    options: options,
                };
            }

            // CONCATENATED MODULE: ./Vue2LeafletHeatmap.vue

            /* normalize component */

            var component = normalizeComponent(
                Vue2LeafletHeatmapvue_type_script_lang_js_,
                render,
                staticRenderFns,
                false,
                null,
                null,
                null
            );

            component.options.__file = "Vue2LeafletHeatmap.vue";
            /* harmony default export */ var Vue2LeafletHeatmap = component.exports;
            // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js

            /* harmony default export */ var entry_lib = (__webpack_exports__["default"] = Vue2LeafletHeatmap);

            /***/
        },

        /******/
    }
)["default"];
//# sourceMappingURL=Vue2LeafletHeatmap.common.js.map
