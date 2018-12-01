/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "7548c29d58765a66dba6";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function(updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\n\t\t\t\"warning\",\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\n\t\t);\n\t\tunacceptedModules.forEach(function(moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function(moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds)\n\t\t\tlog(\n\t\t\t\t\"info\",\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\n\t\t\t);\n\t}\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog =\n\t\t(logLevel === \"info\" && level === \"info\") ||\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function(level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function(level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function(level) {\n\tlogLevel = level;\n};\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot\n\t\t\t\t.check(true)\n\t\t\t\t.then(function(updatedModules) {\n\t\t\t\t\tif (!updatedModules) {\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\t\tcheckForUpdate(true);\n\t\t\t\t})\n\t\t\t\t.catch(function(err) {\n\t\t\t\t\tvar status = module.hot.status();\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + (err.stack || err.message));\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t\t} else {\n\t\t\t\t\t\tlog(\n\t\t\t\t\t\t\t\"warning\",\n\t\t\t\t\t\t\t\"[HMR] Update failed: \" + (err.stack || err.message)\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?100\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst database_service_1 = __webpack_require__(/*! ./database/database.service */ \"./src/database/database.service.ts\");\nconst users_service_1 = __webpack_require__(/*! ./users/users.service */ \"./src/users/users.service.ts\");\nlet AppController = class AppController {\n    constructor(appService, databaseService, usersService, http) {\n        this.appService = appService;\n        this.databaseService = databaseService;\n        this.usersService = usersService;\n        this.http = http;\n    }\n    root(res) {\n        res.sendFile(path.resolve('./public/index.html'));\n    }\n    async seedDb(res) {\n        const rawUsers = await this.getDummyUsers(10);\n        const users = await this.appService.buildUsers(rawUsers);\n        await this.usersService.seedDb(users);\n        const result = await this.databaseService.getAllData();\n        res.send({ done: result });\n    }\n    async getDummyUsers(amount) {\n        return new Promise(resolve => {\n            this.http.get('https://randomuser.me/api/?results=' + amount).subscribe(users => {\n                resolve(users.data.results);\n            }, error => {\n                console.error(error);\n            });\n        });\n    }\n};\n__decorate([\n    common_1.Get(),\n    __param(0, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", void 0)\n], AppController.prototype, \"root\", null);\n__decorate([\n    common_1.Get('seed'),\n    __param(0, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], AppController.prototype, \"seedDb\", null);\nAppController = __decorate([\n    common_1.Controller(),\n    __metadata(\"design:paramtypes\", [app_service_1.AppService,\n        database_service_1.DatabaseService,\n        users_service_1.UsersService,\n        common_1.HttpService])\n], AppController);\nexports.AppController = AppController;\n\n\n//# sourceURL=webpack:///./src/app.controller.ts?");

/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst app_controller_1 = __webpack_require__(/*! ./app.controller */ \"./src/app.controller.ts\");\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\nconst NotFoundExeptionFilter_1 = __webpack_require__(/*! ./filters/NotFoundExeptionFilter */ \"./src/filters/NotFoundExeptionFilter.ts\");\nconst users_module_1 = __webpack_require__(/*! ./users/users.module */ \"./src/users/users.module.ts\");\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\nconst constans_1 = __webpack_require__(/*! ./constans/constans */ \"./src/constans/constans.ts\");\nconst database_module_1 = __webpack_require__(/*! ./database/database.module */ \"./src/database/database.module.ts\");\nconst back_office_module_1 = __webpack_require__(/*! ./backoffice/back-office.module */ \"./src/backoffice/back-office.module.ts\");\nconst auth_module_1 = __webpack_require__(/*! ./authentication/auth.module */ \"./src/authentication/auth.module.ts\");\nlet AppModule = class AppModule {\n};\nAppModule = __decorate([\n    common_1.Module({\n        imports: [\n            users_module_1.UsersModule,\n            database_module_1.DatabaseModule,\n            common_1.HttpModule,\n            back_office_module_1.BackOfficeModule,\n            mongoose_1.MongooseModule.forRootAsync({\n                useFactory: () => ({\n                    uri: constans_1.DB_URL,\n                }),\n            }),\n            auth_module_1.AuthModule,\n        ],\n        controllers: [\n            app_controller_1.AppController,\n        ],\n        providers: [\n            app_service_1.AppService,\n            {\n                provide: core_1.APP_FILTER,\n                useClass: NotFoundExeptionFilter_1.NotFoundExceptionFilter,\n            },\n        ],\n    })\n], AppModule);\nexports.AppModule = AppModule;\n\n\n//# sourceURL=webpack:///./src/app.module.ts?");

/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nlet AppService = class AppService {\n    root() {\n        return 'as';\n    }\n    async buildUsers(rawUsers) {\n        if (rawUsers) {\n            return new Promise(resolve => {\n                const usersArra = [];\n                rawUsers.forEach(rawUser => {\n                    const user = this.buildUser(rawUser);\n                    usersArra.push(user);\n                });\n                resolve(usersArra);\n            });\n        }\n    }\n    buildUser(user) {\n        try {\n            const name = user.login.username;\n            const password = user.login.password;\n            const creationDate = user.registered.date;\n            const lastLogin = new Date().toDateString();\n            const role = ['user'];\n            const email = user.email;\n            const texts = [];\n            return { name, password, email, creationDate, lastLogin, role, texts };\n        }\n        catch (e) {\n            console.error('AppService: buildUser', e);\n        }\n    }\n};\nAppService = __decorate([\n    common_1.Injectable()\n], AppService);\nexports.AppService = AppService;\n\n\n//# sourceURL=webpack:///./src/app.service.ts?");

/***/ }),

/***/ "./src/authentication/auth.controller.ts":
/*!***********************************************!*\
  !*** ./src/authentication/auth.controller.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst auth_service_1 = __webpack_require__(/*! ./auth.service */ \"./src/authentication/auth.service.ts\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/users/users.service.ts\");\nlet AuthController = class AuthController {\n    constructor(authService, usersService) {\n        this.authService = authService;\n        this.usersService = usersService;\n    }\n    async createToken(forUser) {\n        return await this.authService.createToken(forUser);\n    }\n    async login(user, response) {\n        const payload = await this.authService.login(user);\n        if (payload) {\n            await this.usersService.updateLoginDate(user.credentials);\n            response.status(200);\n            response.send(payload);\n        }\n        else {\n            response.status(401);\n            response.send({});\n        }\n    }\n    async verifyToken(token) {\n        const _user = await this.authService.validateToken(token)\n            .catch(error => {\n            console.error(error.name);\n            return false;\n        });\n        if (_user) {\n            await this.usersService.updateLoginDate(_user['name']);\n            return { tokenIsValid: true, message: '', _user };\n        }\n        else {\n            return { tokenIsValid: false, message: '', _user: null };\n        }\n    }\n    async signIn(user, response) {\n    }\n    findAll() {\n        return { message: 'OK' };\n    }\n    async signUp(user, response) {\n        const payload = await this.usersService.createUser({\n            name: user.name,\n            password: user.password,\n            role: ['user'],\n            email: user.email,\n        })\n            .then(newUser => {\n            this.authService.createToken({\n                name: newUser['name'],\n                id: newUser._id,\n                creationDate: newUser.creationDate,\n                role: newUser['role'],\n            })\n                .then(token => {\n                response.status(200);\n                response.send(token);\n            });\n        })\n            .catch(error => {\n            response.status(409);\n            response.send(error);\n        });\n    }\n};\n__decorate([\n    common_1.Get('token'),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"createToken\", null);\n__decorate([\n    common_1.Post('login'),\n    __param(0, common_1.Body()), __param(1, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"login\", null);\n__decorate([\n    common_1.Post('login/withtoken'),\n    __param(0, common_1.Body('token')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"verifyToken\", null);\n__decorate([\n    common_1.Post('signIn'),\n    __param(0, common_1.Body()), __param(1, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"signIn\", null);\n__decorate([\n    common_1.Get('data'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", void 0)\n], AuthController.prototype, \"findAll\", null);\n__decorate([\n    common_1.Post('signup'),\n    __param(0, common_1.Body('user')), __param(1, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], AuthController.prototype, \"signUp\", null);\nAuthController = __decorate([\n    common_1.Controller('auth'),\n    __metadata(\"design:paramtypes\", [auth_service_1.AuthService,\n        users_service_1.UsersService])\n], AuthController);\nexports.AuthController = AuthController;\n\n\n//# sourceURL=webpack:///./src/authentication/auth.controller.ts?");

/***/ }),

/***/ "./src/authentication/auth.module.ts":
/*!*******************************************!*\
  !*** ./src/authentication/auth.module.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst jwt_1 = __webpack_require__(/*! @nestjs/jwt */ \"@nestjs/jwt\");\nconst auth_service_1 = __webpack_require__(/*! ./auth.service */ \"./src/authentication/auth.service.ts\");\nconst jwt_strategy_1 = __webpack_require__(/*! ./jwt.strategy */ \"./src/authentication/jwt.strategy.ts\");\nconst users_module_1 = __webpack_require__(/*! ../users/users.module */ \"./src/users/users.module.ts\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst constans_1 = __webpack_require__(/*! ../constans/constans */ \"./src/constans/constans.ts\");\nconst auth_controller_1 = __webpack_require__(/*! ./auth.controller */ \"./src/authentication/auth.controller.ts\");\nlet AuthModule = class AuthModule {\n};\nAuthModule = __decorate([\n    common_1.Module({\n        imports: [\n            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),\n            jwt_1.JwtModule.register({\n                secretOrPrivateKey: constans_1.jwtSecretKey,\n                signOptions: {\n                    expiresIn: 3600,\n                },\n            }),\n            users_module_1.UsersModule,\n        ],\n        controllers: [\n            auth_controller_1.AuthController,\n        ],\n        providers: [\n            auth_service_1.AuthService,\n            jwt_strategy_1.JwtStrategy,\n        ],\n        exports: [],\n    })\n], AuthModule);\nexports.AuthModule = AuthModule;\n\n\n//# sourceURL=webpack:///./src/authentication/auth.module.ts?");

/***/ }),

/***/ "./src/authentication/auth.service.ts":
/*!********************************************!*\
  !*** ./src/authentication/auth.service.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst constans_1 = __webpack_require__(/*! ../constans/constans */ \"./src/constans/constans.ts\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/users/users.service.ts\");\nlet AuthService = class AuthService {\n    constructor(usersService) {\n        this.usersService = usersService;\n    }\n    async createToken(forUser) {\n        return new Promise((res, rej) => {\n            const accessToken = jwt.sign(forUser, constans_1.jwtSecretKey, { expiresIn: constans_1.tokenExpirationTime });\n            res({\n                expiresIn: constans_1.tokenExpirationTime,\n                accessToken,\n            });\n        });\n    }\n    async decodeToken(token) {\n        return new Promise((res, rej) => {\n            jwt.verify(token, constans_1.jwtSecretKey, (err, decoded) => {\n                if (err) {\n                    rej(err);\n                }\n                else {\n                    res(decoded);\n                }\n            });\n        });\n    }\n    validateUser(payload) {\n        return {};\n    }\n    async validateToken(token) {\n        return new Promise((res, rej) => {\n            jwt.verify(token, constans_1.jwtSecretKey, (err, decoded) => {\n                if (err) {\n                    rej(err);\n                }\n                else {\n                    res(decoded);\n                }\n            });\n        });\n    }\n    async login(user) {\n        const userIsValidated = await this.validateCredentials(user.credentials, user.password);\n        const userModel = await this.usersService.findOneByName(user.credentials);\n        if (userIsValidated && userModel) {\n            const _user = {\n                name: userModel.name,\n                id: userModel._id,\n                creationDate: userModel.creationDate,\n                role: userModel.role,\n            };\n            const token = await this.createToken(_user);\n            return { token, _user };\n        }\n        else {\n            return false;\n        }\n    }\n    async validateCredentials(credentials, password) {\n        console.log('validate user: ', credentials, password);\n        const userModel = await this.usersService.findOneByName(credentials);\n        if (userModel) {\n            const passwordIsValid = await userModel.comparePassword(password);\n            return passwordIsValid;\n        }\n        return false;\n    }\n};\nAuthService = __decorate([\n    common_1.Injectable(),\n    __metadata(\"design:paramtypes\", [users_service_1.UsersService])\n], AuthService);\nexports.AuthService = AuthService;\n\n\n//# sourceURL=webpack:///./src/authentication/auth.service.ts?");

/***/ }),

/***/ "./src/authentication/jwt.strategy.ts":
/*!********************************************!*\
  !*** ./src/authentication/jwt.strategy.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst passport_jwt_1 = __webpack_require__(/*! passport-jwt */ \"passport-jwt\");\nconst auth_service_1 = __webpack_require__(/*! ./auth.service */ \"./src/authentication/auth.service.ts\");\nconst constans_1 = __webpack_require__(/*! ../constans/constans */ \"./src/constans/constans.ts\");\nlet JwtStrategy = class JwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy) {\n    constructor(authService) {\n        super({\n            jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader('authorization'),\n            secretOrKey: constans_1.jwtSecretKey,\n        });\n        this.authService = authService;\n    }\n    async validate(payload) {\n        const user = await this.authService.validateUser(payload);\n        if (!user) {\n            throw new common_1.UnauthorizedException();\n        }\n        return user;\n    }\n};\nJwtStrategy = __decorate([\n    common_1.Injectable(),\n    __metadata(\"design:paramtypes\", [auth_service_1.AuthService])\n], JwtStrategy);\nexports.JwtStrategy = JwtStrategy;\n\n\n//# sourceURL=webpack:///./src/authentication/jwt.strategy.ts?");

/***/ }),

/***/ "./src/authentication/roles.decorator.ts":
/*!***********************************************!*\
  !*** ./src/authentication/roles.decorator.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nexports.Roles = (...roles) => common_1.ReflectMetadata('roles', roles);\n\n\n//# sourceURL=webpack:///./src/authentication/roles.decorator.ts?");

/***/ }),

/***/ "./src/authentication/roles.guard.ts":
/*!*******************************************!*\
  !*** ./src/authentication/roles.guard.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst constans_1 = __webpack_require__(/*! ../constans/constans */ \"./src/constans/constans.ts\");\nlet RolesGuard = class RolesGuard {\n    constructor(reflector) {\n        this.reflector = reflector;\n    }\n    async canActivate(context) {\n        const roles = this.reflector.get('roles', context.getHandler());\n        if (!roles) {\n            return false;\n        }\n        const request = context.switchToHttp().getRequest();\n        const header = request.headers;\n        const token = header.authorization;\n        const decodedUser = await this.decodeToken(token);\n        const hasRole = () => decodedUser.role.some((rol) => roles.includes(rol));\n        return decodedUser && decodedUser.role && hasRole();\n    }\n    async decodeToken(token) {\n        return new Promise((res, rej) => {\n            jwt.verify(token, constans_1.jwtSecretKey, (err, decoded) => {\n                if (err) {\n                    rej(err);\n                }\n                else {\n                    res(decoded);\n                }\n            });\n        });\n    }\n};\nRolesGuard = __decorate([\n    common_1.Injectable(),\n    __metadata(\"design:paramtypes\", [core_1.Reflector])\n], RolesGuard);\nexports.RolesGuard = RolesGuard;\n\n\n//# sourceURL=webpack:///./src/authentication/roles.guard.ts?");

/***/ }),

/***/ "./src/backoffice/back-office.controller.ts":
/*!**************************************************!*\
  !*** ./src/backoffice/back-office.controller.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/users/users.service.ts\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst roles_guard_1 = __webpack_require__(/*! ../authentication/roles.guard */ \"./src/authentication/roles.guard.ts\");\nconst roles_decorator_1 = __webpack_require__(/*! ../authentication/roles.decorator */ \"./src/authentication/roles.decorator.ts\");\nlet BackOfficeController = class BackOfficeController {\n    constructor(userService) {\n        this.userService = userService;\n    }\n    async returnAllUsers() {\n        return await this.userService.getAllUsers();\n    }\n    async deleteUser(id, responce) {\n        const deleted = await this.userService.deleteUser(id);\n        if (deleted) {\n            responce.send(await this.userService.deleteUser(id));\n        }\n        else {\n            responce.status(404);\n            responce.send();\n        }\n    }\n    async searchForUser(name, responce) {\n        responce.send(await this.userService.getUserByNamePart(name));\n    }\n};\n__decorate([\n    common_1.Get('allUsers'),\n    roles_decorator_1.Roles('admin', 'admin-super'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt'), roles_guard_1.RolesGuard),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", Promise)\n], BackOfficeController.prototype, \"returnAllUsers\", null);\n__decorate([\n    common_1.Put('deleteuser'),\n    __param(0, common_1.Body('id')), __param(1, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, Object]),\n    __metadata(\"design:returntype\", Promise)\n], BackOfficeController.prototype, \"deleteUser\", null);\n__decorate([\n    common_1.Post('searchuser'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt')),\n    __param(0, common_1.Body('name')), __param(1, common_1.Res()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, Object]),\n    __metadata(\"design:returntype\", Promise)\n], BackOfficeController.prototype, \"searchForUser\", null);\nBackOfficeController = __decorate([\n    common_1.Controller('backoffice'),\n    __metadata(\"design:paramtypes\", [users_service_1.UsersService])\n], BackOfficeController);\nexports.BackOfficeController = BackOfficeController;\n\n\n//# sourceURL=webpack:///./src/backoffice/back-office.controller.ts?");

/***/ }),

/***/ "./src/backoffice/back-office.module.ts":
/*!**********************************************!*\
  !*** ./src/backoffice/back-office.module.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst back_office_controller_1 = __webpack_require__(/*! ./back-office.controller */ \"./src/backoffice/back-office.controller.ts\");\nconst users_module_1 = __webpack_require__(/*! ../users/users.module */ \"./src/users/users.module.ts\");\nconst users_service_1 = __webpack_require__(/*! ../users/users.service */ \"./src/users/users.service.ts\");\nconst auth_module_1 = __webpack_require__(/*! ../authentication/auth.module */ \"./src/authentication/auth.module.ts\");\nlet BackOfficeModule = class BackOfficeModule {\n};\nBackOfficeModule = __decorate([\n    common_1.Module({\n        imports: [\n            users_module_1.UsersModule,\n            auth_module_1.AuthModule,\n        ],\n        controllers: [back_office_controller_1.BackOfficeController],\n        providers: [users_service_1.UsersService],\n    })\n], BackOfficeModule);\nexports.BackOfficeModule = BackOfficeModule;\n\n\n//# sourceURL=webpack:///./src/backoffice/back-office.module.ts?");

/***/ }),

/***/ "./src/constans/constans.ts":
/*!**********************************!*\
  !*** ./src/constans/constans.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.catModelToken = 'CatModelToken';\nexports.dbConnectionToken = 'DbConnectionToken';\nexports.jwtSecretKey = 'secretKey';\nexports.tokenExpirationTime = 36000;\nexports.DB_URL = 'mongodb://localhost/writer';\nexports.USER_PASSWORD_SALT = 'hoj=dich,yIt+moM+aylj{Yer}ok(aJ*';\n\n\n//# sourceURL=webpack:///./src/constans/constans.ts?");

/***/ }),

/***/ "./src/database/database.module.ts":
/*!*****************************************!*\
  !*** ./src/database/database.module.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\nconst database_service_1 = __webpack_require__(/*! ./database.service */ \"./src/database/database.service.ts\");\nconst user_schema_1 = __webpack_require__(/*! ../users/user.schema */ \"./src/users/user.schema.ts\");\nconst text_schema_1 = __webpack_require__(/*! ../text/text.schema */ \"./src/text/text.schema.ts\");\nlet DatabaseModule = class DatabaseModule {\n};\nDatabaseModule = __decorate([\n    common_1.Module({\n        imports: [mongoose_1.MongooseModule.forFeature([\n                user_schema_1.User,\n                text_schema_1.Text,\n            ])],\n        providers: [database_service_1.DatabaseService],\n        exports: [database_service_1.DatabaseService],\n    })\n], DatabaseModule);\nexports.DatabaseModule = DatabaseModule;\n\n\n//# sourceURL=webpack:///./src/database/database.module.ts?");

/***/ }),

/***/ "./src/database/database.service.ts":
/*!******************************************!*\
  !*** ./src/database/database.service.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\nlet DatabaseService = class DatabaseService {\n    constructor(User, Text) {\n        this.User = User;\n        this.Text = Text;\n    }\n    async saveUser(user) {\n        return new Promise((res, rej) => {\n            user.save().then(_user => {\n                res(_user);\n            })\n                .catch(err => {\n                rej(err.errmsg);\n            });\n        });\n    }\n    async getPassword(forUserId) {\n        const user = await this.User.findById(forUserId);\n        return user['password'];\n    }\n    async getUserWithName(name) {\n        return this.User.findOne({ name }).catch(err => {\n            console.log('No user found with name: ' + name, err);\n            return null;\n        });\n    }\n    async searchForUserName(name) {\n        return this.User.find({ name: { $regex: name, $options: 'i' } });\n    }\n    async getUsersWithText() {\n        return await this.User.find()\n            .populate('texts');\n    }\n    async findeUserByName(name) {\n        return this.User.findOne({ name });\n    }\n    async deleteUser(id) {\n        return this.User.findByIdAndRemove({ _id: id });\n    }\n    async removeUser() {\n        return await this.User.find({ name: 'TestUser_1' }).remove();\n    }\n    async getAllData() {\n        return this.getUserList();\n    }\n    async getUserList() {\n        return await this.User.find({}, {\n            name: 1,\n            lastLogin: 1,\n            creationDate: 1,\n            role: 1,\n            email: 1,\n        });\n    }\n};\nDatabaseService = __decorate([\n    common_1.Injectable(),\n    __param(0, mongoose_2.InjectModel('user')),\n    __param(1, mongoose_2.InjectModel('text')),\n    __metadata(\"design:paramtypes\", [mongoose_1.Model,\n        mongoose_1.Model])\n], DatabaseService);\nexports.DatabaseService = DatabaseService;\n\n\n//# sourceURL=webpack:///./src/database/database.service.ts?");

/***/ }),

/***/ "./src/filters/NotFoundExeptionFilter.ts":
/*!***********************************************!*\
  !*** ./src/filters/NotFoundExeptionFilter.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst path = __webpack_require__(/*! path */ \"path\");\nlet NotFoundExceptionFilter = class NotFoundExceptionFilter {\n    catch(exception, host) {\n        const ctx = host.switchToHttp();\n        const response = ctx.getResponse();\n        const request = ctx.getRequest();\n        const status = exception.getStatus();\n        response.sendFile(path.resolve('./public/index.html'));\n    }\n};\nNotFoundExceptionFilter = __decorate([\n    common_1.Catch(common_1.NotFoundException)\n], NotFoundExceptionFilter);\nexports.NotFoundExceptionFilter = NotFoundExceptionFilter;\n\n\n//# sourceURL=webpack:///./src/filters/NotFoundExeptionFilter.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\nconst app_module_1 = __webpack_require__(/*! ./app.module */ \"./src/app.module.ts\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst path = __webpack_require__(/*! path */ \"path\");\nasync function bootstrap() {\n    const app = await core_1.NestFactory.create(app_module_1.AppModule);\n    app.useGlobalPipes(new common_1.ValidationPipe());\n    app.useStaticAssets(path.resolve('./public'));\n    await app.listen(3000);\n    if (true) {\n        module.hot.accept();\n        module.hot.dispose(() => app.close());\n    }\n}\nbootstrap();\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/text/text.schema.ts":
/*!*********************************!*\
  !*** ./src/text/text.schema.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nexports.TextSchema = new mongoose.Schema({\n    confData: {\n        creationData: String,\n        editData: String,\n        fontFamily: String,\n        id: Number,\n        fontSize: Number,\n    },\n    value: String,\n});\nexports.Text = { name: 'text', schema: exports.TextSchema };\n\n\n//# sourceURL=webpack:///./src/text/text.schema.ts?");

/***/ }),

/***/ "./src/users/dto/create-user.dto.ts":
/*!******************************************!*\
  !*** ./src/users/dto/create-user.dto.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass CreateUserDto {\n}\nexports.CreateUserDto = CreateUserDto;\n\n\n//# sourceURL=webpack:///./src/users/dto/create-user.dto.ts?");

/***/ }),

/***/ "./src/users/user.schema.ts":
/*!**********************************!*\
  !*** ./src/users/user.schema.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst text_schema_1 = __webpack_require__(/*! ../text/text.schema */ \"./src/text/text.schema.ts\");\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nconst UserSchema = new mongoose_1.Schema({\n    name: {\n        unique: true,\n        type: String,\n        validate: {\n            validator: (name) => name.length > 2,\n            message: (props) => 'Name must be at least 2 character long!',\n        },\n        required: [true, 'User name is required!'],\n    },\n    texts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: text_schema_1.Text.name }],\n    creationDate: String,\n    email: {\n        type: String,\n        required: [true, 'User name is required!'],\n    },\n    lastLogin: String,\n    password: String,\n    role: [String],\n});\nUserSchema.virtual('textCount').get(function () {\n    return this.texts.length;\n});\nUserSchema.pre('save', function (next) {\n    next();\n});\nUserSchema.methods.comparePassword = function (candidatePassword) {\n    return new Promise((resolve, reject) => {\n        const user = this;\n        console.log(user.name);\n        console.log(user.password);\n        const password = user['password'];\n        bcrypt.compare(candidatePassword, password)\n            .then(isMatch => {\n            resolve(isMatch);\n        })\n            .catch(err => {\n            reject(err);\n        });\n    });\n};\nUserSchema.pre('remove', function (next) {\n    const TextModel = mongoose_1.default.model('text');\n    next();\n});\nexports.User = { name: 'user', schema: UserSchema };\n\n\n//# sourceURL=webpack:///./src/users/user.schema.ts?");

/***/ }),

/***/ "./src/users/users.controller.ts":
/*!***************************************!*\
  !*** ./src/users/users.controller.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst users_service_1 = __webpack_require__(/*! ./users.service */ \"./src/users/users.service.ts\");\nconst create_user_dto_1 = __webpack_require__(/*! ./dto/create-user.dto */ \"./src/users/dto/create-user.dto.ts\");\nconst passport_1 = __webpack_require__(/*! @nestjs/passport */ \"@nestjs/passport\");\nconst jwt_1 = __webpack_require__(/*! @nestjs/jwt */ \"@nestjs/jwt\");\nlet UsersController = class UsersController {\n    constructor(userService, jwtService) {\n        this.userService = userService;\n        this.jwtService = jwtService;\n    }\n    async create(response, user) {\n        const testUser = { name: 'some', password: 'abc' };\n        const userInserted = await this.userService.insertInDB(testUser);\n        if (userInserted) {\n            response.send(userInserted);\n        }\n        else {\n            response.status(422);\n            response.send(new Error());\n        }\n    }\n    async getUsersTexts(token) {\n        const user = this.jwtService.verify(token);\n        const texts = await this.userService.getTexts(user.id);\n        return texts;\n    }\n    async removeText(textId, token) {\n        const jwtObject = this.jwtService.decode(token, { complete: true });\n        return await this.userService.deleteText(jwtObject['payload']['id'], textId);\n    }\n    async createText(token) {\n        const user = this.jwtService.verify(token);\n        const texts = await this.userService.createNewText(user.id);\n        return texts;\n    }\n    async save(text) {\n        return await this.userService.updateText(text);\n    }\n};\n__decorate([\n    common_1.Post('create'),\n    __param(0, common_1.Res()), __param(1, common_1.Body('user')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, create_user_dto_1.CreateUserDto]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"create\", null);\n__decorate([\n    common_1.Get('texts'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt')),\n    __param(0, common_1.Headers('authorization')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"getUsersTexts\", null);\n__decorate([\n    common_1.Delete('texts/delete/:textId'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt')),\n    __param(0, common_1.Param('textId')), __param(1, common_1.Headers('authorization')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object, Object]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"removeText\", null);\n__decorate([\n    common_1.Get('texts/create'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt')),\n    __param(0, common_1.Headers('authorization')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"createText\", null);\n__decorate([\n    common_1.Post('texts/update'),\n    common_1.UseGuards(passport_1.AuthGuard('jwt')),\n    __param(0, common_1.Body()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", Promise)\n], UsersController.prototype, \"save\", null);\nUsersController = __decorate([\n    common_1.Controller('users'),\n    __metadata(\"design:paramtypes\", [users_service_1.UsersService, jwt_1.JwtService])\n], UsersController);\nexports.UsersController = UsersController;\n\n\n//# sourceURL=webpack:///./src/users/users.controller.ts?");

/***/ }),

/***/ "./src/users/users.module.ts":
/*!***********************************!*\
  !*** ./src/users/users.module.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst users_service_1 = __webpack_require__(/*! ./users.service */ \"./src/users/users.service.ts\");\nconst users_controller_1 = __webpack_require__(/*! ./users.controller */ \"./src/users/users.controller.ts\");\nconst user_schema_1 = __webpack_require__(/*! ./user.schema */ \"./src/users/user.schema.ts\");\nconst text_schema_1 = __webpack_require__(/*! ./../text/text.schema */ \"./src/text/text.schema.ts\");\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\nconst database_module_1 = __webpack_require__(/*! ../database/database.module */ \"./src/database/database.module.ts\");\nconst jwt_1 = __webpack_require__(/*! @nestjs/jwt */ \"@nestjs/jwt\");\nconst constans_1 = __webpack_require__(/*! ../constans/constans */ \"./src/constans/constans.ts\");\nlet UsersModule = class UsersModule {\n};\nUsersModule = __decorate([\n    common_1.Module({\n        imports: [\n            mongoose_1.MongooseModule.forFeature([user_schema_1.User, text_schema_1.Text]),\n            database_module_1.DatabaseModule,\n            jwt_1.JwtModule.register({\n                secretOrPrivateKey: constans_1.jwtSecretKey,\n                signOptions: {\n                    expiresIn: 3600,\n                },\n            }),\n        ],\n        controllers: [users_controller_1.UsersController],\n        providers: [\n            users_service_1.UsersService,\n        ],\n        exports: [users_service_1.UsersService],\n    })\n], UsersModule);\nexports.UsersModule = UsersModule;\n\n\n//# sourceURL=webpack:///./src/users/users.module.ts?");

/***/ }),

/***/ "./src/users/users.service.ts":
/*!************************************!*\
  !*** ./src/users/users.service.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\nconst database_service_1 = __webpack_require__(/*! ../database/database.service */ \"./src/database/database.service.ts\");\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\nlet UsersService = class UsersService {\n    constructor(User, Text, databaseService) {\n        this.User = User;\n        this.Text = Text;\n        this.databaseService = databaseService;\n    }\n    async create(createUserDto) {\n        const newUser = new this.User(createUserDto);\n        return await newUser.save();\n    }\n    async findOneByToken(token) {\n    }\n    async deleteText(userId, textId) {\n        const deleted = await this.User.updateOne({ _id: userId }, { $pull: { texts: { $in: textId } } });\n        return deleted;\n    }\n    async getTexts(forUserId) {\n        const user = await this.User.findOne({ _id: forUserId }).populate('texts');\n        return user.texts;\n    }\n    async updateText(text) {\n        const updated = await await this.Text.updateOne({ _id: text._id }, { $set: {\n                confData: {\n                    editData: text.confData.editData,\n                    fontFamily: text.confData.fontFamily,\n                    fontSize: text.confData.fontSize,\n                },\n                value: text.value,\n            } });\n        return updated;\n    }\n    async createNewText(forUserWithId) {\n        const newText = new this.Text({\n            confData: {\n                creationData: new Date().toDateString(),\n                editData: new Date().toDateString(),\n                id: new Date().getTime(),\n                fontFamily: 'Helvetica',\n                fontSize: 16,\n            },\n            value: '<p><br></p>',\n        });\n        const text = await newText.save();\n        await this.User.updateOne({ _id: forUserWithId }, { $push: { texts: text._id } });\n        return text;\n    }\n    async insertInDB(createUserDto) {\n        const userExist = await this.User.findOne({ name: createUserDto.name });\n        let userCreated;\n        if (!userExist) {\n            userCreated = await this.create(createUserDto);\n        }\n        return userCreated ? true : false;\n    }\n    async updateLoginDate(forUserName) {\n        const date = new Date().toDateString();\n        const time = new Date().toTimeString().slice(0, 8);\n        const timeString = date + ' ' + time;\n        return await this.User.updateOne({ name: forUserName }, { $set: { lastLogin: timeString } });\n    }\n    async encodePassword(password) {\n        return new Promise((resolve, reject) => {\n            bcrypt.genSalt(10)\n                .then(salt => {\n                bcrypt.hash(password, salt)\n                    .then(hash => {\n                    resolve(hash);\n                })\n                    .catch(err => {\n                    console.error(err);\n                });\n            })\n                .catch((err) => {\n                console.error(err);\n            });\n        });\n    }\n    async createUser(user) {\n        return new Promise((res, rej) => {\n            const date = new Date().toDateString();\n            const time = new Date().toTimeString().slice(0, 8);\n            const creationDate = date + ' ' + time;\n            const textModel = new this.Text({\n                confData: {\n                    creationData: new Date().toDateString(),\n                    id: new Date().getTime() + 2,\n                    editData: new Date().toDateString(),\n                    fontFamily: 'Lucida Sans Typewriter',\n                    fontSize: 16,\n                },\n                value: '<p>Test text</p>',\n            });\n            textModel.save()\n                .then((text) => {\n                const lastLogin = '---';\n                const userModel = new this.User({\n                    name: user.name,\n                    password: user.password,\n                    creationDate: creationDate,\n                    lastLogin: lastLogin,\n                    texts: text._id,\n                    role: user.role,\n                    email: user.email,\n                });\n                this.encodePassword(userModel['password']).then(hashedPassword => {\n                    userModel['password'] = hashedPassword;\n                    this.databaseService.saveUser(userModel)\n                        .then(_user => {\n                        res(_user);\n                    })\n                        .catch(err => { rej(err); });\n                });\n            }).catch();\n        });\n    }\n    async comparePassword(userName, passwordCandidat) {\n        const user = await this.User.findOne({ name: userName });\n        return await user.comparePassword(passwordCandidat);\n    }\n    async getUserByNamePart(name) {\n        return this.databaseService.searchForUserName(name);\n    }\n    async findOneByName(name) {\n        return await this.databaseService.findeUserByName(name);\n    }\n    async deleteUser(id) {\n        return this.databaseService.deleteUser(id);\n    }\n    async getAllUsers() {\n        return this.databaseService.getUserList();\n    }\n    async decodeUsers(users) {\n    }\n    async seedDb(users) {\n        if (users) {\n            const savePromises = [];\n            const res = await this.User.find();\n            if (res.length > 0) {\n                await this.User.collection.drop().catch(err => {\n                    console.error(err);\n                });\n            }\n            const text = await this.Text.find();\n            if (text.length > 0) {\n                await this.Text.collection.drop().catch(err => {\n                    console.error(err);\n                });\n            }\n            const testUser = {\n                name: 'stanis',\n                texts: [],\n                creationDate: new Date().toDateString(),\n                lastLogin: new Date().toDateString(),\n                password: 'abc',\n                email: 'stanip@hotmmail.de',\n                role: ['admin', 'user'],\n            };\n            savePromises.push(this.createUser(testUser));\n            users.forEach((user, index) => {\n                const newUser = new this.User(user);\n                savePromises.push(this.createUser(newUser)\n                    .catch(err => {\n                    console.error('seed users error: ', err);\n                }));\n            });\n            return await Promise.all(savePromises);\n        }\n    }\n};\nUsersService = __decorate([\n    common_1.Injectable(),\n    __param(0, mongoose_2.InjectModel('user')),\n    __param(1, mongoose_2.InjectModel('text')),\n    __metadata(\"design:paramtypes\", [mongoose_1.Model,\n        mongoose_1.Model,\n        database_service_1.DatabaseService])\n], UsersService);\nexports.UsersService = UsersService;\n\n\n//# sourceURL=webpack:///./src/users/users.service.ts?");

/***/ }),

/***/ 0:
/*!************************************************!*\
  !*** multi webpack/hot/poll?100 ./src/main.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?100 */\"./node_modules/webpack/hot/poll.js?100\");\nmodule.exports = __webpack_require__(/*! ./src/main.ts */\"./src/main.ts\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/common\");\n\n//# sourceURL=webpack:///external_%22@nestjs/common%22?");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/core\");\n\n//# sourceURL=webpack:///external_%22@nestjs/core%22?");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/jwt\");\n\n//# sourceURL=webpack:///external_%22@nestjs/jwt%22?");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/mongoose\");\n\n//# sourceURL=webpack:///external_%22@nestjs/mongoose%22?");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/passport\");\n\n//# sourceURL=webpack:///external_%22@nestjs/passport%22?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcrypt\");\n\n//# sourceURL=webpack:///external_%22bcrypt%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-jwt\");\n\n//# sourceURL=webpack:///external_%22passport-jwt%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });