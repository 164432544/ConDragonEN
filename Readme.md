Switch ConDragon RPG in English(temp solution)

##Disclamer 
The manipulation is to use at you own risk. 
You really need to confirm and understand what you are doing.
Never trust Javascript modification.

To be able to have everything translated, you need to do it before getting your wallet connected (it's the time where the starting app is frozen).
But you can do it anytime (only the main screen won't be translated).

##Informations
The modification will consist of 2 things :
-Set the language of the application
-Set the json for the translation inside the application

## Chrome

Get the new version of the translation: 
``` 
https://github.com/lagonnebula/ConDragonEN/blob/main/public/jsonHp.language.json
``` 
And keep it for later

Open the game
Open the console : Ctrl Shit I on chrome

In the console type 
``` 
localstorage.languageType = "en"
```

--This will change the prefered language setting on the app, if you go like this, the game will have some word translated
But majority of things will be blank.--

After that type in the console : 

```
jsonHp.language = <Copy and Paste the content of the file>
```
Now you can login and continue to play.


## Javascript Script
Complete script
```
localStorage.languageType = "en"

const response = await fetch('https://raw.githubusercontent.com/lagonnebula/ConDragonEN/main/public/jsonHp.language.json')
const data = await response.json();
jsonHp.language = data;


```