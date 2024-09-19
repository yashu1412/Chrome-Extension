chrome.devtools.panels.create("Cyby 2.0", "", "devtools.html", (panel) => {
    panel.onShown.addListener(() => {
      console.log("Cyby 2.0 DevTools panel is open");
      
      // Here you can add more functionality, such as listening to network events
      // and displaying detailed logs or secrets.
    });
  });
  