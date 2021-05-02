Switch ConDragon RPG in English(temp solution)

## Disclamer 
The manipulation is to use at you own risk. 
You really need to confirm and understand what you are doing.
Never trust Javascript modification.

To be able to have everything translated, you need to do it before getting your wallet connected (it's the time where the starting app is frozen).
But you can do it anytime (only the main screen won't be translated).

## Informations
The modification will consist of 2 things :
 - Set the language of the application
 - Set the json for the translation inside the application

## Javascript Script
Complete script
```
JsonHelper.prototype.getlanguageTxt = function (id, strtype = 0) {
    if (strtype > 0) {
        return id;
    }
    for (var index = 0; index < this.language.length; index++) {
        var element = this.language[index];
        if (id == element.id) {
            return element['en'];
        }
    }
    return "策划没有配---> id" + id;
}

localStorage.languageType = "en"
jsonHp.language = await (await fetch('https://raw.githubusercontent.com/lagonnebula/ConDragonEN/main/public/jsonHp.language.json')).json();

```

## Chrome 'Detailed Instruction'

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
*This will change the prefered language setting on the app, if you go like this, the game will have some word translated
But majority of things will be blank.*

Since recent update. The dev locked the default translation function to chinese so this step is needed now:
```
JsonHelper.prototype.getlanguageTxt = function (id, strtype = 0) {
    if (strtype > 0) {
        return id;
    }
    for (var index = 0; index < this.language.length; index++) {
        var element = this.language[index];
        if (id == element.id) {
            return element['en'];
        }
    }
    return "策划没有配---> id" + id;
}
```

*This rewrite the function that read the data to choose the language text to display*


After that type in the console : 

```
jsonHp.language = <Copy and Paste the content of the file>
```
Now you can login and continue to play.

## Buy me a coffee !

If you want to buy me a coffee, it's a pleasure ! 
Conflux : cfx:aak534b75axaj6fp3hssznkusuvxh65nwusvkd5z49

