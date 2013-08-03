SAP-Portal-Login-ext
====================
Overview
=========
this is a Chrome extension project that saves your login credentials for your SAP NetWeaver portal login pages.
in case you work as a SAP Portal developer or an administrator, usually you will have a landscape with several SAP NetWeaver Portal machines.

usually you will also have more than one user you need to login with.
and of course, since you are a hard working employee you do countless logins to each of your machines.

this is why an extension that can remember all of your machines and user credentials can be very useful.

Quick Login - while you are in the portal login page, ctrl+shift+a will log you in automatically. the default user details are "administrator/abcd1234". you can change the user in the settings page.
Quick Links - a click on a quick link will change the path of the current URL and will navigate to the selected link. the quick links are relative to the currently opened portal.
Portals - SIN will remember every portal machine that you used. every new machine will be added to the top of the list. the maximum number of machines is 30. when you get to 30 machines, the last portal will be removed when you add a new one. every time you open a machine, it will move to the top of the list.
Users - SIN will remember every user that you used, and will save it under the machine that you logged in to. hovering over a machine, will open the available users for that machine. note - the quick login is a global user.
Actions - SIN can also clear your browser cache and cookies. when you click on of the actions, the relevant browsing data will be deleted. note - SIN will delete only one day old browsing data.