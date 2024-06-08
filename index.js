/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var requestInterceptor = function (request) {
    var messages = request.body.messages.map(function (message) {
        var media = [];
        if (message.text) {
            media.push({
                kind: "text",
                content: message.text,
                location: "local",
            });
        }
        if (message.files) {
            for (var _i = 0, _a = message.files; _i < _a.length; _i++) {
                var file = _a[_i];
                if (!file.src || file.type === "any")
                    continue;
                media.push({
                    kind: file.type || "file",
                    content: file.src,
                    location: "local",
                });
            }
        }
        return { media: media };
    });
    return { body: { messages: messages } };
};
var responseInterceptor = function (message) {
    var text = message.media
        .filter(function (media) { return media.kind === "text"; })
        .map(function (media) { return media.content; })
        .join("\n");
    var files = message.media
        .filter(function (media) { return media.kind === "image" || media.kind === "audio"; })
        .map(function (media) { return ({
        type: media.kind,
        src: media.content,
    }); });
    return { text: text, files: files };
};
var mapApiMessage = function (message) {
    var role = message.participant.kind;
    return __assign({ role: role }, responseInterceptor(message));
};

function getOrCreateSession(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var res, data;
        var apiUrl = _b.apiUrl, token = _b.token;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch("".concat(apiUrl, "/api/v1/chat/start-chat-session?token=").concat(token), { method: "POST" })];
                case 1:
                    res = _c.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_c.sent());
                    return [2 /*return*/, data.sessionId];
            }
        });
    });
}
function listMessages(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var res, data;
        var apiUrl = _b.apiUrl, sessionId = _b.sessionId, token = _b.token;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch("".concat(apiUrl, "/api/v1/chat/session/").concat(sessionId, "/messages?token=").concat(token), { method: "GET" })];
                case 1:
                    res = _c.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_c.sent());
                    return [2 /*return*/, data];
            }
        });
    });
}

function initChat(root, _a) {
    var sessionId = _a.sessionId, apiUrl = _a.apiUrl, token = _a.token, wsUrl = _a.wsUrl;
    var elementRef = document.createElement("deep-chat");
    listMessages({ apiUrl: apiUrl, sessionId: sessionId, token: token }).then(function (_a) {
        var messages = _a.messages;
        for (var _i = 0, _b = messages.reverse(); _i < _b.length; _i++) {
            var message = _b[_i];
            elementRef._addMessage(mapApiMessage(message));
        }
    });
    elementRef.responseInterceptor = responseInterceptor;
    elementRef.requestInterceptor = requestInterceptor;
    elementRef.request = {
        url: "".concat(wsUrl, "/ws/chat?sessionId=").concat(sessionId),
        websocket: true,
    };
    elementRef.textInput = {
        placeholder: { text: "Chat with Pine Seed" },
    };
    elementRef.speechToText = {
        webSpeech: {
            language: "en-US",
        },
        commands: {
            resume: "resume",
        },
        button: {
            position: "inside-left",
        },
        displayInterimResults: true,
    };
    elementRef.audio = {
        button: {
            position: "dropup-menu",
        },
    };
    elementRef.images = {
        button: {
            position: "dropup-menu",
        },
    };
    elementRef.camera = {
        button: {
            position: "outside-right",
        },
    };
    elementRef.mixedFiles = {
        button: {
            position: "dropup-menu",
        },
    };
    // Setting value via a property (easiest way)
    // elementRef.initialMessages = [
    //   { role: "user", text: "Hey, how are you today?" },
    //   { role: "ai", text: "I am doing very well!" },
    // ];
    // elementRef.setAttribute(
    //   "introMessage",
    //   JSON.stringify({
    //     text: "JavaScript demo for the Deep Chat component.",
    //   }),
    // );
    elementRef.setAttribute("demo", "true");
    root.appendChild(elementRef);
}

function createWidget(root, options) {
    var style = document.createElement("style");
    style.innerHTML = styles;
    root.appendChild(style);
    // Widget
    var chatWidget = document.createElement("div");
    chatWidget.classList.add("chat-widget");
    chatWidget.classList.add("hidden");
    function onClickOpen() {
        var _a;
        if (chatWidget.getAttribute("initialized") !== "true") {
            (_a = chatWidget.init) === null || _a === void 0 ? void 0 : _a.call(chatWidget);
            chatWidget.setAttribute("initialized", "true");
        }
        chatWidget.classList.remove("hidden");
    }
    function onClickClose() {
        chatWidget.classList.add("hidden");
    }
    // Bubble
    var chatBubble = document.createElement("button");
    chatBubble.innerText = options.chatBubbleText;
    chatBubble.classList.add("chat-bubble");
    chatBubble.onclick = onClickOpen;
    // Toolbar
    var widgetToolbar = document.createElement("div");
    widgetToolbar.classList.add("chat-widget-toolbar");
    widgetToolbar.innerText = options.chatTitle;
    var closeWidgetButton = document.createElement("button");
    closeWidgetButton.innerHTML = "Close";
    closeWidgetButton.onclick = onClickClose;
    widgetToolbar.appendChild(closeWidgetButton);
    chatWidget.appendChild(widgetToolbar);
    // Append elements
    root.appendChild(chatWidget);
    root.appendChild(chatBubble);
    return chatWidget;
}
var styles = "\n.chat-bubble {\n  position: fixed;\n  bottom: 24px;\n  right: 24px;\n  width: 56px;\n  height: 56px;\n  background-color: #gfgfgf;\n  border-radius: 50%;\n  border: 1px solid #000;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  z-index: 1000;\n  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);\n  font: 14px Arial, sans-serif;\n  transition: border-color 1.0s;\n}\n\n.chat-bubble:hover {\n  border-color: #777;\n  transition: border-color 0.75s;\n}\n\n.chat-widget {\n  position: fixed;\n  bottom: 24px;\n  right: 24px;\n  width: fit-content;\n  height: fit-content;\n  background-color: #fff;\n  border-radius: 8px;\n  border: 1px solid #000;\n  z-index: 1001;\n  overflow: hidden;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n}\n\n.chat-widget.hidden {\n  display: none;\n}\n\n.chat-widget-toolbar {\n  background-color: #f0f0f0;\n  height: 48px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 16px;\n}\n";

window.addPineseedChat = function (args) {
    if (args === void 0) { args = {}; }
    var _a = args.apiUrl, apiUrl = _a === void 0 ? "https://api.pineseed.ai" : _a, _b = args.wsUrl, wsUrl = _b === void 0 ? "wss://api.pineseed.ai" : _b, token = args.token, _c = args.chatBubbleText, chatBubbleText = _c === void 0 ? "Chat" : _c, _d = args.chatTitle, chatTitle = _d === void 0 ? "Chat" : _d;
    if (!token) {
        return;
    }
    // create shadow DOM
    var root = document.createElement("div");
    document.body.appendChild(root);
    // const root = host.attachShadow({ mode: "open" });
    // add widget CSS
    var style = document.createElement("style");
    root.appendChild(style);
    var deepChatImport = document.createElement("script");
    deepChatImport.type = "module";
    deepChatImport.src = "https://unpkg.com/deep-chat@1.4.11/dist/deepChat.bundle.js";
    deepChatImport.onload = function () {
        var widget = createWidget(root, { chatBubbleText: chatBubbleText, chatTitle: chatTitle });
        widget.init = function () { return __awaiter(void 0, void 0, void 0, function () {
            var sessionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getOrCreateSession({ apiUrl: apiUrl, token: token })];
                    case 1:
                        sessionId = _a.sent();
                        initChat(widget, { sessionId: sessionId, wsUrl: wsUrl, token: token, apiUrl: apiUrl });
                        return [2 /*return*/];
                }
            });
        }); };
    };
    document.head.appendChild(deepChatImport);
};
//# sourceMappingURL=index.js.map
