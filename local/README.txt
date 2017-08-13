The game loads the spritesheets through AJAX, and some browsers block all AJAX calls when loading an HTML file directly from the file system.
Therefore, if possible it's better to serve the files in this folder from a web server.

If python 2 is installed, the game can be started by running the file 'server.py' and accessing localhost:8001 from the browser.

$ python server.py

Firefox and Safari have been tested to start the game when loading the file 'index.html' directly from the file system without any issues.
Chrome and Opera do NOT run the game properly when loading 'index.html' from the file system.
