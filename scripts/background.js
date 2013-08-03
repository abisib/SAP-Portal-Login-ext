window.portalLogin = {};
(function(){
	chrome.webRequest.onBeforeRequest.addListener(function(details) {
		if (details.method == "POST") {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendMessage(tab.id, {
					portal : 'getPortal'
				}, function(response) {
					if (response.userName) {
						var newName = response.userName.toLowerCase(),
							newPass = response.userPass,
							host = response.host,
							myPort = response.port,
							fullUrl = response.url;
						addServerToStorage(host, myPort, fullUrl, newName, newPass);			
					}	
				});
			});
		}
	}, {
		urls : ["http://*/*", "https://*/*"]
	}, ["blocking"]); 
	
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.getUser == 'quickLogin') {
			var allUsers = JSON.parse(localStorage.getItem('portalUsers')), quickLogin = allUsers.user1;
			sendResponse(quickLogin);
			addServerToStorage(request.host, request.port, request.fullUrl, allUsers.user1.name, allUsers.user1.password);
		} 
	});
	
	function addUserToStorage(userName, userPass, usersObj) {
		if (userName && userName != "") {
			var newName = userName.toLowerCase(), newPass = userPass, allUsers = usersObj, exists = false, existingUserId = "",result;
			for (userId in allUsers) {
				if (allUsers[userId].name.toLowerCase() == newName && allUsers[userId].password == newPass) {
					exists = true;
					existingUserId = userId;
				}
				if (allUsers[userId].name.toLowerCase() == newName && allUsers[userId].password != newPass) {
					exists = false;
					existingUserId = userId;
				}
			}
			if (exists == false) {
				var userArr = JSON.stringify(allUsers).match(/user/g), userNum = userArr.length + 1,userId = ";";
				if (existingUserId == "") {
					userId = 'user' + userNum;
				} else {
					userId = existingUserId;
				}
				allUsers[userId] = {};
				allUsers[userId].name = newName;
				allUsers[userId].password = newPass;
				result = allUsers;
			} else {
				result = false;
			}
			return result;
		}
	}
	
	function addServerToStorage(host, port, fullUrl, userName, userPass) {
		var allServersString = localStorage.getItem('portalServers'),
			allServers = JSON.parse(allServersString),
			serverNum = 0;
		//check how many servers we already have in the current local storage and give the new server it's number.
		if (allServersString != undefined && allServersString != "[]") {
			serverNum = allServers.length +1;
		} else {
			serverNum = 1;
		}
		//creating the new server array and object
			var newServerArr = [serverNum], newServerObj = {
				'id' : serverNum,
				'host' : getServerName(host),
				'port' : port,
				'fullUrl' : fullUrl,
				'users' : {
					user1 : {
						name : userName,
						password : userPass
					}
				}
			}; 
	
		newServerArr[1] = newServerObj;
		//if there are already some servers in the local storage we have to work with the existing local sorage. 
		//if not, we assign the current server to be the first in the local storage.
		if (allServers[0]) {
			var exists = false,
				existingServerId = "",
				i;
			//loop through the existing local storage to see if the current machine is new or not.
			for (i = 0; i < allServers.length; i++) {
				if (host.indexOf(allServers[i][1].host) != -1 && allServers[i][1].port == port) {
					exists = true
					existingServerId = i+1;
					break; //in case we find a match there is no point to continue with the loop.
				}
			}
			if (exists == false) {
				//if the current server doesn't exist in the local storage we check how many machines already exist and act by that.
				if (allServers.length >=30){
					allServers[30] = newServerArr;
				}else{
					allServers[serverNum - 1] = [serverNum,newServerObj];
					localStorage.setItem('portalServers', JSON.stringify(allServers));
				}
				portalLogin.setServerToFirst(serverNum);
			}else if (existingServerId != "") {
				//if the machine exists, we only update it's users object and set it to first in the server list.
				var machineUsers = allServers[existingServerId -1][1].users,
					addUserResult = addUserToStorage(userName, userPass, machineUsers);
				if (addUserResult != false) {
					allServers[existingServerId-1][1].users = addUserResult;
					localStorage.setItem('portalServers', JSON.stringify(allServers));
				}
				portalLogin.setServerToFirst(existingServerId);
			}
		} else {
			//if there are no servers in the local storage we assign the current server to be the first server.
			allServers[0]= newServerArr;
			localStorage.setItem('portalServers', JSON.stringify(allServers));
		}
	}
	
	portalLogin.setServerToFirst = function setServerToFirst(serverToMoveId){
		if (serverToMoveId != 1){
			var allServersArr = JSON.parse(localStorage.getItem('portalServers')),
				serverArr = allServersArr[serverToMoveId-1];
			allServersArr.splice(serverToMoveId-1,1);
			serverArr[1].id = 1;
			serverArr[0] = 1;
			for (var i = 0;i<allServersArr.length;i++){
				allServersArr[i][0] = i+2;
				allServersArr[i][1].id = i+2;
			}
			allServersArr.push(serverArr);
			allServersArr.sort(function(a,b){return a[0]-b[0]});
			localStorage.setItem('portalServers', JSON.stringify(allServersArr));
		}
	};
	
	function getServerName(hostName) {
		var cutPosition;
		if (hostName.indexOf('.') != -1){
			cutPosition = hostName.indexOf('.');
		} else{
			cutPosition = hostName.indexOf(':') 
		}
		var host = hostName.substring(0, cutPosition);
		return host;
	}
	
	function setInitialStorage() {
		if (localStorage.getItem('portalUsers') == null || localStorage.getItem('portalUsers') == "") {
			var usersObj = {
				"user1" : {
					"administrator" : "abcd1234"
				},
				"user2" : {
					"a" : "q1234"
				},
				"user3" : {
					"sanityuser" : "abcd1234"
				}
			};
			localStorage.setItem("portalUsers", JSON.stringify(initialContent.portalUsers));
			localStorage.setItem("portalLinks", JSON.stringify(initialContent.portalLinks));
			localStorage.setItem("portalServers", '[]');
		}else{
			localStorage.setItem("portalLinks", JSON.stringify(initialContent.portalLinks));
		}
	}
	
	var initialContent = {
		portalUsers : {
			"user1" : {
				"name" : "administrator",
				"password" : "abcd1234"
			},
			"user2" : {
				"name" : "a",
				"password" : "q1234"
			}
		},
		portalLinks : {
			Portal : {
				link1 : {
					name : 'Portal',
					path : 'irj/portal'
				},
				link2 : {
					name : 'PCD inspector',
					path : 'irj/servlet/prt/portal/prtroot/com.sap.portal.pcd.admintools.pcd_inspector_browser.default'
				},
				link3 : {
					name : 'Object Locking',
					path : 'irj/servlet/prt/portal/prtroot/com.sap.portal.pcd.admintools.lockadmin.default'
				},
				link4 : {
					name : 'Log Watch',
					path : 'irj/servlet/prt/portal/prtroot/com.sap.tc~ep~common~logWatch.LogWatchView'
				},
				link5 : {
					name : 'Log Viewer',
					path : 'irj/servlet/prt/portal/prtroot/com.sap.portal.runtime.admin.logviewer.default'
				},
				link6 : {
					name : 'UCD admin',
					path : '/irj/servlet/prt/portal/prtroot/com.sap.portal.pcd.admintools.ucdadmin.default'
				}
			},
			NWA : {
				link1 : {
					name : 'NWA',
					path : 'nwa'
				},
				link2 : {
					name : 'System Info',
					path : 'nwa/sysinfo'
				},
				link3 : {
					name : 'Start-Stop',
					path : 'nwa/start-stop'
				},
				link4 : {
					name : 'Application Modules',
					path : 'nwa/app-modules'
				},
				link5 : {
					name : 'Destinations',
					path : 'nwa/destinations'
				},
				link6 : {
					name : 'System Properties',
					path : '/nwa/sys-config'
				}
			},
			Other : {
				link7 : {
					name : 'SAP MMC',
					path : '',
					port : 50013
				},
				link8 : {
					name : 'PCD inspector',
					path : 'irj/servlet/prt/portal/prtroot/com.sap.portal.pcd.admintools.pcd_inspector_browser.default'
				}
			}
		}
	
	}; 
	setInitialStorage();
})();
