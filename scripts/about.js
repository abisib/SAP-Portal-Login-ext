function openAbout(){
	if($('.aboutCover').length == 0){
		var cover = $('<div class="aboutCover"></div>'),
			popDiv = $('<div class="aboutPopDiv" style="display:none"></div>'),
			title = $('<h3 class="aboutTitle">About SIN:</h3>'),
			description = $('<p class="aboutDescription">SIN comes to help you navigate between your portal machines and users also in Chrome. here are some of the features inside SIN:</p>')
			ul = $('<ul class="aboutList"></ul>'),
			li1 = $('<li class="featureItem"><b>Quick Login</b> - while you are in the portal login page, ctrl+shift+a will log you in automatically. the default user details are "administrator/abcd1234". you can change the user in the settings page.</li>'),
			li2 = $('<li class="featureItem"><b>Quick Links</b> - a click on a quick link will change the path of the current URL and will navigate to the selected link. the quick links are relative to the currently opened portal.</li>'),
			li3 = $('<li class="featureItem"><b>Portals</b> - SIN will remember every portal machine that you used. every new machine will be added to the top of the list. the maximum number of machines is 30. when you get to 30 machines, the last portal will be removed when you add a new one. every time you open a machine, it will move to the top of the list.</li>'),
			li4 = $('<li class="featureItem"><b>Users</b> - SIN will remember every user that you used, and will save it under the machine that you logged in to. hovering over a machine, will open the available users for that machine. note - the quick login is a global user.</li>'),
			li5 = $('<li class="featureItem"><b>Actions</b> - SIN can also clear your browser cache and cookies. when you click on of the actions, the relevant browsing data will be deleted. note - SIN will delete only one day old browsing data.</li>'),
			created = $('<p class="created">Created by Itamar Segev.</p>');
		ul.append(li1, li2, li3, li4, li5);
		popDiv.append(title, description, ul, created);
		cover.append(popDiv);
		$('body').append(cover);
		popDiv.fadeIn();
		cover.bind('click', function(){
			$('.aboutCover').fadeOut();
		});
	}else {
		$('.aboutPopDiv').fadeIn();
		$('.aboutCover').show();
	}
	
}
